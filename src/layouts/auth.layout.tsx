import { Outlet } from 'react-router-dom';

export const AuthLayout = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden font-sans">

            {/* 🎨 LAYER 0: El Fondo Verde Completo (Fixed) */}
            <div className="fixed inset-0 z-0 bg-linear-to-br from-[#4CBE98] to-[#3BB19B]">
                {/* --- Formas Geométricas (Decoración Global) --- */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-800/10 rounded-full blur-3xl" />

                {/* Triángulos flotantes */}
                <div className="absolute top-1/4 left-1/2 w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-b-26 border-b-white/20 transform rotate-12" />
                <div className="absolute bottom-1/3 right-20 w-0 h-0 border-l-20 border-l-transparent border-r-20 border-r-transparent border-b-34 border-b-white/20 transform -rotate-45" />

                {/* Grid de puntos decorativo */}
                <div className="absolute bottom-10 left-10 grid grid-cols-4 gap-2 opacity-20">
                    {[...Array(16)].map((_, i) => (
                        <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />
                    ))}
                </div>
            </div>

            {/* 📦 LAYER 1: Contenedor del contenido (Scrollable si es necesario) */}
            <div className="relative z-10 min-h-screen flex items-center justify-center">
                {/* Aquí se inyectan las páginas (Login, Register...) */}
                <Outlet />
            </div>
        </div>
    );
};