import { useState, useRef, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChevronDown, Plus, Check, User as UserIcon } from 'lucide-react';
import { useProfileSwitcher } from '../hook/use-profile-switcher';

// Helper visual para iconos/colores
const getProviderStyles = (id?: number) => {
    if (id === 1) return { bg: 'bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-red-500', letter: 'G' };
    if (id === 2) return { bg: 'bg-[#0078D4] text-white', letter: 'O' };
    return { bg: 'bg-brand-primary text-white', letter: 'A' }; 
};

export const ProfileSwitcher = ({ isExpanded = true }: { isExpanded?: boolean }) => {
    const { accounts, currentAccount, switchAccount, handleAddAccount, isLoading } = useProfileSwitcher();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) return <div className="h-10 w-full bg-gray-100 dark:bg-white/5 animate-pulse rounded-xl" />;

    // Estilo del perfil actual
    const currentStyle = getProviderStyles(currentAccount?.email_provider_id);

    return (
        <div className="relative w-full" ref={menuRef}>
            {/* --- BOTÓN PRINCIPAL (TRIGGER) --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200
                    hover:bg-bg-canvas border 
                    ${isOpen ? 'bg-bg-canvas border-border-base' : 'border-transparent hover:border-border-base'}
                    ${!isExpanded ? 'justify-center px-0' : ''}
                `}
            >
                {/* Avatar Actual */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm shrink-0 ${currentStyle.bg}`}>
                    {currentAccount?.avatar ? (
                        <img src={currentAccount.avatar} alt="Avatar" className="w-full h-full rounded-lg object-cover" />
                    ) : (
                        currentStyle.letter
                    )}
                </div>

                {/* Info Texto (Solo si expandido) */}
                {isExpanded && (
                    <div className="flex-1 text-left overflow-hidden">
                        <span className="block text-xs font-bold text-text-muted uppercase tracking-wider">
                            {currentAccount ? 'Cuenta Activa' : 'Sin vincular'}
                        </span>
                        <span className="block text-sm font-bold text-text-main truncate" title={currentAccount?.email || 'Usuario'}>
                            {currentAccount?.email || 'Usuario Principal'}
                        </span>
                    </div>
                )}

                {/* Flecha */}
                {isExpanded && (
                    <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 mr-7 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {/* --- MENÚ DESPLEGABLE --- */}
            {isOpen && (
                <div className={`
                    absolute left-0 right-0 top-full mt-2 z-50 
                    bg-bg-surface border border-border-base rounded-2xl shadow-xl 
                    animate-in fade-in zoom-in-95 duration-200 origin-top
                    min-w-[260px] overflow-hidden
                    ${!isExpanded ? 'left-12 -top-2' : ''} /* Si el sidebar está cerrado, el menú sale al lado */
                `}>
                    <div className="p-2">
                        <div className="px-3 py-2 text-xs font-bold text-text-muted uppercase tracking-wider">
                            Cambiar Perfil
                        </div>
                        
                        <div className="flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
                            {accounts.length > 0 ? (
                                accounts.map((acc) => {
                                    const style = getProviderStyles(acc.email_provider_id);
                                    const isSelected = currentAccount?.id === acc.id;

                                    return (
                                        <button
                                            key={acc.id}
                                            onClick={() => { switchAccount(acc); setIsOpen(false); }}
                                            className={`
                                                flex items-center gap-3 p-2 rounded-xl transition-colors w-full text-left group
                                                ${isSelected ? 'bg-brand-primary/10' : 'hover:bg-bg-canvas'}
                                            `}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 transition-transform group-hover:scale-105 ${style.bg}`}>
                                                {style.letter}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <span className={`block text-sm truncate ${isSelected ? 'font-bold text-brand-primary' : 'font-medium text-text-main'}`}>
                                                    {acc.email}
                                                </span>
                                            </div>
                                            {isSelected && <Check size={16} className="text-brand-primary" />}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-3 py-2 text-sm text-text-muted italic">
                                    No hay cuentas vinculadas.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Botón Agregar */}
                    <div className="p-2 border-t border-border-base bg-bg-canvas/30">
                        <button
                            onClick={handleAddAccount}
                            className="flex items-center gap-3 w-full p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-canvas transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg border border-dashed border-text-muted group-hover:border-text-main flex items-center justify-center transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-sm font-medium">Vincular otra cuenta</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};