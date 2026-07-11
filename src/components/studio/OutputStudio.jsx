import React from 'react';
import { Download, RefreshCcw, Gauge, Eye, Timer } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import ScriptPanel from './ScriptPanel.jsx';
import SocialPanel from './SocialPanel.jsx';

const formatCompact = (n) =>
  Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export default function OutputStudio() {
  const { clipPackage, setView, setExportOpen, resetForge } = useApp();

  if (!clipPackage) {
    return (
      <div className="mx-auto max-w-md pt-24 text-center animate-fade-up">
        <p className="text-4xl">🔨</p>
        <h2 className="mt-4 text-xl font-bold text-white">Nothing forged yet</h2>
        <p className="mt-2 text-sm text-slate-400">
          Run some long-form content through the Forge and your clip package will land here.
        </p>
        <button
          type="button"
          onClick={() => setView('forge')}
          className="mt-6 rounded-xl bg-gradient-to-r from-violet to-cyan px-5 py-2.5 text-sm font-semibold text-white shadow-glow-violet"
        >
          Open the Forge
        </button>
      </div>
    );
  }

  const { projectedStats } = clipPackage;

  return (
    <div className="animate-fade-up">
      <SectionHeader
        eyebrow="Output Studio"
        title="Your clip package is ready"
        subtitle={`Forged from “${clipPackage.topic}” — review, copy, export, or schedule.`}
        actions={
          <>
            <button
              type="button"
              onClick={() => {
                resetForge();
                setView('forge');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white"
            >
              <RefreshCcw size={15} /> Re-forge
            </button>
            <button
              type="button"
              onClick={() => setExportOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet to-cyan px-4 py-2.5 text-sm font-semibold text-white shadow-glow-violet transition-transform hover:scale-[1.03]"
            >
              <Download size={15} /> Export & Schedule
            </button>
          </>
        }
      />

      {/* Projected performance strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        {[
          { icon: Eye, label: 'Projected views', value: formatCompact(projectedStats.estimatedViews) },
          { icon: Timer, label: 'Hours saved', value: `${projectedStats.hoursSaved}h` },
          { icon: Gauge, label: 'Retention score', value: `${projectedStats.retentionScore}/100` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex items-center gap-3 px-4 py-3">
            <Icon size={16} className="shrink-0 text-cyan-glow" />
            <div className="min-w-0">
              <p className="text-base font-bold leading-tight text-white">{value}</p>
              <p className="truncate text-[11px] text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Split screen: script | social package. Stacks on mobile. */}
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <ScriptPanel script={clipPackage.script} />
        <SocialPanel social={clipPackage.social} />
      </div>
    </div>
  );
}
