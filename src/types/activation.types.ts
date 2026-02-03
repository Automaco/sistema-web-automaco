import { type User } from "./auth.types";

export interface ActivationCode {
    id: number;
    is_used: boolean;
    used_at: string | null;
    user_id: number | null;
    user?: User; 
}

export interface CreateCodeResponse {
    message: string;
    code: string;
    data: ActivationCode;
}