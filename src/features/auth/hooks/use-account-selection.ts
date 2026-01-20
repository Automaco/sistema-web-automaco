import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../utils/http-client';
import { type User } from '../../../types/auth.types';
import { N8nService } from '../../../services/n8n.services';

export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1: Google, 2: Outlook
    avatar?: string; 
    provider_name?: string; 
}

interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    general?: string;
}

// Definimos la interfaz de la respuesta esperada del backend
interface SettingsResponse {
    user: User;
    connected_accounts: ConnectedAccount[];
}

export const useAccountSelection = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [IsSuccess, setSuccess] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // CAMBIO IMPORTANTE: Quitamos las llaves { data }
                // El httpClient ya devuelve el cuerpo de la respuesta directamente.
                const response = await httpClient.get<SettingsResponse>('/settings');
                
                // Ahora accedemos a las propiedades directamente desde response
                setUser(response.user);
                
                // Verificamos si existe el array en la raíz o dentro del usuario (por si acaso)
                const accountsList = response.connected_accounts || response.user.connected_accounts || [];
                
                setAccounts(accountsList);
                
            } catch (error) {
                console.error("Error cargando cuentas vinculadas", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const handleSelectAccount = (account: ConnectedAccount) => { 
        localStorage.setItem('selected_account', JSON.stringify(account));
        localStorage.setItem('selected_account_id', account.id.toString());

        if (user?.id) {
            try {
                // Enviamos el user_id del usuario autenticado y el provider_id de la cuenta elegida
                N8nService.triggerWorkflow({
                    user_id: user.id,
                    email_provider_id: account.email_provider_id
                });
                console.log("Flujo de n8n iniciado correctamente");
                setSuccess( "Tus archivos apareceran pronto");
            } catch (error) {
                // Aquí podrías manejar el error, por ejemplo, mostrando una notificación
                console.error("No se pudo iniciar el flujo de n8n", error);
                let errorMessage = "Error al obtener los archivos adjuntos"
            }
        }
        navigate('/dashboard');
        
        
    };

    const handleAddAccount = () => {
        navigate('/accounts/select-provider'); 
    };

    return {
        accounts,
        isLoading,
        user,
        handleSelectAccount,
        IsSuccess,
        handleAddAccount
    };
};