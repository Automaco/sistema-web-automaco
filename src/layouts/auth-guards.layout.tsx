import { Navigate, Outlet } from 'react-router-dom';
import { type User } from '../types/auth.types';

export const AdminGuard = () => {
    // 1. Obtener usuario del almacenamiento (igual que el token)
    const userStr = localStorage.getItem('user');
    const user: User | null = userStr ? JSON.parse(userStr) : null;

    // 2. Validar Token y Rol
    // Si no hay usuario o el rol no es admin, lo mandamos al dashboard (o a 403)
    if (!user || user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // 3. Si es admin, dejamos pasar
    return <Outlet />;
};

// Función auxiliar para chequear si existe el token
const isAuthenticated = () => {
    // Aquí validamos si existe el token en localStorage
    const token = localStorage.getItem('token');
    return !!token; // Retorna true si hay token, false si no
};

// GUARDIA PRIVADA (Para Dashboard, DTEs)
// Si NO está autenticado, lo manda al login.
export const PrivateGuard = () => {
    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
};

// GUARDIA PÚBLICA (Para Login, Registro)
// Si YA está autenticado, lo manda al dashboard (no lo deja ver el login, ni demas parte del auth).
export const PublicGuard = () => {
    if (isAuthenticated()) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />; 
};