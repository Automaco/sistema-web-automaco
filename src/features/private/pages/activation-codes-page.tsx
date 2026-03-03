import { useEffect, useState } from 'react';
import { Trash2, Plus, XCircle, Copy, Key, ShieldCheck, Eye, Lock, EyeOff } from 'lucide-react';
import { activationService } from '../../../services/activation.service';
import { type ActivationCode } from '../../../types/activation.types';
import { Button } from '../../../components/button';
import { StatusModal, type ModalType } from '../../../components/ui/status-modal';
import { authService } from '../../../services/auth.services';

export const ActivationCodesPage = () => {
    const [codes, setCodes] = useState<ActivationCode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newCode, setNewCode] = useState<string | null>(null);
    // Funcion para revelar codigo
    const [revealedCodes, setRevealedCodes] = useState<{ [key: number]: string }>({});
    // Estado para verificar la contraseña
    const [securityModal, setSecurityModal] = useState({
        isOpen: false,
        targetCodeId: 0,
        targetCodeString: '',
        password: '',
        error: ''
    });

    const [isVerifying, setIsVerifying] = useState(false);

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
            console.log("DATOS RECIBIDOS DE LA API:", data);
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
    // Logica para Verificar contraseña y revelar el codigo
    const handleRevealCode = async () => {
        // Validacion local
        if (!securityModal.password) {
            setSecurityModal(prev => ({ ...prev, error: 'La contraseña es obligatoria' }));
            return;
        }
        setIsVerifying(true);
        setSecurityModal(prev => ({ ...prev, error: '' })); // Limpiamos errores previos

        try {
            // Llamada a la API
            const response = await authService.confirmPassword(securityModal.password);

            const responseData = response;
            // Si no hay error, la contraseña es correcta
            setNewCode(securityModal.targetCodeString); // se muestra el codigo

            setRevealedCodes(prev => ({
                ...prev,
                [securityModal.targetCodeId]: securityModal.targetCodeString
            }));

            // Cerramos el modal
            setSecurityModal({ isOpen: false, targetCodeId: 0, targetCodeString: '', password: '', error: '' });

            // Modal de exito
            setModalState({
                isOpen: true,
                type: 'success',
                title: 'Acceso Concedido',
                description: responseData.message || 'El código ha sido revelado de forma segura.',
                showConfirmButton: false
            });
        } catch (error: any) {
            // Manejo de errores
            // 4. Manejo de errores (Estilo useLogin)
            console.error('Password verification failed', error);
            let errorMessage = "Ocurrió un error al verificar la contraseña";

            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }

            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Mostramos el error dentro del modal
            setSecurityModal(prev => ({ ...prev, error: errorMessage }));

        } finally {
            setIsVerifying(false);
        }
    };

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
            setRevealedCodes(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
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

    const copyToClipboard = (textToCopy: string) => {
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy);
            setModalState({
                isOpen: true,
                type: 'success',
                title: 'Copiado',
                description: 'Código copiado al portapapeles.',
                showConfirmButton: false
            });
        }
    };


// Funcion para ocultar el codigo
const handleHideCode = (id: number) => {
    setRevealedCodes(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
    });
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
                            onClick={() => copyToClipboard(newCode)}
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
                            <th className="px-6 py-4">Código</th>
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
                            codes.map((code) => {
                                const isRevealed = !!revealedCodes[code.id];

                                return (
                                    <tr key={code.id} className="hover:bg-bg-canvas/40 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-mono text-text-muted">#{code.id}</td>

                                        {/* NUEVA CELDA: LÓGICA DEL CÓDIGO */}
                                        <td className="px-6 py-4">
                                            {code.is_used ? (
                                                <span className="text-text-muted opacity-50 italic">Inhabilitado</span>
                                            ) : isRevealed ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold tracking-widest text-brand-primary">
                                                        {revealedCodes[code.id]}
                                                    </span>
                                                    <button
                                                        onClick={() => copyToClipboard(revealedCodes[code.id])}
                                                        className="text-text-muted hover:text-brand-primary"
                                                        title="Copiar"
                                                    >
                                                        <Copy size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="font-mono text-text-muted opacity-50 tracking-widest">
                                                    ••••••
                                                </span>
                                            )}
                                        </td>

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
                                            <div className="flex justify-end items-center gap-2">
                                                {/* Botón para revelar/ocultar código (Solo si NO está usado) */}
                                                {!code.is_used && (
                                                    isRevealed ? (
                                                        <button
                                                            onClick={() => handleHideCode(code.id)}
                                                            className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all"
                                                            title="Ocultar código"
                                                        >
                                                            <EyeOff size={18} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => setSecurityModal({
                                                                isOpen: true,
                                                                targetCodeId: code.id,
                                                                targetCodeString: code.raw_code || '', 
                                                                password: '',
                                                                error: ''
                                                            })}
                                                            className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                            title="Revelar código"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                    )
                                                )}

                                                <button
                                                    onClick={() => confirmDelete(code.id)}
                                                    className="p-2 text-text-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    title="Eliminar código"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
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
        {/* MODAL DE SEGURIDAD PARA REVELAR CONTRASEÑA */}
        {securityModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="bg-bg-surface w-full max-w-md rounded-2xl shadow-xl border border-border-base p-6 space-y-6">
                    <div className="flex items-center gap-3 text-brand-primary">
                        <Lock size={28} />
                        <h3 className="text-xl font-bold text-text-main">Verificación de Seguridad</h3>
                    </div>

                    <p className="text-sm text-text-muted">
                        Por favor, ingrese su contraseña de administrador para revelar este código de activación.
                    </p>

                    <div className="space-y-2">
                        <input
                            type="password"
                            placeholder="Contraseña de administrador"
                            value={securityModal.password}
                            disabled={isVerifying}
                            onChange={(e) => setSecurityModal(prev => ({ ...prev, password: e.target.value, error: '' }))}
                            className="w-full px-4 py-3 rounded-xl border border-border-base bg-bg-canvas text-text-main focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all disabled:opacity-50"
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && !isVerifying && handleRevealCode()}
                        />
                        {securityModal.error && (
                            <p className="text-xs text-rose-500 font-medium">{securityModal.error}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={() => setSecurityModal({ isOpen: false, targetCodeId: 0, targetCodeString: '', password: '', error: '' })}
                            disabled={isVerifying}
                            className="px-4 py-2"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleRevealCode}
                            disabled={isVerifying}
                            className="px-4 py-2 bg-brand-primary text-white hover:bg-brand-dark flex items-center justify-center min-w-[100px]"
                        >
                            {isVerifying ? (
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                'Verificar'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
};