// utils/error-handler.ts
import { AxiosError } from 'axios';
import { toast } from 'sonner';

export interface ApiError {
    message: string;
    statusCode?: number;
    errors?: Record<string, string[]>;
}

export function handleApiError(error: unknown): void {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;

        if (apiError?.message) {
            toast.error(apiError.message);
        } else if (error.message) {
            toast.error(error.message);
        } else {
            toast.error('An unexpected error occurred');
        }
    } else if (error instanceof Error) {
        toast.error(error.message);
    } else {
        toast.error('An unexpected error occurred');
    }
}

export function getErrorMessage(error: unknown): string {
    if (error instanceof AxiosError) {
        const apiError = error.response?.data as ApiError;
        return apiError?.message || error.message || 'An unexpected error occurred';
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}
