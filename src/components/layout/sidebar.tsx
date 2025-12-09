import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
        <aside
            className={`
                sticky top-4 left-4 h-[calc(100vh-2rem)] flex flex-col my-4 ml-4
                bg-bg-surface border border-border-base rounded-3xl shadow-xl
                transition-all duration-300 ease-in-out z-50 overflow-visible
                ${isExpanded ? 'w-64' : 'w-20'}
            `}
        >
            {/* 1. LOGO Y TOGGLE */}
            <div className="h-24 flex items-center justify-center relative shrink-0">
                <div className="flex items-center gap-3 overflow-hidden px-4 cursor-pointer" 
                    onClick={toggleSidebar}>
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                        A
                    </div>
                    <span className={`font-bold text-xl text-brand-primary transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        AutomaCo
                    </span>
                </div>
            </div>

            {/* 2. MENU ITEMS */}
            <nav className="flex-1 flex flex-col gap-3 p-3 py-6">
                {filteredItems.filter(i => !i.bottom).map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        isExpanded={isExpanded}
                    />
                ))}
            </nav>

            {/* 3. BOTTOM SECTION */}
            <div className="p-3 pb-6 flex flex-col gap-2 mt-auto shrink-0">
                {filteredItems.filter(i => i.bottom).map((item) => (
                    <SidebarItem
                        key={item.path}
                        item={item}
                        isExpanded={isExpanded}
                    />
                ))}

                {/* Botón manual de Logout (Con Tooltip agregado) */}
                <button
                    onClick={handleLogout}
                    className={`
                        relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                        text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10
                        ${!isExpanded && 'justify-center'}
                    `}
                    title=""
                >
                    <LogOut size={22} className="shrink-0" />
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        Cerrar sesión
                    </span>

                    {/* Tooltip para Logout */}
                    {!isExpanded && (
                        <div className="absolute left-full ml-5 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl -translate-x-2.5 group-hover:translate-x-0">
                            Cerrar sesión
                            {/* Flecha */}
                            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-slate-900"></div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

// Componente Individual del Item
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

            {/* === TOOLTIP MEJORADO === */}
            {!isExpanded && (
                <div className="
                    absolute left-full ml-5 z-100
                    px-4 py-2                                      /* Más padding = Más grande */
                    bg-brand-primary text-white                        /* Fondo oscuro fuerte */
                    text-sm font-medium tracking-wide              /* Texto más grande y legible */
                    rounded-lg shadow-2xl                          /* Bordes redondeados y sombra fuerte */
                    whitespace-nowrap
                    opacity-0 group-hover:opacity-100              /* Fade in */
                    -translate-x-2.5 group-hover:translate-x-0  /* Slide in */
                    transition-all duration-300 ease-out
                    pointer-events-none                            /* Evita que el mouse interactúe con el tooltip */
                ">
                    {item.label}
                    
                    {/* Flecha del Tooltip (Aumentada de tamaño) */}
                    <div className="
                        absolute left-0 top-1/2 
                        -translate-x-full -translate-y-1/2 
                        border-[6px] border-transparent 
                        border-r-slate-500 
                    "></div>
                </div>
            )}
        </NavLink>
    );
};