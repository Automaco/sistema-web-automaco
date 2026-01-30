import { Plus, Loader2, Mail } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';
import { useAccountSelection, type ConnectedAccount } from '../hooks/use-account-selection';
import { StatusModal } from '../../../components/index';


// Componentes visuales para los iconos
const GoogleIcon = () => (
    <div className="flex items-center justify-center w-full h-full bg-white rounded-full border border-gray-100 shadow-sm">
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-red-500">G</span>
    </div>
);

const OutlookIcon = () => (
    <div className="flex items-center justify-center w-full h-full bg-[#0078D4] rounded-full shadow-sm">
        <span className="text-white font-bold text-2xl">O</span>
    </div>
);

const DefaultIcon = () => (
    <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-full">
        <Mail className="text-gray-500" />
    </div>
);

export const AccountListPage = () => {
    // Usamos el hook para toda la lógica
    const { accounts,
        isLoading,
        errors,
        clearErrors,
        handleSelectAccount,
        handleAddAccount } = useAccountSelection();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 min-h-[80vh]">
            {/**
        * Estados de modal: Falso
        */}
            <StatusModal
                isOpen={!!errors.general}
                onClose={clearErrors}
                type='error'
                title='!Ocurrio un error'
                description={errors.general}
                buttonText='Entendido'
            />
            <div className="text-center mb-12 animate-fade-in-down">
                <h1 className="text-4xl font-bold text-text-adaptive mb-3 drop-shadow-sm">
                    Elige tu perfil
                </h1>
                <p className="text-text-adaptive max-w-md mx-auto font-medium text-lg">
                    {accounts.length > 0
                        ? 'Selecciona la cuenta vinculada para gestionar tus DTEs.'
                        : 'No tienes cuentas vinculadas. Agrega una para comenzar.'}
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 animate-fade-in-up">

                {/* Mapeo de cuentas reales del Backend */}
                {accounts.map((account: ConnectedAccount) => (
                    <AccountCard
                        key={account.id}
                        label={account.email_provider_id === 1 ? 'Google' : account.email_provider_id === 2 ? 'Outlook' : 'Email'}
                        subLabel={account.email}
                        // Renderizado condicional del icono según el ID del proveedor
                        icon={
                            account.email_provider_id === 1 ? <GoogleIcon /> :
                                account.email_provider_id === 2 ? <OutlookIcon /> :
                                    <DefaultIcon />
                        }
                        onClick={() => handleSelectAccount(account)}
                    />
                ))}

                {/* Botón Agregar Cuenta (Siempre visible) */}
                <AccountCard
                    label="Agregar cuenta"
                    variant="dashed"
                    subLabel="Vincular nuevo correo"
                    icon={<Plus size={32} className="text-text-muted group-hover:text-brand-primary transition-colors" />}
                    onClick={handleAddAccount}
                />
            </div>
        </div>
    );
};