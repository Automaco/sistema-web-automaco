/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';
import { httpClient } from '../../../utils/http-client';
import { type User } from '../../../types/auth.types';
import { type ModalType } from '../../../components/ui/status-modal';

export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number;
    avatar?: string;
}

export const useSettings = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Datos
    const [user, setUser] = useState<User | null>(null);
    const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

    // --- ESTADO PARA TU STATUS MODAL (CENTRALIZADO) ---
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
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Perfil Actualizado',
                description: 'Tu información personal se ha guardado correctamente.'
            });
        } catch (error: any) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error al actualizar',
                description: 'Hubo un problema al actualizar tu perfil. Revisa los errores e inténtalo de nuevo.'
            });
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
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Contraseña Actualizada',
                description: 'Tu contraseña ha sido modificada exitosamente.'
            });
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

    const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
    const [accountToDisconnect, setAccountToDisconnect] = useState<number | null>(null);

    // El usuario hace clic en "Desvincular" -> Abrimos modal y guardamos el ID
    const requestDisconnect = (connectionId: number) => {
        setAccountToDisconnect(connectionId);
        setIsDisconnectModalOpen(true);
    };

    // Función para cerrar el modal y limpiar
    const closeDisconnectModal = () => {
        setIsDisconnectModalOpen(false);
        setAccountToDisconnect(null);
    };

    const confirmDisconnect = async () => {
        if (!accountToDisconnect) return;

        setIsLoading(true);
        try {
            // Llamada al backend con el ID único
            await httpClient.delete(`/settings/provider/${accountToDisconnect}`);
            
            // Actualizamos la lista localmente
            setConnectedAccounts(prev => prev.filter(acc => acc.id !== accountToDisconnect));
            
            // Mensaje de éxito
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Cuenta Desvinculada',
                description: 'Se ha eliminado la conexión correctamente.'
            });
        } catch {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                description: 'No se pudo desvincular la cuenta.'
            });
        } finally {
            setIsLoading(false);
            closeDisconnectModal(); // Cerramos el modal
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const requestDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();

        if (!deletePassword.trim()) {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Campo Requerido',
                description: 'Por favor ingresa tu contraseña para confirmar.'
            });
            return;
        }
        setIsDeleteModalOpen(true);
    };

    const executeDeleteAccount = async () => {
        setIsLoading(true);
        try {
            await httpClient.put('/settings/account', {
                password: deletePassword 
            });

            authService.logout();
            navigate('/auth/login');
        } catch (error: any) {
            setIsDeleteModalOpen(false);
            const msg = error.response?.data?.message || 'Error al eliminar cuenta. Verifica tu contraseña.';

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
        user, connectedAccounts, isLoading, errors,
        profileForm, handleProfileChange, updateProfile,
        passwordForm, handlePasswordChange, updatePassword,
        connectProvider, isDisconnectModalOpen,
        closeDisconnectModal,
        requestDisconnect, 
        confirmDisconnect,
        isLogoutModalOpen, isLoggingOut, handleLogoutClick, closeLogoutModal, confirmLogout,
        deletePassword, setDeletePassword, isDeleteModalOpen, setIsDeleteModalOpen, requestDeleteAccount, executeDeleteAccount,
        statusModal,
        closeStatusModal
    };
};