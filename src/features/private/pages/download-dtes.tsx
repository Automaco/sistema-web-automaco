import { Download, ChevronDown, ChevronRight, FileText, Check, X, Calendar, Loader2, User, Folder } from 'lucide-react';
import { Button } from '../../../components/button';
import { useDteSelection } from '../hooks/use-dte-selection';
import { DteHeader, DteFilters, CheckboxIcon } from '../components/index';
import { StatusModal } from '../../../components/ui/status-modal';

export const DownloadDTEsPage = () => {
    const {
        data,
        isLoading,
        expandedItems, toggleExpand,
        selectedFiles, toggleFileSelection,
        selectedCount, totalFilesCount, isAllSelected, toggleSelectAll,
        toggleClientSelection, toggleYearSelection, toggleMonthSelection,
        isClientSelected, isYearSelected, isMonthSelected,
        downloadFormat, setDownloadFormat, handleDownloadSelected, isDownloading,
        statusModal, closeStatusModal, filters,
        handleFilterChange, clearFilters
    } = useDteSelection();

    if (isLoading) {
        return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>;
    }

    return (
        <div className="flex flex-col h-full w-full p-2">
            <div className="bg-bg-surface rounded-2xl shadow-lg border border-border-base p-6 lg:p-8 flex-1 flex flex-col overflow-hidden max-w-[1400px] mx-auto w-full">

                <DteHeader />
                <DteFilters 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                    onClearFilters={clearFilters}
                />

                {/* Control Bar */}
                <div className="flex items-center justify-between mb-4 px-1">
                    <div className="text-text-muted text-sm font-medium">
                        {selectedCount > 0
                            ? <span className="text-brand-primary font-bold">{selectedCount} de {totalFilesCount} archivos seleccionados</span>
                            : `${totalFilesCount} archivos encontrados`
                        }
                    </div>

                    <button
                        onClick={toggleSelectAll}
                        className="text-sm font-semibold flex items-center gap-2 text-brand-primary hover:text-brand-dark transition-colors"
                    >
                        {isAllSelected ? <><X size={16} /> Deseleccionar todo</> : <><Check size={16} /> Seleccionar todo</>}
                    </button>
                </div>

                {/* --- ACCORDION LIST (Clients -> Years -> Months -> Files) --- */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {data.length === 0 && (
                        <div className="text-center py-10 text-text-muted">No se encontraron facturas.</div>
                    )}

                    {data.map((client) => (
                        <div key={client.id} className="border border-border-base rounded-xl overflow-hidden bg-bg-surface shadow-sm mb-4">
                            
                            {/* === LEVEL 1: CLIENT === */}
                            <div
                                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors select-none"
                                onClick={() => toggleExpand(client.id)}
                            >
                                <CheckboxIcon
                                    checked={isClientSelected(client.id)}
                                    onClick={(e) => { e.stopPropagation(); toggleClientSelection(client.id); }}
                                />
                                <User size={20} className="text-blue-600" />
                                <span className="font-bold text-lg flex-1 text-text-main">
                                    {client.clientName}
                                </span>
                                {expandedItems.includes(client.id) ? <ChevronDown size={20} className="text-text-muted" /> : <ChevronRight size={20} className="text-text-muted" />}
                            </div>

                            {/* === LEVEL 2: YEARS (Inside Client) === */}
                            {expandedItems.includes(client.id) && (
                                <div className="pl-4 pr-2 py-2 space-y-2 bg-bg-surface">
                                    {client.years.map((yearGroup) => (
                                        <div key={yearGroup.id} className="border-l-2 border-border-base ml-2">
                                            
                                            <div
                                                className="flex items-center gap-3 p-3 hover:bg-bg-canvas cursor-pointer select-none transition-colors rounded-r-lg"
                                                onClick={() => toggleExpand(yearGroup.id)}
                                            >
                                                <CheckboxIcon
                                                    checked={isYearSelected(yearGroup.id)}
                                                    onClick={(e) => { e.stopPropagation(); toggleYearSelection(yearGroup.id); }}
                                                />
                                                <Calendar size={18} className="text-brand-primary" />
                                                <span className="font-semibold text-text-main flex-1">
                                                    {yearGroup.year}
                                                </span>
                                                {expandedItems.includes(yearGroup.id) ? <ChevronDown size={18} className="text-text-muted" /> : <ChevronRight size={18} className="text-text-muted" />}
                                            </div>

                                            {/* === LEVEL 3: MONTHS (Inside Year) === */}
                                            {expandedItems.includes(yearGroup.id) && (
                                                <div className="pl-6 space-y-1">
                                                    {yearGroup.months.map((month) => (
                                                        <div key={month.id}>
                                                            <div
                                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-canvas cursor-pointer select-none transition-colors"
                                                                onClick={() => toggleExpand(month.id)}
                                                            >
                                                                <CheckboxIcon
                                                                    checked={isMonthSelected(month.id)}
                                                                    onClick={(e) => { e.stopPropagation(); toggleMonthSelection(month.id); }}
                                                                />
                                                                <Folder size={16} className="text-yellow-500" />
                                                                <span className="text-sm font-medium text-text-main flex-1">
                                                                    {month.monthName}
                                                                </span>
                                                                {expandedItems.includes(month.id) ? <ChevronDown size={16} className="text-text-muted" /> : <ChevronRight size={16} className="text-text-muted" />}
                                                            </div>

                                                            {/* === LEVEL 4: FILES (Inside Month) === */}
                                                            {expandedItems.includes(month.id) && (
                                                                <div className="ml-8 mt-1 space-y-1">
                                                                    {month.files.map((file) => {
                                                                        const isSelected = selectedFiles.includes(file.id);
                                                                        return (
                                                                            <div
                                                                                key={file.id}
                                                                                className={`flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer ${isSelected ? 'bg-brand-primary/5 border-brand-primary/40' : 'bg-bg-surface border-border-base hover:border-brand-primary/30'}`}
                                                                                onClick={() => toggleFileSelection(file.id)}
                                                                            >
                                                                                <CheckboxIcon checked={isSelected} onClick={(e) => { e.stopPropagation(); toggleFileSelection(file.id); }} />
                                                                                <FileText size={16} className={isSelected ? 'text-brand-primary' : 'text-text-muted'} />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-brand-primary' : 'text-text-main'}`}>{file.name}</p>
                                                                                    <p className="text-[10px] text-text-muted">{file.date}</p>
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
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 pt-6 border-t border-border-base flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm font-medium text-text-main px-2 py-1 bg-bg-canvas rounded-md border border-border-base">
                        <span className="text-brand-primary font-bold">{selectedCount}</span> archivos seleccionados
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <select
                                value={downloadFormat}
                                onChange={(e) => setDownloadFormat(e.target.value as any)}
                                className="appearance-none bg-bg-surface border border-border-base text-text-main text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 cursor-pointer shadow-sm"
                            >
                                <option value="both">Descargar PDF y JSON</option>
                                <option value="pdf">Solo PDF</option>
                                <option value="json">Solo JSON</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>

                        <Button
                            onClick={handleDownloadSelected}
                            disabled={isDownloading || selectedCount === 0}
                            className="w-auto px-6 py-2.5 flex items-center gap-2 shadow-md hover:shadow-lg transform active:scale-95 transition-all"
                        >
                            {isDownloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                            <span>{isDownloading ? 'Descargando...' : 'Descargar'}</span>
                        </Button>
                    </div>
                </div>
            </div>

            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={closeStatusModal}
                type={statusModal.type}
                title={statusModal.title}
                description={statusModal.description}
            />
        </div>
    );
};