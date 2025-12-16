import { type ReactNode } from 'react';

interface AccountCardProps {
    label: string;
    subLabel?: string;
    icon: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'dashed';
}

export const AccountCard = ({ label, subLabel, icon, onClick, variant = 'default' }: AccountCardProps) => {
    // Base: Tamaño, forma y transición
    const baseStyles = "flex flex-col items-center justify-center p-5 w-48 h-56 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden";

    const styles = {
        default: `
            bg-[var(--card-bg)] 
            border border-border-base shadow-lg
            /* Hover effects */
            hover:border-brand-primary hover:shadow-xl hover:-translate-y-1
        `,
        dashed: `
            /* Fondo transparente para el dashed */
            bg-[var(--card-bg)]/50 backdrop-blur-sm
            /* Borde punteado: Blanco semitransparente para que se vea en el fondo verde */
            border-2 border-dashed border-text-adaptive/40 
            /* Hover effects */
            hover:border-text-adaptive hover:border-text-adaptive/20 hover:-translate-y-1
        `
    };

    // Color del texto según la variante
    const textColorMain = variant === 'dashed' ? 'text-white' : 'text-text-main';
    const textColorSub = variant === 'dashed' ? 'text-white/70' : 'text-text-muted';

    return (
        <button onClick={onClick} className={`${baseStyles} ${styles[variant]} focus:outline-none`}>

            {/* Icon Container */}
            <div className={`
                w-16 h-16 mb-4 flex items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110 shadow-sm
                ${variant === 'dashed'
                    ? 'bg-transparent text-white' // Icono blanco en dashed
                    : 'bg-brand-primary/60' // Icono con fondo verde
                }
            `}>
                {icon}
            </div>

            {/* Text Container */}
            <div className="text-center w-full px-2">
                <span className={`block font-bold text-sm truncate ${textColorMain}`}>
                    {label}
                </span>
                {subLabel && (
                    <span className={`block text-xs mt-1 truncate w-full ${textColorSub}`} title={subLabel}>
                        {subLabel}
                    </span>
                )}
            </div>
        </button>
    );
};