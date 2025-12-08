import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../../../components/index';
import { useLogin } from '../hooks/use-login';

export const LoginPage = () => {
    // Usamos el hook para toda la lógica
    const {
        formData,
        showPassword,
        isLoading,
        togglePasswordVisibility,
        handleInputChange,
        handleSubmit
    } = useLogin();

    return (
        // Contenedor principal Grid: Izquierda (Blanco/Oscuro) | Derecha (Transparente)
        <div className="flex h-screen w-full overflow-hidden">

            {/* SECCIÓN IZQUIERDA: Formulario */}
            {/* CAMBIO: bg-white -> bg-bg-surface (Para que cambie a oscuro) */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tr-[3vw] rounded-br-[4vw] transition-colors duration-300">
                <div className="w-full max-w-sm flex flex-col items-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-brand-primary mb-2">
                            ¡Bienvenido de vuelta! <br /> Inicia sesión
                        </h1>
                        {/* CAMBIO: text-brand-primary (era un poco fuerte) -> text-text-muted (gris adaptable) */}
                        <p className="text-text-muted">
                            Ingrese sus datos para iniciar sesión
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <Input
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            placeholder="Correo electrónico"
                            value={formData.email}
                            onChange={handleInputChange}
                        />

                        <Input
                            label="Contraseña"
                            name="password"
                            placeholder="Contraseña"
                            value={formData.password}
                            iconType="password"
                        />

                        <div className="w-full text-right -mt-2">
                            {/* CAMBIO: text-gray-400 -> text-text-muted */}
                            <a href="#" className="text-xs text-text-muted hover:text-brand-primary transition-colors">
                                {/* CAMBIO: text-gray-600 -> text-text-main */}
                                ¿Se te ha olvidado tu cuenta? <span className="text-text-main font-medium">Recuperar contraseña</span>
                            </a>
                        </div>

                        <Button type="submit" className="mt-4" disabled={isLoading} >
                            {isLoading ? 'Iniciando...' : 'Iniciar sesión'}
                        </Button>
                    </form>

                    {/* En Móvil, mostramos la opción de registro aquí */}
                    {/* CAMBIO: text-gray-400 -> text-text-muted */}
                    <div className="mt-6 text-sm text-text-muted lg:hidden">
                        <p>
                            {/* CAMBIO: text-gray-700 -> text-text-main (solo para el link) */}
                            ¿No tienes cuenta? <Link to="/auth/register" className="text-text-main font-bold hover:underline hover:text-brand-primary ml-1">Crea tu cuenta</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DERECHA: Promoción */}
            {/* NOTA: Aquí mantenemos text-white porque el fondo siempre es verde/gradiente, incluso en modo oscuro */}
            <div className="hidden lg:flex flex-col relative items-center justify-center p-12 text-center text-white z-10">

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