// layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
