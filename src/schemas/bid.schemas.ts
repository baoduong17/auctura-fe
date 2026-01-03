// schemas/bid.schemas.ts
import { z } from 'zod';

export const placeBidSchema = z.object({
    itemId: z.string().uuid('Invalid item ID'),
    price: z
        .number({ message: 'Bid amount is required' })
        .positive('Bid amount must be positive'),
});
