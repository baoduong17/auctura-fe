// routes/index.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from '@/layouts/RootLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

// Auth Pages
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

// Marketplace
import { MarketplacePage } from '@/pages/marketplace/MarketplacePage';

// Items
import { ItemDetailPage } from '@/pages/items/ItemDetailPage';
import { CreateItemPage } from '@/pages/items/CreateItemPage';
import { EditItemPage } from '@/pages/items/EditItemPage';

// Dashboard
import { MyItemsPage } from '@/pages/dashboard/MyItemsPage';
import { MyBidsPage } from '@/pages/dashboard/MyBidsPage';
import { WinningBidsPage } from '@/pages/dashboard/WinningBidsPage';
import { RevenuePage } from '@/pages/dashboard/RevenuePage';

// Profile
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/profile/SettingsPage';

// Other
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/marketplace" replace />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'marketplace',
        element: <MarketplacePage />,
      },
      {
        path: 'items/create',
        element: (
          <ProtectedRoute>
            <CreateItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'items/:id',
        element: <ItemDetailPage />,
      },
      {
        path: 'items/:id/edit',
        element: (
          <ProtectedRoute>
            <EditItemPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/my-items" replace />,
          },
          {
            path: 'my-items',
            element: <MyItemsPage />,
          },
          {
            path: 'my-bids',
            element: <MyBidsPage />,
          },
          {
            path: 'winning-bids',
            element: <WinningBidsPage />,
          },
          {
            path: 'revenue',
            element: <RevenuePage />,
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
