import { httpClient } from '../utils/http-client';
import { type LoginResponse, type LoginCredentials, type RegisterPayload, type RegisterResponse, type AuthMessageResponse, type ForgotPasswordPayload, type ResetPasswordPayload, type ActivateAccountPayload, type ActivateAccountResponse } from '../types/auth.types';

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
     * Restablecimiento de contraseña
     * 1. Envio de correo
     */
    sendLink: (payload: ForgotPasswordPayload) => {
        return httpClient.post<AuthMessageResponse>('/send-reset-link', payload);
    },
    //Reseteo de contraseña
    resetPassword: (payload: ResetPasswordPayload) => {
        return httpClient.post<AuthMessageResponse>('/reset-password', payload);
    },
    // Activacion de cuenta
    activationAccount: (payload: ActivateAccountPayload) => {
        return httpClient.post<ActivateAccountResponse>('/activate', payload);
    },
    /**
     * Endpoint para cerrar sesión
     * POST /logout
     */
    logout: () => {
        return httpClient.post<{ message: string }>('/logout', {});
    },
};
