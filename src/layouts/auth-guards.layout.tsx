import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { type User } from '../types/auth.types';
import { authService } from '../services/auth.services';

// --- HELPERS (Funciones puras para mantener limpio el código) ---

const getUserFromStorage = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as User;
    } catch {
        // Si el JSON está corrupto, limpiamos todo por seguridad
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('selected_account');
        localStorage.removeItem('selected_account_id');
        return null;
    }
};

const hasToken = () => !!localStorage.getItem('token');

const hasSelectedAccount = () => {
    const accountStr = localStorage.getItem('selected_account');
    const accountId = localStorage.getItem('selected_account_id');
    return !!accountStr && !!accountId;
};


// --- GUARDS ---

/**
 * GUARDIA PÚBLICA (Login, Registro)
 * - Si YA está autenticado, lo manda a donde corresponda según su estado.
 */
export const PublicGuard = () => {
    if (hasToken()) {
        const user = getUserFromStorage();

        // 1. Si no está activo -> Pantalla de activación
        if (user && !user.is_active) {
            return <Navigate to="/auth/active-account" replace />;
        }

        // 2. Si está activo pero no ha seleccionado cuenta -> Selección de cuenta
        if (!hasSelectedAccount()) {
            return <Navigate to="/accounts/select-account" replace />;
        }

        // 3. Si todo está ok -> Dashboard
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};


/**
 * GUARDIA DE ACTIVACIÓN (Específico para /auth/active-account)
 * - Solo entra si está logueado pero inactivo.
 * - Si ya está activo, lo sacamos de aquí.
 */
export const ActivationGuard = () => {
    if (!hasToken()) {
        return <Navigate to="/auth/login" replace />;
    }

    const user = getUserFromStorage();

    // Si ya está activo, no tiene nada que hacer aquí
    if (user && Boolean(user.is_active)) {
        return <Navigate to="/accounts/select-account" replace />;
    }

    return <Outlet />;
};


/**
 * GUARDIA BASE DE AUTENTICACIÓN (PrivateGuard)
 * - Verifica Token y Estado (Activo/Inactivo) contra el servidor.
 * - Sirve para proteger TODAS las rutas privadas (/dashboard, /accounts, etc).
 */
export const PrivateGuard = () => {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsChecking(false);
                setIsAuthenticated(false);
                return;
            }

            try {
                // Sincronizamos con el backend la "verdad"
                const realUser = await authService.getMe();
                localStorage.setItem('user', JSON.stringify(realUser));
                setIsAuthenticated(true);
            } catch (error) {
                // Si el token expiró o es inválido
                console.error("Sesión inválida:", error);
                localStorage.clear(); // Limpiamos todo
                setIsAuthenticated(false);
            } finally {
                setIsChecking(false);
            }
        };

        verifySession();
    }, [token]);

    // Mientras verifica, podemos mostrar un Spinner o nada (null)
    if (isChecking) {
        return <div className="h-screen w-full flex items-center justify-center bg-bg-canvas text-text-muted">Verificando sesión...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // Verificación final de estado activo
    const user = getUserFromStorage();
    if (user && !user.is_active) {
        return <Navigate to="/auth/active-account" replace />;
    }

    return <Outlet />;
};


/**
 * GUARDIA DE SELECCIÓN DE CUENTA (AccountGuard)
 * - Se usa DENTRO de las rutas protegidas por PrivateGuard.
 * - Verifica que el usuario haya seleccionado una cuenta.
 * - Si NO ha seleccionado -> Redirige a /accounts/select-account.
 * - Si YA seleccionó -> Deja pasar al Dashboard, DTEs, etc.
 */
export const AccountGuard = () => {

    // Verificamos si tiene cuenta seleccionada
    if (!hasSelectedAccount()) {
        // Guardamos a dónde quería ir para redirigirlo después (opcional)
        return <Navigate to="/accounts/select-account" replace />;
    }

    return <Outlet />;
};

/**
 * GUARDIA DE ADMINISTRADOR
 * - Requiere estar logueado y activo (implícito si se anida dentro de PrivateGuard).
 * - Verifica rol 'admin'.
 */
export const AdminGuard = () => {
    const user = getUserFromStorage();

    if (!user || user.role !== 'admin') {
        // Si no es admin, lo devolvemos a una zona segura (Dashboard o Select Account)
        const redirectPath = hasSelectedAccount() ? '/dashboard' : '/accounts/select-account';
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};