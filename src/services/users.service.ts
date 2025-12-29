import { usersApi, type CreateUserDTO, type UpdateUserDTO } from '../api/users.api';
import { type User, type UserRole } from '../types/auth.types';

export const usersService = {
    fetchAllUsers: async () => {
        const users = await usersApi.getAll();
        return users;
    },

    createUser: async (userData: CreateUserDTO) => {
        const response = await usersApi.create(userData);
        return response.user;
    },

    updateUser: async (id: number, userData: UpdateUserDTO) => {
        const response = await usersApi.update(id, userData);
        return response.user;
    },

    deleteUser: async (id: number) => {
        await usersApi.delete(id);
        return true;
    },

    toggleUserRole: async (user: User) => {
        const newRole: UserRole = user.role === 'admin' ? 'client' : 'admin';
        // Reutilizamos el método update
        return await usersService.updateUser(user.id, { ...user, role: newRole });
    }
};