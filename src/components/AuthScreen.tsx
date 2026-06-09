import type { FormEventHandler, RefObject } from "react";
import { cn } from "../utils/cn";

type AuthForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthScreenProps = {
  isDark: boolean;
  onToggleTheme: () => void;
  authError: string | null;
  successMessage: string | null;
  authForm: AuthForm;
  onAuthInput: (field: keyof AuthForm, value: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  authLoading: boolean;
  passwordLongEnough: boolean;
  passwordsMatch: boolean;
  emailLooksValid: boolean;
  googleClientId: string;
  googleReady: boolean;
  googleButtonRef: RefObject<HTMLDivElement | null>;
  apiBaseUrl: string;
};

export function AuthScreen({
  isDark,
  onToggleTheme,
  authError,
  successMessage,
  authForm,
  onAuthInput,
  onSubmit,
  authLoading,
  passwordLongEnough,
  passwordsMatch,
  emailLooksValid,
  googleClientId,
  googleReady,
  googleButtonRef,
  apiBaseUrl,
}: AuthScreenProps) {
  return (
    <div className="min-h-screen bg-[#b9c8ff] px-4 py-6 text-zinc-900 transition-colors sm:px-6 sm:py-8 dark:bg-[#222b57] dark:text-white">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-[#eef2ff] p-3 shadow-[0_30px_100px_rgba(88,112,255,0.22)] dark:bg-[#303a72] sm:p-6">
        <div className="grid min-h-[780px] overflow-hidden rounded-[1.6rem] bg-white shadow-2xl shadow-indigo-200/70 dark:bg-zinc-950 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="relative flex flex-col justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-10">
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5a3 3 0 016 0m-6 7 2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold tracking-wide">TodoFlow</div>
                    <div className="text-xs text-zinc-400 dark:text-zinc-500">PostgreSQL workspace</div>
                  </div>
                </div>

                <button
                  onClick={onToggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-sm shadow-sm transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                  aria-label="Toggle theme"
                >
                  {isDark ? "☀️" : "🌙"}
                </button>
              </div>

              <div className="mt-6 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500 sm:text-sm">
                Already a member? <span className="font-semibold text-indigo-600 dark:text-indigo-300">Sign in</span>
              </div>

              <div className="mt-10 max-w-md">
                <h1 className="text-4xl font-bold tracking-tight sm:text-[2.6rem]">Sign Up</h1>
                <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Secure your flow, collaborate on daily tasks, and keep every personal todo synced with your PostgreSQL backend.
                </p>
              </div>

              {authError && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                  {authError}
                </div>
              )}

              {successMessage && (
                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {successMessage}
                </div>
              )}

              <form className="mt-7 space-y-4" onSubmit={onSubmit}>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    Full name
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">👤</span>
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(event) => onAuthInput("name", event.target.value)}
                      placeholder="Derek Ahmad"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-11 text-sm outline-none transition placeholder:text-zinc-300 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
                    />
                    <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-sm", authForm.name.trim() ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")}>
                      {authForm.name.trim() ? "✓" : "○"}
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    Email
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">✉️</span>
                    <input
                      type="email"
                      value={authForm.email}
                      onChange={(event) => onAuthInput("email", event.target.value)}
                      placeholder="todoflow@mail.com"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-11 text-sm outline-none transition placeholder:text-zinc-300 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
                    />
                    <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-sm", emailLooksValid ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")}>
                      {emailLooksValid ? "✓" : "○"}
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    Password
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🔒</span>
                    <input
                      type="password"
                      value={authForm.password}
                      onChange={(event) => onAuthInput("password", event.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-11 text-sm outline-none transition placeholder:text-zinc-300 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
                    />
                    <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-sm", passwordLongEnough ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")}>
                      {passwordLongEnough ? "✓" : "○"}
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
                    Confirm password
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">🛡️</span>
                    <input
                      type="password"
                      value={authForm.confirmPassword}
                      onChange={(event) => onAuthInput("confirmPassword", event.target.value)}
                      placeholder="Repeat password"
                      className="w-full rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-11 text-sm outline-none transition placeholder:text-zinc-300 focus:border-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:focus:border-indigo-400"
                    />
                    <span className={cn("absolute right-4 top-1/2 -translate-y-1/2 text-sm", passwordsMatch ? "text-emerald-500" : "text-zinc-300 dark:text-zinc-700")}>
                      {passwordsMatch ? "✓" : "○"}
                    </span>
                  </div>
                </label>

                <div className="space-y-2 pt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]", passwordLongEnough ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-zinc-300 text-zinc-300 dark:border-zinc-700 dark:text-zinc-600")}>✓</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]", passwordsMatch ? "border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "border-zinc-300 text-zinc-300 dark:border-zinc-700 dark:text-zinc-600")}>✓</span>
                    <span>Passwords match and are ready for secure sign up</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400 bg-emerald-50 text-[10px] text-emerald-600 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">✓</span>
                    <span>I accept the terms and privacy rules for this workspace</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="inline-flex min-w-[150px] items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? "Signing up..." : "Sign up"}
                  </button>

                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-lg text-zinc-500 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    aria-label="Apple sign up placeholder"
                  >
                    
                  </button>

                  <button
                    type="button"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-bold text-blue-600 transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    aria-label="Facebook sign up placeholder"
                  >
                    f
                  </button>

                  {googleClientId ? (
                    <div className="flex h-11 min-w-[44px] items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div ref={googleButtonRef} className="scale-[0.94]" />
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-sm font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                      G
                    </div>
                  )}
                </div>
              </form>

              <div className="mt-5 text-xs leading-5 text-zinc-400 dark:text-zinc-500">
                {googleClientId
                  ? googleReady
                    ? "Google sign up is active. Use the circular Google button above to create an account instantly."
                    : "Preparing Google sign up..."
                  : "Add VITE_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID to activate real Google sign up."}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="text-base">🇬🇧</span>
                <span>ENG</span>
              </div>
              <div>API • {apiBaseUrl}</div>
            </div>
          </section>

          <section className="relative hidden overflow-hidden bg-[linear-gradient(180deg,#4f5dff_0%,#5687ff_54%,#6ca8ff_100%)] p-8 lg:block xl:p-10 dark:bg-[linear-gradient(180deg,#3e49d1_0%,#4568dc_54%,#4f8cf7_100%)]">
            <div className="absolute -left-10 -top-12 h-40 w-52 rotate-[-12deg] rounded-[2rem] bg-[#2e2aa6]/85" />
            <div className="absolute right-10 top-10 h-16 w-24 rounded-[1.4rem] bg-white/10 backdrop-blur" />
            <div className="absolute -bottom-16 left-16 h-44 w-72 rotate-[22deg] rounded-[2.5rem] bg-[#74b2ff]" />
            <div className="relative z-10 flex h-full flex-col justify-center">
              <div className="mx-auto w-full max-w-md space-y-6">
                <div className="ml-auto w-[240px] rounded-[1.6rem] bg-white px-5 py-5 text-zinc-900 shadow-2xl shadow-blue-900/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-400">Tasks</div>
                      <div className="mt-2 text-4xl font-bold">176.18</div>
                    </div>
                    <div className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold">+6%</div>
                  </div>
                  <div className="mt-5 flex items-end gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-500" />
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-zinc-950 text-xs font-semibold text-white">45</div>
                    <svg viewBox="0 0 180 60" className="h-14 flex-1">
                      <path d="M4 46 C28 18, 40 20, 58 38 S92 58, 112 30 S144 8, 176 40" fill="none" stroke="#f8a01a" strokeWidth="6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="mt-4 flex justify-end gap-3 text-lg">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-pink-100 text-pink-500">◎</span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-zinc-100 text-zinc-900">♪</span>
                  </div>
                </div>

                <div className="w-[280px] rounded-[1.6rem] bg-white px-5 py-5 text-zinc-900 shadow-2xl shadow-blue-900/20">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-2.5 w-16 rounded-full bg-indigo-500" />
                      <div className="h-2.5 w-24 rounded-full bg-zinc-200" />
                      <div className="h-2.5 w-20 rounded-full bg-zinc-200" />
                    </div>
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-xl text-amber-500">🔑</div>
                  </div>
                  <div className="mt-4 text-lg font-bold">Your data, your rules</div>
                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Your account is stored securely, linked to your own PostgreSQL-backed todo workspace, and ready for Google onboarding.
                  </p>
                </div>

                <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 text-white backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-[0.25em] text-white/70">Account status</div>
                      <div className="mt-2 text-2xl font-semibold">Ready to create</div>
                    </div>
                    <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                      {googleClientId ? "Google on" : "Email first"}
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-2xl bg-white/10 px-3 py-4">
                      <div className="text-xl font-bold">24/7</div>
                      <div className="mt-1 text-white/70">Sync</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-3 py-4">
                      <div className="text-xl font-bold">1</div>
                      <div className="mt-1 text-white/70">User space</div>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-3 py-4">
                      <div className="text-xl font-bold">∞</div>
                      <div className="mt-1 text-white/70">Todos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
