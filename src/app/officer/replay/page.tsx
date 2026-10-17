
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarClock,
  CloudRain,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  ShieldAlert,
  SkipBack,
  SkipForward,
  Waves,
} from "lucide-react";

type Risk = "LOW" | "MODERATE" | "HIGH" | "SEVERE";

type TimelineStep = {
  day: string;
  level: number;
  rainfall: number;
  risk: Risk;
  location: string;
  event: string;
};

type Scenario = {
  id: string;
  name: string;
  river: string;
  region: string;
  description: string;
  steps: TimelineStep[];
};

const scenarios: Scenario[] = [
  {
    id: "godavari",
    name: "Godavari Basin",
    river: "Godavari River",
    region: "Maharashtra",
    description: "Illustrative river-rise scenario",
    steps: [
      { day: "Day 01", level: 18, rainfall: 22, risk: "LOW", location: "Upstream monitoring zone", event: "Baseline conditions established." },
      { day: "Day 02", level: 25, rainfall: 38, risk: "LOW", location: "Upstream monitoring zone", event: "Rainfall begins increasing across the illustrative catchment." },
      { day: "Day 03", level: 36, rainfall: 54, risk: "MODERATE", location: "Mid-basin observation zone", event: "The simulated water-level index rises." },
      { day: "Day 04", level: 49, rainfall: 72, risk: "HIGH", location: "Mid-basin observation zone", event: "The scenario enters its high-risk phase." },
      { day: "Day 05", level: 72, rainfall: 91, risk: "SEVERE", location: "Downstream observation zone", event: "Illustrative peak conditions are reached." },
      { day: "Day 06", level: 65, rainfall: 62, risk: "HIGH", location: "Downstream observation zone", event: "Rainfall decreases while the level index remains elevated." },
      { day: "Day 07", level: 48, rainfall: 35, risk: "MODERATE", location: "Downstream observation zone", event: "The simulated level index begins receding." },
      { day: "Day 08", level: 31, rainfall: 18, risk: "LOW", location: "Recovery monitoring zone", event: "The scenario returns toward its baseline." },
    ],
  },
  {
    id: "krishna",
    name: "Krishna Basin",
    river: "Krishna River",
    region: "Maharashtra",
    description: "Illustrative rainfall and runoff scenario",
    steps: [
      { day: "Day 01", level: 15, rainfall: 16, risk: "LOW", location: "Upper-basin observation zone", event: "The scenario begins with a low level index." },
      { day: "Day 02", level: 21, rainfall: 29, risk: "LOW", location: "Upper-basin observation zone", event: "Rainfall increases gradually." },
      { day: "Day 03", level: 30, rainfall: 48, risk: "MODERATE", location: "Mid-basin observation zone", event: "The simulated level index continues to rise." },
      { day: "Day 04", level: 43, rainfall: 65, risk: "HIGH", location: "Mid-basin observation zone", event: "The scenario moves into a high-risk phase." },
      { day: "Day 05", level: 61, rainfall: 84, risk: "SEVERE", location: "Downstream observation zone", event: "The illustrative scenario reaches its peak." },
      { day: "Day 06", level: 57, rainfall: 68, risk: "HIGH", location: "Downstream observation zone", event: "The level index remains elevated after peak rainfall." },
      { day: "Day 07", level: 40, rainfall: 32, risk: "MODERATE", location: "Recovery observation zone", event: "The simulated level index declines." },
      { day: "Day 08", level: 26, rainfall: 17, risk: "LOW", location: "Recovery observation zone", event: "Conditions approach the scenario baseline." },
    ],
  },
  {
    id: "tapi",
    name: "Tapi Basin",
    river: "Tapi River",
    region: "Maharashtra",
    description: "Illustrative rapid-rise scenario",
    steps: [
      { day: "Day 01", level: 12, rainfall: 20, risk: "LOW", location: "Upstream observation zone", event: "The scenario starts near its baseline." },
      { day: "Day 02", level: 19, rainfall: 35, risk: "LOW", location: "Upstream observation zone", event: "Rainfall begins to build." },
      { day: "Day 03", level: 33, rainfall: 61, risk: "MODERATE", location: "Mid-basin observation zone", event: "The level index rises more quickly." },
      { day: "Day 04", level: 56, rainfall: 86, risk: "HIGH", location: "Mid-basin observation zone", event: "The simulation enters a high-risk phase." },
      { day: "Day 05", level: 78, rainfall: 96, risk: "SEVERE", location: "Downstream observation zone", event: "The highest illustrative level index is reached." },
      { day: "Day 06", level: 62, rainfall: 59, risk: "HIGH", location: "Downstream observation zone", event: "The index starts receding after the simulated peak." },
      { day: "Day 07", level: 42, rainfall: 31, risk: "MODERATE", location: "Recovery observation zone", event: "The simulated level index continues to fall." },
      { day: "Day 08", level: 24, rainfall: 15, risk: "LOW", location: "Recovery observation zone", event: "The scenario moves toward recovery." },
    ],
  },
];

