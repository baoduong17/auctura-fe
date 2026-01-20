// layouts/RootLayout.tsx
import { Outlet, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const routeBreadcrumbs: Record<string, { label: string; path?: string }[]> = {
  "/marketplace": [{ label: "Marketplace" }],
  "/items/create": [
    { label: "Marketplace", path: "/marketplace" },
    { label: "Create Item" },
  ],
  "/dashboard/my-items": [{ label: "Dashboard" }, { label: "My Items" }],
  "/dashboard/my-bids": [{ label: "Dashboard" }, { label: "My Bids" }],
  "/dashboard/winning-bids": [
    { label: "Dashboard" },
    { label: "Winning Bids" },
  ],
  "/dashboard/statistics": [{ label: "Dashboard" }, { label: "Statistics" }],
  "/profile": [{ label: "Profile" }],
  "/settings": [{ label: "Settings" }],
};

export function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initialize = useAuthStore((state) => state.initialize);
  const location = useLocation();

  useEffect(() => {
    initialize();
    checkAuth();
  }, [checkAuth, initialize]);

  const breadcrumbs = routeBreadcrumbs[location.pathname] || [];

  let dynamicBreadcrumbs = breadcrumbs;
  if (
    location.pathname.startsWith("/items/") &&
    location.pathname !== "/items/create"
  ) {
    const itemId = location.pathname.split("/")[2];
    if (location.pathname.endsWith("/edit")) {
      dynamicBreadcrumbs = [
        { label: "Marketplace", path: "/marketplace" },
        { label: "Item Details", path: `/items/${itemId}` },
        { label: "Edit Item" },
      ];
    } else {
      dynamicBreadcrumbs = [
        { label: "Marketplace", path: "/marketplace" },
        { label: "Item Details" },
      ];
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 px-4">
          <SidebarTrigger />

          {dynamicBreadcrumbs.length > 0 && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/marketplace"
                      className="flex items-center gap-1.5 hover:text-white"
                    >
                      <Home className="h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>

                {dynamicBreadcrumbs.map((segment, index) => {
                  const isLast = index === dynamicBreadcrumbs.length - 1;

                  return (
                    <div key={index} className="flex items-center gap-1.5">
                      <BreadcrumbSeparator className="text-gray-500" />
                      <BreadcrumbItem>
                        {isLast || !segment.path ? (
                          <BreadcrumbPage className="text-white">
                            {segment.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link
                              to={segment.path}
                              className="hover:text-white"
                            >
                              {segment.label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                    </div>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
