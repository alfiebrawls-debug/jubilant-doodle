import React, { useState } from 'react';
import { Link2, AlertTriangle, Hammer, Wand2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import StyleSelector from './StyleSelector.jsx';
import ForgeLoader from './ForgeLoader.jsx';

const EXAMPLE_INPUT = 'https://youtube.com/watch?v=morning-routines-of-top-creators';

export default function ForgeWorkspace() {
  const { forge, forgeStatus, progress, resetForge } = useApp();
  const [input, setInput] = useState('');
  const [styleId, setStyleId] = useState('genz');

  const canForge = input.trim().length >= 8 && forgeStatus !== 'processing';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canForge) forge({ input, styleId });
  };

  if (forgeStatus === 'processing') {
    return (
      <div className="mx-auto max-w-3xl animate-fade-up">
        <SectionHeader
          eyebrow="The Forge"
          title="Working the metal…"
          subtitle="Sit tight — we're mining your content for its most viral moments."
        />
        <ForgeLoader progress={progress} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-up">
      <SectionHeader
        eyebrow="The Forge"
        title="Drop in your long-form content"
        subtitle="Paste a video/podcast URL or a raw transcript. Pick a style. We'll forge the clip script and the full social package."
      />

      {forgeStatus === 'error' && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle size={16} />
          Something broke in the forge. Give it another swing.
          <button
            type="button"
            onClick={resetForge}
            className="ml-auto font-semibold underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card gradient-border p-1.5">
          <div className="flex items-center gap-2 px-4 pt-3 text-xs font-medium text-slate-500">
            <Link2 size={13} />
            URL or pasted text
            <button
              type="button"
              onClick={() => setInput(EXAMPLE_INPUT)}
              className="ml-auto inline-flex items-center gap-1 text-cyan-glow transition-colors hover:text-white"
            >
              <Wand2 size={12} /> Try an example
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="https://youtube.com/watch?v=…  — or paste your transcript, blog post, or podcast notes here"
            className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-600 focus:outline-none"
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Choose your voice</h3>
          <StyleSelector selected={styleId} onSelect={setStyleId} />
        </div>

        <button
          type="submit"
          disabled={!canForge}
          className={`flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 text-base font-bold transition-all ${
            canForge
              ? 'bg-gradient-to-r from-violet to-cyan text-white shadow-glow-violet hover:scale-[1.01] active:scale-[0.99]'
              : 'cursor-not-allowed bg-space-800 text-slate-600'
          }`}
        >
          <Hammer size={18} />
          Forge Clip Package
        </button>
        <p className="-mt-4 text-center text-xs text-slate-600">
          Avg. forge time: ~4 seconds · Costs 1 clip credit
        </p>
      </form>
    </div>
  );
}
