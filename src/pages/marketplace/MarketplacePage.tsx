// pages/marketplace/MarketplacePage.tsx
import { useState } from 'react';
import { useItems } from '@/hooks/useItems';
import { ItemCard } from '@/components/items';
import { ItemGridSkeleton } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageHeader } from '@/components/layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X, Package, CalendarIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';
import { COLORS } from '@/constants/theme';

export function MarketplacePage() {
  const [nameFilter, setNameFilter] = useState('');
  const [ownerNameFilter, setOwnerNameFilter] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedOwnerName = useDebounce(ownerNameFilter, 500);

  const filters = {
    name: debouncedName || undefined,
    ownerName: debouncedOwnerName || undefined,
    startingPriceFrom: priceFrom ? Number(priceFrom) : undefined,
    startingPriceTo: priceTo ? Number(priceTo) : undefined,
    startTime: startDate ? startDate.toISOString() : undefined,
    endTime: endDate ? endDate.toISOString() : undefined,
  };

  const { data, isLoading, error, refetch } = useItems(filters);

  const clearFilters = () => {
    setNameFilter('');
    setOwnerNameFilter('');
    setPriceFrom('');
    setPriceTo('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const hasActiveFilters = nameFilter || ownerNameFilter || priceFrom || priceTo || startDate || endDate;

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: COLORS.background }}>
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <PageHeader
          title="Marketplace"
          description="Browse and bid on available items"
          breadcrumbs={[
            { label: 'Marketplace' },
          ]}
          icon={Package}
          iconColor="text-[#256af4]"
          className="mb-8"
        />

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
                className="pl-10 border-gray-700 text-white"
                style={{ backgroundColor: COLORS.card }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'text-white' : ''}
              style={showFilters ? { backgroundColor: COLORS.primary } : {}}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border border-gray-800 rounded-lg p-6" style={{ backgroundColor: COLORS.card }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Owner Name Filter */}
                <div className="space-y-2">
                  <Label htmlFor="ownerName" className="text-gray-200">
                    Owner Name
                  </Label>
                  <Input
                    id="ownerName"
                    placeholder="Search by owner name..."
                    value={ownerNameFilter}
                    onChange={(e) => setOwnerNameFilter(e.target.value)}
                    className="border-gray-700 text-white"
                    style={{ backgroundColor: COLORS.background }}
                  />
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4">
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
                      className="border-gray-700 text-white"
                      style={{ backgroundColor: COLORS.background }}
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
                      className="border-gray-700 text-white"
                      style={{ backgroundColor: COLORS.background }}
                    />
                  </div>
                </div>

                {/* Start Date Filter */}
                <div className="space-y-2">
                  <Label className="text-gray-200">Auction Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a] hover:text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        className="bg-[#1a1a1a] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date Filter */}
                <div className="space-y-2">
                  <Label className="text-gray-200">Auction End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-[#1a1a1a] border-gray-700 text-white hover:bg-[#2a2a2a] hover:text-white"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'PPP') : <span className="text-gray-400">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#1a1a1a] border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        className="bg-[#1a1a1a] text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <div className="mt-6">
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading && <ItemGridSkeleton count={8} />}

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
