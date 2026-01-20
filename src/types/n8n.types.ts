/*Es el cuerpo de lo que voy a enviar o recibir de la api */

export interface N8nInvoice { // Enviar el user_id y el email_provider_id
    user_id: number;
    email_provider_id: number;
}

export interface n8nResponse { // Enviar el user_id y el email_provider_id
    mensage: string;
    
}