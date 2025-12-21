import { useEffect, useState } from 'react';
import { httpClient } from '../../../utils/http-client';
import { type User, type UserRole } from '../../../types/auth.types'; // Importamos UserRole explícitamente
import { Trash2, Shield, ShieldAlert, Plus, Loader2, Link2, Edit2 } from 'lucide-react'; // Agregamos Edit2
import { CreateUserModal } from '../components/create-user-modal';
import { LinkedAccountsModal } from '../components/linked-accounts-modal'; 
import { EditUserModal } from '../components/edit-user-modal'; // <--- NUEVO MODAL
import { StatusModal, type ModalType } from '../../../components/ui/status-modal'; 

export const UsersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Estados de Modales
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // <--- NUEVO
    const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
    
    // Usuario seleccionado para ver cuentas O para editar
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        description: string;
    }>({ isOpen: false, type: 'info', title: '', description: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await httpClient.get<User[]>('/users');
            setUsers(data);
        } catch (error) {
            console.error("Error cargando usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserCreated = (newUser: User) => {
        setUsers([...users, newUser]);
        setStatusModal({ isOpen: true, type: 'success', title: 'Usuario Creado', description: `El usuario ${newUser.name} ha sido registrado.` });
    };

    // --- NUEVO: Callback para cuando se edita un usuario ---
    const handleUserUpdated = (updatedUser: User) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setStatusModal({ isOpen: true, type: 'success', title: 'Usuario Actualizado', description: `Los datos de ${updatedUser.name} han sido guardados.` });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return; 
        try {
            await httpClient.delete(`/users/${id}`);
            setUsers(users.filter(u => u.id !== id));
            setStatusModal({ isOpen: true, type: 'success', title: 'Eliminado', description: 'El usuario ha sido eliminado correctamente.' });
        } catch {
            setStatusModal({ isOpen: true, type: 'error', title: 'Error', description: 'No se pudo eliminar el usuario.' });
        }
    };

    // --- CORRECCIÓN DE TIPO EN TOGGLE ROLE ---
    const toggleRole = async (user: User) => {
        // Forzamos el tipo UserRole para que TypeScript no se confunda con strings genéricos
        const newRole: UserRole = user.role === 'admin' ? 'client' : 'admin'; 
        
        try {
            // Optimistic UI: Actualizamos localmente primero (opcional, aquí lo hacemos después del await para seguridad)
            await httpClient.put(`/users/${user.id}`, { ...user, role: newRole });
            
            // Actualizamos el estado con el tipo correcto
            setUsers(prevUsers => prevUsers.map(u => 
                u.id === user.id ? { ...u, role: newRole } : u
            ));
        } catch {
            setStatusModal({ isOpen: true, type: 'error', title: 'Error', description: 'No se pudo actualizar el rol.' });
        }
    };

    const openAccountsModal = (user: User) => {
        setSelectedUser(user);
        setIsAccountsModalOpen(true);
    };

    // --- NUEVO: Función para abrir modal de edición ---
    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    if (loading) return <div className="flex justify-center items-center h-[calc(100vh-100px)] w-full"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto w-full space-y-8">
            
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-text-main">Administración de Usuarios</h1>
                        <p className="text-text-muted mt-2 text-lg">Controla el acceso, roles y vinculaciones de tu equipo.</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-brand-primary/25 hover:bg-brand-dark hover:scale-[1.02] transition-all active:scale-95">
                        <Plus size={22} strokeWidth={2.5} /> Nuevo Usuario
                    </button>
                </div>

                {/* Tabla */}
                <div className="bg-bg-surface rounded-[2rem] shadow-sm border border-border-base overflow-hidden animate-fade-in-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-card-bg/50 border-b border-border-base">
                                <tr>
                                    <th className="p-6 pl-8 font-semibold text-text-muted text-xs uppercase tracking-wider">Usuario</th>
                                    <th className="p-6 font-semibold text-text-muted text-xs uppercase tracking-wider text-center">Rol</th>
                                    <th className="p-6 font-semibold text-text-muted text-xs uppercase tracking-wider text-center">Vinculaciones</th>
                                    <th className="p-6 pr-8 font-semibold text-text-muted text-xs uppercase tracking-wider text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-base">
                                {users.length === 0 ? (
                                    <tr><td colSpan={4} className="p-16 text-center text-text-muted">No hay usuarios registrados.</td></tr>
                                ) : (
                                    users.map((u) => (
                                        <tr key={u.id} className="hover:bg-bg-canvas/60 transition-colors group">
                                            {/* Usuario */}
                                            <td className="p-5 pl-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 text-brand-primary font-bold flex items-center justify-center text-sm shrink-0 uppercase border border-brand-primary/10 shadow-sm">
                                                        {u.name.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-text-main text-sm">{u.name}</div>
                                                        <div className="text-xs text-text-muted font-medium">{u.email}</div>
                                                        {/* --- INDICADOR DE ACTIVACIÓN (OPCIONAL) --- */}
                                                        {/* Puedes mostrar si está activa o no basada en u.email_verified_at o u.is_active si viene del backend */}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Rol */}
                                            <td className="p-5 text-center">
                                                <button onClick={() => toggleRole(u)} className={`relative inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border shadow-sm ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple dark:border-purple-800' : 'bg-brand-primary text-white border-brand-primary/200 '}`}>
                                                    {u.role === 'admin' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                                                    <span className="uppercase tracking-wide">{u.role}</span>
                                                </button>
                                            </td>

                                            {/* Vinculaciones */}
                                            <td className="p-5 text-center">
                                                <button onClick={() => openAccountsModal(u)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors border border-brand-primary/10">
                                                    <Link2 size={14} strokeWidth={2.5}/> Ver Cuentas
                                                    {u.connected_accounts && u.connected_accounts.length > 0 && <span className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] ml-1">{u.connected_accounts.length}</span>}
                                                </button>
                                            </td>

                                            {/* Acciones (Editar y Eliminar) */}
                                            <td className="p-5 pr-8 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* BOTÓN EDITAR */}
                                                    <button onClick={() => openEditModal(u)} className="p-2.5 rounded-xl text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-all scale-90 group-hover:scale-100" title="Editar usuario">
                                                        <Edit2 size={18} strokeWidth={2.5} />
                                                    </button>
                                                    {/* BOTÓN ELIMINAR */}
                                                    <button onClick={() => handleDelete(u.id)} className="p-2.5 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all scale-90 group-hover:scale-100" title="Eliminar usuario">
                                                        <Trash2 size={18} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODALES --- */}
            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleUserCreated} />
            <LinkedAccountsModal isOpen={isAccountsModalOpen} onClose={() => setIsAccountsModalOpen(false)} user={selectedUser} />
            
            {/* MODAL DE EDICIÓN */}
            <EditUserModal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                user={selectedUser} 
                onUserUpdated={handleUserUpdated} 
            />

            <StatusModal isOpen={statusModal.isOpen} onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))} type={statusModal.type} title={statusModal.title} description={statusModal.description} />
        </div>
    );
};