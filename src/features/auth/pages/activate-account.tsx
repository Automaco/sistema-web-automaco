/* -- Pagina de activacion de licencia -- */
import { Link } from 'react-router-dom';// Importamos ambos inputs
import { CodeInput, Button, StatusModal } from '../../../components/index'; // Input para clave
import { useActiveAccount } from '../hooks/use-active-account';


export const ActiveAccountPage = () => {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit,
        IsSuccess,
        handleSuccessClose,
        clearErrors
    } = useActiveAccount();

    return (
        // 👇 AQUÍ ESTÁ EL CAMBIO: Agregué 'items-center'
        <div className="flex h-screen w-full overflow-hidden justify-center items-center">

            {/*MODALS */}
            <StatusModal
                isOpen={!!IsSuccess}
                onClose={handleSuccessClose}
                type='success'
                title='!Cuenta activada con éxito!'
                description='Tu cuenta ha sido verificada correctamente. Redirigiendo al dashboard...'
                buttonText='Hecho'
            />
            <StatusModal
                isOpen={!!errors.general}
                onClose={clearErrors}
                type='error'
                title='No es posible activar la cuenta'
                description={errors.general || 'Contacta a soporte'}
                buttonText='Intentar de nuevo'
            />


            {/* SECCIÓN IZQUIERDA: Formulario */}
            <div className=" w-full sm:w-full max-w-[600px] max-h-[650px] flex flex-col justify-center items-center p-6 sm:p-8 border border-white/50 bg-bg-surface relative z-10 shadow-2xl rounded-tr-[3vw] rounded-br-[3vw] rounded-tl-[3vw] rounded-bl-[3vw] transition-colors duration-300">
                <div className="text-center mb-10 mt-15">
                    <h1 className="text-7xl font-bold text-brand-primary mb-2">
                        AutomaCo
                    </h1>
                    {/* text-text-muted: Gris adaptable */}
                    <p className="text-brand-primary mt-6 text-2xl">
                        Tu acceso esta protegido
                    </p>
                    {/* text-text-muted: Gris adaptable */}
                    <p className="text-brand-primary mt-2">
                        Activa tu cuenta
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 items-center justify-center mt-5">
                    <CodeInput
                        label="Ingresa el código de activacion"
                        name="code"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        value={formData.code}
                        onChange={handleInputChange}
                        maxLength={6}
                        error={errors.code}
                    />
                    <Button type="submit" className="mt-4" disabled={isLoading || !formData.code} >
                        {isLoading ? 'Redireccionando...' : 'Activar'}
                    </Button>
                </form>
                <div className="w-full text-center mt-5 mb-15">
                    <Link to="" className="text-xs text-brand-primary hover:text-brand-primary transition-colors"> {/* Logica a trabajar para solucionar problemas */}
                        ¿Tienes problemas? <span className="text-text-main font-medium hover:underline">Ponte en contacto</span>
                    </Link>
                </div>
            </div>

            {/* SECCIÓN Derecha: Promoción */}
            <div className="hidden lg:flex flex-col items-center w-1/2 justify-center h-full px-12 text-center text-white z-10">
            </div>
        </div>
    )
}