import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Interfaz para el estado de errores
interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    text?: string;
}

export const useRegister = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ email: '', password: '', text: '', confirmPassword: '' });
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
        if (!formData.text) {
            newErrors.text = "Campo obligatorio";
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