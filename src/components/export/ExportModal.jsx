import React, { useEffect, useState } from 'react';
import {
  X,
  ClipboardCopy,
  FileDown,
  CalendarClock,
  Check,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { api } from '../../services/mockApi.js';
import { scriptToText } from '../studio/ScriptPanel.jsx';
import { PLATFORMS } from '../../data/mockData.js';

function fullPackageText(pkg) {
  return [
    '=== CLIP SCRIPT ===',
    scriptToText(pkg.script),
    '',
    '=== HOOKS ===',
    ...pkg.social.hooks.map((h, i) => `${i + 1}. ${h}`),
    '',
    '=== CAPTIONS ===',
    ...pkg.social.captions.map((c, i) => `Variant ${String.fromCharCode(65 + i)}: ${c}`),
    '',
    '=== HASHTAGS ===',
    ...pkg.social.platforms.map((p) => `${p.name}: ${p.hashtags.join(' ')}`),
  ].join('\n');
}

/**
 * Export & Analytics panel: copy everything, mock-PDF the script, or
 * mock-schedule the post across platforms.
 */
export default function ExportModal() {
  const { clipPackage, setExportOpen } = useApp();

  const [copied, setCopied] = useState(false);
  const [pdfState, setPdfState] = useState('idle'); // idle | busy | done
  const [pdfResult, setPdfResult] = useState(null);
  const [scheduleState, setScheduleState] = useState('idle');
  const [scheduleResult, setScheduleResult] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['tiktok', 'reels', 'shorts']);
  const [scheduledFor, setScheduledFor] = useState('');

  const close = () => setExportOpen(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!clipPackage) return null;

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(fullPackageText(clipPackage));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* non-secure context — CopyButton covers the granular fallback path */
    }
  };

  const handlePdf = async () => {
    setPdfState('busy');
    const result = await api.exportPdf(clipPackage);
    setPdfResult(result);
    setPdfState('done');
  };

  const togglePlatform = (id) =>
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );

  const handleSchedule = async () => {
    setScheduleState('busy');
    const result = await api.schedulePost({
      platformIds: selectedPlatforms,
      scheduledFor: scheduledFor || 'next optimal slot',
    });
    setScheduleResult(result);
    setScheduleState('done');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-space-950/80 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Export and schedule"
    >
      <div
        className="card max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 animate-fade-up sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Export & Schedule</h3>
            <p className="mt-0.5 text-sm text-slate-400">
              Ship “{clipPackage.topic}” everywhere at once.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Copy everything */}
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex w-full items-center gap-4 rounded-xl border border-white/10 p-4 text-left transition-all hover:border-violet/60 hover:bg-violet/5"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-glow">
              {copied ? <Check size={18} /> : <ClipboardCopy size={18} />}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">
                {copied ? 'Copied to clipboard!' : 'Copy full package'}
              </span>
              <span className="block text-xs text-slate-400">
                Script, hooks, captions & hashtags as plain text
              </span>
            </span>
          </button>

          {/* PDF export */}
          <button
            type="button"
            onClick={handlePdf}
            disabled={pdfState === 'busy'}
            className="flex w-full items-center gap-4 rounded-xl border border-white/10 p-4 text-left transition-all hover:border-cyan/60 hover:bg-cyan/5 disabled:opacity-60"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-cyan/15 text-cyan-glow">
              {pdfState === 'busy' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : pdfState === 'done' ? (
                <Check size={18} />
              ) : (
                <FileDown size={18} />
              )}
            </span>
            <span>
              <span className="block text-sm font-semibold text-white">
                {pdfState === 'done' ? `Ready: ${pdfResult.fileName}` : 'Export PDF script'}
              </span>
              <span className="block text-xs text-slate-400">
                {pdfState === 'done'
                  ? `${pdfResult.sizeKb} KB · shot-list layout for your editor`
                  : 'Timestamped shot list your editor can follow'}
              </span>
            </span>
          </button>

          {/* Schedule */}
          <div className="rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet/15 text-violet-glow">
                <CalendarClock size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Schedule the post</p>
                <p className="text-xs text-slate-400">Queue across platforms (mock)</p>
              </div>
            </div>

            {scheduleState === 'done' ? (
              <div className="mt-4 rounded-lg bg-emerald-500/10 px-3.5 py-3 text-sm text-emerald-300">
                <Check size={14} className="mr-1.5 inline" />
                Queued for {scheduleResult.scheduledFor} — confirmation{' '}
                <span className="font-mono text-xs">{scheduleResult.confirmationId}</span>
              </div>
            ) : (
              <>
                <div className="mt-4 flex gap-2">
                  {PLATFORMS.map((p) => {
                    const on = selectedPlatforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePlatform(p.id)}
                        aria-pressed={on}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                          on
                            ? 'border-cyan/60 bg-cyan/10 text-cyan-glow'
                            : 'border-white/10 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-white/10 bg-space-900 px-3 py-2 text-sm text-slate-200 [color-scheme:dark] focus:border-violet/60 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSchedule}
                  disabled={scheduleState === 'busy' || selectedPlatforms.length === 0}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet to-cyan py-2.5 text-sm font-bold text-white transition-transform hover:scale-[1.01] disabled:opacity-50"
                >
                  {scheduleState === 'busy' ? (
                    <>
                      <Loader2 size={15} className="animate-spin" /> Queuing…
                    </>
                  ) : (
                    'Queue it up'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
