import { type ReactNode } from 'react';

interface AccountCardProps {
    label: string;
    subLabel?: string;
    icon: ReactNode;
    onClick: () => void;
    variant?: 'default' | 'dashed';
}

export const AccountCard = ({ label, subLabel, icon, onClick, variant = 'default' }: AccountCardProps) => {
    // Base: Flex, tamaño, transición y posicionamiento
    const baseStyles = "flex flex-col items-center justify-center p-6 w-40 h-48 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden";

    // Variantes con soporte Dark Mode nativo
    const styles = {
        default: `
      bg-bg-surface border border-border-base shadow-sm
      hover:border-brand-primary hover:shadow-md hover:-translate-y-1
      dark:bg-slate-800/50 dark:hover:bg-slate-800 
    `,
        dashed: `
      bg-transparent border-2 border-dashed border-border-base 
      hover:border-brand-primary hover:bg-brand-primary/5 
      dark:hover:bg-brand-primary/10
    `
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${styles[variant]} focus:outline-none`}>

            {/* Icon Container: Se adapta al fondo (Gris claro en Light / Oscuro en Dark) */}
            <div className={`
        w-16 h-16 mb-4 flex items-center justify-center rounded-full text-3xl transition-transform group-hover:scale-110 shadow-sm
        ${variant === 'dashed' ? 'bg-transparent' : 'bg-gray-50 dark:bg-slate-700'}
      `}>
                {icon}
            </div>

            {/* Text Container */}
            <div className="text-center w-full px-2">
                <span className={`block font-bold text-sm truncate ${variant === 'dashed' ? 'text-brand-primary' : 'text-text-main'}`}>
                    {label}
                </span>
                {subLabel && (
                    <span className="block text-xs text-text-muted mt-1 truncate w-full opacity-80 group-hover:opacity-100" title={subLabel}>
                        {subLabel}
                    </span>
                )}
            </div>
        </button>
    );
};