import React from 'react';
import { useApp } from '../../context/AppContext';
import { ListTodo, Wallet } from 'lucide-react';

const Header = () => {
    const { tasks, availableFunds } = useApp();
    const openTasks = tasks.filter(t => !t.done).length;

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative">
            <div>
                <h1 className="text-3xl font-black text-white">Moin Semih! 👋</h1>
                <p className="text-slate-400 font-medium">Lass uns heute produktiv sein.</p>
            </div>

            <div className="flex items-center gap-4">

                {/* Stats */}
                <div className="flex space-x-4">
                    <div className="bg-slate-900 px-4 py-2 rounded-2xl flex items-center space-x-3 border border-slate-800 shadow-sm">
                        <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                            <ListTodo size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tasks</p>
                            <p className="font-black text-white">{openTasks} Offen</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 px-4 py-2 rounded-2xl flex items-center space-x-3 border border-slate-800 shadow-sm">
                        <div className="bg-green-500/10 p-2 rounded-xl text-green-500">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Verfügbar</p>
                            <p className={`font-black ${availableFunds < 0 ? 'text-red-400' : 'text-white'}`}>
                                {availableFunds.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
