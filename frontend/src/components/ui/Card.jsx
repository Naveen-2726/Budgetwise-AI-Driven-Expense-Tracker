import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Card({ children, className, ...props }) {
    return (
        <div
            className={twMerge("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors", className)}
            {...props}
        >
            {children}
        </div>
    );
}
