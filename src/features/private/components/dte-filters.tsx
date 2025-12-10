import { Filter, Calendar, Search } from 'lucide-react';
import { Input } from '../../../components/input'; // Ajusta tu ruta

export const DteFilters = () => (
    <div className="border border-border-base rounded-2xl p-6 mb-6 bg-bg-canvas/30">
        <div className="flex items-center gap-2 mb-5 text-brand-primary font-bold text-lg">
            <Filter size={20} />
            <h3>Selección de filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input label="Fecha de inicio" type="date" icon={<Calendar size={18} />} className="bg-bg-surface [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer" />
            <Input label="Fecha de fin" type="date" icon={<Calendar size={18} />} className="bg-bg-surface [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer" />
            <Input label="Filtro de búsqueda" placeholder="Escribe la empresa a buscar" icon={<Search size={18} />} className="bg-bg-surface" />
        </div>
    </div>
);