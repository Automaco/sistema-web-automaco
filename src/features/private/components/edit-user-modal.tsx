import { useState, useEffect } from 'react';
import { X, Save, Loader2, Lock } from 'lucide-react'; // Agregué el icono Lock
import { httpClient } from '../../../utils/http-client';
import { type User, type UserRole } from '../../../types/auth.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
    onUserUpdated: (user: User) => void;
}

// Definimos la interfaz para evitar el error "Unexpected any"
interface UpdateUserPayload {
    name: string;
    email: string;
    role: UserRole;
    password?: string;
}

export const EditUserModal = ({ isOpen, onClose, user, onUserUpdated }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Estado del formulario principal
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'client' as UserRole,
        password: '' // Nueva contraseña
    });

    // Estado separado para confirmar contraseña
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [error, setError] = useState('');

    // Cargar datos al abrir
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                role: user.role,
                password: '' // Siempre inicia vacía por seguridad
            });
            setConfirmPassword(''); // Reseteamos la confirmación
            setError('');
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // 1. VALIDACIÓN DE CONTRASEÑA
        if (formData.password.trim() !== '') {
            if (formData.password.length < 8) {
                setError('La nueva contraseña debe tener al menos 8 caracteres.');
                setIsLoading(false);
                return;
            }
            if (formData.password !== confirmPassword) {
                setError('Las contraseñas no coinciden. Por favor verifica.');
                setIsLoading(false);
                return;
            }
        }

        try {
            // 2. PREPARAR PAYLOAD CON TIPADO CORRECTO
            const payload: UpdateUserPayload = {
                name: formData.name,
                email: formData.email,
                role: formData.role
            };

            // Solo enviamos la contraseña si el usuario escribió algo
            if (formData.password.trim() !== '') {
                payload.password = formData.password;
            }

            // 3. PETICIÓN AL SERVIDOR
            // Especificamos que la respuesta tiene la forma { user: User }
            const response = await httpClient.put<{ user: User }>(`/users/${user.id}`, payload);
            
            onUserUpdated(response.user);
            onClose();
        } catch {
            setError('Error al actualizar. Verifica los datos.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border-base overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-base flex justify-between items-center bg-card-bg sticky top-0 z-10">
                    <h3 className="font-bold text-lg text-text-main">Editar Usuario</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Alerta de Error */}
                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-300 text-sm rounded-xl font-medium animate-pulse">
                            {error}
                        </div>
                    )}

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Nombre</label>
                        <input 
                            required
                            type="text"
                            className="w-full px-4 py-2.5 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    {/* Correo */}
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico</label>
                        <input 
                            required
                            type="email"
                            className="w-full px-4 py-2.5 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {/* Sección de Cambio de Contraseña */}
                    <div className="pt-2 border-t border-border-base/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Lock size={16} className="text-brand-primary"/>
                            <span className="text-sm font-bold text-text-main">Seguridad</span>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-text-muted mb-1">
                                    Nueva Contraseña <span className="font-normal opacity-70">(Opcional)</span>
                                </label>
                                <input 
                                    type="password"
                                    minLength={8}
                                    placeholder="Dejar vacío para mantener la actual"
                                    className="w-full px-4 py-2.5 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main placeholder:text-text-muted/40 transition-all"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            {/* CAMPO DE CONFIRMACIÓN - Solo visible si se escribe contraseña */}
                            {formData.password.length > 0 && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-xs font-medium text-text-muted mb-1">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <input 
                                        type="password"
                                        placeholder="Repite la contraseña"
                                        className={`
                                            w-full px-4 py-2.5 rounded-xl bg-bg-canvas border outline-none text-text-main transition-all
                                            ${confirmPassword && formData.password !== confirmPassword 
                                                ? 'border-red-300 focus:ring-2 focus:ring-red-200' 
                                                : 'border-border-base focus:ring-2 focus:ring-brand-primary/20'}
                                        `}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                    />
                                    {confirmPassword && formData.password !== confirmPassword && (
                                        <p className="text-xs text-red-500 mt-1 ml-1">Las contraseñas no coinciden</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Rol</label>
                        <div className="relative">
                            <select 
                                className="w-full px-4 py-2.5 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main appearance-none cursor-pointer"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
                            >
                                <option value="client">Cliente (Estándar)</option>
                                <option value="admin">Administrador</option>
                            </select>
                            {/* Flecha custom para el select */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="flex-1 py-3 rounded-xl border border-border-base text-text-muted font-bold hover:bg-bg-canvas transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading || (formData.password.length > 0 && formData.password !== confirmPassword)} 
                            className="flex-1 py-3 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark transition-all active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};