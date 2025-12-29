/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { User, Moon, Lock, Mail, Trash2, LogOut, ChevronRight, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { Input, PasswordInput, Button } from '../../../components/index';
import { useSettings } from '../hooks/use-settings';
import { ConfirmationModal } from '../../../components/ui/confirmation-modal';
import { useTheme } from '../../../context/theme-context';
import { StatusModal } from '../../../components/ui/status-modal';

type SectionType = 'profile' | 'password' | 'email' | 'delete';

interface ViewProps {
    hook: ReturnType<typeof useSettings>;
}

export const SettingPage = () => {
    const settingsHook = useSettings();
    const [activeSection, setActiveSection] = useState<SectionType>('profile');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true); // Control para móviles
    const { theme, toggleTheme } = useTheme();

    const isDarkMode = theme === 'dark';
    const { isLogoutModalOpen, isLoggingOut, confirmLogout, closeLogoutModal, handleLogoutClick } = settingsHook;

    // Handler para navegación móvil
    const handleSectionClick = (section: SectionType) => {
        setActiveSection(section);
        setIsMobileMenuOpen(false); // Ocultar menú en móvil al seleccionar
    };

    return (
        <div className="flex flex-col h-full w-full p-2 md:p-4 overflow-hidden rounded-2xl shadow-lg bg-card-bg border-border-bases">
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">

                {/* Modal Logout */}
                <ConfirmationModal
                    isOpen={isLogoutModalOpen}
                    onClose={closeLogoutModal}
                    onConfirm={confirmLogout}
                    isLoading={isLoggingOut}
                    type="danger"
                    title="¿Cerrar sesión?"
                    description="¿Estás seguro de que quieres salir del sistema?"
                    confirmText="Sí, salir"
                    cancelText="Cancelar"
                />

                <div className="flex items-center justify-between mb-6 px-2">
                    <h1 className="text-3xl font-bold text-text-main">Configuración</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">

                    {/* --- MENU IZQUIERDO (Responsive) --- */}
                    <div className={`
                        w-full lg:w-80 bg-bg-surface rounded-3xl p-4 shadow-sm border border-border-base flex-shrink-0 overflow-y-auto
                        ${isMobileMenuOpen ? 'block' : 'hidden lg:block'} 
                    `}>
                        <div className="space-y-1">
                            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-3 mt-2">Cuenta</h2>

                            <SettingsItem
                                icon={<User size={18} />}
                                title="Perfil"
                                isActive={activeSection === 'profile'}
                                onClick={() => handleSectionClick('profile')}
                            />
                            <SettingsItem
                                icon={<Lock size={18} />}
                                title="Seguridad"
                                isActive={activeSection === 'password'}
                                onClick={() => handleSectionClick('password')}
                            />
                            <SettingsItem
                                icon={<Mail size={18} />}
                                title="Conexiones"
                                isActive={activeSection === 'email'}
                                onClick={() => handleSectionClick('email')}
                            />

                            <div className="my-4 border-t border-border-base" />

                            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 px-3">Preferencias</h2>

                            {/* Switch Modo Oscuro */}
                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-bg-canvas transition-colors group text-left"
                            >
                                <div className="flex gap-3 items-center">
                                    <div className="text-text-muted group-hover:text-brand-primary"><Moon size={18} /></div>
                                    <span className="text-sm font-medium text-text-main">Modo oscuro</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${isDarkMode ? 'bg-brand-primary' : 'bg-gray-300'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </button>

                            <div className="mt-auto pt-4">
                                <SettingsItem
                                    icon={<Trash2 size={18} />}
                                    title="Eliminar Cuenta"
                                    isActive={activeSection === 'delete'}
                                    variant="danger"
                                    onClick={() => handleSectionClick('delete')}
                                />
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors mt-2 text-sm font-medium"
                                >
                                    <LogOut size={18} /> Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- PANEL DERECHO (Contenido) --- */}
                    <div className={`
                        flex-1 bg-bg-surface rounded-3xl shadow-sm border border-border-base overflow-hidden flex flex-col
                        ${!isMobileMenuOpen ? 'block' : 'hidden lg:block'}
                    `}>
                        {/* Header Móvil del Panel Derecho */}
                        <div className="lg:hidden p-4 border-b border-border-base flex items-center gap-2">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 rounded-lg hover:bg-bg-canvas text-text-muted">
                                <ArrowLeft size={20} />
                            </button>
                            <span className="font-bold text-text-main">Volver</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-14">
                            <div className="max-w-2xl mx-auto animate-fade-in">
                                {activeSection === 'profile' && <ProfileView hook={settingsHook} />}
                                {activeSection === 'password' && <ChangePasswordView hook={settingsHook} />}
                                {activeSection === 'email' && <EmailSettingsView hook={settingsHook} />}
                                {activeSection === 'delete' && <DeleteAccountView hook={settingsHook} />}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

const SettingsItem = ({ icon, title, isActive, variant = 'default', onClick }: any) => {
    const activeClass = variant === 'danger'
        ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-900'
        : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';

    const inactiveClass = variant === 'danger'
        ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10'
        : 'text-text-muted hover:bg-bg-canvas hover:text-text-main';

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${isActive ? `${activeClass}` : `border-transparent ${inactiveClass}`}`}
        >
            <div className="flex gap-3 items-center">
                <div>{icon}</div>
                <span className="text-sm font-medium">{title}</span>
            </div>
            {isActive && <ChevronRight size={16} />}
        </button>
    );
};

// VISTA PERFIL
const ProfileView = ({ hook }: ViewProps) => {
    const { profileForm, errors, isLoading, handleProfileChange, updateProfile } = hook;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-text-main">Información Personal</h2>
                <p className="text-text-muted text-sm mt-1">Actualiza tu información básica y de contacto.</p>
            </div>

            <form onSubmit={updateProfile} className="flex flex-col gap-5">
                <div className="grid gap-5">
                    <Input label="Nombre Completo" name="name" type="text" value={profileForm.name} onChange={handleProfileChange} error={errors.name} />
                    <Input label="Correo electrónico" name="email" type="email" value={profileForm.email} onChange={handleProfileChange} icon={<Mail size={18} />} error={errors.email} />
                </div>

                <div className="flex justify-end pt-4 border-t border-border-base">
                    <Button type="submit" className="w-full sm:w-auto px-8" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Guardar Cambios'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

// VISTA PASSWORD
const ChangePasswordView = ({ hook }: ViewProps) => {
    const { passwordForm, errors, isLoading, handlePasswordChange, updatePassword } = hook;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-text-main">Seguridad</h2>
                <p className="text-text-muted text-sm mt-1">Mantén tu cuenta segura actualizando tu contraseña regularmente.</p>
            </div>

            <form onSubmit={updatePassword} className="flex flex-col gap-5 bg-bg-canvas/50 p-6 rounded-2xl border border-border-base">
                <PasswordInput label="Contraseña Actual" name="current_password" value={passwordForm.current_password} onChange={handlePasswordChange} error={errors.current_password} />
                <hr className="border-border-base border-dashed my-2" />
                <div className="grid gap-5 md:grid-cols-2">
                    <PasswordInput label="Nueva Contraseña" name="password" value={passwordForm.password} onChange={handlePasswordChange} error={errors.password} />
                    <PasswordInput label="Confirmar Nueva" name="password_confirmation" value={passwordForm.password_confirmation} onChange={handlePasswordChange} error={errors.password_confirmation} />
                </div>

                <div className="flex justify-end pt-2">
                    <Button type="submit" className="w-full sm:w-auto px-8" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Actualizar Contraseña'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

// VISTA EMAIL
const EmailSettingsView = ({ hook }: ViewProps) => {
    const { connectedAccounts, connectProvider, disconnectProvider, isLoading } = hook;
    const googleAccount = connectedAccounts.find((acc: any) => acc.email_provider_id === 1);
    const outlookAccount = connectedAccounts.find((acc: any) => acc.email_provider_id === 2);

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold text-text-main">Cuentas Conectadas</h2>
                <p className="text-text-muted text-sm mt-1">Gestiona los servicios externos vinculados para la descarga de DTEs.</p>
            </div>

            <div className="grid gap-4">
                {/* Google Card */}
                <div className="p-5 rounded-2xl border border-border-base bg-bg-canvas flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:border-border-base/80">
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm text-red-500 font-bold text-xl border border-border-base">G</div>
                        <div>
                            <h3 className="font-bold text-text-main">Google</h3>
                            {googleAccount ? (
                                <p className="text-sm text-green-600 flex items-center gap-1.5 font-medium mt-0.5">
                                    <CheckCircle2 size={14} /> {googleAccount.email}
                                </p>
                            ) : (
                                <p className="text-sm text-text-muted mt-0.5">Sin conectar</p>
                            )}
                        </div>
                    </div>
                    {googleAccount ? (
                        <button onClick={() => disconnectProvider(1)} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100">
                            Desvincular
                        </button>
                    ) : (
                        <button onClick={() => connectProvider('google')} className="w-full sm:w-auto px-5 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            Conectar
                        </button>
                    )}
                </div>

                {/* Outlook Card */}
                <div className="p-5 rounded-2xl border border-border-base bg-bg-canvas flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:border-border-base/80">
                    <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 bg-[#0078D4] rounded-xl flex items-center justify-center shadow-sm text-white font-bold text-xl">O</div>
                        <div>
                            <h3 className="font-bold text-text-main">Outlook</h3>
                            {outlookAccount ? (
                                <p className="text-sm text-green-600 flex items-center gap-1.5 font-medium mt-0.5">
                                    <CheckCircle2 size={14} /> {outlookAccount.email}
                                </p>
                            ) : (
                                <p className="text-sm text-text-muted mt-0.5">Sin conectar</p>
                            )}
                        </div>
                    </div>
                    {outlookAccount ? (
                        <button onClick={() => disconnectProvider(2)} disabled={isLoading} className="w-full sm:w-auto px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100">
                            Desvincular
                        </button>
                    ) : (
                        <button onClick={() => connectProvider('outlook')} className="w-full sm:w-auto px-5 py-2 text-sm bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm">
                            Conectar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// VISTA ELIMINAR
const DeleteAccountView = ({ hook }: ViewProps) => {
    const { 
        deletePassword, 
        setDeletePassword, 
        isLoading, 
        requestDeleteAccount, 
        executeDeleteAccount,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        // Traemos el estado del StatusModal del hook
        statusModal,
        closeStatusModal
    } = hook;

    return (
        <div className="flex flex-col items-center justify-center h-full text-center w-full max-w-lg mx-auto relative">
            
            {/* 1. MODAL DE CONFIRMACIÓN (Pregunta: ¿Seguro?) */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={executeDeleteAccount}
                isLoading={isLoading}
                type="danger"
                title="¿Eliminar cuenta permanentemente?"
                description="Esta acción no se puede deshacer. Se borrarán todos tus datos y configuraciones. ¿Estás absolutamente seguro?"
                confirmText="Sí, eliminar todo"
                cancelText="Cancelar"
            />

            {/* 2. TU STATUS MODAL (Para mostrar errores como: Contraseña incorrecta) */}
            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={closeStatusModal}
                type={statusModal.type}
                title={statusModal.title}
                description={statusModal.description}
                buttonText="Entendido"
            />

            {/* Contenido Visual */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mb-6">
                <Trash2 size={32} />
            </div>

            <h2 className="text-2xl font-bold text-text-main mb-2">Eliminar Cuenta</h2>

            <p className="text-text-muted mb-8 text-sm leading-relaxed">
                Esta acción es <strong>permanente e irreversible</strong>. Todos tus datos, configuraciones, historial de descargas y vinculaciones serán eliminados inmediatamente de nuestros servidores.
            </p>

            <form onSubmit={requestDeleteAccount} className="w-full flex flex-col gap-4 bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                <div className="text-left">
                    <label className="block text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">
                        Confirma tu contraseña para continuar
                    </label>
                    <PasswordInput
                        name="delete_password"
                        label="" 
                        placeholder="Tu contraseña actual"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading || deletePassword.length < 1}
                    className="w-full bg-red-600 hover:bg-red-700 text-white border-transparent shadow-lg shadow-red-500/20 flex justify-center items-center gap-2 h-12"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        'Sí, eliminar mi cuenta permanentemente'
                    )}
                </Button>
            </form>
        </div>
    );
};