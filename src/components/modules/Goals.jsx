import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Target, Plus, Trash2, Check, TrendingUp, Heart, Wallet, Brain, Calendar, Flag, Trophy, Clock } from 'lucide-react';

const Goals = () => {
    const { goals, addGoal, removeGoal, addMilestone, toggleMilestone } = useApp();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('finance');
    const [deadline, setDeadline] = useState('');
    const [initialMilestones, setInitialMilestones] = useState(['']);

    const categories = {
        finance: { label: 'Finanzen & Business', icon: <Wallet size={20} />, color: 'from-emerald-600/30 to-teal-900/40', border: 'border-emerald-500/30', text: 'text-emerald-400' },
        health: { label: 'Körper & Gesundheit', icon: <Heart size={20} />, color: 'from-rose-600/30 to-red-900/40', border: 'border-rose-500/30', text: 'text-rose-400' },
        mindset: { label: 'Mindset & Lernen', icon: <Brain size={20} />, color: 'from-violet-600/30 to-purple-900/40', border: 'border-violet-500/30', text: 'text-violet-400' },
        life: { label: 'Lifestyle & Träume', icon: <Trophy size={20} />, color: 'from-amber-600/30 to-orange-900/40', border: 'border-amber-500/30', text: 'text-amber-400' },
    };

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!title) return;

        const milestones = initialMilestones
            .filter(m => m.trim() !== '')
            .map(text => ({ id: Date.now() + Math.random(), text, completed: false }));

        addGoal({
            title,
            category,
            deadline,
            milestones
        });

        // Reset
        setTitle('');
        setCategory('finance');
        setDeadline('');
        setInitialMilestones(['']);
        setShowForm(false);
    };

    const updateMilestoneInput = (index, value) => {
        const newMilestones = [...initialMilestones];
        newMilestones[index] = value;
        setInitialMilestones(newMilestones);
    };

    const addMilestoneInput = () => {
        setInitialMilestones([...initialMilestones, '']);
    };

    const calculateTimeLeft = (deadlineStr) => {
        if (!deadlineStr) return null;
        const diff = new Date(deadlineStr) - new Date();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white flex items-center tracking-tight mb-2">
                        <span className="bg-primary/20 p-2 rounded-2xl mr-4 border border-primary/20">
                            <Target className="text-primary" size={32} strokeWidth={2.5} />
                        </span>
                        Vision Board
                    </h2>
                    <p className="text-slate-400 font-medium text-lg">
                        Manifestiere deine Zukunft.
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-white text-black px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                    {showForm ? <Trash2 size={20} /> : <Plus size={20} />}
                    <span>{showForm ? 'Abbrechen' : 'Neues Ziel'}</span>
                </button>
            </div>

            {/* Creation Form */}
            {showForm && (
                <form onSubmit={handleAddGoal} className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-2xl animate-slideDown relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">Dein Ziel</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="z.B. 10.000€ sparen"
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-5 py-4 text-xl font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all placeholder-slate-600"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">Kategorie</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-4 font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none appearance-none"
                                    >
                                        {Object.entries(categories).map(([key, val]) => (
                                            <option key={key} value={key}>{val.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wider">Deadline</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-4 py-4 font-bold text-white focus:ring-2 focus:ring-primary/50 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:border-l md:border-slate-800 md:pl-8 space-y-4">
                            <label className="block text-slate-400 font-bold mb-2 ml-1 text-sm uppercase tracking-wider flex items-center">
                                <Flag size={16} className="mr-2" /> Meilensteine (Steps)
                            </label>
                            {initialMilestones.map((ms, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    value={ms}
                                    onChange={(e) => updateMilestoneInput(idx, e.target.value)}
                                    placeholder={`Schritt ${idx + 1}`}
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-white focus:border-primary/50 outline-none transition-all"
                                />
                            ))}
                            <button
                                type="button"
                                onClick={addMilestoneInput}
                                className="text-sm font-bold text-primary hover:text-white transition-colors flex items-center"
                            >
                                <Plus size={16} className="mr-1" /> Weiteren Schritt hinzufügen
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                        <button type="submit" className="bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-light transition-all shadow-lg active:scale-95 text-lg">
                            Ziel manifestieren
                        </button>
                    </div>
                </form>
            )}

            {/* Goals Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {goals.map(goal => {
                    const style = categories[goal.category] || categories.other;
                    const timeLeft = calculateTimeLeft(goal.deadline);
                    const completedMilestones = goal.milestones.filter(m => m.completed).length;
                    const totalMilestones = goal.milestones.length;
                    const progress = totalMilestones === 0 ? 0 : Math.round((completedMilestones / totalMilestones) * 100);

                    return (
                        <div key={goal.id} className={`group relative overflow-hidden rounded-[2.5rem] p-1 bg-gradient-to-br ${style.color} hover:scale-[1.01] transition-all duration-500 shadow-2xl`}>
                            {/* Glass Content */}
                            <div className="bg-slate-900/90 backdrop-blur-xl h-full w-full rounded-[2.4rem] p-7 flex flex-col relative z-10 border border-white/5">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 ${style.text} shadow-inner`}>
                                            {style.icon}
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{categories[goal.category]?.label || 'Ziel'}</div>
                                            <h3 className="text-2xl font-black text-white leading-tight">{goal.title}</h3>
                                        </div>
                                    </div>

                                    {timeLeft !== null && (
                                        <div className={`flex flex-col items-end ${timeLeft < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                                            <div className="flex items-center space-x-1 bg-slate-950/50 px-3 py-1.5 rounded-full border border-slate-800">
                                                <Clock size={14} />
                                                <span className="text-xs font-bold">{timeLeft < 0 ? 'Abgelaufen' : `${timeLeft} Tage`}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-8">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                        <span>Fortschritt</span>
                                        <span className={progress === 100 ? 'text-emerald-400' : 'text-primary'}>{progress}%</span>
                                    </div>
                                    <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out flex items-center justify-end pr-1 relative overflow-hidden ${progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-primary'}`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            {progress > 10 && <div className="w-1 h-full bg-white/20 absolute right-0 animate-pulse"></div>}
                                        </div>
                                    </div>
                                </div>

                                {/* Milestones */}
                                <div className="space-y-3 flex-1">
                                    {goal.milestones.map(ms => (
                                        <div
                                            key={ms.id}
                                            onClick={() => toggleMilestone(goal.id, ms.id)}
                                            className={`flex items-center space-x-3 cursor-pointer p-2 rounded-xl transition-all ${ms.completed ? 'opacity-50' : 'hover:bg-white/5'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${ms.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                                                {ms.completed && <Check size={12} className="text-white" strokeWidth={4} />}
                                            </div>
                                            <span className={`text-sm font-medium ${ms.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                                {ms.text}
                                            </span>
                                        </div>
                                    ))}
                                    {goal.milestones.length === 0 && (
                                        <div className="text-slate-500 text-sm italic py-2">Keine Meilensteine definiert.</div>
                                    )}
                                </div>

                                {/* Footer Action */}
                                <div className="mt-6 pt-6 border-t border-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => {
                                            const text = prompt("Neuer Meilenstein:");
                                            if (text) addMilestone(goal.id, text);
                                        }}
                                        className="text-xs font-bold text-slate-400 hover:text-white flex items-center"
                                    >
                                        <Plus size={14} className="mr-1" /> Schritt hinzufügen
                                    </button>
                                    <button
                                        onClick={() => removeGoal(goal.id)}
                                        className="text-slate-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                            </div>

                            {/* Decorative Glow */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                        </div>
                    );
                })}

                {/* Empty State */}
                {goals.length === 0 && !showForm && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-[3rem] opacity-50 hover:opacity-100 transition-opacity cursor-pointer group" onClick={() => setShowForm(true)}>
                        <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                            <Plus size={32} className="text-slate-600 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-500">Dein Vision Board ist leer.</h3>
                        <p className="text-slate-600">Starte jetzt und definiere dein erstes großes Ziel.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Goals;
