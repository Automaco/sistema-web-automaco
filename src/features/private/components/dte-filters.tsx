import { Filter, Calendar, Search } from 'lucide-react';
import { Input } from '../../../components/input';

interface DteFiltersProps {
    filters: {
        searchTerm: string;
        startDate: string;
        endDate: string;
    };
    onFilterChange: (key: 'searchTerm' | 'startDate' | 'endDate', value: string) => void;
}

export const DteFilters = ({ filters, onFilterChange }: DteFiltersProps) => {

    // Función auxiliar para abrir el calendario nativo
    const handleDateClick = (e: React.MouseEvent<HTMLInputElement>) => {
        // Verificamos si el navegador soporta showPicker (Casi todos los modernos lo hacen)
        if ('showPicker' in HTMLInputElement.prototype) {
            try {
                // Esto abre el "mini calendario" nativo del navegador
                e.currentTarget.showPicker();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="border border-border-base rounded-2xl p-6 mb-6 bg-bg-canvas/30">
            <div className="flex items-center gap-2 mb-5 text-brand-primary font-bold text-lg">
                <Filter size={20} />
                <h3>Selección de filtros</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                    label="Fecha de inicio"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => onFilterChange('startDate', e.target.value)}
                    // AQUÍ ESTÁ EL CAMBIO: Al hacer click, abrimos el calendario
                    onClick={handleDateClick} 
                    icon={<Calendar size={18} />}
                    className="bg-bg-surface [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                />
                <Input
                    label="Fecha de fin"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => onFilterChange('endDate', e.target.value)}
                    // AQUÍ TAMBIÉN
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