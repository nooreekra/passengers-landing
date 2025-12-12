"use client";

import { useEffect, useState, useRef } from "react";

interface AnimatedCounterProps {
    values: number[];
    duration?: number; // Duration to stay at each value in ms
    formatNumber?: (num: number) => string;
}

export default function AnimatedCounter({ values, duration = 800, formatNumber }: AnimatedCounterProps) {
    const [displayValue, setDisplayValue] = useState(values[0] || 0);
    const currentIndexRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (values.length === 0) return;

        const animateToNext = () => {
            const currentIndex = currentIndexRef.current;
            
            // Don't go back to first value, stop at last value
            if (currentIndex >= values.length - 1) {
                return;
            }
            
            const nextIndex = currentIndex + 1;
            const currentValue = values[currentIndex];
            const nextValue = values[nextIndex];
            
            // Very fast spinning animation
            const steps = 40;
            const stepDuration = 15; // Very fast: 15ms per step
            let step = 0;
            
            // Clear any existing interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            
            intervalRef.current = setInterval(() => {
                step++;
                const progress = Math.min(step / steps, 1);
                
                // Calculate interpolated value
                const interpolated = Math.round(
                    currentValue + (nextValue - currentValue) * progress
                );
                setDisplayValue(interpolated);
                
                if (step >= steps) {
                    // Animation complete
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setDisplayValue(nextValue);
                    currentIndexRef.current = nextIndex;
                    
                    // Wait at this value before animating to next
                    timeoutRef.current = setTimeout(() => {
                        animateToNext();
                    }, duration);
                }
            }, stepDuration);
        };

        // Start animation after showing initial value once
        timeoutRef.current = setTimeout(() => {
            animateToNext();
        }, duration);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [values, duration]);

    const formattedValue = formatNumber 
        ? formatNumber(displayValue) 
        : displayValue.toLocaleString();

    return <span>{formattedValue}</span>;
}

