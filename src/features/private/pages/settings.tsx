// Pagina de configuracion
import { useState } from 'react';
import {
    User, Moon, Lock, Mail, Trash2, LogOut, ChevronRight, Camera
} from 'lucide-react';
import { Input, PasswordInput, Button } from '../../../components/index';
import { useSettings } from '../hooks/use-settings';
import { ConfirmationModal } from '../../../components/ui/confirmation-modal';

// Tipos para las secciones disponibles
type SectionType = 'profile' | 'password' | 'email' | 'delete';


export const SettingPage = () => {
    // Estado para controlar qué sección se muestra a la derecha
    const [activeSection, setActiveSection] = useState<SectionType>('profile');
    // Estado simulado para el modo oscuro (toggle directo)
    const [isDarkMode, setIsDarkMode] = useState(false);
    const {
        // LOGOUT: cierre de sesion
        isLogoutModalOpen,
        isLoggingOut,
        handleLogoutClick,
        confirmLogout,
        closeLogoutModal
    } = useSettings();

    return (
        // Contenedor principal con scroll suave si es necesario
        <div className="flex flex-col h-full w-full p-2 md:p-1 bg-card-bg overflow-y-auto rounded-3xl border border-border-base">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">
                {/* --- Modal - cierre de sesion --- */}
                <ConfirmationModal
                    isOpen={isLogoutModalOpen}
                    onClose={closeLogoutModal}
                    onConfirm={confirmLogout}
                    isLoading={isLoggingOut}
                    type="danger"
                    title="¿Cerrar sesión?"
                    description="¿Estás seguro de que quieres salir del sistema? Tendrás que volver a ingresar tus credenciales."
                    confirmText="Sí, salir"
                    cancelText="Cancelar"
                />

                <div className="flex flex-col h-full w-full p-4 md:p-6 bg-canvas overflow-y-auto">
                    <div className="max-w-6xl mx-auto w-full">

                        {/* Header Simple */}
                        <h1 className="text-3xl font-bold text-text-main mb-5">Configuraciones</h1>

                        <div className="flex flex-col lg:flex-row gap-6 items-start">

                            {/* --- IZQUIERDA: MENÚ DE NAVEGACIÓN --- */}
                            <div className="w-full lg:w-1/3 bg-bg-surface rounded-3xl p-6 shadow-sm border border-border-base sticky top-2">
                                <h2 className="text-xl font-bold text-text-main mb-6 border-b border-border-base pb-4">
                                    General
                                </h2>

                                <div className="space-y-2">
                                    {/* Opción: PERFIL */}
                                    <SettingsItem
                                        icon={<User size={20} />}
                                        title="Perfil"
                                        description="Nombre de la institución, correo"
                                        isActive={activeSection === 'profile'}
                                        onClick={() => setActiveSection('profile')}
                                    />

                                    {/* Opción: MODO OSCURO (Switch directo) */}
                                    <div className="flex items-center justify-between group p-2 rounded-xl transition-colors">
                                        <div className="flex gap-4">
                                            <div className="mt-1 text-text-muted group-hover:text-brand-primary transition-colors">
                                                <Moon size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-text-main">Modo oscuro</h3>
                                                <p className="text-xs text-text-muted mt-1 max-w-[200px]">
                                                    Visualizar el sistema en modo oscuro para descansar la vista.
                                                </p>
                                            </div>
                                        </div>
                                        {/* Switch Toggle Simulado */}
                                        <button
                                            onClick={() => setIsDarkMode(!isDarkMode)}
                                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${isDarkMode ? 'bg-brand-primary' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Opción: CONTRASEÑA */}
                                    <SettingsItem
                                        icon={<Lock size={20} />}
                                        title="Nueva contraseña"
                                        description="Establecer una nueva contraseña para proteger tu cuenta."
                                        isActive={activeSection === 'password'}
                                        onClick={() => setActiveSection('password')}
                                    />

                                    {/* Opción: CORREO */}
                                    <SettingsItem
                                        icon={<Mail size={20} />}
                                        title="Configuración de correo"
                                        description="Establecer datos para el operador de correo electronico"
                                        isActive={activeSection === 'email'}
                                        onClick={() => setActiveSection('email')}
                                    />

                                    {/* Opción: ELIMINAR CUENTA */}
                                    <div className="pt-4 border-t border-border-base">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-4">
                                                <div className="mt-1 text-red-500">
                                                    <Trash2 size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-text-main">Eliminar cuenta</h3>
                                                    <p className="text-xs text-text-muted mt-1">
                                                        Ya no serás capaz de iniciar sesión y perderás todos los datos.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setActiveSection('delete')}
                                                className="mt-3 w-full bg-red-500 text-white hover:bg-red-600 font-medium py-2 rounded-xl text-sm transition-colors"
                                            >

                                                Eliminar cuenta permanentemente
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer: CERRAR SESIÓN */}

                                <div className="mt-8 pt-6 border-t border-border-base">
                                    <button
                                        onClick={handleLogoutClick} // 👈 CONECTADO AQUÍ
                                        className="flex items-center gap-3 text-text-muted hover:text-red-500 transition-colors font-medium w-full group"
                                    >
                                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                                        Cerrar sesión
                                    </button>
                                </div>



                            </div>

                            {/* --- DERECHA: PANEL DE CONTENIDO DINÁMICO --- */}
                            <div className="w-full lg:w-2/3">
                                <div className="bg-bg-surface rounded-3xl p-14 shadow-sm border border-border-base min-h-[500px] animate-fade-in-up">
                                    {renderContent(activeSection)}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTES AUXILIARES ---

