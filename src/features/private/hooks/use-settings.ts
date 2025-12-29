/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';
import { httpClient } from '../../../utils/http-client';
import { type User } from '../../../types/auth.types';
import { type ModalType } from '../../../components/ui/status-modal';

// Interfaz para cuentas conectadas
export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1: Google, 2: Outlook
    avatar?: string;
}

export const useSettings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Datos
    const [user, setUser] = useState<User | null>(null);
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

    // --- ESTADO PARA TU STATUS MODAL (EXITO/ERROR) ---
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        description: string;
    }>({ isOpen: false, type: 'info', title: '', description: '' });

    const closeStatusModal = () => setStatusModal(prev => ({ ...prev, isOpen: false }));

    // Forms
    const [profileForm, setProfileForm] = useState({ name: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', password: '', password_confirmation: '' });

    const [errors, setErrors] = useState<any>({});

    // Cargar datos
    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await httpClient.get<{ user: User, connected_accounts: ConnectedAccount[] }>('/settings');
            setUser(data.user);
            setConnectedAccounts(data.connected_accounts || []);
            setProfileForm({ name: data.user.name, email: data.user.email });
        } catch (error) {
            console.error("Error cargando configuración", error);
        }
    };

    // --- PERFIL ---
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        try {
            await httpClient.put('/settings/profile', profileForm);
            alert('Perfil actualizado');
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    // --- PASSWORD ---
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.password !== passwordForm.password_confirmation) {
            setErrors({ password_confirmation: 'Las contraseñas no coinciden' });
            return;
        }
        setIsLoading(true);
        setErrors({});
        try {
            await httpClient.put('/settings/password', passwordForm);
            alert('Contraseña actualizada');
            setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        } finally {
            setIsLoading(false);
        }
    };

    // --- PROVIDERS ---
    const connectProvider = (provider: 'google' | 'outlook') => {
        window.location.href = `http://127.0.0.1:8000/auth/${provider}/redirect`;
    };

    const disconnectProvider = async (providerId: number) => {
        if (!confirm('¿Desvincular esta cuenta?')) return;
        setIsLoading(true);
        try {
            await httpClient.delete(`/settings/provider/${providerId}`);
            setConnectedAccounts(prev => prev.filter(acc => acc.email_provider_id !== providerId));
        } catch {
            alert('Error al desvincular');
        } finally {
            setIsLoading(false);
        }
    };

    // --- LOGOUT ---
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);
    const confirmLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            authService.logout();
            navigate('/auth/login');
        }, 1000);
    };

    // --- LOGICA ELIMINAR CUENTA ---
    const [deletePassword, setDeletePassword] = useState('');

    // Estado para el modal de confirmación de eliminación
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Validar password y abrir modal (Reemplaza el submit del form)
    const requestDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();

        if (!deletePassword.trim()) {
            // Puedes usar un toast o setear un error aquí
            alert('Por favor ingresa tu contraseña para confirmar.');
            return;
        }

        // Abrimos el modal personalizado en lugar de window.confirm
        setIsDeleteModalOpen(true);
    };

    // Ejecutar la eliminación real (Se llama desde el Modal)
    const executeDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await httpClient.put('/settings/account', {
                data: { password: deletePassword }
            });

            authService.logout();
            navigate('/auth/login');
        } catch (error: any) {
            // Cerramos el modal de confirmación primero
            setIsDeleteModalOpen(false);

            // Obtenemos el mensaje de error
            const msg = error.response?.data?.message || 'Error al eliminar cuenta. Verifica tu contraseña.';

            // ABRIMOS TU STATUS MODAL DE ERROR
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'No se pudo eliminar',
                description: msg
            });
        } finally {
            setIsLoading(false);
        }
    };
    return {
        user,
        connectedAccounts,
        isLoading,
        errors,
        // Perfil
        profileForm,
        handleProfileChange,
        updateProfile,
        // Password
        passwordForm,
        handlePasswordChange,
        updatePassword,
        // Providers
        connectProvider,
        disconnectProvider,
        // Logout
        isLogoutModalOpen,
        isLoggingOut,
        handleLogoutClick,
        closeLogoutModal,
        confirmLogout,
        //eliimnar
        deletePassword,
        setDeletePassword,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        requestDeleteAccount,
        executeDeleteAccount,
        statusModal,
        closeStatusModal
    };
};