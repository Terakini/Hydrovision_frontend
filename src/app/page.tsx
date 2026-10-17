
import Link from "next/link";

function RiverIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M3 5c5 0 5 5 10 5s5-5 8-5" />
      <path d="M3 12c5 0 5 5 10 5s5-5 8-5" />
      <path d="M3 19c5 0 5-5 10-5" />
    </svg>
  );
}

function RainIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M7 15a5 5 0 0 1-.5-10A7 7 0 0 1 20 8a4 4 0 0 1-1 7" />
      <path d="m8 17-1 3m7-3-1 3m7-3-1 3" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
      <path d="M9 3v15m6-12v15" />
      <path d="M12 7c-2 2-2 3-2 4a2 2 0 0 0 4 0c0-1-1-2-2-4Z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

function GaugeCard() {
  return (
    <div className="glass-card float-slow w-[224px] rounded-2xl p-4 sm:w-[248px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
            <RiverIcon />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">River monitor</p>
            <p className="text-[11px] text-emerald-100/50">Gauge visualization</p>
          </div>
        </div>
        <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/50">
            Water level
          </p>
          <p className="mt-1 text-sm font-medium text-white">
            Monitoring active
          </p>
        </div>
        <span className="text-xs text-emerald-300">Illustrative</span>
      </div>

      <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/[0.07]">
        <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-300" />
        <span className="absolute left-[72%] top-0 h-full w-px bg-amber-300" />
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-emerald-100/40">
        <span>Low</span>
        <span>Warning threshold</span>
      </div>
    </div>
  );
}

