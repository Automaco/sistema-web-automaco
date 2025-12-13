import { Outlet, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/theme-context';

// Login
const LoginBackground = () => (
    <div className="fixed inset-0 z-0 bg-linear-to-br from-[#4CBE98] to-[#3BB19B] overflow-hidden">

        {/* --- Círculos grandes difuminados (Movimiento lento tipo "Drift") --- */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl animate-drift-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/10 rounded-full blur-3xl animate-drift-slow delay-2000" />

        {/* --- Círculos adicionales (Pulsan suavemente) --- */}
        <div className="absolute top-[20%] left-[10%] w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-[25%] right-[5%] w-56 h-56 bg-teal-900/20 rounded-full blur-3xl animate-pulse delay-3000" />

        {/* --- Triángulos flotantes (Se mueven arriba y abajo) --- */}
        {/* Triángulo 1 */}
        <div className="absolute top-1/4 left-1/2 w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-b-26 border-b-white/20 transform rotate-12 animate-float" />

        {/* Triángulo 2 (Más lento) */}
        <div className="absolute bottom-1/3 right-20 w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-34 border-b-white/20 transform -rotate-45 animate-float-slow delay-1000" />

        {/* Triángulo 3 */}
        <div className="absolute top-[60%] left-[25%] w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-16 border-b-white/10 rotate-6 animate-float delay-2000" />

        {/* Triángulo 4 */}
        <div className="absolute top-[10%] right-[30%] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-white/15 -rotate-12 animate-float-slow delay-3000" />

        {/* --- Rombos (Movimiento Drift + Rotación original) --- */}
        <div className="absolute top-[35%] right-[35%] animate-drift">
            <div className="w-10 h-10 bg-white/10 rotate-45 rounded-sm blur-sm" />
        </div>
        <div className="absolute bottom-[15%] left-[30%] animate-drift delay-4000">
            <div className="w-14 h-14 bg-white/5 rotate-45 rounded-sm blur" />
        </div>

        {/* --- Ondas curvas (SVG) - Efecto de opacidad --- */}
        <div className="absolute top-[15%] left-0 w-full h-20 opacity-10 pointer-events-none animate-pulse duration-4000">
            <svg width="100%" height="100%">
                <path d="M0 40 Q 150 0 300 40 T 600 40" stroke="white" strokeWidth="3" fill="transparent" />
            </svg>
        </div>
        <div className="absolute bottom-[15%] left-0 w-full h-20 opacity-10 pointer-events-none animate-pulse duration-5000 delay-1000">
            <svg width="100%" height="100%">
                <path d="M0 20 Q 200 60 400 20 T 800 20" stroke="white" strokeWidth="2" fill="transparent" />
            </svg>
        </div>

        {/* --- Grid de puntos (Estático para contraste) --- */}
        <div className="absolute bottom-10 left-10 grid grid-cols-6 gap-2 opacity-20">
            {[...Array(36)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />)}
        </div>

        {/* --- Semicírculos en esquinas (Entrada sutil) --- */}
        <div className="absolute top-0 left-0 w-40 h-20 bg-white/10 rounded-b-full blur-xl animate-pulse" />
        <div className="absolute top-0 right-0 w-52 h-24 bg-white/10 rounded-b-full blur-xl animate-pulse delay-700" />
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-white/10 rounded-t-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-0 w-40 h-20 bg-white/10 rounded-t-full blur-xl animate-pulse delay-500" />
    </div>
);

// 2. Registro
const RegisterBackground = () => (
    <div className="absolute inset-0 w-full h-full bg-brand-primary overflow-hidden z-0">
        <svg
            className="absolute w-full h-full pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
        >
            {/* === DEFINICIONES === */}
            <defs>
                <pattern id="dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" className="fill-white/30" />
                </pattern>
            </defs>

            {/* ==========================================
            FORMAS DE ESQUINA (Posicionadas con %)
           ========================================== */}

            {/* Esquina Superior Izquierda (Círculo cortado) */}
            <circle cx="0%" cy="0%" r="100" className="fill-white/5 " />

            {/* Esquina Superior Derecha (Arco grande) */}
            <circle cx="50%" cy="0%" r="120" className="fill-white/5" />

            {/* Esquina Inferior Derecha (Detalle pequeño) */}
            <circle cx="50%" cy="90%" r="75" className="fill-white/5" />

            {/* Esquina Inferior Izquierda (Base grande difuminada) */}
            <circle cx="5%" cy="100%" r="120" className="fill-white/10" />


            {/* ==========================================
            ELEMENTOS FLOTANTES (Pequeños y sutiles)
           ========================================== */}

            {/* -- GRUPO ARRIBA DERECHA -- */}
            {/* Círculo sólido pequeño */}
            <circle cx="85%" cy="15%" r="8" className="fill-white/20" />
            <circle cx="85%" cy="15%" r="8" className="fill-white/20" />
            {/* Líneas decorativas (Rectángulos redondeados) */}
            <rect x="88%" y="22%" width="40" height="4" rx="2" className="fill-white/10" />
            <rect x="92%" y="24%" width="20" height="4" rx="2" className="fill-white/10" />


            {/* -- GRUPO CENTRO -- */}
            {/* Triángulo flotante (Usamos un path pequeño) */}
            {/* Para posicionar un path con %, usamos un <svg> anidado que actúe como contenedor */}
            <svg x="45%" y="20%" overflow="visible">
                <path d="M 0 0 L 15 25 L -15 25 Z" className="fill-white/10" transform="rotate(15)" />
            </svg>
            <svg x="25%" y="70%" overflow="visible">
                <path d="M 0 0 L 15 25 L -15 25 Z" className="fill-white/10" transform="rotate(15)" />
            </svg>
            <svg x="45%" y="55%" overflow="visible">
                <path d="M 0 0 L 15 25 L -15 25 Z" className="fill-white/10" transform="rotate(15)" />
            </svg>

            {/* Círculo hueco (aro) */}
            <circle cx="30%" cy="40%" r="18" className="stroke-white/15 fill-none stroke-[3px]" />
            <circle cx="20%" cy="10%" r="18" className="stroke-white/15 fill-none stroke-[3px]" />
            <circle cx="60%" cy="70%" r="18" className="stroke-white/15 fill-none stroke-[3px]" />

            {/* -- GRUPO ABAJO DERECHA -- */}
            {/* Triángulo invertido */}
            <svg x="80%" y="75%" overflow="visible">
                <path d="M 0 0 L 20 0 L 10 20 Z" className="fill-white/10" transform="rotate(-15)" />

            </svg>
            <circle cx="90%" cy="85%" r="5" className="fill-white/30" />
            <circle cx="100%" cy="50%" r="3" className="fill-white/30" />

            {/* -- GRUPO ABAJO IZQUIERDA -- */}
            {/* Líneas pequeñas */}
            <rect x="15%" y="65%" width="50" height="3" rx="1.5" className="fill-white/10" />
            <rect x="15%" y="67%" width="30" height="3" rx="1.5" className="fill-white/10" />

            {/* Patrón de puntos (Grid) */}
            {/* Lo colocamos en coordenadas fijas desde abajo/izquierda */}
            <rect x="5%" y="82%" width="80" height="80" fill="url(#dot-pattern)" className="opacity-60" />

        </svg>

        {/* Gradiente Overlay para suavizar todo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
    </div>
);

// Diseño de fondo para recuperar contraseña
const RecoverPasswordBackground = () => (
    // 1. Contenedor base con el gradiente original
    <div className="absolute inset-0 w-full h-full bg-brand-primary overflow-hidden z-0">
        <div className="absolute h-full hidden md:flex flex-col justify-center items-center w-1/2 pointer-events-none pr-12">
            <div className="absolute scale-140 -translate-y-35 -translate-x-15">
                <img
                    // REEMPLAZA ESTA URL CON TU IMAGEN.
                    // Usa una imagen abstracta, patrones o algo relacionado a tu marca.
                    src="../src/assets/sendEmail.svg"
                    alt="Fondo decorativo"
                    className="w-full h-full object-cover grayscale-[20%]"
                />
            </div>

        </div>
    </div>
);



// 3. Componente Principal Layout
export const AuthLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const renderButtonToggleThemeLogin = () => {
        const baseClasses = "absolute z-50 p-3 rounded-full backdrop-blur-md border shadow-lg transition-all cursor-pointer flex items-center justify-center active:scale-95";

        // Clases Responsivas
        // Mobile (Por defecto): Fondo adaptativo (bg-surface), texto gris (text-muted), borde suave.
        // Desktop (lg:): Fondo transparente blanco (bg-white/20), texto blanco, borde blanco.
        const responsiveColorClasses = `
            bg-bg-surface/80 border-border-base text-text-muted hover:text-brand-primary 
            dark:bg-slate-800/80 dark:border-slate-700 dark:text-gray-300 dark:hover:text-white
            
            lg:bg-white/20 lg:border-white/30 lg:text-white lg:hover:bg-white/30 
            lg:dark:bg-black/20 lg:dark:border-white/10 lg:dark:text-white
        `;

        // Posición según la ruta
        let positionClasses = "top-5 right-5";

        if (location.pathname === '/auth/register') {
            positionClasses = "top-5 right-5";
        }

        return (
            <button
                onClick={toggleTheme}
                className={`${baseClasses} ${positionClasses} ${responsiveColorClasses}`}
                aria-label="Cambiar tema"
            >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
        );
    };

    // Función Switch para elegir fondo según la ruta
    const renderBackground = () => {

        switch (location.pathname) {
            case '/auth/login':
                return <LoginBackground />;
            case '/auth/register':
                return <RegisterBackground />;
            case '/auth/recover-password':
                return <RecoverPasswordBackground />;
            case '/auth/reset-password':
                return <RecoverPasswordBackground />;
            default:
                return <LoginBackground />;
        }
    };

    const renderButtonToggleTheme = () => {
        switch (location.pathname) {
            case '/auth/login':
                return renderButtonToggleThemeLogin()
            case '/auth/register':
                return <button
                    onClick={toggleTheme}
                    className="absolute top-5 left-5 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer shadow-lg"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            case '/auth/recover-password':
                return <button
                    onClick={toggleTheme}
                    className="absolute top-5 left-5 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer shadow-lg"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            case '/auth/reset-password':
                return <button
                    onClick={toggleTheme}
                    className="absolute top-5 left-5 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer shadow-lg"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            default:
                return <LoginBackground />; // Si cambio esta etiqueta, cambia el fondo de recover-password, de lo contrario no cambia nada
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans">

            {/* Fondo*/}
            {renderBackground()}

            {/*  BOTÓN FLOTANTE PARA CAMBIAR TEMA */}
            {renderButtonToggleTheme()}

            {/* Contenido (Outlet) */}
            {/* Usamos flex items-center justify-center para centrar el contenido en pantalla */}
            <div className="relative z-10 min-h-screen flex items-center justify-center">
                <Outlet />
            </div>

        </div>
    );
};