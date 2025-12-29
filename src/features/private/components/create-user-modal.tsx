import { useState } from 'react';
import { X, Save, Loader2, Activity } from 'lucide-react';
import { type UserRole } from '../../../types/auth.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (data: CreateUserPayload) => Promise<void>;
}

// Interfaz exportada para usarla en el hook si es necesario
export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    is_active: boolean;
}

export const CreateUserModal = ({ isOpen, onClose, onUserCreated }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client' as UserRole,
        is_active: true
    });

    const [confirmPassword, setConfirmPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Detiene la recarga de página

        // Evitar doble envío si ya está cargando
        if (isLoading) return;

        setIsLoading(true);
        setError('');

        // Validación simple de contraseñas
        if (formData.password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        try {
            // 1. Preparamos el payload
            const payload: CreateUserPayload = {
                ...formData
            };

            // 2. Llamamos a la función del padre (UsersPage -> Hook)
            // NO hacemos httpClient.post aquí. El hook se encarga.
            await onUserCreated(payload);

            // 3. Limpiar y cerrar solo si tuvo éxito
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'client',
                is_active: true
            });
            setConfirmPassword('');
            onClose();

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Error al crear usuario.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-bg-surface w-full max-w-lg rounded-3xl shadow-2xl border border-border-base overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-border-base flex justify-between items-center bg-card-bg shrink-0">
                    <h3 className="font-bold text-lg text-text-main">Nuevo Usuario</h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-text-muted hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body con Scroll */}
                <div className="overflow-y-auto p-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100">
                                {error}
                            </div>
                        )}

                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Nombre Completo</label>
                            <input required type="text" className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main transition-all"
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Correo Electrónico</label>
                            <input required type="email" className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main transition-all"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Contraseñas (Stack en móvil, Grid en Tablet) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Contraseña</label>
                                <input required type="password" minLength={8} className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main transition-all"
                                    value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Confirmar</label>
                                <input required type="password" className={`w-full px-4 py-3 rounded-xl bg-bg-canvas border outline-none text-text-main transition-all ${confirmPassword && formData.password !== confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-border-base focus:ring-brand-primary/20'}`}
                                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Roles y Estado (Stack en móvil, Grid en Tablet) */}
                        <div className="pt-2 border-t border-border-base/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Rol */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Rol de Usuario</label>
                                <div className="relative">
                                    <select className="w-full px-4 py-3 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main appearance-none cursor-pointer"
                                        value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                                    >
                                        <option value="client">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                    {/* Flecha custom */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4" /></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Estado */}
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-1.5">Estado de Cuenta</label>
                                <div className="relative">
                                    <select
                                        className={`w-full px-4 py-3 rounded-xl border border-border-base outline-none appearance-none font-medium cursor-pointer transition-colors
                                            ${formData.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}
                                        `}
                                        value={formData.is_active ? "1" : "0"}
                                        onChange={e => setFormData({ ...formData, is_active: e.target.value === "1" })}
                                    >
                                        <option value="1">Activada</option>
                                        <option value="0">Pendiente</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-60">
                                        <Activity size={18} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botones (Siempre abajo) */}
                        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
                            <button type="button" onClick={onClose} className="w-full sm:flex-1 py-3.5 rounded-xl border border-border-base text-text-muted font-bold hover:bg-bg-canvas transition-colors active:scale-95">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isLoading || formData.password !== confirmPassword} className="w-full sm:flex-1 py-3.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 shadow-lg shadow-brand-primary/20">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                Crear Usuario
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};