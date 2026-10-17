
"use client";

import { useMemo, useState } from "react";
import {
  ActivityIcon,
  AlertTriangleIcon,
  ClipboardCheckIcon,
  LifeBuoyIcon,
} from "@/components/hv/Icons";

type Report = {
  id: string;
  region: string;
  type: string;
  description: string;
  priority: "Critical" | "High" | "Moderate" | "Low";
  status: "Needs Verification" | "Under Review" | "Reviewed";
  source: string;
  time: string;
  water: "Rising" | "Stable" | "Unknown";
  road: "Blocked" | "Difficult" | "Accessible" | "Unknown";
  photo?: string;
};

const initialReports: Report[] = [
  {
    id: "RPT-004",
    region: "Kasbe Digraj",
    type: "Rising water level",
    description:
      "Water is reportedly rising near a low-lying settlement. Local conditions need to be checked.",
    priority: "Critical",
    status: "Needs Verification",
    source: "Community report",
    time: "09:18 AM",
    water: "Rising",
    road: "Unknown",
  },
  {
    id: "RPT-007",
    region: "Shahpur",
    type: "Road accessibility",
    description:
      "Heavy rain has reportedly made the approach road difficult to use.",
    priority: "High",
    status: "Under Review",
    source: "Field officer",
    time: "08:42 AM",
    water: "Unknown",
    road: "Difficult",
  },
  {
    id: "RPT-003",
    region: "Kheda",
    type: "Water accumulation",
    description:
      "Standing water has been reported near homes. Further details are needed.",
    priority: "High",
    status: "Needs Verification",
    source: "Community report",
    time: "07:56 AM",
    water: "Stable",
    road: "Difficult",
  },
  {
    id: "RPT-008",
    region: "Rajnagar",
    type: "Local conditions",
    description:
      "No major access issue is included in the current sample report.",
    priority: "Moderate",
    status: "Reviewed",
    source: "Field officer",
    time: "06:21 AM",
    water: "Stable",
    road: "Accessible",
  },
];

const regions = [
  { name: "Kasbe Digraj", level: "Critical", water: "Rising", x: 23, y: 31 },
  { name: "Shahpur", level: "High", water: "Unknown", x: 70, y: 28 },
  { name: "Kheda", level: "High", water: "Stable", x: 47, y: 67 },
  { name: "Rajnagar", level: "Moderate", water: "Stable", x: 25, y: 62 },
  { name: "Sujalpur", level: "Moderate", water: "Unknown", x: 78, y: 63 },
];

const priorityStyle: Record<Report["priority"], string> = {
  Critical: "border-red-400/30 bg-red-500/15 text-red-300",
  High: "border-orange-400/30 bg-orange-500/15 text-orange-300",
  Moderate: "border-amber-400/30 bg-amber-500/15 text-amber-300",
  Low: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300",
};

const statusStyle: Record<Report["status"], string> = {
  "Needs Verification": "text-amber-300 bg-amber-400/10",
  "Under Review": "text-sky-300 bg-sky-400/10",
  Reviewed: "text-emerald-300 bg-emerald-400/10",
};

