import { httpClient } from '../utils/http-client';
import type { LoginResponse, LoginCredentials } from '../types/auth.types';

export const authApi = {
    /**
     * Endpoint para iniciar sesión
     * POST /login
     */
    login: (credentials: LoginCredentials) => {
        return httpClient.post<LoginResponse>('/login', credentials);
    },

    /**
     * Endpoint para cerrar sesión
     * POST /logout
     */
    logout: () => {
        return httpClient.post<{ message: string }>('/logout', {});
    },
};
