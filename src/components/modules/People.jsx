import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, User, Gift, Calendar, Phone, Trash2, Heart, Briefcase, Smile, MoreHorizontal, Search, Send, StickyNote } from 'lucide-react';

const People = () => {
    const { people, addPerson, removePerson, addPersonNote, removePersonNote } = useApp();
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState('friend'); // friend, family, work
    const [birthday, setBirthday] = useState('');
    const [initialNote, setInitialNote] = useState('');

    // Inline Note State
    const [newNoteInputs, setNewNoteInputs] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        addPerson({
            name,
            role,
            birthday,
            note: initialNote, // Will be converted to array in context
            avatarSeed: name + Date.now()
        });

        setName('');
        setRole('friend');
        setBirthday('');
        setInitialNote('');
        setShowForm(false);
    };

    const handleAddNote = (personId) => {
        const text = newNoteInputs[personId];
        if (!text) return;
        addPersonNote(personId, text);
        setNewNoteInputs(prev => ({ ...prev, [personId]: '' }));
    };

    const roleConfig = {
        friend: { label: 'Freunde', color: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20', icon: <Smile size={16} /> },
        family: { label: 'Familie', color: 'bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20', icon: <Heart size={16} /> },
        work: { label: 'Arbeit', color: 'bg-orange-500/10 text-orange-400 ring-1 ring-orange-500/20', icon: <Briefcase size={16} /> },
        other: { label: 'Sonstiges', color: 'bg-slate-800 text-slate-400 ring-1 ring-slate-700', icon: <User size={16} /> }
    };

    const filteredPeople = people.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.notes && p.notes.some(n => n.text.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
            {/* Header with Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center">
                        <Users className="mr-3 text-primary" strokeWidth={2.5} />
                        Meine Leute
                    </h2>
                    <p className="text-slate-400 mt-1 font-medium">Verwalte Kontakte, Geburtstage & Notizen.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 group">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Suchen..."
                            className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-3 rounded-2xl shadow-sm focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-medium text-sm transition-all"
                        />
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary text-white px-4 py-3 rounded-2xl font-bold hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center justify-center flex-shrink-0"
                    >
                        <Plus size={20} className="md:mr-2" />
                        <span className="hidden md:inline">Kontakt</span>
                    </button>
                </div>
            </div>

            {/* Add Person Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl animate-slideDown grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 font-bold text-lg text-white outline-none focus:ring-2 focus:ring-primary/20 border border-slate-800 focus:border-primary/50" placeholder="Max Mustermann" autoFocus />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Beziehung</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['friend', 'family', 'work'].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setRole(r)}
                                    className={`py-3 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center space-y-1 ${role === r ? 'bg-primary/20 text-primary ring-2 ring-primary border-transparent' : 'bg-slate-950 text-slate-500 border border-slate-800 hover:bg-slate-800 hover:text-white'}`}
                                >
                                    {roleConfig[r].icon}
                                    <span>{roleConfig[r].label.split(' ')[0]}</span>
                                    {/* Using simplified label for button */}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Geburtstag (Optional)</label>
                        <input type="date" value={birthday} onChange={e => setBirthday(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 font-medium text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 border border-slate-800 focus:border-primary/50" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Erste Notiz</label>
                        <input type="text" value={initialNote} onChange={e => setInitialNote(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 font-medium text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 border border-slate-800 focus:border-primary/50 placeholder-slate-600" placeholder="Trinkt gerne Kaffee mit Hafermilch..." />
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 shadow-lg transition-transform active:scale-[0.99]">Speichern</button>
                    </div>
                </form>
            )}

            {/* People Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {people.length === 0 ? (
                    <div className="col-span-full text-center py-16 opacity-30">
                        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users size={48} className="text-slate-600" />
                        </div>
                        <p className="font-bold text-slate-500 text-lg">Keine Kontakte vorhanden.</p>
                        <p className="text-sm text-slate-500">Füge deine Freunde und Familie hinzu.</p>
                    </div>
                ) : filteredPeople.length === 0 ? (
                    <div className="col-span-full text-center py-12 opacity-30">
                        <p className="font-bold text-slate-500">Keine Treffer für "{searchTerm}".</p>
                    </div>
                ) : (
                    filteredPeople.map(person => (
                        <div key={person.id} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg hover:border-primary/30 transition-all group relative overflow-hidden flex flex-col">

                            {/* Role Badge */}
                            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 ${roleConfig[person.role].color}`}>
                                {roleConfig[person.role].icon}
                                <span>{roleConfig[person.role].label}</span>
                            </div>

                            {/* Header Info */}
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-slate-800 overflow-hidden border-2 border-slate-700 shadow-sm flex-shrink-0">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.avatarSeed}&backgroundColor=1e293b`}
                                        alt={person.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg text-white leading-tight">{person.name}</h3>
                                    {person.birthday && (
                                        <div className="text-xs text-slate-400 font-medium flex items-center mt-1">
                                            <Calendar size={12} className="mr-1 text-primary" />
                                            {new Date(person.birthday).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Notes List */}
                            <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-40 pr-2 custom-scrollbar">
                                {person.notes && person.notes.length > 0 ? (
                                    person.notes.map((note) => (
                                        <div key={note.id} className="bg-slate-950 rounded-xl p-3 text-xs text-slate-300 font-medium relative group/note flex justify-between items-start border border-slate-800/50">
                                            <div className="flex-1">
                                                <div className="flex items-start">
                                                    <StickyNote size={12} className="mr-2 mt-0.5 text-slate-600 flex-shrink-0" />
                                                    <span className="leading-relaxed">{note.text}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-600 block mt-1 ml-5">{note.date}</span>
                                            </div>
                                            <button
                                                onClick={() => removePersonNote(person.id, note.id)}
                                                className="text-slate-600 hover:text-red-400 opacity-0 group-hover/note:opacity-100 transition-opacity p-0.5 ml-1"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center text-xs text-slate-600 py-2 border-2 border-dashed border-slate-800 rounded-xl">Keine Notizen</div>
                                )}
                            </div>

                            {/* Add Note Input */}
                            <div className="relative mt-auto pt-2">
                                <input
                                    type="text"
                                    value={newNoteInputs[person.id] || ''}
                                    onChange={(e) => setNewNoteInputs(prev => ({ ...prev, [person.id]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote(person.id)}
                                    placeholder="Notiz hinzufügen..."
                                    className="w-full bg-slate-950 text-white text-xs px-3 py-3 pr-8 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-slate-800 focus:border-primary/50 placeholder-slate-600"
                                />
                                <button
                                    onClick={() => handleAddNote(person.id)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    <Send size={12} />
                                </button>
                            </div>

                            {/* Delete Action */}
                            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => { if (confirm('Kontakt löschen?')) removePerson(person.id) }}
                                    className="p-2 bg-slate-800/80 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl backdrop-blur-sm transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default People;
