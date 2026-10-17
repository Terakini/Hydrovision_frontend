"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Village, FloodZonePolygon, RiskTier } from "@/types/models";
import { TierBadge } from "@/components/hv/TierBadge";
import { SimulationChip } from "@/components/hv/SimulationChip";
import {
  ZoomInIcon,
  ZoomOutIcon,
  LayersIcon,
  ShieldAlertIcon,
  ArrowRightIcon,
  XIcon,
} from "@/components/hv/Icons";

interface InteractiveMapPanelProps {
  villages: Village[];
  floodZones: FloodZonePolygon[];
  selectedVillageId: string | null;
  onSelectVillage: (village: Village | null) => void;
}

export function InteractiveMapPanel({
  villages,
  floodZones,
  selectedVillageId,
  onSelectVillage,
}: InteractiveMapPanelProps) {
  // Layer visibility toggles
  const [showTiers, setShowTiers] = useState(true);
  const [showFloodZones, setShowFloodZones] = useState(true);
  const [showSos, setShowSos] = useState(true);
  const [showShelters, setShowShelters] = useState(true);

  // Zoom scale state for interactive feel
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedVillage = villages.find((v) => v.id === selectedVillageId) || null;

 
const tierMarkerColors: Record<RiskTier, string> = {
  Safe: "#17874F",
  Watch: "#F2C230",
  Warning: "#F28C28",
  Danger: "#CF2E3E",
  Evacuate: "#8E1B2E",
  Unknown: "#9CA3AF",
};


  return (
    <div className="relative flex flex-col rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Map Header with Controls & Layer Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <LayersIcon size={16} className="text-primary" />
          <h2 className="text-sm font-bold text-foreground">Flood Inundation &amp; Village Risk Map</h2>
          <SimulationChip size="sm" label="SYNTHETIC OVERLAY" />
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowTiers(!showTiers)}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              showTiers
                ? "bg-secondary text-secondary-foreground border-primary/30"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            Village Tiers
          </button>
          <button
            onClick={() => setShowFloodZones(!showFloodZones)}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              showFloodZones
                ? "bg-secondary text-secondary-foreground border-primary/30"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            Flood Zones
          </button>
          <button
            onClick={() => setShowSos(!showSos)}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              showSos
                ? "bg-tier-danger-soft text-tier-danger-ink border-tier-danger/40"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
           SOS (Demo)
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2 py-1 rounded-md font-medium border transition-colors ${
              showShelters
                ? "bg-secondary text-secondary-foreground border-primary/30"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            }`}
          >
            Shelters (Demo)
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="relative h-[480px] w-full bg-[#EBF3ED] overflow-hidden select-none">
        {/* SVG Map Canvas */}
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Grid Pattern for Geographic Reference */}
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#D5E6DB" strokeWidth="0.2" />
            </pattern>
            {/* Diagonal Stripes for Flood Inundation */}
            <pattern id="floodStripes" width="2" height="2" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="2" stroke="#8E1B2E" strokeWidth="0.6" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Topographic Contour Lines */}
          <path
            d="M 5 15 Q 35 25 65 15 T 95 30"
            fill="none"
            stroke="#C0DACB"
            strokeWidth="0.4"
            strokeDasharray="1,1"
          />
          <path
            d="M 10 70 Q 40 85 75 75 T 95 90"
            fill="none"
            stroke="#C0DACB"
            strokeWidth="0.4"
            strokeDasharray="1,1"
          />

          {/* Krishna River Line (chart-3 teal color: #0E9AA7) */}
          <path
            d="M 10 10 C 25 20, 20 40, 35 45 C 50 50, 60 65, 75 70 C 85 75, 90 90, 95 95"
            fill="none"
            stroke="#0E9AA7"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Secondary Tributary */}
          <path
            d="M 15 40 Q 30 42 35 45"
            fill="none"
            stroke="#4FB07A"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          {/* Simulated Inundation Polygons */}
          {showFloodZones &&
            floodZones.map((zone) => {
              const fillColor =
                zone.tier === "Evacuate"
                  ? "rgba(142, 27, 46, 0.45)"
                  : zone.tier === "Danger"
                  ? "rgba(207, 46, 62, 0.38)"
                  : "rgba(242, 140, 40, 0.3)";
              const strokeColor =
                zone.tier === "Evacuate" ? "#8E1B2E" : zone.tier === "Danger" ? "#CF2E3E" : "#F28C28";

              return (
                <g key={zone.id} className="transition-opacity duration-300">
                  <path
                    d={zone.svg_path}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth="0.6"
                    strokeDasharray="1,0.5"
                  />
                </g>
              );
            })}

          {/* Village Risk Markers */}
          {showTiers &&
            villages.map((v) => {
              const isSelected = selectedVillageId === v.id;
              const isUrgent = v.tier === "Evacuate" || v.tier === "Danger";
              const color = tierMarkerColors[v.tier];

              return (
                <g
                  key={v.id}
                  onClick={() => onSelectVillage(isSelected ? null : v)}
                  className="cursor-pointer group"
                >
                  {/* Subtle Pulse Halo for Urgent Tiers */}
                  {isUrgent && (
                    <circle
                      cx={v.coordinates.mapX}
                      cy={v.coordinates.mapY}
                      r="4"
                      fill={color}
                      opacity="0.3"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer Ring when Selected */}
                  {isSelected && (
                    <circle
                      cx={v.coordinates.mapX}
                      cy={v.coordinates.mapY}
                      r="3.5"
                      fill="none"
                      stroke="#0F2A1E"
                      strokeWidth="0.8"
                    />
                  )}

                  {/* Village Point Marker */}
                  <circle
                    cx={v.coordinates.mapX}
                    cy={v.coordinates.mapY}
                    r="2.2"
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth="0.6"
                    className="transition-transform group-hover:scale-125"
                  />

                  {/* Village Name Label on Canvas */}
                  <text
                    x={v.coordinates.mapX}
                    y={v.coordinates.mapY - 3.2}
                    textAnchor="middle"
                    fontSize="2.5"
                    fontWeight={isUrgent ? "bold" : "600"}
                    fill="#0F2A1E"
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {v.name}
                  </text>
                </g>
              );
            })}

          {/* SOS Marker (Shahpur Active) */}
          {showSos &&
            villages
              .filter((v) => v.has_open_sos)
              .map((v) => (
                <g key={`sos-${v.id}`} className="cursor-pointer">
                  <circle
                    cx={v.coordinates.mapX + 2.5}
                    cy={v.coordinates.mapY + 2.5}
                    r="3.5"
                    fill="#CF2E3E"
                    opacity="0.35"
                    className="animate-ping"
                  />
                  <circle
                    cx={v.coordinates.mapX + 2.5}
                    cy={v.coordinates.mapY + 2.5}
                    r="1.8"
                    fill="#CF2E3E"
                    stroke="#FFFFFF"
                    strokeWidth="0.5"
                  />
                </g>
              ))}
        </svg>

        {/* Zoom Controls (Top Right) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 rounded-lg bg-card/90 p-1 border border-border shadow-xs backdrop-blur-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
            className="p-1.5 rounded-md hover:bg-muted text-foreground transition-colors"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomInIcon size={16} />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-1.5 rounded-md hover:bg-muted text-foreground transition-colors"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOutIcon size={16} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="px-1 py-0.5 text-[9px] font-bold text-muted-foreground hover:text-foreground"
            title="Reset Map View"
          >
            RESET
          </button>
        </div>

        {/* Map Legend (Bottom Left) */}
        <div className="absolute bottom-3 left-3 rounded-lg bg-card/95 p-2.5 border border-border shadow-sm backdrop-blur-xs max-w-xs text-xs space-y-1.5">
          <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1">
            <span className="font-bold text-[11px] text-foreground uppercase tracking-wider">
              Map Legend
            </span>
            <span className="text-[10px] text-muted-foreground">Krishna Basin</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-tier-evacuate" />
              <span>Evacuate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-tier-danger" />
              <span>Danger</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-tier-warning" />
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-tier-watch" />
              <span>Watch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-tier-safe" />
              <span>Safe</span>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-0.5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-5 rounded bg-[#0E9AA7]" />
              <span>River Channel</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive animate-ping" />
              <span>SOS Active</span>
            </div>
          </div>
        </div>

        {/* Selected Village Detail Popover Card (Bottom Right) */}
        {selectedVillage && (
          <div className="absolute bottom-3 right-3 z-10 w-72 rounded-xl border border-border bg-card p-4 shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-foreground">{selectedVillage.name}</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
  Simulation data — not live conditions
</p>
                <p className="text-xs text-muted-foreground">
                  Taluka: {selectedVillage.taluka} • {selectedVillage.river_zone}
                </p>
              </div>
              <button
                onClick={() => onSelectVillage(null)}
                className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close details"
              >
                <XIcon size={14} />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <TierBadge tier={selectedVillage.tier} size="sm" />
              {selectedVillage.hours_to_impact !== null ? (
                <span className="text-xs font-bold text-foreground">
                  Impact in:{" "}
                  <span className="text-destructive font-mono">{selectedVillage.hours_to_impact}h</span>
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Normal condition</span>
              )}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs py-2 border-y border-border/70">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">Probability</span>
                <span className="font-bold">{selectedVillage.probability}%</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase">River Gauge</span>
                <span className="font-bold">{selectedVillage.gauge_level_m}m</span>
              </div>
            </div>

            {selectedVillage.has_open_sos && (
              <div className="mt-2.5 flex items-center gap-2 rounded-md bg-tier-danger-soft p-1.5 text-xs text-tier-danger-ink font-semibold">
                <ShieldAlertIcon size={14} className="shrink-0 text-destructive" />
                <span>1 Active SOS Broadcast</span>
              </div>
            )}

            <div className="mt-3">
              <Link
                href={`/officer/village/${selectedVillage.id}`}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-primary py-1.5 px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
              >
                <span>Drill-down to Village Details</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
