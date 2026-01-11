import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

export const useLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors.general || errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined, general: undefined }));
        }
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        //VALIDACIONES
        const newErrors: FormErrors = {};
        if (!formData.email) newErrors.email = "El correo electrónico es obligatorio";
        else if (!validateEmail(formData.email)) newErrors.email = "El formato del correo no es válido";

        if (!formData.password) newErrors.password = "La contraseña es obligatoria";
        else if (formData.password.length < 8) newErrors.password = "La contraseña debe tener al menos 8 caracteres";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // 1. Hacemos la petición
            const response = await authService.login(formData);

            // VERIFICACIÓN DE ACTIVACIÓN
            if (response.require_activation) {
                navigate('/auth/active-account');
            } else {
                // Si no requiere activación, entra al dashboard
                navigate('/accounts/select-account');
            }

        } catch (error) {
            console.error('Login failed', error);
            let errorMessage = "Ocurrió un error inesperado";

            // Verificamos si es un Error real antes de usarlo
            if (error instanceof Error) {
                try {
                    // Intentamos leer el JSON del error si viene del httpClient
                    const parsed = JSON.parse(error.message);

                    errorMessage = parsed.message;

                } catch {
                    // Mensaje por defecto si no es JSON
                    errorMessage = "Error de conexión";
                }
            }

            // credenciales incorrectas (401)
            if (errorMessage.includes('Credenciales inválidas') || errorMessage.includes('Unauthorized')) {
                errorMessage = 'Correo o contraseña incorrectos.';
            }

            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const clearErrors = () => setErrors({});

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        clearErrors
    };
};