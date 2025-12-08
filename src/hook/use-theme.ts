import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(() => {
        // 1. Revisar LocalStorage
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme;
            if (savedTheme) return savedTheme;

            // 2. Revisar preferencia del sistema
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
        }
        return 'light'; // Default
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Eliminar la clase antigua y poner la nueva
        root.classList.remove('light', 'dark');
        root.classList.add(theme);

        // Guardar en storage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return { theme, toggleTheme };
};