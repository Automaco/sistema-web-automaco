import { authApi } from '../api/auth.api';
import type { LoginResponse } from '../types/auth.types';

export const authService = {
    /**
     * Realiza el login y guarda la sesión automáticamente
     */
    login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
        // 1. Llamamos a la capa API
        const response = await authApi.login(credentials);

        // 2. Guardar sesión
        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    },

    /**
     * Cierra sesión y limpia el almacenamiento
     */
    logout: async () => {
        try {
            await authApi.logout();
        } finally {
            // Siempre limpiamos el storage, incluso si la API falla
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
        }
    },

    /**
     * Helper para verificar si está autenticado sin llamar a la API
     */
    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    }
};