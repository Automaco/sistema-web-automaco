import { useState, type FormEvent, type ChangeEvent, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../services/auth.services';
import { ApiError } from '../../../utils/http-client';
import type { ResetPasswordPayload } from '../../../types/auth.types';

// Interfaz para el estado de errores
interface FormErrors {
    password?: string;
    confirmPassword?: string;
    general?: string;
}

export const useResetPassword = () => {
    const navigate = useNavigate();

    //1. Leemos la URL
    const [SearchParams] = useSearchParams();
    const token = SearchParams.get('token');
    const email = SearchParams.get('email');

    // Estados
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // 👈 Nuevo estado de errores
    const [isLoading, setIsLoading] = useState(false);
    const [IsSuccess, setIsSuccess] = useState(false);

    // Validacion si el link es valido
    const isValidLink = !!token && !!email;

    useEffect(() => {
        if (!isValidLink) {
            setErrors({ general: "El Enlace es inválido" });
        }
    }, [token, email, isValidLink]);

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

        // Validacion de campos(Locales)
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

        // validacion del enlace
        if (!isValidLink) {
            newErrors.general = "Error en el enlace. Solicita uno nuevo";
        }

        // Si hay errores  seteamos y detenemos el envio
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Paquete de laravel (Mapeo de datos)
            const payload: ResetPasswordPayload = {
                token: token!, // URL
                email: email!,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            };
            await authService.resetPassword(payload);
            // Abrimos el modal de exito
            setIsSuccess(true);

        } catch (error: any) {
            console.error(error);
            let msg = "Error al restablecer contraseña";
            if (error instanceof ApiError) {
                msg = error.data?.message || error.message;
            }
            setErrors({ general: msg });
        } finally {
            setIsLoading(false);
        }
    };

    const closeSuccessModal = () => {
        setIsSuccess(false);
        navigate('/auth/login');
    };
    const clearErrors = () => setErrors({});

    return {
        formData,
        errors,
        isLoading,
        IsSuccess, //Estado del modal
        handleInputChange,
        handleSubmit,
        closeSuccessModal,
        isValidLink,
        clearErrors
    };
};