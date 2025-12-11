import { useState, type FormEvent, type ChangeEvent } from 'react';
import { MdEmail } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

// Interfaz para el estado de errores
interface FormErrors {
    email?: string;
}

export const useRecoverPassword = () => {
    const navigate = useNavigate();

    // Estados
    const [formData, setFormData] = useState({ email: '' });
    const [errors, setErrors] = useState<FormErrors>({}); // 👈 Nuevo estado de errores

    // --- ESTADOS DE UI (Cargas y Modal) ---
    const [isLoading, setIsLoading] = useState(false);     // Para el botón "Enviar instrucciones"
    const [isVerifying, setIsVerifying] = useState(false); // Para el botón "Confirmar código" dentro del modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Controla si se ve la ventana emergente

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

    const handleSendCode = async (e: FormEvent) => {
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

        try {
            console.log('Enviando datos:', formData.email);
            // Simulamos espera de API (1.5 segundos)
            await new Promise(resolve => setTimeout(resolve, 1500));

            setIsLoading(false);

            // 3. EN LUGAR DE REDIRIGIR, ABRIMOS EL MODAL
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // --- PASO 2: VERIFICAR CÓDIGO (Dentro del Modal) ---
    const handleVerifyCode = async () => {
        setIsVerifying(true);
        try {
            console.log('Verificando codigo...');
            // Simulacion de verificacion
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsVerifying(false);
            // Cerramos el modal
            setIsModalOpen(false);

            // Se redirige a la pantalla de cambio de contraseña
            navigate('/auth/reset-password',{
                state:{
                    verify: true, // Seguridad
                    email:formData.email // Campo a utilizar
                },
                replace: true // evita que retroceda
            })

        } catch (error) {
            console.error(error);
            setIsVerifying(false);
        }
    };

    // --- AUXILIAR: CERRAR MODAL ---
    const closeModal = () => {
        setIsModalOpen(false);
    }
    return {
        formData,
        errors,
        // Estados de UI
        isLoading,
        isVerifying,
        isModalOpen,
        // Funciones
        handleInputChange,
        handleSendCode,   // Usar en el <form> principal
        handleVerifyCode, // Usar en el botón del Modal
        closeModal        // Usar en el botón 'X' del Modal
    };
};