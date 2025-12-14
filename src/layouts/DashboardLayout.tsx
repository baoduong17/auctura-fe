// layouts/DashboardLayout.tsx
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  Gavel,
  Trophy,
  DollarSign,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

export function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Package, label: 'My Items', href: '/dashboard/my-items' },
    { icon: Gavel, label: 'My Bids', href: '/dashboard/my-bids' },
    { icon: Trophy, label: 'Winning Bids', href: '/dashboard/winning-bids' },
    { icon: DollarSign, label: 'Revenue', href: '/dashboard/revenue' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#242424] border-r border-gray-800">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-[#256af4]">Auction Platform</h1>
          </div>

          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 px-4 py-3">
              <User className="h-5 w-5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <Link to="/profile" className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex-1"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
