import { Filter, Calendar, Search, X } from 'lucide-react'; // Importamos X para el icono
import { Input } from '../../../components/input';

interface DteFiltersProps {
    filters: {
        searchTerm: string;
        startDate: string;
        endDate: string;
    };
    onFilterChange: (key: 'searchTerm' | 'startDate' | 'endDate', value: string) => void;
    onClearFilters: () => void;
}

export const DteFilters = ({ filters, onFilterChange, onClearFilters }: DteFiltersProps) => {

    // Helper para detectar si hay algún filtro activo
    const hasActiveFilters = filters.searchTerm || filters.startDate || filters.endDate;

    const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if ('showPicker' in HTMLInputElement.prototype) {
            try { e.currentTarget.showPicker(); } catch (error) { console.error(error); }
        }
    };

    return (
        <div className="border border-border-base rounded-2xl p-6 mb-6 bg-bg-canvas/30 transition-all">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-lg">
                    <Filter size={20} />
                    <h3>Selección de filtros</h3>
                </div>

                {/* BOTÓN LIMPIAR (Solo visible si hay filtros) */}
                {hasActiveFilters && (
                    <button 
                        onClick={onClearFilters}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors animate-in fade-in zoom-in-95"
                    >
                        <X size={14} />
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Fecha de inicio"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange('startDate', e.target.value)}
                    onClick={handleDateClick}
                    icon={<Calendar size={18} />}
                    className="bg-bg-surface [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                />
                <Input
                    label="Fecha de fin"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange('endDate', e.target.value)}
                    onClick={handleDateClick}
                    icon={<Calendar size={18} />}
                    className="bg-bg-surface [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                />
                <Input
                    label="Filtro de búsqueda"
                    placeholder="Nombre de cliente o archivo..."
                    value={filters.searchTerm}
                    onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                    icon={<Search size={18} />}
                    className="bg-bg-surface"
                />
            </div>
        </div>
    );
};