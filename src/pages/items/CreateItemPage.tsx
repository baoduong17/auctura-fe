import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateItem } from "@/hooks/useItems";
import { createItemSchema } from "@/schemas/item.schemas";
import type { CreateItemForm } from "@/types/item";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiImageUpload } from "@/components/forms/MultiImageUpload";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export function CreateItemPage() {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateItem();
  const [mediaIds, setMediaIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
  });

  const onSubmit = (data: CreateItemForm) => {
    const requestData = {
      name: data.name,
      description: data.description,
      startingPrice: data.startingPrice,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
    };

    createItem(requestData, {
      onSuccess: () => {
        navigate("/dashboard/my-items");
      },
    });
  };

  return (
    <>
      <Link to="/dashboard/my-items">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to My Items
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto">
        <Card className="bg-background text-primary border">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Auction Item</CardTitle>
            <CardDescription>
              Fill in the details below to list your item for auction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <MultiImageUpload
                bucket="items"
                onImagesChange={setMediaIds}
                maxImages={10}
                label="Item Images"
              />

              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary">
                  Item Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  {...register("name")}
                  className="bg-card text-primary border"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-primary">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail"
                  rows={4}
                  {...register("description")}
                  className="bg-card text-primary border resize-none"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startingPrice" className="text-primary">
                  Starting Price (USD) *
                </Label>
                <Input
                  id="startingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...register("startingPrice", { valueAsNumber: true })}
                  className="bg-card text-primary border"
                />
                {errors.startingPrice && (
                  <p className="text-red-500 text-sm">
                    {errors.startingPrice.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime" className="text-primary">
                  Auction Start Time *
                </Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select start date and time"
                      minDate={new Date()}
                      className="bg-card text-primary border hover:bg-card-foreground hover:text-primary-foreground"
                    />
                  )}
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm">
                    {errors.startTime.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Specify when the auction should start
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime" className="text-primary">
                  Auction End Time *
                </Label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select end date and time"
                      minDate={new Date()}
                      className="bg-card text-primary border hover:bg-card-foreground hover:text-primary-foreground"
                    />
                  )}
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm">
                    {errors.endTime.message}
                  </p>
                )}
                <p className="text-xs text-gray-400">
                  Must be after the start time
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/80"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Item
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard/my-items")}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
