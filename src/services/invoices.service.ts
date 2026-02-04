import { invoicesApi } from '../api/invoices.api';
import { type Invoice, type DteFile, type ClientGroup, } from '../types/invoice.types';
import { formatDateForFile } from '../utils/utils';
import JSZip from 'jszip';

export const invoicesService = {
    fetchAll: async () => {
        try {
            const response = await invoicesApi.getInvoices();
            return groupInvoicesByClientAndDate(response.data || []);
        } catch (error) {
            console.error("Error", error);
            return [];
        }
    },

    downloadFile: async (id: number, type: 'pdf' | 'json', filename: string) => {
        try {
            const response = type === 'pdf'
                ? await invoicesApi.downloadPdf(id)
                : await invoicesApi.downloadJson(id);

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.${type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error downloading ${type}`, error);
            throw error;
        }
    },

    /**
     * Descarga masiva en ZIP
     * @param files Lista de archivos a descargar
     * @param format Formato de descarga (pdf, json, ambos)
     * @param structure 'organized' (Carpetas) | 'flat' (Todo mezclado)
     */
    downloadAsZip: async (files: DteFile[], format: 'pdf' | 'json' | 'both', structure: 'organized' | 'flat') => {
        const zip = new JSZip();
        
        // Nombramos la carpeta raíz dependiendo del modo
        const rootFolderName = structure === 'organized' ? "Facturas_Organizadas" : "Facturas_Unificadas";
        const rootFolder = zip.folder(rootFolderName);

        if (!rootFolder) return;

        const promises = files.map(async (file) => {
            try {
                // Definimos dónde se guardará el archivo dentro del ZIP
                let targetFolder = rootFolder;
                let fileNamePrefix = "";

                if (structure === 'organized') {
                    // Asumiendo formato dd/mm/yyyy
                    const parts = file.date.split('/'); 
                    // parts[0] = dia, parts[1] = mes, parts[2] = año
                    const monthStr = parts[1]; 
                    const yearStr = parts[2];
                    
                    const monthName = getMonthName(parseInt(monthStr));

                    // Creamos la jerarquía
                    const clientFolder = rootFolder.folder(file.clientName);
                    const yearFolder = clientFolder?.folder(yearStr);
                    const monthFolder = yearFolder?.folder(monthName);

                    if (monthFolder) {
                        targetFolder = monthFolder;
                    }
                    // En modo organizado, el nombre del archivo se mantiene limpio
                    fileNamePrefix = ""; 

                } else {
                    fileNamePrefix = `[${file.clientName}] `;
                }

                // --- DESCARGA DE BLOBS ---
                if (format === 'pdf' || format === 'both') {
                    const pdfBlob = await invoicesApi.downloadPdf(file.rawId);
                    targetFolder.file(`${fileNamePrefix}${file.name}.pdf`, pdfBlob);
                }
                if (format === 'json' || format === 'both') {
                    const jsonBlob = await invoicesApi.downloadJson(file.rawId);
                    targetFolder.file(`${fileNamePrefix}${file.name}.json`, jsonBlob);
                }

            } catch (e) { 
                console.error(`Error procesando archivo ${file.name}`, e); 
            }
        });

        await Promise.all(promises);

        // Generar ZIP
        const zipContent = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(zipContent);
        const link = document.createElement('a');
        link.href = url;
        
        // Nombre del ZIP final
        const zipName = structure === 'organized' 
            ? `DTEs_Organizados_${formatDateForFile()}.zip`
            : `DTEs_Unificados_${formatDateForFile()}.zip`;

        link.setAttribute('download', zipName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

// --- HELPERS ---
const getMonthName = (monthIndex: number) => {
    const date = new Date();
    date.setMonth(monthIndex - 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

const groupInvoicesByClientAndDate = (invoices: Invoice[]): ClientGroup[] => {
    const clients: ClientGroup[] = [];

    invoices.forEach(inv => {
        const dateStr = inv.pdf_created_at || inv.created_at;
        const date = new Date(dateStr);

        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
        const monthNameCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        const clientName = inv.client_name || 'Sin Cliente';
        const clientId = clientName; 

        const yearId = `${clientId}-${year}`;
        const monthId = `${clientId}-${year}-${monthIndex}`;

        let clientGroup = clients.find(c => c.id === clientId);
        if (!clientGroup) {
            clientGroup = { id: clientId, clientName, years: [] };
            clients.push(clientGroup);
        }

        let yearGroup = clientGroup.years.find(y => y.year === year);
        if (!yearGroup) {
            yearGroup = { id: yearId, year, months: [] };
            clientGroup.years.push(yearGroup);
        }

        let monthGroup = yearGroup.months.find(m => m.id === monthId);
        if (!monthGroup) {
            monthGroup = { id: monthId, monthName: monthNameCap, files: [] };
            yearGroup.months.push(monthGroup);
        }

        monthGroup.files.push({
            id: inv.id.toString(),
            rawId: inv.id,
            name: inv.pdf_original_name || `DTE-${inv.generation_code.substring(0, 8)}`,
            date: date.toLocaleDateString('es-ES'), 
            size: 'N/A',
            clientName: clientName
        });
    });

    return clients;
};