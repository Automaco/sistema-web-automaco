import { X, AlertTriangle, HelpCircle, LogOut, Loader2 } from 'lucide-react'; // 1. Importar Loader2
import { Button } from '../button'; 

export type ConfirmationType = 'danger' | 'warning' | 'neutral';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    type?: ConfirmationType;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    isLoading = false, 
    type = 'neutral', 
    title, 
    description, 
    confirmText = "Confirmar",
    cancelText = "Cancelar" 
}: ConfirmationModalProps) => {
    
    if (!isOpen) return null;

    const config = {
        danger: {
            icon: <LogOut size={32} className="ml-1" />, 
            bgIcon: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
            confirmBtnColor: "bg-red-600 hover:bg-red-700 text-white border-transparent shadow-red-500/30",
        },
        warning: {
            icon: <AlertTriangle size={32} />,
            bgIcon: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
            confirmBtnColor: "bg-orange-500 hover:bg-orange-600 text-white border-transparent",
        },
        neutral: {
            icon: <HelpCircle size={32} />,
            bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
            confirmBtnColor: "bg-brand-primary hover:bg-brand-dark text-white border-transparent",
        }
    };

    const currentConfig = config[type];

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
            
            {/* Backdrop: Si está cargando, bloqueamos clicks afuera para no cerrar accidentalmente */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={!isLoading ? onClose : undefined} 
            />

            <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-300 text-center border border-border-base">
                
                {/* Botón cerrar (X) - Deshabilitado si carga */}
                <button 
                    onClick={onClose} 
                    disabled={isLoading}
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <X size={20} />
                </button>

                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 shadow-sm transition-colors ${currentConfig.bgIcon}`}>
                    {currentConfig.icon}
                </div>

                <h3 className="text-xl font-bold text-text-main mb-2">
                    {title}
                </h3>

                {description && (
                    <p className="text-sm text-text-muted mb-8 px-2 leading-relaxed">
                        {description}
                    </p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading} // Deshabilitar cancelar mientras carga
                        className="flex-1 h-11 rounded-full border border-border-base text-text-muted font-semibold hover:bg-bg-canvas hover:text-text-main transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>

                    <Button 
                        onClick={onConfirm}
                        disabled={isLoading} // Deshabilitar para evitar doble click
                        className={`flex-1 h-11 shadow-md transition-all ${currentConfig.confirmBtnColor}`} 
                    >
                        {/* 3. Lógica visual de carga */}
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <Loader2 className="animate-spin" size={18} />
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};