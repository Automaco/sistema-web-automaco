import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.services';

// 15 minutos en milisegundos (15 * 60 * 1000)
const INACTIVITY_LIMIT = 15 * 60 * 1000;

export const AutoLogout = ({ children }: { children: React.ReactNode }) => {
    const navigate = useNavigate();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Función para cerrar sesión
    const logout = useCallback(() => {
        authService.logout(); // Limpia localStorage
        navigate('/auth/login');
    }, [navigate]);

    // Función para reiniciar el temporizador
    const resetTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            // Opcional: Mostrar un modal de advertencia antes de cerrar
            // alert("Sesión cerrada por inactividad"); 
            logout();
        }, INACTIVITY_LIMIT);
    }, [logout]);

    useEffect(() => {
        // Eventos a escuchar para considerar al usuario "activo"
        const events = ['click', 'mousemove', 'keypress', 'scroll', 'touchstart'];

        // Iniciar el timer al montar
        resetTimer();

        // Agregar listeners
        events.forEach(event => window.addEventListener(event, resetTimer));

        // Limpieza al desmontar
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [resetTimer]);

    return <>{children}</>;
};