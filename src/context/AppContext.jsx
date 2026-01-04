import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Navigation State
    // Helper for Persistence
    const loadState = (key, fallback) => {
        try {
            const saved = localStorage.getItem(key);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Ensure we never return null/undefined if we have a fallback
                return parsed !== null && parsed !== undefined ? parsed : fallback;
            }
        } catch (e) {
            console.error(`Error loading state for ${key}`, e);
        }
        return fallback;
    };

    // Navigation (No need to persist usually, but can if desired)
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State

    // Data States with Persistence
    const [availableFunds, setAvailableFunds] = useState(() => loadState('availableFunds', -1000.00));
    const [income, setIncome] = useState(() => loadState('income', 2500.00));
    const [fixedCosts, setFixedCosts] = useState(() => loadState('fixedCosts', 1000.00));

    const [tasks, setTasks] = useState(() => loadState('tasks', [
        { id: 1, text: 'SemihOS fertigstellen', done: false, priority: 'high' },
        { id: 2, text: 'Einkaufen gehen', done: true, priority: 'normal' },
    ]));

    const [recurringTasks, setRecurringTasks] = useState(() => loadState('recurringTasks', []));

    const [jobSettings, setJobSettings] = useState(() => loadState('jobSettings', {
        baseRate: 16.00,
        futureRate: 17.00,
        futureRateDate: '2026-02-01',
        standardHours: 8,
    }));

    const [debts, setDebts] = useState(() => loadState('debts', [
        { id: 1, creditor: 'Sparkasse Kredit', amount: 2500.00, dueDate: '31.12.2025', category: 'Bank' },
        { id: 2, creditor: 'Klarna', amount: 300.00, dueDate: '15.02.2026', category: 'Shopping' },
        { id: 3, creditor: 'Privat (Max)', amount: 1000.00, dueDate: '01.03.2026', category: 'Privat' },
    ]));

    // Derived State
    const totalDebt = debts.reduce((sum, debt) => sum + (parseFloat(debt.amount) || 0), 0);

    const [workHours, setWorkHours] = useState(() => loadState('workHours', []));
    const [diaryEntries, setDiaryEntries] = useState(() => loadState('diaryEntries', []));
    const [places, setPlaces] = useState(() => loadState('places', []));
    const [people, setPeople] = useState(() => loadState('people', []));
    const [shoppingList, setShoppingList] = useState(() => loadState('shoppingList', []));
    const [goals, setGoals] = useState(() => loadState('goals', []));

    const [subscriptions, setSubscriptions] = useState(() => loadState('subscriptions', [
        { id: 1, name: 'Netflix', cost: 17.99, cycle: 'monthly', firstPayment: '2024-01-15', category: 'Entertainment' },
        { id: 2, name: 'Spotify', cost: 10.99, cycle: 'monthly', firstPayment: '2024-01-01', category: 'Music' },
        { id: 3, name: 'McFit', cost: 24.90, cycle: 'monthly', firstPayment: '2024-01-01', category: 'Health' },
    ]));

    const [transactions, setTransactions] = useState(() => loadState('transactions', [
        { id: 1, type: 'expense', amount: 24.90, category: 'Lebensmittel', date: '2024-01-02', title: 'Rewe Einkauf' },
        { id: 2, type: 'income', amount: 2500.00, category: 'Gehalt', date: '2024-01-01', title: 'Gehalt Januar' },
    ]));

    // Global Persistence Effect
    useEffect(() => {
        localStorage.setItem('availableFunds', JSON.stringify(availableFunds));
        localStorage.setItem('income', JSON.stringify(income));
        localStorage.setItem('fixedCosts', JSON.stringify(fixedCosts));
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('recurringTasks', JSON.stringify(recurringTasks));
        localStorage.setItem('jobSettings', JSON.stringify(jobSettings));
        localStorage.setItem('debts', JSON.stringify(debts));
        localStorage.setItem('workHours', JSON.stringify(workHours));
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        localStorage.setItem('places', JSON.stringify(places));
        localStorage.setItem('people', JSON.stringify(people));
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        localStorage.setItem('goals', JSON.stringify(goals));
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [availableFunds, income, fixedCosts, tasks, recurringTasks, jobSettings, debts, workHours, diaryEntries, places, people, shoppingList, goals, subscriptions, transactions]);


    const addRecurringTask = (task) => {
        setRecurringTasks((prev) => [...prev, { ...task, id: Date.now() }]);
    };

    const removeRecurringTask = (id) => {
        setRecurringTasks((prev) => prev.filter(t => t.id !== id));
    };

    const addTask = (text, priority = 'normal') => {
        setTasks((prev) => [{ id: Date.now(), text, done: false, priority }, ...prev]);
    };

    const removeTask = (id) => {
        setTasks((prev) => prev.filter(t => t.id !== id));
    };

    const toggleTask = (id) => {
        setTasks((prev) => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    };

    const getRateForDate = (dateObj) => {
        const checkDate = new Date(dateObj);
        const switchDate = new Date(jobSettings.futureRateDate);
        return checkDate >= switchDate ? jobSettings.futureRate : jobSettings.baseRate;
    };

    const addWorkEntry = (entry) => {
        const rate = entry.manualRate || getRateForDate(entry.timestamp);
        const earnings = entry.earnings || (entry.hours * rate);
        setWorkHours((prev) => [{ ...entry, earnings, rateSnapshot: rate }, ...prev]);
    };

    const removeWorkEntry = (id) => {
        setWorkHours((prev) => prev.filter(entry => entry.id !== id));
    };

    const addDiaryEntry = (entry) => {
        setDiaryEntries((prev) => [{ ...entry, id: Date.now(), date: new Date().toLocaleDateString('de-DE') }, ...prev]);
    };
    const removeDiaryEntry = (id) => {
        setDiaryEntries((prev) => prev.filter(e => e.id !== id));
    };

    const updateDiaryEntry = (id, updatedEntry) => {
        setDiaryEntries((prev) => prev.map(e => e.id === id ? { ...e, ...updatedEntry } : e));
    };

    const addPlace = (place) => {
        setPlaces((prev) => [...prev, { ...place, id: Date.now() }]);
    };
    const removePlace = (id) => {
        setPlaces((prev) => prev.filter(p => p.id !== id));
    };

    const addPerson = (person) => {
        const initialNotes = person.note ? [{ id: Date.now(), text: person.note, date: new Date().toLocaleDateString('de-DE') }] : [];
        const { note, ...rest } = person;
        setPeople((prev) => [...prev, { ...rest, notes: initialNotes, id: Date.now() }]);
    };

    const removePerson = (id) => {
        setPeople((prev) => prev.filter(p => p.id !== id));
    };

    const addPersonNote = (personId, noteText) => {
        setPeople((prev) => prev.map(p => {
            if (p.id === personId) {
                return {
                    ...p,
                    notes: [...(p.notes || []), { id: Date.now(), text: noteText, date: new Date().toLocaleDateString('de-DE') }]
                };
            }
            return p;
        }));
    };

    const removePersonNote = (personId, noteId) => {
        setPeople((prev) => prev.map(p => {
            if (p.id === personId) {
                return {
                    ...p,
                    notes: (p.notes || []).filter(n => n.id !== noteId)
                };
            }
            return p;
        }));
    };

    const updateJobSettings = (newSettings) => {
        setJobSettings(prev => ({ ...prev, ...newSettings }));
    };

    const addDebt = (newDebt) => {
        setDebts((prev) => [...prev, { ...newDebt, id: Date.now() }]);
    };

    const removeDebt = (id) => {
        setDebts((prev) => prev.filter(d => d.id !== id));
    };

    const addShoppingItem = (item) => {
        setShoppingList((prev) => [...prev, { ...item, id: Date.now(), completed: false }]);
    };

    const removeShoppingItem = (id) => {
        setShoppingList((prev) => prev.filter(i => i.id !== id));
    };

    const toggleShoppingItem = (id) => {
        setShoppingList((prev) => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
    };

    const addGoal = (goal) => {
        setGoals((prev) => [...prev, { ...goal, id: Date.now(), milestones: goal.milestones || [] }]);
    };

    const removeGoal = (id) => {
        setGoals((prev) => prev.filter(g => g.id !== id));
    };

    const addMilestone = (goalId, text) => {
        setGoals((prev) => prev.map(g => {
            if (g.id === goalId) {
                return { ...g, milestones: [...g.milestones, { id: Date.now(), text, completed: false }] };
            }
            return g;
        }));
    };

    const toggleMilestone = (goalId, milestoneId) => {
        setGoals((prev) => prev.map(g => {
            if (g.id === goalId) {
                return {
                    ...g,
                    milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m)
                };
            }
            return g;
        }));
    };

    const addSubscription = (sub) => {
        setSubscriptions((prev) => [...prev, { ...sub, id: Date.now() }]);
    };

    const removeSubscription = (id) => {
        setSubscriptions((prev) => prev.filter(s => s.id !== id));
    };

    const addTransaction = (tx) => {
        setTransactions((prev) => [{ ...tx, id: Date.now() }, ...prev]);
        if (tx.type === 'income') {
            setAvailableFunds(prev => prev + tx.amount);
        } else {
            setAvailableFunds(prev => prev - tx.amount);
        }
    };

    const removeTransaction = (id) => {
        setTransactions((prev) => prev.filter(t => t.id !== id));
    };

    const payDebt = (id, amount) => {
        setDebts((prev) => prev.map(d => {
            if (d.id === id) {
                return { ...d, amount: Math.max(0, d.amount - amount) };
            }
            return d;
        }).filter(d => d.amount > 0)); // Auto-remove if paid off

        setAvailableFunds((prev) => prev - amount);
    };

    return (
        <AppContext.Provider value={{
            activeTab,
            setActiveTab,
            isMobileMenuOpen,
            setIsMobileMenuOpen,
            debts,
            totalDebt,
            addDebt,
            removeDebt,
            payDebt,
            availableFunds,
            income,
            fixedCosts,
            workHours,
            addWorkEntry,
            removeWorkEntry,
            jobSettings,
            updateJobSettings,
            tasks,
            addTask,
            removeTask,
            toggleTask,
            recurringTasks,
            addRecurringTask,
            removeRecurringTask,
            diaryEntries,
            addDiaryEntry,
            removeDiaryEntry,
            updateDiaryEntry,
            places,
            addPlace,
            removePlace,
            people,
            addPerson,
            removePerson,
            addPersonNote,
            removePersonNote,
            shoppingList,
            addShoppingItem,
            removeShoppingItem,
            toggleShoppingItem,
            goals,
            addGoal,
            removeGoal,
            addMilestone,
            toggleMilestone,
            subscriptions,
            addSubscription,
            removeSubscription,
            transactions,
            addTransaction,
            removeTransaction
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
