"use client";

import { useState } from "react";
import {
AlertTriangleIcon,
ClipboardCheckIcon,
ShieldAlertIcon,
} from "@/components/hv/Icons";

type AlertStatus = "Pending Approval" | "Approved" | "Rejected";

interface AlertItem {
id: string;
title: string;
village: string;
severity: string;
details: string;
status: AlertStatus;
}

const initialAlerts: AlertItem[] = [
{
id: "ALT-001",
title: "Evacuation Alert",
village: "Kasbe Digraj",
severity: "Critical",
details:
"River level has reportedly crossed the configured warning threshold.",
status: "Pending Approval",
},
{
id: "ALT-002",
title: "Flood Preparedness Advisory",
village: "Shahpur",
severity: "High",
details:
"Prepare response teams and verify local shelter readiness.",
status: "Pending Approval",
},
{
id: "ALT-003",
title: "Shelter Readiness Notice",
village: "District-wide",
severity: "Medium",
details:
"Confirm shelter capacity and essential supply availability.",
status: "Pending Approval",
},
];

export default function AlertsPage() {
const [alerts, setAlerts] = useState(initialAlerts);

function updateStatus(id: string, status: AlertStatus) {
setAlerts((current) =>
current.map((alert) =>
alert.id === id ? { ...alert, status } : alert
)
);
}

const pendingCount = alerts.filter(
(alert) => alert.status === "Pending Approval"
).length;

const approvedCount = alerts.filter(
(alert) => alert.status === "Approved"
).length;

return ( <main className="space-y-6"> <div> <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
Operations / Alert Management </p> <h1 className="mt-2 text-2xl font-bold text-foreground">
Alerts & Approvals </h1> <p className="mt-2 text-sm text-muted-foreground">
Review drafted emergency alerts and record approval decisions. </p> </div>

```
  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
    <div className="flex items-start gap-3">
      <AlertTriangleIcon
        className="mt-0.5 shrink-0 text-amber-500"
        size={21}
      />
      <div>
        <p className="font-semibold text-foreground">
          Demonstration mode — no alerts will be dispatched
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
         Alerts are prioritized by severity and reviewed to support timely response coordination. Officers should verify reported conditions before taking action.

        </p>
      </div>
    </div>
  </div>

  <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">Total Drafts</p>
      <p className="mt-2 text-2xl font-bold text-foreground">
        {alerts.length}
      </p>
    </div>

    <div className="rounded-xl border border-amber-500/30 bg-card p-4">
      <p className="text-sm text-muted-foreground">Awaiting Approval</p>
      <p className="mt-2 text-2xl font-bold text-amber-500">
        {pendingCount}
      </p>
    </div>

    <div className="rounded-xl border border-emerald-500/30 bg-card p-4">
      <p className="text-sm text-muted-foreground">Approved</p>
      <p className="mt-2 text-2xl font-bold text-emerald-500">
        {approvedCount}
      </p>
    </div>
  </section>

  <section className="space-y-4">
    {alerts.map((alert) => (
      <article
        key={alert.id}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">
                {alert.id}
              </span>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  alert.severity === "Critical"
                    ? "bg-red-500/15 text-red-500"
                    : alert.severity === "High"
                      ? "bg-orange-500/15 text-orange-500"
                      : "bg-amber-500/15 text-amber-500"
                }`}
              >
                {alert.severity}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-foreground">
                {alert.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Location: {alert.village}
              </p>
              <p className="mt-3 text-sm text-foreground/80">
                {alert.details}
              </p>
            </div>

            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              {alert.status === "Pending Approval" ? (
                <ClipboardCheckIcon size={15} />
              ) : (
                <ShieldAlertIcon size={15} />
              )}
              Status: {alert.status}
            </p>
          </div>

          {alert.status === "Pending Approval" && (
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                onClick={() => updateStatus(alert.id, "Approved")}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <ShieldAlertIcon size={16} />
                Approve
              </button>

              <button
                onClick={() => updateStatus(alert.id, "Rejected")}
                className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
              >
                Reject
              </button>
            </div>
          )}

          {alert.status !== "Pending Approval" && (
            <span className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground">
              {alert.status}
            </span>
          )}
        </div>
      </article>
    ))}
  </section>
</main>

);
}
