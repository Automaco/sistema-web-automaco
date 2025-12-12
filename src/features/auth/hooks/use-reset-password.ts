import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para el estado de errores
interface FormErrors {
    password?: string;
    confirmPassword?: string;
}

export const useResetPassword = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
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
        const newErrors: FormErrors = {};

        // Validacion de campos
        //Campo de contraseña obligatorio
        if (!formData.password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 8) {
            newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        }

        //Validar Confirmación de Contraseña (Coincidencia)
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Debes confirmar la contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        // Si hay errores  seteamos y detenemos el envio
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        // Si todo esta bien
        setIsLoading(true);
        // Simulacion de envio de datos
        try {
            console.log('Enviando datos:', formData);
            // Simulación de API
            setTimeout(() => {
                setIsLoading(false);
                navigate('/auth/login');
            }, 1000);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };
    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    };
};