"use client";

import React from "react";
import Link from "next/link";
import { MenuIcon, BellIcon } from "@/components/hv/Icons";
import { SimulationChip } from "@/components/hv/SimulationChip";
import { SourceStatusBadge } from "@/components/hv/SourceStatusBadge";

interface OfficerHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export function OfficerHeader({
  title = "Command Center",
  subtitle = "Shahpur District • Krishna Basin",
  onOpenMobileMenu,
}: OfficerHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-4 md:px-6 backdrop-blur-xs">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Open navigation menu"
          >
            <MenuIcon size={20} />
          </button>
        )}

        <div>
          <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>{title}</span>
          </h1>
          <p className="hidden sm:block text-xs text-muted-foreground">
            {subtitle} • <span className="font-medium text-foreground/80">Updated 12:04</span>
          </p>
        </div>
      </div>

      {/* Right: Badges, Actions, Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Prominent Purple Simulation Marker */}
        <SimulationChip label="SIMULATION" size="sm" />

        {/* Source Health Dot */}
        <div className="hidden lg:block">
          <SourceStatusBadge status="live" showText={true} />
        </div>

        {/* Review Approvals Shortcut */}
        <Link
          href="/officer/alerts"
          className="inline-flex items-center gap-1.5 rounded-lg bg-tier-warning px-2.5 py-1.5 text-xs font-bold text-black shadow-xs hover:bg-tier-warning/90 transition-colors"
          title="Review 3 alerts awaiting officer approval"
        >
          <span className="h-2 w-2 rounded-full bg-black animate-ping" />
          <span className="hidden sm:inline">Review</span> Approvals (3)
        </Link>

        {/* Notification Bell */}
        <Link
          href="/officer/alerts"
          className="relative p-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="Notifications"
        >
          <BellIcon size={18} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Link>
      </div>
    </header>
  );
}
