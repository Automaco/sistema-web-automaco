import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../../store/auth.store'; // (seria lo de futuro)

export const useLogin = () => {
    const navigate = useNavigate();

    // Estado para la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Estado del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log('Enviando datos:', formData);
            // Aquí iría la llamada al api donde seria el service servicio: await authService.login(formData);

            // Simulación de éxito
            setTimeout(() => {
                setIsLoading(false);
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    return {
        formData,
        showPassword,
        isLoading,
        togglePasswordVisibility,
        handleInputChange,
        handleSubmit
    };
};