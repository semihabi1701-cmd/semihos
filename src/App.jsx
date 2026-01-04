import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Header from './components/dashboard/Header';
import AiCoachCard from './components/dashboard/AiCoachCard';
import SmartImpulsCard from './components/dashboard/SmartImpulsCard';
import FinanceOverview from './components/dashboard/FinanceOverview';
import DebtCard from './components/dashboard/DebtCard';
import WorkLogger from './components/modules/WorkLogger';
import DebtManager from './components/modules/DebtManager';

import Diary from './components/modules/Diary';
import Places from './components/modules/Places';
import Shopping from './components/modules/Shopping';
import People from './components/modules/People';
import Tasks from './components/modules/Tasks';
import Calendar from './components/modules/Calendar';
import Goals from './components/modules/Goals';
import Subscriptions from './components/modules/Subscriptions';
import Finance from './components/modules/Finance';

// Component to decide what to render based on active tab
const MainContent = () => {
  const { activeTab } = useApp();

  if (activeTab === 'Kalender') {
    return <Calendar />;
  }

  if (activeTab === 'Tasks') {
    return <Tasks />;
  }

  if (activeTab === 'Arbeit') {
    return <WorkLogger />;
  }

  if (activeTab === 'Schulden') {
    return <DebtManager />;
  }

  if (activeTab === 'Tagebuch') {
    return <Diary />;
  }

  if (activeTab === 'Orte') {
    return <Places />;
  }

  if (activeTab === 'Einkauf') {
    return <Shopping />;
  }

  if (activeTab === 'Leute') {
    return <People />;
  }

  if (activeTab === 'Ziele') {
    return <Goals />;
  }

  if (activeTab === 'Abos') {
    return <Subscriptions />;
  }

  if (activeTab === 'Finanzen') {
    return <Finance />;
  }

  if (activeTab === 'Tagebuch') {
    return <Diary />;
  }

  if (activeTab === 'Orte') {
    return <Places />;
  }

  if (activeTab !== 'Dashboard') {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 p-8 text-center animate-fadeIn">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">"{activeTab}" ist bald verfügbar!</h2>
        <p className="text-gray-500">Dieser Bereich wird noch entwickelt. Checke später nochmal vorbei.</p>
      </div>
    );
  }

  // Default to Dashboard
  return (
    <div className="space-y-6">
      <AiCoachCard />
      <SmartImpulsCard />

      <div className="flex flex-col md:flex-row gap-6">
        <FinanceOverview />
        <DebtCard />
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Layout>
        <Header />
        <MainContent />
      </Layout>
    </AppProvider>
  );
}

export default App;
