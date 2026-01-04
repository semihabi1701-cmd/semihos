import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Plus, Trash2, Calendar, TrendingUp, AlertCircle, RefreshCw, Zap } from 'lucide-react';

const Subscriptions = () => {
    const { subscriptions, addSubscription, removeSubscription } = useApp();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [cost, setCost] = useState('');
    const [cycle, setCycle] = useState('monthly');
    const [firstPayment, setFirstPayment] = useState('');

    // Predefined Brands for Auto-Styling
    const brands = {
        netflix: { color: 'bg-red-600', text: 'text-red-100', glow: 'shadow-red-900/50' },
        spotify: { color: 'bg-green-500', text: 'text-green-100', glow: 'shadow-green-900/50' },
        youtube: { color: 'bg-red-500', text: 'text-white', glow: 'shadow-red-900/50' },
        amazon: { color: 'bg-blue-900', text: 'text-blue-100', glow: 'shadow-blue-900/50' },
        prime: { color: 'bg-blue-500', text: 'text-blue-100', glow: 'shadow-blue-900/50' },
        disney: { color: 'bg-blue-800', text: 'text-blue-100', glow: 'shadow-blue-900/50' },
        apple: { color: 'bg-slate-800', text: 'text-slate-100', glow: 'shadow-slate-900/50' },
        mcfit: { color: 'bg-yellow-500', text: 'text-yellow-900', glow: 'shadow-yellow-900/50' },
        adobe: { color: 'bg-red-500', text: 'text-red-100', glow: 'shadow-red-900/50' },
        chatgpt: { color: 'bg-emerald-600', text: 'text-emerald-100', glow: 'shadow-emerald-900/50' },
    };

    const getBrandStyle = (name) => {
        const lowerName = name.toLowerCase();
        for (const brand in brands) {
            if (lowerName.includes(brand)) return brands[brand];
        }
        return { color: 'bg-slate-800', text: 'text-slate-300', glow: 'shadow-slate-900/50' }; // Default
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!name || !cost) return;

        addSubscription({
            name,
            cost: parseFloat(cost),
            cycle,
            firstPayment: firstPayment || new Date().toISOString().split('T')[0]
        });

        setName('');
        setCost('');
        setCycle('monthly');
        setFirstPayment('');
        setShowForm(false);
    };

    // Calculations
    const totalMonthly = subscriptions.reduce((sum, sub) => {
        return sub.cycle === 'monthly' ? sum + sub.cost : sum + (sub.cost / 12);
    }, 0);

    const totalYearly = totalMonthly * 12;

    const getNextPaymentDate = (firstPaymentStr, cycle) => {
        const today = new Date();
        let paymentDate = new Date(firstPaymentStr);

        while (paymentDate < today) {
            if (cycle === 'monthly') {
                paymentDate.setMonth(paymentDate.getMonth() + 1);
            } else {
                paymentDate.setFullYear(paymentDate.getFullYear() + 1);
            }
        }
        return paymentDate;
    };

    const getDaysUntil = (date) => {
        const today = new Date();
        const diff = date - today;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white flex items-center tracking-tight mb-2">
                        <span className="bg-rose-500/20 p-2 rounded-2xl mr-4 border border-rose-500/20 text-rose-400">
                            <CreditCard size={32} strokeWidth={2.5} />
                        </span>
                        Deine Abos
                    </h2>
                    <p className="text-slate-400 font-medium text-lg">
                        Behalte den Überblick über deine Fixkosten.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                    {showForm ? <Trash2 size={20} /> : <Plus size={20} />}
                    <span>{showForm ? 'Abbrechen' : 'Abo hinzufügen'}</span>
                </button>
            </div>

            {/* Pain Calculator Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Monatliche Belastung</div>
                        <div className="text-4xl font-black text-white">{totalMonthly.toFixed(2)}€</div>
                        <div className="text-slate-500 text-sm font-medium mt-1">Jeden Monat weg.</div>
                    </div>
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-rose-400">
                        <RefreshCw size={28} />
                    </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex items-center justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                        <div className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Jährliche Belastung</div>
                        <div className="text-4xl font-black text-orange-400">{totalYearly.toFixed(2)}€</div>
                        <div className="text-slate-500 text-sm font-medium mt-1">Das tut weh.</div>
                    </div>
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-orange-400">
                        <AlertCircle size={28} />
                    </div>
                </div>
            </div>

            {/* Add Form */}
            {showForm && (
                <form onSubmit={handleAdd} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-2xl animate-slideDown relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-slate-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Name des Abos</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="z.B. Netflix" className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-3 font-bold text-white focus:ring-2 focus:ring-rose-500/50 outline-none" autoFocus />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Kosten (€)</label>
                            <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} placeholder="12.99" className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-3 font-bold text-white focus:ring-2 focus:ring-rose-500/50 outline-none" />
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Abbuchung</label>
                            <select value={cycle} onChange={e => setCycle(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-3 font-bold text-white focus:ring-2 focus:ring-rose-500/50 outline-none appearance-none">
                                <option value="monthly">Monatlich</option>
                                <option value="yearly">Jährlich</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-slate-400 font-bold mb-2 ml-1 text-xs uppercase tracking-wider">Erste Zahlung</label>
                            <input type="date" value={firstPayment} onChange={e => setFirstPayment(e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-3 font-bold text-white focus:ring-2 focus:ring-rose-500/50 outline-none block" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button type="submit" className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">Hinzufügen</button>
                    </div>
                </form>
            )}

            {/* Subscriptions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptions.map(sub => {
                    const style = getBrandStyle(sub.name);
                    const nextDate = getNextPaymentDate(sub.firstPayment || '2024-01-01', sub.cycle);
                    const daysLeft = getDaysUntil(nextDate);

                    return (
                        <div key={sub.id} className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 hover:scale-[1.02] transition-transform duration-300 relative group overflow-hidden">
                            {/* Brand Splash Background */}
                            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${style.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`}></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black uppercase shadow-lg ${style.color} ${style.text} ${style.glow}`}>
                                    {sub.name.substring(0, 2)}
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-2xl font-black text-white">{sub.cost.toFixed(2)}€</div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-2">{sub.cycle === 'monthly' ? 'pro Monat' : 'pro Jahr'}</div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (confirm('Abo wirklich löschen?')) removeSubscription(sub.id); }}
                                        className="text-slate-600 hover:text-red-400 hover:bg-slate-800/50 p-1.5 rounded-lg transition-all flex items-center space-x-1 group/del"
                                        title="Löschen"
                                    >
                                        <span className="text-[10px] uppercase font-bold text-slate-600 group-hover/del:text-red-400 transition-colors">Entfernen</span>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-white mb-4">{sub.name}</h3>

                                <div className="flex items-center space-x-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                    <div className={`p-1.5 rounded-lg ${daysLeft <= 3 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                                        <Zap size={14} fill={daysLeft <= 3 ? "currentColor" : "none"} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nächste Abbuchung</div>
                                        <div className={`text-sm font-bold ${daysLeft <= 3 ? 'text-rose-400' : 'text-slate-300'}`}>
                                            {daysLeft === 0 ? 'HEUTE' : daysLeft === 1 ? 'MORGEN' : `in ${daysLeft} Tagen`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Subscriptions;
