// Pantalla de recuperacion de contraseña
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react'; // Importamos el icono para el input general
// Importamos ambos inputs
import { Input, Button } from '../../../components/index';
import { useRecoverPassword } from '../hooks/use-recover-password';

export const RecoverPasswordPage = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    } = useRecoverPassword();


    return (
        // Contenedor principal
        <div className="flex h-screen w-full overflow-hidden">
            {/* SECCIÓN IZQUIERDA: Promoción */}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">

            </div>
            {/* SECCIÓN IZQUIERDA: Formulario */}
            {/* bg-bg-surface: Se vuelve blanco en Light, Slate-800 en Dark */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tl-[1vw] rounded-bl-[1vw] transition-colors duration-300">
                <div className="w-full max-w-md flex flex-col items-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-brand-primary mb-7">
                            ¿Olvidaste la contraseña?
                        </h1>
                        <p className="text-text-muted mb-2" >
                            Ingresa el correo electrónico asociado a tu cuenta para poder procesar el restablecimiento de la contraseña
                        </p>

                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center">

                        {/* 2. INPUT GENERAL (Con icono opcional) */}
                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            // Aquí pasamos el icono como componente, mucho más flexible
                            icon={<Mail size={20} />}
                            error={errors.email}
                        />

                        <Button type="submit" className="mt-4" disabled={isLoading} >
                            {isLoading ? 'Confirmando...' : 'Siguiente paso'}
                        </Button>
                        <p>
                            <Link to="/auth/login" className="text-text-main font-semibold hover:underline hover:text-brand-primary ml-1">Volver al inicio</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};