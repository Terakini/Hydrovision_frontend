
"use client";

import { useRef, useState } from "react";

type HealthCheck = {
  name: string;
  detail: string;
  status: string;
};

type EvaluationResult = {
  precision: number;
  recall: number;
  falseAlarmRate: number;
  evaluatedAt: string;
  datasetName: string;
};

const initialChecks: HealthCheck[] = [
  {
    name: "Input data availability",
    detail: "Historical observations have not been configured yet.",
    status: "Attention",
  },
  {
    name: "Data freshness",
    detail: "Observation timestamps need to be checked.",
    status: "Attention",
  },
  {
    name: "Input validation",
    detail: "CSV validation runs when a dataset is selected.",
    status: "Pending",
  },
  {
    name: "Model service",
    detail: "No prediction API has been connected.",
    status: "Not connected",
  },
];

const sources = [
  {
    name: "Rainfall observations",
    detail: "Rainfall measurements, ideally in millimetres.",
    icon: "☂",
  },
  {
    name: "River-level observations",
    detail: "Measured water levels, ideally in metres.",
    icon: "≈",
  },
  {
    name: "Ground reports",
    detail: "Field observations and reported flood hazards.",
    icon: "⌖",
  },
  {
    name: "Road accessibility",
    detail: "Flood-related road restrictions and closures.",
    icon: "↗",
  },
];

const aliases = {
  label: [
    "observed_flood",
    "flood_observed",
    "flood_label",
    "flood",
    "target",
    "label",
  ],
  rainfall: ["rainfall_mm", "rainfall", "precipitation"],
  water: [
    "water_level_m",
    "water_level",
    "river_level",
    "river_level_m",
  ],
};

function normalise(value: string) {
  return value.trim().toLowerCase().replace(/^\uFEFF/, "");
}

