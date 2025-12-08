import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input, Button } from '../../../components/index';

export const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        // Contenedor "Grid" que organiza: [Caja Blanca] - [Texto Transparente]
        <div className="flex h-screen w-full overflow-hidden">

            {/* SECCIÓN IZQUIERDA: Formulario */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-white relative z-10">
                <div className="w-full max-w-md flex flex-col items-center text-center">

                    <h1 className="text-3xl font-bold text-brand-primary mb-2">
                        ¡Bienvenido de vuelta! <br /> Inicia sesión
                    </h1>
                    <p className="text-gray-400 mb-8">
                        Ingrese sus datos para iniciar sesión
                    </p>

                    <form className="w-full flex flex-col gap-5">
                        <Input
                            label="Correo electrónico"
                            type="email"
                            placeholder="Correo electrónico"
                        />

                        <Input
                            label="Contraseña"
                            type={showPassword ? "text" : "password"}
                            placeholder="Contraseña"
                            icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            onIconClick={() => setShowPassword(!showPassword)}
                        />

                        <div className="w-full text-right -mt-2.5">
                            <a href="#" className="text-xs text-gray-400 hover:text-brand-primary transition-colors">
                                ¿Se te ha olvidado tu cuenta? <span className="text-gray-600 font-medium">Recuperar contraseña</span>
                            </a>
                        </div>

                        <Button type="submit" className="mt-4">
                            Iniciar sesión
                        </Button>
                    </form>

                    <div className="mt-6 text-sm text-gray-400">
                        ¿No tienes cuenta? <a href="#" className="text-gray-700 font-bold hover:underline">Crea tu cuenta</a>
                    </div>
                </div>
            </div>

            {/* SECCIOn DERECHA: Registrarse */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
                <div className="relative z-10 text-center px-16 text-white max-w-lg">
                    <h2 className="text-4xl font-bold mb-4 drop-shadow-md">
                        ¿Aún no tienes cuenta?
                    </h2>
                    <p className="text-lg mb-12 text-white/90">
                        Empieza a usar AutomaCo
                    </p>

                    <div className="mb-12 space-y-4">
                        <h3 className="text-2xl font-semibold">
                            Optimiza tu tiempo y tu gestión contable
                        </h3>
                        <p className="text-white/90">
                            Accede a un sistema que trabaja por ti
                        </p>
                    </div>

                    <div className="w-48 mx-auto">
                        <Link to="/auth/register">
                            <Button variant="outline">
                                Registrate
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    );
};