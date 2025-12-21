import { X, CheckCircle2 } from 'lucide-react';
import { type User } from '../../../types/auth.types';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    user: User | null;
}

export const LinkedAccountsModal = ({ isOpen, onClose, user }: Props) => {
    if (!isOpen || !user) return null;

    // Si tu usuario trae las cuentas en una propiedad (ej. connected_accounts)
    // Asegúrate de que tu tipo User lo tenga. Si no, lo mostramos vacío por ahora.
    const accounts = user.connected_accounts || [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-bg-surface w-full max-w-sm rounded-3xl shadow-2xl border border-border-base overflow-hidden p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-red-500 transition-colors">
                    <X size={20} />
                </button>

                <h3 className="font-bold text-lg text-text-main mb-4">Cuentas Vinculadas</h3>
                <p className="text-sm text-text-muted mb-6">Cuentas externas conectadas a <b>{user.name}</b>.</p>

                <div className="space-y-3">
                    {accounts.length === 0 ? (
                        <div className="text-center py-6 text-text-muted bg-bg-canvas rounded-xl border border-border-base border-dashed">
                            No hay cuentas vinculadas.
                        </div>
                    ) : (
                        accounts.map((acc) => (
                            <div
                                key={acc.id}
                                className="flex items-center gap-4 p-4 bg-bg-canvas rounded-2xl border border-border-base hover:border-brand-primary/30 transition-colors group"
                            >
                                {/* Icono del proveedor */}
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm
                                    ${acc.email_provider_id === 1
                                        ? 'bg-white text-red-500 border border-gray-100' // Google Style
                                        : 'bg-blue-600 text-white' // Outlook Style
                                    }
                                `}>
                                    {acc.email_provider_id === 1 ? 'G' : 'O'}
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <p className="font-bold text-text-main text-sm truncate">{acc.email}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-xs text-text-muted font-medium">
                                            {acc.email_provider_id === 1 ? 'Google' : 'Outlook'}
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-text-muted/40" />
                                        <div className="flex items-center gap-1 text-[10px] text-green-600 font-bold bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded-md">
                                            <CheckCircle2 size={10} />
                                            ACTIVA
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button onClick={onClose} className="mt-6 w-full py-2.5 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-dark transition-colors">
                    Cerrar
                </button>
            </div>
        </div>
    );
};