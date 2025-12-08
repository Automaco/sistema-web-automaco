import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '../layouts/auth.layout';
import { LoginPage, AccountListPage, SelectProviderPage } from '../features/auth/pages/index';
import { NotFoundPage } from '../features/404';

export const router = createBrowserRouter([
    {
        path: '/',
        // Redirigir la raíz a /auth/login automáticamente
        element: <Navigate to="/auth/login" replace />,
    },

    // Autenticación (Login, Registro, Recuperación)
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            // Futuro: 
            // { path: 'register', element: <RegisterPage /> },
            // { path: 'forgot-password', element: <ForgotPasswordPage /> },
        ],
    },

    // Selección de Cuentas
    {
        path: '/accounts',
        element: <AuthLayout />,
        children: [
            {
                path: 'select-account',
                element: <AccountListPage />,
            },
            {
                path: 'select-provider',
                element: <SelectProviderPage />,
            },
        ],
    },

    // GRUPO 3: Manejo de Errores (404)
    {
        path: '*',
        element: <AuthLayout />, // Reutilizamos el diseño base
        children: [
            {
                path: '*',
                element: <NotFoundPage />, // Cargamos tu nueva tarjeta de error
            }
        ]
    }
]);