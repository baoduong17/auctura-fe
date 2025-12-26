export interface GetPresignedUrlRequest {
    fileName: string;
    bucket: string;
}

export interface GetPresignedUrlResponse {
    presignedUrl: string;
    fileName: string;
    userId: string;
    expiredAt: string;
}

export interface CreateMediaRequest {
    bucket: string;
    fileName: string;
}

export interface CreateMediaResponse {
    id: string;
    fileUrl: string;
    createdAt: string;
    updatedAt: string;
}

export type MediaBucket = 'avatar' | 'item' | 'items' | 'document';
