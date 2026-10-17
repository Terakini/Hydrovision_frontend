import React from "react";
import { RiskTier } from "@/types/models";
import { ShieldAlertIcon, AlertTriangleIcon, CheckCircleIcon } from "./Icons";

interface TierBadgeProps {
  tier: RiskTier;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function TierBadge({
  tier,
  size = "md",
  className = "",
  showIcon = true,
}: TierBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs font-semibold gap-1.5",
    lg: "px-3.5 py-1.5 text-sm font-semibold gap-2",
  };

  const tierStyles: Record<
    RiskTier,
    { bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Safe: {
      bg: "bg-tier-safe-soft",
      text: "text-tier-safe-ink",
      border: "border-tier-safe/40",
      icon: <CheckCircleIcon size={13} className="shrink-0" />,
    },
    Watch: {
      bg: "bg-tier-watch-soft",
      text: "text-tier-watch-ink",
      border: "border-tier-watch/50",
      icon: <AlertTriangleIcon size={13} className="shrink-0" />,
    },
    Warning: {
      bg: "bg-tier-warning-soft",
      text: "text-tier-warning-ink",
      border: "border-tier-warning/50",
      icon: <AlertTriangleIcon size={13} className="shrink-0" />,
    },
    Danger: {
      bg: "bg-tier-danger-soft",
      text: "text-tier-danger-ink",
      border: "border-tier-danger/50",
      icon: <ShieldAlertIcon size={13} className="shrink-0" />,
    },
    Evacuate: {
      bg: "bg-tier-evacuate-soft",
      text: "text-tier-evacuate-ink",
      border: "border-tier-evacuate/60 font-bold",
      icon: <ShieldAlertIcon size={13} className="shrink-0" />,
    },

        Unknown: {
      bg: "bg-gray-500/10",
      text: "text-gray-400",
      border: "border-gray-500/30",
      icon: <AlertTriangleIcon size={13} className="shrink-0" />,
    },
  };

  const style = tierStyles[tier];

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs tracking-tight ${sizeClasses[size]} ${style.bg} ${style.text} ${style.border} ${className}`}
      role="status"
      aria-label={`Risk Level: ${tier}`}
    >
      {showIcon && style.icon}
      <span>{tier}</span>
    </span>
  );
}
