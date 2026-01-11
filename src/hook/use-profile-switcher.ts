import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../utils/http-client'; // Ajusta tu ruta si es necesario
import { type User } from '../types/auth.types';   // Ajusta tu ruta

export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1: Google, 2: Outlook
    avatar?: string;
}

export const useProfileSwitcher = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [currentAccount, setCurrentAccount] = useState<ConnectedAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar cuentas al montar
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Cargar lista del backend
                const { data } = await httpClient.get<{ user: User, connected_accounts: ConnectedAccount[] }>('/settings');
                setAccounts(data.connected_accounts || []);

                // 2. Leer la seleccionada del LocalStorage
                const stored = localStorage.getItem('selected_account');
                
                if (stored) {
                    // Si ya hay una guardada, la usamos
                    setCurrentAccount(JSON.parse(stored));
                } else if (data.connected_accounts && data.connected_accounts.length > 0) {
                    // Si no hay ninguna seleccionada pero existen cuentas, seleccionamos la primera por defecto
                    const firstAccount = data.connected_accounts[0];
                    setCurrentAccount(firstAccount);
                    localStorage.setItem('selected_account', JSON.stringify(firstAccount));
                    localStorage.setItem('selected_account_id', firstAccount.id.toString());
                }
            } catch (error) {
                console.error("Error cargando perfiles", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Función para cambiar de cuenta (Efecto Netflix)
    const switchAccount = (account: ConnectedAccount) => {
        // 1. Actualizar estado visual
        setCurrentAccount(account);
        
        // 2. Guardar en Storage
        localStorage.setItem('selected_account', JSON.stringify(account));
        localStorage.setItem('selected_account_id', account.id.toString());

        // 3. Recargar la página para que toda la app (Dashboard, Hooks, etc.) tome el nuevo ID fresco
        window.location.reload(); 
    };

    // Ir a vincular nueva cuenta
    const handleAddAccount = () => {
        navigate('/settings'); // O '/accounts/select-provider' según tus rutas
    };

    return {
        accounts,
        currentAccount,
        isLoading,
        switchAccount,
        handleAddAccount
    };
};