import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: ReactNode;
    onIconClick?: () => void;
}

export const Input = ({ label, icon, onIconClick, className, ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-gray-600 ml-1">
                {label}
            </label>
            <div className="relative">
                <input
                    className={`w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all ${className}`}
                    {...props}
                />
                {icon && (
                    <button
                        type="button"
                        onClick={onIconClick}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                        {icon}
                    </button>
                )}
            </div>
        </div>
    );
};