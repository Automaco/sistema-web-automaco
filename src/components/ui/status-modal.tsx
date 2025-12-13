import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from '../button'; 

export type ModalType = 'success' | 'error' | 'info';

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    type?: ModalType;
    title: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export const StatusModal = ({ 
    isOpen, 
    onClose, 
    type = 'info', 
    title, 
    description, 
    buttonText = "Entendido",
    onButtonClick 
}: StatusModalProps) => {
    
    if (!isOpen) return null;

    // Configuración visual adaptativa
    // En modo oscuro usamos fondos con opacidad (/20 o /30) para que no sean chillones
    const config = {
        success: {
            icon: <CheckCircle2 size={32} />,
            bgIcon: "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400",
            btnColor: "bg-green-600 hover:bg-green-700 border-transparent text-white",
            defaultTitle: "¡Éxito!"
        },
        error: {
            icon: <AlertCircle size={32} />,
            bgIcon: "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400",
            btnColor: "bg-red-600 hover:bg-red-700 border-transparent text-white",
            defaultTitle: "Ocurrió un error"
        },
        info: {
            icon: <Info size={32} />,
            bgIcon: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
            // Usa el color de marca definido en tu CSS
            btnColor: "bg-brand-primary hover:bg-brand-dark border-transparent text-white", 
            defaultTitle: "Información"
        }
    };

    const currentConfig = config[type];
    const handleAction = onButtonClick || onClose;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
            
            {/* Backdrop con desenfoque */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal Card */}
            {/* USAMOS TUS VARIABLES SEMÁNTICAS AQUÍ: bg-bg-surface */}
            <div className="relative bg-bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-300 text-center border border-border-base">
                
                {/* Botón cerrar (X) */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-text-muted hover:text-text-main transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icono Dinámico (Se adapta con dark:...) */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-5 shadow-sm transition-colors ${currentConfig.bgIcon}`}>
                    {currentConfig.icon}
                </div>

                {/* Contenido */}
                {/* USAMOS VARIABLE: text-text-main */}
                <h3 className="text-xl font-bold text-text-main mb-2">
                    {title || currentConfig.defaultTitle}
                </h3>

                {/* USAMOS VARIABLE: text-text-muted */}
                {description && (
                    <p className="text-sm text-text-muted mb-6 px-2 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Botón de Acción */}
                <Button 
                    onClick={handleAction}
                    className={`w-full h-11 shadow-md transition-all ${type !== 'info' ? currentConfig.btnColor : ''}`} 
                >
                    {buttonText}
                </Button>
            </div>
        </div>
    );
};