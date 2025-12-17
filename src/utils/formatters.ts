// utils/formatters.ts
import { format, differenceInSeconds, parseISO } from 'date-fns';

/**
 * Parse date input to Date object
 * Handles: ISO strings, Unix timestamps (numbers), Date objects
 */
export function parseDate(date: string | Date | number): Date {
    if (date instanceof Date) {
        return date;
    }

    // If it's a number, treat as Unix timestamp (seconds or milliseconds)
    if (typeof date === 'number') {
        // Check if it's in seconds (< year 3000 timestamp in ms)
        const timestamp = date < 10000000000 ? date * 1000 : date;
        return new Date(timestamp);
    }

    // If it's a string, try to parse as ISO string
    if (typeof date === 'string') {
        // If it's a pure number string, parse as timestamp
        if (/^\d+$/.test(date)) {
            const timestamp = parseInt(date);
            return new Date(timestamp < 10000000000 ? timestamp * 1000 : timestamp);
        }

        // Try ISO string parsing
        try {
            return parseISO(date);
        } catch {
            return new Date(date);
        }
    }

    return new Date(date);
}

export function formatCurrency(amount: number, currency: string = 'USD', showCurrency: boolean = true): string {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    if (!showCurrency) {
        return formatter.format(amount).replace(/[A-Z]{3}\s?/, '');
    }

    return formatter.format(amount);
}

export function formatDate(date: string | Date | number): string {
    const parsedDate = parseDate(date);
    return format(parsedDate, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date | number): string {
    const parsedDate = parseDate(date);
    return format(parsedDate, "MMM dd, yyyy 'at' h:mm a");
}

export function formatCountdown(endTime: string | Date | number): string {
    const now = new Date();
    const end = parseDate(endTime);
    const totalSeconds = differenceInSeconds(end, now);

    if (totalSeconds <= 0) return 'Ended';

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

export function formatDistanceToNow(date: string | Date | number): string {
    const now = new Date();
    const past = parseDate(date);
    const totalSeconds = differenceInSeconds(now, past);

    if (totalSeconds < 60) return 'Just now';

    const mins = Math.floor(totalSeconds / 60);
    if (mins < 60) return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}
