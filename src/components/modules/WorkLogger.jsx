import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, Plus, Briefcase, Sparkles, Settings, TrendingUp, Clock, Calendar, Trash2 } from 'lucide-react';

const WorkLogger = () => {
    const { workHours, addWorkEntry, removeWorkEntry, jobSettings, updateJobSettings } = useApp();
    const [activeTab, setActiveTab] = useState('Schnell');
    const [showSettings, setShowSettings] = useState(false);

    // Overtime State
    const [showOvertime, setShowOvertime] = useState(false);
    const [overtimeHours, setOvertimeHours] = useState('');

    // Retroactive State
    const [showRetro, setShowRetro] = useState(false);
    const [retroDate, setRetroDate] = useState('');
    const [retroHours, setRetroHours] = useState('');
    const [retroNote, setRetroNote] = useState('');

    // Nebenjob State
    const [showNebenjob, setShowNebenjob] = useState(false);
    const [njHours, setNjHours] = useState('');
    const [njRate, setNjRate] = useState('');
    const [njNote, setNjNote] = useState('');

    // Safety check for jobSettings
    const baseRate = jobSettings?.baseRate || 16.00;
    const futureRate = jobSettings?.futureRate || 17.00;
    const futureRateDate = jobSettings?.futureRateDate || '2026-02-01';
    const standardHours = jobSettings?.standardHours || 7.5;

    // Header Calc
    const totalEarned = workHours.reduce((sum, entry) => sum + (entry.earnings || 0), 0);
    const nebenjobEarned = workHours
        .filter(e => e.type === 'Nebenjob')
        .reduce((sum, entry) => sum + (entry.earnings || 0), 0);

    const formatMoney = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);

    // Quick Action Handler (Hauptjob Standard)
    const handleQuickBook = () => {
        addWorkEntry({
            id: Date.now(),
            date: new Date().toLocaleDateString('de-DE'),
            timestamp: new Date(),
            hours: standardHours,
            type: 'Hauptjob',
            note: `Hauptjob (${standardHours}h)`
        });
    };

    const handleOvertime = (e) => {
        e.preventDefault();
        if (!overtimeHours) return;
        addWorkEntry({
            id: Date.now(),
            date: new Date().toLocaleDateString('de-DE'),
            timestamp: new Date(),
            hours: parseFloat(overtimeHours),
            type: 'Überstunden',
            note: `Überstunden (+${overtimeHours}h)`
        });
        setOvertimeHours('');
        setShowOvertime(false);
    };

    const handleRetro = (e) => {
        e.preventDefault();
        if (!retroHours || !retroDate) return;

        addWorkEntry({
            id: Date.now(),
            date: new Date(retroDate).toLocaleDateString('de-DE'),
            timestamp: new Date(retroDate), // Use selected date for rate calculation
            hours: parseFloat(retroHours),
            type: 'Nachtrag',
            note: retroNote || 'Nachtrag'
        });

        setRetroHours('');
        setRetroDate('');
        setRetroNote('');
        setShowRetro(false);
    }

    const handleNebenjob = (e) => {
        e.preventDefault();
        if (!njHours) return;

        addWorkEntry({
            id: Date.now(),
            date: new Date().toLocaleDateString('de-DE'),
            timestamp: new Date(),
            hours: parseFloat(njHours),
            type: 'Nebenjob',
            earnings: parseFloat(njHours) * (parseFloat(njRate) || 12.00),
            manualRate: parseFloat(njRate),
            note: njNote || 'Nebenjob Einsatz'
        });

        setNjHours('');
        setNjRate('');
        setNjNote('');
        setShowNebenjob(false);
    }

    return (
        <div className="space-y-6 relative">

            {/* Settings Modal Overlay */}
            {showSettings && (
                <div className="absolute top-0 left-0 w-full h-full z-20 bg-slate-900/90 backdrop-blur-sm rounded-3xl p-6 animate-fadeIn flex flex-col justify-center border border-slate-700 shadow-2xl">
                    <h3 className="text-xl font-bold mb-6 text-white flex items-center">
                        <Settings className="mr-2" size={24} />
                        Job Einstellungen
                    </h3>

                    <div className="space-y-6">
                        {/* Standard Hours Config */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Tägliche Arbeitszeit (Stunden)</label>
                            <div className="flex items-center bg-slate-950 rounded-xl px-4 py-3 border border-slate-800">
                                <Clock size={20} className="text-slate-500 mr-3" />
                                <input
                                    type="number"
                                    step="0.1"
                                    value={standardHours}
                                    onChange={(e) => updateJobSettings({ standardHours: parseFloat(e.target.value) })}
                                    className="bg-transparent font-bold text-xl w-full outline-none text-white"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">Das System bucht automatisch diese Stunden beim Klick auf "Hauptjob".</p>
                        </div>

                        <div className="h-px bg-slate-800"></div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Stundenlohn (Aktuell)</label>
                            <div className="flex items-center bg-slate-950 rounded-xl px-4 py-3 border border-slate-800">
                                <span className="text-slate-500 mr-3 font-bold">€</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={baseRate}
                                    onChange={(e) => updateJobSettings({ baseRate: parseFloat(e.target.value) })}
                                    className="bg-transparent font-bold text-xl w-full outline-none text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Stundenlohn (ab Feb '26)</label>
                            <div className="flex items-center bg-blue-500/10 rounded-xl px-4 py-3 border border-blue-500/20 transition-colors focus-within:ring-2 focus-within:ring-blue-500/20">
                                <span className="text-blue-500 mr-3 font-bold">€</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={futureRate}
                                    onChange={(e) => updateJobSettings({ futureRate: parseFloat(e.target.value) })}
                                    className="bg-transparent font-bold text-xl text-blue-400 w-full outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setShowSettings(false)} className="mt-8 w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all hover:bg-primary-dark active:scale-95">
                        Speichern & Schließen
                    </button>
                </div>
            )}

            {/* Main Header with Income Stats */}
            <div className="flex justify-between items-end px-2">
                <div>
                    <div className="text-sm text-slate-400 font-medium mb-1 flex items-center">
                        Gesamtverdienst
                    </div>
                    <div className="text-4xl font-black text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {formatMoney(totalEarned)}
                    </div>
                    {nebenjobEarned > 0 && (
                        <div className="inline-flex items-center mt-3 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-fadeIn">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></span>
                            <span className="text-xs font-bold text-emerald-400">Davon Nebenjob: {formatMoney(nebenjobEarned)}</span>
                        </div>
                    )}
                </div>
                <div className="flex space-x-2 ml-auto mb-1 items-center">
                    {/* Retro Button */}
                    <button
                        onClick={() => setShowRetro(!showRetro)}
                        className={`p-3 rounded-xl transition-all active:scale-90 shadow-sm border ${showRetro ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'}`}
                        title="Arbeit nachtragen"
                    >
                        <Calendar size={22} />
                    </button>

                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-900 border border-slate-800 hover:border-slate-700 shadow-sm rounded-xl transition-all active:scale-90"
                        title="Einstellungen"
                    >
                        <Settings size={22} />
                    </button>
                </div>
            </div>

            {/* Retroactive Form Area */}
            {showRetro && (
                <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-3xl p-6 animate-slideDown shadow-inner">
                    <h4 className="font-bold text-indigo-300 mb-4 flex items-center">
                        <Calendar size={18} className="mr-2" />
                        Arbeit nachtragen
                    </h4>
                    <form onSubmit={handleRetro} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Datum</label>
                            <input type="date" required value={retroDate} onChange={e => setRetroDate(e.target.value)} className="w-full rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-white" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Stunden</label>
                            <input type="number" required step="0.5" value={retroHours} onChange={e => setRetroHours(e.target.value)} className="w-full rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-white placeholder-slate-500" placeholder="z.B. 8.0" />
                        </div>
                        <div className="md:col-span-1">
                            <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Notiz</label>
                            <input type="text" value={retroNote} onChange={e => setRetroNote(e.target.value)} className="w-full rounded-xl border-none px-3 py-2 text-sm font-bold shadow-sm focus:ring-2 focus:ring-indigo-500 bg-slate-900 text-white placeholder-slate-500" placeholder="z.B. Vergessen" />
                        </div>
                        <div className="md:col-span-1 flex items-end">
                            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-2 rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-colors">Speichern</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="bg-slate-900 rounded-t-2xl flex border-b border-slate-800 overflow-hidden">
                <button
                    onClick={() => setActiveTab('Schnell')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-bold text-sm transition-colors relative ${activeTab === 'Schnell' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Zap size={18} />
                    <span>Schnell</span>
                    {activeTab === 'Schnell' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('AI Magie')}
                    className={`flex-1 py-4 flex items-center justify-center space-x-2 font-bold text-sm transition-colors relative ${activeTab === 'AI Magie' ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Sparkles size={18} />
                    <span>AI Magie</span>
                    {activeTab === 'AI Magie' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>}
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-slate-900 rounded-b-3xl rounded-tr-3xl p-8 border border-t-0 border-slate-800 shadow-lg min-h-[200px] animate-fadeIn relative z-10 transition-colors">

                {activeTab === 'Schnell' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Hauptjob Card */}
                        <div className="space-y-4">
                            <button
                                onClick={handleQuickBook}
                                className="w-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl p-6 text-left relative overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-500/20 group"
                            >
                                <div className="relative z-10">
                                    <div className="text-blue-100 font-bold text-xs uppercase tracking-wider mb-1">Standard Buchen</div>
                                    <div className="text-3xl font-black">Hauptjob</div>
                                    <div className="mt-1 inline-block bg-white/20 px-2 py-0.5 rounded text-xs font-medium">{standardHours} Stunden</div>
                                </div>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 group-hover:opacity-60 transition-opacity transform group-hover:rotate-12 text-white">
                                    <Briefcase size={40} />
                                </div>
                            </button>

                            {/* Overtime Toggle */}
                            {!showOvertime ? (
                                <button onClick={() => setShowOvertime(true)} className="w-full py-3 border-2 border-orange-500/20 text-orange-400 font-bold rounded-xl hover:bg-orange-500/10 hover:text-orange-300 transition-colors flex items-center justify-center text-sm">
                                    <TrendingUp size={16} className="mr-2" />
                                    Überstunden?
                                </button>
                            ) : (
                                <form onSubmit={handleOvertime} className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-xl animate-fadeIn">
                                    <label className="text-xs font-bold text-orange-400 uppercase">Wie viele Stunden?</label>
                                    <div className="flex space-x-2 mt-2">
                                        <input type="number" step="0.5" autoFocus value={overtimeHours} onChange={e => setOvertimeHours(e.target.value)} className="w-full rounded-lg border-none px-3 py-2 text-sm font-bold shadow-sm bg-slate-950 text-white placeholder-slate-500" placeholder="z.B. 1.5" />
                                        <button type="submit" className="bg-orange-600 text-white px-4 rounded-lg font-bold shadow-md hover:bg-orange-500 transition-colors">OK</button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Nebenjob Card */}
                        {!showNebenjob ? (
                            <div
                                onClick={() => setShowNebenjob(true)}
                                className="border-2 border-dashed border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-800 hover:border-slate-600 transition-colors cursor-pointer h-full min-h-[140px] group"
                            >
                                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors text-slate-400">
                                    <Plus size={24} className="group-hover:text-white" />
                                </div>
                                <span className="font-bold text-sm group-hover:text-slate-300">Nebenjob eintragen</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNebenjob} className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 flex flex-col justify-between animate-fadeIn h-full shadow-lg">
                                <div>
                                    <h4 className="font-bold text-white mb-4 text-sm flex items-center"><Zap size={14} className="mr-2 text-yellow-500" /> Nebenjob erfassen</h4>
                                    <input type="number" value={njHours} onChange={e => setNjHours(e.target.value)} className="w-full mb-3 bg-slate-950 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-500" placeholder="Stunden..." autoFocus />
                                    <input type="number" value={njRate} onChange={e => setNjRate(e.target.value)} className="w-full mb-3 bg-slate-950 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-500" placeholder="Stundenlohn (€)..." />
                                    <input type="text" value={njNote} onChange={e => setNjNote(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/50 text-white placeholder-slate-500" placeholder="Was hast du gemacht?" />
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <button type="button" onClick={() => setShowNebenjob(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg">Abbr.</button>
                                    <button type="submit" className="flex-1 bg-white text-black rounded-lg py-2 text-xs font-bold shadow-lg hover:bg-gray-200 transition-colors">Speichern</button>
                                </div>
                            </form>
                        )}

                    </div>
                )}

                {activeTab === 'AI Magie' && (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 h-full">
                        <Sparkles size={48} className="mb-4 text-primary/20" />
                        <h3 className="text-white font-bold mb-2">Automatisches Tracking</h3>
                        <p className="max-w-sm text-sm text-slate-400">Die AI analysiert bald deinen Kalender und trägt die Stunden für dich ein.</p>
                    </div>
                )}

            </div>

            {/* History Section */}
            <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">
                <h3 className="font-bold text-white mb-4 text-lg">Verlauf</h3>

                {workHours.length === 0 ? (
                    <div className="text-center py-8 text-slate-600 flex flex-col items-center">
                        <div className="mb-2 opacity-50 bg-slate-800 p-4 rounded-full"><Clock size={32} /></div>
                        <p className="text-sm font-medium">Keine Einträge vorhanden.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {workHours.map((entry) => (
                            <div key={entry.id} className="flex items-center justify-between p-4 hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-700 group">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm ${entry.type === 'Überstunden' ? 'bg-purple-500/10 text-purple-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                        {entry.hours}h
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-sm">{entry.note}</div>
                                        <div className="text-xs text-slate-500 mt-0.5 font-medium">{entry.date} • {entry.type || 'Standard'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="font-black text-white text-lg">
                                        +{formatMoney(entry.earnings || 0)}
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('Eintrag wirklich löschen?')) removeWorkEntry(entry.id) }}
                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkLogger;
