import { useState, useCallback } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine
} from 'recharts';
import { ChevronDown } from 'lucide-react';

export interface ChartData {
    month: string;
    emails: number;
}

interface EmailChartProps {
    data: ChartData[];
    selectedYear: string;
    onYearChange: (year: string) => void;
}

export const EmailChart = ({ data, selectedYear, onYearChange }: EmailChartProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Optimizamos los manejadores para evitar re-renderizados innecesarios
    const handleBarEnter = useCallback((_: any, index: number) => {
        // Solo actualizamos si el índice es diferente para evitar parpadeo
        setActiveIndex((prev) => (prev !== index ? index : prev));
    }, []);

    const handleBarLeave = useCallback(() => {
        setActiveIndex(null);
    }, []);

    return (
        <div className="w-full h-full bg-card-bg p-6 rounded-3xl shadow-sm border border-gray-100">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 className="text-2xl font-bold bg-bg-surface text-text-main">
                    Correos electrónicos recopilados en
                </h2>

                <div className="relative">
                    <select
                        value={selectedYear}
                        onChange={(e) => onYearChange(e.target.value)}
                        className="bg-bg-surface text-text-main appearance-none bg-transparent font-medium text-gray-500 border-b border-gray-300 pb-1 pr-8 focus:outline-none focus:border-brand-primary cursor-pointer hover:text-gray-700 transition-colors"
                    >
                        <option value="2024">Último año</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-0 pointer-events-none text-gray-400" size={16} />
                </div>
            </div>

            {/* --- GRÁFICA --- */}
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 0, left: -25, bottom: 0 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false} 
                            horizontal={false} 
                            style={{ pointerEvents: 'none' }} 
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                        />

                        <Tooltip
                            cursor={{ fill: 'transparent' }} // Importante para que no haya sombra gris default
                            contentStyle={{ 
                                borderRadius: '12px', 
                                border: 'none', 
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                            }}
                            // pointerEvents: 'none' es CRUCIAL para evitar que el tooltip cause parpadeo
                            wrapperStyle={{ pointerEvents: 'none', outline: 'none' }}
                        />

                        <ReferenceLine
                            y={80}
                            stroke="var(--text-muted)"
                            strokeDasharray="4 4"
                        />

                        <Bar
                            dataKey="emails"
                            radius={[6, 6, 6, 6]}
                            barSize={32}
                            onMouseEnter={handleBarEnter}
                            onMouseLeave={handleBarLeave}
                            // duration baja para respuesta rápida, pero easing suave
                            animationDuration={500}
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={activeIndex === index 
                                        ? 'var(--color-bar-hover)' 
                                        : 'var(--color-bar)'
                                    }
                                    // Eliminamos la transition CSS aquí porque React ya maneja el cambio de estado
                                    // Si dejas transition-all a veces entra en conflicto con el re-render de Recharts
                                    className="cursor-pointer"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};