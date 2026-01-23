import { httpClient } from '../utils/http-client';
import { type Invoice } from '../types/invoice.types';

export const invoicesApi = {
    // Obtener lista (paginada)
    getInvoices: async () => {
        return await httpClient.get<{ data: Invoice[], current_page: number, last_page: number }>(`/invoices`);
    },

    // Descargar PDF (Blob)
    downloadPdf: async (id: number) => {
        return await httpClient.get<Blob>(`/invoices/${id}/download/pdf`, {
            responseType: 'blob'
        });
    },

    // Descargar JSON (Blob)
    downloadJson: async (id: number) => {
        return await httpClient.get<Blob>(`/invoices/${id}/download/json`, {
            responseType: 'blob'
        });
    }
};