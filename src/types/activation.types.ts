import { type User } from "./auth.types";

export interface ActivationCode {
    id: number;
    code_hash: string; 
    raw_code?: string | null; 
    is_used: boolean;
    user_id?: number | null;
    used_at?: string | null;
    user?: User; 
}

export interface CreateCodeResponse {
    message: string;
    code: string;
    data: ActivationCode;
}