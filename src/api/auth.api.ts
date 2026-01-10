import { httpClient } from '../utils/http-client';
import { type LoginResponse, type LoginCredentials, type RegisterPayload, type RegisterResponse } from '../types/auth.types';

export const authApi = {
    /**
     * Endpoint para iniciar sesión
     * POST /login
     */
    login: (credentials: LoginCredentials) => {
        return httpClient.post<LoginResponse>('/login', credentials);
    },

    /**
     * Register
     * Post /register
     */
    register: (payload: RegisterPayload) => {
        return httpClient.post<RegisterResponse>('/register', payload);
    },

    /**
     * Endpoint para cerrar sesión
     * POST /logout
     */
    logout: () => {
        return httpClient.post<{ message: string }>('/logout', {});
    },
};
