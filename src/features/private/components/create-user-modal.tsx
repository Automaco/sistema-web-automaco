import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { httpClient } from '../../../utils/http-client';
import { type User, type UserRole } from '../../../types/auth.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: (user: User) => void; // Callback para actualizar la tabla
}

// Interfaz para la respuesta del Backend al crear
interface CreateUserResponse {
    message: string;
    user: User;
}

export const CreateUserModal = ({ isOpen, onClose, onUserCreated }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'client'
    });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await httpClient.post<CreateUserResponse>('/users', formData);
            onUserCreated(response.user); // Pasamos el usuario nuevo al padre
            onClose(); // Cerramos modal
            setFormData({ name: '', email: '', password: '', role: 'client' }); 
        } catch (err) {
            console.error(err);
            setError('Error al crear usuario. Verifica el correo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border-base overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-border-base flex justify-between items-center bg-card-bg">
                    <h3 className="font-bold text-lg text-text-main">Nuevo Usuario</h3>
                    <button onClick={onClose} className="text-text-muted hover:text-red-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 bg-red-100 text-red-600 text-sm rounded-lg">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Nombre</label>
                        <input 
                            required
                            type="text"
                            className="w-full px-4 py-2 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Correo Electrónico</label>
                        <input 
                            required
                            type="email"
                            className="w-full px-4 py-2 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Contraseña</label>
                        <input 
                            required
                            type="password"
                            minLength={8}
                            className="w-full px-4 py-2 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1">Rol</label>
                        <select 
                            className="w-full px-4 py-2 rounded-xl bg-bg-canvas border border-border-base focus:ring-2 focus:ring-brand-primary/20 outline-none text-text-main"
                            value={formData.role}
                            onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                        >
                            <option value="client">Cliente (Estándar)</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-border-base text-text-muted font-medium hover:bg-bg-canvas transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />}
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};