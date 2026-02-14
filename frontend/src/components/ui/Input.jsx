import React, { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ className, error, label, type = "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="w-full">
            {label && (
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}
            <div className="relative">
                <input
                    ref={ref}
                    type={isPassword ? (showPassword ? 'text' : 'password') : type}
                    className={twMerge(
                        'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:bg-gray-50',
                        'dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
});

Input.displayName = 'Input';
export { Input };
