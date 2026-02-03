import { httpClient } from '../utils/http-client';
import { type ActivationCode, type CreateCodeResponse } from '../types/activation.types';

export const activationService = {
    // Obtener todos
    getAll: async () => {
        return await httpClient.get<ActivationCode[]>('/activation-codes');
    },

    // Generar uno nuevo
    generate: async () => {
        return await httpClient.post<CreateCodeResponse>('/activation-codes', {});
    },

    // Eliminar
    delete: async (id: number) => {
        return await httpClient.delete(`/activation-codes/${id}`);
    }
};