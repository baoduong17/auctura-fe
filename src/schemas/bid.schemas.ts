// schemas/bid.schemas.ts
import { z } from 'zod';

export const placeBidSchema = z.object({
    itemId: z.string().uuid('Invalid item ID'),
    price: z
        .number({ required_error: 'Bid amount is required' })
        .positive('Bid amount must be positive'),
});

export type PlaceBidFormValues = z.infer<typeof placeBidSchema>;
