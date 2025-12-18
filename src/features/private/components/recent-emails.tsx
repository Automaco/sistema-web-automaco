import { Mail, Clock } from 'lucide-react';

// 1. Exportamos la interfaz para poder usarla en el padre
export interface EmailData {
    id: number;
    sender: string;
    subject: string;
    time: string;
    preview: string;
}

// 2. Definimos las props que recibe el componente
interface RecentEmailsProps {
    emails: EmailData[]; // Recibe un array de emails
    isLoading?: boolean; // Opcional: para mostrar skeleton si carga
}

export const RecentEmails = ({ emails, isLoading = false }: RecentEmailsProps) => {
    return (
        // Quitamos el ancho fijo (lg:w-1/2) para que se adapte al contenedor padre
        <div className="w-full bg-bg-surface p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-main">Correos descargados</h3>
                <span className="text-xs font-medium bg-brand-primary/10 text-brand-primary px-1 py-1 rounded-full">
                    {emails.length} nuevos
                </span>
            </div>

            {/* Lista con Scroll */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {isLoading ? (
                    <p className="text-sm text-gray-400 text-center py-4">Cargando correos...</p>
                ) : emails.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No hay correos recientes.</p>
                ) : (
                    emails.map((email) => (
                        <div 
                            key={email.id} 
                            className="group p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                                        <Mail size={14} />
                                    </div>
                                    <span className="font-semibold text-sm text-gray-800">{email.sender}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Clock size={10} />
                                    <span>{email.time}</span>
                                </div>
                            </div>
                            <h4 className="text-sm font-medium text-gray-700 mb-1 truncate">{email.subject}</h4>
                            <p className="text-xs text-gray-500 line-clamp-2">{email.preview}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};