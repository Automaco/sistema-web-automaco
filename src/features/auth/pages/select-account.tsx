import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';

// Mock Icons (Simples letras por ahora)
const GoogleIcon = () => <span className="font-bold text-2xl bg-clip-text text-transparent bg-linear-to-r from-blue-500 to-red-500">G</span>;
const OutlookIcon = () => <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">O</span>;

export const AccountListPage = () => {
    const navigate = useNavigate();

    const existingAccounts = [
        { id: 1, type: 'google', email: 'nodirectori@gmail.com', name: 'Google' },
        { id: 2, type: 'outlook', email: 'directori@outlook.com', name: 'Outlook' },
    ];

    return (
        // Contenedor Responsive: Fondo adaptativo (bg-bg-surface)
        <div className="w-full max-w-5xl flex flex-col justify-center items-center p-8 sm:p-12 lg:p-16 
      bg-bg-surface shadow-2xl rounded-[3vw] transition-colors duration-300 min-h-[500px]">

            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-brand-primary mb-3">
                    Selecciona la cuenta
                </h1>
                {/* Texto muted se adapta automáticamente (Gris en Light / Gris claro en Dark) */}
                <p className="text-text-muted max-w-md mx-auto">
                    Selecciona con qué correo deseas ingresar al sistema hoy.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 sm:gap-8">

                {existingAccounts.map((account) => (
                    <AccountCard
                        key={account.id}
                        label={account.name}
                        subLabel={account.email}
                        icon={account.type === 'google' ? <GoogleIcon /> : <OutlookIcon />}
                        onClick={() => console.log(`Login con ${account.name}`)}
                    />
                ))}

                {/* Botón "Agregar" (Dashed) */}
                <AccountCard
                    label="Agregar cuenta"
                    variant="dashed"
                    icon={<Plus size={32} className="text-brand-primary" />}
                    onClick={() => navigate('/auth/select-provider')}
                />

            </div>
        </div>
    );
};