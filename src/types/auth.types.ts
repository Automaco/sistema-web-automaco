// Define la estructura del Usuario de la api
export interface User {
    id: number;
    name: string;
    email: string;
}

// Define la respuesta exitosa del Login API
export interface LoginResponse {
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