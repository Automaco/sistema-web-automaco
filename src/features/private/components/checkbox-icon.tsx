import { CheckSquare, Square } from 'lucide-react';

export const CheckboxIcon = ({ checked, onClick, className }: { checked: boolean, onClick?: (e: React.MouseEvent<HTMLDivElement>) => void, className?: string }) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            onClick?.(e);
        }}
        className={`cursor-pointer transition-colors ${checked ? 'text-brand-primary' : 'text-gray-300 hover:text-gray-400'} ${className}`}
    >
        {checked ? <CheckSquare size={22} /> : <Square size={22} />}
    </div>
);