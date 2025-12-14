// hooks/useCountdown.ts
import { useState, useEffect } from 'react';
import { formatCountdown } from '@/utils/formatters';

export function useCountdown(endTime: string) {
    const [timeLeft, setTimeLeft] = useState(formatCountdown(endTime));
    const [isEnded, setIsEnded] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            const formatted = formatCountdown(endTime);
            setTimeLeft(formatted);

            if (formatted === 'Ended') {
                setIsEnded(true);
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return { timeLeft, isEnded };
}
