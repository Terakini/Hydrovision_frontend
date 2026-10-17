
"use client";

import { useMemo, useState } from "react";

const incidents = [
  {
    id: "HV-1042",
    region: "North River",
    hazard: "Rising water",
    priority: "Critical",
    status: "Needs verification",
    time: "12 min ago",
    detail: "Field report indicates rapidly rising water near a riverside settlement.",
  },
  {
    id: "HV-1039",
    region: "East Crossing",
    hazard: "Road blockage",
    priority: "High",
    status: "Under review",
    time: "28 min ago",
    detail: "A reported road obstruction may affect access to nearby communities.",
  },
  {
    id: "HV-1035",
    region: "South Bank",
    hazard: "House flooding",
    priority: "High",
    status: "Needs verification",
    time: "41 min ago",
    detail: "A ground report describes water entering residential properties.",
  },
  {
    id: "HV-1028",
    region: "West Valley",
    hazard: "Water accumulation",
    priority: "Moderate",
    status: "Reviewed",
    time: "1 hr ago",
    detail: "Standing water reported in a low-lying area. Further monitoring may be useful.",
  },
];

const prompts = [
  "Which incidents need attention first?",
  "Summarize road accessibility concerns",
  "Which reports still need verification?",
  "Prepare a regional situation briefing",
];

