// utils/formatters.ts
import { format, differenceInSeconds } from 'date-fns';

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

export function formatDate(date: string | Date): string {
    return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
    return format(new Date(date), 'MMM dd, yyyy at h:mm a');
}

export function formatCountdown(endTime: string | Date): string {
    const now = new Date();
    const end = new Date(endTime);
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

export function formatDistanceToNow(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const totalSeconds = differenceInSeconds(now, past);

    if (totalSeconds < 60) return 'Just now';

    const mins = Math.floor(totalSeconds / 60);
    if (mins < 60) return `${mins} ${mins === 1 ? 'min' : 'mins'} ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}