const speeds = [0.5, 1, 2, 4];

const riskStyles: Record<Risk, string> = {
  LOW: "border-emerald-300 bg-emerald-950 text-emerald-100",
  MODERATE: "border-yellow-300 bg-yellow-950 text-yellow-100",
  HIGH: "border-orange-300 bg-orange-950 text-orange-100",
  SEVERE: "border-red-300 bg-red-950 text-red-100",
};

const panelClass =
  "rounded-2xl border border-emerald-300/40 bg-[#0B2A1F] p-5 shadow-lg shadow-black/20";

export default function ReplayControlPage() {
  const [scenarioId, setScenarioId] = useState("godavari");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const scenario = useMemo(
    () => scenarios.find((item) => item.id === scenarioId) ?? scenarios[0],
    [scenarioId]
  );

  const current = scenario.steps[step];

  useEffect(() => {
    if (!playing) return;

    const timer = window.setInterval(() => {
      setStep((previous) => {
        if (previous >= scenario.steps.length - 1) {
          setPlaying(false);
          return previous;
        }
        return previous + 1;
      });
    }, 1800 / speed);

    return () => window.clearInterval(timer);
  }, [playing, speed, scenario]);

  function changeScenario(value: string) {
    setScenarioId(value);
    setStep(0);
    setPlaying(false);
  }

  function resetReplay() {
    setStep(0);
    setPlaying(false);
  }

  const chartWidth = 760;
  const chartHeight = 220;
  const chartLeft = 48;
  const chartTop = 20;
  const plotWidth = 690;
  const plotHeight = 155;

  const points = scenario.steps.map((item, index) => {
    const x = chartLeft + (index / (scenario.steps.length - 1)) * plotWidth;
    const y = chartTop + plotHeight - (item.level / 100) * plotHeight;
    return { x, y };
  });

  const chartLine = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const chartArea =
    `${chartLine} L ${points[points.length - 1].x} ${chartTop + plotHeight}` +
    ` L ${points[0].x} ${chartTop + plotHeight} Z`;

  const selectedPoint = points[step];

  return (
    <div className="min-h-full space-y-6 rounded-xl bg-[#061A13] p-1 text-white">
      {/* Page heading */}
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-emerald-300/40 bg-[#0B2A1F] p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-900">
            <CalendarClock className="text-white" size={28} />
          </div>

          <div>
            <h1 className="!text-3xl !font-bold !leading-tight !text-white sm:!text-4xl">
              Replay Control
            </h1>
            <p className="mt-2 !text-sm !leading-6 !text-white">
              Explore flood progression through a controllable scenario timeline.
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border-2 border-purple-300 bg-purple-950 px-4 py-3 !text-xs !font-bold !text-white">
          <span className="h-2.5 w-2.5 rounded-full bg-purple-300" />
          SIMULATION WORKSPACE
        </div>
      </section>

      {/* Data disclaimer */}
      <section className="flex items-start gap-3 rounded-2xl border-2 border-amber-300 bg-[#29200B] p-5">
        <ShieldAlert className="mt-0.5 shrink-0 text-amber-300" size={24} />
        <div>
          <h2 className="!text-base !font-bold !text-amber-200">
            Illustrative scenario — not live or verified historical data
          </h2>
          <p className="mt-2 !text-sm !leading-6 !text-white">
            All water-level indices, rainfall indices, risk labels, locations,
            and timeline events on this page are synthetic values for interface
            testing. They are not measured metres, official danger thresholds,
            forecasts, or evacuation instructions.
          </p>
        </div>
      </section>

      {/* Scenario selector and playback controls */}
      <section className={`${panelClass} space-y-5`}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-md">
            <label
              htmlFor="scenario"
              className="mb-2 block !text-sm !font-bold !text-white"
            >
              SELECT FLOOD SCENARIO
            </label>
            <select
              id="scenario"
              value={scenarioId}
              onChange={(event) => changeScenario(event.target.value)}
              className="w-full rounded-xl border-2 border-emerald-300 bg-[#061A13] px-4 py-3 !text-sm !font-semibold !text-white outline-none focus:border-white"
            >
              {scenarios.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                  className="bg-[#061A13] text-white"
                >
                  {item.name}
                </option>
              ))}
            </select>
            <p className="mt-2 !text-sm !text-white">
              {scenario.river} · {scenario.region} · {scenario.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={resetReplay}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-[#123C2B] px-4 py-3 !text-sm !font-bold !text-white hover:bg-[#1B513A]"
            >
              <RotateCcw size={17} />
              Reset
            </button>

            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-[#123C2B] px-4 py-3 !text-sm !font-bold !text-white hover:bg-[#1B513A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SkipBack size={17} />
              Previous
            </button>

            <button
              type="button"
              onClick={() => {
                if (step === scenario.steps.length - 1 && !playing) {
                  setStep(0);
                }
                setPlaying((value) => !value);
              }}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-emerald-200 bg-emerald-500 px-5 py-3 !text-sm !font-bold !text-[#061A13] hover:bg-emerald-300"
            >
              {playing ? <Pause size={17} /> : <Play size={17} />}
              {playing ? "Pause replay" : "Play replay"}
            </button>

            <button
              type="button"
              onClick={() =>
                setStep((value) =>
                  Math.min(scenario.steps.length - 1, value + 1)
                )
              }
              disabled={step === scenario.steps.length - 1}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-[#123C2B] px-4 py-3 !text-sm !font-bold !text-white hover:bg-[#1B513A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <SkipForward size={17} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-emerald-300/40 pt-4">
          <span className="!text-sm !font-bold !text-white">PLAYBACK SPEED</span>
          {speeds.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSpeed(value)}
              aria-pressed={speed === value}
              className={`rounded-lg border px-4 py-2 !text-sm !font-bold ${
                speed === value
                  ? "border-emerald-200 bg-emerald-400 !text-[#061A13]"
                  : "border-emerald-200 bg-[#061A13] !text-white hover:bg-[#17402F]"
              }`}
            >
              {value}×
            </button>
          ))}
          <span className="ml-auto !text-sm !font-semibold !text-white">
            {playing ? "Replay running" : "Replay paused"} · {current.day}
          </span>
        </div>
      </section>

      {/* Key indicators */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <p className="!text-sm !font-bold !text-white">Water-level index</p>
            <Waves className="text-emerald-200" size={22} />
          </div>
          <p className="mt-4 !text-4xl !font-bold !text-white">
            {current.level}
            <span className="ml-2 !text-sm !font-semibold !text-white">/ 100</span>
          </p>
          <p className="mt-2 !text-xs !font-semibold !text-emerald-100">
            Illustrative index — not metres
          </p>
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <p className="!text-sm !font-bold !text-white">Rainfall index</p>
            <CloudRain className="text-sky-200" size={22} />
          </div>
          <p className="mt-4 !text-4xl !font-bold !text-white">
            {current.rainfall}
            <span className="ml-2 !text-sm !font-semibold !text-white">/ 100</span>
          </p>
          <p className="mt-2 !text-xs !font-semibold !text-sky-100">
            Illustrative index — not rainfall in mm
          </p>
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <p className="!text-sm !font-bold !text-white">Scenario risk</p>
            <Activity className="text-amber-200" size={22} />
          </div>
          <div className="mt-4">
            <span
              className={`inline-flex rounded-lg border-2 px-3 py-2 !text-lg !font-bold ${riskStyles[current.risk]}`}
            >
              {current.risk}
            </span>
          </div>
          <p className="mt-3 !text-xs !font-semibold !text-white">
            Illustrative label, not an official warning
          </p>
        </div>

        <div className={panelClass}>
          <div className="flex items-center justify-between">
            <p className="!text-sm !font-bold !text-white">Timeline position</p>
            <CalendarClock className="text-purple-200" size={22} />
          </div>
          <p className="mt-4 !text-4xl !font-bold !text-white">
            {step + 1}
            <span className="ml-2 !text-sm !font-semibold !text-white">
              / {scenario.steps.length}
            </span>
          </p>
          <p className="mt-2 !text-xs !font-semibold !text-white">
            {current.day} of the selected scenario
          </p>
        </div>
      </section>

      {/* Timeline chart */}
      <section className={`${panelClass} space-y-5`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="!text-xl !font-bold !text-white">
              Scenario progression
            </h2>
            <p className="mt-1 !text-sm !text-white">
              Water-level and rainfall indices across the selected timeline.
            </p>
          </div>
          <span className="w-fit rounded-lg border border-emerald-200 bg-[#061A13] px-3 py-2 !text-xs !font-bold !text-white">
            {scenario.name}
          </span>
        </div>

        <div className="w-full overflow-x-auto rounded-xl border border-emerald-300/40 bg-[#061A13] p-3">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="h-auto min-w-[600px] w-full"
            role="img"
            aria-label="Illustrative water-level index timeline chart"
          >
            {[0, 25, 50, 75, 100].map((value) => {
              const y = chartTop + plotHeight - (value / 100) * plotHeight;
              return (
                <g key={value}>
                  <line
                    x1={chartLeft}
                    y1={y}
                    x2={chartLeft + plotWidth}
                    y2={y}
                    stroke="#37614D"
                    strokeDasharray="4 5"
                  />
                  <text
                    x={chartLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            <path d={chartArea} fill="#10B981" fillOpacity="0.18" />
            <path
              d={chartLine}
              fill="none"
              stroke="#6EE7B7"
              strokeWidth="4"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {points.map((point, index) => (
              <g key={scenario.steps[index].day}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={index === step ? 7 : 4}
                  fill={index === step ? "#FFFFFF" : "#34D399"}
                  stroke="#064E3B"
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={chartTop + plotHeight + 24}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight={index === step ? "700" : "500"}
                >
                  {scenario.steps[index].day.replace("Day ", "D")}
                </text>
              </g>
            ))}

            <line
              x1={selectedPoint.x}
              y1={chartTop}
              x2={selectedPoint.x}
              y2={chartTop + plotHeight}
              stroke="#FFFFFF"
              strokeDasharray="5 4"
              strokeWidth="1.5"
              opacity="0.9"
            />

            <text
              x={selectedPoint.x}
              y={Math.max(chartTop + 12, selectedPoint.y - 14)}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="12"
              fontWeight="700"
            >
              {current.level}
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-300" />
            <span className="!text-sm !font-semibold !text-white">
              Water-level index
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-sky-300" />
            <span className="!text-sm !font-semibold !text-white">
              Rainfall index shown in the indicator above
            </span>
          </div>
          <p className="!text-xs !font-medium !text-white">
            Chart values are illustrative and do not represent measured levels.
          </p>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="timeline"
              className="!text-sm !font-bold !text-white"
            >
              MOVE THROUGH TIMELINE
            </label>
            <span className="rounded-lg border border-emerald-200 bg-[#061A13] px-3 py-1.5 !text-sm !font-bold !text-white">
              {current.day}
            </span>
          </div>

          <input
            id="timeline"
            type="range"
            min={0}
            max={scenario.steps.length - 1}
            value={step}
            onChange={(event) => {
              setStep(Number(event.target.value));
              setPlaying(false);
            }}
            className="h-3 w-full cursor-pointer accent-emerald-300"
          />

          <div className="mt-2 flex justify-between !text-xs !font-semibold !text-white">
            <span>{scenario.steps[0].day}</span>
            <span>{scenario.steps[scenario.steps.length - 1].day}</span>
          </div>
        </div>
      </section>

      {/* Current event */}
      <section className={`${panelClass} space-y-4`}>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-950">
            <MapPin className="text-white" size={22} />
          </div>
          <div>
            <h2 className="!text-xl !font-bold !text-white">
              Current scenario event
            </h2>
            <p className="mt-1 !text-sm !text-white">
              {current.day} · {scenario.river}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200/50 bg-[#061A13] p-4">
          <p className="!text-sm !font-bold !text-emerald-200">
            SIMULATED EVENT
          </p>
          <p className="mt-2 !text-base !font-semibold !leading-7 !text-white">
            {current.event}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200/40 bg-[#123C2B] p-4">
            <p className="!text-sm !font-bold !text-white">
              Illustrative observation zone
            </p>
            <p className="mt-2 !text-sm !leading-6 !text-white">
              {current.location}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200/40 bg-[#123C2B] p-4">
            <p className="!text-sm !font-bold !text-white">
              Scenario risk label
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex rounded-lg border-2 px-3 py-1.5 !text-sm !font-bold ${riskStyles[current.risk]}`}
              >
                {current.risk}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline steps */}
      <section className={`${panelClass} space-y-4`}>
        <div>
          <h2 className="!text-xl !font-bold !text-white">
            Full scenario timeline
          </h2>
          <p className="mt-1 !text-sm !text-white">
            Select any step to inspect its illustrative values and event.
          </p>
        </div>

        <div className="space-y-3">
          {scenario.steps.map((item, index) => {
            const selected = index === step;

            return (
              <button
                key={`${scenario.id}-${item.day}`}
                type="button"
                onClick={() => {
                  setStep(index);
                  setPlaying(false);
                }}
                className={`flex w-full flex-col gap-3 rounded-xl border-2 p-4 text-left transition-colors sm:flex-row sm:items-center sm:justify-between ${
                  selected
                    ? "border-emerald-200 bg-[#174B35]"
                    : "border-emerald-300/35 bg-[#061A13] hover:border-emerald-200 hover:bg-[#123C2B]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border !text-sm !font-bold ${
                      selected
                        ? "border-white bg-emerald-300 !text-[#061A13]"
                        : "border-emerald-200 bg-[#123C2B] !text-white"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <p className="!text-base !font-bold !text-white">
                      {item.day}
                      {selected ? " — CURRENT STEP" : ""}
                    </p>
                    <p className="mt-1 !text-sm !leading-6 !text-white">
                      {item.event}
                    </p>
                    <p className="mt-1 !text-xs !font-medium !text-emerald-100">
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <span className="!text-sm !font-semibold !text-white">
                    Level index: {item.level}
                  </span>
                  <span
                    className={`rounded-lg border px-3 py-1.5 !text-xs !font-bold ${riskStyles[item.risk]}`}
                  >
                    {item.risk}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer disclaimer */}
      <footer className="rounded-2xl border-2 border-emerald-300/50 bg-[#0B2A1F] p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 shrink-0 text-emerald-200" size={22} />
          <div>
            <h2 className="!text-sm !font-bold !text-white">
              About this replay
            </h2>
            <p className="mt-2 !text-sm !leading-6 !text-white">
              This page is an interface demonstration using synthetic scenario
              data. It does not connect to live river sensors, verify official
              danger levels, predict actual flooding, or issue emergency
              instructions. Do not use these values for real-world decisions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}