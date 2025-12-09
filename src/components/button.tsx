import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline';
}
// Añadir parametro de cambio de cambio  de colores
export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
    const baseStyles = "w-75 py-2.5 rounded-full font-semibold transition-all duration-300 cursor-pointer";

    const variants = {
        primary: "bg-brand-primary text-white hover:bg-brand-dark shadow-lg shadow-brand-primary/30",
        outline: "border-2 border-white text-white hover:bg-white/10",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};