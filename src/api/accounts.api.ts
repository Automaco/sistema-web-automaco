import { httpClient } from '../utils/http-client';
import type { SocialLoginUrlResponse } from '../types/accounts.types';

export const accountApi = {

    //Provisional
    getSocialRedirect: (providerId: number) => {
        // Enviamos el ID como query param o en el body
        return httpClient.get<SocialLoginUrlResponse>(`/auth/social/redirect?provider_id=${providerId}`);
    }
};