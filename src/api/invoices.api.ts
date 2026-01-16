import { httpClient } from '../utils/http-client';
import { type Invoice } from '../types/invoice.types';

export const invoicesApi = {
    // Obtener lista (paginada)
    getInvoices: async (page = 1) => {
        // Asumimos que quieres traer bastantes para armar el árbol, 
        // o podrías manejar paginación. Por ahora pediremos la página 1.
        return await httpClient.get<{ data: Invoice[], current_page: number, last_page: number }>(`/invoices?page=${page}`);
    },

    // Descargar PDF (Blob)
    downloadPdf: async (id: number) => {
        return await httpClient.get(`/invoices/${id}/download/pdf`, {
            responseType: 'blob'
        });
    },

    // Descargar JSON (Blob)
    downloadJson: async (id: number) => {
        return await httpClient.get(`/invoices/${id}/download/json`, {
            responseType: 'blob'
        });
    }
};