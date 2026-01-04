import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListTodo, Plus, Trash2, Check, AlertCircle, Clock, RotateCw, Calendar } from 'lucide-react';

const Tasks = () => {
    const { tasks, addTask, removeTask, toggleTask, recurringTasks, addRecurringTask, removeRecurringTask } = useApp();
    const [newTask, setNewTask] = useState('');
    const [isHighPriority, setIsHighPriority] = useState(false);

    // Recurring Task State
    const [isRecurringMode, setIsRecurringMode] = useState(false);
    const [reminderDay, setReminderDay] = useState('Montag');
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        if (isRecurringMode) {
            addRecurringTask({ text: newTask, dayOfWeek: reminderDay });
        } else {
            addTask(newTask, isHighPriority ? 'high' : 'normal');
        }

        setNewTask('');
        setIsHighPriority(false);
        // Keep recurring mode open if used, or optional reset: setIsRecurringMode(false);
    };

    const activeTasks = tasks.filter(t => !t.done);
    const completedTasks = tasks.filter(t => t.done);

    return (
        <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-black text-white flex items-center">
                    <ListTodo className="mr-3 text-primary" strokeWidth={2.5} />
                    Meine Aufgaben
                </h2>
                <p className="text-slate-400 mt-1 font-medium">Behalte den Überblick und bleib produktiv.</p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleAdd} className="bg-slate-900/50 p-2 md:p-4 rounded-3xl border border-slate-800 shadow-xl flex flex-col gap-4 relative z-10">
                <div className="flex-1 w-full relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder={isRecurringMode ? "Wöchentliche Aufgabe (z.B. Müll raus)" : "Neue einmalige Aufgabe..."}
                        className={`w-full rounded-2xl px-6 py-4 font-bold outline-none border-2 transition-all placeholder-slate-500 text-white ${isRecurringMode ? 'bg-slate-900 border-primary/30 focus:border-primary' : 'bg-slate-900 border-transparent focus:border-slate-700'}`}
                        autoFocus
                    />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-3 w-full justify-between px-2 md:px-0">
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {/* Mode Toggle */}
                        <button
                            type="button"
                            onClick={() => setIsRecurringMode(!isRecurringMode)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${isRecurringMode ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        >
                            <RotateCw size={16} />
                            <span>Wöchentlich</span>
                        </button>

                        {isRecurringMode ? (
                            <select
                                value={reminderDay}
                                onChange={e => setReminderDay(e.target.value)}
                                className="bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold outline-none border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors"
                            >
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsHighPriority(!isHighPriority)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${isHighPriority ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                            >
                                <AlertCircle size={16} />
                                <span>Wichtig</span>
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!newTask.trim()}
                        className={`p-4 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-lg disabled:opacity-50 disabled:scale-100 flex-shrink-0 w-full md:w-auto flex justify-center ${isRecurringMode ? 'bg-primary text-white' : 'bg-white text-black'}`}
                    >
                        {isRecurringMode ? <RotateCw size={24} /> : <Plus size={24} />}
                    </button>
                </div>
            </form>

            {/* Tasks List */}
            <div className="space-y-6">

                {/* Active Tasks */}
                <div className="space-y-3">
                    {activeTasks.length === 0 && completedTasks.length === 0 && recurringTasks.length === 0 && (
                        <div className="text-center py-12 opacity-30">
                            <ListTodo size={48} className="mx-auto mb-4 text-slate-500" />
                            <p className="font-bold text-slate-500">Alles erledigt! Entspann dich.</p>
                        </div>
                    )}

                    {activeTasks.map(task => (
                        <div
                            key={task.id}
                            className={`bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm hover:border-primary/20 transition-all group flex items-center justify-between animate-slideDown ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <button
                                    onClick={() => toggleTask(task.id)}
                                    className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-transparent hover:border-primary hover:text-primary transition-all flex-shrink-0"
                                >
                                    <Check size={14} strokeWidth={4} />
                                </button>
                                <span className={`font-bold text-slate-200 text-lg ${task.priority === 'high' ? 'text-red-400' : ''}`}>
                                    {task.text}
                                </span>
                            </div>
                            <button
                                onClick={() => removeTask(task.id)}
                                className="text-slate-600 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Recurring Tasks Section */}
                {recurringTasks.length > 0 && (
                    <div className="pt-6 mt-6">
                        <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-4 pl-2 flex items-center">
                            <RotateCw size={12} className="mr-2" />
                            Wöchentliche Routine
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {recurringTasks.map(task => (
                                <div key={task.id} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                            <Calendar size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{task.text}</p>
                                            <p className="text-[10px] text-primary font-bold uppercase mt-0.5">{task.dayOfWeek}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeRecurringTask(task.id)}
                                        className="text-slate-600 hover:text-red-400 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                    <div className="pt-8 border-t border-slate-800/50">
                        <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 pl-2">Erledigt</h3>
                        <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                            {completedTasks.map(task => (
                                <div key={task.id} className="bg-slate-900/30 p-4 rounded-xl flex items-center justify-between group border border-transparent hover:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className="w-6 h-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-green-500 transition-all flex-shrink-0"
                                        >
                                            <Check size={14} strokeWidth={4} />
                                        </button>
                                        <span className="font-medium text-slate-500 line-through">
                                            {task.text}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeTask(task.id)}
                                        className="text-slate-600 hover:text-red-400 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
