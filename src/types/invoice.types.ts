export interface Invoice {
    id: number;
    generation_code: string;
    created_at: string;
    client_name: string;
    pdf_created_at?: string;
    json_created_at?: string;
    pdf_original_name?: string;
    json_original_name?: string;
}

export interface DteFile {
    id: string; 
    rawId: number; 
    name: string;
    date: string;
    size: string;
    clientName: string; 
}

export interface MonthGroup {
    id: string; 
    monthName: string; 
    files: DteFile[];
}

export interface YearGroup {
    id: string; 
    year: number;
    months: MonthGroup[];
}

// NUEVO NIVEL RAÍZ
export interface ClientGroup {
    id: string; 
    clientName: string;
    years: YearGroup[];
}