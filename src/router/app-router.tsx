import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout, PrivateLayout, PrivateGuard, PublicGuard, AdminGuard, AutoLogout } from '../layouts/index';
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
        path: '/users',
        element: (
            <AutoLogout>
                <PrivateGuard />
            </AutoLogout>
        ),
        children: [
            {
                path: '',
                element: <AdminGuard />,
                children: [
                    {
                        path: '',
                        element: <PrivateLayout />,
                        children: [
                            {
                                path: '',
                                element: <UsersPage />
                            }
                        ]
                    }
                ]
            }
        ]
    },

    {
        element: (
            <AutoLogout>
                <PrivateGuard />
            </AutoLogout>
        ),
        children: [
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
                element: (
                    <AutoLogout>
                        <PrivateGuard />
                    </AutoLogout>
                ),
                children: [
                    {
                        path: '',
                        element: <PrivateLayout />,
                        children: [
                            {
                                path: '',
                                element: <DashboardPage />,
                            }
                        ]

                    }
                ]

            },

            //DTES
            {
                path: '/dtes',
                element: (
                    <AutoLogout>
                        <PrivateLayout />
                    </AutoLogout>
                ),
                children: [
                    {
                        path: '',
                        element: <PrivateGuard />,
                        children: [
                            {
                                path: '',
                                element: <DownloadDTEsPage />,
                            }
                        ]
                    }
                ]

            },
            // Settings
            {
                path: '/settings',
                element: <PrivateLayout />,
                children: [
                    {
                        path: '',
                        element: <PrivateGuard />,
                        children: [
                            {
                                path: '',
                                element: <SettingPage />,
                            }
                        ]
                    }
                ]
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