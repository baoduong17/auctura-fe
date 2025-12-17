// layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

export function RootLayout() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    // Initialize tokens from localStorage
    initialize();
    // Then check auth status
    checkAuth();
  }, [checkAuth, initialize]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 bg-[#1a1a1a] px-4">
          <SidebarTrigger />
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
