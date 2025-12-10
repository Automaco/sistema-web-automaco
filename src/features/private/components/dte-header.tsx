import { Download } from 'lucide-react';

export const DteHeader = () => (
    <div className="flex flex-col mb-8 border-b border-border-base pb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                <Download size={28} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-brand-primary">Descarga de los DTEs</h1>
                <p className="text-text-muted text-sm">
                    Selecciona y descarga los DTEs que tú desees organizados por fechas
                </p>
            </div>
        </div>
    </div>
);