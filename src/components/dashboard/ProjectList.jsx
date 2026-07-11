import React from 'react';
import { CheckCircle2, Loader2, FileEdit, ChevronRight } from 'lucide-react';
import { STYLES } from '../../data/mockData.js';

const STATUS_META = {
  ready: { icon: CheckCircle2, label: 'Ready', cls: 'text-emerald-400' },
  processing: { icon: Loader2, label: 'Processing', cls: 'text-cyan-glow', iconCls: 'animate-spin' },
  draft: { icon: FileEdit, label: 'Draft', cls: 'text-slate-500' },
};

function timeAgo(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days}d ago`;
}

export default function ProjectList({ projects, onOpenForge }) {
  return (
    <div className="card divide-y divide-white/5">
      {projects.map((project) => {
        const status = STATUS_META[project.status] ?? STATUS_META.draft;
        const StatusIcon = status.icon;
        const style = STYLES.find((s) => s.id === project.style);

        return (
          <button
            key={project.id}
            type="button"
            onClick={onOpenForge}
            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
          >
            <span className="text-xl" aria-hidden>
              {style?.emoji ?? '🎞️'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{project.title}</p>
              <p className="truncate text-xs text-slate-500">
                {project.source} · {timeAgo(project.createdAt)}
              </p>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-medium ${status.cls}`}>
              <StatusIcon size={14} className={status.iconCls} />
              <span className="hidden sm:inline">{status.label}</span>
            </div>
            {project.clips > 0 && (
              <span className="hidden rounded-full bg-violet/15 px-2.5 py-0.5 text-xs font-semibold text-violet-glow md:inline">
                {project.clips} clips
              </span>
            )}
            <ChevronRight
              size={16}
              className="text-slate-600 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-300"
            />
          </button>
        );
      })}
    </div>
  );
}
