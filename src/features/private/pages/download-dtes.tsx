import { Download } from 'lucide-react';

export const DownloadDTEsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 max-w-md w-full text-center">
                <Download size={64} className="mx-auto mb-6 text-brand-primary" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Descarga de DTEs
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Aquí podrás gestionar y descargar tus Documentos Tributarios Electrónicos.
                    ¡Próximamente disponible con todas las funcionalidades!
                </p>
                <button
                    className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                    onClick={() => alert('Funcionalidad en desarrollo!')}
                >
                    Explorar Opciones
                </button>
            </div>
        </div>
    );
};
