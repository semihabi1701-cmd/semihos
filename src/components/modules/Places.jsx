import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MapPin, Plus, Navigation, Star, Heart, Coffee, Home, Trash2, Search, ExternalLink } from 'lucide-react';

const Places = () => {
    const { places, addPlace, removePlace } = useApp();
    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [category, setCategory] = useState('favorite'); // favorite, food, home

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;
        addPlace({ name, address, category });
        setName('');
        setAddress('');
        setCategory('favorite');
        setShowForm(false);
    };

    const handleGoogleSearch = () => {
        const query = address || name;
        if (!query) return;
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
    };

    const categoryIcons = {
        favorite: <Star size={20} />,
        food: <Coffee size={20} />,
        home: <Home size={20} />
    };

    const categoryColors = {
        favorite: 'bg-yellow-500/10 text-yellow-500 ring-1 ring-yellow-500/20',
        food: 'bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20',
        home: 'bg-purple-500/10 text-purple-500 ring-1 ring-purple-500/20'
    };

    return (
        <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center">
                        <MapPin className="mr-3 text-primary" strokeWidth={2.5} />
                        Meine Orte
                    </h2>
                    <p className="text-slate-400 mt-1 font-medium">Mit Google Maps Anbindung.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-dark hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center space-x-2"
                >
                    <Plus size={20} />
                    <span>Ort hinzufügen</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl animate-slideDown grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Name des Ortes</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 font-bold text-white outline-none focus:ring-2 focus:ring-primary/20 border border-slate-800" placeholder="z.B. Lieblingscafé" autoFocus />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adresse / Notiz</label>
                        <div className="flex space-x-2">
                            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-950 rounded-xl px-4 py-3 font-medium text-slate-300 outline-none focus:ring-2 focus:ring-primary/20 border border-slate-800" placeholder="Musterstraße 1, 12345 Berlin" />
                            <button
                                type="button"
                                onClick={handleGoogleSearch}
                                className="bg-blue-500/10 text-blue-500 px-4 rounded-xl font-bold hover:bg-blue-500/20 transition-colors flex items-center border border-blue-500/20"
                                title="Auf Google Maps suchen"
                            >
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2 flex justify-between items-center mt-2">
                        <div className="flex space-x-2">
                            <button type="button" onClick={() => setCategory('favorite')} className={`p-3 rounded-xl transition-all ${category === 'favorite' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20 scale-105' : 'bg-slate-950 text-slate-500 hover:bg-slate-800'}`}><Star size={20} /></button>
                            <button type="button" onClick={() => setCategory('food')} className={`p-3 rounded-xl transition-all ${category === 'food' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105' : 'bg-slate-950 text-slate-500 hover:bg-slate-800'}`}><Coffee size={20} /></button>
                            <button type="button" onClick={() => setCategory('home')} className={`p-3 rounded-xl transition-all ${category === 'home' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20 scale-105' : 'bg-slate-950 text-slate-500 hover:bg-slate-800'}`}><Home size={20} /></button>
                        </div>
                        <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-gray-200 shadow-lg">Speichern</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {places.length === 0 ? (
                    <div className="col-span-full text-center py-12 opacity-30">
                        <MapPin size={48} className="mx-auto mb-4 text-slate-600" />
                        <p className="font-bold text-slate-500">Noch keine Orte gespeichert.</p>
                    </div>
                ) : (
                    places.map(place => (
                        <div key={place.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg hover:border-primary/30 transition-all flex items-center justify-between group">
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${categoryColors[place.category] || 'bg-slate-800'}`}>
                                    {categoryIcons[place.category]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center">
                                        {place.name}
                                    </h3>
                                    {place.address && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-blue-400 font-bold mt-0.5 flex items-center hover:text-blue-300 transition-colors"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Navigation size={12} className="mr-1" />
                                            Google Maps öffnen
                                        </a>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => removePlace(place.id)}
                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Places;
