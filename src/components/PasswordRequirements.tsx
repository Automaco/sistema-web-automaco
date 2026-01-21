import { Check, X, Circle } from 'lucide-react';

interface PasswordRequirementsProps {
    password: string;
}

// Forma del objeto
interface Requirement {
    id: number;
    label: string;
    isValid: boolean;
}
export const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
    const requirements: Requirement[] = [
        {
            id: 1,
            label: "Mínimo 8 caracteres",
            isValid: password.length >= 8 // Si tiene 8 caract es valido
        }, {
            id: 2,
            label: "Al menos una mayúscula",
            isValid: /[A-Z]/.test(password) // Si tiene mayúscula, isValid será TRUE
        }, {
            id: 3,
            label: "Al menos una minúscula",
            isValid: /[a-z]/.test(password)
        }, {
            id: 4,
            label: "Al menos un número",
            isValid: /[0-9]/.test(password)
        },
        {
            id: 5,
            label: "Al menos un caracter especial",
            isValid: /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/+=;'`~]/.test(password)
        }
    ];
    return (
        <div className="w-full mt-3 p-4 bg-bg-surface rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                La contraseña debe tener:
            </p>
            <ul className="space-y-2">
                {requirements.map((req) => (
                    <li
                        key={req.id}
                        className={`flex items-center text-sm transition-all duration-200 ${req.isValid
                                ? 'text-green-600 font-medium' // Estilo si cumple
                                : 'text-gray-600'              // Estilo si no cumple
                            }`}
                    >
                        {/* Icono Dinámico */}
                        <span className={`mr-2 flex items-center justify-center w-4 h-4 rounded-full border transition-colors duration-200 ${req.isValid ? 'bg-green-100 border-green-500' : 'border-gray-300'
                            }`}>
                            {req.isValid ? (
                                <Check size={10} className="text-green-600" strokeWidth={3} />
                            ) : (
                                <Circle size={0} className="fill-current text-gray-300" strokeWidth={3}/>
                            )}
                        </span>

                        {req.label}
                    </li>
                ))}
            </ul>
        </div>
    );
}