// 1. Item de la lista de la izquierda
const SettingsItem = ({ icon, title, description, isActive, onClick }: any) => (

    <div
        onClick={onClick}
        className={`flex items-center justify-between cursor-pointer group p-3 -mx-3 rounded-2xl transition-all duration-200 
        ${isActive ? 'bg-brand-primary/10 border border-brand-primary/20' : 'hover:bg-gray-50 border border-transparent'}`}
    >
        <div className="flex gap-4">
            <div className={`mt-1 transition-colors ${isActive ? 'text-brand-primary' : 'text-text-muted group-hover:text-brand-primary'}`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-semibold transition-colors ${isActive ? 'text-brand-primary' : 'text-text-main'}`}>
                    {title}
                </h3>
                <p className="text-xs text-text-muted mt-1 max-w-[220px]">
                    {description}
                </p>
            </div>
        </div>
        <ChevronRight size={18} className={`text-text-muted transition-transform ${isActive ? 'text-brand-primary rotate-90' : ''}`} />
    </div>
);

// 2. Función para renderizar el contenido derecho
const renderContent = (section: SectionType) => {
    switch (section) {
        case 'profile':
            return <ProfileView />;
        case 'password':
            return <ChangePasswordView />;
        case 'email':
            return <PlaceholderView title="Configuración de Correo" icon={<Mail size={48} />} />;
        case 'delete':
            return <DeleteAccountView />;
        default:
            return <ProfileView />;
    }
};

// 3. VISTA: PERFIL (Igual a tu imagen)
const ProfileView = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        handleReset
    } = useSettings();

    return (
        <div className="flex flex-col items-center text-center w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-text-main mb-8">Tu perfil</h2>

            <div className="w-full space-y-6 border-t  border-border-base mb-4">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center mt-4">
                    <Input
                        label="Nombre de la institución"
                        name="text"
                        type="text"
                        placeholder="Nombre"
                        value={formData.text}
                        onChange={handleInputChange}
                        error={errors.text}
                    />
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        placeholder="nombre@ejemplo.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        // Aquí pasamos el icono como componente, mucho más flexible
                        icon={<Mail size={20} />}
                        error={errors.email}
                    />

                    <Button type="submit" className="mt-1" disabled={isLoading} >
                        {isLoading ? '...' : 'Actualizar informacion'}
                    </Button>

                    <Button type="button" variant="outline" className="mt-1" disabled={isLoading} onClick={handleReset}>
                        {isLoading ? '...' : 'Cancelar'}
                    </Button>

                </form>
            </div>
        </div>);

};

// 5. Cambio de contraseña
const ChangePasswordView = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        handleReset
    } = useSettings();

    return (
        <div className="flex flex-col items-center text-center w-full max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-text-main mb-8">Nueva contraseña</h2>

            <div className="w-full space-y-6 border-t border-border-base">
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center mt-4">
                    <PasswordInput
                        label="Contraseña"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />
                    <PasswordInput
                        label="Confirmar contraseña"
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                    />

                    <Button type="submit" className="mt-1" disabled={isLoading} >
                        {isLoading ? '...' : 'Actualizar contraseña'}
                    </Button>

                    <Button type="submit" variant="outline" className="mt-1" disabled={isLoading} onClick={handleReset}>
                        {isLoading ? '...' : 'Cancelar'}
                    </Button>

                </form>
            </div>
        </div>
    )
};


// 4. VISTA: ELIMINAR CUENTA
const DeleteAccountView = () => (
    <div className="flex flex-col items-center justify-center h-full text-center py-10">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6 animate-pulse">
            <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-text-main mb-2">¿Estás seguro?</h2>
        <p className="text-text-muted max-w-sm mb-8">
            Esta acción es irreversible. Todos tus datos, facturas y configuraciones serán eliminados permanentemente.
        </p>
        <div className="flex gap-4 w-full max-w-sm">
            <button className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors">
                Cancelar
            </button>
            <button className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/30 transition-colors">
                Sí, Eliminar
            </button>
        </div>
    </div>
);


// 5. VISTA: PLACEHOLDER (Para secciones no implementadas aún)
const PlaceholderView = ({ title, icon }: any) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center opacity-50">
        <div className="mb-4 text-gray-300">{icon}</div>
        <h2 className="text-xl font-bold text-text-muted">{title}</h2>
        <p className="text-sm text-gray-400">Panel en construcción</p>
    </div>
);