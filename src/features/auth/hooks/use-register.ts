import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';


// Interfaz para el estado de errores
interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    general?: string;
}

export const useRegister = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // 👈 Nuevo estado de errores
    const [isLoading, setIsLoading] = useState(false);
    // Estado del modal para la confirmacion de datos
    const [IsSuccess, setSuccess] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Opcional: Limpiar el error cuando el usuario empieza a escribir de nuevo
        if (errors.general || errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
        }
    };

    // Función auxiliar para validar email
    const validateEmail = (email: string) => {
        // Regex estándar para email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 1. Validaciones previas
        const newErrors: FormErrors = {};
        if (!formData.name) {
            newErrors.name = "Campo obligatorio";
        }
        if (!formData.email) {
            newErrors.email = "El correo es obligatorio";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "El formato del correo no es válido";
        }
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

        // Si hay errores, los seteamos y detenemos el envío
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // 2. Si todo está bien, procedemos
        setIsLoading(true);

        try {
            // Se mapea los datos a enviar
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword //El cambio clave
            };
            // Envio
            const response = await authService.register(payload);
            // mensaje de confimacion
            console.log("Registro exitoso:", response);

            setSuccess(response.mensage || response.mensage || "Registro exitoso");
            setIsLoading(false);

        } catch (error: any) {
            // Error en consola
            console.error('Error inesperado: ', error);
            // Mensaje por defecto si todo falla
            let errorMessage = "Ocurrio un error inesperado";

            //Verificar si el servidor respondio (Data de la API)
            if (error.response) {
                const { status, data } = error.response;
                // Email duplicado
                if (status === 409) {
                    errorMessage = data.message || "Ingrese un correo diferente";
                } else if (status === 500) {
                    // Error del servidor
                    errorMessage = data.message || "Error del servidor";
                }
            } else if (error.request) {
                errorMessage = "No hay conexión. Intente más tarde.";
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Finalmente seteamos el mensaje dinámico
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }

    };
    const resetSuccess = () => {
        setSuccess('');
        navigate('/auth/Login')
    }
    const clearErrors = () => setErrors({});
    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        clearErrors,
        IsSuccess,
        resetSuccess
    };
};