"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MOCK_KPIS,
  MOCK_VILLAGES,
  MOCK_FLOOD_ZONES,
  MOCK_ACTIVITY_FEED,
} from "@/lib/mock/commandCenterData";
import { Village } from "@/types/models";
import { fetchBackendVillages } from "@/lib/api/villages";
import { KpiCard } from "@/components/hv/KpiCard";
import { SimulationChip } from "@/components/hv/SimulationChip";
import { InteractiveMapPanel } from "@/components/officer/InteractiveMapPanel";
import { VillageUrgencyList } from "@/components/officer/VillageUrgencyList";
import { AckRateCard } from "@/components/officer/AckRateCard";
import { LiveEventFeed } from "@/components/officer/LiveEventFeed";
import {
  ShieldAlertIcon,
  BellIcon,
  LifeBuoyIcon,
  ClipboardCheckIcon,
  UsersIcon,
  AlertTriangleIcon,
} from "@/components/hv/Icons";

import { BackendVillageList } from "@/components/officer/BackendVillageList";

type DashboardSummary = {
  overview: {
    total_villages: number;
    villages_with_readings: number;
    villages_without_readings: number;
    total_alerts: number;
    draft_alerts: number;
    approved_alerts: number;
    rejected_alerts: number;
  };
  risk_summary: {
    low: number;
    moderate: number;
    high: number;
    unknown: number;
  };
  latest_readings: {
    village_code: string;
    source: string;
    observed_at: string;
    level_m: number | null;
    discharge_m3s: number | null;
    quality: string;
    is_simulated: boolean;
    risk_level: string;
  }[];
  recent_alerts: {
    id: string;
    tier: string;
    status: string;
    message: string;
    is_simulated: boolean;
    created_at: string;
  }[];
  source_health: {
    id: number;
    source: string;
    status: string;
    last_checked_at: string | null;
    is_backup_active: boolean;
  }[];
  risk_method: {
    type: string;
    description: string;
    thresholds_m3s: {
      moderate: number;
      high: number;
    };
  };
};

type DashboardApiResponse = {
  data: DashboardSummary;
};

export default function OfficerCommandPage() {
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);

  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
const [dashboardLoading, setDashboardLoading] = useState(true);
const [dashboardError, setDashboardError] = useState<string | null>(null);

const [villageStatus, setVillageStatus] = useState<any>(null);
const [villageStatusLoading, setVillageStatusLoading] = useState(true);
const [villageStatusError, setVillageStatusError] = useState<string | null>(null);

const [liveVillages, setLiveVillages] = useState<Village[]>([]);
const [villagesLoading, setVillagesLoading] = useState(true);
const [villagesError, setVillagesError] = useState<string | null>(null);

useEffect(() => {
  let cancelled = false;

  async function loadDashboard() {
    try {
      setDashboardLoading(true);
      setDashboardError(null);

      const response = await fetch(
        "https://hydrovision-backend.onrender.com/api/v1/dashboard/summary"
      );

      if (!response.ok) {
        throw new Error(`Dashboard request failed (${response.status})`);
      }

      const result: DashboardApiResponse = await response.json();

      if (!cancelled) {
        setDashboard(result.data);
      }
    } catch (error) {
      if (!cancelled) {
        setDashboardError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data."
        );
      }
    } finally {
      if (!cancelled) {
        setDashboardLoading(false);
      }
    }
  }

  loadDashboard();

  return () => {
    cancelled = true;
  };
},[]);

useEffect(() => {
  let cancelled = false;

  async function loadVillages() {
    try {
      setVillagesLoading(true);
      setVillagesError(null);

      const villages = await fetchBackendVillages();

      if (!cancelled) {
        setLiveVillages(villages);
      }
    } catch (error) {
      if (!cancelled) {
        setVillagesError(
          error instanceof Error
            ? error.message
            : "Unable to load villages.",
        );
      }
    } finally {
      if (!cancelled) {
        setVillagesLoading(false);
      }
    }
  }

  void loadVillages();

  return () => {
    cancelled = true;
  };
}, []);



