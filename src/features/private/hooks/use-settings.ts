// Validaciones de campos para settins 
import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/auth.services';

// Interfaz para el estado de errores
interface FormErrors {
    email?: string;
    password?: string;
    confirmPassword?: string;
    text?: string;
}

export const useSettings = () => {
    // Limpiar campos
    const initialState = { email: '', password: '', text: '', confirmPassword: '' };
    // Estados
    const [formData, setFormData] = useState({ email: '', password: '', text: '', confirmPassword: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // 👈 Nuevo estado de errores
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Limpiar campos
    const handleReset = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setFormData(initialState); // Limpia los datos
        setErrors({});             // Limpia los errores
    };

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

    // Logica de validaciones
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
            }, 1000);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };


    // --- LÓGICA DE CIERRE DE SESIÓN (Logout) ---
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // 1. Abrir modal
    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };
    // 2. Cancelar / Cerrar
    const closeLogoutModal = () => {
        if (!isLoggingOut) setIsLogoutModalOpen(false);
    };
    // 3. Confirmar Logout (Con spinner y timeout)
    const confirmLogout = () => {
        setIsLoggingOut(true);

        setTimeout(() => {
            authService.logout(); // Tu servicio de logout real
            setIsLoggingOut(false);
            setIsLogoutModalOpen(false);
            navigate('/auth/login'); // Redirección
        }, 1500);
    };

    return {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        handleReset,

        // Exportamos para el cierre de sesion
        // Logout (Lo que necesitas)
        isLogoutModalOpen,
        isLoggingOut,
        handleLogoutClick, // Poner en el botón de cerrar sesión
        confirmLogout,     // Poner en "Sí, salir" del modal
        closeLogoutModal   // Poner en "Cancelar" del modal
    };
};