import React from 'react';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const { setIsMobileMenuOpen } = useApp();

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100 flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">S</div>
                    <span className="font-bold">SemihOS</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 bg-slate-800 rounded-lg text-white hover:bg-slate-700 transition"
                >
                    <Menu size={24} />
                </button>
            </div>

            <Sidebar />

            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto pt-4 md:pt-8 relative z-0">
                <div className="max-w-6xl mx-auto space-y-6 pb-24 md:pb-0">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
