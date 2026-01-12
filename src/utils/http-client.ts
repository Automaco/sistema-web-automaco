// Tipos de métodos HTTP permitidos.
// solo a estos métodos y evitar errores al escribir métodos no válidos.
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Interfaz que define las opciones opcionales al hacer una petición.
// - method: Método HTTP (GET, POST, etc.)
// - body: Cuerpo que se enviará al servidor (generalmente un objeto)
// - headers: Encabezados personalizados como tokens, autorizaciones, etc.
interface RequestOptions {
    method?: HttpMethod;
    body?: unknown; // "unknown" es más seguro que "any" porque obliga a validar antes de usar.
    headers?: Record<string, string>;
}

// URL base de la API.
const BASE_URL = import.meta.env.VITE_API_URL || "";

//Esto nos permitirá acceder a "err.data.message" o "err.status" en el frontend
export class ApiError extends Error {
    // 1. Declaramos las propiedades como variables de clase normales
    status: number;
    data: any;

    constructor(status: number, data: any, message: string) {
        super(message);
        this.name = "ApiError";

        // 2. Asignamos los valores manualmente
        this.status = status;
        this.data = data;
    }
}

// T = Tipo de dato que se espera recibir como respuesta.
// endpoint: Parte final de la URL, ejemplo "/usuarios".
// options: Configuración como método, body y headers.
export const httpClient = async <T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> => {
    // Se extraen los valores, con GET como método por defecto.
    const { method = "GET", body, headers } = options;

    const token = localStorage.getItem("token");

    // Se construye la configuración que se enviará a fetch().
    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json", // El cuerpo se enviará como JSON.
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers, // Mezclar headers personalizados (si existen).
        },
    };

    // Si el método incluye cuerpo (POST, PUT), se convierte a JSON.
    // Se espera que body sea un objeto serializable.
    if (body) config.body = JSON.stringify(body);



    try {
        // Se realiza la petición a la API usando fetch.
        const res = await fetch(`${BASE_URL}${endpoint}`, config);
        // Si la respuesta NO es ok (ej: 400, 401, 409, 422, 500)
        // Manejo de errores: si la respuesta no está en 2xx.
        if (!res.ok) {
            // Manejo específico de 401 (Token vencido o inválido)
            // Si la API responde 401 → cerrar sesión
            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/auth/login";
                // Lanzamos error para detener la ejecución
                throw new ApiError(401, null, "Sesión expirada");
            }

            // Intentamos obtener el JSON de error que envía Laravel
            let errorData;
            try {
                errorData = await res.json();
            } catch (e) {
                // Si el backend no devuelve el json
                errorData = { message: "Error desconocido" };
            }

            // 1. message del backend
            // 2. Error StatusText
            const errorMessage = errorData.message || errorData.error || res.statusText;

            // Lanzamos el error personalizado con la info
            throw new ApiError(res.status, errorData, errorMessage);
        }
        // Si todo esta bien delvolvemos el json
        return res.json();
    } catch (error) {
        // Si el error es ApiError lo dejamos pasar
        if (error instanceof ApiError) {
            throw error;
        }
        // Si es un error de red (Sin internet, servidor apagado)
        throw new Error("Error de conexión. Verifica tu conexión de internet o contacta a soporte")
    }
};

// ---------------------------------------------------------
// Métodos helper (atajos)
// Estos permiten llamar más fácil a httpClient sin repetir options.

// GET → No lleva cuerpo, solo endpoint.
httpClient.get = <T>(endpoint: string) =>
    httpClient<T>(endpoint, { method: "GET" });

// POST → Se envía un body con datos.
// Ejemplo body esperado: { nombre: "Juan", edad: 20 }
httpClient.post = <T>(endpoint: string, body: unknown) =>
    httpClient<T>(endpoint, { method: "POST", body });

// PUT → Igual que POST pero para actualizar datos.
httpClient.put = <T>(endpoint: string, body: unknown) =>
    httpClient<T>(endpoint, { method: "PUT", body });

// DELETE → Solo se necesita el endpoint.
httpClient.delete = <T>(endpoint: string) =>
    httpClient<T>(endpoint, { method: "DELETE" });
