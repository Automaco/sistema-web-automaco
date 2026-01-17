import { useState, useEffect } from 'react';
import { invoicesService } from '../../../services/invoices.service';
import { type YearGroup } from '../../../types/invoice.types';
import { type ModalType } from '../../../components/ui/status-modal'; // Asegúrate de importar el tipo

export const useDteSelection = () => {
    const [data, setData] = useState<YearGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    // Selección
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Tipo de descarga seleccionado en el <select>
    const [downloadFormat, setDownloadFormat] = useState<'both' | 'pdf' | 'json'>('both');

    // --- ESTADO DEL MODAL ---
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        description: string;
    }>({ isOpen: false, type: 'info', title: '', description: '' });

    const closeStatusModal = () => setStatusModal(prev => ({ ...prev, isOpen: false }));

    // 1. Cargar datos reales al montar
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const groupedData = await invoicesService.fetchAll();
            setData(groupedData);

            // Expandir el primer año por defecto si existe
            if (groupedData.length > 0) {
                setExpandedItems([String(groupedData[0].year)]);
            }
            setIsLoading(false);
        };
        loadData();
    }, []);

    // --- LOGICA DE SELECCIÓN  ---

    const getAllFileIds = () => {
        return data.flatMap(year =>
            year.months.flatMap(month =>
                month.files.map(file => file.id)
            )
        );
    };

    const allFileIds = getAllFileIds();
    const totalFilesCount = allFileIds.length;
    const isAllSelected = selectedFiles.length === totalFilesCount && totalFilesCount > 0;

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleFileSelection = (id: string) => {
        setSelectedFiles(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        isAllSelected ? setSelectedFiles([]) : setSelectedFiles(allFileIds);
    };

    // Helpers para seleccionar años/meses completos
    const getFilesInYear = (year: number) => data.find(y => y.year === year)?.months.flatMap(m => m.files.map(f => f.id)) || [];
    const getFilesInMonth = (monthId: string) => data.flatMap(y => y.months).find(m => m.id === monthId)?.files.map(f => f.id) || [];

    const toggleYearSelection = (year: number) => {
        const ids = getFilesInYear(year);
        const all = ids.every(id => selectedFiles.includes(id));
        setSelectedFiles(prev => all ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
    };

    const toggleMonthSelection = (monthId: string) => {
        const ids = getFilesInMonth(monthId);
        const all = ids.every(id => selectedFiles.includes(id));
        setSelectedFiles(prev => all ? prev.filter(id => !ids.includes(id)) : [...new Set([...prev, ...ids])]);
    };

    const isYearSelected = (year: number) => { const ids = getFilesInYear(year); return ids.length > 0 && ids.every(id => selectedFiles.includes(id)); };
    const isMonthSelected = (monthId: string) => { const ids = getFilesInMonth(monthId); return ids.length > 0 && ids.every(id => selectedFiles.includes(id)); };

    // --- LOGICA DE DESCARGA ---
    const handleDownloadSelected = async () => {
        if (selectedFiles.length === 0) {
            setStatusModal({
                isOpen: true,
                type: 'info', // O warning si tienes
                title: 'Selección vacía',
                description: 'Por favor selecciona al menos un archivo para descargar.'
            });
            return;
        }

        setIsDownloading(true);

        // Iteramos sobre los IDs seleccionados (que son strings)
        // Necesitamos encontrar el objeto original para obtener el 'name' y 'rawId'
        const filesToDownload = data
            .flatMap(y => y.months.flatMap(m => m.files))
            .filter(f => selectedFiles.includes(f.id));

        try {

            if (selectedFiles.length === 1) {
                // Descarga secuencial para no saturar el navegador/red
                for (const file of filesToDownload) {
                    if (downloadFormat === 'pdf' || downloadFormat === 'both') {
                        await invoicesService.downloadFile(file.rawId, 'pdf', file.name);
                    }
                    if (downloadFormat === 'json' || downloadFormat === 'both') {
                        await invoicesService.downloadFile(file.rawId, 'json', file.name);
                    }
                }
            }
            else {
                // Descarga como ZIP para múltiples archivos
                await invoicesService.downloadAsZip(filesToDownload, downloadFormat);
            }
            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Descarga completada',
                description: `Se han descargado ${filesToDownload.length} archivos exitosamente.`
            });
        } catch {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error de descarga',
                description: 'Hubo un problema al intentar descargar algunos archivos. Inténtalo de nuevo.'
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return {
        // Data
        data, // La data agrupada para renderizar
        isLoading,

        // Selection State
        expandedItems,
        selectedFiles,
        selectedCount: selectedFiles.length,
        totalFilesCount,
        isAllSelected,

        // Selection Actions
        toggleExpand,
        toggleFileSelection,
        toggleSelectAll,
        toggleYearSelection,
        toggleMonthSelection,
        isYearSelected,
        isMonthSelected,

        // Download Actions
        downloadFormat,
        setDownloadFormat,
        handleDownloadSelected,
        isDownloading,

        // Modal State and Actions
        statusModal,
        closeStatusModal
    };
};