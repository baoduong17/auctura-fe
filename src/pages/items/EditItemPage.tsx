// pages/items/EditItemPage.tsx
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useItem, useUpdateItem } from '@/hooks/useItems';
import { createItemSchema } from '@/schemas/item.schemas';
import type { CreateItemForm } from '@/types/item';
import { ItemDetailSkeleton, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageHeader } from '@/components/layout';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { parseDate } from '@/utils/formatters';

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
    control,
  } = useForm<CreateItemForm>({
    resolver: zodResolver(createItemSchema),
  });

  // Pre-fill form when item data loads
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        startingPrice: item.startingPrice,
        startTime: parseDate(item.startTime),
        endTime: parseDate(item.endTime),
      });
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

  if (isLoading) return <ItemDetailSkeleton />;

  if (error || !item) return <ErrorState message="Failed to load item" />;

  // Check if item has bids (cannot edit if has bids)
  if ((item.totalBids ?? 0) > 0) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <div className="container mx-auto py-8 px-4 max-w-2xl">
          <Alert className="border-yellow-600 bg-yellow-950/20">
            <AlertTitle className="text-yellow-500 text-xl mb-2">Cannot Edit Item</AlertTitle>
            <AlertDescription className="text-gray-300 mb-4">
              This item already has {item.totalBids} bid(s) and cannot be edited.
            </AlertDescription>
            <Button onClick={() => navigate('/dashboard/my-items')} variant="outline" className="mt-2">
              Back to My Items
            </Button>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header with Breadcrumb */}
        <PageHeader
          title={`Edit: ${item.name}`}
          description="Update your item details below"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/my-items' },
            { label: 'My Items', href: '/dashboard/my-items' },
            { label: item.name, href: `/items/${id}` },
            { label: 'Edit' },
          ]}
          icon={Edit}
          iconColor="text-[#256af4]"
          className="mb-6"
        />
        
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
                  <Controller
                    name="startTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start date and time"
                        disabled={hasBids}
                      />
                    )}
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
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) => (
                      <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select end date and time"
                        disabled={hasBids}
                      />
                    )}
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

