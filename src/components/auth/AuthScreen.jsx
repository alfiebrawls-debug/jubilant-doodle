import React, { useState } from 'react';
import { Flame, Loader2, Mail, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Signed-out gate. Mock email sign-in — any address works and creates a
 * Free account with 1 forge credit.
 * PRODUCTION: swap the submit handler for your provider's magic-link or
 * OAuth flow (see src/services/authService.js for the integration map).
 */
export default function AuthScreen() {
  const { signIn, authBusy } = useAuth();
  const [email, setEmail] = useState('');
  const valid = /.+@.+\..+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (valid && !authBusy) signIn(email.trim());
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-space-900 px-4">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-violet/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan/10 blur-3xl" />
      </div>

      <div className="card relative w-full max-w-md p-8 animate-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan shadow-glow-violet">
            <Flame size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome to Clip<span className="gradient-text">Forge</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to start forging viral clips. Your first forge is on us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Mail size={13} /> Email address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoFocus
              className="w-full rounded-xl border border-white/10 bg-space-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet/60 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={!valid || authBusy}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${
              valid && !authBusy
                ? 'bg-gradient-to-r from-violet to-cyan text-white shadow-glow-violet hover:scale-[1.01]'
                : 'cursor-not-allowed bg-space-800 text-slate-600'
            }`}
          >
            {authBusy ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Signing you in…
              </>
            ) : (
              <>
                <Sparkles size={15} /> Continue
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-600">
          Demo build — any email creates a Free account with 1 forge credit.
          <br />
          No password, no verification, nothing leaves your browser.
        </p>
      </div>
    </div>
  );
}
