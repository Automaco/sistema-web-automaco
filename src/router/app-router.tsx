import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/auth.layout';
import { LoginPage } from '../features/auth/pages/login';

export const router = createBrowserRouter([
    {
        path: '/',
        // Redirigir la raíz a /auth/login automáticamente
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            // Aquí agregarás más rutas en el futuro:
            // {
            //   path: 'register',
            //   element: <RegisterPage />,
            // },
        ],
    },
    // Capturar rutas no existentes (404)
    {
        path: '*',
        element: <div>404 - Página no encontrada</div>,
    }
]);