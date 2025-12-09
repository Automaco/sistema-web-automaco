import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, PrivateLayout } from '../layouts/index';
import { LoginPage, AccountListPage, SelectProviderPage, RegisterPage } from '../features/auth/pages/index';
import { DownloadDTEsPage } from '../features/private/pages/index';
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
            { path: 'register', element: <RegisterPage /> },
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

    //DTES
    {
        path: '/dtes',
        element: <PrivateLayout />,
        children: [
            {
                path: '',
                element: <DownloadDTEsPage />,
            
            }
        ]
    },

    // Manejo de Errores (404)
    {
        path: '*',
        element: <AuthLayout />, 
        children: [
            {
                path: '*',
                element: <NotFoundPage />, 
            }
        ]
    }
]);