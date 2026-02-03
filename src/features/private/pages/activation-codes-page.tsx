import { useEffect, useState } from 'react';
import { Trash2, Plus, XCircle, Copy, Key, ShieldCheck } from 'lucide-react';
import { activationService } from '../../../services/activation.service';
import { type ActivationCode } from '../../../types/activation.types';
import { Button } from '../../../components/button';
import { StatusModal, type ModalType } from '../../../components/ui/status-modal';

export const ActivationCodesPage = () => {
    const [codes, setCodes] = useState<ActivationCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCode, setNewCode] = useState<string | null>(null);

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        description: string;
        onConfirm?: () => void;
        showConfirmButton?: boolean;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        description: '',
        showConfirmButton: false
    });

    const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }));

    const fetchCodes = async () => {
        setIsLoading(true);
        try {
            const data = await activationService.getAll();
            setCodes(data);
        } catch (error) {
            console.error("Error cargando códigos", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCodes();
    }, []);

    const handleGenerate = async () => {
        try {
            const response = await activationService.generate();
            setNewCode(response.code);
            fetchCodes();

            setModalState({
                isOpen: true,
                type: 'success',
                title: 'Código Creado',
                description: 'El código se ha generado correctamente.',
                showConfirmButton: false
            });
        } catch {
            setModalState({
                isOpen: true,
                type: 'error',
                title: 'Error',
                description: 'No se pudo generar el código.',
                showConfirmButton: false
            });
        }
    };

    const confirmDelete = (id: number) => {
        setModalState({
            isOpen: true,
            type: 'error',
            title: '¿Eliminar código?',
            description: 'Esta acción invalidará el acceso si aún no ha sido usado.',
            showConfirmButton: true,
            onConfirm: () => executeDelete(id)
        });
    };

    const executeDelete = async (id: number) => {
        try {
            await activationService.delete(id);
            setCodes(prev => prev.filter(c => c.id !== id));
            closeModal();
            setTimeout(() => {
                setModalState({
                    isOpen: true,
                    type: 'success',
                    title: 'Código Eliminado',
                    description: 'El código ha sido eliminado correctamente.',
                    showConfirmButton: false
                });
            }, 300);
        } catch {
            closeModal();
            setModalState({
                isOpen: true,
                type: 'error',
                title: 'Error',
                description: 'No se pudo eliminar el código.',
                showConfirmButton: false
            });
        }
    };

    const copyToClipboard = () => {
        if (newCode) {
            navigator.clipboard.writeText(newCode);
            setModalState({
                isOpen: true,
                type: 'success',
                title: 'Copiado',
                description: 'Código copiado al portapapeles.',
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 bg-bg-surface rounded-2xl shadow-lg border border-border-base">

            {/* HEADER RESPONSIVE */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary shrink-0 mt-1 sm:mt-0">
                        <Key size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text-main">Códigos de Activación</h1>
                        <p className="text-sm text-text-muted mt-0.5">Genera y administra las llaves de acceso.</p>
                    </div>
                </div>

                <Button onClick={handleGenerate} className="flex items-center justify-center gap-2 bg-brand-primary text-white px-2 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-dark active:scale-95 transition-all whitespace-nowrap">
                    <Plus size={20} />Generar código
                </Button>
            </div>

            {/* --- AREA DE NOTIFICACIÓN DE CÓDIGO--- */}
            {newCode && (
                <div className="
                    relative overflow-hidden rounded-2xl 
                    bg-white dark:bg-emerald-900 
                    border-l-4 border-l-emerald-500 border  dark:border-emerald-800/30
                    p-5 flex flex-col md:flex-row items-center justify-between gap-6
                ">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {/* Icono con fondo */}
                        <div className="p-3 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 rounded-full shrink-0">
                            <ShieldCheck size={24} />
                        </div>

                        <div>
                            <p className="text-lg font-extrabold text-gray-900! dark:text-emerald-100!">
                                ¡Código Listo!
                            </p>
                            <p className="text-sm font-medium text-gray-600! dark:text-emerald-200/70!">
                                Cópialo ahora, por seguridad no se volverá a mostrar.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="
                            flex-1 md:flex-none flex items-center justify-between gap-4 
                            bg-gray-100 dark:bg-black/40 
                            px-5 py-3 rounded-xl 
                            border border-gray-300 dark:border-emerald-500/30
                            shadow-inner
                        ">
                            <span className="text-xl font-mono font-bold tracking-widest text-gray-800! dark:text-emerald-100! select-all">
                                {newCode}
                            </span>
                            <button
                                onClick={copyToClipboard}
                                className="text-gray-500 hover:text-emerald-600 dark:text-emerald-500/70 dark:hover:text-emerald-400 transition-colors"
                                title="Copiar al portapapeles"
                            >
                                <Copy size={20} />
                            </button>
                        </div>

                        <button
                            onClick={() => setNewCode(null)}
                            className="p-2 text-gray-400 hover:text-red-500 dark:text-emerald-600 dark:hover:text-red-400 transition-colors"
                            title="Cerrar notificación"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* TABLA */}
            <div className="bg-bg-surface border border-border-base rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-bg-canvas border-b border-border-base text-xs uppercase text-text-muted font-semibold tracking-wider">
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Usuario Vinculado</th>
                                <th className="px-6 py-4">Uso</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-base">
                            {isLoading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-text-muted">Cargando datos...</td></tr>
                            ) : codes.length === 0 ? (
                                <tr><td colSpan={5} className="p-12 text-center text-text-muted flex flex-col items-center justify-center gap-2">
                                    <Key size={32} className="opacity-20" />
                                    <span>No hay códigos generados aún.</span>
                                </td></tr>
                            ) : (
                                codes.map((code) => (
                                    <tr key={code.id} className="hover:bg-bg-canvas/40 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono text-text-muted">#{code.id}</td>

                                        <td className="px-6 py-4">
                                            {code.is_used ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border
                                                    bg-rose-50 text-rose-700 border-rose-200
                                                    dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20">
                                                    Usado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border
                                                    bg-emerald-50 text-emerald-700 border-emerald-200
                                                    dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                                                    Disponible
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            {code.user ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-xs uppercase">
                                                        {code.user.name.charAt(0)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-text-main">{code.user.name}</span>
                                                        <span className="text-xs text-text-muted">{code.user.email}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-text-muted opacity-50 italic">- Sin asignar -</span>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 text-sm text-text-muted">
                                            {code.used_at ? (
                                                <div className="flex flex-col">
                                                    <span>{new Date(code.used_at).toLocaleDateString()}</span>
                                                    <span className="text-[10px] opacity-70">{new Date(code.used_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ) : '-'}
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => confirmDelete(code.id)}
                                                className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                title="Eliminar código"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODALES */}
            {modalState.showConfirmButton ? (
                <StatusModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    type={modalState.type}
                    title={modalState.title}
                    description={modalState.description}
                    buttonText="Confirmar Eliminación"
                    onButtonClick={modalState.onConfirm}
                />
            ) : (
                <StatusModal
                    isOpen={modalState.isOpen}
                    onClose={closeModal}
                    type={modalState.type}
                    title={modalState.title}
                    description={modalState.description}
                />
            )}
        </div>
    );
};