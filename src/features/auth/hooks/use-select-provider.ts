import { useState } from 'react';
import { accountService } from '../../../services/account.services'; 
import type { ProviderId } from '../../../types/accounts.types'; 

export const useSelectProvider = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSelectProvider = async (providerId: ProviderId) => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Llamamos al servicio que pide la URL a Laravel
            await accountService.initiateSocialLogin(providerId);
            
            // NOTA: No hacemos setIsLoading(false) aquí porque si todo sale bien,
            // el navegador redireccionará a Google y esta página se desmontará.
        } catch (err) {
            console.error(err);
            // Mensaje de error amigable
            setError("No se pudo conectar con el servidor. Por favor, intenta nuevamente.");
            setIsLoading(false);
        }
    };

    const clearError = () => setError(null);

    return {
        isLoading,
        error,
        handleSelectProvider,
        clearError
    };
};