import { invoicesApi } from '../api/invoices.api';
import { type Invoice, type YearGroup } from '../types/invoice.types';

export const invoicesService = {
    fetchAll: async () => {
        try {
            const response = await invoicesApi.getInvoices();
            const invoices = response.data;

            return groupInvoicesByDate(invoices);
        } catch (error) {
            console.error("Error fetching invoices", error);
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
    }
};

// --- HELPER: Transformar lista plana a Árbol (Año -> Mes -> Archivos) ---
const groupInvoicesByDate = (invoices: Invoice[]): YearGroup[] => {
    const groups: YearGroup[] = [];

    invoices.forEach(inv => {
        const date = new Date(inv.created_at);
        const year = date.getFullYear();
        const monthIndex = date.getMonth();
        // Nombre del mes en español (Enero, Febrero...)
        const monthName = new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(date);
        // Capitalizar primera letra
        const monthNameCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);

        const monthId = `${year}-${monthIndex}`; // ID único para el mes

        // 1. Buscar o crear grupo de AÑO
        let yearGroup = groups.find(g => g.year === year);
        if (!yearGroup) {
            yearGroup = { year, months: [] };
            groups.push(yearGroup);
        }

        // 2. Buscar o crear grupo de MES dentro del año
        let monthGroup = yearGroup.months.find(m => m.id === monthId);
        if (!monthGroup) {
            monthGroup = { id: monthId, monthName: monthNameCap, files: [] };
            yearGroup.months.push(monthGroup);
        }

        // 3. Agregar archivo
        monthGroup.files.push({
            id: inv.id.toString(), // ID para la UI (string)
            rawId: inv.id,         // ID para la API (number)
            name: `DTE-${inv.generation_code.substring(0, 8)}...`, // Nombre corto
            date: date.toLocaleDateString('es-ES'),
            size: 'N/A' // El backend no manda size aun, placeholder
        });
    });

    // Ordenar descendente (años recientes primero)
    return groups.sort((a, b) => b.year - a.year);
};