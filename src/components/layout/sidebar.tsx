import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { MENU_ITEMS, type UserRole, type MenuItem } from '../../constants/menu-items';

// Mock del usuario
const CURRENT_USER_ROLE: UserRole = 'admin';

export const Sidebar = () => {
    // Estado Desktop
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
    // Estado Mobile
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const navigate = useNavigate();

    const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
    const closeMobileMenu = () => setIsMobileOpen(false);

    // Filtro de items
    const filteredItems = MENU_ITEMS.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(CURRENT_USER_ROLE);
    });

    const handleLogout = () => navigate('/auth/login');

    // Props comunes para reutilizar en ambos menús
    const commonProps = {
        items: filteredItems,
        handleLogout,
        navigate
    };

    return (
        <>
            {/* =======================
                MOBILE TRIGGER & MENU
               ======================= */}
            <div className="lg:hidden">
                {/* Botón Hamburguesa Flotante */}
                <button 
                    onClick={toggleMobileMenu}
                    className="fixed top-4 left-4 z-50 p-2.5 bg-bg-surface text-brand-primary rounded-xl shadow-lg border border-border-base active:scale-95 transition-transform"
                >
                    <Menu size={24} />
                </button>

                {/* Overlay Oscuro */}
                {isMobileOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={closeMobileMenu}
                    />
                )}

                {/* Drawer Móvil */}
                <MobileDrawer 
                    isOpen={isMobileOpen} 
                    onClose={closeMobileMenu} 
                    {...commonProps} 
                />
            </div>

            {/* =======================
                DESKTOP SIDEBAR
               ======================= */}
            <div className="hidden lg:block h-full">
                <DesktopSidebar 
                    isExpanded={isDesktopExpanded} 
                    toggleExpanded={toggleDesktopSidebar} 
                    {...commonProps} 
                />
            </div>
        </>
    );
};

// COMPONENTE MOBILE DRAWER
const MobileDrawer = ({ isOpen, onClose, items, handleLogout }: { isOpen: boolean; onClose: () => void; items: MenuItem[]; handleLogout: () => void }) => {
    return (
        <aside
            className={`
                fixed top-0 left-0 z-50 h-screen flex flex-col
                /* ANCHO RESPONSIVE: */
                w-[85vw] sm:w-80 /* 85% de la pantalla en móviles, fijo en tablets */
                max-w-[320px]    /* Nunca más ancho que 320px */
                
                bg-bg-surface border-r border-border-base shadow-2xl
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
        >
            {/* HEADER MÓVIL 
            */}
            <div className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-border-base/50">
                <span className="font-bold text-xl text-brand-primary truncate">
                    AutomaCo
                </span>
                
                <button 
                    onClick={onClose} 
                    className="p-2 text-text-muted hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Cerrar menú"
                >
                    <X size={24} />
                </button>
            </div>

            {/* LISTA DE ITEMS */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {items.filter((i: MenuItem) => !i.bottom).map((item: MenuItem) => (
                    <MobileItem key={item.path} item={item} onClick={onClose} />
                ))}
            </nav>

            {/* BOTTOM SECTION */}
            <div className="p-4 border-t border-border-base/50 flex flex-col gap-2 bg-bg-surface shrink-0">
                {items.filter((i: MenuItem) => i.bottom).map((item: MenuItem) => (
                    <MobileItem key={item.path} item={item} onClick={onClose} />
                ))}
                
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 font-medium transition-colors"
                >
                    <LogOut size={22} className="shrink-0" />
                    <span className="truncate">Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
};

// Item simple para móvil 
const MobileItem = ({ item, onClick }: { item: MenuItem, onClick: () => void }) => (
    <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
            ${isActive ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-text-muted hover:bg-bg-canvas hover:text-text-main'}
        `}
    >
        {item.icon}
        <span>{item.label}</span> 
    </NavLink>
);


// COMPONENTE DESKTOP SIDEBAR 
const DesktopSidebar = ({ isExpanded, toggleExpanded, items, handleLogout }: { isExpanded: boolean; toggleExpanded: () => void; items: MenuItem[]; handleLogout: () => void }) => {
    return (
        <aside
            className={`
                sticky top-4 left-4 h-[calc(100vh-2rem)] flex flex-col my-4 ml-4
                bg-bg-surface border border-border-base rounded-3xl shadow-xl
                transition-all duration-300 ease-in-out z-50
                ${isExpanded ? 'w-64' : 'w-20'}
            `}
        >
            {/* Logo Desktop */}
            <div className="h-24 flex items-center justify-center relative shrink-0">
                <div className="flex items-center gap-3 overflow-hidden px-4 cursor-pointer" onClick={toggleExpanded}>
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
                        A
                    </div>
                    <span className={`font-bold text-xl text-brand-primary transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden'}`}>
                        AutomaCo
                    </span>
                </div>
                {/* Flecha Toggle */}
                <button onClick={toggleExpanded} className="absolute -right-3 top-10 bg-bg-surface border border-border-base text-text-muted hover:text-brand-primary rounded-full p-1 shadow-sm transition-colors z-50">
                    {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            {/* Items Desktop */}
            <nav className="flex-1 flex flex-col gap-3 p-3 py-6">
                {items.filter((i: MenuItem) => !i.bottom).map((item: MenuItem) => (
                    <DesktopItem key={item.path} item={item} isExpanded={isExpanded} />
                ))}
            </nav>

            {/* Bottom Desktop */}
            <div className="p-3 pb-6 flex flex-col gap-2 mt-auto shrink-0">
                {items.filter((i: MenuItem) => i.bottom).map((item: MenuItem) => (
                    <DesktopItem key={item.path} item={item} isExpanded={isExpanded} />
                ))}
                
                <button onClick={handleLogout} className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 ${!isExpanded && 'justify-center'}`}>
                    <LogOut size={22} className="shrink-0" />
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>Cerrar sesión</span>
                    {!isExpanded && (
                        <div className="absolute left-full ml-5 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-50 whitespace-nowrap shadow-xl -translate-x-2.5 group-hover:translate-x-0">
                            Cerrar sesión
                            <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-brand-primary"></div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

// Item complejo para Desktop 
const DesktopItem = ({ item, isExpanded }: { item: MenuItem, isExpanded: boolean }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) => `
            flex items-center gap-3 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative
            ${!isExpanded && 'justify-center'}
            ${isActive ? 'bg-brand-primary/10 text-brand-primary font-semibold shadow-sm' : 'text-text-muted hover:bg-bg-canvas hover:text-text-main'}
        `}
    >
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">{item.icon}</div>
        <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>{item.label}</span>
        
        {!isExpanded && (
            <div className="absolute left-full ml-5 z-50 px-4 py-2 bg-brand-primary text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none -translate-x-2.5 group-hover:translate-x-0 transition-all duration-300 ease-out whitespace-nowrap shadow-xl">
                {item.label}
                <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-brand-primary"></div>
            </div>
        )}
    </NavLink>
);