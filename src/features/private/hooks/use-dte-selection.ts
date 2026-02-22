import { useState, useEffect, useMemo, useCallback } from 'react';
import { invoicesService } from '../../../services/invoices.service';
import { type ClientGroup } from '../../../types/invoice.types';
import { type ModalType } from '../../../components/ui/status-modal';
import { N8nService } from '../../../services/n8n.services';

export const useDteSelection = () => {
    const [data, setData] = useState<ClientGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const [filters, setFilters] = useState({
        searchTerm: '',
        startDate: '',
        endDate: ''
    });

    const clearFilters = () => {
        setFilters({
            searchTerm: '',
            startDate: '',
            endDate: ''
        });
    };

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Selection
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Download format
    const [downloadFormat, setDownloadFormat] = useState<'both' | 'pdf' | 'json'>('both');

    // Folder structure preference
    const [folderStructure, setFolderStructure] = useState<'organized' | 'flat'>('organized');

    // Modal State
    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: ModalType;
        title: string;
        description: string;
    }>({ isOpen: false, type: 'info', title: '', description: '' });


    const closeStatusModal = () => setStatusModal(prev => ({ ...prev, isOpen: false }));

    // 1. FUNCIÓN PURA DE CARGA
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setSelectedFiles([]); // Limpiar selección por seguridad

        try {
            const grouped = await invoicesService.fetchAll();
            setData(grouped);

            // Expandir primer cliente por defecto si hay datos
            if (grouped.length > 0) {
                const firstClient = grouped[0];
                const idsToExpand = [firstClient.id];
                if (firstClient.years.length > 0) {
                    idsToExpand.push(firstClient.years[0].id);
                }
                setExpandedItems(idsToExpand);
            }
        } catch (error) {
            console.error("Error cargando facturas:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Helper interno para contar archivos (lo usaremos para comparar)
    const countTotalFiles = (groups: ClientGroup[]) => {
        return groups.reduce((acc, client) =>
            acc + client.years.reduce((accY, year) =>
                accY + year.months.reduce((accM, month) =>
                    accM + month.files.length
                    , 0)
                , 0)
            , 0);
    };

    // 2. FUNCIÓN DE RECARGA MANUAL
    const refreshData = useCallback(async () => {
        setIsLoading(true);

        try {
            const userStr = localStorage.getItem('user');
            const accountStr = localStorage.getItem('selected_account');

            if (userStr && accountStr) {
                const user = JSON.parse(userStr);
                const account = JSON.parse(accountStr);

                // Contamos cuántas facturas hay ANTES de ejecutar n8n
                const oldData = await invoicesService.fetchAll();
                const oldCount = countTotalFiles(oldData);

                // Disparamos n8n
                await N8nService.triggerWorkflow({
                    user_id: user.id,
                    email_provider_id: account.email_provider_id
                });

                // Estrategia de Polling
                // Intentaremos buscar nuevos datos cada 3 segundos (máximo 5 intentos = 15 segundos extra)
                let attempts = 0;
                let newData = oldData;
                let newCount = oldCount;

                while (attempts < 5) {
                    // Esperamos 3 segundos antes de volver a preguntar a la BD
                    await new Promise(resolve => setTimeout(resolve, 3000));

                    newData = await invoicesService.fetchAll();
                    newCount = countTotalFiles(newData);

                    // Si el conteo subió, significa que n8n ya guardó cosas nuevas, salimos del bucle.
                    if (newCount > oldCount) {
                        break;
                    }
                    attempts++;
                }

                // Actualizamos la pantalla con los datos finales
                setData(newData);

                if (newData.length > 0) {
                    const firstClient = newData[0];
                    const idsToExpand = [firstClient.id];
                    if (firstClient.years.length > 0) idsToExpand.push(firstClient.years[0].id);
                    setExpandedItems(idsToExpand);
                }

                // Le avisamos al usuario el resultado
                const addedFiles = newCount - oldCount;

                setStatusModal({
                    isOpen: true,
                    type: addedFiles > 0 ? 'success' : 'info',
                    title: 'Sincronización Terminada',
                    description: addedFiles > 0
                        ? `¡Éxito! Se encontraron y procesaron ${addedFiles} nuevas facturas.`
                        : 'El proceso terminó, pero no se encontraron facturas nuevas en el correo.'
                });
            }

        } catch (error) {
            console.error("Error en recarga manual:", error);
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error de sincronización',
                description: 'Hubo un problema al intentar conectar con el correo.'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);


    // 3. EFECTO INICIAL (Al entrar a la página)
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- LÓGICA DE FILTRADO  ---
    const filteredData = useMemo(() => {
        // Si no hay filtros, devolver todo
        if (!filters.searchTerm && !filters.startDate && !filters.endDate) {
            return data;
        }

        const term = filters.searchTerm.toLowerCase();
        const start = filters.startDate ? new Date(filters.startDate) : null;
        const end = filters.endDate ? new Date(filters.endDate) : null;

        // Si hay fecha fin, la ajustamos al final del día para incluir ese día completo
        if (end) end.setHours(23, 59, 59, 999);

        // Filtramos recursivamente
        return data.map(client => {
            // 1. Filtrar Años
            const filteredYears = client.years.map(year => {
                // 2. Filtrar Meses
                const filteredMonths = year.months.map(month => {
                    // 3. Filtrar Archivos (Aquí está la lógica fuerte)
                    const filteredFiles = month.files.filter(file => {
                        // Parsear fecha del archivo "dd/mm/yyyy"
                        const [d, m, y] = file.date.split('/').map(Number);
                        const fileDate = new Date(y, m - 1, d);

                        // Validación de Fechas
                        const isAfterStart = !start || fileDate >= start;
                        const isBeforeEnd = !end || fileDate <= end;

                        // Validación de Texto (Busca en Nombre Cliente o Nombre Archivo)
                        const matchesText = !term ||
                            client.clientName.toLowerCase().includes(term) ||
                            file.name.toLowerCase().includes(term);

                        return isAfterStart && isBeforeEnd && matchesText;
                    });

                    return { ...month, files: filteredFiles };
                }).filter(m => m.files.length > 0); // Eliminar meses vacíos

                return { ...year, months: filteredMonths };
            }).filter(y => y.months.length > 0); // Eliminar años vacíos

            return { ...client, years: filteredYears };
        }).filter(c => c.years.length > 0); // Eliminar clientes vacíos

    }, [data, filters]);

    const currentData = filteredData;

    // --- SELECTION LOGIC HELPERS ---

    // Get ALL file IDs (flat list)
    const getAllFileIds = () => {
        return currentData.flatMap(client =>
            client.years.flatMap(year =>
                year.months.flatMap(month =>
                    month.files.map(file => file.id)
                )
            )
        );
    };

    // Get files for a specific Client
    const getFilesInClient = (clientId: string) =>
        currentData.find(c => c.id === clientId)?.years.flatMap(y =>
            y.months.flatMap(m => m.files.map(f => f.id))
        ) || [];

    // Get files for a specific Year (needs to search across all clients)
    const getFilesInYear = (yearId: string) => {
        for (const client of currentData) {
            const year = client.years.find(y => y.id === yearId);
            if (year) {
                return year.months.flatMap(m => m.files.map(f => f.id));
            }
        }
        return [];
    };

    // Get files for a specific Month
    const getFilesInMonth = (monthId: string) => {
        for (const client of currentData) {
            for (const year of client.years) {
                const month = year.months.find(m => m.id === monthId);
                if (month) {
                    return month.files.map(f => f.id);
                }
            }
        }
        return [];
    };

    const allFileIds = getAllFileIds();
    const totalFilesCount = allFileIds.length;
    const isAllSelected = selectedFiles.length === totalFilesCount && totalFilesCount > 0;

    // --- TOGGLE ACTIONS ---

    const toggleExpand = (id: string) => {
        setExpandedItems(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    const toggleFileSelection = (id: string) => {
        setSelectedFiles(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    };

    // toggleSelectAll ahora usa allFileIds filtrados
    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedFiles([]);
        } else {
            // Selecciona SOLO lo que se ve en pantalla (filtrado)
            setSelectedFiles(allFileIds);
        }
    };

    // Toggle entire Client
    const toggleClientSelection = (clientId: string) => {
        const ids = getFilesInClient(clientId);
        const allSelected = ids.every(id => selectedFiles.includes(id));

        if (allSelected) {
            setSelectedFiles(prev => prev.filter(id => !ids.includes(id)));
        } else {
            setSelectedFiles(prev => [...new Set([...prev, ...ids])]);
        }
    };

    // Toggle entire Year
    const toggleYearSelection = (yearId: string) => {
        const ids = getFilesInYear(yearId);
        const allSelected = ids.every(id => selectedFiles.includes(id));

        if (allSelected) {
            setSelectedFiles(prev => prev.filter(id => !ids.includes(id)));
        } else {
            setSelectedFiles(prev => [...new Set([...prev, ...ids])]);
        }
    };

    // Toggle entire Month
    const toggleMonthSelection = (monthId: string) => {
        const ids = getFilesInMonth(monthId);
        const allSelected = ids.every(id => selectedFiles.includes(id));

        if (allSelected) {
            setSelectedFiles(prev => prev.filter(id => !ids.includes(id)));
        } else {
            setSelectedFiles(prev => [...new Set([...prev, ...ids])]);
        }
    };

    // --- CHECK STATE HELPERS ---
    const isClientSelected = (clientId: string) => {
        const ids = getFilesInClient(clientId);
        return ids.length > 0 && ids.every(id => selectedFiles.includes(id));
    };

    const isYearSelected = (yearId: string) => {
        const ids = getFilesInYear(yearId);
        return ids.length > 0 && ids.every(id => selectedFiles.includes(id));
    };

    const isMonthSelected = (monthId: string) => {
        const ids = getFilesInMonth(monthId);
        return ids.length > 0 && ids.every(id => selectedFiles.includes(id));
    };

    // --- DOWNLOAD LOGIC ---
    const handleDownloadSelected = async () => {
        if (selectedFiles.length === 0) {
            setStatusModal({
                isOpen: true,
                type: 'info',
                title: 'Selección vacía',
                description: 'Por favor selecciona al menos un archivo para descargar.'
            });
            return;
        }

        setIsDownloading(true);

        // Flatten data to find selected file objects
        const filesToDownload = data
            .flatMap(c => c.years)
            .flatMap(y => y.months)
            .flatMap(m => m.files)
            .filter(f => selectedFiles.includes(f.id));

        try {
            if (selectedFiles.length === 1) {
                // Single file download
                for (const file of filesToDownload) {
                    if (downloadFormat === 'pdf' || downloadFormat === 'both') {
                        await invoicesService.downloadFile(file.rawId, 'pdf', file.name);
                    }
                    if (downloadFormat === 'json' || downloadFormat === 'both') {
                        await invoicesService.downloadFile(file.rawId, 'json', file.name);
                    }
                }
            } else {
                // Bulk download (ZIP)
                await invoicesService.downloadAsZip(filesToDownload, downloadFormat, folderStructure);
            }

            setStatusModal({
                isOpen: true,
                type: 'success',
                title: 'Descarga completada',
                description: `Se han procesado ${filesToDownload.length} archivos exitosamente.`
            });
        } catch {
            setStatusModal({
                isOpen: true,
                type: 'error',
                title: 'Error de descarga',
                description: 'Hubo un problema al intentar descargar los archivos.'
            });
        } finally {
            setIsDownloading(false);
        }
    };


    return {
        data: filteredData,
        isLoading,
        expandedItems,
        selectedFiles,
        selectedCount: selectedFiles.length,
        totalFilesCount,
        isAllSelected,

        toggleExpand,
        toggleFileSelection,
        toggleSelectAll,
        toggleClientSelection,
        toggleYearSelection,
        toggleMonthSelection,

        isClientSelected,
        isYearSelected,
        isMonthSelected,

        downloadFormat,
        setDownloadFormat,
        folderStructure,
        setFolderStructure,
        handleDownloadSelected,
        isDownloading,
        statusModal,
        closeStatusModal,
        filters,
        handleFilterChange,
        clearFilters,
        refreshData,
    };
};