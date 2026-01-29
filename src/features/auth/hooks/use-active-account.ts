import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';
import { ApiError } from '../../../utils/http-client';
import { PrivateGuard } from '../../../layouts';


// Interfaz para el estado de errores
interface FormErrors {
    code?: string;
    general?: string;
}

export const useActiveAccount = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ code: '' });
    const [errors, setErrors] = useState<FormErrors>({}); //  Nuevo estado de errores
    const [isLoading, setIsLoading] = useState(false);
    const [IsSuccess, SetIsSuccess] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const upperValue = value.toUpperCase();

        setFormData(prev => ({ ...prev, [name]: upperValue }));

        // Opcional: Limpiar el error cuando el usuario empieza a escribir de nuevo
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
        }

    };
    // Envio de formulario
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 1. Validaciones previas
        const newErrors: FormErrors = {};

        if (!formData.code) {
            newErrors.code = "Campo obligatorio";
        } else if (formData.code.length < 6) {
            newErrors.code = "La clave debe tener al menos 6 caracteres";
        }

        // Si hay errores, los seteamos y detenemos el envío
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 2. Si todo está bien, procedemos
        setIsLoading(true);
        setErrors({}); // Limpiar errores previos

        try {
            // Servicio de activeaccount
            await authService.activationAccount({ code: formData.code });
            // Si funciona activamos el estado de exito
            SetIsSuccess(true);
        } catch (error: any) {
            console.error('Error de activacion: ', error);
            let msg = 'No se logro activar la cuenta, intente nuevamente.';

            if (error instanceof ApiError) {
                msg = error.data?.message || error.message;
            }
            // mostramos el error general
            setErrors({ general: msg });
        } finally {
            setIsLoading(false);
        }
    };

    // Cerramos el modal de éxito y redirigimos
    const handleSuccessClose = () => {
        SetIsSuccess(false);
        // IMPORTANTE: Redirigimos explícitamente a la selección de cuentas.
        // Como el localStorage ya dice "is_active: true", el ActivationGuard dejará salir al usuario.
        navigate('/accounts/select-account', { replace: true });
    }
    
    // Cerramos el modal de error
    const clearErrors = () => {
        setErrors({});
    }

    return {
        formData,
        errors,
        IsSuccess,
        isLoading,
        handleInputChange,
        handleSubmit,
        handleSuccessClose,
        clearErrors,

    };
};