function RainCard() {
  return (
    <div className="glass-card float-medium w-[190px] rounded-2xl p-4 sm:w-[205px]">
      <div className="flex items-center gap-2.5">
        <div className="rounded-xl bg-teal-300/10 p-2 text-teal-200">
          <RainIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Rainfall watch</p>
          <p className="text-[11px] text-emerald-100/50">Weather intelligence</p>
        </div>
      </div>

      <div className="mt-5 flex h-10 items-end gap-1.5">
        {[30, 48, 37, 65, 46, 82, 57, 72, 43, 62, 35, 53].map(
          (height, index) => (
            <div
              key={index}
              className="rain-bar flex-1 rounded-t-sm bg-gradient-to-t from-emerald-600/60 to-teal-300"
              style={{
                height: `${height}%`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          )
        )}
      </div>

      <p className="mt-3 text-[11px] text-emerald-100/55">
        Rainfall trend visualization
      </p>
    </div>
  );
}

function MapCard() {
  return (
    <div className="glass-card float-medium w-[190px] rounded-2xl p-4 sm:w-[205px]">
      <div className="flex items-center gap-2.5">
        <div className="rounded-xl bg-emerald-400/10 p-2 text-emerald-300">
          <MapIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Flood mapping</p>
          <p className="text-[11px] text-emerald-100/50">Geospatial intelligence</p>
        </div>
      </div>

      <div className="map-grid relative mt-4 h-[86px] overflow-hidden rounded-xl border border-emerald-300/10">
        <svg
          viewBox="0 0 200 86"
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          fill="none"
          aria-label="Illustrative river map"
        >
          <path d="M-10 12 C35 45 52 -5 92 27 S150 75 210 35"
            stroke="#2FA36B" strokeWidth="17" opacity=".14" />
          <path d="M-10 12 C35 45 52 -5 92 27 S150 75 210 35"
            stroke="#55D9BD" strokeWidth="2" strokeDasharray="5 5"
            className="river-dash" />
          <path d="M5 70 Q50 30 90 68 T205 12"
            stroke="#76BFA1" strokeWidth="1" opacity=".35" />
          <circle cx="92" cy="27" r="5" fill="#F5C66D" opacity=".95" />
          <circle cx="92" cy="27" r="10" stroke="#F5C66D" opacity=".5"
            className="map-pulse" />
          <circle cx="158" cy="58" r="3" fill="#55D9BD" />
        </svg>
      </div>
      <p className="mt-3 text-[11px] text-emerald-100/55">
        Illustrative river and monitoring locations
      </p>
    </div>
  );
}

function AlertCard() {
  return (
    <div className="glass-card float-slow w-[205px] rounded-2xl p-3.5 sm:w-[220px]">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-amber-300/10 p-2 text-amber-200">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <path d="m12 3 9 16H3L12 3Z" />
            <path d="M12 9v4m0 3h.01" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Early warning system</p>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-100/55">
            River thresholds and risk alerts in one view.
          </p>
          <p className="mt-2 text-[10px] font-medium uppercase tracking-wider text-amber-200/80">
            Alert interface preview
          </p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
   <main className="hydro-page relative flex min-h-screen flex-col overflow-x-clip bg-[#061912] text-[#E8F6EE] selection:bg-emerald-400/30 selection:text-white">


      {/* Cinematic river background */}
      <div className="river-backdrop pointer-events-none absolute inset-0 -z-20" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(4,23,16,0.18)_50%,rgba(4,23,16,0.72)_100%)]" />

      {/* Animated river contour lines */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-30"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        aria-hidden="true"
      >
        <path d="M-100 210 C170 70 230 330 460 220 S780 90 980 220 S1280 340 1550 130"
          stroke="#58D6AC" strokeWidth="1" strokeDasharray="5 12" className="river-dash" />
        <path d="M-100 250 C170 110 230 370 460 260 S780 130 980 260 S1280 380 1550 170"
          stroke="#58D6AC" strokeWidth="1" opacity=".55" />
        <path d="M-100 650 C140 480 310 760 510 620 S860 480 1060 650 S1340 730 1550 560"
          stroke="#39AFA0" strokeWidth="1" strokeDasharray="4 14" className="river-dash" />
        <path d="M-100 690 C140 520 310 800 510 660 S860 520 1060 690 S1340 770 1550 600"
          stroke="#39AFA0" strokeWidth="1" opacity=".5" />
      </svg>

      {/* Header */}
      <header className="relative z-20 mx-auto flex w-full max-w-[1500px] items-center justify-between px-5 py-5 sm:px-9 sm:py-7 lg:px-14">
        <Link href="/" aria-label="HydroVision home" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200/20 bg-gradient-to-br from-[#36B978] to-[#10573B] text-white shadow-lg shadow-emerald-950/40 transition-transform duration-300 group-hover:scale-105">
            <RiverIcon size={25} />
          </div>
          <div>
            <span className="block text-lg font-bold tracking-tight text-white sm:text-xl">
              HydroVision
            </span>
            <span className="block text-[9px] font-medium uppercase tracking-[.22em] text-emerald-200/75 sm:text-[10px]">
              Flood intelligence
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2.5 rounded-full border border-white/10 bg-[#08271D]/65 px-4 py-2 backdrop-blur-xl sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
          </span>
          <span className="text-[11px] font-medium tracking-wide text-emerald-50/75">
            RIVER BASIN INTELLIGENCE
          </span>
        </div>
                <Link
          href="/login"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200/25 bg-[#08271D]/75 px-4 py-2.5 text-sm font-semibold text-emerald-50 backdrop-blur-xl transition duration-300 hover:border-emerald-200/50 hover:bg-emerald-400/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
        >
          Sign In
          <ArrowIcon />
        </Link>
      </header>

      {/* Main hero */}
      <section className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-1 flex-col items-center justify-center px-5 pb-16 pt-10 text-center sm:px-9 sm:pb-20 lg:px-14 lg:pt-6">

        {/* Floating intelligence panels — desktop */}
        <div className="pointer-events-none absolute left-[5%] top-[13%] hidden lg:block xl:left-[9%]">
          <GaugeCard />
        </div>
        <div className="pointer-events-none absolute right-[5%] top-[17%] hidden lg:block xl:right-[9%]">
          <RainCard />
        </div>
        <div className="pointer-events-none absolute bottom-[15%] left-[8%] hidden lg:block xl:left-[12%]">
          <MapCard />
        </div>
        <div className="pointer-events-none absolute bottom-[18%] right-[7%] hidden lg:block xl:right-[11%]">
          <AlertCard />
        </div>

        {/* Main headline */}
        <div className="hero-reveal relative mx-auto max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-200/20 bg-[#0A3022]/65 px-4 py-2 shadow-lg shadow-black/10 backdrop-blur-xl">
            <span className="text-emerald-300"><RiverIcon size={15} /></span>
            <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-emerald-50/85 sm:text-xs">
              See the signals. Understand the risk.
            </span>
          </div>

          <h1 className="text-5xl font-semibold leading-[1.03] tracking-[-.055em] text-white sm:text-7xl md:text-8xl lg:text-[100px]">
            Hydro<span className="bg-gradient-to-r from-[#83E6B1] via-[#43CDA0] to-[#7BE2DE] bg-clip-text text-transparent">Vision</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-xl font-medium leading-snug tracking-tight text-white/95 sm:mt-8 sm:text-2xl md:text-3xl">
            See the risks.
            <span className="text-emerald-300"> Protect the communities.</span>
          </p>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-emerald-50/70 sm:text-base sm:leading-8">
            Turning river intelligence into earlier warnings,
            clearer flood-risk insights, and safer communities.
          </p>
        </div>

        {/* Primary action */}
        <div className="hero-reveal-delay relative z-20 mt-9 flex flex-col items-center gap-4 sm:mt-10">
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl border border-emerald-100/30 bg-gradient-to-r from-[#2FA36B] to-[#218B70] px-7 py-4 text-sm font-bold text-white shadow-[0_10px_50px_rgba(26,163,107,0.25)] transition duration-300 hover:-translate-y-1 hover:border-emerald-100/50 hover:from-[#39BC7C] hover:to-[#28A88A] hover:shadow-[0_14px_55px_rgba(26,163,107,0.38)] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:ring-offset-2 focus:ring-offset-[#071F16] active:translate-y-0 sm:px-9 sm:py-[18px] sm:text-base"
          >
            <span>Enter HydroVision</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">
              <ArrowIcon />
            </span>
          </Link>

          <p className="text-[10px] font-medium uppercase tracking-[.2em] text-emerald-50/40 sm:text-[11px]">
            Flood intelligence · Community resilience
          </p>
        </div>

        {/* Supporting flood-intelligence panels — mobile and tablet */}
        <div className="hero-reveal-late mt-14 grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
          <GaugeCard />
          <RainCard />
          <MapCard />
          <AlertCard />
        </div>

        {/* Bottom visual signature */}
        <div className="mt-12 flex items-center gap-3 text-emerald-100/35 sm:mt-16">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-emerald-300/40" />
          <span className="text-[9px] font-medium uppercase tracking-[.25em] sm:text-[10px]">
            Read the river. Prepare for what comes next.
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-emerald-300/40" />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-2 border-t border-emerald-100/[0.08] px-5 py-5 text-center sm:flex-row sm:px-9 sm:text-left lg:px-14">
        <p className="text-[11px] text-emerald-50/45">
          <span className="font-semibold text-emerald-50/75">HydroVision</span>
          <span className="mx-2 text-emerald-300/35">/</span>
          Flood intelligence for community resilience
        </p>
        <p className="text-[10px] text-emerald-50/30">
          Prototype environment · Monitoring visuals may be illustrative
        </p>
      </footer>
    </main>
  );
}