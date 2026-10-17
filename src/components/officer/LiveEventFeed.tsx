"use client";

import React from "react";
import Link from "next/link";
import { ActivityEvent } from "@/types/models";
import {
  ShieldAlertIcon,
  BellIcon,
  AlertTriangleIcon,
  ClipboardCheckIcon,
  RadioIcon,
  ArrowRightIcon,
} from "@/components/hv/Icons";

interface LiveEventFeedProps {
  events: ActivityEvent[];
}

export function LiveEventFeed({ events }: LiveEventFeedProps) {
  const getEventConfig = (event: ActivityEvent) => {
    switch (event.kind) {
      case "sos_raised":
        return {
          border: "border-l-destructive",
          bg: "bg-tier-danger-soft/60",
          icon: <ShieldAlertIcon size={14} className="text-destructive shrink-0" />,
        };
      case "tier_escalation":
        return {
          border: event.tier === "Evacuate" ? "border-l-tier-evacuate" : "border-l-tier-danger",
          bg: "bg-card",
          icon: <AlertTriangleIcon size={14} className="text-destructive shrink-0" />,
        };
      case "alert_dispatched":
        return {
          border: "border-l-primary",
          bg: "bg-card",
          icon: <BellIcon size={14} className="text-primary shrink-0" />,
        };
      case "ground_report":
        return {
          border: "border-l-tier-warning",
          bg: "bg-card",
          icon: <ClipboardCheckIcon size={14} className="text-tier-warning-ink shrink-0" />,
        };
      case "source_health":
      default:
        return {
          border: "border-l-primary/60",
          bg: "bg-card",
          icon: <RadioIcon size={14} className="text-muted-foreground shrink-0" />,
        };
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-3">
        <div className="flex items-center gap-2">
         <h2 className="text-sm font-bold text-foreground">Activity Feed</h2>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
  Recent events
</span>
      </div>

      {/* Feed List */}
      <div className="space-y-2.5 overflow-y-auto max-h-[280px] pr-1">
        {events.map((event) => {
          const config = getEventConfig(event);

          return (
            <Link
              key={event.id}
              href={event.target_url || "/officer/command"}
              className={`block rounded-lg border border-border/80 border-l-4 ${config.border} ${config.bg} p-2.5 transition-colors hover:bg-muted/70 group`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {config.icon}
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap font-mono">
                  {event.time_ago}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 pl-5.5">
                {event.description}
              </p>
              <div className="mt-1 flex items-center justify-end pl-5.5">
                <span className="text-[10px] text-primary font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>View</span>
                  <ArrowRightIcon size={10} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Channel: Supabase Realtime</span>
        <Link href="/officer/alerts" className="text-primary font-semibold hover:underline">
          View full history
        </Link>
      </div>
    </div>
  );
}
