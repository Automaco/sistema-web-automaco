import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Asegúrate de importar Settings si lo usas
import { MENU_ITEMS, type UserRole, type MenuItem } from '../../constants/menu-items';

// Mock del usuario
const CURRENT_USER_ROLE: UserRole = 'admin';

export const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const filteredItems = MENU_ITEMS.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(CURRENT_USER_ROLE);
    });

    const handleLogout = () => {
        navigate('/auth/login');
    };

    return (
        // CONTENEDOR FLOTANTE
        // 1. h-[calc(100vh-2rem)]: Altura total menos 2rem (para márgenes arriba/abajo)
        // 2. m-4: Margen externo para separarlo del borde de la pantalla
        // 3. rounded-2xl: Bordes redondeados en las 4 esquinas
        // 4. shadow-xl: Sombra para dar profundidad (efecto flotante)
        <aside
            className={`
                sticky top-4 left-4 h-[calc(100vh-2rem)] flex flex-col my-4 ml-4
                bg-bg-surface border border-border-base rounded-3xl shadow-xl
                transition-all duration-300 ease-in-out z-50 overflow-hidden
                ${isExpanded ? 'w-64' : 'w-20'}
            `}
        >
            {/* 1. LOGO Y TOGGLE */}
            <div className="h-24 flex items-center justify-center relative shrink-0">
                {/* Logo Placeholder */}
                <div className="flex items-center gap-3 overflow-hidden px-4" 
                    onClick={toggleSidebar}>
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                        A
                    </div>
                    <span className={`font-bold text-xl text-brand-primary transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        AutomaCo
                    </span>
                </div>
            </div>

            {/* 2. MENU ITEMS (Centro) */}
            {/* Quitamos overflow-y-auto si no es necesario scroll, usamos justify-center si son pocos items */}
            <nav className="flex-1 flex flex-col gap-3 p-3 py-6">
                {filteredItems.filter(i => !i.bottom).map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        isExpanded={isExpanded}
                    />
                ))}
            </nav>

            {/* 3. BOTTOM SECTION (Settings, Logout) */}
            {/* Usamos mt-auto para empujarlo al fondo limpiamente */}
            <div className="p-3 pb-6 flex flex-col gap-2 mt-auto shrink-0">
                {filteredItems.filter(i => i.bottom).map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        isExpanded={isExpanded}
                    />
                ))}

                {/* Botón manual de Logout */}
                <button
                    onClick={handleLogout}
                    className={`
                        flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                        text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10
                        ${!isExpanded && 'justify-center'}
                    `}
                    title="Cerrar sesión"
                >
                    <LogOut size={22} className="shrink-0" />
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        Cerrar sesión
                    </span>
                </button>
            </div>
        </aside>
    );
};

// Componente Individual del Item (Sin cambios mayores, solo ajustes visuales si quieres)
const SidebarItem = ({ item, isExpanded }: { item: MenuItem, isExpanded: boolean }) => {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `
                flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${!isExpanded && 'justify-center'}
                ${isActive
                    ? 'bg-brand-primary/10 text-brand-primary font-semibold shadow-sm'
                    : 'text-text-muted hover:bg-bg-canvas hover:text-text-main'
                }
            `}
        >
            <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {item.icon}
            </div>

            <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                {item.label}
            </span>

            {/* Tooltip mejorado */}
            {!isExpanded && (
                <div className="absolute left-14 ml-4 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap shadow-lg translate-x-  group-hover:translate-x-0">
                    {item.label}
                    {/* Pequeña flecha del tooltip */}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-800"></div>
                </div>
            )}
        </NavLink>
    );
};