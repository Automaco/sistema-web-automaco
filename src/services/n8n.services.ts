//Preparo el cuerpo, utilizo el codigo de n8n.api y espero a la respuesta del servidor. (exito o cagada)

import { N8nApi } from '../api/n8n.api';
import type { n8nResponse, N8nInvoice } from "../types/n8n.types";

export const N8nService = {

triggerWorkflow: async (credentials: N8nInvoice): Promise<n8nResponse> => {
            // Utilizamos el método definido en n8n.api.ts
            const response = await N8nApi.N8nWorkflow(credentials);
            
            // Aquí puedes añadir lógica adicional si n8n devuelve algo específico
            return response;
    }

}