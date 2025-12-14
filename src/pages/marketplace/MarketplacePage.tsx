// pages/marketplace/MarketplacePage.tsx
import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { ItemCard } from '@/components/items/ItemCard';
import { LoadingCard } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Filter, X, Package } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export function MarketplacePage() {
  const [nameFilter, setNameFilter] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedName = useDebounce(nameFilter, 500);

  const filters = {
    name: debouncedName || undefined,
    startingPriceFrom: priceFrom ? Number(priceFrom) : undefined,
    startingPriceTo: priceTo ? Number(priceTo) : undefined,
  };

  const { data, isLoading, error, refetch } = useItems(filters);

  const clearFilters = () => {
    setNameFilter('');
    setPriceFrom('');
    setPriceTo('');
  };

  const hasActiveFilters = nameFilter || priceFrom || priceTo;

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-400">Browse and bid on available items</p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-10 bg-[#242424] border-gray-700 text-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-[#256af4] text-white' : ''}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-[#242424] border border-gray-800 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceFrom" className="text-gray-200">
                    Min Price
                  </Label>
                  <Input
                    id="priceFrom"
                    type="number"
                    placeholder="0"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceTo" className="text-gray-200">
                    Max Price
                  </Label>
                  <Input
                    id="priceTo"
                    type="number"
                    placeholder="10000"
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                </div>

                <div className="flex items-end">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading && <LoadingCard />}

        {error && (
          <ErrorState
            title="Failed to load items"
            message={
              (error as any).response?.status === 403
                ? "You need to login to view marketplace items."
                : "Could not fetch marketplace items. Please try again."
            }
            onRetry={() => refetch()}
            showHomeButton={(error as any).response?.status === 403}
          />
        )}

        {!isLoading && !error && data && (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-400">
              {data.length} {data.length === 1 ? 'item' : 'items'} found
            </div>

            {/* Items Grid */}
            {data.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Package}
                title="No items found"
                description="Try adjusting your search or filters to find what you're looking for."
                actionLabel="Clear Filters"
                onAction={clearFilters}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
