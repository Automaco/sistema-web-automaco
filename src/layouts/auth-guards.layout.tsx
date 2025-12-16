import { Navigate, Outlet } from 'react-router-dom';

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