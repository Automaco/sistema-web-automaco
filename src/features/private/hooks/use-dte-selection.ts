import { useState } from 'react';
import { MOCK_DTES } from '../data/mock-dtes';

export const useDteSelection = () => {
    const [expandedItems, setExpandedItems] = useState<string[]>(['2025']);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // --- HELPER: Obtener todos los IDs existentes en la data ---
    // Esto aplana toda la estructura para tener una lista simple de todos los IDs
    const getAllFileIds = () => {
        return MOCK_DTES.flatMap(year =>
            year.months.flatMap(month =>
                month.files.map(file => file.id)
            )
        );
    };

    const allFileIds = getAllFileIds();
    const totalFilesCount = allFileIds.length;
    const isAllSelected = selectedFiles.length === totalFilesCount && totalFilesCount > 0;

    // --- ACCIONES ---

    const toggleExpand = (id: string) => {
        setExpandedItems(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleFileSelection = (id: string) => {
        setSelectedFiles(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    // NUEVO: Seleccionar o Deseleccionar TODO
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedFiles([]); // Limpiar
        } else {
            setSelectedFiles(allFileIds); // Llenar con todo
        }
    };

    const getFilesInYear = (year: number) => MOCK_DTES.find(y => y.year === year)?.months.flatMap(m => m.files.map(f => f.id)) || [];
    const getFilesInMonth = (monthId: string) => MOCK_DTES.flatMap(y => y.months).find(m => m.id === monthId)?.files.map(f => f.id) || [];

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

    return {
        expandedItems,
        selectedFiles,
        selectedCount: selectedFiles.length,
        totalFilesCount, 
        isAllSelected,  
        toggleExpand,
        toggleFileSelection,
        toggleSelectAll,
        toggleYearSelection,
        toggleMonthSelection,
        isYearSelected,
        isMonthSelected
    };
};