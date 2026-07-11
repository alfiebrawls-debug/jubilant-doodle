import React from 'react';
import { useApp } from './context/AppContext.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import TopBar from './components/layout/TopBar.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import ForgeWorkspace from './components/forge/ForgeWorkspace.jsx';
import OutputStudio from './components/studio/OutputStudio.jsx';
import ExportModal from './components/export/ExportModal.jsx';
import AuthScreen from './components/auth/AuthScreen.jsx';
import PricingModal from './components/paywall/PricingModal.jsx';

const VIEWS = {
  dashboard: Dashboard,
  forge: ForgeWorkspace,
  studio: OutputStudio,
};

export default function App() {
  const { view, exportOpen } = useApp();
  const { session, authLoading } = useAuth();
  const ActiveView = VIEWS[view] ?? Dashboard;

  // Boot splash while Supabase restores a persisted session
  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-space-900">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet border-t-transparent" />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen flex bg-space-900">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet/10 blur-3xl" />
        <div className="absolute top-1/2 -right-48 h-[28rem] w-[28rem] rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <Sidebar />

      <div className="relative flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-4 pb-24 pt-6 sm:px-6 lg:px-10 lg:pb-10">
          <ActiveView key={view} />
        </main>
      </div>

      {exportOpen && <ExportModal />}
      <PricingModal />
    </div>
  );
}
