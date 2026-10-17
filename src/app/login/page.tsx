"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(
      "Authentication is not connected yet. Please try again after the backend is configured."
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#061912] px-5 py-12 text-[#E8F6EE]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-[110px]" />
        <div className="absolute -bottom-40 -right-20 h-[450px] w-[450px] rounded-full bg-teal-400/10 blur-[130px]" />

        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12]"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M-100 250 C180 100 250 480 500 340 S850 100 1300 300"
            stroke="#34D399"
            strokeWidth="1.5"
          />
          <path
            d="M-100 280 C180 130 250 510 500 370 S850 130 1300 330"
            stroke="#34D399"
            strokeWidth="1"
          />
          <path
            d="M-100 310 C180 160 250 540 500 400 S850 160 1300 360"
            stroke="#2DD4BF"
            strokeWidth="1"
          />
          <path
            d="M-100 550 C180 400 330 700 650 530 S1000 400 1300 530"
            stroke="#2DD4BF"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <Link
          href="/"
          className="mb-9 flex items-center justify-center gap-3"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-400/10 shadow-lg shadow-emerald-950/30">
            <svg
              viewBox="0 0 40 40"
              className="h-7 w-7"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M20 4C15 12 8 19 8 25a12 12 0 0 0 24 0C32 19 25 12 20 4Z"
                stroke="#6EE7B7"
                strokeWidth="2"
              />
              <path
                d="M12 25c5-4 11 4 16 0M14 30c4-3 8 3 12 0"
                stroke="#6EE7B7"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div>
            <p className="text-2xl font-semibold tracking-[0.16em]">
              HYDRO<span className="text-emerald-300">VISION</span>
            </p>
            <p className="mt-1 text-[10px] tracking-[0.28em] text-emerald-100/50">
              FLOOD INTELLIGENCE PLATFORM
            </p>
          </div>
        </Link>

        {/* Login card */}
        <section className="rounded-3xl border border-white/[0.10] bg-[#0B241A]/85 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-9">
          <div className="mb-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
              Secure officer access
            </div>

            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-50/55">
              Sign in to access your flood intelligence workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-emerald-50/80"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@organisation.gov.in"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#061912]/70 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-emerald-50/25 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/10"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-emerald-50/80"
                >
                  Password
                </label>
                <span className="text-xs text-emerald-100/35">
                  Account credentials
                </span>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#061912]/70 px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-emerald-50/25 focus:border-emerald-300/60 focus:ring-2 focus:ring-emerald-300/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 text-xs font-medium text-emerald-300 transition hover:text-emerald-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-amber-300/20 bg-amber-300/[0.07] px-4 py-3 text-sm leading-5 text-amber-100/90"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3.5 text-sm font-semibold text-[#062016] shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-[#0B241A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in to HydroVision"}
              {!loading && (
                <svg
                  viewBox="0 0 20 20"
                  className="h-4 w-4"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 10h12m-5-5 5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.08]" />
            <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-50/30">
              HydroVision access
            </span>
            <div className="h-px flex-1 bg-white/[0.08]" />
          </div>

          <p className="text-center text-xs leading-5 text-emerald-50/40">
            Access is available to authorised users. Authentication will be
            enabled once the backend service is connected.
          </p>
        </section>

        <div className="mt-7 flex items-center justify-between gap-3 text-xs text-emerald-50/35">
          <Link href="/" className="transition hover:text-emerald-200">
            ← Back to home
          </Link>
          <span>HydroVision · Flood Intelligence</span>
        </div>
      </div>
    </main>
  );
}