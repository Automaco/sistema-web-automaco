import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';
import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";
import { FcGoogle } from "react-icons/fc";

// Logos oficiales
const GoogleLogo = () => (
    <FcGoogle size={32} />
);

const OutlookLogo = () => (
    <PiMicrosoftOutlookLogoFill size={32} color='#2196F3'/>
);

export const SelectProviderPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-5xl flex flex-col items-center justify-center p-3 lg:p-16 relative min-h-[500px]">

            {/* Botón Volver */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 text-text-adaptive hover:opacity-80 transition-opacity flex items-center gap-2"
            >
                <ArrowLeft size={20} /> <span className="text-sm font-medium">Volver</span>
            </button>

            <div className="text-center mb-12 max-w-lg">
                <h1 className="text-4xl font-bold text-text-adaptive mb-3">
                    Seleccione el proveedor
                </h1>
                <p className="text-text-adaptive font-medium opacity-90">
                    Seleccione el servicio de la cuenta que desea vincular para la gestión de datos.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-8">

                <AccountCard
                    label="Google"
                    icon={<GoogleLogo />}
                    onClick={() => console.log("Google Click")}
                />

                <AccountCard
                    label="Outlook"
                    icon={<OutlookLogo />}
                    onClick={() => console.log("Outlook Click")}
                />

                <AccountCard
                    label="Otros"
                    icon={<Mail size={32} className="text-gray-500 dark:text-gray-300" />}
                    onClick={() => console.log("Otros Click")}
                />

            </div>
        </div>
    );
};