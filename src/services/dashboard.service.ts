import { httpClient } from '../utils/http-client';
import { type ChartData } from '../features/private/components/email-chart'; 
import { type EmailData } from '../features/private/components/recent-emails'; 

interface DashboardResponse {
    chartData: ChartData[];
    recentEmails: EmailData[];
}

export const dashboardService = {
    getData: async (year: string, accountId?: number) => {
        try {
            // Construimos los parámetros URL
            const params = new URLSearchParams();
            params.append('year', year);
            
            // Solo lo enviamos si existe
            if (accountId) {
                params.append('account_id', accountId.toString());
            }

            // Usamos params en la petición
            const response = await httpClient.get<DashboardResponse>(`/dashboard?${params.toString()}`);
            return response;
        } catch (error) {
            console.error("Error fetching dashboard data", error);
            return {
                chartData: [],
                recentEmails: []
            };
        }
    }
};