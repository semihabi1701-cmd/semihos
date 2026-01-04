import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Book, Plus, Smile, Meh, Frown, Trash2, Calendar, Star, PenTool, Sparkles, X, Quote } from 'lucide-react';

const Diary = () => {
    const { diaryEntries, addDiaryEntry, removeDiaryEntry, updateDiaryEntry } = useApp();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [mood, setMood] = useState('neutral'); // good, neutral, bad

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !content) return;

        if (editingId) {
            updateDiaryEntry(editingId, { title, content, mood });
            setEditingId(null);
        } else {
            addDiaryEntry({ title, content, mood });
        }

        // Reset
        setTitle('');
        setContent('');
        setMood('neutral');
        setShowForm(false);
    };

    const startEditing = (entry) => {
        setTitle(entry.title);
        setContent(entry.content);
        setMood(entry.mood);
        setEditingId(entry.id);
        setShowForm(true);
        // Scroll to top or form if needed
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const moodConfig = {
        good: {
            icon: <Smile size={24} weight="fill" />,
            label: 'Super',
            color: 'from-emerald-500 to-teal-500',
            bg: 'bg-emerald-500/10',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20'
        },
        neutral: {
            icon: <Meh size={24} weight="fill" />,
            label: 'Okay',
            color: 'from-blue-500 to-indigo-500',
            bg: 'bg-blue-500/10',
            text: 'text-blue-400',
            border: 'border-blue-500/20'
        },
        bad: {
            icon: <Frown size={24} weight="fill" />,
            label: 'Nicht so',
            color: 'from-rose-500 to-pink-500',
            bg: 'bg-rose-500/10',
            text: 'text-rose-400',
            border: 'border-rose-500/20'
        }
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-10">

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 to-slate-900 border border-indigo-500/20 p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-white flex items-center tracking-tight mb-3">
                            <span className="bg-indigo-500/20 p-3 rounded-2xl mr-4 border border-indigo-500/30 text-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                <Book size={32} strokeWidth={2.5} />
                            </span>
                            Dein Journal
                        </h2>
                        <p className="text-indigo-200/60 font-medium text-lg max-w-lg leading-relaxed">
                            Ein sicherer Ort für deine Gedanken, Ideen und Gefühle. Reflektiere deinen Tag und wachse über dich hinaus.
                        </p>
                    </div>

                    <button
                        onClick={() => { setShowForm(!showForm); setEditingId(null); setTitle(''); setContent(''); setMood('neutral'); }}
                        className="bg-white text-indigo-950 px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 border border-white/20 backdrop-blur-md"
                    >
                        {showForm ? <X size={22} /> : <PenTool size={22} />}
                        <span>{showForm ? 'Abbrechen' : 'Eintrag schreiben'}</span>
                    </button>
                </div>
            </div>

            {/* Entry Form */}
            {showForm && (
                <div className="relative z-20 animate-slideDown">
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent rounded-[3rem] blur-xl -z-10"></div>
                    <form onSubmit={handleSubmit} className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-slate-700 shadow-2xl relative overflow-hidden">

                        <div className="space-y-6 relative z-10">
                            {/* Input Group */}
                            <div>
                                <label className="block text-slate-400 font-bold mb-2 ml-2 text-xs uppercase tracking-widest">Titel deines Eintrags</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Über was denkst du nach?"
                                    className="w-full bg-slate-950/50 border border-slate-700 rounded-2xl px-6 py-5 text-xl font-bold text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder-slate-600 shadow-inner"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-slate-400 font-bold mb-2 ml-2 text-xs uppercase tracking-widest">Deine Gedanken</label>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Lass alles raus..."
                                    className="w-full h-48 resize-none bg-slate-950/50 border border-slate-700 rounded-2xl px-6 py-5 text-lg font-medium text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder-slate-600 shadow-inner leading-relaxed"
                                ></textarea>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-4 border-t border-slate-800/50">

                                {/* Mood Selector */}
                                <div className="flex items-center space-x-4 bg-slate-950/50 p-2 rounded-2xl border border-slate-800">
                                    {Object.entries(moodConfig).map(([key, config]) => (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => setMood(key)}
                                            className={`
                                                relative group flex items-center justify-center p-3 rounded-xl transition-all duration-300
                                                ${mood === key ? `bg-gradient-to-br ${config.color} text-white shadow-lg scale-110` : 'text-slate-500 hover:bg-slate-800'}
                                            `}
                                        >
                                            {config.icon}
                                            {mood === key && <span className="absolute -bottom-8 text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded-md animate-fadeIn whitespace-nowrap border border-slate-700">{config.label}</span>}
                                        </button>
                                    ))}
                                </div>

                                <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/25 active:scale-95 w-full md:w-auto flex items-center justify-center space-x-2">
                                    <Sparkles size={20} />
                                    <span>{editingId ? 'Änderungen speichern' : 'Eintrag speichern'}</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Entries Grid */}
            <div className="grid grid-cols-1 gap-6">
                {diaryEntries.length === 0 && !showForm ? (
                    <div className="text-center py-24 opacity-60 flex flex-col items-center">
                        <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl border border-slate-800">
                            <Quote size={40} className="text-slate-700" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-600 mb-2">Noch leer hier.</h3>
                        <p className="text-slate-500 font-medium max-w-md">Dein Journal wartet auf deinen ersten Eintrag. Der erste Schritt ist immer der wichtigste.</p>
                    </div>
                ) : (
                    diaryEntries.map(entry => {
                        const style = moodConfig[entry.mood] || moodConfig.neutral;
                        return (
                            <div key={entry.id} className="group relative bg-slate-900/40 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 hover:border-white/10 transition-all hover:bg-slate-900/60 shadow-xl hover:shadow-2xl overflow-hidden">
                                {/* Side Mood Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${style.color} opacity-80`}></div>

                                <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                    {/* Date & Mood */}
                                    <div className="flex md:flex-col items-center md:items-start justify-between md:justify-start gap-4 min-w-[140px] border-b md:border-b-0 md:border-r border-slate-800 pb-4 md:pb-0 md:pr-6">
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center text-slate-400 font-bold mb-1">
                                                <Calendar size={14} className="mr-2 text-indigo-500" />
                                                <span className="text-sm tracking-wide">{entry.date}</span>
                                            </div>
                                            <div className="text-xs text-slate-600 font-mono">
                                                {new Date(entry.id).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                                            </div>
                                        </div>

                                        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
                                            {style.icon}
                                            <span className="text-xs font-bold uppercase tracking-wider">{style.label}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-indigo-200 transition-colors">
                                            {entry.title}
                                        </h3>
                                        <p className="text-slate-300 leading-relaxed text-lg font-light whitespace-pre-wrap">
                                            {entry.content}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col justify-end gap-2">
                                        <button
                                            onClick={() => startEditing(entry)}
                                            className="p-3 text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                            title="Bearbeiten"
                                        >
                                            <PenTool size={20} />
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Wirklich löschen?')) removeDiaryEntry(entry.id) }}
                                            className="p-3 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                                            title="Löschen"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Diary;
