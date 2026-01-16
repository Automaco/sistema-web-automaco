import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { MENU_ITEMS, type UserRole, type MenuItem } from '../../constants/menu-items';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { authService } from '../../services/auth.services';
import { type User } from '../../types/auth.types';
import { ProfileSwitcher } from '../../components/profile-switcher';

export const Sidebar = () => {
    // 1. OBTENER ROL
    const [userRole] = useState<UserRole>(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user: User = JSON.parse(userStr);
                return (user.role as UserRole) || 'client';
            } catch {
                return 'client' as UserRole;
            }
        }
        return 'client' as UserRole;
    });

    // Estados UI (Inicia contraído = false)
    const [isDesktopExpanded, setIsDesktopExpanded] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Estados Logout
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navigate = useNavigate();

    // Handlers UI
    const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded);
    const toggleMobileMenu = () => setIsMobileOpen(!isMobileOpen);
    const closeMobileMenu = () => setIsMobileOpen(false);

    const filteredItems = MENU_ITEMS.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
        if (isMobileOpen) closeMobileMenu();
    };

    const confirmLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            localStorage.removeItem('selected_account');
            localStorage.removeItem('selected_account_id');
            authService.logout();
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
            navigate('/auth/login');
        }, 1000);
    };

    return (
        <>
            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                isLoading={isLoggingOut}
                type="danger"
                title="¿Cerrar sesión?"
                description="Se cerrará la sesión actual."
                confirmText="Sí, salir"
                cancelText="Cancelar"
            />

            {/* --- MOBILE --- */}
            <div className="lg:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="fixed top-4 left-4 z-40 p-2.5 bg-bg-surface text-brand-primary rounded-xl shadow-lg border border-border-base active:scale-95 transition-transform"
                >
                    <Menu size={24} />
                </button>

                {isMobileOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in" onClick={closeMobileMenu} />
                )}

                <MobileDrawer
                    isOpen={isMobileOpen}
                    onClose={closeMobileMenu}
                    items={filteredItems}
                    handleLogout={handleLogoutClick}
                />
            </div>

            {/* --- DESKTOP --- */}
            <div className="hidden lg:block h-full">
                <DesktopSidebar
                    isExpanded={isDesktopExpanded}
                    toggleExpanded={toggleDesktopSidebar}
                    items={filteredItems}
                    handleLogout={handleLogoutClick}
                />
            </div>
        </>
    );
};

// ==========================================
// COMPONENTE: MOBILE DRAWER (Sin cambios)
// ==========================================
const MobileDrawer = ({ isOpen, onClose, items, handleLogout }: any) => {
    return (
        <aside className={`fixed top-0 left-0 z-50 h-screen flex flex-col w-[85vw] sm:w-80 max-w-[320px] bg-bg-surface border-r border-border-base shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-border-base/50">
                <span className="font-bold text-xl text-brand-primary">AutomaCo</span>
                <button onClick={onClose} className="p-2 text-text-muted hover:text-red-500 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <div className="p-4 pb-0"><ProfileSwitcher isExpanded={true} /></div>
            <div className="mx-4 my-2 border-b border-border-base/50"></div>
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {items.filter((i: any) => !i.bottom).map((item: any) => <MobileItem key={item.path} item={item} onClick={onClose} />)}
            </nav>
            <div className="p-4 border-t border-border-base/50 flex flex-col gap-2 bg-bg-surface shrink-0">
                {items.filter((i: any) => i.bottom).map((item: any) => <MobileItem key={item.path} item={item} onClick={onClose} />)}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 font-medium transition-colors"><LogOut size={22} className="shrink-0" /><span className="truncate">Cerrar sesión</span></button>
            </div>
        </aside>
    );
};
const MobileItem = ({ item, onClick }: any) => (
    <NavLink to={item.path} onClick={onClick} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-brand-primary/10 text-brand-primary font-semibold' : 'text-text-muted hover:bg-bg-canvas hover:text-text-main'}`}>
        {item.icon}<span>{item.label}</span>
    </NavLink>
);

// ==========================================
// DESKTOP SIDEBAR (CORREGIDO PARA SCROLL Y TOOLTIPS)
// ==========================================
const DesktopSidebar = ({ isExpanded, toggleExpanded, items, handleLogout }: { isExpanded: boolean; toggleExpanded: () => void; items: MenuItem[]; handleLogout: () => void }) => {
    return (
        <aside className={`
            sticky top-4 left-4 h-[calc(100vh-2rem)] flex flex-col my-4 ml-4
            bg-bg-surface border border-border-base rounded-3xl shadow-xl
            transition-all duration-300 ease-in-out z-50
            /* CAMBIO 1: visible para que los tooltips salgan */
            overflow-visible 
            ${isExpanded ? 'w-72' : 'w-20'}
        `}>
            {/* Header / Switcher */}
            <div className="pt-4 px-2 pb-2 relative">
                {/* IMPORTANTE: ProfileSwitcher debe recibir isExpanded.
                   Si ProfileSwitcher ocupa mucho espacio, asegúrate de que su componente
                   oculte el texto cuando isExpanded es false.
                */}
                <ProfileSwitcher isExpanded={isExpanded} />

                {/* Botón Toggle */}
                <button
                    onClick={toggleExpanded}
                    className="absolute -right-3 top-6 bg-bg-surface border border-border-base text-text-muted hover:text-brand-primary rounded-full p-1.5 shadow-sm transition-colors z-40"
                >
                    {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            <div className="mx-4 border-b border-border-base mb-2 opacity-50"></div>

            {/* CAMBIO 2: overflow-x-hidden AQUÍ para evitar scroll horizontal dentro de la lista
                custom-scrollbar debe tener un ancho fino o estar oculto
            */}
            <nav className="flex-1 flex flex-col gap-2 p-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {items.filter(i => !i.bottom).map(item => (
                    <DesktopItem key={item.path} item={item} isExpanded={isExpanded} />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 pb-6 flex flex-col gap-2 mt-auto shrink-0 border-t border-border-base bg-bg-surface rounded-b-3xl">
                {items.filter(i => i.bottom).map(item => (
                    <DesktopItem key={item.path} item={item} isExpanded={isExpanded} />
                ))}

                <button onClick={handleLogout} className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 ${!isExpanded && 'justify-center'}`}>
                    <LogOut size={22} className="shrink-0" />

                    {/* CAMBIO 3: hidden total cuando no está expandido para no ocupar espacio invisible */}
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto ml-2' : 'hidden opacity-0 w-0'}`}>
                        Cerrar sesión
                    </span>

                    {/* Tooltip Logout - Posición absoluta y Z-Index alto */}
                    {!isExpanded && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100] px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                            Cerrar sesión
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                        </div>
                    )}
                </button>
            </div>
        </aside>
    );
};

const DesktopItem = ({ item, isExpanded }: { item: MenuItem, isExpanded: boolean }) => (
    <NavLink
        to={item.path}
        className={({ isActive }) => `
            flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
            ${!isExpanded && 'justify-center'}
            ${isActive ? 'bg-brand-primary/10 text-brand-primary font-semibold shadow-sm' : 'text-text-muted hover:bg-bg-canvas hover:text-text-main'}
        `}
    >
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">{item.icon}</div>

        {/* Texto colapsable con hidden */}
        <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto ml-2' : 'hidden opacity-0 w-0'}`}>
            {item.label}
        </span>

        {/* Tooltip Item */}
        {!isExpanded && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-[100] px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {item.label}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
            </div>
        )}
    </NavLink>
);