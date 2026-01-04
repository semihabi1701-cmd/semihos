import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FinanceOverview = () => {
    return (
        <div className="bg-dark rounded-3xl p-8 text-white relative overflow-hidden shadow-xl flex-1">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Monats-Übersicht</h2>
                        <p className="text-slate-400 text-sm">Januar 2026</p>
                    </div>

                    <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
                        <span className="text-xs font-semibold text-slate-300">Status: Knapp</span>
                        <AlertTriangle size={14} className="text-yellow-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-12 mt-4">
                    <div>
                        <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-2">Einnahmen</div>
                        <div className="text-4xl font-black text-white">0,00 €</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-2">Fixkosten</div>
                        <div className="text-4xl font-black text-white">1.000,00 €</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceOverview;
