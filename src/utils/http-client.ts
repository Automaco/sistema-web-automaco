// Tipos de métodos HTTP permitidos.
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Interfaz que define las opciones opcionales al hacer una petición.
interface RequestOptions {
    method?: HttpMethod;
    body?: unknown;
    headers?: Record<string, string>;
    responseType?: 'json' | 'blob' | 'text';
}

// URL base de la API.
const BASE_URL = import.meta.env.VITE_API_URL || "";

// Clase personalizada para errores de API
export class ApiError extends Error {
    status: number;
    data: any;
    constructor(status: number, data: any, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

// Función principal genérica
export const httpClient = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    // Valores por defecto
    const { method = "GET", body, headers, responseType = 'json' } = options;

    const token = localStorage.getItem("token");

    const selectedAccountId = localStorage.getItem("selected_account_id");

    // Construcción de la configuración fetch
    const config: RequestInit = {
        method,
        headers: {
            // Solo ponemos Content-Type si hay body y no es FormData
            ...(body && !(body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(selectedAccountId ? { "X-Account-ID": selectedAccountId } : {}),
            ...headers,
        },
    };

    if (body) {
        // Si es FormData (archivos), no hacemos JSON.stringify
        config.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    try {
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        // manejo de errores: correccion
        if (!res.ok) {
            // parseamos el error
            let errorData;
            try {
                errorData = await res.json();
            } catch {
                errorData = { message: res.statusText || "Error desconocido" };
            }
            const isLoginRequest = endpoint.includes('login');

            if (res.status === 401 && !isLoginRequest) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                // Opcional: Solo redirigir si no estamos ya en login
                if (window.location.pathname !== '/auth/login') {
                    window.location.href = "/auth/login";
                }
            }

            const errorMessage = errorData.message || errorData.error || res.statusText || "Error desconocido";
            throw new ApiError(res.status, errorData, errorMessage);
        }

        // Manejo del tipo de respuesta
        if (responseType === 'blob') {
            return (await res.blob()) as unknown as T;
        }
        if (responseType === 'text') {
            return (await res.text()) as unknown as T;
        }

        // Por defecto JSON
        return res.json();

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error("Error de conexión. Verifica tu conexión de internet o contacta a soporte");
    }
};

// ---------------------------------------------------------
// Métodos helper (atajos) CORREGIDOS
// ---------------------------------------------------------

// GET: Acpta opciones extra
httpClient.get = <T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    httpClient<T>(endpoint, { method: "GET", ...options });

// POST: Acepta body y opciones extra
httpClient.post = <T>(endpoint: string, body: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    httpClient<T>(endpoint, { method: "POST", body, ...options });

// PUT
httpClient.put = <T>(endpoint: string, body: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}) =>
    httpClient<T>(endpoint, { method: "PUT", body, ...options });

// DELETE: Ahora acepta opciones opcionales (a veces DELETE lleva body o headers especiales)
httpClient.delete = <T>(endpoint: string, options: Omit<RequestOptions, 'method'> = {}) =>
    httpClient<T>(endpoint, { method: "DELETE", ...options });