export interface Invoice {
    id: number;
    generation_code: string;
    created_at: string;
}

// Estructura para el Frontend 
export interface DteFile {
    id: string; 
    name: string;
    date: string;
    size: string; 
    rawId: number; 
}

export interface MonthGroup {
    id: string; 
    monthName: string;
    files: DteFile[];
}

export interface YearGroup {
    year: number;
    months: MonthGroup[];
}