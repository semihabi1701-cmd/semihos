import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ShoppingCart, Plus, Trash2, Check, Package, Coffee, Home, HelpCircle, Sparkles, X, ChevronRight, Search, Loader2, Image as ImageIcon } from 'lucide-react';

const Shopping = () => {
    const { shoppingList, addShoppingItem, removeShoppingItem, toggleShoppingItem } = useApp();
    const [newItem, setNewItem] = useState('');
    const [category, setCategory] = useState('food');

    // Search State
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchTimeout = useRef(null);

    const handleSearch = (query) => {
        setNewItem(query);
        setShowResults(true);

        if (searchTimeout.current) clearTimeout(searchTimeout.current);

        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        searchTimeout.current = setTimeout(async () => {
            try {
                // Fetch more results (50) to allow for strict filtering
                const response = await fetch(`https://de.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=50&fields=product_name,image_front_small_url,image_url,brands,stores,_id`);
                const data = await response.json();

                if (data.products) {
                    const targetStores = ['rewe', 'edeka', 'kaufland', 'aldi', 'lidl', 'netto', 'penny', 'dm', 'rossmann', 'mueller', 'hit', 'globus', 'norma'];

                    const filtered = data.products
                        .filter(p => {
                            // 1. Must have name & image
                            if (!p.product_name || !(p.image_front_small_url || p.image_url)) return false;

                            // 2. Must be from target stores (if stores field exists)
                            // If stores is empty/null, we might exclude it to be strict, or include if we are desperate.
                            // User said "nur von...", so we strictly check inclusion.
                            if (!p.stores) return false;
                            const pStores = p.stores.toLowerCase();
                            return targetStores.some(store => pStores.includes(store));
                        })
                        .map(p => ({
                            name: p.product_name,
                            image: p.image_front_small_url || p.image_url, // prefer small for speed
                            brand: p.brands ? p.brands.split(',')[0] : '',
                            stores: p.stores,
                            id: p._id
                        }))
                        .slice(0, 8); // Top 8 matches

                    setSearchResults(filtered);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 500); // Debounce
    };

    const addProduct = (product) => {
        addShoppingItem({
            text: product.name || newItem,
            category,
            image: product.image
        });
        setNewItem('');
        setSearchResults([]);
        setShowResults(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newItem) return;
        addShoppingItem({ text: newItem, category });
        setNewItem('');
        setShowResults(false);
    };


    const categories = {
        food: {
            label: 'Lebensmittel',
            icon: <Coffee size={24} />,
            color: 'from-orange-500/20 to-amber-500/20',
            text: 'text-orange-400',
            border: 'border-orange-500/20'
        },
        drugstore: {
            label: 'Drogerie',
            icon: <Package size={24} />,
            color: 'from-purple-500/20 to-pink-500/20',
            text: 'text-purple-400',
            border: 'border-purple-500/20'
        },
        household: {
            label: 'Haushalt',
            icon: <Home size={24} />,
            color: 'from-blue-500/20 to-cyan-500/20',
            text: 'text-blue-400',
            border: 'border-blue-500/20'
        },
        other: {
            label: 'Sonstiges',
            icon: <Sparkles size={24} />,
            color: 'from-emerald-500/20 to-teal-500/20',
            text: 'text-emerald-400',
            border: 'border-emerald-500/20'
        }
    };

    // Calculate progress (simplified stats)
    const totalItems = shoppingList.length;
    const completedItems = shoppingList.filter(i => i.completed).length;

    // Group items by category for display
    const getItemsByCategory = (catKey) => shoppingList.filter(item => item.category === catKey);

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-10" onClick={() => setShowResults(false)}>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-white flex items-center tracking-tight mb-2">
                            <span className="bg-primary/20 p-2 rounded-2xl mr-4 border border-primary/20">
                                <ShoppingCart className="text-primary" size={32} strokeWidth={2.5} />
                            </span>
                            Einkaufsliste
                        </h2>
                        <p className="text-slate-400 font-medium text-lg">
                            {totalItems === 0
                                ? "Alles erledigt! Entspann dich."
                                : `${totalItems - completedItems} offene Dinge zu besorgen.`}
                        </p>
                    </div>

                    {totalItems > 0 && (
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-md w-full md:w-auto">
                            <div className="text-right">
                                <span className="text-sm font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Offen</span>
                                <span className="text-3xl font-black text-white">{totalItems - completedItems}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Input & Search Area */}
            <div className="relative z-30" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="bg-slate-900 p-2 rounded-[2rem] border border-slate-700 shadow-xl flex flex-col md:flex-row items-center gap-2 pr-2 shadow-black/50 relative z-20">
                    <div className="flex-1 w-full pl-4 relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => { if (newItem) setShowResults(true) }}
                            placeholder="Produkt suchen (z.B. Nutella)..."
                            className="w-full bg-transparent py-4 pl-10 font-bold text-xl text-white outline-none placeholder-slate-600"
                            autoFocus
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-primary" size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex bg-slate-950 p-1.5 rounded-[1.5rem] border border-slate-800 w-full md:w-auto overflow-x-auto no-scrollbar">
                        {Object.entries(categories).map(([key, info]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setCategory(key)}
                                className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${category === key ? 'bg-slate-800 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'}`}
                            >
                                {info.icon}
                                <span className="hidden md:inline">{info.label}</span>
                            </button>
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary-light text-white p-4 rounded-[1.5rem] transition-all shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 flex items-center justify-center w-full md:w-auto shrink-0"
                    >
                        <Plus size={28} strokeWidth={3} />
                    </button>
                </form>

                {/* Search Results Dropdown */}
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-slideDown z-10 max-h-[400px] overflow-y-auto custom-scrollbar">
                        <div className="p-4 grid gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase px-2 mb-2">Gefundene Produkte</div>
                            {searchResults.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => addProduct(product)}
                                    className="flex items-center p-3 hover:bg-slate-800 rounded-2xl transition-colors text-left group w-full"
                                >
                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden border border-slate-700">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <ImageIcon className="text-slate-300" />
                                        )}
                                    </div>
                                    <div className="ml-4 overflow-hidden flex-1">
                                        <div className="font-bold text-white text-lg group-hover:text-primary transition-colors truncate">{product.name}</div>
                                        <div className="text-xs text-slate-400 font-medium flex items-center flex-wrap gap-1">
                                            {product.brand && <span className="text-primary bg-primary/10 px-1.5 rounded">{product.brand}</span>}
                                            {/* Show matched store snippets */}
                                            {product.stores && <span className="text-emerald-400 bg-emerald-500/10 px-1.5 rounded truncate max-w-[150px]">{product.stores}</span>}
                                        </div>
                                    </div>
                                    <div className="ml-auto bg-slate-800 p-2 rounded-xl text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                                        <Plus size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                {Object.entries(categories).map(([key, info]) => {
                    const items = getItemsByCategory(key);

                    if (items.length === 0) return null;

                    return (
                        <div key={key} className={`rounded-3xl p-6 border bg-gradient-to-br ${info.color} ${info.border} backdrop-blur-sm relative group overflow-hidden transition-all hover:shadow-2xl hover:scale-[1.01] hover:border-opacity-50`}>
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6 relative z-10">
                                <div className="flex items-center space-x-3">
                                    <div className={`p-3 rounded-2xl bg-black/20 backdrop-blur-md ${info.text} shadow-inner`}>
                                        {info.icon}
                                    </div>
                                    <h3 className={`font-black text-xl tracking-wide text-white`}>
                                        {info.label}
                                    </h3>
                                </div>
                                <span className="bg-black/20 text-white/80 font-bold px-3 py-1 rounded-lg backdrop-blur text-xs border border-white/5">
                                    {items.filter(i => !i.completed).length} offen
                                </span>
                            </div>

                            {/* List */}
                            <div className="space-y-3 relative z-10">
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleShoppingItem(item.id)}
                                        className={`
                                            flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-300 group/item border relative overflow-hidden
                                            ${item.completed
                                                ? 'bg-black/10 border-transparent opacity-50'
                                                : 'bg-slate-900/60 border-white/5 hover:bg-slate-900/80 hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-4 relative z-10 w-full">
                                            {/* Checkbox */}
                                            <div className={`
                                                w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0
                                                ${item.completed ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-500 group-hover/item:border-white'}
                                            `}>
                                                {item.completed && <Check size={14} className="text-white" strokeWidth={4} />}
                                            </div>

                                            {/* Image Preview (if available) */}
                                            {item.image && (
                                                <div className="w-12 h-12 bg-white rounded-lg p-0.5 shrink-0 overflow-hidden border border-slate-600 shadow-sm">
                                                    <img src={item.image} alt={item.text} className="w-full h-full object-contain" />
                                                </div>
                                            )}

                                            {/* Text */}
                                            <span className={`text-lg font-bold truncate pr-8 transition-all flex-1 ${item.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                                {item.text}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeShoppingItem(item.id); }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 hover:bg-black/40 rounded-xl transition-all opacity-0 group-hover/item:opacity-100 z-20"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Decorative Background Icon */}
                            <div className={`absolute -bottom-6 -right-6 opacity-[0.03] text-white transform rotate-12 scale-[4]`}>
                                {info.icon}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Empty State */}
            {
                shoppingList.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 animate-pulse-slow relative z-0">
                        <div className="w-32 h-32 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-black/50 border border-slate-700">
                            <Search size={48} className="text-slate-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-600 mb-2">Was brauchst du?</h3>
                        <p className="text-slate-500 font-medium">Suche nach Produkten (z.B. "Milch")...</p>
                    </div>
                )
            }
        </div >
    );
};

export default Shopping;
