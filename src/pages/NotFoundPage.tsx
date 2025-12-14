// pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
      <div className="text-center max-w-md px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#256af4] mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button className="bg-[#256af4] hover:bg-[#1e5dd9] w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Link to="/marketplace" className="text-[#256af4] hover:underline">
              Marketplace
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/dashboard/my-items" className="text-[#256af4] hover:underline">
              Dashboard
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/login" className="text-[#256af4] hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
