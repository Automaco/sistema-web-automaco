import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../../../services/users.service';
import { type User } from '../../../types/auth.types';
import { type CreateUserDTO, type UpdateUserDTO } from '../../../api/users.api';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar Usuarios
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await usersService.fetchAllUsers();
            setUsers(data);
            setError(null);
        } catch {
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar al montar el componente
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    //  Crear Usuario
    const addUser = async (data: CreateUserDTO) => {
        try {
            const newUser = await usersService.createUser(data);
            setUsers(prev => [...prev, newUser]);
            return { success: true, message: `Usuario ${newUser.name} creado.` };
        } catch {
            return { success: false, message: 'Error al crear usuario' };
        }
    };

    // Editar Usuario (Actualizar todo)
    const editUser = async (id: number, data: UpdateUserDTO) => {
        try {
            const updatedUser = await usersService.updateUser(id, data);
            setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
            return { success: true, message: 'Usuario actualizado correctamente.' };
        } catch {
            return { success: false, message: 'Error al actualizar usuario' };
        }
    };

    // Eliminar Usuario
    const removeUser = async (id: number) => {
        try {
            await usersService.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            return { success: true, message: 'Usuario eliminado.' };
        } catch {
            return { success: false, message: 'No se pudo eliminar el usuario.' };
        }
    };

    // Cambiar Rol (Toggle)
    const switchRole = async (user: User) => {
        try {
            const updatedUser = await usersService.toggleUserRole(user);
            setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
            return { success: true };
        } catch {
            throw new Error('Error al cambiar rol');
        }
    };

    return {
        users,
        loading,
        error,
        addUser,
        editUser,
        removeUser,
        switchRole,
        refreshUsers: fetchUsers
    };
};