function csvColumns(text: string): string[] {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim());

  if (!firstLine) return [];

  // Handles quoted column names and commas in quoted headers.
  const columns: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < firstLine.length; i++) {
    const char = firstLine[i];

    if (char === '"') {
      if (quoted && firstLine[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      columns.push(normalise(value));
      value = "";
    } else {
      value += char;
    }
  }

  columns.push(normalise(value));
  return columns.filter(Boolean);
}

function hasAlias(columns: string[], choices: string[]) {
  return choices.some((name) => columns.includes(name));
}

function metricPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function validMetric(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

export default function ModelHealthPage() {
  const fileInput = useRef<HTMLInputElement>(null);

  const [checks, setChecks] = useState(initialChecks);
  const [apiUrl, setApiUrl] = useState("");
  const [connection, setConnection] = useState<
    "untested" | "testing" | "connected" | "error"
  >("untested");
  const [connectionMessage, setConnectionMessage] = useState("");

  const [dataset, setDataset] = useState<File | null>(null);
  const [datasetColumns, setDatasetColumns] = useState<string[]>([]);
  const [datasetMessage, setDatasetMessage] = useState("");
  const [datasetValid, setDatasetValid] = useState(false);

  const [evaluating, setEvaluating] = useState(false);
  const [evaluationMessage, setEvaluationMessage] = useState("");
  const [evaluationError, setEvaluationError] = useState("");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<EvaluationResult[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const attentionCount = checks.filter(
    (check) => check.status === "Attention",
  ).length;

  async function selectDataset(file?: File) {
    setDataset(null);
    setDatasetColumns([]);
    setDatasetValid(false);
    setDatasetMessage("");
    setEvaluationError("");
    setEvaluationMessage("");
    setResult(null);

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setDatasetMessage("Please select a .csv file.");
      return;
    }

    if (file.size === 0) {
      setDatasetMessage("This file is empty.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setDatasetMessage("Maximum supported file size is 25 MB.");
      return;
    }

    try {
      const text = await file.slice(0, 64 * 1024).text();
      const columns = csvColumns(text);

      if (!columns.length) {
        setDatasetMessage("Could not read the CSV header.");
        return;
      }

      const hasLabel = hasAlias(columns, aliases.label);
      const hasFeature =
        hasAlias(columns, aliases.rainfall) ||
        hasAlias(columns, aliases.water);

      setDataset(file);
      setDatasetColumns(columns);
      setDatasetValid(hasLabel && hasFeature);

      if (!hasLabel || !hasFeature) {
        const missing = [
          !hasLabel ? "a labelled flood outcome column" : "",
          !hasFeature ? "a rainfall or water-level column" : "",
        ].filter(Boolean);

        setDatasetMessage(
          `Header validation failed: missing ${missing.join(" and ")}. ` +
            "This file has not been used for evaluation.",
        );
      } else {
        setDatasetMessage(
          "CSV header checks passed. This does not verify row quality, label correctness, or model compatibility.",
        );
      }
    } catch {
      setDatasetMessage("The selected file could not be read.");
    }
  }

  async function testConnection() {
    const entered = apiUrl.trim();

    setConnection("untested");
    setConnectionMessage("");
    setEvaluationError("");

    if (!entered) {
      setConnection("error");
      setConnectionMessage("Enter your model API base URL first.");
      return;
    }

    let base: URL;

    try {
      base = new URL(entered);
    } catch {
      setConnection("error");
      setConnectionMessage("Enter a valid absolute URL, including https://.");
      return;
    }

    if (
      !["http:", "https:"].includes(base.protocol) ||
      base.username ||
      base.password
    ) {
      setConnection("error");
      setConnectionMessage(
        "Use an HTTP(S) URL without embedded credentials.",
      );
      return;
    }

    setConnection("testing");

    try {
      const healthUrl = `${base.toString().replace(/\/+$/, "")}/health`;

      const response = await fetch(healthUrl, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        throw new Error(`Health endpoint returned HTTP ${response.status}.`);
      }

      setConnection("connected");
      setConnectionMessage(
        "Health endpoint responded successfully. Evaluation compatibility has not yet been verified.",
      );

      setChecks((previous) =>
        previous.map((check) =>
          check.name === "Model service"
            ? {
                ...check,
                status: "Reachable",
                detail: "The configured health endpoint responded.",
              }
            : check,
        ),
      );
    } catch (error) {
      setConnection("error");
      setConnectionMessage(
        error instanceof Error
          ? `${error.message} Check the URL, server status and browser CORS settings.`
          : "Could not reach the health endpoint.",
      );
    }
  }

  async function runEvaluation() {
    setEvaluationError("");
    setEvaluationMessage("");
    setResult(null);

    if (!dataset || !datasetValid) {
      setEvaluationError(
        "Upload a CSV with a supported flood label and rainfall or water-level feature first.",
      );
      return;
    }

    if (connection !== "connected") {
      setEvaluationError(
        "Test the model health endpoint successfully before evaluating.",
      );
      return;
    }

    const base = apiUrl.trim().replace(/\/+$/, "");
    setEvaluating(true);
    setEvaluationMessage("Sending the selected dataset to the evaluation API...");

    try {
      const form = new FormData();
      form.append("dataset", dataset);

      const response = await fetch(`${base}/evaluate`, {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        throw new Error(
          `Evaluation endpoint returned HTTP ${response.status}.`,
        );
      }

      const data: unknown = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("The API returned an invalid response.");
      }

      const payload = data as Record<string, unknown>;
      const precision = payload.precision;
      const recall = payload.recall;
      const falseAlarmRate = payload.falseAlarmRate;

      if (
        !validMetric(precision) ||
        !validMetric(recall) ||
        !validMetric(falseAlarmRate)
      ) {
        throw new Error(
          "Response must contain numeric precision, recall and falseAlarmRate values between 0 and 1.",
        );
      }

      const completed: EvaluationResult = {
        precision,
        recall,
        falseAlarmRate,
        evaluatedAt: new Date().toLocaleString(),
        datasetName: dataset.name,
      };

      setResult(completed);
      setHistory((previous) => [completed, ...previous]);
      setEvaluationMessage(
        "Evaluation response validated. Metrics below came from the configured API.",
      );
    } catch (error) {
      setEvaluationError(
        error instanceof Error
          ? `${error.message} No new metrics have been recorded.`
          : "Evaluation failed. No new metrics have been recorded.",
      );
      setEvaluationMessage("");
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#071B14] p-4 text-[#E5F4EB] sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-400">
              HydroVision / System Intelligence
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Model &amp; Health Data
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/55">
              Configure your model, validate historical observations and
              evaluate flood predictions using actual labelled outcomes.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.05] px-4 py-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                connection === "connected"
                  ? "bg-emerald-400"
                  : "bg-amber-300"
              }`}
            />
            <div>
              <p className="text-sm font-medium text-amber-100">
                {connection === "connected"
                  ? "Health endpoint reachable"
                  : "Model not verified"}
              </p>
              <p className="mt-1 text-xs text-emerald-100/45">
                {connection === "connected"
                  ? "Evaluation still requires a compatible API"
                  : "No verified model connection"}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Model service",
              value:
                connection === "connected"
                  ? "Reachable"
                  : connection === "testing"
                    ? "Testing..."
                    : "Unverified",
              note: "Health endpoint status",
              icon: "◉",
            },
            {
              label: "Health checks",
              value: String(checks.length),
              note: "Configured checks",
              icon: "⌁",
            },
            {
              label: "Attention needed",
              value: String(attentionCount),
              note: "Review data readiness",
              icon: "⚠",
            },
            {
              label: "Completed evaluations",
              value: String(history.length),
              note: "Successful API responses in this session",
              icon: "⌗",
            },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-emerald-100/[0.09] bg-[#0B261B] p-5 transition hover:border-emerald-300/25"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-emerald-100/55">
                  {metric.label}
                </span>
                <span className="text-xl text-emerald-300">
                  {metric.icon}
                </span>
              </div>
              <p className="mt-4 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-xs text-emerald-100/40">
                {metric.note}
              </p>
            </div>
          ))}
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Step 01
                </p>
                <h2 className="mt-2 font-semibold">Connect model API</h2>
                <p className="mt-2 text-xs leading-5 text-emerald-100/45">
                  Configure an existing API. This page does not create or
                  train a model.
                </p>
              </div>
              <span className="rounded-lg bg-emerald-300/10 px-3 py-2 text-xs text-emerald-200">
                GET /health
              </span>
            </div>

            <label
              htmlFor="api-url"
              className="mt-5 block text-sm text-emerald-100/70"
            >
              API base URL
            </label>
            <input
              id="api-url"
              type="url"
              value={apiUrl}
              onChange={(event) => {
                setApiUrl(event.target.value);
                setConnection("untested");
                setConnectionMessage("");
              }}
              placeholder="https://your-model.example.com"
              className="mt-2 w-full rounded-xl border border-emerald-100/15 bg-[#071B14] px-4 py-3 text-sm outline-none transition placeholder:text-emerald-100/25 focus:border-emerald-400/60"
            />

            <button
              type="button"
              onClick={testConnection}
              disabled={connection === "testing"}
              className="mt-4 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-[#071B14] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {connection === "testing"
                ? "Testing connection..."
                : "Test connection"}
            </button>

            {connectionMessage && (
              <p
                role="status"
                className={`mt-4 rounded-lg p-3 text-xs leading-5 ${
                  connection === "connected"
                    ? "bg-emerald-300/10 text-emerald-200"
                    : "bg-amber-300/10 text-amber-100"
                }`}
              >
                {connectionMessage}
              </p>
            )}

            <p className="mt-4 text-xs leading-5 text-emerald-100/35">
              The API must allow browser requests (CORS). Do not put API
              secrets in frontend code. Only connect to a trusted endpoint.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Step 02
            </p>
            <h2 className="mt-2 font-semibold">Historical dataset</h2>
            <p className="mt-2 text-xs leading-5 text-emerald-100/45">
              Select a labelled CSV of past observations and verified flood
              outcomes.
            </p>

            <input
              ref={fileInput}
              type="file"
              accept=".csv,text/csv"
              className="sr-only"
              onChange={(event) => {
                void selectDataset(event.target.files?.[0]);
                event.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="mt-5 flex w-full flex-col items-center rounded-xl border border-dashed border-emerald-300/25 bg-[#071B14]/80 px-4 py-7 text-center transition hover:border-emerald-300/60 hover:bg-emerald-300/[0.04]"
            >
              <span className="text-3xl text-emerald-300">↑</span>
              <span className="mt-3 text-sm font-medium">
                Choose CSV dataset
              </span>
              <span className="mt-2 text-xs text-emerald-100/40">
                CSV only · Maximum 25 MB
              </span>
            </button>

            {dataset && (
              <div className="mt-4 rounded-xl border border-emerald-100/10 bg-[#071B14] p-4">
                <p className="break-all text-sm font-medium">{dataset.name}</p>
                <p className="mt-1 text-xs text-emerald-100/45">
                  {(dataset.size / 1024).toFixed(1)} KB ·{" "}
                  {datasetColumns.length} columns detected
                </p>
                {datasetColumns.length > 0 && (
                  <p className="mt-2 break-words text-xs leading-5 text-emerald-100/40">
                    Columns: {datasetColumns.join(", ")}
                  </p>
                )}
              </div>
            )}

            {datasetMessage && (
              <p
                role="status"
                className={`mt-3 rounded-lg p-3 text-xs leading-5 ${
                  datasetValid
                    ? "bg-emerald-300/10 text-emerald-200"
                    : "bg-amber-300/10 text-amber-100"
                }`}
              >
                {datasetMessage}
              </p>
            )}

            <div className="mt-4 rounded-xl bg-[#071B14] p-4">
              <p className="text-xs font-medium text-emerald-100/70">
                Expected CSV headers
              </p>
              <p className="mt-2 text-xs leading-6 text-emerald-100/45">
                timestamp, rainfall_mm, water_level_m, observed_flood
              </p>
              <p className="mt-2 text-xs leading-5 text-emerald-100/35">
                Header check only: rainfall or water level and a supported
                flood-label column are required. Actual row values, labels
                and units still need verification.
              </p>
            </div>
          </div>
        </section>

        <section className="grid items-start gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                  Step 03
                </p>
                <h2 className="mt-2 font-semibold">Run model evaluation</h2>
                <p className="mt-2 text-xs leading-5 text-emerald-100/45">
                  Sends the selected CSV to POST /evaluate.
                </p>
              </div>
              <span className="rounded-full border border-emerald-100/10 px-3 py-1.5 text-xs text-emerald-100/50">
                {evaluating ? "Running" : result ? "Completed" : "Not evaluated"}
              </span>
            </div>

            <button
              type="button"
              onClick={runEvaluation}
              disabled={evaluating}
              className="mt-5 w-full rounded-xl border border-emerald-300/25 bg-emerald-300/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {evaluating ? "Evaluation in progress..." : "Run evaluation"}
            </button>

            {evaluating && (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-emerald-100/10">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" />
              </div>
            )}

            {evaluationMessage && (
              <p
                role="status"
                className="mt-4 rounded-lg bg-emerald-300/10 p-3 text-xs leading-5 text-emerald-200"
              >
                {evaluationMessage}
              </p>
            )}

            {evaluationError && (
              <p
                role="alert"
                className="mt-4 rounded-lg bg-red-400/10 p-3 text-xs leading-5 text-red-200"
              >
                {evaluationError}
              </p>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Precision",
                  value: result ? metricPercent(result.precision) : "N/A",
                },
                {
                  label: "Recall",
                  value: result ? metricPercent(result.recall) : "N/A",
                },
                {
                  label: "False alarm rate",
                  value: result
                    ? metricPercent(result.falseAlarmRate)
                    : "N/A",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl bg-[#071B14] p-4"
                >
                  <p className="text-xs leading-5 text-emerald-100/45">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-100/70">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-emerald-100/35">
              Metrics appear only when the API returns valid numeric values.
              Confirm the metric definitions and evaluation methodology on
              the server before relying on these results.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
            <h2 className="font-semibold">System health checks</h2>
            <p className="mt-2 text-xs leading-5 text-emerald-100/45">
              Status reflects checks performed by this interface, not a
              complete infrastructure audit.
            </p>

            <div className="mt-5 space-y-3">
              {checks.map((check) => (
                <div
                  key={check.name}
                  className="rounded-xl border border-emerald-100/[0.08] bg-[#071B14]/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium">{check.name}</p>
                    <span className="shrink-0 rounded-full bg-amber-300/10 px-2.5 py-1 text-[11px] text-amber-100">
                      {check.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-emerald-100/40">
                    {check.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3 border-t border-emerald-100/10 pt-5">
              {sources.map((source) => (
                <div key={source.name} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-300/[0.08] text-emerald-300">
                    {source.icon}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="mt-1 text-xs leading-5 text-emerald-100/40">
                      {source.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-emerald-100/10 bg-[#0B261B] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Evaluation history</h2>
              <p className="mt-1 text-xs text-emerald-100/45">
                Successful evaluation responses from this browser session.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHistory((previous) => !previous)}
              className="rounded-lg border border-emerald-300/20 px-3 py-2 text-xs text-emerald-200 transition hover:bg-emerald-300/10"
            >
              {showHistory ? "Hide history" : "View history"} ({history.length})
            </button>
          </div>

          {showHistory && (
            <div className="mt-5">
              {history.length === 0 ? (
                <p className="rounded-xl bg-[#071B14] p-5 text-sm text-emerald-100/45">
                  No completed evaluations in this session.
                </p>
              ) : (
                <div className="space-y-3">
                  {history.map((item, index) => (
                    <div
                      key={`${item.evaluatedAt}-${index}`}
                      className="rounded-xl bg-[#071B14] p-4"
                    >
                      <p className="break-all text-sm font-medium">
                        {item.datasetName}
                      </p>
                      <p className="mt-1 text-xs text-emerald-100/40">
                        {item.evaluatedAt}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-emerald-200">
                        <span>
                          Precision: {metricPercent(item.precision)}
                        </span>
                        <span>Recall: {metricPercent(item.recall)}</span>
                        <span>
                          False alarm: {metricPercent(item.falseAlarmRate)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="border-t border-emerald-100/[0.08] pt-4 text-xs leading-5 text-emerald-100/35">
          HydroVision model monitoring interface. CSV selection and header
          checks run in the browser. Real evaluation requires a trusted,
          compatible API. This page does not train a model, verify ground
          truth or independently validate model accuracy. History is
          session-only and is not persisted.
        </footer>
      </div>
    </main>
  );
}