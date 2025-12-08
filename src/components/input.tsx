import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState } from 'react';
import { Eye, EyeOff, Mail } from 'lucide-react'; // Iconos

type IconType = 'password' | 'email'; // Uso de iconos

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    iconType?: IconType; // 1. contraseña y 2. Email
    onIconClick?: () => void;
}

/* Diseño de input standar */
/* Para utilizar los iconos, especifica en la propiedad del input
iconType = "password" || iconType = "email"*/

export const Input = ({ label, iconType, onIconClick, className, type = "text", ...props }: InputProps) => {
    // Logica de los iconos
    // Estado local para manejar la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);

    // Logica para determinar el tipo de input a utilzar
    const currentType = iconType === 'password'
        ? (showPassword ? "text" : "password")
        : type;

    const renderIcon = () => {
        if (iconType === 'email') {
            return <Mail className="w-5 h-5" />;
        }

        if (iconType === 'password') {
            return showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />;
        }

        return null;
    };
    // Manejador del click en el icono (solo para password)
    const handleIconClick = () => {
        if (iconType === 'password') {
            setShowPassword(!showPassword);
        }
    };
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-400 ml-1 text-left">
                {label}
            </label>
            <div className="relative">
                <input
                    type={currentType}
                    className={`
                        w-full 
                        font-normal
                        text-left text-gray-600           
                        border border-gray-300             
                        hover:border-gray-400            
                        rounded-lg px-4 py-2.5 
                        focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary
                        transition-all 
                        ${className}
                    `}
                    {...props}
                />
                {iconType && (
                    <button
                        type="button"
                        onClick={handleIconClick}
                        // Solo permitimos click si es password, si es email deshabilitamos interacción
                        className={`
                            absolute right-3 top-1/2 -translate-y-1/2 
                            text-gray-400 hover:text-gray-600 
                            transition-colors
                            ${iconType === 'password' ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
                        `}
                    >
                        {renderIcon()}
                    </button>
                )}
            </div>
        </div>
    );
};