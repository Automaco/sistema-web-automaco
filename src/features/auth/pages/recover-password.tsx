// Pantalla de recuperacion de contraseña
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, X, CheckCircle2 } from 'lucide-react'; // Importamos el icono para el input general
import { useState } from 'react';
// Importamos ambos inputs
import { Input, Button } from '../../../components/index';
import { useRecoverPassword } from '../hooks/use-recover-password';

// Logica para el manejo del modal
// Componente del modal (Ventana emergente)
interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerify: () => void;
    isLoading: boolean;
    email: string;
}


const VerificationModal = ({ isOpen, onClose, onVerify, isLoading, email }: VerificationModalProps) => {
    const [code, setCode] = useState("");
    // Si no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Fondo oscuro con desenfoque (Backdrop) */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Contenedor de la ventana */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in fade-in zoom-in duration-300">

                {/* Botón cerrar (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center">
                    {/* Icono de éxito */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                        <CheckCircle2 size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Revisa tu correo
                    </h3>

                    <p className="text-sm text-gray-500 mb-6 px-2">
                        Hemos enviado un código de verificación a: <br />
                        <span className="font-semibold text-gray-800">{email}</span>
                    </p>

                    {/* Input simulado para el código (Visual) */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            Ingresa el código
                        </label>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            // 2. Vinculamos el valor al estado
                            value={code}
                            // 3. Propiedad vital para móviles (abre teclado numérico)
                            inputMode="numeric"
                            className="w-full text-center text-3xl font-bold tracking-[0.5em] text-gray-800 border-b-2 border-gray-200 focus:border-brand-primary focus:outline-none py-2 transition-colors placeholder:text-gray-200"

                            onChange={(e) => {
                                const value = e.target.value;

                                // 4. VALIDACIÓN ESTRICTA:
                                // Solo actualizamos el estado si está vacío O si son solo dígitos
                                if (value === '' || /^\d+$/.test(value)) {
                                    setCode(value);
                                }
                            }}
                        />
                    </div>

                    {/* Botón de Confirmar */}
                    <Button
                        onClick={onVerify}
                        disabled={isLoading || code.length < 6} // Opcional: Deshabilitar si no son 6 dígitos
                        className="w-full h-11"
                    >
                        {isLoading ? 'Verificando...' : 'Confirmar código'}
                    </Button>

                    <button
                        onClick={onClose} // Aquí podrías poner una función de reenviar real
                        className="mt-5 text-xs text-brand-primary font-medium hover:underline"
                    >
                        ¿No recibiste el código? Reenviar
                    </button>
                </div>
            </div>
        </div>
    );
};


/* -- Pagina principal */
export const RecoverPasswordPage = () => {
    const {
        formData,
        errors,
        isLoading,
        isVerifying,   // Carga del modal
        isModalOpen,   // Estado del modal
        handleInputChange,
        handleSendCode,
        handleVerifyCode,
        closeModal
    } = useRecoverPassword();


    return (
        // Contenedor principal
        <div className="flex h-screen w-full overflow-hidden">
            {/* SECCIÓN IZQUIERDA: Promoción */}
            {/* Esta sección mantiene sus colores fijos (blanco sobre verde) */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">

            </div>
            {/* Renderizamos el Modal (se mostrará solo si isModalOpen es true) */}
            <VerificationModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onVerify={handleVerifyCode}
                isLoading={isVerifying}
                email={formData.email}
            />
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

                    <form onSubmit={handleSendCode} className="w-full flex flex-col gap-5 items-center">

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