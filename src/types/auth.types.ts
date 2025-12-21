// Define el tipo de rol explícitamente aquí para usarlo en todos lados
export type UserRole = 'admin' | 'client';

// Define la estructura del Usuario de la api
export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    connected_accounts?: ConnectedAccount[];
}

export interface ConnectedAccount {
    id: number;
    email: string;
    email_provider_id: number; // 1 = Google, 2 = Outlook
    avatar?: string;
    created_at?: string;
}

// Define la respuesta exitosa del Login API
export interface LoginResponse {
    require_activation: boolean;
    mensage: string; // Nota: en la api dice 'mensage', entonces si se corrije cambiar aqui
    access_token: string;
    token_type: string;
    user: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

// Define la respuesta de error API
export interface ApiError {
    message: string;
    error?: string; // Para el caso 'account_not_activated'
}

