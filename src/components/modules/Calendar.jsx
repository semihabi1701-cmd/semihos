import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Book, DollarSign, MapPin, Gift } from 'lucide-react';

const Calendar = () => {
    const { workHours, debts, diaryEntries, places, recurringTasks, people } = useApp();
    const [currentDate, setCurrentDate] = useState(new Date());

    const monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => {
        // 0 = Sunday, 1 = Monday... we want Monday as start (0)
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Helper to check for events on a specific day
    const getEventsForDay = (day) => {
        const events = [];
        const currentDayDate = new Date(year, month, day);
        const dateStr = currentDayDate.toLocaleDateString('de-DE'); // DD.MM.YYYY
        const dayOfWeek = currentDayDate.toLocaleDateString('de-DE', { weekday: 'long' });

        // Work Hours
        workHours.forEach(w => {
            const wDate = new Date(w.timestamp).toLocaleDateString('de-DE');
            if (wDate === dateStr) events.push({ type: 'work', title: `${w.hours}h Arbeit` });
        });

        // Diary
        diaryEntries.forEach(d => {
            if (d.date === dateStr) events.push({ type: 'diary', title: 'Tagebuch' });
        });

        // Debts (Due Date) -- format usually DD.MM.YYYY
        debts.forEach(d => {
            if (d.dueDate === dateStr) events.push({ type: 'debt', title: `Fällig: ${d.creditor}` });
        });

        // Recurring Tasks
        recurringTasks.forEach(t => {
            if (t.dayOfWeek === dayOfWeek) events.push({ type: 'recurring', title: t.text });
        });

        // Birthdays
        people.forEach(p => {
            if (p.birthday) {
                const bDate = new Date(p.birthday);
                // Check if day and month match
                if (bDate.getDate() === day && bDate.getMonth() === month) {
                    const age = year - bDate.getFullYear();
                    events.push({ type: 'birthday', title: `${p.name} (${age})` });
                }
            }
        });

        return events;
    };

    const renderCalendarGrid = () => {
        const slots = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            slots.push(<div key={`empty-${i}`} className="h-24 md:h-32 bg-slate-900/30 border border-slate-800 rounded-xl"></div>);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const events = getEventsForDay(day);

            slots.push(
                <div key={day} className={`h-24 md:h-32 border border-slate-800 rounded-xl p-2 flex flex-col relative transition-all hover:bg-slate-800/50 hover:border-primary/20 ${isToday ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-slate-900'}`}>
                    <span className={`text-sm font-bold mb-1 ${isToday ? 'text-primary' : 'text-slate-500'}`}>{day}</span>

                    <div className="flex-1 overflow-y-auto space-y-1 custom-scrollbar">
                        {events.map((ev, idx) => (
                            <div key={idx} className={`text-[10px] px-1.5 py-0.5 rounded-md truncate font-medium flex items-center
                                ${ev.type === 'work' ? 'bg-blue-500/10 text-blue-400' : ''}
                                ${ev.type === 'diary' ? 'bg-purple-500/10 text-purple-400' : ''}
                                ${ev.type === 'debt' ? 'bg-red-500/10 text-red-400' : ''}
                                ${ev.type === 'recurring' ? 'bg-orange-500/10 text-orange-400' : ''}
                                ${ev.type === 'birthday' ? 'bg-pink-500/10 text-pink-400' : ''}
                            `}>
                                {ev.type === 'work' && <Clock size={8} className="mr-1" />}
                                {ev.type === 'diary' && <Book size={8} className="mr-1" />}
                                {ev.type === 'debt' && <DollarSign size={8} className="mr-1" />}
                                {ev.type === 'recurring' && <CalendarIcon size={8} className="mr-1" />}
                                {ev.type === 'birthday' && <Gift size={8} className="mr-1" />}
                                {ev.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return slots;
    };

    return (
        <div className="animate-fadeIn max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center">
                        <CalendarIcon className="mr-3 text-primary" strokeWidth={2.5} />
                        Dein Kalender
                    </h2>
                    <p className="text-slate-400 mt-1 font-medium">Alle Termine, Schichten & Erinnerungen im Blick.</p>
                </div>

                <div className="flex items-center space-x-4 bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-800">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"><ChevronLeft size={20} /></button>
                    <span className="font-bold text-lg min-w-[140px] text-center text-white">{monthNames[month]} {year}</span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors"><ChevronRight size={20} /></button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex gap-4 text-xs font-bold text-slate-500">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Arbeit</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Wochen-Aufgabe</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>Tagebuch</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>Fälligkeit</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-pink-500 mr-2"></span>Geburtstag</div>
            </div>

            {/* Grid */}
            <div className="bg-slate-900/50 p-6 rounded-3xl shadow-lg border border-slate-800">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                    {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                        <div key={d} className="text-center text-xs font-black text-slate-600 uppercase tracking-wider">{d}</div>
                    ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-2">
                    {renderCalendarGrid()}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
