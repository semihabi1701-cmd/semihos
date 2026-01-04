import React from 'react';
import Sidebar from './Sidebar';
import { useApp } from '../context/AppContext';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
    const { setIsMobileMenuOpen } = useApp();

    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100 flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900/95 backdrop-blur-md p-4 flex items-center justify-between border-b border-slate-800/50 sticky top-0 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 -ml-2 text-slate-300 hover:text-white transition-colors active:scale-95"
                >
                    <Menu size={28} strokeWidth={2} />
                </button>

                <span className="font-bold text-lg text-white">SemihOS</span>

                <div className="w-8"></div> {/* Spacer for centering */}
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
