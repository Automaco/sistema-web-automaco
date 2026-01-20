/*Comunicacion con la API */

import { httpClient } from '../utils/http-client';
import { type N8nInvoice, type n8nResponse } from '../types/n8n.types';

export const N8nApi = {

    N8nWorkflow : (credentials: N8nInvoice) => {
            return httpClient.post<n8nResponse>('/n8n', credentials);
        },
}