import React from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  variant?: "tint" | "danger" | "tile" | "default";
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function KpiCard({
  label,
  value,
  subtext,
  variant = "tint",
  icon,
  onClick,
  className = "",
}: KpiCardProps) {
  const variantStyles = {
    tint: "bg-tint border-tint-border text-foreground hover:border-primary/40",
    danger: "bg-tier-danger-soft border-tier-danger/40 text-tier-danger-ink hover:border-tier-danger",
    tile: "bg-tile text-tile-foreground border-transparent shadow-sm",
    default: "bg-card border-border text-foreground hover:border-primary/30",
  };

  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          onClick?.();
        }
      }}
      className={`relative flex flex-col justify-between rounded-xl border p-4.5 transition-all duration-150 ${variantStyles[variant]} ${
        isClickable ? "cursor-pointer hover:shadow-sm" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-semibold uppercase tracking-wider ${
            variant === "tile" ? "text-tile-foreground/80" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        {icon && (
          <span
            className={`p-1.5 rounded-lg ${
              variant === "tile"
                ? "bg-white/10 text-white"
                : variant === "danger"
                ? "bg-tier-danger/20 text-tier-danger-ink"
                : "bg-primary/10 text-primary"
            }`}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-2.5">
        <div
          className={`font-extrabold tracking-tight tabular-nums ${
            variant === "tile" ? "text-3xl text-white" : "text-2xl text-foreground"
          }`}
        >
          {value}
        </div>
        {subtext && (
          <p
            className={`text-xs mt-1 truncate ${
              variant === "tile"
                ? "text-tile-foreground/85"
                : variant === "danger"
                ? "text-tier-danger-ink/90 font-medium"
                : "text-muted-foreground"
            }`}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}
