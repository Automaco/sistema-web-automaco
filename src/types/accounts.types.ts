// Creamos el objeto constante 
export const ProviderId = {
    GOOGLE: 1,
    OUTLOOK: 2,
} as const; 

// Creamos el Tipo derivado para usarlo en interfaces
// Esto permite que puedas usar 'ProviderId' como un tipo en tus funciones.
export type ProviderId = typeof ProviderId[keyof typeof ProviderId];

export interface SocialLoginUrlResponse {
    url: string; // La URL de Google/Microsoft a donde redigiremos al usuario
}