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


    return {
        formData,
        errors,

    };
};