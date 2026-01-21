import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../utils/http-client'; 
import { type User } from '../types/auth.types';  

export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1: Google, 2: Outlook
    avatar?: string;
}

// --- MEMORIA CACHÉ GLOBAL ---
// Al estar fuera del hook, esta variable mantiene su valor aunque cambies de página.
// Solo se borra si refrescas la página (F5) o si lo forzamos manualmente.
let cachedAccounts: ConnectedAccount[] | null = null;
let isFetchingPromise: Promise<ConnectedAccount[]> | null = null;

export const useProfileSwitcher = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<ConnectedAccount[]>(cachedAccounts || []);
    const [currentAccount, setCurrentAccount] = useState<ConnectedAccount | null>(() => {
        const stored = localStorage.getItem('selected_account');
        return stored ? JSON.parse(stored) : null;
    });
    
    // Si ya tenemos datos en caché, no estamos cargando
    const [isLoading, setIsLoading] = useState(!cachedAccounts);

    useEffect(() => {
        const loadData = async () => {
            // SI YA TENEMOS DATOS EN CACHÉ, NO HACEMOS NADA
            if (cachedAccounts) {
                setAccounts(cachedAccounts);
                checkCurrentAccount(cachedAccounts);
                setIsLoading(false);
                return;
            }

            // SI YA HAY UNA PETICIÓN EN PROCESO, LA ESPERAMOS (Evita doble llamada si usas el hook en 2 lugares)
            if (isFetchingPromise) {
                try {
                    const data = await isFetchingPromise;
                    setAccounts(data);
                    checkCurrentAccount(data);
                } catch (error) {
                    console.error("Error esperando petición paralela", error);
                } finally {
                    setIsLoading(false);
                }
                return;
            }

            // SI NO HAY CACHÉ NI PETICIÓN, LLAMAMOS A LA API
            try {
                // Guardamos la promesa para que otros componentes esperen esta misma llamada
                isFetchingPromise = (async () => {
                    const response = await httpClient.get<{ user: User, connected_accounts: ConnectedAccount[] }>('/settings');
                    const loadedAccounts = response.connected_accounts || [];
                    
                    // Guardamos en la variable global (Caché)
                    cachedAccounts = loadedAccounts; 
                    return loadedAccounts;
                })();

                const data = await isFetchingPromise;
                setAccounts(data);
                checkCurrentAccount(data);

            } catch (error) {
                console.error("Error cargando perfiles", error);
                cachedAccounts = null; // Reseteamos caché si falló
            } finally {
                setIsLoading(false);
                isFetchingPromise = null; // Limpiamos la promesa al terminar
            }
        };

        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helper interno para validar la cuenta seleccionada
    const checkCurrentAccount = (list: ConnectedAccount[]) => {
        const stored = localStorage.getItem('selected_account');
        
        if (stored) {
            // Ya tenemos una, actualizamos el estado por si acaso cambió algo (ej: avatar)
            const parsed = JSON.parse(stored);
            // Opcional: Buscar la versión más reciente en la lista
            const updated = list.find(a => a.id === parsed.id) || parsed;
            setCurrentAccount(updated);
        } else if (list.length > 0) {
            // Seleccionar la primera por defecto
            const firstAccount = list[0];
            setCurrentAccount(firstAccount);
            localStorage.setItem('selected_account', JSON.stringify(firstAccount));
            localStorage.setItem('selected_account_id', firstAccount.id.toString());
        }
    };

    // Función para cambiar de perfil (Lógica Netflix)
    const switchAccount = (account: ConnectedAccount) => {
        setCurrentAccount(account);
        
        localStorage.setItem('selected_account', JSON.stringify(account));
        localStorage.setItem('selected_account_id', account.id.toString());

        // Al hacer reload, la variable 'cachedAccounts' se borrará automáticamente,
        // lo cual es bueno para asegurar que los datos estén frescos al reiniciar la app.
        window.location.reload(); 
    };

    // Ir a la página de configuración
    const handleAddAccount = () => {
        navigate('/settings#email'); 
    };

    // Método opcional por si necesitas forzar la recarga (ej: después de agregar una cuenta)
    const forceRefresh = () => {
        cachedAccounts = null;
        window.location.reload();
    };

    return {
        accounts,
        currentAccount,
        isLoading,
        switchAccount,
        handleAddAccount,
        forceRefresh
    };
};