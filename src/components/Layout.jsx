import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex bg-slate-950 min-h-screen text-slate-100">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
