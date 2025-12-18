import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, PrivateLayout, PrivateGuard, PublicGuard } from '../layouts/index';
import { LoginPage, AccountListPage, SelectProviderPage, RegisterPage, RecoverPasswordPage, ResetPasswordPage, ActiveAccountPage } from '../features/auth/pages/index';
import { DownloadDTEsPage, DashboardPage } from '../features/private/pages/index';
import { NotFoundPage } from '../features/404';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/auth/login" replace />,
    },

    // Autenticación (Login, Registro, Recuperación)
    {
        element: <PublicGuard />,
        children: [
            {
                path: '/auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />,
                    },
                    { path: 'register', element: <RegisterPage /> },
                    // Recuperacion de contraseña
                    { path: 'recover-password', element: <RecoverPasswordPage /> },
                    { path: 'reset-password', element: <ResetPasswordPage /> },
                ],
            },
        ]
    },

    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            { path: 'active-account', element: <ActiveAccountPage /> },
        ],
    },

    {
        element: <PrivateGuard />,
        children: [
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

            //DASHBOARD
            {
                path: '/dashboard',
                element: <PrivateLayout />,
                children: [
                    {
                        //cambiar a dashboard
                        path: '',
                        element: <DashboardPage />,
                    }
                ]
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