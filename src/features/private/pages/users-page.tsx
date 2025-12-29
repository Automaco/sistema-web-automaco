import { useState, useMemo } from 'react';
import { type User, type UserRole } from '../../../types/auth.types';
import { Trash2, Shield, ShieldAlert, Plus, Loader2, Link2, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'; 
// Imports de Componentes
import { CreateUserModal } from '../components/create-user-modal';
import { LinkedAccountsModal } from '../components/linked-accounts-modal';
import { EditUserModal } from '../components/edit-user-modal';
import { StatusModal, type ModalType } from '../../../components/ui/status-modal';
import { useUsers } from '../hooks/use-user';

export const UsersPage = () => {
    // Usamos el Hook
    const { users, loading, addUser, editUser, removeUser, switchRole } = useUsers();

    // Estados de UI (Modales)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAccountsModalOpen, setIsAccountsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: ModalType; title: string; description: string }>({ isOpen: false, type: 'info', title: '', description: '' });

    // --- PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Default 5 items

    // Calcular usuarios visibles
    const paginatedUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return users.slice(startIndex, startIndex + itemsPerPage);
    }, [users, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    // --- HANDLERS UI ---

    // Crear Usuario
    const handleCreateUser = async (userPayload: { name: string; email: string; role: UserRole; is_active: boolean; password?: string; }) => {
        // Llamamos al hook que hace la petición real
        const result = await addUser(userPayload);

        if (!result.success) {
            // Lanzamos error 
            throw new Error(result.message);
        }

        setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Usuario Creado',
            description: result.message
        });
    };

    // Editar Usuario (Conectado al Modal de Edición)
    const handleUpdateUser = async (id: number, data: { name: string; email: string; role: UserRole; is_active: boolean; password?: string; }) => {
        const result = await editUser(id, data); // Llamamos al hook
        if (!result.success) throw new Error(result.message); //ERROR

        setStatusModal({
            isOpen: true,
            type: 'success',
            title: 'Actualizado',
            description: result.message
        });
    };

    // Eliminar
    const handleDeleteClick = async (id: number) => {
        if (!confirm('¿Eliminar usuario?')) return;
        const result = await removeUser(id);
        setStatusModal({
            isOpen: true,
            type: result.success ? 'success' : 'error',
            title: result.success ? 'Eliminado' : 'Error',
            description: result.message
        });
    };

    // Cambiar Rol
    const handleToggleRole = async (user: User) => {
        try {
            await switchRole(user);
        } catch {
            setStatusModal({ isOpen: true, type: 'error', title: 'Error', description: 'No se pudo cambiar el rol' });
        }
    };

    // Modales auxiliares
    const openAccounts = (u: User) => { setSelectedUser(u); setIsAccountsModalOpen(true); };
    const openEdit = (u: User) => { setSelectedUser(u); setIsEditModalOpen(true); };


    if (loading) return <div className="flex justify-center items-center h-screen w-full"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-8 overflow-y-auto">
            <div className="max-w-[1400px] mx-auto w-full space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-text-main">Administración de usuarios</h1>
                        <p className="text-text-muted text-sm md:text-base">Usuarios totales: {users.length}</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-primary text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark active:scale-95 transition-all">
                        <Plus size={20} /> Nuevo Usuario
                    </button>
                </div>

                {/* --- VISTA MÓVIL (CARDS) --- */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {paginatedUsers.map((u) => (
                        <div key={u.id} className="bg-bg-surface p-5 rounded-2xl shadow-sm border border-border-base flex flex-col gap-4">
                            {/* Top Card: Info + Menu */}
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center uppercase shrink-0">
                                        {u.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-text-main">{u.name}</div>
                                        <div className="text-xs text-text-muted">{u.email}</div>
                                    </div>
                                </div>
                                {/* Badge Estado */}
                                {u.is_active ?
                                    <span className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">ACTIVO</span> :
                                    <span className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded-full font-bold">INACTIVO</span>
                                }
                            </div>

                            <hr className="border-border-base/50" />

                            {/* Middle Card: Detalles */}
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-text-muted text-xs font-medium uppercase">Rol</span>
                                    <button onClick={() => handleToggleRole(u)} className="flex items-center gap-1.5 font-bold text-text-main">
                                        {u.role === 'admin' ? <ShieldAlert size={14} className="text-purple-600" /> : <Shield size={14} className="text-gray-500" />}
                                        {u.role.toUpperCase()}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-1 items-end">
                                    <span className="text-text-muted text-xs font-medium uppercase">Cuentas</span>
                                    <button onClick={() => openAccounts(u)} className="flex items-center gap-1 text-brand-primary font-medium">
                                        <Link2 size={14} />
                                        {u.connected_accounts?.length || 0} Vinculadas
                                    </button>
                                </div>
                            </div>

                            {/* Bottom Card: Acciones (Siempre visibles en móvil) */}
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                <button onClick={() => openEdit(u)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-canvas text-text-main font-medium border border-border-base active:bg-gray-100">
                                    <Edit2 size={16} /> Editar
                                </button>
                                <button onClick={() => handleDeleteClick(u.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-600 font-medium border border-red-100 active:bg-red-100">
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- VISTA DESKTOP (TABLA) --- */}
                <div className="hidden md:block bg-bg-surface rounded-3xl shadow-sm border border-border-base overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-card-bg/50 border-b border-border-base text-xs text-text-muted uppercase">
                            <tr>
                                <th className="p-5 pl-8">Usuario</th>
                                <th className="p-5 text-center">Rol</th>
                                <th className="p-5 text-center">Vinculaciones</th>
                                <th className="p-5 pr-8 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base text-sm">
                            {paginatedUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-bg-canvas/40 transition-colors group">
                                    <td className="p-5 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 text-brand-primary font-bold flex items-center justify-center uppercase border border-brand-primary/10">
                                                {u.name.substring(0, 2)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-text-main">{u.name}</div>
                                                <div className="text-xs text-text-muted">{u.email}</div>
                                                <div className="mt-1">
                                                    {u.is_active ?
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">ACTIVO</span> :
                                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">INACTIVO</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => handleToggleRole(u)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-transform active:scale-95 ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-white text-gray-600 border-gray-200'}`}>
                                            {u.role === 'admin' ? <ShieldAlert size={14} /> : <Shield size={14} />}
                                            {u.role.toUpperCase()}
                                        </button>
                                    </td>
                                    <td className="p-5 text-center">
                                        <button onClick={() => openAccounts(u)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-brand-primary bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors border border-brand-primary/10">
                                            <Link2 size={14} /> Ver Cuentas
                                            {(u.connected_accounts?.length || 0) > 0 && <span className="ml-1 bg-brand-primary text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{u.connected_accounts?.length}</span>}
                                        </button>
                                    </td>
                                    <td className="p-5 pr-8 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <button onClick={() => openEdit(u)} className="p-2 rounded-lg text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 transition-colors" title="Editar">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDeleteClick(u.id)} className="p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors" title="Eliminar">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* --- CONTROLES DE PAGINACIÓN --- */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-2 text-sm text-text-muted border-t border-border-base pt-6">
                    <div className="flex items-center gap-2">
                        <span>Mostrar</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="bg-bg-surface border border-border-base rounded-lg px-2 py-1 focus:ring-2 focus:ring-brand-primary/20 outline-none"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span>por página</span>
                    </div>

                    <div className="flex items-center gap-2 bg-bg-surface rounded-xl border border-border-base p-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <span className="px-3 font-medium text-text-main">
                            Página {currentPage} de {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-lg hover:bg-bg-canvas disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Modales */}
            <CreateUserModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onUserCreated={handleCreateUser} />
            <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} user={selectedUser} onSubmit={handleUpdateUser} />
            <LinkedAccountsModal isOpen={isAccountsModalOpen} onClose={() => setIsAccountsModalOpen(false)} user={selectedUser} />
            <StatusModal isOpen={statusModal.isOpen} onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))} type={statusModal.type} title={statusModal.title} description={statusModal.description} />
        </div>
    );
};