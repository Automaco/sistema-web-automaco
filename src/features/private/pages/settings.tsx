// Pagina de configuracion
import { useState } from 'react';
import {
    User, Moon, Lock, Mail, Trash2, LogOut, ChevronRight, Camera
} from 'lucide-react';

import { useLogin } from '../../auth/hooks/use-login';
import { useTheme } from '../../../context/theme-context';

// Tipos para las secciones disponibles
type SectionType = 'profile' | 'password' | 'email' | 'delete';

export const SettingPage = () => {
    // Estado para controlar qué sección se muestra a la derecha
    const [activeSection, setActiveSection] = useState<SectionType>('profile');
    // USAMOS EL HOOK DEL CONTEXTO
    const { theme, toggleTheme } = useTheme();
    
    // Derivamos el booleano para el switch visual
    const isDarkMode = theme === 'dark';

    return (
        // Contenedor principal con scroll suave si es necesario
        <div className="flex flex-col h-full w-full p-2 md:p-1 bg-card-bg overflow-y-auto rounded-3xl">
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">


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
                                        description="Nombre de la institución, correo y avatar."
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
                                                    Visualizar el sistema en modo oscuro.
                                                </p>
                                            </div>
                                        </div>

                                        {/* 4. BOTÓN CONECTADO AL CONTEXTO */}
                                        <button
                                            onClick={toggleTheme} // <--- Acción real del contexto
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
                                        description="Selección de cambio de correo electrónico para notificaciones."
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
                                    <button className="flex items-center gap-3 text-text-muted hover:text-red-500 transition-colors font-medium w-full group">
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
            return <PlaceholderView title="Nueva Contraseña" icon={<Lock size={48} />} />;
        case 'email':
            return <PlaceholderView title="Configuración de Correo" icon={<Mail size={48} />} />;
        case 'delete':
            return <DeleteAccountView />;
        default:
            return <ProfileView />;
    }
};

// 3. VISTA: PERFIL (Igual a tu imagen)
const ProfileView = () => (

    <div className="flex flex-col items-center text-center w-full max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-text-main mb-8">Tu perfil</h2>

        <div className="w-full space-y-6 border-t  border-border-base">
            <div className="text-left mt-4">
                <label className="text-sm font-semibold text-text-muted ml-1 mb-2 block">Nombre de la institución</label>
                <input
                    type="text"
                    placeholder="Escribe el nombre aquí"
                    defaultValue="nombre default"
                    className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-text-main"
                />
            </div>

            <div className="text-left">
                <label className="text-sm font-semibold text-text-muted ml-1 mb-2 block">Correo electrónico</label>
                <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    defaultValue="admin@techsolutions.com"
                    className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-text-main"
                />
            </div>

            <div className="h-4"></div> {/* Spacer */}

            <button className="w-full bg-brand-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-brand-primary/25 hover:bg-brand-dark transition-all active:scale-[0.98]">
                Actualizar información
            </button>

            <button className="w-full bg-transparent text-text-muted font-semibold py-3.5 rounded-2xl border border-border-base hover:bg-bg-canvas transition-colors">
                Cancelar
            </button>
        </div>
    </div>
);

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