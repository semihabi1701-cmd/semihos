import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
    Plus,
    PieChart,
    ArrowUpRight,
    ArrowDownLeft,
    ScanLine,
    Receipt,
    X,
    Check,
    Calendar,
    Wallet,
    TrendingUp,
    TrendingDown,
    Banknote
} from 'lucide-react';

const Finance = () => {
    const { transactions, addTransaction, availableFunds } = useApp();
    const [view, setView] = useState('list'); // 'list' | 'analytics'
    const [showModal, setShowModal] = useState(false);
    const [modalTab, setModalTab] = useState('manual'); // 'manual' | 'scan'

    // Form State
    const [amount, setAmount] = useState('');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Sonstiges');
    const [type, setType] = useState('expense');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Scan Simulation State
    const [isScanning, setIsScanning] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);

    // Categories
    const categories = {
        expense: ['Lebensmittel', 'Miete', 'Transport', 'Freizeit', 'Versicherung', 'Shopping', 'Sonstiges'],
        income: ['Gehalt', 'Nebenjob', 'Geschenk', 'Dividende', 'Sonstiges'],
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (!amount || !title) return;

        addTransaction({
            title,
            amount: parseFloat(amount),
            category,
            type,
            date,
        });

        // Reset
        setAmount('');
        setTitle('');
        setCategory('Sonstiges');
        setType('expense');
        setDate(new Date().toISOString().split('T')[0]);
        setScanSuccess(false);
        setShowModal(false);
    };

    const simulateScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScanSuccess(true);
            // Simulated Data from "OCR"
            setAmount('34.90');
            setTitle('Lidl Einkauf');
            setCategory('Lebensmittel');
            setType('expense');
            setModalTab('manual'); // Switch to review
        }, 2000);
    };

    // Analytics Calculations
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const expensesByCategory = categories.expense.map(cat => {
        const sum = transactions
            .filter(t => t.type === 'expense' && t.category === cat)
            .reduce((s, t) => s + t.amount, 0);
        return { name: cat, value: sum };
    }).filter(c => c.value > 0).sort((a, b) => b.value - a.value);

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, tx) => {
        const date = tx.date;
        if (!groups[date]) groups[date] = [];
        groups[date].push(tx);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedTransactions).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-fadeIn font-sans">

            {/* Minimalist Header */}
            <div className="mb-10 text-center relative">
                <div className="inline-block relative">
                    <h1 className="text-6xl font-black text-white tracking-tighter mb-2">
                        {availableFunds.toLocaleString('de-DE', { minimumFractionDigits: 2 })}€
                    </h1>
                    <div className="absolute -right-8 top-2 text-slate-500 font-bold text-lg animate-pulse">●</div>
                </div>
                <p className="text-slate-500 uppercase tracking-[0.2em] text-xs font-bold">Aktueller Kontostand</p>
            </div>

            {/* Action Hub - The "Apple Wallet" Feel */}
            <div className="flex justify-center gap-4 mb-12">
                <button
                    onClick={() => { setView('list'); setShowModal(true); }}
                    className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5"
                >
                    <div className="bg-black text-white p-1 rounded-full"><Plus size={16} strokeWidth={3} /></div>
                    <span>Transaktion</span>
                </button>
                <button
                    onClick={() => setView(view === 'list' ? 'analytics' : 'list')}
                    className={`px-8 py-4 rounded-full font-bold flex items-center gap-2 border transition-all ${view === 'analytics' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-transparent border-slate-700 text-slate-300 hover:bg-slate-900'}`}
                >
                    <PieChart size={20} />
                    <span>{view === 'list' ? 'Analyse' : 'Listenansicht'}</span>
                </button>
            </div>

            {/* Content Switcher */}
            {view === 'list' ? (
                <div className="space-y-8">
                    {sortedDates.map(dateStr => (
                        <div key={dateStr} className="animate-slideDown">
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-4 ml-2">
                                {new Date(dateStr).toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </h3>
                            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-3xl overflow-hidden hover:border-slate-700 transition-colors">
                                {groupedTransactions[dateStr].map((tx, idx) => (
                                    <div key={tx.id} className={`flex items-center justify-between p-5 hover:bg-white/5 transition-colors ${idx !== groupedTransactions[dateStr].length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-base">{tx.title}</div>
                                                <div className="text-xs text-slate-500 font-medium">{tx.category}</div>
                                            </div>
                                        </div>
                                        <div className={`font-black text-lg ${tx.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                            {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2).replace('.', ',')}€
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Analytics View */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                    {/* Summary Cards */}
                    <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Einnahmen</div>
                            <div className="text-4xl font-black text-emerald-400">+{totalIncome.toFixed(2)}€</div>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <TrendingUp className="text-emerald-500/20 w-24 h-24 absolute -bottom-4 -left-4" strokeWidth={1} />
                            <div className="text-right w-full">
                                <span className="text-emerald-500 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full">Gut gemacht</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between h-64 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-rose-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Ausgaben</div>
                            <div className="text-4xl font-black text-rose-400">-{totalExpense.toFixed(2)}€</div>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <TrendingDown className="text-rose-500/20 w-24 h-24 absolute -bottom-4 -left-4" strokeWidth={1} />
                        </div>
                    </div>

                    {/* Category Breakdown (Simple Bar Chart Visualization) */}
                    <div className="md:col-span-2 bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <PieChart size={20} className="text-slate-400" />
                            <span>Ausgaben nach Kategorie</span>
                        </h3>
                        <div className="space-y-4">
                            {expensesByCategory.map(cat => {
                                const percentage = Math.min(100, (cat.value / totalExpense) * 100);
                                return (
                                    <div key={cat.name}>
                                        <div className="flex justify-between text-sm font-bold mb-1">
                                            <span className="text-slate-400">{cat.name}</span>
                                            <span className="text-white">{cat.value.toFixed(2)}€ ({percentage.toFixed(0)}%)</span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-indigo-500 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Smart Transaction Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-[2rem] shadow-2xl relative overflow-hidden">

                        {/* Modal Header */}
                        <div className="p-6 flex justify-between items-center border-b border-slate-900">
                            <h2 className="text-xl font-black text-white">Neue Transaktion</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 bg-slate-900 rounded-full text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex p-2 bg-slate-900/50 mx-6 mt-6 rounded-2xl">
                            <button
                                onClick={() => setModalTab('manual')}
                                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${modalTab === 'manual' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                Manuell
                            </button>
                            <button
                                onClick={() => setModalTab('scan')}
                                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${modalTab === 'scan' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                            >
                                <ScanLine size={14} /> Scan
                            </button>
                        </div>

                        <div className="p-6">
                            {modalTab === 'manual' ? (
                                <form onSubmit={handleAdd} className="space-y-4 animate-slideUp">
                                    {/* Type Toggle */}
                                    <div className="flex gap-4 mb-6">
                                        <label className={`flex-1 cursor-pointer border rounded-2xl p-4 text-center transition-all ${type === 'expense' ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                                            <input type="radio" name="type" value="expense" checked={type === 'expense'} onChange={() => setType('expense')} className="hidden" />
                                            <span className="font-bold">Ausgabe</span>
                                        </label>
                                        <label className={`flex-1 cursor-pointer border rounded-2xl p-4 text-center transition-all ${type === 'income' ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
                                            <input type="radio" name="type" value="income" checked={type === 'income'} onChange={() => setType('income')} className="hidden" />
                                            <span className="font-bold">Einnahme</span>
                                        </label>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Betrag</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value)}
                                                placeholder="0.00"
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-2xl font-black text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                                autoFocus
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold">€</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Titel</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="z.B. Rewe Einkauf"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 font-bold text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Kategorie</label>
                                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 font-bold text-white outline-none appearance-none">
                                                {(type === 'expense' ? categories.expense : categories.income).map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 px-1">Datum</label>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={e => setDate(e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 font-bold text-white outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-slate-200 transition-colors mt-4">
                                        Speichern
                                    </button>
                                </form>
                            ) : (
                                /* SCAN MOCK UI */
                                <div className="text-center py-10 animate-slideUp">
                                    <div
                                        onClick={!isScanning ? simulateScan : null}
                                        className={`border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer relative overflow-hidden group ${isScanning ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-900'}`}
                                    >
                                        {isScanning && (
                                            <div className="absolute inset-0 bg-indigo-500/20 animate-pulse">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.8)] animate-scan"></div>
                                            </div>
                                        )}

                                        <div className="relative z-10 flex flex-col items-center gap-4">
                                            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isScanning ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}`}>
                                                {isScanning ? <ScanLine className="animate-spin-slow" size={32} /> : <Receipt size={32} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-lg">{isScanning ? 'Analysiere...' : 'Screenshot hochladen'}</h3>
                                                <p className="text-slate-500 text-sm mt-1">{isScanning ? 'Zahlen werden extrahiert' : 'Bank-Screenshot hier ablegen'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-6 font-medium">Unterstützt Sparkasse, N26, ING & PayPal Screenshots.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Finance;
