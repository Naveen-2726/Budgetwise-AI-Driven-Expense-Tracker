import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove strictly to ensure clean state first
        root.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
            root.style.colorScheme = 'dark';
            document.body.classList.add('dark'); // Fallback/Support
        } else {
            root.classList.add('light');
            root.style.colorScheme = 'light';
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }

        localStorage.setItem('theme', theme);
        console.log('Theme applied:', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
