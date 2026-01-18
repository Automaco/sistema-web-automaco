import { useState, type FormEvent, type ChangeEvent } from 'react';
import { authService } from '../../../services/auth.services';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ApiError } from '../../../utils/http-client';

// Interfaz para el estado de errores
interface FormErrors {
    email?: string;
    general?: string;
}

export const useRecoverPassword = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ email: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // Nuevo estado de errores

    // --- ESTADOS DE UI (Cargas y Modal) ---
    const [isLoading, setIsLoading] = useState(false);     // Para el botón "Enviar instrucciones"
    const [IsSuccess, setIsSuccess] = useState(false);


    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Opcional: Limpiar el error cuando el usuario empieza a escribir de nuevo
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
        }
    };

    // Función auxiliar para validar email
    const validateEmail = (email: string) => {
        // Regex estándar para email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSendLink = async (e: FormEvent) => {
        e.preventDefault();

        // 1. Validaciones previas
        const newErrors: FormErrors = {};
        if (!formData.email) {
            newErrors.email = "El correo es obligatorio";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "El formato del correo no es válido";
        }

        // Si hay errores, los seteamos y detenemos el envío
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 2. Si todo está bien, procedemos
        setIsLoading(true);
        setErrors({}); // Limpiamos errores previos
        /**
         * ---- Llamada a la API ----
         */
        try {
            await authService.sendResetLink({ email: formData.email });
            // Si todo sale bien, activamos el estado de exito
            setIsSuccess(true);
        } catch (error: any) {
            console.error(error);
            let msg = 'El correo no esta vinculado con una cuenta existente';
            if (error instanceof ApiError) {
                msg = error.data?.message || error.message;
            }
            // Mostramos el error general
            setErrors({ general: msg });
        } finally {
            setIsLoading(false);
        }
    };
    // Funcion simple para ceerrar el modal
    const closeSuccesModal = () => {
        navigate('/auth/login')
        setIsSuccess(false);
    };
    const clearErrors = () => setErrors({});
    return {
        formData,
        errors,
        // Estados de UI
        isLoading,
        IsSuccess,
        // Funciones
        handleInputChange,
        handleSendLink,   // Usar en el <form> principal
        closeSuccesModal,
        clearErrors

    };
};