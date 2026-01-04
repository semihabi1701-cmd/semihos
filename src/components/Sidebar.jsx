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
    const { activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
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
        <>
            {/* Mobile Overlay with Blur */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-md animate-fadeIn"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Premium Sidebar */}
            <div className={`
                w-[280px] h-[100dvh] bg-slate-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col p-6 pb-24
                fixed left-0 top-0 overflow-y-auto z-50 shadow-2xl transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)
                md:translate-x-0 md:w-64 md:h-screen md:pb-6
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* User Profile Area */}
                <div className="flex flex-col items-center mb-10 pt-4 md:pt-0">
                    <div className="group relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-slate-700 p-1 mb-4 shadow-2xl ring-1 ring-white/10">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Semih&backgroundColor=1e293b" alt="Semih" className="w-full h-full rounded-full bg-slate-900" />
                        </div>
                        <div className="absolute bottom-0 right-1 w-6 h-6 bg-green-500 border-4 border-slate-900 rounded-full"></div>
                    </div>
                    <h2 className="text-white font-black text-2xl tracking-tight">SemihOS</h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Personal Dashboard</p>
                </div>

                {/* Smart Search */}
                <div className="mb-8 relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Suchen..."
                        className="w-full bg-black/30 text-sm text-white pl-10 pr-4 py-3.5 rounded-2xl border border-white/5 focus:border-indigo-500/50 focus:bg-black/50 focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium transition-all placeholder-slate-600"
                    />
                </div>

                {/* Navigation List */}
                <nav className="space-y-1.5 flex-1">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => {
                            const isActive = activeTab === item.label;
                            return (
                                <div
                                    key={item.label}
                                    onClick={() => {
                                        setActiveTab(item.label);
                                        setSearchTerm('');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`
                                        flex items-center space-x-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden
                                        ${isActive
                                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                        }
                                    `}
                                >
                                    {/* Active Glow Bar */}
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30"></div>}

                                    <item.icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                    />
                                    <span className={`font-bold text-[15px] tracking-wide ${isActive ? 'translate-x-1' : ''} transition-transform duration-300`}>
                                        {item.label}
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-slate-600 text-sm py-8">
                            Keine Ergebnisse
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;
