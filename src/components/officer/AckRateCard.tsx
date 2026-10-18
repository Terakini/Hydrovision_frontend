
"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@/components/hv/Icons";

export function AckRateCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-xs">
      <div className="flex items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Alert Delivery &amp; Acknowledgement
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Resident delivery and response tracking
          </p>
        </div>

        <span className="rounded-full border border-border bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
          Not connected
        </span>
      </div>

      <div className="my-5 rounded-lg border border-dashed border-border p-5 text-center">
        <p className="text-sm font-semibold text-foreground">
          Metrics unavailable
        </p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          Delivery receipts, resident acknowledgements, and response-time
          history are not connected to a verified data source yet.
          No live delivery or acknowledgement statistics are displayed.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
        <span className="text-[11px] text-muted-foreground">
          Requires verified delivery and acknowledgement records
        </span>

        <Link
          href="/officer/alerts"
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View alerts
          <ArrowRightIcon size={13} />
        </Link>
      </div>
    </div>
  );
}
