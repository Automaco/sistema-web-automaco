/* Pagina de registro de cuenta */
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react'; // Importamos el icono para el input general
// Importamos ambos inputs
import { Input, PasswordInput, Button, StatusModal, PasswordRequirements } from '../../../components/index';
import { useRegister } from '../hooks/use-register';


export const RegisterPage = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        clearErrors, // Modal de errores
        IsSuccess,// Modal de confirmacion
        resetSuccess, // Reseteo de modal
    } = useRegister();


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
                title="Datos erroneos"
                description={errors.general}
                buttonText="Intentar de nuevo"
            />
            {/* MODAL 
                Modal para mostrar confirmacion
        */}
            <StatusModal
                isOpen={!!IsSuccess} // Convierte el string a boolean
                onClose={resetSuccess}
                type="success"
                title="¡Cuenta Creada"
                description={IsSuccess}
                buttonText="Iniciar sesión"
            />

            {/* SECCIÓN IZQUIERDA: Promoción */}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">
                <h2 className="text-4xl xl:text-5xl font-bold mb-2 drop-shadow-md">
                    ¿Ya tienes cuenta?
                </h2>
                <p className="text-lg mb-12 text-white/90">
                    Inicia sesión con tu cuenta
                </p>
                <div className="space-y-4 mb-12">
                    <h3 className="text-2xl font-semibold opacity-95">
                        Productividad para despachos contables
                    </h3>
                    <p className="text-lg text-white/90 max-w-xs mx-auto">
                        Optimiza la gestión de tus clientes
                    </p>
                </div>
                <Link to="/auth/login">
                    <Button variant="outline" className="px-10 py-3 border-2">
                        Inicia sesión
                    </Button>
                </Link>
            </div>
            {/* SECCIÓN IZQUIERDA: Formulario */}
            {/* bg-bg-surface: Se vuelve blanco en Light, Slate-800 en Dark */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 rounded-tl-[1vw] rounded-bl-[1vw] transition-colors duration-300">
                <div className="w-full max-w-sm flex flex-col items-center">

                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-title mb-2">
                            Crear cuenta
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 items-center">
                        {/* 1. INPUT GENERAL (Con icono opcional) */}
                        <Input
                            label="Nombre de la institución"
                            name="name"
                            type="text"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleInputChange}
                            error={errors.name}
                        />

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

                        {/* 3. INPUT DE CONTRASEÑA (Separado) */}
                        <PasswordInput
                            label="Contraseña"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleInputChange}
                            error={errors.password}
                        />
                        {/* 4. CONFIRMACION DE CONTRASEÑA (Separado) */}
                        <PasswordInput
                            label="Confirmar contraseña"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            error={errors.confirmPassword}
                        />
                        {/* Requerimientos de contraseña */}
                        {formData.password.length > 0 && (
                            <PasswordRequirements password={formData.password} />
                        )}
                        <Button type="submit" className="mt-4" disabled={isLoading  } >
                            {isLoading ? 'Registrando...' : 'Registrar'}
                        </Button>
                    </form>

                    {/* Footer Móvil */}
                    <div className="mt-6 text-sm text-text-muted lg:hidden">
                        <p>
                            ¿Ya tienes cuenta? <Link to="/auth/login" className="text-text-main font-bold hover:underline hover:text-brand-primary ml-1">Iniciar sesión</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};