import { accountApi } from '../api/accounts.api';

export const accountService = {
    
    //provisional
    initiateSocialLogin: async (providerId: number) => {
        // Pedimos la URL al backend (Laravel se encarga de generarla con los scopes de Gmail/Outlook)
        const response = await accountApi.getSocialRedirect(providerId);
        
        // Redirigimos al usuario fuera de nuestra app hacia Google/Microsoft
        if (response.url) {
            window.location.href = response.url; 
        }
    }
};