import { Download, ChevronDown, ChevronRight, FileText, Check, X, Calendar } from 'lucide-react';
import { Button } from '../../../components/button';
import { MOCK_DTES } from '../data/mock-dtes';
import { useDteSelection } from '../hooks/use-dte-selection';
import { DteHeader, DteFilters, CheckboxIcon } from '../components/index'; 

export const DownloadDTEsPage = () => {
    // Importamos todo del Hook
    const {
        expandedItems, toggleExpand,
        selectedFiles, toggleFileSelection,
        selectedCount, totalFilesCount, isAllSelected, toggleSelectAll, // <--- Nuevos
        toggleYearSelection, toggleMonthSelection,
        isYearSelected, isMonthSelected
    } = useDteSelection();

    return (
        <div className="flex flex-col h-full w-full p-2">
            <div className="bg-bg-surface rounded-2xl shadow-lg border border-border-base p-6 lg:p-8 flex-1 flex flex-col overflow-hidden max-w-[1400px] mx-auto w-full">

                {/* 1. Header y Filtros (Componentes Separados) */}
                <DteHeader />
                <DteFilters />

                {/* 2. Barra de Control (Contador y Botón Seleccionar Todo) */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="text-text-muted text-sm font-medium">
                        {selectedCount > 0
                            ? <span className="text-brand-primary font-bold">{selectedCount} de {totalFilesCount} archivos seleccionados</span>
                            : `${totalFilesCount} archivos encontrados`
                        }
                    </div>

                    {/* --- BOTÓN SELECCIONAR TODO --- */}
                    <button
                        onClick={toggleSelectAll}
                        className="text-sm font-semibold flex items-center gap-2 text-brand-primary hover:text-brand-dark transition-colors"
                    >
                        {isAllSelected ? (
                            <> <X size={16} /> Deseleccionar todo </>
                        ) : (
                            <> <Check size={16} /> Seleccionar todo </>
                        )}
                    </button>
                </div>

                {/* 3. LISTA DE ACORDEONES (Lógica de Renderizado) */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {MOCK_DTES.map((yearGroup) => (
                        <div key={yearGroup.year} className="border border-border-base rounded-xl overflow-hidden bg-bg-surface shadow-sm">

                            {/* --- NIVEL AÑO --- */}
                            <div
                                className="flex items-center gap-3 p-4 bg-bg-canvas/50 hover:bg-bg-canvas cursor-pointer transition-colors select-none"
                                onClick={() => toggleExpand(String(yearGroup.year))}
                            >
                                
                                <CheckboxIcon
                                    checked={isYearSelected(yearGroup.year)}
                                    onClick={() => toggleYearSelection(yearGroup.year)}
                                />
                                <Calendar size={20} className="text-brand-primary"/> 
                                <span className="font-bold text-brand-primary text-lg flex-1">
                                    
                                    {yearGroup.year}
                                </span>
                                {expandedItems.includes(String(yearGroup.year))
                                    ? <ChevronDown size={20} className="text-text-muted" />
                                    : <ChevronRight size={20} className="text-text-muted" />
                                }
                            </div>

                            {/* --- NIVEL MESES --- */}
                            {expandedItems.includes(String(yearGroup.year)) && (
                                <div className="pl-4 pr-0 py-2 space-y-2 bg-bg-surface">
                                    {yearGroup.months.map((month) => (
                                        <div key={month.id} className="border-l-[3px] border-border-base ml-2.5 pl-3 py-1">

                                            <div
                                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-canvas cursor-pointer select-none transition-colors"
                                                onClick={() => toggleExpand(month.id)}
                                            >
                                                <CheckboxIcon
                                                    checked={isMonthSelected(month.id)}
                                                    onClick={() => toggleMonthSelection(month.id)}
                                                />
                                                <span className="font-semibold text-text-main flex-1 text-base">
                                                    {month.monthName}
                                                </span>
                                                {expandedItems.includes(month.id)
                                                    ? <ChevronDown size={18} className="text-text-muted" />
                                                    : <ChevronRight size={18} className="text-text-muted" />
                                                }
                                            </div>

                                            {/* --- NIVEL ARCHIVOS --- */}
                                            {expandedItems.includes(month.id) && (
                                                <div className="ml-8 mt-2 space-y-2.5">
                                                    {month.files.map((file) => {
                                                        const isSelected = selectedFiles.includes(file.id);
                                                        return (
                                                            <div
                                                                key={file.id}
                                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-brand-primary/5 border-brand-primary/40 shadow-sm' : 'bg-bg-surface border-border-base hover:border-brand-primary/30'}`}
                                                                onClick={() => toggleFileSelection(file.id)}
                                                            >
                                                                <CheckboxIcon checked={isSelected} onClick={() => toggleFileSelection(file.id)} />
                                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-100 text-red-600' : 'bg-bg-canvas text-text-muted'}`}>
                                                                    <FileText size={20} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`text-sm font-semibold truncate ${isSelected ? 'text-brand-primary' : 'text-text-main'}`}>{file.name}</p>
                                                                    <p className="text-xs text-text-muted mt-0.5">{file.date} • {file.size}</p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 4. FOOTER (Acciones) */}
                <div className="mt-6 pt-6 border-t border-border-base flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm font-medium text-text-main px-2 py-1 bg-bg-canvas rounded-md border border-border-base">
                        <span className="text-brand-primary font-bold">{selectedCount}</span> archivos seleccionados
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <select className="appearance-none bg-bg-surface border border-border-base text-text-main text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer shadow-sm">
                                <option>Descargar PDF/JSON</option>
                                <option>Solo PDF</option>
                                <option>Solo XML</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                        <Button className="w-auto px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 transition-all">
                            <Download size={18} />
                            <span>Descargar</span>
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
};