import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, ArrowLeft } from 'lucide-react';
// Importamos ambos inputs
import { PasswordInput, Button } from '../../../components/index';
import { useResetPassword } from '../hooks/use-reset-password';

export const ResetPasswordPage = () => {

    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    } = useResetPassword();

    const location = useLocation();
    const navigate = useNavigate();

    // Proteccion de ruta, para que no pueda acceder sin hacer la verifiacion
    // ----------------------------
    // 1. OBTENEMOS EL ESTADO (La llave de seguridad)
     const { verified, email } = location.state || {};
 
        // 2. PROTECCIÓN DE RUTA
        useEffect(() => {
            // Si no viene la bandera 'verified', lo sacamos de aquí
            if (!verified) {
                navigate('/auth/recover-password', { replace: true });
            }
        }, [verified, navigate]);
    
        // Si no está verificado, no renderizamos nada mientras redirige (evita parpadeos)
        if (!verified) return null;
    // ----------------------------

    /* Componentes principales */
    return (
        // Contenedor principal
        <div className="flex h-screen w-full overflow-hidden">
            {/* SECCIÓN Izquierda*/}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">

            </div>
            {/* SECCIÓN Derecha: Formulario */}
            {/* bg-bg-surface: Se vuelve blanco en Light, Slate-800 en Dark */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tl-[1vw] rounded-bl-[1vw] transition-colors duration-300">
                <div className="w-full max-w-lg flex flex-col items-center">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-brand-primary mb-2">
                            Ingrese una nueva contraseña
                        </h1>
                        <br />
                        {/* text-text-muted: Gris adaptable */}
                        <p className="text-text-muted">
                            Por favor complete los siguientes campos para continuar con el restablecimiento de contraseña
                        </p>
                    </div>
                    {/* Seccion de formulario */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center">
                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                        {/* Confirmacion de contraseña */}
                        <PasswordInput
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                        />
                        <Button type="submit" className="mt-4" disabled={isLoading} >
                            {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                        </Button>
                    </form>

                </div>
            </div>



        </div>
    );
};