useEffect(() => {
  let cancelled = false;

  const villageCode: string | undefined =
  selectedVillage?.code ?? liveVillages[0]?.code;

  if (typeof villageCode !== "string" || villageCode.trim() === "") {
    if (!villagesLoading) {
      setVillageStatus(null);
      setVillageStatusError(
        "No backend village code is available."
      );
      setVillageStatusLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }

  async function loadVillageStatus() {
    try {
      setVillageStatusLoading(true);
      setVillageStatusError(null);

      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ??
        "https://hydrovision-backend.onrender.com";

      const response = await fetch(
        `${apiBaseUrl}/api/v1/villages/${encodeURIComponent(villageCode as string)}/status`,
        {
          headers: { Accept: "application/json" },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          `Village status request failed (${response.status})`
        );
      }

      const result = await response.json();

      if (!cancelled) {
        setVillageStatus(result.data);
      }
    } catch (error) {
      if (!cancelled) {
        setVillageStatus(null);
        setVillageStatusError(
          error instanceof Error
            ? error.message
            : "Unable to load village status."
        );
      }
    } finally {
      if (!cancelled) {
        setVillageStatusLoading(false);
      }
    }
  }

  void loadVillageStatus();

  return () => {
    cancelled = true;
  };
}, [
  selectedVillage?.code,
  liveVillages,
  villagesLoading,
]);



  return (
    <div className="space-y-6">
      {/* Simulation Watermark Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-simulation/30 bg-simulation-soft/80 p-3.5 px-4 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <SimulationChip label="SIMULATION MODE" size="md" />
          <p className="text-foreground/90 font-medium">
            All gauge levels, inundation extents, and emergency counts are{" "}
            <strong>synthetic mock data</strong> for scenario validation. Never treat this as live flood data.
          </p>
        </div>
        <span className="text-[11px] font-mono text-simulation font-bold shrink-0">
          Replay: Aug 2019 Analog
        </span>
      </div>
      
{/* Latest Backend Alert */}
<section className="rounded-xl border border-border bg-card p-4">
  <div className="flex items-center justify-between gap-3 mb-3">
    <h2 className="text-sm font-bold text-foreground">
      Latest Alert
    </h2>
    <span className="text-xs text-muted-foreground">
      {dashboardLoading
        ? "Loading..."
        : dashboardError
          ? "Unavailable"
          : `${dashboard?.recent_alerts.length ?? 0} recent`}
    </span>
  </div>

  {dashboardError ? (
    <p className="text-sm text-muted-foreground">
      Could not load alerts from the backend.
    </p>
  ) : dashboard?.recent_alerts.length ? (
    dashboard.recent_alerts.slice(0, 3).map((alert) => (
      <div
        key={alert.id}
        className="rounded-lg border border-border p-3 mb-2 last:mb-0"
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold">{alert.tier}</span>
          <span className="rounded-md bg-secondary px-2 py-1 text-xs">
            {alert.status}
          </span>
          {alert.is_simulated && (
            <span className="rounded-md bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-600">
              SIMULATED
            </span>
          )}
        </div>
        <p className="text-sm text-foreground">
          {alert.message}
        </p>
      </div>
    ))
  ) : dashboardLoading ? (
    <p className="text-sm text-muted-foreground">
      Fetching alerts...
    </p>
  ) : (
    <p className="text-sm text-muted-foreground">
      No recent alerts were returned by the backend.
    </p>
  )}
</section>


      {/* Summary KPI Cards Grid (5 Documented Cards + Operational Resources) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Villages at Risk */}
       
<KpiCard
  label="Villages Monitored"
  value={
    dashboardLoading
      ? "..."
      : dashboardError
        ? "—"
        : dashboard?.overview.total_villages ?? "—"
  }
  subtext={
    dashboardLoading
      ? "Loading backend data..."
      : dashboardError
        ? "Backend unavailable"
        : `${dashboard?.overview.villages_with_readings ?? 0} with readings`
  }
  variant="tint"
  icon={<ShieldAlertIcon size={18} />}
/>


        {/* Card 2: Active Alerts Sent */}
        
<KpiCard
  label="Total Alerts"
  value={
    dashboardLoading
      ? "..."
      : dashboardError
        ? "—"
        : dashboard?.overview.total_alerts ?? "—"
  }
  subtext={
    dashboardLoading
      ? "Loading backend data..."
      : dashboardError
        ? "Backend unavailable"
        : `${dashboard?.overview.draft_alerts ?? 0} awaiting review`
  }
  variant="tint"
  icon={<BellIcon size={18} />}
  onClick={() => {}}
/>


        {/* Card 3: Ack Rate */}
       
<KpiCard
  label="High-Risk Villages"
  value={
    dashboardLoading
      ? "..."
      : dashboardError
        ? "—"
        : dashboard?.risk_summary.high ?? "—"
  }
  subtext={
    dashboardLoading
      ? "Loading backend data..."
      : dashboardError
        ? "Backend unavailable"
        : `${dashboard?.risk_summary.moderate ?? 0} moderate · ${dashboard?.risk_summary.low ?? 0} low`
  }
  variant="tint"
  icon={<ClipboardCheckIcon size={18} />}
/>


        {/* Card 4: Open SOS (Danger variant if > 0) */}
       
<KpiCard
  label="Villages With Readings"
  value={
    dashboardLoading
      ? "..."
      : dashboardError
        ? "—"
        : dashboard?.overview.villages_with_readings ?? "—"
  }
  subtext={
    dashboardLoading
      ? "Loading backend data..."
      : dashboardError
        ? "Backend unavailable"
        : `${dashboard?.overview.villages_without_readings ?? 0} without readings`
  }
  variant="tint"
  icon={<AlertTriangleIcon size={18} />}
/>


        {/* Card 5: People in Danger Zones (Emphasized Dark Tile) */}
       
<KpiCard
  label="Approved Alerts"
  value={
    dashboardLoading
      ? "..."
      : dashboardError
        ? "—"
        : dashboard?.overview.approved_alerts ?? "—"
  }
  subtext={
    dashboardLoading
      ? "Loading backend data..."
      : dashboardError
        ? "Backend unavailable"
        : `${dashboard?.overview.rejected_alerts ?? 0} rejected`
  }
  variant="tile"
  icon={<UsersIcon size={20} />}
/>

      </section>

      {/* Supporting Operations Bar (Available Shelters & Field Tasks) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              <LifeBuoyIcon size={18} />
            </span>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                Emergency Shelters
              </span>
              <span className="text-sm font-bold text-foreground">
                Shelter data not connected
              </span>
            </div>
          </div>
          <Link
            href="/officer/resources"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Manage &rarr;
          </Link>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-secondary text-secondary-foreground">
              <ClipboardCheckIcon size={18} />
            </span>
            <div>
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                Volunteer Field Tasks
              </span>
              <span className="text-sm font-bold text-foreground">
                Task data not connected
              </span>
            </div>
          </div>
          <Link
            href="/officer/resources"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Task Queue &rarr;
          </Link>
        </div>
      </section>

      
<section className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
  <div className="flex items-center justify-between gap-3 mb-4">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Backend Connection
      </p>
      <h2 className="text-lg font-bold text-foreground">
        Village Risk Assessment
      </h2>
    </div>
    <span className="rounded-full border border-gray-500/30 bg-gray-500/10 px-3 py-1 text-xs font-semibold text-gray-400">
      HV-TEST-001
    </span>
  </div>

  {villageStatusLoading ? (
    <p className="text-sm text-muted-foreground">
      Loading village status from backend...
    </p>
    
  ) : villageStatusError ? (
    <p className="text-sm text-red-400">
      Unable to load status: {villageStatusError}
    </p>
  ) : villageStatus ? (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="rounded-full border border-gray-500/30 bg-gray-500/10 px-3 py-1 text-sm font-semibold text-gray-400">
        Overall dashboard risk:{" "}
        {dashboardLoading
          ? "Loading..."
          : dashboardError
            ? "Unavailable"
            : dashboard?.risk_summary
              ? dashboard.risk_summary.high > 0
                ? "High (preliminary)"
                : dashboard.risk_summary.moderate > 0
                  ? "Moderate (preliminary)"
                  : dashboard.risk_summary.low > 0
                    ? "Low (preliminary)"
                    : "Unknown"
              : "Unknown"}
        </span>

        <span className="text-sm text-muted-foreground">
          Assessment:{" "}
          {villageStatus.assessment_status ??
            "Pending validated risk assessment"}
        </span>
      </div>
      

      <p className="text-sm text-muted-foreground">
        {villageStatus.safety_note ??
          "Preliminary development assessment. Not an official flood warning."}
      </p>
    
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">
        Modelled River Discharge
      </p>
      <p className="mt-1 text-lg font-bold text-foreground">
        {villageStatus.latest_gauge_reading?.discharge_m3s != null
          ? `${villageStatus.latest_gauge_reading.discharge_m3s} m³/s`
          : "Unavailable"}
      </p>
    </div>

    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">
        Discharge Data Source
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">
        {villageStatus.latest_gauge_reading?.source ?? "Unavailable"}
      </p>
    </div>

    <div className="rounded-lg border border-border p-3">
      <p className="text-xs text-muted-foreground">
        Reading Quality
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">
        {villageStatus.latest_gauge_reading?.quality ?? "Unavailable"}
      </p>
    </div>

  <div className="rounded-lg border border-border p-3">
    <p className="text-xs text-muted-foreground">
      Latest Rainfall
    </p>
    <p className="mt-1 text-lg font-bold text-foreground">
      {villageStatus.latest_rain_reading?.rain_mm != null
        ? `${villageStatus.latest_rain_reading.rain_mm} mm`
        : "Unavailable"}
    </p>
    <p className="mt-1 text-xs text-muted-foreground">
      {villageStatus.latest_rain_reading?.source === "hydrovision-test"
        ? "Test data"
        : villageStatus.latest_rain_reading?.source ?? "Source unavailable"}
    </p>
  </div>
</div>


    <p className="mt-3 text-xs text-muted-foreground">
      Modelled river-discharge data, not a direct physical gauge measurement.
      Risk assessment is preliminary and is not an official flood warning.
    </p>

    
    <div className="mt-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {villageStatus.village?.name ?? "Unknown Village"}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Code: {villageStatus.village?.code ?? "Unavailable"}
          </p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
          Backend Record
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs text-muted-foreground">District</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {villageStatus.village?.district ?? "Unavailable"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">State</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {villageStatus.village?.state ?? "Unavailable"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Physical Gauge Level</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {villageStatus.latest_gauge_reading?.level_m != null
              ? `${villageStatus.latest_gauge_reading.level_m} m`
              : "Unavailable"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Latest Reading Time</p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {villageStatus.latest_gauge_reading?.observed_at
              ? new Date(
                  villageStatus.latest_gauge_reading.observed_at
                ).toLocaleString()
              : "Unavailable"}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        This is the village record returned by the backend. The available
        discharge value is modelled data, not a direct physical gauge reading.
        No verified flood probability or official warning is available here.
      </p>
    </div>


      {Array.isArray(villageStatus.warnings) &&
        villageStatus.warnings.length > 0 && (
          <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              Data limitations
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {villageStatus.warnings.map(
                (warning: string, index: number) => (
                  <li key={`${index}-${warning}`}>{warning}</li>
                )
              )}
            </ul>
          </div>
        )}
    </>
  ) : (
    <p className="text-sm text-muted-foreground">
      No village status is available.
    </p>
  )}
</section>
      
      {/* Main Monitoring Grid: backend villages + illustrative flood zones */}
      <section className="space-y-3">
        {villagesLoading && (
          <p className="text-sm text-muted-foreground">
            Loading village records from the backend...
          </p>
        )}

        {villagesError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
            <p className="text-sm text-red-500">
              Unable to load live villages: {villagesError}
            </p>
          </div>
        )}

        {!villagesLoading && !villagesError && (
          <p className="text-xs text-muted-foreground">
            Showing {liveVillages.length} village record(s) from the backend.
            Risk tiers are unassessed. Flood polygons remain simulated demo data.
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div className="lg:col-span-8">
            <InteractiveMapPanel
              villages={liveVillages}
              floodZones={MOCK_FLOOD_ZONES}
              selectedVillageId={selectedVillage?.id ?? null}
              onSelectVillage={setSelectedVillage}
            />
          </div>

          <div className="lg:col-span-4">
            <VillageUrgencyList
              villages={liveVillages}
              selectedVillageId={selectedVillage?.id ?? null}
              onSelectVillage={setSelectedVillage}
            />
          </div>
        </div>
      </section>


      <div className="mt-5">
        <BackendVillageList />
      </div>

      
{/* Backend Data Source Health */}
<section className="rounded-xl border border-border bg-card p-4">
  <div className="mb-3">
    <h2 className="text-sm font-bold text-foreground">
      Data Source Health
    </h2>
    <p className="mt-1 text-xs text-muted-foreground">
      Connectivity status reported by the backend
    </p>
  </div>

  {dashboardLoading ? (
    <p className="text-sm text-muted-foreground">
      Checking data sources...
    </p>
  ) : dashboardError ? (
    <p className="text-sm text-muted-foreground">
      Unable to retrieve source health.
    </p>
  ) : dashboard?.source_health.length ? (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {dashboard.source_health.map((source) => {
        const healthy = source.status.toLowerCase() === "healthy";

        return (
          <div
            key={`${source.id ?? source.source}-${source.source}`}
            className="rounded-lg border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-foreground">
                {source.source.replaceAll("_", " ")}
              </span>
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${
                  healthy
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-red-500/15 text-red-600"
                }`}
              >
                {source.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Last checked:{" "}
              {source.last_checked_at
                ? new Date(source.last_checked_at).toLocaleString()
                : "Not available"}
            </p>
            {source.is_backup_active && (
              <p className="mt-1 text-xs text-amber-600">
                Backup source active
              </p>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      No source health records returned.
    </p>
  )}
</section>


{/* Latest Backend Readings */}
<section className="rounded-xl border border-border bg-card p-4">
  <h2 className="text-sm font-bold text-foreground">
    Latest Readings
  </h2>
  <p className="mt-1 mb-4 text-xs text-muted-foreground">
    Most recent observations returned by the backend
  </p>

  {dashboardLoading ? (
    <p className="text-sm text-muted-foreground">
      Loading readings...
    </p>
  ) : dashboardError ? (
    <p className="text-sm text-muted-foreground">
      Unable to retrieve readings.
    </p>
  ) : dashboard?.latest_readings.length ? (
    <div className="space-y-3">
      {dashboard.latest_readings.map((reading, index) => (
        <div
          key={`${reading.village_code}-${reading.observed_at}-${index}`}
          className="rounded-lg border border-border p-3"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-foreground">
              {reading.village_code}
            </span>
            <span className="rounded-md bg-secondary px-2 py-1 text-xs">
              {reading.quality}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">
                Water Level
              </p>
              <p className="text-sm font-semibold">
                {reading.level_m == null
                  ? "Not available"
                  : `${reading.level_m} m`}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Discharge
              </p>
              <p className="text-sm font-semibold">
                {reading.discharge_m3s == null
                  ? "Not available"
                  : `${reading.discharge_m3s} m³/s`}
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Source: {reading.source.replaceAll("_", " ")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Observed: {new Date(reading.observed_at).toLocaleString()}
          </p>

          {reading.is_simulated && (
            <span className="mt-3 inline-block rounded-md bg-amber-500/15 px-2 py-1 text-xs font-semibold text-amber-600">
              SIMULATED READING
            </span>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-muted-foreground">
      No readings are currently available.
    </p>
  )}
</section>



      {/* Bottom Grid: Acknowledgement Rate Card (7 cols) + Live Event Feed (5 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <AckRateCard />
        </div>

        <div className="lg:col-span-5">
          <LiveEventFeed events={MOCK_ACTIVITY_FEED} />
        </div>
      </section>
    </div>
  );
}
