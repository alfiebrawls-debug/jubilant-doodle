import React, { useState } from 'react';
import { Flame, Loader2, Mail, KeyRound, Sparkles, MailCheck, AlertTriangle, TerminalSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * Signed-out gate backed by Supabase Auth (email + password).
 * New accounts are provisioned with 1 free forge credit by a database
 * trigger — see supabase/migrations/.
 */
export default function AuthScreen() {
  const { signUp, signIn, authBusy, isSupabaseConfigured } = useAuth();
  const [mode, setMode] = useState('signup'); // signup | signin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const valid = /.+@.+\..+/.test(email) && password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid || authBusy) return;
    setError(null);

    if (mode === 'signup') {
      const result = await signUp(email.trim(), password);
      if (result.error) setError(result.error);
      else if (result.needsEmailConfirmation) setConfirmationSent(true);
      // else: session established — the auth listener swaps this screen out
    } else {
      const result = await signIn(email.trim(), password);
      if (result.error) setError(result.error);
    }
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
            {mode === 'signup'
              ? 'Create an account to start forging. Your first forge is on us.'
              : 'Sign back in to keep forging.'}
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-relaxed text-amber-200">
            <p className="mb-1 flex items-center gap-2 font-semibold">
              <TerminalSquare size={15} /> Supabase isn’t configured
            </p>
            Copy <code className="rounded bg-black/30 px-1">.env.example</code> to{' '}
            <code className="rounded bg-black/30 px-1">.env</code>, fill in your project
            URL and publishable key, then restart the dev server.
          </div>
        ) : confirmationSent ? (
          <div className="rounded-xl border border-cyan/30 bg-cyan/10 p-5 text-center">
            <MailCheck size={28} className="mx-auto mb-3 text-cyan-glow" />
            <p className="text-sm font-semibold text-white">Confirm your email</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
              We sent a confirmation link to{' '}
              <span className="font-medium text-cyan-glow">{email}</span>. Click it,
              then sign in below.
            </p>
            <button
              type="button"
              onClick={() => {
                setConfirmationSent(false);
                setMode('signin');
              }}
              className="mt-4 text-sm font-semibold text-violet-glow underline underline-offset-2"
            >
              Go to sign in
            </button>
          </div>
        ) : (
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
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-space-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet/60 focus:outline-none"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <KeyRound size={13} /> Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full rounded-xl border border-white/10 bg-space-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-violet/60 focus:outline-none"
              />
            </label>

            {error && (
              <p className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
                <AlertTriangle size={14} className="mt-px shrink-0" /> {error}
              </p>
            )}

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
                  <Loader2 size={15} className="animate-spin" />
                  {mode === 'signup' ? 'Creating your account…' : 'Signing you in…'}
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  {mode === 'signup' ? 'Create free account' : 'Sign in'}
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              {mode === 'signup' ? 'Already have an account?' : 'New to ClipForge?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signup' ? 'signin' : 'signup');
                  setError(null);
                }}
                className="font-semibold text-cyan-glow underline underline-offset-2"
              >
                {mode === 'signup' ? 'Sign in' : 'Create one free'}
              </button>
            </p>
          </form>
        )}

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-600">
          Powered by Supabase Auth · new accounts start with 1 free forge credit
        </p>
      </div>
    </div>
  );
}
