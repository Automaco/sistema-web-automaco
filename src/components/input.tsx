import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ==========================================
// 1. INPUT GENÉRICO 
// ==========================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    onIconClick?: () => void;
    error?: string;
}

export const Input = ({ label, icon, onIconClick, error, className, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-text-muted ml-1 text-left transition-colors">
                {label}
            </label>

            <div className="relative group">
                <input
                    className={`
                        w-full 
                        font-normal
                        text-left 
                        bg-bg-surface text-text-main
                        
                        /* Lógica de Borde: Si hay error es ROJO, si no es el base */
                        border 
                        ${error
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-border-base focus:ring-brand-primary/50 focus:border-brand-primary hover:border-brand-primary/50'
                        }

                        rounded-lg py-2.5 
                        pl-4
                        ${icon ? 'pr-10' : 'pr-4'}
                        
                        placeholder:text-text-muted/50
                        focus:outline-none 
                        focus:ring-2 
                        transition-all duration-200
                        ${className}
                    `}
                    {...props}
                />

                {icon && (
                    <div
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-text-muted'} ${onIconClick ? 'cursor-pointer hover:text-text-main' : 'pointer-events-none'}`}
                        onClick={onIconClick}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {/* Mensaje de Error debajo del input */}
            {error && (
                <span className="text-xs text-red-500 ml-1 text-left animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};

// ==========================================
// 2. INPUT DE CONTRASEÑA
// ==========================================
// Hacemos lo mismo aquí: agregamos la prop 'error'
type PasswordInputProps = Omit<InputProps, 'type' | 'icon'>;

export const PasswordInput = ({ label, error, className, ...props }: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-text-muted ml-1 text-left transition-colors">
                {label}
            </label>

            <div className="relative group">
                <input
                    type={showPassword ? "text" : "password"}
                    className={`
                        w-full 
                        font-normal
                        text-left 
                        bg-bg-surface text-text-main
                        
                        /* Borde condicional */
                        border 
                        ${error
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-border-base focus:ring-brand-primary/50 focus:border-brand-primary hover:border-brand-primary/50'
                        }

                        rounded-lg py-2.5 
                        pl-4 pr-10
                        
                        placeholder:text-text-muted/50
                        focus:outline-none 
                        focus:ring-2 
                        transition-all duration-200
                        ${className}
                    `}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : 'text-text-muted'} hover:text-text-main cursor-pointer transition-colors p-1`}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {/* Mensaje de Error */}
            {error && (
                <span className="text-xs text-red-500 ml-1 text-left">
                    {error}
                </span>
            )}
        </div>
    );
};

// ==========================================
// 3. Input para codigo de activacion
// ==========================================
type CodeInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
    label?: string;
    error?: string;
};
export const CodeInput = ({ label, error, className, ...props }: CodeInputProps) => {
    return (
        <div className="flex flex-col gap-2 w-2/2">
            <label className="font-semibold  text-brand-primary ml-1 text-left transition-colors">
                {label}
            </label>

            <div className="relative group">
                <input
                    className={`
                        w-full 
                        font-semibold
                        text-center 
                        bg-bg-surface 
                        
                        /* 1. COLOR DEL TEXTO: Forzado a brand-primary */
                        text-brand-primary
                        
                        /* 2. BORDES: Usamos rounded-full para que sean muy redondos */
                        rounded-full

                        /* Lógica de Borde */
                        border-3
                        ${error
                            ? 'border-red-500 focus:ring-red-500/30 focus:border-red-500'
                            : 'border-border-base focus:ring-brand-primary/50 focus:border-brand-primary hover:border-brand-primary/50'
                        }

                        /* Ajuste de padding: Al ser redondos, necesitamos más espacio a los lados */
                        py-3 
                        px-6
                        
                        placeholder:text-text-muted/50
                        focus:outline-none 
                        focus:ring-2 
                        transition-all duration-200
                        ${className}
                    `}
                    {...props}
                />
            </div>

            {/* Mensaje de Error */}
            {error && (
                <span className="text-xs text-red-500 ml-3 text-left animate-pulse">
                    {error}
                </span>
            )}
        </div>
    );
};