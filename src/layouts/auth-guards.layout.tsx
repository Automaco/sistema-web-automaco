import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { type User } from '../types/auth.types';
import { authService } from '../services/auth.services';

export const AdminGuard = () => {
    // 1. Obtener usuario del almacenamiento (igual que el token)
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    // 2. Validar Token y Rol
    // Si no hay usuario o el rol no es admin, lo mandamos al dashboard (o a 403)
    if (!user || user.role !== 'admin' || !Boolean(user.is_active)) {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Si es admin, dejamos pasar
    return <Outlet />;
};
// Funcion para obtener usuario 
const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as User;
    } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        return null;
    }
};

// Función auxiliar para chequear si existe el token
const isAuthenticated = () => {
    // Aquí validamos si existe el token en localStorage
    const token = localStorage.getItem('token');
    return !!token; // Retorna true si hay token, false si no
};

// GUARDIA PRIVADA (Para Dashboard, DTEs)
export const PrivateGuard = () => {

    const [isChecking, setIsChecking] = useState(true);
    const [isVerified, setIsVerified] = useState(false);

    // 1. Lectura inicial rápida (para no flashear el login si ya tiene datos)
    const token = localStorage.getItem('token');

    useEffect(() => {
        const verifyUserStatus = async () => {
            if (!token) {
                setIsChecking(false);
                return;
            }
            try {
                // Preguntamos al Backend la verdad
                const realUser = await authService.getMe();
                 console.log('try', realUser);
                // Actualizamos el localStorage con la verdad del servidor
                // Si el usuario lo hackeó a TRUE, aquí se sobrescribe a FALSE
                localStorage.setItem('user', JSON.stringify(realUser));

                if (realUser.is_active) {
                    setIsVerified(true);
                } else {
                    setIsVerified(false); // Es un usuario real, pero inactivo
                }
            } catch (error) {
                // Si el token es inválido o expiró
                localStorage.removeItem('token');
                localStorage.removeItem('user');
               
                setIsVerified(false);
            } finally {
                setIsChecking(false);
            }
        };
        verifyUserStatus();
    }, [token]);

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }
    // C. Verificamos el estado REAL obtenido del servidor
    // Leemos del localStorage actualizado o usamos un estado local
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    if (user && !user.is_active) {
        // Si el servidor dijo que es false, lo pateamos fuera,
        // aunque él haya intentado hackearlo antes.
        return <Navigate to="/auth/active-account" replace />;
    }

    /*  Primer filtro: Si NO está autenticado, lo manda al login.
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />;
    }*/

    // 3. Si cumple todo, pasa
    return <Outlet />;
};

/**
 * Guarda de activacion (Especifico para acctiveAccount)
 * Debe estar logeado pero inactivo
 * -- No se puede usar el privateGuard porque entraria en un loop
 */
export const ActivationGuard = () => {
    // 1. Si no hay token -> Login
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />
    }

    const user = getCurrentUser();
    // Si el usuario esta activo, va directo al select accoount
    if (user && Boolean(user.is_active)) {
        return <Navigate to="/accounts/select-account" replace />
    }
    // Si esta logeado
    return <Outlet />
};



// GUARDIA PÚBLICA (Para Login, Registro)
// Si YA está autenticado, lo manda al dashboard (no lo deja ver el login, ni demas parte del auth).
export const PublicGuard = () => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};