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

            // Crear Blob y link de descarga en el navegador
            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.${type}`); // ej: DTE-123.pdf
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(`Error downloading ${type}`, error);
            throw error;
        }
    },

    downloadAsZip: async (files: DteFile[], format: 'pdf' | 'json' | 'both') => {
        const zip = new JSZip();
        const rootFolder = zip.folder("Facturas_DTE");

        const promises = files.map(async (file) => {
            try {
                // Estructura: Cliente / Año / Mes / Archivo
                const [monthStr, yearStr] = file.date.split('/'); // Ajustar según tu formato de fecha
                const monthName = getMonthName(parseInt(monthStr));

                // Cliente -> Año -> Mes
                const folder = rootFolder
                    ?.folder(file.clientName)
                    ?.folder(yearStr)
                    ?.folder(monthName);

                if (!folder) return;

                if (format === 'pdf' || format === 'both') {
                    const pdfBlob = await invoicesApi.downloadPdf(file.rawId);
                    folder.file(`${file.name}.pdf`, pdfBlob);
                }
                if (format === 'json' || format === 'both') {
                    const jsonBlob = await invoicesApi.downloadJson(file.rawId);
                    folder.file(`${file.name}.json`, jsonBlob);
                }
            } catch (e) { console.error(e); }
        });

        await Promise.all(promises);
        // ... generar zip igual que antes ...
        const zipContent = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(zipContent);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DTEs_${formatDateForFile()}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

// Helper para obtener nombre del mes
const getMonthName = (monthIndex: number) => {
    // monthIndex viene 1-12, Date espera 0-11
    const date = new Date();
    date.setMonth(monthIndex - 1);
    const monthName = date.toLocaleString('es-ES', { month: 'long' });
    return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

const groupInvoicesByClientAndDate = (invoices: Invoice[]): ClientGroup[] => {
    const clients: ClientGroup[] = [];

    invoices.forEach(inv => {
        // Usamos pdf_created_at si existe, sino created_at
        const dateStr = inv.pdf_created_at || inv.created_at;
        const date = new Date(dateStr);

        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
        const monthNameCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        const clientName = inv.client_name || 'Sin Cliente';
        const clientId = clientName; // Usamos el nombre como ID

        const yearId = `${clientId}-${year}`;
        const monthId = `${clientId}-${year}-${monthIndex}`;

        // 1. Buscar o crear CLIENTE
        let clientGroup = clients.find(c => c.id === clientId);
        if (!clientGroup) {
            clientGroup = { id: clientId, clientName, years: [] };
            clients.push(clientGroup);
        }

        // 2. Buscar o crear AÑO dentro del cliente
        let yearGroup = clientGroup.years.find(y => y.year === year);
        if (!yearGroup) {
            yearGroup = { id: yearId, year, months: [] };
            clientGroup.years.push(yearGroup);
        }

        // 3. Buscar o crear MES dentro del año
        let monthGroup = yearGroup.months.find(m => m.id === monthId);
        if (!monthGroup) {
            monthGroup = { id: monthId, monthName: monthNameCap, files: [] };
            yearGroup.months.push(monthGroup);
        }

        // 4. Agregar archivo
        monthGroup.files.push({
            id: inv.id.toString(),
            rawId: inv.id,
            // Usamos el nombre original si existe, sino el código generado
            name: inv.pdf_original_name || `DTE-${inv.generation_code.substring(0, 8)}`,
            date: date.toLocaleDateString('es-ES'),
            size: 'N/A',
            clientName: clientName
        });
    });

    return clients;
};