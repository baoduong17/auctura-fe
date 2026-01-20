import { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  Package,
  ShoppingCart,
  Award,
} from "lucide-react";
import {
  StatCard,
  DateRangeFilter,
  TrendLineChart,
  SellingBarChart,
  BuyingBarChart,
  SellingAreaChart,
  BuyingAreaChart,
  BiddingEfficiencyChart,
} from "@/components/stats";
import { useStatistics } from "@/hooks/useStatistics";
import type { MonthlyStatistics } from "@/types/statistics";

function transformMonthlyData(data: MonthlyStatistics[] = []) {
  if (!data || data.length === 0) {
    return {
      sellingData: [],
      buyingData: [],
      trendData: [],
    };
  }

  return {
    sellingData: data.map((d) => ({
      month: d.month.substring(5),
      revenue: d.revenue,
      itemsSold: d.itemSold,
    })),
    buyingData: data.map((d) => ({
      month: d.month.substring(5),
      spending: d.spending,
      itemsWon: d.itemsWon,
      bidsPlaced: d.bidsPlaced,
    })),
    trendData: data.map((d) => ({
      month: d.month.substring(5),
      selling: d.revenue,
      buying: d.spending,
      profit: d.revenue - d.spending,
    })),
  };
}

export function StatisticPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const {
    data: statistics,
    isLoading,
    error,
    refetch,
  } = useStatistics(
    {
      startDate: startDate?.toISOString().split("T")[0] || "",
      endDate: endDate?.toISOString().split("T")[0] || "",
    },
    !!startDate && !!endDate,
  );

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      refetch();
    }
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading statistics: {error.message}</div>;
  }

  if (!statistics) {
    return (
      <div className="space-y-6">
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
        <div className="text-center text-primary py-12">
          Select a date range to view statistics
        </div>
      </div>
    );
  }

  const { sellingData, buyingData, trendData } = transformMonthlyData(
    statistics?.monthlySalesReports || [],
  );

  return (
    <div className="space-y-6">
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onApplyFilter={handleApplyFilter}
        onClearFilter={handleClearFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${(statistics?.totalRevenue || 0).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-green-500"
          iconBgColor="bg-green-500/10"
          valueColor="text-green-500"
        />
        <StatCard
          title="Items Sold"
          value={statistics?.totalItemsSold || 0}
          icon={Package}
          iconColor="text-blue-500"
          iconBgColor="bg-blue-500/10"
        />
        <StatCard
          title="Total Spending"
          value={`$${(statistics?.totalSpending || 0).toLocaleString()}`}
          icon={ShoppingCart}
          iconColor="text-red-500"
          iconBgColor="bg-red-500/10"
          valueColor="text-red-500"
        />
        <StatCard
          title="Items Won"
          value={statistics?.totalItemsWon || 0}
          icon={Award}
          iconColor="text-purple-500"
          iconBgColor="bg-purple-500/10"
        />
        <StatCard
          title="Net Profit"
          value={`$${((statistics?.totalRevenue || 0) - (statistics?.totalSpending || 0)).toLocaleString()}`}
          icon={TrendingUp}
          iconColor="text-yellow-500"
          iconBgColor="bg-yellow-500/10"
          valueColor="text-green-400"
        />
      </div>

      <TrendLineChart data={trendData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SellingBarChart data={sellingData} />
        <BuyingBarChart data={buyingData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SellingAreaChart data={sellingData} />
        <BuyingAreaChart data={buyingData} />
      </div>

      <BiddingEfficiencyChart data={buyingData} />
    </div>
  );
}
