import { z } from 'zod';

export const createItemSchema = z.object({
    name: z.string().min(1, 'Item name is required').max(100),
    description: z.string().min(1, 'Description is required'),
    startingPrice: z
        .number({ message: 'Starting price is required' })
        .positive('Starting price must be positive'),
    startTime: z.date({ message: 'Start time is required' }),
    endTime: z.date({ message: 'End time is required' }),
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
