import { type ReactNode } from 'react';
import { LayoutDashboard, FileText, Settings, Users } from 'lucide-react';

// Definimos los roles posibles
export type UserRole = 'admin' | 'accountant';

export interface MenuItem {
    label: string;
    path: string;
    icon: ReactNode;
    roles?: UserRole[]; // Si es undefined, es público para todos los logueados
    bottom?: boolean;   // Si true, se va al fondo (como logout o settings)
}

export const MENU_ITEMS: MenuItem[] = [
    // --- SECCIÓN PRINCIPAL ---
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard size={22} />,
    },
    {
        label: 'Descarga de DTEs',
        path: '/dtes',
        icon: <FileText size={22} />,
    },
    {
        label: 'Usuarios',
        path: '/users',
        icon: <Users size={22} />,
        roles: ['admin'], // Solo admin
    },

    // --- SECCIÓN INFERIOR (Bottom) ---
    {
        label: 'Configuración',
        path: '/settings',
        icon: <Settings size={22} />,
        bottom: true,
    },
]; 