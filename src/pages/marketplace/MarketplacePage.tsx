import { useState } from "react";
import { useItems } from "@/hooks/useItems";
import { ItemCard } from "@/components/items";
import { ItemGridSkeleton } from "@/components/ui/LoadingSpinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, X, Package, CalendarIcon } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { format } from "date-fns";

export function MarketplacePage() {
  const [nameFilter, setNameFilter] = useState("");
  const [ownerNameFilter, setOwnerNameFilter] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const debouncedName = useDebounce(nameFilter, 500);
  const debouncedOwnerName = useDebounce(ownerNameFilter, 500);

  const textFilters = [
    {
      id: "ownerName",
      label: "Owner Name",
      placeholder: "Search by owner name...",
      value: ownerNameFilter,
      onChange: setOwnerNameFilter,
    },
  ];

  const priceFilters = [
    {
      id: "priceFrom",
      label: "Min Price",
      placeholder: "0",
      value: priceFrom,
      onChange: setPriceFrom,
    },
    {
      id: "priceTo",
      label: "Max Price",
      placeholder: "10000",
      value: priceTo,
      onChange: setPriceTo,
    },
  ];

  const dateFilters = [
    {
      label: "Auction Start Date",
      value: startDate,
      onChange: setStartDate,
    },
    {
      label: "Auction End Date",
      value: endDate,
      onChange: setEndDate,
    },
  ];

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
    setNameFilter("");
    setOwnerNameFilter("");
    setPriceFrom("");
    setPriceTo("");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const hasActiveFilters =
    nameFilter ||
    ownerNameFilter ||
    priceFrom ||
    priceTo ||
    startDate ||
    endDate;

  return (
    <>
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="pl-10 border-primary text-primary"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="bg-card text-primary hover:bg-card-foreground hover:text-primary-foreground"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="border border-gray-800 rounded-lg p-6 bg-card text-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {textFilters.map((filter) => (
                <div key={filter.id} className="space-y-2">
                  <Label htmlFor={filter.id}>{filter.label}</Label>
                  <Input
                    id={filter.id}
                    placeholder={filter.placeholder}
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                    className="border-primary text-primary"
                  />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {priceFilters.map((filter) => (
                  <div key={filter.id} className="space-y-2">
                    <Label htmlFor={filter.id}>{filter.label}</Label>
                    <Input
                      id={filter.id}
                      type="number"
                      placeholder={filter.placeholder}
                      value={filter.value}
                      onChange={(e) => filter.onChange(e.target.value)}
                      className="border-primary text-primary"
                    />
                  </div>
                ))}
              </div>

              {dateFilters.map((filter, index) => (
                <div key={index} className="space-y-2">
                  <Label>{filter.label}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filter.value ? (
                          format(filter.value, "PPP")
                        ) : (
                          <span className="text-primary">Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filter.value}
                        onSelect={filter.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>

            {hasActiveFilters && (
              <div className="mt-6">
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="w-full text-primary bg-card hover:bg-card-foreground hover:text-primary-foreground"
                >
                  <X className="h-2 w-2 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

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
          <div className="mb-4 text-sm text-gray-400">
            {data.length} {data.length === 1 ? "item" : "items"} found
          </div>

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
            />
          )}
        </>
      )}
    </>
  );
}
