import Link from "next/link";
import {
  WavesIcon,
  ShieldAlertIcon,
  LifeBuoyIcon,
  ArrowRightIcon,
  ActivityIcon,
} from "@/components/hv/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#071F16] text-[#E8F6EE] flex flex-col justify-between selection:bg-[#2FA36B]/30 selection:text-white">
      {/* Subtle Ambient Background Water Wave Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-radial from-[#1F7A4D]/25 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-radial from-[#0E9AA7]/20 via-transparent to-transparent blur-3xl" />
        <svg
          className="absolute inset-0 w-full h-full stroke-[#1A4A38]/40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2FA36B] to-[#17603D] flex items-center justify-center text-white font-extrabold text-base shadow-lg shadow-[#0B2E21]/50 border border-white/10">
            HV
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-tight">
              HydroVision
            </span>
            <span className="text-[11px] font-medium text-[#8FE0B0] tracking-wide block">
              Flood Intelligence Platform
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B2E21]/80 border border-[#1A4A38] text-xs text-[#C5DDD0]">
          <span className="h-2 w-2 rounded-full bg-[#2FA36B] animate-pulse" />
          <span className="font-medium">Krishna &amp; Koyna River Basin Pilot</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16 flex flex-col items-center text-center my-auto">
        {/* Category Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12402F] border border-[#1A4A38] text-xs font-semibold text-[#8FE0B0] mb-8 shadow-sm">
          <ActivityIcon size={14} className="text-[#2FA36B]" />
          <span>Early Flood Intelligence • Rapid Community Response</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Village-by-village flood warning,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FB07A] via-[#8FE0B0] to-[#0E9AA7]">
            live.
          </span>
        </h1>

        {/* Short, Memorable Slogan */}
        <p className="mt-6 text-base sm:text-lg md:text-xl text-[#C5DDD0] max-w-2xl font-normal leading-relaxed">
          Real-time river gauge monitoring, predictive ward inundation mapping, and coordinated field action to protect vulnerable river basin communities.
        </p>

        {/* Primary Call to Action Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/officer/command"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#2FA36B] hover:bg-[#34b678] text-white font-bold text-base shadow-xl shadow-[#2FA36B]/25 hover:shadow-[#2FA36B]/40 hover:-translate-y-0.5 transition-all duration-200 border border-white/20 active:translate-y-0"
          >
            <span>Enter HydroVision</span>
            <ArrowRightIcon
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Core Pillars Grid */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 w-full text-left">
          {/* Pillar 1 */}
          <div className="p-5 rounded-2xl bg-[#0B2E21]/60 border border-[#1A4A38] backdrop-blur-sm hover:border-[#2FA36B]/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-[#12402F] flex items-center justify-center text-[#8FE0B0] mb-4 border border-[#1A4A38]">
              <WavesIcon size={20} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Predictive River Monitoring
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#C5DDD0]/80 leading-relaxed">
              Continuous telemetry integration across river gauges and rainfall forecasts to maximize actionable evacuation lead time.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-5 rounded-2xl bg-[#0B2E21]/60 border border-[#1A4A38] backdrop-blur-sm hover:border-[#2FA36B]/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-[#12402F] flex items-center justify-center text-[#8FE0B0] mb-4 border border-[#1A4A38]">
              <ShieldAlertIcon size={20} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Ward-Level Flood Inundation
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#C5DDD0]/80 leading-relaxed">
              PostGIS elevation models translate rising river stages into specific flooded zones and people-at-risk assessments.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-5 rounded-2xl bg-[#0B2E21]/60 border border-[#1A4A38] backdrop-blur-sm hover:border-[#2FA36B]/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-[#12402F] flex items-center justify-center text-[#8FE0B0] mb-4 border border-[#1A4A38]">
              <LifeBuoyIcon size={20} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Coordinated Community Action
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#C5DDD0]/80 leading-relaxed">
              Direct two-way multilingual alerts, emergency shelter routing, and atomic task claims for volunteer rescue personnel.
            </p>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#1A4A38]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8FE0B0]/70">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">HydroVision</span>
          <span>•</span>
          <span>Community Flood Resilience &amp; Emergency Management</span>
        </div>
        <div className="text-[11px] text-[#C5DDD0]/50 font-mono">
          Prototype Environment • Authorized Emergency Personnel
        </div>
      </footer>
    </div>
  );
}
