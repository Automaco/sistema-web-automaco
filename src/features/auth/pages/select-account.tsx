import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';

// Mock Icons
const GoogleIcon = () => (
    <div className="flex items-center justify-center w-full h-full --color-text-adaptive rounded-full">
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-red-500">G</span>
    </div>
);

const OutlookIcon = () => (
    <div className="flex items-center justify-center w-full h-full --color-text-adaptive rounded-full">
        <span className="text-blue-600 font-bold text-2xl">O</span>
    </div>
);

export const AccountListPage = () => {
    const navigate = useNavigate();

    const existingAccounts = [
        { id: 1, type: 'google', email: 'nodirectori@gmail.com', name: 'Google' },
        { id: 2, type: 'outlook', email: 'directori@outlook.com', name: 'Outlook' },
    ];

    return (
        <div className="w-full max-w-5xl flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 min-h-[500px]">

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-text-adaptive mb-3 drop-shadow-md">
                    Elige tu perfil
                </h1>
                <p className="text-text-adaptive/90 max-w-md mx-auto font-medium">
                    Selecciona con qué perfil deseas ingresar al sistema.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {/* Mapeo de cuentas existentes */}
                {existingAccounts.map((account) => (
                    <AccountCard
                        key={account.id}
                        label={account.name}
                        subLabel={account.email}
                        icon={account.type === 'google' ? <GoogleIcon /> : <OutlookIcon />}
                        onClick={() => navigate('/dashboard')}
                    />
                ))}

                {/* Botón Agregar Cuenta */}
                <AccountCard
                    label="Agregar cuenta"
                    variant="dashed"
                    subLabel="Vincular nuevo correo"
                    icon={<Plus size={32} />}
                    onClick={() => navigate('/accounts/select-provider')}
                />
            </div>
        </div>
    );
};