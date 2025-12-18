// pages/items/CreateItemPage.tsx
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateItem } from '@/hooks/useItems';
import { createItemSchema } from '@/schemas/item.schemas';
import type { CreateItemForm } from '@/types/item';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DateTimePicker } from '@/components/ui/datetime-picker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CreateItemPage() {
  const navigate = useNavigate();
  const { mutate: createItem, isPending } = useCreateItem();

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
    };

    createItem(requestData, {
      onSuccess: () => {
        navigate('/dashboard/my-items');
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto py-8 px-4">
        {/* Header with Breadcrumb */}
        <PageHeader
          title="Create New Item"
          description="Fill in the details below to list your item for auction"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard/my-items' },
            { label: 'My Items', href: '/dashboard/my-items' },
            { label: 'Create Item' },
          ]}
          icon={Plus}
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
              <CardTitle className="text-2xl">Create New Auction Item</CardTitle>
              <CardDescription>
                Fill in the details below to list your item for auction
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
                        minDate={new Date()}
                      />
                    )}
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-sm">{errors.startTime.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Specify when the auction should start
                  </p>
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
                        minDate={new Date()}
                      />
                    )}
                  />
                  {errors.endTime && (
                    <p className="text-red-500 text-sm">{errors.endTime.message}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    Must be after the start time
                  </p>
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