export default function CopilotPage() {
  const [activeTab, setActiveTab] = useState<"copilot" | "sitrep">("copilot");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [filter, setFilter] = useState("All incidents");
  const [search, setSearch] = useState("");
  const [briefing, setBriefing] = useState(false);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      const matchesFilter =
        filter === "All incidents" ||
        (filter === "Critical" && incident.priority === "Critical") ||
        (filter === "Needs verification" &&
          incident.status === "Needs verification");

      const text =
        `${incident.id} ${incident.region} ${incident.hazard}`.toLowerCase();

      return matchesFilter && text.includes(search.toLowerCase());
    });
  }, [filter, search]);

  function askCopilot(prompt: string) {
    setQuestion(prompt);

    const critical = incidents.filter(
      (incident) => incident.priority === "Critical"
    );

    const unverified = incidents.filter(
      (incident) => incident.status === "Needs verification"
    );

    if (prompt.toLowerCase().includes("road")) {
      setAnswer(
        "ACCESSIBILITY ASSESSMENT\n\n" +
          incidents
            .filter((incident) =>
              incident.hazard.toLowerCase().includes("road")
            )
            .map(
              (incident) =>
                `${incident.region} — ${incident.detail} Report status: ${incident.status}.`
            )
            .join("\n\n") +
          "\n\nRecommended follow-up: verify the obstruction and confirm an alternative route before issuing travel guidance."
      );
    } else if (
      prompt.toLowerCase().includes("verification")
    ) {
      setAnswer(
        `VERIFICATION REVIEW\n\n${unverified
          .map(
            (incident) =>
              `${incident.id} · ${incident.region}\n${incident.hazard}: ${incident.detail}`
          )
          .join("\n\n")}\n\nRecommended follow-up: confirm the location, observation time and conditions with a field officer.`
      );
    } else if (prompt.toLowerCase().includes("briefing")) {
      setAnswer(
        `REGIONAL SITUATION SUMMARY\n\n${incidents.length} illustrative incident records are available in this workspace. ${critical.length} is marked critical, and ${unverified.length} require verification.\n\nPriority hazards include ${[...new Set(incidents.map((i) => i.hazard.toLowerCase()))].join(", ")}.\n\nRecommended follow-up: verify high-priority observations, assess access constraints and update the incident register as new evidence arrives.`
      );
    } else {
      setAnswer(
        `PRIORITY ASSESSMENT\n\n${[...incidents]
          .sort(
            (a, b) =>
              ["Critical", "High", "Moderate"].indexOf(a.priority) -
              ["Critical", "High", "Moderate"].indexOf(b.priority)
          )
          .slice(0, 3)
          .map(
            (incident, index) =>
              `${index + 1}. ${incident.region} — ${incident.hazard}\nPriority: ${incident.priority} · ${incident.status}\n${incident.detail}`
          )
          .join("\n\n")}\n\nRecommended follow-up: review the critical incident first, confirm the reported conditions and escalate only when supported by verified evidence.`
      );
    }

    setActiveTab("copilot");
  }

  function generateSitrep() {
    setBriefing(true);
    setActiveTab("sitrep");
  }

  return (
    <main className="min-h-screen bg-[#071B14] p-4 text-[#E5F4EB] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              HydroVision / Intelligence
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Intelligence Command
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/55">
              Turn incident observations into clear priorities, actionable
              insights and structured situation briefings.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] px-4 py-3 md:self-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
              ✳
            </div>
            <div>
              <p className="text-sm font-medium">Intelligence workspace</p>
              <p className="mt-1 text-xs text-emerald-100/45">
                Interactive prototype
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Incident records",
              value: incidents.length,
              note: "Available in workspace",
              icon: "◈",
            },
            {
              label: "Critical priority",
              value: incidents.filter((i) => i.priority === "Critical").length,
              note: "Review priority",
              icon: "⚠",
            },
            {
              label: "Awaiting verification",
              value: incidents.filter(
                (i) => i.status === "Needs verification"
              ).length,
              note: "Evidence required",
              icon: "⌕",
            },
            {
              label: "Reviewed",
              value: incidents.filter((i) => i.status === "Reviewed").length,
              note: "Review status recorded",
              icon: "✓",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-emerald-100/[0.09] bg-[#0B261B] p-5 transition hover:border-emerald-300/25"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-100/60">
                  {metric.label}
                </span>
                <span className="text-lg text-emerald-300">{metric.icon}</span>
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {metric.value.toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs text-emerald-100/40">{metric.note}</p>
            </div>
          ))}
        </section>

        <div className="flex gap-2 border-b border-emerald-100/10">
          <button
            onClick={() => setActiveTab("copilot")}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "copilot"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-emerald-100/45 hover:text-emerald-100"
            }`}
          >
            ✳ Copilot
          </button>
          <button
            onClick={() => setActiveTab("sitrep")}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              activeTab === "sitrep"
                ? "border-emerald-400 text-emerald-300"
                : "border-transparent text-emerald-100/45 hover:text-emerald-100"
            }`}
          >
            ◫ Situation Reports
          </button>
        </div>

        {activeTab === "copilot" ? (
          <section className="grid items-start gap-5 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-hidden rounded-2xl border border-emerald-300/15 bg-[#0B261B]">
              <div className="border-b border-emerald-100/10 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-400/10 text-xl text-emerald-300">
                    ✳
                  </div>
                  <div>
                    <h2 className="font-semibold">HydroVision Copilot</h2>
                    <p className="mt-1 text-xs text-emerald-100/45">
                      Incident analysis and response guidance
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-100/45">
                    Suggested queries
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => askCopilot(prompt)}
                        className="rounded-xl border border-emerald-100/10 bg-[#071B14] p-3 text-left text-sm leading-5 text-emerald-100/75 transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.04]"
                      >
                        {prompt}
                        <span className="ml-2 text-emerald-400">↗</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (question.trim()) askCopilot(question.trim());
                  }}
                  className="space-y-3"
                >
                  <label
                    htmlFor="copilot-question"
                    className="block text-sm font-medium"
                  >
                    Ask about the incident register
                  </label>
                  <textarea
                    id="copilot-question"
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="e.g. Summarize the highest-priority hazards..."
                    rows={3}
                    className="w-full resize-y rounded-xl border border-emerald-100/10 bg-[#071B14] p-4 text-sm outline-none transition placeholder:text-emerald-100/25 focus:border-emerald-400/50"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#062015] transition hover:bg-emerald-300 sm:w-auto"
                  >
                    Analyse incidents <span className="ml-2">→</span>
                  </button>
                </form>

                {answer && (
                  <div className="rounded-xl border border-emerald-300/20 bg-[#071B14] p-5">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
                      <span>✳</span> Analysis
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-emerald-50/80">
                      {answer}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100/[0.09] bg-[#0B261B] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Incident intelligence</h2>
                  <p className="mt-1 text-xs text-emerald-100/45">
                    Search and prioritize available records
                  </p>
                </div>
                <span className="text-xl text-emerald-300">⌕</span>
              </div>

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search region, hazard or ID..."
                className="mt-5 w-full rounded-xl border border-emerald-100/10 bg-[#071B14] px-4 py-3 text-sm outline-none placeholder:text-emerald-100/25 focus:border-emerald-400/40"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {["All incidents", "Critical", "Needs verification"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`rounded-full border px-3 py-2 text-xs transition ${
                        filter === item
                          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                          : "border-emerald-100/10 text-emerald-100/50 hover:border-emerald-100/25"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>

              <div className="mt-5 space-y-3">
                {filteredIncidents.length === 0 ? (
                  <p className="rounded-xl border border-emerald-100/10 p-4 text-sm text-emerald-100/50">
                    No incident records match these filters.
                  </p>
                ) : (
                  filteredIncidents.map((incident) => (
                    <button
                      key={incident.id}
                      onClick={() =>
                        askCopilot(
                          `Explain the priority and follow-up needed for ${incident.id} in ${incident.region}`
                        )
                      }
                      className="w-full rounded-xl border border-emerald-100/[0.08] bg-[#071B14]/70 p-4 text-left transition hover:border-emerald-300/30"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            {incident.region}
                          </p>
                          <p className="mt-1 text-xs text-emerald-100/45">
                            {incident.id} · {incident.time}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                            incident.priority === "Critical"
                              ? "bg-red-400/10 text-red-300"
                              : incident.priority === "High"
                                ? "bg-amber-300/10 text-amber-200"
                                : "bg-emerald-300/10 text-emerald-300"
                          }`}
                        >
                          {incident.priority}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-emerald-100/75">
                        {incident.hazard}
                      </p>
                      <p className="mt-2 text-xs text-emerald-100/40">
                        {incident.status}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </section>
        ) : (
          <section className="grid items-start gap-5 xl:grid-cols-[1fr_0.7fr]">
            <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Operational briefing
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">
                    Situation Report
                  </h2>
                  <p className="mt-2 text-sm text-emerald-100/45">
                    Structured overview of the available incident register
                  </p>
                </div>
                <button
                  onClick={generateSitrep}
                  className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#062015] transition hover:bg-emerald-300"
                >
                  Generate SITREP →
                </button>
              </div>

              {briefing ? (
                <div className="mt-7 space-y-5">
                  <div className="border-b border-emerald-100/10 pb-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">
                      01 / Situation overview
                    </p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50/75">
                      The current workspace contains {incidents.length} incident
                      records across {new Set(incidents.map((i) => i.region)).size}{" "}
                      regions. One record is marked critical and requires
                      priority review.
                    </p>
                  </div>

                  <div className="border-b border-emerald-100/10 pb-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">
                      02 / Priority incidents
                    </p>
                    {incidents
                      .filter(
                        (incident) =>
                          incident.priority === "Critical" ||
                          incident.priority === "High"
                      )
                      .map((incident) => (
                        <p
                          key={incident.id}
                          className="mt-3 text-sm leading-6 text-emerald-50/75"
                        >
                          <strong>{incident.region}:</strong> {incident.hazard}.
                          {" "}{incident.detail}
                        </p>
                      ))}
                  </div>

                  <div className="border-b border-emerald-100/10 pb-4">
                    <p className="text-xs uppercase tracking-wider text-emerald-300">
                      03 / Verification gaps
                    </p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50/75">
                      {incidents.filter(
                        (incident) =>
                          incident.status === "Needs verification"
                      ).length}{" "}
                      reports require verification. Confirm location, time and
                      conditions before treating reported hazards as established
                      facts.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-emerald-300">
                      04 / Recommended follow-up
                    </p>
                    <p className="mt-2 text-sm leading-6 text-emerald-50/75">
                      Review critical reports first, verify reported road
                      obstructions and update each incident as additional
                      evidence becomes available.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      window.print()
                    }
                    className="rounded-xl border border-emerald-300/20 px-4 py-3 text-sm text-emerald-200 transition hover:bg-emerald-300/[0.06]"
                  >
                    Print / Save as PDF
                  </button>
                </div>
              ) : (
                <div className="mt-7 rounded-xl border border-dashed border-emerald-100/15 px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-400/10 text-2xl text-emerald-300">
                    ◫
                  </div>
                  <h3 className="mt-4 font-medium">
                    Ready to prepare a briefing
                  </h3>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-emerald-100/45">
                    Generate a structured report containing the situation
                    overview, priority incidents, verification gaps and
                    recommended follow-up.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
              <h3 className="font-semibold">Briefing contents</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-100/45">
                Every generated SITREP follows a consistent structure.
              </p>
              <div className="mt-5 space-y-4">
                {[
                  ["01", "Situation overview", "Regional incident summary"],
                  ["02", "Priority incidents", "Highest-priority reported hazards"],
                  ["03", "Verification gaps", "Reports awaiting confirmation"],
                  ["04", "Recommended follow-up", "Suggested officer actions"],
                ].map(([number, title, description]) => (
                  <div key={number} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-xs font-semibold text-emerald-300">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="mt-1 text-xs leading-5 text-emerald-100/40">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-emerald-100/[0.08] pt-4 text-xs leading-5 text-emerald-100/35">
          Intelligence is based on the records currently available in this
          prototype. Recommendations support officer review and do not replace
          field verification or emergency procedures.
        </footer>
      </div>
    </main>
  );
}