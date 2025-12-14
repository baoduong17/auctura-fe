// pages/items/EditItemPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItem, useUpdateItem } from '@/hooks/useItems';
import { createItemSchema } from '@/schemas/item.schemas';
import type { CreateItemForm } from '@/types/item';
import { LoadingPage, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorPage } from '@/components/ui/ErrorState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { format } from 'date-fns';

export function EditItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: item, isLoading, error } = useItem(id!);
  const { mutate: updateItem, isPending } = useUpdateItem();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
  });

  // Pre-fill form when item data loads
  useEffect(() => {
    if (item) {
      // Convert ISO string to datetime-local format
      const startTimeLocal = format(new Date(item.startTime), "yyyy-MM-dd'T'HH:mm");
      const endTimeLocal = format(new Date(item.endTime), "yyyy-MM-dd'T'HH:mm");

      reset({
        name: item.name,
        description: item.description,
        startingPrice: item.startingPrice,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
      });

      // Manually set datetime-local values
      const startTimeInput = document.getElementById('startTime') as HTMLInputElement;
      const endTimeInput = document.getElementById('endTime') as HTMLInputElement;
      if (startTimeInput) startTimeInput.value = startTimeLocal;
      if (endTimeInput) endTimeInput.value = endTimeLocal;
    }
  }, [item, reset]);

  const onSubmit = (data: CreateItemForm) => {
    if (!id) return;

    const requestData = {
      name: data.name,
      description: data.description,
      startingPrice: data.startingPrice,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    };

    updateItem(
      { id, data: requestData },
      {
        onSuccess: () => {
          navigate('/dashboard/my-items');
        },
      }
    );
  };

  if (isLoading) return <LoadingPage />;

  if (error || !item) return <ErrorPage />;

  // Check if item has bids (cannot edit if has bids)
  if ((item.totalBids ?? 0) > 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-yellow-500 text-xl mb-2">Cannot Edit Item</p>
          <p className="text-gray-400 mb-4">
            This item already has {item.totalBids} bid(s) and cannot be edited.
          </p>
          <Button onClick={() => navigate('/dashboard/my-items')}>Back to My Items</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <Link to="/dashboard/my-items">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Items
          </Button>
        </Link>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-[#242424] border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl">Edit Auction Item</CardTitle>
              <CardDescription>
                Update the details of your auction item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-200">
                    Item Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter item name"
                    {...register('name')}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-200">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your item in detail"
                    rows={4}
                    {...register('description')}
                    className="bg-[#1a1a1a] border-gray-700 text-white resize-none"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Starting Price */}
                <div className="space-y-2">
                  <Label htmlFor="startingPrice" className="text-gray-200">
                    Starting Price (USD) *
                  </Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...register('startingPrice', { valueAsNumber: true })}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                  {errors.startingPrice && (
                    <p className="text-red-500 text-sm">{errors.startingPrice.message}</p>
                  )}
                </div>

                {/* Start Time */}
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-gray-200">
                    Auction Start Time *
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    {...register('startTime', {
                      setValueAs: (value) => value ? new Date(value) : undefined,
                    })}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-sm">{errors.startTime.message}</p>
                  )}
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-gray-200">
                    Auction End Time *
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    {...register('endTime', {
                      setValueAs: (value) => value ? new Date(value) : undefined,
                    })}
                    className="bg-[#1a1a1a] border-gray-700 text-white"
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm">{errors.endTime.message}</p>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#256af4] hover:bg-[#1e5dd9]"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dashboard/my-items')}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

