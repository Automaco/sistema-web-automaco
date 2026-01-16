import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Check } from 'lucide-react';
import { useProfileSwitcher } from '../hook/use-profile-switcher';

// Helper para colores e iniciales
const getProviderStyles = (id?: number) => {
    if (id === 1) return { bg: 'bg-white border border-gray-200 text-red-500', letter: 'G' };
    if (id === 2) return { bg: 'bg-[#0078D4] text-white', letter: 'O' };
    return { bg: 'bg-brand-primary text-white', letter: 'A' }; 
};

// --- NUEVO COMPONENTE AUXILIAR PARA MANEJAR ERRORES DE IMAGEN ---
const AvatarImage = ({ src, alt, fallback }: { src?: string, alt: string, fallback: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false);

    // Si cambia la URL (src), reseteamos el error para intentar cargar la nueva
    useEffect(() => {
        setHasError(false);
    }, [src]);

    if (src && !hasError) {
        return (
            <img 
                src={src} 
                alt={alt} 
                className="w-full h-full rounded-lg object-cover" 
                onError={() => setHasError(true)} // <--- Aquí ocurre la magia
            />
        );
    }

    // Si no hay imagen o falló la carga, mostramos el fallback (La letra)
    return <>{fallback}</>;
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

    if (isLoading) return <div className="h-10 w-full bg-gray-100/10 animate-pulse rounded-xl" />;

    // Estilo del perfil actual
    const currentStyle = getProviderStyles(currentAccount?.email_provider_id);

    return (
        <div className="relative w-full" ref={menuRef}>
            
            {/* --- BOTÓN PRINCIPAL --- */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200
                    hover:bg-bg-canvas border 
                    ${isOpen ? 'bg-bg-canvas border-border-base' : 'border-transparent hover:border-border-base'}
                    ${!isExpanded ? 'justify-center px-0' : ''}
                `}
            >
                {/* Avatar (Con manejo de error integrado) */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm shrink-0 ${currentStyle.bg}`}>
                    <AvatarImage 
                        src={currentAccount?.avatar} 
                        alt="Avatar" 
                        fallback={currentStyle.letter} 
                    />
                </div>

                {/* Texto */}
                {isExpanded && (
                    <div className="flex-1 text-left overflow-hidden">
                        <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider leading-tight">
                            {currentAccount ? 'Cuenta Activa' : 'Sin vincular'}
                        </span>
                        <span className="block text-sm font-bold text-text-main truncate" title={currentAccount?.email || 'Usuario'}>
                            {currentAccount?.email || 'Usuario Principal'}
                        </span>
                    </div>
                )}

                {/* Flecha */}
                {isExpanded && (
                    <ChevronDown size={16} className={`text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                )}
            </button>

            {/* --- MENÚ DESPLEGABLE --- */}
            {isOpen && (
                <div className={`
                    absolute z-[9999] bg-bg-surface border border-border-base rounded-2xl shadow-xl 
                    animate-in fade-in zoom-in-95 duration-200 origin-top-left
                    min-w-[260px] overflow-hidden flex flex-col
                    ${isExpanded 
                        ? 'left-0 right-0 top-full mt-2' 
                        : 'left-full top-0 ml-4'
                    }
                `}>
                    
                    <div className="px-4 py-3 border-b border-border-base/50 bg-bg-canvas/30">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider">
                            Cambiar Perfil
                        </p>
                    </div>
                    
                    <div className="p-2 flex flex-col gap-1 max-h-[250px] overflow-y-auto custom-scrollbar">
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
                                            {/* Usamos el mismo componente para la lista */}
                                            <AvatarImage 
                                                src={acc.avatar} 
                                                alt="Avatar" 
                                                fallback={style.letter} 
                                            />
                                        </div>
                                        
                                        <div className="flex-1 overflow-hidden">
                                            <span className={`block text-sm truncate ${isSelected ? 'font-bold text-brand-primary' : 'font-medium text-text-main'}`}>
                                                {acc.email}
                                            </span>
                                        </div>
                                        
                                        {isSelected && <Check size={16} className="text-brand-primary shrink-0" />}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-4 text-sm text-text-muted text-center italic">
                                No tienes otras cuentas vinculadas.
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-border-base bg-bg-canvas/30">
                        <button
                            onClick={handleAddAccount}
                            className="flex items-center gap-3 w-full p-2 rounded-xl text-text-muted hover:text-text-main hover:bg-bg-canvas transition-colors group"
                        >
                            <div className="w-8 h-8 rounded-lg border border-dashed border-text-muted group-hover:border-text-main flex items-center justify-center transition-colors">
                                <Plus size={16} />
                            </div>
                            <span className="text-sm font-medium">Vincular nueva cuenta</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};