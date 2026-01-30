import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
// Importamos ambos inputs
import { PasswordInput, Button, StatusModal, PasswordRequirements } from '../../../components/index';
import { useResetPassword } from '../hooks/use-reset-password';

export const ResetPasswordPage = () => {

    const {
        formData,
        errors,
        isLoading,
        IsSuccess, //Estado del modal
        handleInputChange,
        handleSubmit,
        closeSuccessModal,
        isValidLink,
        clearErrors
    } = useResetPassword();

    /* Componentes principales */
    const renderContent = () => {

        // CASO A: El enlace está roto, incompleto o manipulado
        if (!isValidLink) {
            return (
                <div className="flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <ShieldAlert className="text-red-500 " size={40} />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Enlace no válido
                    </h2>

                    <p className="text-gray-500 mb-8 max-w-xs leading-relaxed">
                        Este enlace de recuperación está incompleto o ha expirado. Por seguridad, no podemos continuar.
                    </p>

                    {/* Botón para reiniciar el proceso */}
                    <Link to="/auth/recover-password" className="w-full">
                        <Button variant="outline" className="w-full border-2 h-12">
                            Solicitar nuevo enlace
                        </Button>
                    </Link>

                    <div className="mt-8">
                        <Link to="/auth/login" className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            );
        }

        // CASO B: El enlace es correcto = Se muestra el form
        return (
            <div className="w-full max-w-lg flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-brand-primary mb-3">
                        Nueva contraseña
                    </h1>
                    <p className="text-text-muted">
                        Crea una contraseña segura para recuperar el acceso a tu cuenta.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center">
                    <PasswordInput
                        label="Contraseña"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                    />

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

                    <Button type="submit" className="mt-4 w-full h-12 text-lg" disabled={isLoading}>
                        {isLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                    </Button>
                </form>
            </div>
        );
    };

    // RENDERIZADO PRINCIPAL

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* MODAL DE ÉXITO */}
            <StatusModal
                isOpen={!!IsSuccess}
                onClose={closeSuccessModal}
                type='success'
                title='Contraseña actualizada'
                description='Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión.'
                buttonText='Ir al Login'
            />

            {/* MODAL DE ERROR */}
            <StatusModal
                isOpen={!!errors.general}
                onClose={clearErrors}
                type='error'
                title='¡Cuidado!'
                description={errors.general}
                buttonText='Intentar de nuevo'
            />

            {/* SECCIÓN IZQUIERDA (Decoración / Branding) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-white z-10">
            </div>

            {/* SECCIÓN DERECHA */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-bg-surface relative z-10 transition-colors duration-300">
                {/* Se rendendiza*/}
                {renderContent()}
            </div>
        </div>
    );

};