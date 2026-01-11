import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../utils/http-client';
import { type User } from '../../../types/auth.types';

// Reutilizamos la interfaz o la definimos aquí
export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1: Google, 2: Outlook
    avatar?: string; 
    provider_name?: string; 
}

export const useAccountSelection = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    // 1. Cargar las cuentas usando el mismo endpoint de settings
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // Usamos el mismo endpoint que en Settings
                const { data } = await httpClient.get<{ user: User, connected_accounts: ConnectedAccount[] }>('/settings');

                setUser(data.user);
                setAccounts(data.connected_accounts || []);
            } catch (error) {
                console.error("Error cargando cuentas vinculadas", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    // 2. Lógica al seleccionar una cuenta
    const handleSelectAccount = (account: ConnectedAccount) => {
        // Guardamos la cuenta seleccionada en el Store (LocalStorage)
        // Esto permite que el Sidebar y otras partes de la app sepan cuál se está usando
        localStorage.setItem('selected_account', JSON.stringify(account));

        // También guardamos el ID por si acaso se necesita solo el ID
        localStorage.setItem('selected_account_id', account.id.toString());

        // Redirigir al dashboard
        navigate('/dashboard');
    };

    // 3. Lógica para ir a agregar nueva cuenta
    const handleAddAccount = () => {
        navigate('/accounts/select-provider'); 
    };

    return {
        accounts,
        isLoading,
        user,
        handleSelectAccount,
        handleAddAccount
    };
};