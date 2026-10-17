import React from "react";

interface SourceStatusBadgeProps {
  status?: "live" | "backup" | "down";
  className?: string;
  showText?: boolean;
}

export function SourceStatusBadge({
  status = "live",
  className = "",
  showText = true,
}: SourceStatusBadgeProps) {
  const configs = {
    live: {
      dot: "bg-primary",
      ring: "bg-primary/20",
      label: "All Sources Live",
      bg: "bg-secondary",
      text: "text-secondary-foreground",
    },
    backup: {
      dot: "bg-tier-watch",
      ring: "bg-tier-watch/25",
      label: "Backup Source Active",
      bg: "bg-tier-watch-soft",
      text: "text-tier-watch-ink",
    },
    down: {
      dot: "bg-destructive",
      ring: "bg-destructive/25",
      label: "Data Feeds Down",
      bg: "bg-tier-danger-soft",
      text: "text-destructive",
    },
  };

  const current = configs[status];

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-1 text-xs font-medium ${current.bg} ${current.text} ${className}`}
      title={`CWC River Gauge & NASA GPM Status: ${current.label}`}
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ring}`} />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      {showText && <span>{current.label}</span>}
    </div>
  );
}
