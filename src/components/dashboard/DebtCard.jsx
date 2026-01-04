import React from 'react';
import { Wallet, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const DebtCard = () => {
    const { totalDebt, setActiveTab } = useApp();

    return (
        <div className="bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-800 w-[350px] flex flex-col justify-between hover:border-red-500/30 transition-colors group">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2 text-white font-bold">
                        <Wallet size={20} className="text-red-500" />
                        <h3>Schulden</h3>
                    </div>
                    <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded font-medium">Gesamt</span>
                </div>

                <div className="mt-4">
                    <div className="text-3xl font-black text-white mb-1">
                        {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalDebt)}
                    </div>
                    <p className="text-xs text-slate-500">Nächste Rate: 31.12.2025</p>
                </div>
            </div>

            <button
                onClick={() => setActiveTab('Schulden')}
                className="w-full mt-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors active:scale-95 transform border border-red-500/10"
            >
                <span>Alles verwalten</span>
                <ArrowRight size={16} />
            </button>
        </div>
    );
};

export default DebtCard;
