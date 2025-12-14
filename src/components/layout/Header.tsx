// components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Gavel, LayoutDashboard, User, LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuthStore();

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <header className="bg-[#242424] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#256af4] transition">
            <Gavel className="h-6 w-6 text-[#256af4]" />
            <span className="text-xl font-bold">AuctionHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/marketplace"
              className="text-gray-300 hover:text-white transition"
            >
              Marketplace
            </Link>
            {user && (
              <Link
                to="/dashboard/my-items"
                className="text-gray-300 hover:text-white transition"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#256af4] text-white">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-white">
                      {user.firstName} {user.lastName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#242424] border-gray-800 w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard/my-items">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-white">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-[#256af4] hover:bg-[#1e5dd9] text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
