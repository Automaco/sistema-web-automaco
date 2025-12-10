export interface DteFile {
    id: string;
    name: string;
    date: string;
    size: string;
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

export const MOCK_DTES: YearGroup[] = [
    {
        year: 2025,
        months: [
            {
                id: '2025-08',
                monthName: 'Agosto',
                files: [
                    { id: 'f1', name: 'Factura Electrónica 001 - Cliente A', date: '20/08/2025', size: '1.2 MB' },
                    { id: 'f2', name: 'Nota de Crédito 004 - Cliente B', date: '22/08/2025', size: '800 KB' },
                ]
            }
        ]
    },
    {
        year: 2024,
        months: [
            {
                id: '2024-12',
                monthName: 'Diciembre',
                files: [
                    { id: 'f3', name: 'Factura Exenta 102 - Proveedor X', date: '10/12/2024', size: '2.4 MB' },
                ]
            }
        ]
    }
];