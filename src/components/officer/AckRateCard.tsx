"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CheckCircleIcon } from "@/components/hv/Icons";

export function AckRateCard() {
  const [scope, setScope] = useState<string>("all");

  // Funnel numbers
  const sent = 840;
  const delivered = 765;
  const acknowledged = 655;
  const ackRate = Math.round((acknowledged / sent) * 100);

  // SVG Line Chart coordinates (hours since send: 0h to 6h)
  // [hour, ack %]
  const dataPoints = [
    { hour: "0h", pct: 15, x: 10, y: 85 },
    { hour: "1h", pct: 42, x: 25, y: 58 },
    { hour: "2h", pct: 61, x: 40, y: 39 },
    { hour: "3h", pct: 70, x: 55, y: 30 }, // crossed 70% target
    { hour: "4h", pct: 74, x: 70, y: 26 },
    { hour: "5h", pct: 78, x: 85, y: 22 },
  ];

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-xs justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-foreground">Alert Acknowledgement &amp; Delivery Funnel</h2>
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Two-way resident response rate via Telegram &amp; SMS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="text-xs rounded-md border border-border bg-muted/40 px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Alert Scope"
          >
            <option value="all">All District Alerts (24h)</option>
            <option value="kasbe">Kasbe Digraj Evacuation</option>
            <option value="shahpur">Shahpur Danger Broadcast</option>
          </select>

          <Link
            href="/officer/alerts"
            className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
            title="Open Alerts & Approvals"
          >
            <span>Details</span>
            <ArrowRightIcon size={13} />
          </Link>
        </div>
      </div>

      {/* Delivery Funnel Progress */}
      <div className="grid grid-cols-3 gap-3 my-4 p-3 rounded-lg bg-muted/30 border border-border/60">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
            1. Dispatched
          </span>
          <div className="text-lg font-extrabold text-foreground tabular-nums mt-0.5">
            {sent}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
            <div className="bg-primary/50 h-1.5 rounded-full w-full" />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block">
            2. Delivered
          </span>
          <div className="text-lg font-extrabold text-foreground tabular-nums mt-0.5">
            {delivered}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
            <div
              className="bg-primary/80 h-1.5 rounded-full"
              style={{ width: `${(delivered / sent) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <span>3. Acknowledged</span>
            <CheckCircleIcon size={12} className="text-primary" />
          </span>
          <div className="text-lg font-extrabold text-primary tabular-nums mt-0.5">
            {acknowledged} ({ackRate}%)
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 mt-1.5">
            <div
              className="bg-primary h-1.5 rounded-full"
              style={{ width: `${ackRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Visual Response Rate Trend Curve (SVG) */}
      <div className="relative h-40 w-full pt-2">
        <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          {/* Horizontal Gridlines */}
          <line x1="5" y1="20" x2="95" y2="20" stroke="#D5E6DB" strokeWidth="0.3" strokeDasharray="1,1" />
          <line x1="5" y1="50" x2="95" y2="50" stroke="#D5E6DB" strokeWidth="0.3" strokeDasharray="1,1" />
          <line x1="5" y1="80" x2="95" y2="80" stroke="#D5E6DB" strokeWidth="0.3" strokeDasharray="1,1" />

          {/* 70% Target Dotted Line */}
          <line x1="5" y1="30" x2="95" y2="30" stroke="#1F7A4D" strokeWidth="0.6" strokeDasharray="1.5,1.5" />
          <text x="94" y="27" fontSize="2.8" textAnchor="end" fill="#1F7A4D" fontWeight="bold">
            70% Target Threshold
          </text>

          {/* Area Gradient */}
          <defs>
            <linearGradient id="ackGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1F7A4D" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#1F7A4D" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Filled Area under Curve */}
          <polygon
            points="10,85 25,58 40,39 55,30 70,26 85,22 85,95 10,95"
            fill="url(#ackGradient)"
          />

          {/* Primary Trend Line */}
          <polyline
            points="10,85 25,58 40,39 55,30 70,26 85,22"
            fill="none"
            stroke="#1F7A4D"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {dataPoints.map((dp, i) => (
            <g key={i}>
              <circle cx={dp.x} cy={dp.y} r="1.4" fill="#FFFFFF" stroke="#1F7A4D" strokeWidth="0.8" />
              <text x={dp.x} y="98" fontSize="2.6" textAnchor="middle" fill="#4F6B5D">
                {dp.hour}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-2 border-t border-border/60">
        <span>Channel funnel: Telegram $\rightarrow$ SMS (No read receipts assumed)</span>
        <span className="font-semibold text-primary">Goal achieved in 3.2 hours</span>
      </div>
    </div>
  );
}
