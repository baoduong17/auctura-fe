// types/item.ts
export interface Item {
    id: string;
    name: string;
    description: string;
    startingPrice: number;
    currentBid?: number;
    totalBids?: number;
    startTime: string;
    endTime: string;
    ownerId: string;
    ownerName?: string;
    ownerFirstName?: string;
    ownerLastName?: string;
    highestBidderId?: string;
    highestBidderFirstName?: string;
    highestBidderLastName?: string;
    createdAt?: string;
    updatedAt?: string;
    isLocked?: boolean;
}

export interface CreateItemForm {
    name: string;
    description: string;
    startingPrice: number;
    startTime: Date;
    endTime: Date;
}

export interface UpdateItemForm {
    name?: string;
    description?: string;
    startingPrice?: number;
    startTime?: Date;
    endTime?: Date;
}

export interface ItemFilters {
    name?: string;
    ownerName?: string;
    startTime?: string;
    endTime?: string;
    startingPriceFrom?: number;
    startingPriceTo?: number;
}

export interface CreateItemRequestDto {
    name: string;
    description: string;
    startingPrice: number;
    startTime: string;
    endTime: string;
}

export interface UpdateItemRequestDto {
    name?: string;
    description?: string;
    startingPrice?: number;
    startTime?: string;
    endTime?: string;
}

export interface ItemResponseDto {
    id: string;
    message: string;
}

export type GetNonBiddedItemsResponseDto = Item[];

export interface GetItemByIdResponseDto extends Item { }

export type GetItemsByOwnerIdResponseDto = Item[];
