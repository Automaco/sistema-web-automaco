import { useState, useEffect } from 'react';
import { EmailChart, type ChartData, RecentEmails, type EmailData } from '../components/index';
import { dashboardService } from '../../../services/dashboard.service';
import { Loader2 } from 'lucide-react';

export const DashboardPage = () => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [emailData, setEmailData] = useState<EmailData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar datos cuando cambia el año o al montar
    useEffect(() => {
        let isMounted = true;
        const selectedAccountId: number = parseInt(
            localStorage.getItem('selected_account_id') as string,
            10
        );

        const fetchData = async () => {
            // Solo ponemos loading true si es la carga inicial o cambio explícito
            // Podrías manejar un loading parcial para solo la gráfica si prefieres
            setIsLoading(true);

            try {
                const data = await dashboardService.getData(selectedYear, selectedAccountId);

                if (isMounted) {
                    setChartData(data.chartData);
                    // Si los emails no dependen del año seleccionado (son siempre los últimos globales),
                    // podrías envolver esto en un check, pero no hace daño refrescarlos.
                    setEmailData(data.recentEmails);
                }
            } catch (error) {
                console.error(error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchData();

        return () => { isMounted = false; };
    }, [selectedYear]);

    if (isLoading && chartData.length === 0) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-card-bg">
                <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full p-4 md:p-6 bg-card-bg overflow-y-auto rounded-3xl border border-border-base">

            <div className="max-w-[1600px] mx-auto w-full flex flex-col gap-6">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-text-main">Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1">Resumen de actividad reciente</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 w-full">

                    {/* --- IZQUIERDA: GRÁFICA --- */}
                    <div className="w-full lg:w-2/3 flex flex-col">
                        <div className="h-[450px] lg:h-[500px] w-full relative">
                            {/* Pasamos los datos reales */}
                            <EmailChart
                                data={chartData}
                                selectedYear={selectedYear}
                                onYearChange={setSelectedYear}
                            />
                        </div>
                    </div>

                    {/* --- DERECHA: CORREOS --- */}
                    <div className="w-full lg:w-1/3 flex flex-col">
                        <div className="h-auto lg:h-[500px] w-full">
                            {/* Pasamos los datos reales */}
                            <RecentEmails
                                emails={emailData}
                                isLoading={isLoading && emailData.length === 0}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};