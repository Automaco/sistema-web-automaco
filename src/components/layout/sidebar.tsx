import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { MENU_ITEMS, type UserRole, type MenuItem } from '../../constants/menu-items';
import { ConfirmationModal } from '../../components/ui/confirmation-modal';
import { authService } from '../../services/auth.services';
import { type User } from '../../types/auth.types';
import { ProfileSwitcher } from '../../components/profile-switcher'; 

export const Sidebar = () => {
    // 1. OBTENER ROL DEL USUARIO
    const [userRole] = useState<UserRole>(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user: User = JSON.parse(userStr);
                return (user.role as UserRole) || 'client';
            } catch (error) {
                console.error("Error leyendo usuario", error);
                return 'client' as UserRole;
            }
        }
        return 'client' as UserRole;
    });

    // Estados UI
    // CAMBIO: Inicia en false (contraído)
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

    // Filtro Menu
    const filteredItems = MENU_ITEMS.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(userRole);
    });

    // Handlers Logout
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
                description="¿Estás seguro de que quieres salir del sistema?"
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
// COMPONENTE: MOBILE DRAWER
// ==========================================
const MobileDrawer = ({ isOpen, onClose, items, handleLogout }: { isOpen: boolean; onClose: () => void; items: MenuItem[]; handleLogout: () => void }) => {
    return (
        <aside className={`
            fixed top-0 left-0 z-50 h-screen flex flex-col w-[85vw] sm:w-80 max-w-[320px]
            bg-bg-surface border-r border-border-base shadow-2xl transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            {/* Header Móvil */}
            <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-border-base/50">
                <span className="font-bold text-xl text-brand-primary">AutomaCo</span>
                <button onClick={onClose} className="p-2 text-text-muted hover:text-red-500 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            {/* Profile Switcher Integrado */}
            <div className="p-4 pb-0">
                <ProfileSwitcher isExpanded={true} />
            </div>

            {/* Separador */}
            <div className="mx-4 my-2 border-b border-border-base/50"></div>

            {/* Items */}
            <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {items.filter(i => !i.bottom).map(item => (
                    <MobileItem key={item.path} item={item} onClick={onClose} />
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border-base/50 flex flex-col gap-2 bg-bg-surface shrink-0">
                {items.filter(i => i.bottom).map(item => (
                    <MobileItem key={item.path} item={item} onClick={onClose} />
                ))}
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 font-medium transition-colors">
                    <LogOut size={22} className="shrink-0" />
                    <span className="truncate">Cerrar sesión</span>
                </button>
            </div>
        </aside>
    );
};

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

// ==========================================
// COMPONENTE: DESKTOP SIDEBAR
// ==========================================
const DesktopSidebar = ({ isExpanded, toggleExpanded, items, handleLogout }: { isExpanded: boolean; toggleExpanded: () => void; items: MenuItem[]; handleLogout: () => void }) => {
    return (
        <aside className={`
            sticky top-4 left-4 h-[calc(100vh-2rem)] flex flex-col my-4 ml-4
            bg-bg-surface border border-border-base rounded-3xl shadow-xl
            transition-all duration-300 ease-in-out z-50 
            ${isExpanded ? 'w-72' : 'w-20'}
        `}>
            {/* Sección Perfil / Switcher */}
            <div className="pt-4 px-2 pb-2 relative">
                <ProfileSwitcher isExpanded={isExpanded} />
                
                {/* Botón Toggle */}
                <button 
                    onClick={toggleExpanded} 
                    className="absolute -right-3 top-10 bg-bg-surface border border-border-base text-text-muted hover:text-brand-primary rounded-full p-1.5 shadow-sm transition-colors z-100"
                >
                    {isExpanded ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                </button>
            </div>

            <div className="mx-4 border-b border-border-base mb-2 opacity-50"></div>

            {/* Items Navegación */}
            {/* CAMBIO: custom-scrollbar para scroll vertical, overflow-x-hidden para evitar horizontal */}
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
                    <span className={`whitespace-nowrap font-medium transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        Cerrar sesión
                    </span>
                    {!isExpanded && (
                        <div className="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                            Cerrar sesión
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
        
        {/* CAMBIO: overflow-hidden y w-0 para ocultar el texto sin romper el layout */}
        <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
            {item.label}
        </span>

        {!isExpanded && (
            <div className="absolute left-full ml-4 z-50 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl">
                {item.label}
            </div>
        )}
    </NavLink>
);