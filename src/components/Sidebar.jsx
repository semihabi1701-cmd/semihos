import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
    LayoutDashboard,
    Wallet,
    CheckSquare,
    Clock,
    Book,
    ShoppingCart,
    MapPin,
    Target,
    Users,
    Calendar,
    Search,
    CreditCard
} from 'lucide-react';

const Sidebar = () => {
    const { activeTab, setActiveTab } = useApp();
    const [searchTerm, setSearchTerm] = useState('');

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard' },
        { icon: Wallet, label: 'Finanzen' },
        { icon: CheckSquare, label: 'Tasks' },
        { icon: Clock, label: 'Arbeit' },
        { icon: Book, label: 'Tagebuch' },
        { icon: ShoppingCart, label: 'Einkauf' },
        { icon: MapPin, label: 'Orte' },
        { icon: Target, label: 'Ziele' },
        { icon: CreditCard, label: 'Abos' },
        { icon: Users, label: 'Leute' },
        { icon: Calendar, label: 'Kalender' },
    ];

    const filteredItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col p-6 fixed left-0 top-0 overflow-y-auto z-50 transition-colors duration-300">
            {/* User Profile */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-primary ring-4 ring-slate-800 shadow-xl">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Semih&backgroundColor=1e293b" alt="Semih" className="w-20 h-20 rounded-full" />
                </div>
                <h2 className="text-white font-black text-xl tracking-wide">SemihOS</h2>
            </div>

            {/* Smart Search */}
            <div className="mb-6 relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Smart Search..."
                    className="w-full bg-slate-800 text-sm text-white pl-10 pr-4 py-3 rounded-2xl border border-slate-700 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-all placeholder-slate-500"
                />
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div
                            key={item.label}
                            onClick={() => {
                                setActiveTab(item.label);
                                setSearchTerm('');
                            }}
                            className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 group ${activeTab === item.label ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-x-1' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <item.icon size={20} className={activeTab === item.label ? 'animate-bounce-subtle' : 'group-hover:scale-110 transition-transform'} />
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-500 text-sm py-8 border border-dashed border-slate-800 rounded-xl">
                        Nichts gefunden.
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;
