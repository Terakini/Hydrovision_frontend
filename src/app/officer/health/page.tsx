
"use client";

import { useCallback, useEffect, useState } from "react";

type MissingValues = {
  eventId?: number;
  startDate?: number;
  endDate?: number;
  floodType?: number;
  peakLevel?: number;
  duration?: number;
  discharge?: number;
  floodVolume?: number;
};

type HistoricalData = {
  source?: string;
  file?: string;
  datasetAvailable?: boolean;
  recordCount?: number;
  floodCount?: number;
  severeCount?: number;
  otherTypeCount?: number;

  startDate?: string | null;
  endDate?: string | null;
  dateRange?: {
    start?: string | null;
    end?: string | null;
    min?: string | null;
    max?: string | null;
  };

  averageDuration?: number | null;
  maxPeakLevel?: number | null;
  maximumRecordedPeakLevel?: number | null;
  maximumValueNeedsSourceReview?: boolean;

  schemaValid?: boolean;
  missingColumns?: string[];
  duplicateEventIds?: number;

  missingValues?: MissingValues;
  columns?: string[];

  loadedAt?: string;
  fileModifiedAt?: string;
  fileSizeBytes?: number;
};

type EvaluationData = {
  status?: string;
  evaluationType?: string;
  target?: string;
  predictionMethod?: string;
  split?: {
    method?: string;
    trainingFraction?: number;
    cutoffDate?: string;
    trainingStart?: string;
    trainingEnd?: string;
    testingStart?: string;
    testingEnd?: string;
    trainingSamples?: number;
    testingSamples?: number;
  };
  metrics?: {
    mae?: number | null;
    rmse?: number | null;
    r2?: number | null;
    unit?: string;
  };
  baseline?: {
    predictedPeakLevel?: number;
    description?: string;
  };
  dataQuality?: {
    totalCsvRows?: number;
    usableObservations?: number;
    excludedObservations?: number;
    distinctDates?: number;
    maximumRecordedPeakLevel?: number;
    maximumValueNeedsSourceReview?: boolean;
    note?: string;
  };
  classificationMetrics?: {
    accuracy?: number | null;
    precision?: number | null;
    recall?: number | null;
    falseAlarmRate?: number | null;
    status?: string;
  };
  message?: string;
};

const emptyMissingValues: MissingValues = {
  eventId: 0,
  startDate: 0,
  endDate: 0,
  floodType: 0,
  peakLevel: 0,
  duration: 0,
  discharge: 0,
  floodVolume: 0,
};

function formatNumber(value?: number | null, decimals = 2) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "N/A";
  }

  return value.toLocaleString("en-IN", {
    maximumFractionDigits: decimals,
  });
}

function formatDate(value?: string | null) {
  if (!value) return "N/A";

  const parsed = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-emerald-900/70 bg-[#0A281D]/90 shadow-[0_12px_40px_rgba(0,0,0,0.12)] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-400">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg font-semibold tracking-tight text-emerald-50">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm leading-6 text-emerald-100/50">
          {description}
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  description,
  accent = "emerald",
}: {
  label: string;
  value: string;
  unit?: string;
  description: string;
  accent?: "emerald" | "cyan" | "amber" | "neutral";
}) {
  const accentStyles = {
    emerald: "bg-emerald-400",
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    neutral: "bg-slate-500",
  };

  return (
    <Card className="relative overflow-hidden p-5">
      <div
        className={`absolute left-0 top-5 h-10 w-1 rounded-r-full ${accentStyles[accent]}`}
      />
      <p className="text-xs font-medium text-emerald-100/55">{label}</p>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-emerald-100/45">{unit}</span>
        )}
      </div>
      <p className="mt-3 text-xs leading-5 text-emerald-100/45">
        {description}
      </p>
    </Card>
  );
}

