import React from "react";

interface SimulationChipProps {
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function SimulationChip({
  label = "SIMULATION",
  size = "md",
  className = "",
}: SimulationChipProps) {
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md bg-simulation-soft text-simulation border border-simulation/30 shadow-xs ${sizeClass} ${className}`}
      title="Synthetic simulation data — not live river measurements"
      role="note"
      aria-label="Simulation Mode Active"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-simulation animate-pulse" />
      <span>{label}</span>
    </span>
  );
}
