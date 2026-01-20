import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface DateRangeFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onApplyFilter: () => void;
  onClearFilter: () => void;
}

export function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApplyFilter,
  onClearFilter,
}: DateRangeFilterProps) {
  return (
    <Card className="bg-card border">
      <CardHeader>
        <CardTitle className="text-lg">Filter by Date Range</CardTitle>
        <CardDescription>
          Select a date range to view statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-primary">
              Start Date
            </Label>
            <DatePicker
              value={startDate}
              onChange={onStartDateChange}
              placeholder="Select start date"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-primary">
              End Date
            </Label>
            <DatePicker
              value={endDate}
              onChange={onEndDateChange}
              placeholder="Select end date"
              minDate={startDate}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onApplyFilter}
              className="bg-primary hover:bg-primary/80"
            >
              Apply Filter
            </Button>
            {(startDate || endDate) && (
              <Button variant="outline" onClick={onClearFilter}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
