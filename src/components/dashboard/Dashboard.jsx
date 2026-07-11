import React from 'react';
import { Eye, Timer, FolderKanban, Scissors, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import StatCard from './StatCard.jsx';
import TrendChart from './TrendChart.jsx';
import ProjectList from './ProjectList.jsx';

const formatCompact = (n) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function Dashboard() {
  const { analytics, projects, isBootstrapping, setView } = useApp();
  const { session } = useAuth();
  const firstName = session?.user.name.split(' ')[0] ?? 'creator';

  if (isBootstrapping) {
    return (
      <div className="animate-fade-up space-y-6">
        <div className="h-24 rounded-2xl bg-space-850/60 shimmer-bg animate-shimmer" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-space-850/60 shimmer-bg animate-shimmer" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-space-850/60 shimmer-bg animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <SectionHeader
        eyebrow="Overview"
        title={
          <>
            Welcome back, <span className="capitalize">{firstName}</span> 👋
          </>
        }
        subtitle="Your content pipeline at a glance — here's what ClipForge saved you this month."
        actions={
          <button
            type="button"
            onClick={() => setView('forge')}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-2.5 text-sm font-semibold text-white shadow-glow-violet transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <Sparkles size={15} /> Forge a Clip
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="Estimated views generated"
          value={formatCompact(analytics.estimatedViewsSaved)}
          hint="+18% this week"
          accent="violet"
        />
        <StatCard
          icon={Timer}
          label="Hours of editing saved"
          value={analytics.hoursSaved}
          hint="≈ $1.4k value"
          accent="cyan"
        />
        <StatCard
          icon={FolderKanban}
          label="Active projects"
          value={analytics.activeProjects}
          accent="violet"
        />
        <StatCard
          icon={Scissors}
          label="Clips forged"
          value={analytics.clipsForged}
          hint="this month"
          accent="cyan"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-white">Clips forged this week</h3>
          <p className="mb-4 text-xs text-slate-500">Daily output, last 7 days</p>
          <TrendChart data={analytics.weeklyTrend} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Recent projects</h3>
            <button
              type="button"
              onClick={() => setView('forge')}
              className="inline-flex items-center gap-1 text-xs font-medium text-cyan-glow transition-colors hover:text-white"
            >
              Start new <ArrowRight size={13} />
            </button>
          </div>
          <ProjectList projects={projects} onOpenForge={() => setView('forge')} />
        </div>
      </div>
    </div>
  );
}