function StatusPill({
  children,
  tone = "green",
}: {
  children: React.ReactNode;
  tone?: "green" | "amber" | "slate" | "cyan";
}) {
  const tones = {
    green: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
    amber: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    slate: "border-slate-500/25 bg-slate-500/10 text-slate-300",
    cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${tones[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export default function ModelHealthPage() {
  const [historical, setHistorical] = useState<HistoricalData | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const [historicalResponse, evaluationResponse] = await Promise.all([
        fetch("/api/historical-floods", { cache: "no-store" }),
        fetch("/api/historical-floods/evaluation", {
          cache: "no-store",
        }),
      ]);

      const historicalBody = await historicalResponse.json();
      const evaluationBody = await evaluationResponse.json();

      if (!historicalResponse.ok) {
        throw new Error(
          historicalBody.message ||
            "Could not load the historical flood dataset."
        );
      }

      if (!evaluationResponse.ok) {
        throw new Error(
          evaluationBody.message ||
            "Could not load the regression evaluation."
        );
      }

      setHistorical(historicalBody as HistoricalData);
      setEvaluation(evaluationBody as EvaluationData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading Model & Health."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const missing = {
    ...emptyMissingValues,
    ...(historical?.missingValues ?? {}),
  };

  const missingCore =
    (missing.eventId ?? 0) +
    (missing.startDate ?? 0) +
    (missing.endDate ?? 0) +
    (missing.floodType ?? 0) +
    (missing.peakLevel ?? 0);

  const dateStart =
    historical?.dateRange?.start ??
    historical?.dateRange?.min ??
    historical?.startDate;

  const dateEnd =
    historical?.dateRange?.end ??
    historical?.dateRange?.max ??
    historical?.endDate;

  const metrics = evaluation?.metrics;
  const split = evaluation?.split;
  const quality = evaluation?.dataQuality;

  const hasEvaluation =
    evaluation?.status === "evaluated" &&
    metrics !== undefined;

  const needsReview =
    quality?.maximumValueNeedsSourceReview === true ||
    (quality?.maximumRecordedPeakLevel ?? 0) > 100;

  return (
    <main className="min-h-screen bg-[#061B13] px-4 py-6 text-emerald-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page header */}
        <header className="relative overflow-hidden rounded-3xl border border-emerald-800/60 bg-gradient-to-br from-[#103B2A] via-[#0A2B1F] to-[#071E16] p-6 sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full border border-emerald-400/10" />
          <div className="pointer-events-none absolute -right-1 -top-11 h-48 w-48 rounded-full border border-emerald-400/10" />
          <div className="pointer-events-none absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-emerald-400/5 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <StatusPill tone="green">HydroVision Intelligence</StatusPill>
                <StatusPill tone={hasEvaluation ? "cyan" : "amber"}>
                  {hasEvaluation ? "Baseline evaluated" : "Evaluation pending"}
                </StatusPill>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Model <span className="text-emerald-400">&amp;</span> Health
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-100/60 sm:text-base">
                Historical flood data quality, regression baseline
                performance, and model evaluation status in one place.
              </p>

              <p className="mt-4 text-xs text-emerald-100/40">
                Source: INDOFLOODS historical event records
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadData(true)}
              disabled={loading || refreshing}
              className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
            >
              <svg
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path
                  d="M20 7v5h-5M4 17v-5h5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.6 9a7 7 0 0 1 11.7-2L20 12M4 12l2.7 5a7 7 0 0 0 11.7-2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {refreshing ? "Refreshing..." : "Refresh checks"}
            </button>
          </div>
        </header>

        {/* Loading and error states */}
        {loading && (
          <Card className="p-6">
            <div className="flex items-center gap-3 text-sm text-emerald-100/70">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-400/25 border-t-emerald-400" />
              Loading historical records and evaluation results...
            </div>
          </Card>
        )}

        {!loading && error && (
          <Card className="border-rose-500/30 p-5">
            <div className="flex items-start gap-3">
              <span className="text-xl text-rose-300">!</span>
              <div className="flex-1">
                <h2 className="font-semibold text-rose-200">
                  Unable to load model health data
                </h2>
                <p className="mt-2 text-sm leading-6 text-rose-100/70">
                  {error}
                </p>
                <button
                  type="button"
                  onClick={() => void loadData(true)}
                  className="mt-4 rounded-lg border border-rose-400/30 px-3 py-2 text-sm text-rose-200 hover:bg-rose-400/10"
                >
                  Try again
                </button>
              </div>
            </div>
          </Card>
        )}

        {!loading && !error && (
          <>
            {/* Historical dataset summary */}
            <section>
              <SectionHeading
                eyebrow="01 / Historical intelligence"
                title="Dataset overview"
                description="Summary statistics from the historical CSV, not live river measurements."
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Historical records"
                  value={formatNumber(historical?.recordCount, 0)}
                  description="Total records reported by the historical dataset API."
                  accent="emerald"
                />
                <MetricCard
                  label="Usable evaluation samples"
                  value={formatNumber(
  quality?.usableObservations ??
    ((split?.trainingSamples ?? 0) +
      (split?.testingSamples ?? 0)),
  0
)}
                  description="Dated peak-level observations used by the regression evaluation."
                  accent="cyan"
                />
                <MetricCard
                  label="Distinct peak dates"
                  value={formatNumber(quality?.distinctDates, 0)}
                  description="Unique dates represented in the usable observations."
                  accent="emerald"
                />
                <MetricCard
                  label="Average event duration"
                  value={formatNumber(historical?.averageDuration)}
                  unit="days"
                  description="Average duration reported by the historical data API."
                  accent="amber"
                />
              </div>

              <Card className="mt-4 p-5">
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-emerald-100/45">
                      Historical coverage
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-50">
                      {formatDate(dateStart)}
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/40">
                      Earliest recorded date
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100/45">
                      Coverage end
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-50">
                      {formatDate(dateEnd)}
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/40">
                      Latest recorded date
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100/45">
                      CSV source
                    </p>
                    <p className="mt-2 break-all text-sm font-medium text-emerald-50">
                      data/floodevents_indofloods.csv
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/40">
                      Local project dataset
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-100/45">
                      Evaluation target
                    </p>
                    <p className="mt-2 text-sm font-medium text-emerald-50">
                      Peak Flood Level
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/40">
                      Continuous regression target
                    </p>
                  </div>
                </div>
              </Card>
            </section>

            {/* Regression metrics */}
            <section>
              <SectionHeading
                eyebrow="02 / Regression evaluation"
                title="Peak-level baseline performance"
                description="Measured against held-out historical events using a chronological split."
              />

              {hasEvaluation ? (
                <>
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <StatusPill tone="green">Evaluation completed</StatusPill>
                    <StatusPill tone="cyan">
                      Historical mean baseline
                    </StatusPill>
                    <span className="text-xs text-emerald-100/40">
                      Target: {evaluation?.target ?? "Peak Flood Level (m)"}
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <MetricCard
                      label="Mean Absolute Error"
                      value={formatNumber(metrics?.mae, 3)}
                      unit={metrics?.unit ?? "m"}
                      description="Average absolute difference between predictions and recorded test values."
                      accent="amber"
                    />
                    <MetricCard
                      label="Root Mean Squared Error"
                      value={formatNumber(metrics?.rmse, 3)}
                      unit={metrics?.unit ?? "m"}
                      description="Penalizes larger prediction errors more heavily than MAE."
                      accent="cyan"
                    />
                    <MetricCard
                      label="R² score"
                      value={formatNumber(metrics?.r2, 3)}
                      description="Comparison with the test set's mean-target reference; negative values indicate worse performance than that reference."
                      accent={
                        (metrics?.r2 ?? 0) < 0 ? "amber" : "emerald"
                      }
                    />
                  </div>

                  {(metrics?.mae ?? 0) > 100 ||
                    (metrics?.rmse ?? 0) > 100 ? (
                    <div className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-4">
                      <p className="text-sm font-semibold text-amber-200">
                        Interpret error metrics with caution
                      </p>
                      <p className="mt-1 text-sm leading-6 text-amber-100/65">
                        Errors are large relative to ordinary river-level
                        changes. Check the source units, outliers, and
                        gauge-specific measurement conventions before
                        interpreting these values as physical metres.
                      </p>
                    </div>
                  ) : null}

                  <Card className="mt-4 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">
                          Baseline method
                        </p>
                        <h3 className="mt-2 text-base font-semibold text-white">
                          Historical training-period mean
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100/55">
                          {evaluation?.baseline?.description ??
                            "A simple reference predictor, not a trained operational flood forecasting model."}
                        </p>
                      </div>
                      <div className="rounded-xl border border-emerald-700/50 bg-emerald-950/60 p-4 sm:min-w-44">
                        <p className="text-xs text-emerald-100/45">
                          Constant prediction
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {formatNumber(
                            evaluation?.baseline?.predictedPeakLevel,
                            3
                          )}
                        </p>
                        <p className="mt-1 text-xs text-emerald-100/45">
                          {metrics?.unit ?? "m"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-5">
                  <StatusPill tone="amber">Evaluation pending</StatusPill>
                  <p className="mt-3 text-sm leading-6 text-emerald-100/60">
                    The evaluation endpoint has not returned a completed
                    regression evaluation. Metrics are intentionally
                    unavailable until it does.
                  </p>
                </Card>
              )}
            </section>

            {/* Train / test split */}
            <section>
              <SectionHeading
                eyebrow="03 / Validation protocol"
                title="Chronological train/test split"
                description="Earlier observations establish the baseline; later observations are held out for evaluation."
              />

              <Card className="p-5 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">
                      Historical time separation
                    </h3>
                    <p className="mt-1 text-xs text-emerald-100/45">
                      Split method: {split?.method ?? "Not available"}
                    </p>
                  </div>
                  <StatusPill tone="cyan">
                    {split?.trainingFraction !== undefined
                      ? `${Math.round(split.trainingFraction * 100)}% training target`
                      : "Chronological split"}
                  </StatusPill>
                </div>

                <div className="mb-6 flex h-3 overflow-hidden rounded-full bg-emerald-950">
                  <div
                    className="bg-emerald-500"
                    style={{
                      width: `${
                        ((split?.trainingSamples ?? 0) /
                          Math.max(
                            1,
                            (split?.trainingSamples ?? 0) +
                              (split?.testingSamples ?? 0)
                          )) *
                        100
                      }%`,
                    }}
                  />
                  <div className="flex-1 bg-cyan-400" />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-emerald-200">
                        Training period
                      </p>
                      <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                        {formatNumber(split?.trainingSamples, 0)} records
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-emerald-50">
                      {formatDate(split?.trainingStart)}
                    </p>
                    <p className="my-1 text-xs text-emerald-100/40">
                      to
                    </p>
                    <p className="text-sm text-emerald-50">
                      {formatDate(split?.trainingEnd)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-cyan-800/50 bg-cyan-950/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-cyan-200">
                        Testing period
                      </p>
                      <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-xs text-cyan-300">
                        {formatNumber(split?.testingSamples, 0)} records
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-emerald-50">
                      {formatDate(split?.testingStart)}
                    </p>
                    <p className="my-1 text-xs text-emerald-100/40">
                      to
                    </p>
                    <p className="text-sm text-emerald-50">
                      {formatDate(split?.testingEnd)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-emerald-800/50 pt-4 text-xs text-emerald-100/45">
                  <span>
                    Cutoff date: {formatDate(split?.cutoffDate)}
                  </span>
                  <span>
                    Total evaluated records:{" "}
                    {formatNumber(
                      (split?.trainingSamples ?? 0) +
                        (split?.testingSamples ?? 0),
                      0
                    )}
                  </span>
                </div>
              </Card>
            </section>

            {/* Classification metrics */}
            <section>
              <SectionHeading
                eyebrow="04 / Classification status"
                title="Flood classification metrics"
                description="These metrics require a separately validated flood/no-flood classification task."
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  label="Accuracy"
                  value="N/A"
                  description="No classification evaluation has been performed."
                  accent="neutral"
                />
                <MetricCard
                  label="Precision"
                  value="N/A"
                  description="No verified classification predictions available."
                  accent="neutral"
                />
                <MetricCard
                  label="Recall"
                  value="N/A"
                  description="No verified classification predictions available."
                  accent="neutral"
                />
                <MetricCard
                  label="False-alarm rate"
                  value="N/A"
                  description="Requires validated positive and negative examples."
                  accent="neutral"
                />
              </div>

              <div className="mt-4 rounded-xl border border-slate-600/30 bg-slate-500/[0.05] p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-lg text-slate-300">i</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Not applicable to the current regression evaluation
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300/65">
                      The current baseline estimates a continuous peak
                      level. It does not classify observations as flood or
                      no flood, so these four metrics remain unavailable.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Data quality */}
            <section>
              <SectionHeading
                eyebrow="05 / Data integrity"
                title="Quality checks & source validation"
                description="Flag suspicious source values rather than silently altering or removing them."
              />

              {needsReview && (
                <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 text-lg text-amber-300">
                      !
                    </div>
                    <div>
                      <h3 className="font-semibold text-amber-200">
                        Peak-level value requires source review
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-amber-100/65">
                        The highest recorded peak-level value is{" "}
                        <strong>
                          {formatNumber(
                            quality?.maximumRecordedPeakLevel,
                            3
                          )}{" "}
                          {metrics?.unit ?? "m"}
                        </strong>
                        . This value is reported as recorded, not verified
                        as a physical water depth. Check the source record,
                        gauge convention, and units before using it for
                        operational decisions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Card className="overflow-hidden">
                <div className="border-b border-emerald-800/60 p-5">
                  <h3 className="font-semibold text-white">
                    Dataset integrity checks
                  </h3>
                  <p className="mt-1 text-xs text-emerald-100/45">
                    Counts supplied by the API and required-column checks.
                  </p>
                </div>

                <div className="divide-y divide-emerald-900/70">
                  {[
                    {
                      label: "CSV records loaded",
                      detail: "Total source records",
                      value: formatNumber(
                        quality?.totalCsvRows ?? historical?.recordCount,
                        0
                      ),
                      good: true,
                    },
                    {
                      label: "Usable peak-level observations",
                      detail: "Rows included in regression evaluation",
                      value: formatNumber(quality?.usableObservations, 0),
                      good: (quality?.usableObservations ?? 0) > 0,
                    },
                    {
                      label: "Excluded observations",
                      detail: "Rows excluded by the evaluation parser",
                      value: formatNumber(quality?.excludedObservations, 0),
                      good: (quality?.excludedObservations ?? 0) === 0,
                    },
                    {
                      label: "Required-field missing values",
                      detail:
                        "Event ID, dates, flood type, and peak level",
                      value: formatNumber(missingCore, 0),
                      good: missingCore === 0,
                    },
                    {
                      label: "Maximum peak-level value",
                      detail: "Requires source review if unusually large",
                      value: formatNumber(
                        quality?.maximumRecordedPeakLevel ??
                          historical?.maxPeakLevel,
                        3
                      ),
                      good: !needsReview,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-emerald-50">
                          {item.label}
                        </p>
                        <p className="mt-1 text-xs text-emerald-100/40">
                          {item.detail}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 sm:justify-end">
                        <span className="text-sm font-semibold text-white">
                          {item.value}
                        </span>
                        <StatusPill
                          tone={item.good ? "green" : "amber"}
                        >
                          {item.good ? "Checked" : "Review"}
                        </StatusPill>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-emerald-800/60 bg-emerald-950/30 p-5">
                
<div className="mt-5 grid gap-3 sm:grid-cols-2">
  <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-4">
    <p className="text-xs text-emerald-100/50">
      Missing peak discharge values
    </p>
    <p className="mt-2 text-2xl font-semibold text-white">
      {formatNumber(missing.discharge, 0)}
    </p>
    <p className="mt-1 text-xs text-emerald-100/40">
      Source field: Peak Discharge Q (cumec)
    </p>
  </div>

  <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/30 p-4">
    <p className="text-xs text-emerald-100/50">
      Missing flood volume values
    </p>
    <p className="mt-2 text-2xl font-semibold text-white">
      {formatNumber(missing.floodVolume, 0)}
    </p>
    <p className="mt-1 text-xs text-emerald-100/40">
      Source field: Flood Volume (cumec)
    </p>
  </div>
</div>

                  <p className="text-xs leading-5 text-emerald-100/45">
                    Missing discharge and flood-volume fields are not
                    automatically errors: those columns can be blank in
                    the source. No source values are changed by this
                    dashboard.
                  </p>
                </div>
              </Card>
            </section>

            {/* System & Source Health */}
<section>
  <SectionHeading
    eyebrow="06 / System monitoring"
    title="System & Source Health"
    description="Dataset availability, local file status, validation checks, and model connectivity."
  />

  <Card className="overflow-hidden">
    <div className="divide-y divide-emerald-900/70">
      {[
        {
          label: "Historical dataset",
          detail: historical?.file ?? "INDOFLOODS CSV",
          value:
            historical?.datasetAvailable === true
              ? "Available"
              : historical?.datasetAvailable === false
                ? "Unavailable"
                : "Unknown",
          tone:
            historical?.datasetAvailable === true
              ? "green"
              : "amber",
        },
        {
          label: "Schema validation",
          detail: "Required columns in the historical dataset",
          value:
            historical?.schemaValid === true
              ? "Valid"
              : historical?.schemaValid === false
                ? "Invalid"
                : "Unknown",
          tone:
            historical?.schemaValid === true
              ? "green"
              : "amber",
        },
        {
          label: "Duplicate event IDs",
          detail: "Repeated non-empty EventID values",
          value:
            historical?.duplicateEventIds !== undefined
              ? formatNumber(historical.duplicateEventIds, 0)
              : "N/A",
          tone:
            historical?.duplicateEventIds === 0
              ? "green"
              : "amber",
        },
        {
          label: "Model service",
          detail: "No operational prediction endpoint has been verified",
          value: "Not connected",
          tone: "amber",
        },
      ].map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium text-emerald-50">
              {item.label}
            </p>
            <p className="mt-1 text-xs text-emerald-100/40">
              {item.detail}
            </p>
          </div>

          <div className="sm:text-right">
  <StatusPill
    tone={
      item.tone as "green" | "amber" | "slate" | "cyan"
    }
  >
    {item.value}
  </StatusPill>
</div>
        </div>
      ))}
    </div>

    <div className="border-t border-emerald-800/60 bg-emerald-950/30 p-5">
      <h3 className="text-sm font-semibold text-white">
        Local dataset file
      </h3>

      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-emerald-100/45">
            Last modified
          </p>
          <p className="mt-1 text-sm text-emerald-100/80">
            {historical?.fileModifiedAt
              ? new Date(historical.fileModifiedAt).toLocaleString()
              : "Unavailable"}
          </p>
        </div>

        <div>
          <p className="text-xs text-emerald-100/45">
            File size
          </p>
          <p className="mt-1 text-sm text-emerald-100/80">
            {historical?.fileSizeBytes !== undefined
              ? `${(historical.fileSizeBytes / 1024).toFixed(1)} KB`
              : "Unavailable"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-emerald-100/45">
        File modification time describes the local CSV file, not the
        latest flood observation or an upstream data-source update.
        Model connectivity remains unverified until a real model
        endpoint is configured and checked.
      </p>
    </div>
  </Card>
</section>

            {/* Operational disclaimer */}
            <footer className="rounded-2xl border border-emerald-800/50 bg-[#081F16] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path
                    d="M12 3 21 7v5c0 5-3.5 8-9 9-5.5-1-9-4-9-9V7l9-4Z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8v4m0 4h.01"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <h2 className="text-sm font-semibold text-emerald-200">
                    Evaluation scope & operational safety
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/50">
                    These results describe a simple historical-mean
                    regression baseline on a chronological holdout. They
                    do not establish real-time forecasting capability,
                    causal flood prediction, or operational readiness.
                    Verify data units, investigate unusual values, and
                    compare against appropriate baselines before using
                    results to support flood-response decisions.
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-900/70 pt-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-100/30">
                  HydroVision / Model health
                </p>
                <p className="text-xs text-emerald-100/40">
                  Historical data · Not live telemetry
                </p>
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  );
}