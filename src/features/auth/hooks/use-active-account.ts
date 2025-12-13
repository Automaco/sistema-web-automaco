import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para el estado de errores
interface FormErrors {
    licenseKey?: string;
}

export const useActiveAccount = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ licenseKey: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // 👈 Nuevo estado de errores
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Opcional: Limpiar el error cuando el usuario empieza a escribir de nuevo
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };



    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 1. Validaciones previas
        const newErrors: FormErrors = {};
        if (!formData.licenseKey) {
            newErrors.licenseKey = "Campo obligatorio";
        } else if (formData.licenseKey.length < 16) {
            newErrors.licenseKey = "La clave debe tener al menos 16 caracteres";
        }

        // Si hay errores, los seteamos y detenemos el envío
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 2. Si todo está bien, procedemos
        setIsLoading(true);

        try {
            console.log('Enviando datos:', formData);
            // Simulación de API
            setTimeout(() => {
                setIsLoading(false);
                navigate('/auth/dashboard');
            }, 1000);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        // 1. Obtenemos el valor y quitamos guiones existentes y espacios
        // También forzamos mayúsculas para que se vea profesional (opcional)
        const rawValue = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        // 2. Limitamos la longitud (ej: 16 caracteres reales = 4 bloques de 4)
        if (rawValue.length > 16) return;

        // 3. Agregamos el guion cada 4 caracteres
        // La Regex (.{1,4}) parte el texto en grupos de 4
        const formattedValue = rawValue.match(/.{1,4}/g)?.join("-") || "";

        // 4. Actualizamos el estado
        setFormData(prev => ({ ...prev, licenseKey: formattedValue }));

        // Limpiar error si existe
        if (errors.licenseKey) {
            setErrors(prev => ({ ...prev, licenseKey: undefined }));
        }
    };

    return {
        formData,
        errors,
        handleCodeChange,
        isLoading,
        handleInputChange,
        handleSubmit
    };
};