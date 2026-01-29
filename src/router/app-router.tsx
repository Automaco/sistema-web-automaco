import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, PrivateLayout, PrivateGuard, PublicGuard, AdminGuard, AutoLogout, ActivationGuard, AccountGuard } from '../layouts/index';
import {
    LoginPage, AccountListPage, SelectProviderPage, RegisterPage, RecoverPasswordPage,
    ResetPasswordPage, ActiveAccountPage
} from '../features/auth/pages/index';
import { DownloadDTEsPage, DashboardPage, SettingPage, UsersPage } from '../features/private/pages/index';
import { NotFoundPage } from '../features/404';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/auth/login" replace />,
    },

    // Autenticación (Login, Registro, Recuperación)
    // ZONA PUBLICA //
    {
        element: <PublicGuard />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: '/auth/login', element: <LoginPage /> },
                    { path: '/auth/register', element: <RegisterPage /> },
                    { path: '/auth/recover-password', element: <RecoverPasswordPage /> }, // Area de recuperacion
                    { path: '/auth/reset-password', element: <ResetPasswordPage /> },
                ],
            },
        ],
    },
    // ZONA DE ACTIVACION // 
    {
        element: <ActivationGuard />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    { path: '/auth/active-account', element: <ActiveAccountPage /> },
                ],
            },
        ],
    },
    // ZONA PRIVADA GLOBAL, REQUIERE LOGEARSE
    {
        element: <PrivateGuard />,
        children: [

            // A. Selección de Cuentas (No requiere Layout Privado, pero sí Auth)
            {
                path: '/accounts',
                element: <AuthLayout />,
                children: [
                    { path: 'select-account', element: <AccountListPage /> },
                    { path: 'select-provider', element: <SelectProviderPage /> },
                ],
            },

            // B. Rutas del Sistema (Dashboard, Users, DTEs) -> Requieren AccountGuard
            {
                element: (
                    <AutoLogout>
                        <AccountGuard />
                    </AutoLogout>
                ),
                children: [
                    // Todas estas rutas heredan el PrivateLayout
                    {
                        element: <PrivateLayout />,
                        children: [
                            { path: '/dashboard', element: <DashboardPage /> },
                            { path: '/dtes', element: <DownloadDTEsPage /> },
                            { path: '/settings', element: <SettingPage /> },

                            // Zona Admin
                            {
                                path: '/users',
                                element: <AdminGuard />,
                                children: [
                                    { path: '', element: <UsersPage /> }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
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