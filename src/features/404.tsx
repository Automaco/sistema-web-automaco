import { useNavigate } from 'react-router-dom';
import { Home, MoveLeft, FileQuestion } from 'lucide-react';
import { Button } from '../components/button'; 

export const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        // CONTENEDOR PRINCIPAL
        // 1. Padding reducido en móvil (p-6) vs escritorio (p-16)
        // 2. Ancho máximo controlado para que no se estire demasiado
        <div className="w-full max-w-xl lg:max-w-2xl flex flex-col items-center justify-center 
            p-6 sm:p-8 lg:p-10 m-3
            bg-bg-surface shadow-2xl rounded-3xl sm:rounded-[3vw] 
            relative z-20 text-center transition-colors duration-300 mx-4 overflow-hidden">

            {/* Icono Decorativo Flotante (Tamaño responsive) */}
            <div className="mb-4 sm:mb-6 p-4 sm:p-6 rounded-full bg-brand-primary/10 animate-pulse">
                {/* Ajustamos el tamaño del icono manualmente con clases w/h */}
                <FileQuestion className="text-brand-primary w-12 h-12 sm:w-16 sm:h-16" />
            </div>

            {/* Título Gigante "404" (Responsive) */}
            {/* Móvil: text-7xl | Tablet: text-8xl | PC: text-9xl */}
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black text-brand-primary tracking-tighter opacity-90 select-none drop-shadow-sm leading-none">
                404
            </h1>

            {/* Mensaje Principal */}
            <h2 className="text-xl sm:text-3xl font-bold text-text-main mt-4 mb-2">
                ¡Vaya! Página no encontrada
            </h2>

            {/* Descripción */}
            <p className="text-text-muted text-sm sm:text-lg mb-5 sm:mb-10 max-w-md mx-auto leading-relaxed">
                Parece que la página que buscas no existe, se ha movido o el enlace está roto.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center items-center">

                {/* Opción 1: Volver atrás */}
                <button
                    onClick={() => navigate(-1)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border-base text-text-muted font-semibold hover:border-brand-primary hover:text-brand-primary transition-all dark:hover:bg-slate-700/50 text-sm sm:text-base"
                >
                    <MoveLeft size={18} className="sm:w-5 sm:h-5" />
                    <span>Volver atrás</span>
                </button>

                {/* Opción 2: Ir al inicio (Botón Principal) */}
                <div className="w-full sm:w-48">
                    <Button onClick={() => navigate('/auth/login')} className="text-sm sm:text-base">
                        <div className="flex items-center justify-center gap-2">
                            <Home size={18} className="sm:w-5 sm:h-5" />
                            <span>Ir al Inicio</span>
                        </div>
                    </Button>
                </div>
            </div>

            {/* Decoración sutil inferior */}
            <div className="mt-4 sm:mt-5 text-[10px] sm:text-xs text-text-muted/50 font-mono">
                ERR_CODE: 404_NOT_FOUND
            </div>
        </div>
    );
};