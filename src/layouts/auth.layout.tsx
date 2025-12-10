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
    <div className="fixed inset-0 z-0 bg-linear-to-br from-[#4CBE98] to-[#3BB19B]">

    </div>
);

// 3. Componente Principal Layout
export const AuthLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Función Switch para elegir fondo según la ruta
    const renderBackground = () => {
        switch (location.pathname) {
            case '/auth/login':
                return <LoginBackground />;
            case '/auth/register':
                return <RegisterBackground />;
            default:
                return <LoginBackground />;
        }
    };

    const renderButtonToggleTheme = () => {
        switch (location.pathname) {
            case '/auth/login':
                return <button
                    onClick={toggleTheme}
                    className="absolute top-5 right-5 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer shadow-lg"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>;
            case '/auth/register':
                return <button
                    onClick={toggleTheme}
                    className="absolute top-5 left-5 z-50 p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all cursor-pointer shadow-lg"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            default:
                return <LoginBackground />;
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