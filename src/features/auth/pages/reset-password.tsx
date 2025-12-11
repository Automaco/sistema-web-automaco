import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
// Importamos ambos inputs
import { PasswordInput, Button } from '../../../components/index';


export const ResetPasswordPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

// Proteccion de ruta, para que no pueda acceder sin hacer la verifiacion
// ----------------------------
    // 1. OBTENEMOS EL ESTADO (La llave de seguridad)
   // const { verified, email } = location.state || {};
/*
    // 2. PROTECCIÓN DE RUTA
    useEffect(() => {
        // Si no viene la bandera 'verified', lo sacamos de aquí
        if (!verified) {
            navigate('/auth/recover-password', { replace: true });
        }
    }, [verified, navigate]);

    // Si no está verificado, no renderizamos nada mientras redirige (evita parpadeos)
    if (!verified) return null;*/
// ----------------------------

    /* Componentes principales */ 
    return (
        // Contenedor principal
        <div className="flex h-screen w-full overflow-hidden">

            {/* SECCIÓN IZQUIERDA: Formulario */}
            {/* bg-bg-surface: Se vuelve blanco en Light, Slate-800 en Dark */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tr-[1vw] rounded-br-[1vw] transition-colors duration-300">
                <div className="w-full max-w-sm flex flex-col items-center">

                </div>
            </div>

            {/* SECCIÓN DERECHA: Promoción */}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">

            </div>

        </div>
    );
};