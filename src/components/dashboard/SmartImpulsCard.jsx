import React, { useState } from 'react';
import { Lightbulb, Zap } from 'lucide-react';

const tips = [
    "Trinke ein Glas Wasser direkt nach dem Aufstehen.",
    "Nutze die Pomodoro-Technik: 25 Min Fokus, 5 Min Pause.",
    "Schreibe heute Abend 3 Dinge auf, für die du dankbar bist.",
    "Mache einen 10-Minuten Spaziergang ohne Handy.",
    "Räume deinen Schreibtisch auf für klaren Kopf.",
    "Lies 10 Seiten in einem Buch statt Social Media.",
];

const SmartImpulsCard = () => {
    const [currentTip, setCurrentTip] = useState(null);

    const showRandomTip = () => {
        const random = tips[Math.floor(Math.random() * tips.length)];
        setCurrentTip(random);
    };

    return (
        <div className="bg-slate-900 rounded-2xl p-6 border border-emerald-500/20 shadow-sm hover:border-emerald-500/40 transition-shadow mt-6 relative overflow-hidden">
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 ring-1 ring-emerald-500/20">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Smart Impuls</h3>
                        <p className="text-slate-400 italic text-sm">
                            {currentTip || "Brauchst du einen schnellen Life-Hack?"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={showRandomTip}
                    className="flex items-center space-x-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 px-6 py-3 rounded-xl transition-colors font-bold border border-emerald-500/10"
                >
                    <Zap size={18} />
                    <span>{currentTip ? 'Nächster Tipp' : 'Tipp anzeigen'}</span>
                </button>
            </div>
        </div>
    );
};

export default SmartImpulsCard;
