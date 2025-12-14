// schemas/item.schemas.ts
import { z } from 'zod';

export const createItemSchema = z.object({
    name: z.string().min(1, 'Item name is required').max(100),
    description: z.string().min(1, 'Description is required'),
    startingPrice: z
        .number({ required_error: 'Starting price is required' })
        .positive('Starting price must be positive'),
    startTime: z.date({ required_error: 'Start time is required' }),
    endTime: z.date({ required_error: 'End time is required' }),
}).refine(data => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime'],
});

export const updateItemSchema = createItemSchema.partial();

export const itemFiltersSchema = z.object({
    name: z.string().optional(),
    startingPriceFrom: z.number().positive().optional(),
    startingPriceTo: z.number().positive().optional(),
});

export type CreateItemFormValues = z.infer<typeof createItemSchema>;
export type UpdateItemFormValues = z.infer<typeof updateItemSchema>;
export type ItemFiltersValues = z.infer<typeof itemFiltersSchema>;
