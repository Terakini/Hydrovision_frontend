"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Village, RiskTier } from "@/types/models";
import { TierBadge } from "@/components/hv/TierBadge";
import { ArrowRightIcon } from "@/components/hv/Icons";

interface VillageUrgencyListProps {
  villages: Village[];
  selectedVillageId: string | null;
  onSelectVillage: (village: Village | null) => void;
}

export function VillageUrgencyList({
  villages,
  selectedVillageId,
  onSelectVillage,
}: VillageUrgencyListProps) {
  const [filterTier, setFilterTier] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [riverZone, setRiverZone] = useState<string>("All");

  const tierFilterOptions = ["All", "Evacuate", "Danger", "Warning", "Watch", "Safe"];

  // Filter and sort villages
  const filteredVillages = villages
    .filter((v) => {
      const matchesTier = filterTier === "All" || v.tier === filterTier;
      const matchesZone = riverZone === "All" || v.river_zone === riverZone;
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.taluka.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTier && matchesZone && matchesSearch;
    })
    .sort((a, b) => {
     
const tierRank: Record<RiskTier, number> = {
  Evacuate: 1,
  Danger: 2,
  Warning: 3,
  Watch: 4,
  Safe: 5,
  Unknown: 6,
};

      if (tierRank[a.tier] !== tierRank[b.tier]) {
        return tierRank[a.tier] - tierRank[b.tier];
      }
      return (a.hours_to_impact ?? 999) - (b.hours_to_impact ?? 999);
    });

  
const tierStripeColors: Record<RiskTier, string> = {
  Safe: "bg-tier-safe",
  Watch: "bg-tier-watch",
  Warning: "bg-tier-warning",
  Danger: "bg-tier-danger",
  Evacuate: "bg-tier-evacuate",
  Unknown: "bg-gray-500",
};


  return (
    <div className="flex flex-col h-[550px] rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* List Header */}
      <div className="p-4 border-b border-border space-y-3 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-foreground">
  District Village Index
  <span className="ml-2 text-[10px] font-semibold text-amber-600">
    DEMO DATA
  </span>
</h2>
            <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
              {filteredVillages.length} of {villages.length}
            </span>
          </div>
          <select
            value={riverZone}
            onChange={(e) => setRiverZone(e.target.value)}
            className="text-xs rounded-md border border-border bg-card px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            aria-label="Filter by River Zone"
          >
            <option value="All">All River Zones</option>
            <option value="Krishna Central">Krishna Central</option>
            <option value="Lower Plains">Lower Plains</option>
            <option value="Upper Basin">Upper Basin</option>
          </select>
        </div>

        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search village or taluka..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs rounded-lg border border-border bg-card px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
          {tierFilterOptions.map((tier) => (
            <button
              key={tier}
              onClick={() => setFilterTier(tier)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold shrink-0 transition-colors ${
                filterTier === tier
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card text-muted-foreground border border-border hover:bg-muted"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Urgency List Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-border/60">
        {filteredVillages.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No villages match the active filter.
          </div>
        ) : (
          filteredVillages.map((village) => {
            const isSelected = selectedVillageId === village.id;

            return (
              <div
                key={village.id}
                onClick={() => onSelectVillage(isSelected ? null : village)}
                className={`relative flex items-center justify-between p-3.5 transition-colors cursor-pointer group ${
                  isSelected ? "bg-accent/80" : "hover:bg-muted/50"
                }`}
              >
                {/* Left Severity Stripe */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${tierStripeColors[village.tier]}`}
                />

                {/* Village Info */}
                <div className="pl-2 space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-foreground truncate">
                      {village.name}
                    </span>
                    {village.awaiting_approval && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-tier-warning-soft text-tier-warning-ink border border-tier-warning/40">
                        Approval Pending
                      </span>
                    )}
                    {village.has_open_sos && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-tier-danger-soft text-tier-danger-ink border border-tier-danger/40 animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        SOS
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>Taluka: {village.taluka}</span>
                    <span>•</span>
                   <span>
  Demo probability:{" "}
  <strong className="text-foreground">{village.probability}%</strong>
</span>
                  </div>
                </div>

                {/* Right: Tier & Countdown */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <TierBadge tier={village.tier} size="sm" />
                    <div className="text-[11px] mt-0.5 text-muted-foreground font-mono">
                      {village.hours_to_impact !== null ? (
                        <span className="font-semibold text-foreground">
                         {village.hours_to_impact}h demo estimate
                        </span>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/officer/village/${village.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-xs transition-colors"
                    title={`View ${village.name} Details`}
                    aria-label={`View ${village.name} Details`}
                  >
                    <ArrowRightIcon size={14} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* List Footer */}
      <div className="p-2.5 border-t border-border bg-muted/20 text-[11px] text-muted-foreground flex items-center justify-between px-4">
        <span>Urgency-sorted: Evacuate $\rightarrow$ Safe</span>
        <span className="font-medium text-foreground">Simulated Dataset</span>
      </div>
    </div>
  );
}