export default function GroundReportsPage() {
  const [reports, setReports] = useState(initialReports);
  const [selectedId, setSelectedId] = useState("RPT-004");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [region, setRegion] = useState("Kasbe Digraj");
  const [type, setType] = useState("Rising water level");
  const [priority, setPriority] = useState<Report["priority"]>("High");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("Community report");
  const [water, setWater] = useState<Report["water"]>("Unknown");
  const [road, setRoad] = useState<Report["road"]>("Unknown");
  const [photo, setPhoto] = useState("");

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const matchesFilter =
          filter === "All" ||
          (filter === "Unverified" &&
            report.status === "Needs Verification") ||
          report.priority === filter;

        const searchText =
          `${report.id} ${report.region} ${report.type} ${report.description}`.toLowerCase();

        return matchesFilter && searchText.includes(search.toLowerCase());
      }),
    [reports, filter, search]
  );

  const selected =
    reports.find((report) => report.id === selectedId) ?? filteredReports[0];

  function updateStatus(status: Report["status"]) {
    if (!selected) return;

    setReports((current) =>
      current.map((report) =>
        report.id === selected.id ? { ...report, status } : report
      )
    );
    setNotice(`${selected.id} marked as ${status.toLowerCase()}.`);
  }

  function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const report: Report = {
      id: `RPT-${String(Date.now()).slice(-4)}`,
      region,
      type,
      description: description.trim(),
      priority,
      status: "Needs Verification",
      source,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      water,
      road,
      photo: photo || undefined,
    };

    setReports((current) => [report, ...current]);
    setSelectedId(report.id);
    setFilter("All");
    setSearch("");
    setDescription("");
    setPhoto("");
    setShowForm(false);
    setNotice(`${report.id} added. It is awaiting verification.`);
  }

  const criticalCount = reports.filter(
    (report) => report.priority === "Critical"
  ).length;
  const highCount = reports.filter(
    (report) => report.priority === "High"
  ).length;
  const pendingCount = reports.filter(
    (report) => report.status === "Needs Verification"
  ).length;

  return (
    <main className="min-h-screen space-y-6 bg-[#071812] p-4 text-emerald-50 sm:p-6 lg:p-8">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1500px] space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
              <ActivityIcon size={16} />
              Field intelligence / Regional monitoring
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ground Reports
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/55">
              Review local observations, regional conditions, and reported
              hazards in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowForm(!showForm);
                setNotice("");
              }}
              className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#062016] transition hover:bg-emerald-300"
            >
              + Submit ground report
            </button>
          </div>
        </div>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200"
          >
            <span>{notice}</span>
            <button
              onClick={() => setNotice("")}
              className="text-emerald-100/60 hover:text-white"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        {showForm && (
          <section className="rounded-2xl border border-emerald-400/25 bg-[#0b241b] p-5 shadow-2xl shadow-black/20 sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Submit a ground report</h2>
                <p className="mt-1 text-sm text-emerald-100/50">
                  A photo is optional. New reports start unverified.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={submitReport} className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Region</span>
                <select
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  {regions.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Observation type</span>
                <select
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  <option>Rising water level</option>
                  <option>Road blockage</option>
                  <option>House flooding</option>
                  <option>Evacuation assistance needed</option>
                  <option>Water accumulation</option>
                  <option>Other hazard</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Reported source</span>
                <select
                  value={source}
                  onChange={(event) => setSource(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  <option>Community report</option>
                  <option>Field officer</option>
                  <option>Local volunteer</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Initial priority</span>
                <select
                  value={priority}
                  onChange={(event) =>
                    setPriority(event.target.value as Report["priority"])
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  <option>Critical</option>
                  <option>High</option>
                  <option>Moderate</option>
                  <option>Low</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Observed water trend</span>
                <select
                  value={water}
                  onChange={(event) =>
                    setWater(event.target.value as Report["water"])
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  <option>Unknown</option>
                  <option>Rising</option>
                  <option>Stable</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="block text-emerald-100/70">Road access</span>
                <select
                  value={road}
                  onChange={(event) =>
                    setRoad(event.target.value as Report["road"])
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none focus:border-emerald-400"
                >
                  <option>Unknown</option>
                  <option>Blocked</option>
                  <option>Difficult</option>
                  <option>Accessible</option>
                </select>
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="block text-emerald-100/70">What was observed?</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  minLength={8}
                  maxLength={500}
                  placeholder="Describe the location and observed conditions..."
                  className="min-h-28 w-full rounded-xl border border-white/10 bg-[#061810] p-3 outline-none placeholder:text-white/25 focus:border-emerald-400"
                />
              </label>

              <label className="space-y-2 text-sm md:col-span-2">
                <span className="block text-emerald-100/70">
                  Optional photo evidence
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    if (file.size > 5 * 1024 * 1024) {
                      setNotice("Please choose an image smaller than 5 MB.");
                      event.target.value = "";
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      if (typeof reader.result === "string") {
                        setPhoto(reader.result);
                        setNotice("");
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="block w-full rounded-xl border border-dashed border-white/15 bg-[#061810] p-3 text-sm text-emerald-100/60 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-400/15 file:px-3 file:py-2 file:font-semibold file:text-emerald-200"
                />
                <span className="block text-xs text-emerald-100/40">
                  Images only, up to 5 MB. This demo previews the image locally;
                  it does not upload it to a server.
                </span>
                {photo && (
                  <img
                    src={photo}
                    alt="Selected optional evidence"
                    className="mt-3 max-h-56 rounded-xl border border-emerald-400/20 object-contain"
                  />
                )}
              </label>

              <div className="flex flex-wrap gap-3 pt-2 md:col-span-2">
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#062016] transition hover:bg-emerald-300"
                >
                  Submit report for review
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm text-white/70 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total reports",
              value: reports.length,
              detail: "Reports received",
              color: "text-emerald-300",
            },
            {
              label: "Critical priority",
              value: criticalCount,
              detail: "Requires prompt review",
              color: "text-red-300",
            },
            {
              label: "High priority",
              value: highCount,
              detail: "Needs timely attention",
              color: "text-orange-300",
            },
            {
              label: "Awaiting verification",
              value: pendingCount,
              detail: "Not yet confirmed",
              color: "text-amber-300",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-emerald-100/10 bg-[#0b241b]/90 p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/30"
            >
              <p className="text-sm text-emerald-100/55">{metric.label}</p>
              <div className={`mt-3 text-3xl font-semibold ${metric.color}`}>
                {metric.value}
              </div>
              <p className="mt-2 text-xs text-emerald-100/35">{metric.detail}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
          <div className="overflow-hidden rounded-2xl border border-emerald-100/10 bg-[#0b241b]/90">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 p-5">
              <div>
                <h2 className="text-lg font-semibold">Regional indicators</h2>
                <p className="mt-1 text-xs text-emerald-100/45">
                 Regional conditions and reported observations
                </p>
              </div>
              <span className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-200/70">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
               
              </span>
            </div>

            <div className="relative m-4 min-h-[340px] overflow-hidden rounded-xl border border-emerald-400/15 bg-[#071c16] sm:min-h-[410px]">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage:
                  "linear-gradient(rgba(52,211,153,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,.12) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14),transparent_70%)]" />

              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full opacity-40"
                aria-hidden="true"
              >
                <path
                  d="M-5 30 Q15 15 30 36 T60 43 T105 15 M-5 75 Q20 55 40 72 T75 64 T105 80 M35 -5 Q25 20 48 42 T40 105 M75 -5 Q60 25 72 45 T90 105"
                  fill="none"
                  stroke="#2dd4bf"
                  strokeWidth=".45"
                  strokeDasharray="1.5 1.2"
                />
                <path
                  d="M-5 49 Q20 38 34 55 T62 59 T105 42"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                />
              </svg>

              {regions.map((item) => {
                const colors: Record<string, string> = {
                  Critical: "bg-red-400 shadow-red-400/50",
                  High: "bg-orange-400 shadow-orange-400/50",
                  Moderate: "bg-amber-300 shadow-amber-300/50",
                  Low: "bg-emerald-400 shadow-emerald-400/50",
                };

                const isSelected = selected?.region === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      const matching = reports.find(
                        (report) => report.region === item.name
                      );
                      if (matching) setSelectedId(matching.id);
                      setNotice(
                        `${item.name}: sample ${item.level.toLowerCase()} indicator.`
                      );
                    }}
                    className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                    aria-label={`Select ${item.name}, sample ${item.level} indicator`}
                  >
                    <span className="relative flex h-7 w-7 items-center justify-center">
                      <span
                        className={`absolute inline-flex h-full w-full rounded-full opacity-30 ${colors[item.level]} ${item.level === "Critical" ? "animate-ping" : ""}`}
                      />
                      <span
                        className={`relative h-3.5 w-3.5 rounded-full border-2 border-[#071c16] shadow-lg ${colors[item.level]} ${isSelected ? "ring-4 ring-white/25" : ""}`}
                      />
                    </span>
                    <span
                      className={`whitespace-nowrap rounded-lg border px-2.5 py-1.5 text-left shadow-xl backdrop-blur ${isSelected ? "border-emerald-300/50 bg-emerald-950/95" : "border-white/10 bg-[#071c16]/90"}`}
                    >
                      <span className="block text-xs font-semibold">{item.name}</span>
                      <span className="block text-[10px] text-emerald-100/55">
                        {item.level} · Water {item.water.toLowerCase()}
                      </span>
                    </span>
                  </button>
                );
              })}

              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-3 rounded-xl border border-white/10 bg-[#071c16]/90 p-3 text-[11px] text-emerald-100/60 backdrop-blur">
                {[
                  ["bg-red-400", "Critical"],
                  ["bg-orange-400", "High"],
                  ["bg-amber-300", "Moderate"],
                  ["bg-emerald-400", "Low"],
                ].map(([color, label]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 border-t border-white/10 p-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-emerald-100/45">Water trend</p>
                <p className="mt-1 text-sm font-medium text-emerald-200">
                  Reported observations
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-emerald-100/45">Road access</p>
                <p className="mt-1 text-sm font-medium text-emerald-200">
                  Reported conditions
                </p>
              </div>
              <div className="rounded-xl bg-white/[0.03] p-3">
                <p className="text-xs text-emerald-100/45">Indicator source</p>
                <p className="mt-1 text-sm font-medium text-emerald-200">
                 Received Reports
                </p>
              </div>
            </div>
          </div>

         <aside
  id="report-details"
  className="scroll-mt-6 rounded-2xl border border-emerald-100/10 bg-[#0b241b]/90"
>
            <div className="border-b border-white/10 p-5">
              <h2 className="text-lg font-semibold">Report details</h2>
              <p className="mt-1 text-xs text-emerald-100/45">
                Select a report to inspect its observations.
              </p>
            </div>

            {selected ? (
              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${priorityStyle[selected.priority]}`}
                  >
                    {selected.priority} priority
                  </span>
                  <span className="text-xs text-emerald-100/40">
                    {selected.id}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">{selected.type}</h3>
                  <p className="mt-2 text-sm text-emerald-100/55">
                    {selected.region} · {selected.time}
                  </p>
                </div>

                <p className="text-sm leading-6 text-emerald-100/75">
                  {selected.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-emerald-100/45">Water trend</p>
                    <p className="mt-2 text-sm font-semibold">{selected.water}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-emerald-100/45">Road access</p>
                    <p className="mt-2 text-sm font-semibold">{selected.road}</p>
                  </div>
                </div>

                {selected.photo && (
                  <div>
                    <p className="mb-2 text-xs text-emerald-100/45">
                      Optional photo evidence
                    </p>
                    <img
                      src={selected.photo}
                      alt={`Evidence for ${selected.id}`}
                      className="max-h-64 w-full rounded-xl border border-emerald-400/20 object-contain"
                    />
                  </div>
                )}

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-emerald-100/45">Reported by</p>
                  <p className="mt-1 text-sm">{selected.source}</p>
                  <p className="mt-3 text-xs text-emerald-100/45">
                    Verification status
                  </p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${statusStyle[selected.status]}`}
                  >
                    {selected.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => updateStatus("Reviewed")}
                    disabled={selected.status === "Reviewed"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-bold text-[#062016] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ClipboardCheckIcon size={17} />
                    Mark as reviewed
                  </button>
                  <button
                    onClick={() => updateStatus("Under Review")}
                    disabled={selected.status === "Under Review"}
                    className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-emerald-100/75 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Keep under review
                  </button>
                </div>
              </div>
            ) : (
              <p className="p-5 text-sm text-emerald-100/50">
                No report matches your current filter.
              </p>
            )}
          </aside>
        </section>

        <section className="overflow-hidden rounded-2xl border border-emerald-100/10 bg-[#0b241b]/90">
          <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Report register</h2>
              <p className="mt-1 text-xs text-emerald-100/45">
                Search, filter, and inspect submitted observations.
              </p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search region, ID, or report..."
              className="w-full rounded-xl border border-white/10 bg-[#061810] px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-emerald-400 lg:max-w-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 px-5 pt-4">
            {["All", "Critical", "High", "Moderate", "Unverified"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                    filter === item
                      ? "border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                      : "border-white/10 text-emerald-100/50 hover:bg-white/5"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-y border-white/10 bg-white/[0.02] text-xs text-emerald-100/40">
                <tr>
                  <th className="px-5 py-4 font-medium">Report</th>
                  <th className="px-5 py-4 font-medium">Region</th>
                  <th className="px-5 py-4 font-medium">Priority</th>
                  <th className="px-5 py-4 font-medium">Review status</th>
                  <th className="px-5 py-4 font-medium">Time</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className={`transition hover:bg-emerald-400/[0.04] ${
                      selected?.id === report.id ? "bg-emerald-400/[0.06]" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium">{report.type}</p>
                      <p className="mt-1 text-xs text-emerald-100/35">
                        {report.id}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-emerald-100/65">
                      {report.region}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${priorityStyle[report.priority]}`}
                      >
                        {report.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-emerald-100/50">
                      {report.time}
                    </td>
                    <td className="px-5 py-4">
                     
<button
  onClick={() => {
    setSelectedId(report.id);
    document.getElementById("report-details")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }}
  className="rounded-lg border border-emerald-400/20 px-3 py-2 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
>
  Inspect
</button>
                    </td>
                  </tr>
                ))}
                {filteredReports.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-sm text-emerald-100/40"
                    >
                      No reports match this search or filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-emerald-100/35">
          <span className="flex items-center gap-2">
            <LifeBuoyIcon size={15} />
            HydroVision · Ground intelligence prototype
          </span>
          <span>Designed for review and decision support</span>
        </footer>
      </div>
    </main>
  );
}