import { httpClient } from '../utils/http-client';
import { type ChartData } from '../features/private/components/email-chart'; 
import { type EmailData } from '../features/private/components/recent-emails'; 

interface DashboardResponse {
    chartData: ChartData[];
    recentEmails: EmailData[];
}

export const dashboardService = {
    getData: async (year: string) => {
        try {
            // Pasamos el año como query param
            const response = await httpClient.get<DashboardResponse>(`/dashboard?year=${year}`);
            return response;
        } catch (error) {
            console.error("Error fetching dashboard data", error);
            // Retornamos estructura vacía para no romper la UI
            return {
                chartData: [],
                recentEmails: []
            };
        }
    }
};