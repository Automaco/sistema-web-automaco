import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { AccountCard } from '../../../components/account-card';

// Logos oficiales (SVG) - Se ven bien en blanco y oscuro
const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" /><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" /><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" /><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.799 L -6.734 42.379 C -8.804 40.439 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" /></g></svg>
);

const OutlookLogo = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" fill="#0078D4"><path d="M1.313 12.063v7.5c0 .656.5 1.125 1.125 1.125h5.25v-8.625L1.312 12.06zm13.312 8.625h6.938c.656 0 1.125-.469 1.125-1.125v-7.5l-8.063-.062v8.687zm-6.187 0h5.062V11.25H8.438v9.438zm6.187-10.5L8.438 10.186V4.373L14.625 2.5v7.688zM21.562 6v4.688l-6.938.062V2.812c0-.469.219-.844.688-.656l6.25 3.844zm-20.25 4.688l6.938.062V2.811c0-.469-.219-.844-.688-.656l-6.25 3.844v4.688z" /></svg>
);

export const SelectProviderPage = () => {
    const navigate = useNavigate();

    return (
        // bg-bg-surface se encarga de cambiar a oscuro automáticamente
        <div className="w-full max-w-5xl flex flex-col items-center justify-center p-8 lg:p-16 
      bg-bg-surface shadow-2xl rounded-[3vw] relative transition-colors duration-300 min-h-[500px]">

            {/* Botón Volver (Flecha): text-text-muted adapta el color del icono y texto */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-8 left-8 text-text-muted hover:text-brand-primary transition-colors flex items-center gap-2"
            >
                <ArrowLeft size={20} /> <span className="text-sm font-medium">Volver</span>
            </button>

            <div className="text-center mb-12 max-w-lg">
                <h1 className="text-3xl font-bold text-brand-primary mb-3">
                    Seleccione el proveedor
                </h1>
                <p className="text-text-muted">
                    Seleccione el servicio que desea vincular para la gestión de datos.
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
                    // Icono 'Mail' se adapta: Gris medio en Light, Gris claro en Dark
                    icon={<Mail size={32} className="text-gray-500 dark:text-gray-300" />}
                    onClick={() => console.log("Otros Click")}
                />

            </div>
        </div>
    );
};