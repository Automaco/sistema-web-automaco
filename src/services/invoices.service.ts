import { invoicesApi } from '../api/invoices.api';
import { type Invoice, type YearGroup, type DteFile } from '../types/invoice.types';
import JSZip from 'jszip';

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
    },

    downloadAsZip: async (files: DteFile[], format: 'pdf' | 'json' | 'both') => {
        const zip = new JSZip();

        // Creamos una carpeta raíz
        const rootFolder = zip.folder("Facturas_DTE");

        // Array de promesas para manejar las peticiones en paralelo
        const promises = files.map(async (file) => {
            try {
                // 1. Determinar la carpeta del mes (Parsing de la fecha)
                // Asumimos formato dd/mm/yyyy del toLocaleDateString('es-ES')
                const [day, month, year] = file.date.split('/');
                const monthName = getMonthName(parseInt(month));

                // Crea la estructura: Año -> Mes
                // JSZip es inteligente: si la carpeta ya existe, la reutiliza.
                const folder = rootFolder?.folder(year)?.folder(monthName);

                if (!folder) return;

                // 2. Descargar y agregar PDF si corresponde
                if (format === 'pdf' || format === 'both') {
                    const pdfBlob = await invoicesApi.downloadPdf(file.rawId);
                    folder.file(`${file.name}.pdf`, pdfBlob);
                }

                // 3. Descargar y agregar JSON si corresponde
                if (format === 'json' || format === 'both') {
                    const jsonBlob = await invoicesApi.downloadJson(file.rawId);
                    folder.file(`${file.name}.json`, jsonBlob);
                }

            } catch (error) {
                console.error(`Error al procesar archivo ${file.name}`, error);
                // Podrías agregar un archivo de texto con el log de error en el zip si quisieras
                rootFolder?.file(`errores/${file.name}_error.txt`, "No se pudo descargar este archivo.");
            }
        });

        // 4. Esperar a que TODAS las descargas terminen
        await Promise.all(promises);

        // 5. Generar el ZIP y descargar
        const zipContent = await zip.generateAsync({ type: "blob" });

        // Crear link de descarga
        const url = window.URL.createObjectURL(zipContent);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `DTEs_Exportados_${new Date().getTime()}.zip`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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