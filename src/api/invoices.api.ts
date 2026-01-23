import { httpClient } from '../utils/http-client';
import { type Invoice } from '../types/invoice.types';

export const invoicesApi = {
    // Obtener lista (paginada)
    getInvoices: async (accountId?: string | number) => {
        // Si hay un ID y no es 'all', configuramos el header
        const config = (accountId && accountId !== 'all')
            ? { headers: { 'X-Account-ID': accountId.toString() } }
            : {};

        return await httpClient.get<{ data: Invoice[], current_page: number, last_page: number }>(
            `/invoices`,
            config
        );
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