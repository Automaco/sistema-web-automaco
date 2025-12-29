import { httpClient } from '../utils/http-client';
import { type User, type UserRole } from '../types/auth.types';

export interface CreateUserDTO {
    name: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    password?: string;
}

export type UpdateUserDTO = Partial<CreateUserDTO>;

export const usersApi = {
    getAll: async () => {
        return await httpClient.get<User[]>('/users');
    },

    create: async (data: CreateUserDTO) => {
        return await httpClient.post<{ user: User }>('/users', data);
    },

    update: async (id: number, data: UpdateUserDTO) => {
        return await httpClient.put<{ user: User }>(`/users/${id}`, data);
    },

    delete: async (id: number) => {
        return await httpClient.delete<{ message: string }>(`/users/${id}`);
    }
};