import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Calendar, Check } from 'lucide-react';

const DebtManager = () => {
    const { debts, totalDebt, addDebt, payDebt, removeDebt } = useApp();
    const [showAddForm, setShowAddForm] = useState(false);

    // Form State
    const [newCreditor, setNewCreditor] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState('Sonstiges');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newCreditor || !newAmount) return;

        addDebt({
            creditor: newCreditor,
            amount: parseFloat(newAmount),
            dueDate: newDate || '2026-01-01',
            category: newCategory
        });

        // Reset
        setNewCreditor('');
        setNewAmount('');
        setNewDate('');
        setShowAddForm(false);
    };

    const formatCurrency = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val);
    const formatDate = (dateStr) => {
        // Basic date formatting
        return dateStr;
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl">
            {/* Header Stat Card */}
            <div className="bg-gradient-to-r from-[#ef4444] to-[#f43f5e] rounded-[32px] p-10 text-white shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[200px]">
                {/* Subtle geometric overlay for premium feel */}
                <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-white/10 to-transparent skew-x-12 transform translate-x-20"></div>

                <div className="relative z-10 space-y-2">
                    <h2 className="text-white/90 font-medium text-lg">Aktuelle Gesamtschulden</h2>
                    <div className="text-6xl font-black tracking-tight">{formatCurrency(totalDebt)}</div>
                    <p className="pt-4 text-white/80 text-sm max-w-lg font-medium leading-relaxed">
                        "Nur wer seine Zahlen kennt, kann sie ändern." – Behalte den Überblick und baue deine Schulden Schritt für Schritt ab.
                    </p>
                </div>
            </div>

            {/* Action Header */}
            <div className="flex justify-between items-end px-2">
                <h3 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                    Offene Posten
                </h3>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200 flex items-center gap-2 text-sm"
                >
                    <Plus size={18} strokeWidth={3} />
                    <span>Schuld hinzufügen</span>
                </button>
            </div>

            {/* Add Form (Inline Expansion) */}
            {showAddForm && (
                <form onSubmit={handleAdd} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-6 animate-slideDown relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-slate-900"></div>
                    <div className="md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Titel</label>
                        <input type="text" value={newCreditor} onChange={e => setNewCreditor(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-slate-900/10 transition-all outline-none" placeholder="z.B. Klarna" autoFocus />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Betrag</label>
                        <input type="number" step="0.01" value={newAmount} onChange={e => setNewAmount(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-bold text-gray-800 focus:ring-2 focus:ring-slate-900/10 transition-all outline-none" placeholder="0.00" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Fälligkeit</label>
                        <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 font-medium text-gray-600 focus:ring-2 focus:ring-slate-900/10 transition-all outline-none" />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                        <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors">Speichern</button>
                    </div>
                </form>
            )}

            {/* Simplified List */}
            <div className="space-y-3">
                {debts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-50">
                        <div className="text-gray-300 mb-4">
                            <Check size={48} />
                        </div>
                        <p className="text-gray-400 font-medium">Keine Schulden offen.</p>
                    </div>
                ) : (
                    debts.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-500 font-black text-xl flex items-center justify-center shrink-0">
                                    {item.creditor.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-lg leading-tight">{item.creditor}</h4>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mt-1">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {item.dueDate}</span>
                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{item.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <span className="text-xl font-black text-gray-900">{formatCurrency(item.amount)}</span>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            const amount = prompt("Betrag zum Abbezahlen eingeben:", item.amount);
                                            if (amount) payDebt(item.id, parseFloat(amount));
                                        }}
                                        className="px-5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg text-sm font-bold transition-all active:scale-95"
                                    >
                                        Tilgen
                                    </button>
                                    <button
                                        onClick={() => { if (confirm("Eintrag wirklich löschen?")) removeDebt(item.id) }}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DebtManager;
