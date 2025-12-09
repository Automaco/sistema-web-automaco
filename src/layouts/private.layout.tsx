import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/sidebar';

export const PrivateLayout = () => {
    return (
        // Contenedor Flex: Sidebar a la izquierda, Contenido a la derecha
        <div className="flex h-screen w-full bg-bg-canvas transition-colors duration-300 overflow-hidden font-sans">

            {/*Barra Lateral */}
            <Sidebar />

            {/* Contenido Principal (Scrollable) */}
            <main className="flex-1 h-full overflow-y-auto relative">

                <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1600px] mx-auto min-h-full">
                    <Outlet />
                </div>
            </main>

        </div>
    );
};