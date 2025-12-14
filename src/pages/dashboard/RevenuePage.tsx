// pages/dashboard/RevenuePage.tsx
import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRevenue } from '@/hooks/useItems';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Package } from 'lucide-react';

export function RevenuePage() {
  const { user } = useAuthStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading, error, refetch } = useRevenue(
    user?.id || '',
    startDate || '',
    endDate || ''
  );

  const handleApplyFilter = () => {
    refetch();
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  if (isLoading) return <LoadingCard />;

  if (error) {
    return (
      <ErrorState
        title="Failed to load revenue data"
        message="Could not fetch your revenue information. Please try again."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Revenue Dashboard</h1>
        <p className="text-gray-400 mt-1">Track your earnings from sold items</p>
      </div>

      {/* Date Range Filter */}
      <Card className="bg-[#242424] border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg">Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-gray-200">
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-gray-200">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-[#1a1a1a] border-gray-700 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilter}
                className="bg-[#256af4] hover:bg-[#1e5dd9]"
              >
                Apply Filter
              </Button>
              {(startDate || endDate) && (
                <Button variant="outline" onClick={handleClearFilter}>
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Stats */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#242424] border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold mt-2">
                      <PriceDisplay
                        amount={data.totalRevenue}
                        showIcon={false}
                        size="lg"
                      />
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#242424] border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Items Sold</p>
                    <p className="text-3xl font-bold mt-2">{data.itemsSold}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Package className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#242424] border-gray-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Average Sale Price</p>
                    <p className="text-3xl font-bold mt-2">
                      <PriceDisplay
                        amount={data.itemsSold > 0 ? data.totalRevenue / data.itemsSold : 0}
                        showIcon={false}
                        size="lg"
                      />
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Note: API only returns summary, not individual sold items */}
          {data.itemsSold > 0 ? (
            <Card className="bg-[#242424] border-gray-800">
              <CardHeader>
                <CardTitle>Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Items Sold:</span>
                    <span className="text-lg font-semibold">{data.itemsSold}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Revenue:</span>
                    <PriceDisplay amount={data.totalRevenue} size="lg" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Date Range:</span>
                    <span className="text-sm text-gray-300">
                      {data.startDate} - {data.endDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <EmptyState
              icon={Package}
              title="No sold items in this period"
              description="Adjust your date range or wait for auctions to end"
            />
          )}
        </>
      )}
    </div>
  );
}
