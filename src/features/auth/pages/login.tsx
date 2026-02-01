import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react'; // Importamos el icono para el input general
// Importamos ambos inputs
import { Input, PasswordInput, Button, StatusModal } from '../../../components/index';
import { useLogin } from '../hooks/use-login';

export const LoginPage = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        clearErrors
    } = useLogin();

    return (
        // Contenedor principal
        <div className="flex h-screen w-full overflow-hidden">

            {/* MODAL 
                Se muestra automáticamente si existe errors.general.
                Al cerrar, limpiamos el error en el hook.
            */}
            <StatusModal
                isOpen={!!errors.general} // Convierte el string a boolean
                onClose={clearErrors}
                type="error"
                title="Error al iniciar sesión"
                description={errors.general}
                buttonText="Intentar de nuevo"
            />

            {/* SECCIÓN IZQUIERDA: Formulario */}
            {/* bg-bg-surface: Se vuelve blanco en Light, Slate-800 en Dark */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tr-[1vw] rounded-br-[1vw] transition-colors duration-300">
                <div className="w-full max-w-sm flex flex-col items-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-title mb-2">
                            ¡Bienvenido de vuelta! <br /> Inicia sesión
                        </h1>
                        {/* text-text-muted: Gris adaptable */}
                        <p className="text-text-muted">
                            Ingrese sus datos para iniciar sesión
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center">

                        {/* 1. INPUT GENERAL (Con icono opcional) */}
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

                        {/* 2. INPUT DE CONTRASEÑA (Separado) */}
                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />

                        <div className="w-full text-center -mt-2">
                            <Link to="/auth/recover-password" className="text-xs text-text-muted hover:text-brand-primary transition-colors">
                                ¿Se te ha olvidado tu cuenta? <span className="text-text-main font-medium hover:underline">Recuperar contraseña</span>
                            </Link>
                        </div>

                        <Button type="submit" className="mt-4" disabled={isLoading} >
                            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                        </Button>
                    </form>

                    {/* Footer Móvil */}
                    <div className="mt-6 text-sm text-text-muted lg:hidden">
                        <p>
                            ¿No tienes cuenta? <Link to="/auth/register" className="text-text-main font-bold hover:underline hover:text-brand-primary ml-1">Crea tu cuenta</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DERECHA: Promoción */}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">


                <h2 className="text-4xl xl:text-5xl font-bold mb-2 drop-shadow-md">
                    ¿Aún no tienes cuenta?
                </h2>
                <p className="text-lg mb-12 text-white/90">
                    Empieza a usar AutomaCo
                </p>

                <div className="space-y-4 mb-12">
                    <h3 className="text-2xl font-semibold opacity-95">
                        Optimiza tu tiempo y gestión
                    </h3>
                    <p className="text-lg text-white/90 max-w-xs mx-auto">
                        Accede a un sistema que trabaja por ti de forma automatizada.
                    </p>
                </div>

                <Link to="/auth/register">
                    <Button variant="outline" className="px-10 py-3 border-2">
                        Registrate
                    </Button>
                </Link>

            </div>

        </div>
    );
};