import { useState, useMemo } from 'react';
import { EmailChart, type ChartData, RecentEmails, type EmailData } from '../components/index';

// --- LÓGICA DE DATOS ---
const generateDataFromAPI = (year: string): ChartData[] => {
    // ... tu lógica existente ...
    const base = year === '2024' ? 10 : year === '2023' ? 5 : 0;
    return [
        { month: 'Ene', emails: 35 + base }, { month: 'Feb', emails: 46 + base },
        { month: 'Mar', emails: 27 + base }, { month: 'Abr', emails: 55 + base },
        { month: 'May', emails: 62 + base }, { month: 'Jun', emails: 20 + base },
        { month: 'Jul', emails: 15 + base }, { month: 'Ago', emails: 80 + base },
        { month: 'Sep', emails: 49 + base }, { month: 'Oct', emails: 68 + base },
        { month: 'Nov', emails: 20 + base }, { month: 'Dic', emails: 38 + base },
    ];
};

const generateEmailData = (): EmailData[] => {
    return [
        { id: 1, sender: 'Facturas SV', subject: 'Comprobante de compra', time: '10:30 AM', preview: 'Comprobante' },
        { id: 2, sender: 'Soporte Técnico', subject: 'Ticket #492 Actualizado', time: '09:15 AM', preview: 'Tu incidente ha sido resuelto...' },
    ];
};

export const DashboardPage = () => {
    const [selectedYear, setSelectedYear] = useState('2024');
    const chartData = useMemo(() => generateDataFromAPI(selectedYear), [selectedYear]);
    const emailData = useMemo(() => generateEmailData(), []);

    return (
        // Contenedor principal con scroll suave si es necesario
        <div className="flex flex-col h-full w-full p-4 md:p-6 bg-card-bg overflow-y-auto rounded-3xl border border-border-base ">
            
            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">
                
                {/* Título (Opcional, pero recomendado para estructura) */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main">Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1">Resumen de actividad reciente</p>
                </div>

                {/* --- CONTENEDOR DE PANELES --- */}
                {/* Mobile: flex-col (uno debajo de otro) | Desktop: flex-row (lado a lado) */}
                <div className="flex flex-col lg:flex-row gap-6 w-full">
                    
                    {/* --- IZQUIERDA: GRÁFICA --- */}
                    {/* IMPORTANTE: lg:w-2/3 para dejar espacio a la derecha */}
                    <div className="w-full lg:w-2/3 flex flex-col">
                        {/* En móvil damos altura fija (400px), en desktop llenamos el alto disponible (500px del padre implícito o auto) */}
                        <div className="h-[450px] lg:h-[500px] w-full"> 
                            <EmailChart
                                data={chartData}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                            />
                        </div>
                    </div>

                    {/* --- DERECHA: CORREOS --- */}
                    {/* IMPORTANTE: lg:w-1/3 para completar el grid */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        {/* En móvil altura automática o fija según prefieras, en desktop igualamos altura a la gráfica */}
                        <div className="h-auto lg:h-[500px] w-full">
                            <RecentEmails
                                emails={emailData}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};