import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Loader2 } from 'lucide-react';

const AiCoachCard = () => {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);

    const generateReport = () => {
        setLoading(true);
        // Simulate AI thinking
        setTimeout(() => {
            setReport("Deine Produktivität ist heute um 15% gestiegen! Fokus liegt heute auf 'Arbeit'. Vergiss nicht, Pausen zu machen.");
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-sm hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-start space-x-4 max-w-[70%]">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0 ring-1 ring-primary/20">
                        <BrainCircuit size={28} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Semih's AI Coach</h3>

                        {loading ? (
                            <div className="flex items-center text-primary mt-1">
                                <Loader2 size={16} className="animate-spin mr-2" />
                                <span className="text-sm">Analysiere Daten...</span>
                            </div>
                        ) : report ? (
                            <p className="text-primary font-medium text-sm mt-1 animate-fadeIn">
                                {report}
                            </p>
                        ) : (
                            <div className="mt-1">
                                <p className="text-slate-400 text-sm">Intelligente Analyse deiner Daten</p>
                                <p className="text-slate-500 italic text-sm mt-1">Klicke auf "Bericht erstellen" für dein Daily Update.</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={generateReport}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-lg transition-colors font-semibold text-sm disabled:opacity-50 border border-primary/10"
                >
                    <Sparkles size={16} />
                    <span>{loading ? 'Generiere...' : 'Bericht erstellen'}</span>
                </button>
            </div>
        </div>
    );
};

export default AiCoachCard;
