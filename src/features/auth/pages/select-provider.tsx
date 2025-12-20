import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

// Imports de Lógica y Tipos
import { useSelectProvider } from '../hooks/use-select-provider';
import { ProviderId } from '../../../types/accounts.types'; 
import { StatusModal } from '../../../components/ui/status-modal';

// Logos oficiales
const GoogleLogo = () => <FcGoogle size={32} />;
const OutlookLogo = () => <PiMicrosoftOutlookLogoFill size={32} color='#2196F3' />;

export const SelectProviderPage = () => {
    const navigate = useNavigate();
    
    // Usamos el hook que contiene toda la lógica de redirección y manejo de errores
    const { isLoading, error, handleSelectProvider, clearError } = useSelectProvider();

    return (
        <>
            {/* MODAL DE ERROR */}
            <StatusModal 
                isOpen={!!error}
                onClose={clearError}
                type="error"
                title="Error de conexión"
                description={error || ""}
                buttonText="Entendido"
            />

            {/* 2. OVERLAY DE CARGA */}
            {isLoading && (
                <div className="fixed inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4 border border-gray-100 dark:border-gray-700">
                        <Loader2 className="animate-spin text-brand-primary" size={48} />
                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                            Conectando con el proveedor...
                        </p>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            <div className="w-full max-w-5xl flex flex-col items-center justify-center p-6 lg:p-16 relative min-h-[500px]">

                <div className="w-full lg:w-auto lg:absolute lg:top-8 lg:left-8 mb-8 lg:mb-0">
                    <button
                        onClick={() => navigate(-1)}
                        disabled={isLoading}
                        className="text-text-adaptive hover:opacity-80 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft size={20} /> <span className="text-sm font-medium">Volver</span>
                    </button>
                </div>

                <div className="text-center mb-12 max-w-lg">
                    <h1 className="text-3xl lg:text-4xl font-bold text-text-adaptive mb-3">
                        Seleccione el proveedor
                    </h1>
                    <p className="text-text-adaptive font-medium opacity-90 text-sm lg:text-base">
                        Seleccione el servicio de la cuenta que desea vincular para la gestión de datos.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-6 lg:gap-8">

                    {/* TARJETA GOOGLE */}
                    <AccountCard
                        label="Google"
                        icon={<GoogleLogo />}
                        onClick={() => handleSelectProvider(ProviderId.GOOGLE)}
                    />

                    {/* TARJETA OUTLOOK (Cuando se configure) */}
                    <AccountCard
                        label="Outlook"
                        icon={<OutlookLogo />}
                        onClick={() => handleSelectProvider(ProviderId.OUTLOOK)}
                    />

                </div>
            </div>
        </>
    );
};