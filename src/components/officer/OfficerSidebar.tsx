"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlertIcon,
  BellIcon,
  LifeBuoyIcon,
  ClipboardCheckIcon,
  RadioIcon,
  ActivityIcon,
  LayersIcon,
  HomeIcon,
  XIcon,
} from "@/components/hv/Icons";

interface OfficerSidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export function OfficerSidebar({
  isOpenMobile = false,
  onCloseMobile,
}: OfficerSidebarProps) {
  const pathname = usePathname();

  const navGroups = [
    {
      label: "Operations",
      items: [
        {
          name: "Command Center",
          href: "/officer/command",
          icon: <HomeIcon size={18} />,
        },
        {
          name: "Alerts & Approvals",
          href: "/officer/alerts",
          icon: <BellIcon size={18} />,
          badge: "3",
          badgeType: "warning",
        },
        {
          name: "Resources",
          href: "/officer/resources",
          icon: <LifeBuoyIcon size={18} />,
        },
        {
          name: "Ground Reports",
          href: "/officer/reports",
          icon: <ClipboardCheckIcon size={18} />,
          badge: "2",
          badgeType: "neutral",
        },
      ],
    },
    {
      label: "Intelligence",
      items: [
        {
          name: "Copilot & SitReps",
          href: "/officer/copilot",
          icon: <RadioIcon size={18} />,
        },
        {
          name: "Model & Data Health",
          href: "/officer/health",
          icon: <ActivityIcon size={18} />,
        },
      ],
    },
    {
      label: "Demo & Admin",
      items: [
        {
          name: "Replay Control",
          href: "/officer/replay",
          icon: <LayersIcon size={18} />,
          badge: "SIM",
          badgeType: "purple",
        },
        {
          name: "Knowledge Base",
          href: "/officer/kb",
          icon: <ShieldAlertIcon size={18} />,
        },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 py-4.5 border-b border-sidebar-border">
        <Link href="/officer/command" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center text-white font-extrabold text-base shadow-xs">
            HV
          </div>
          <div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              HydroVision
            </div>
            <div className="text-[11px] text-sidebar-foreground/70 font-medium">
              District Command
            </div>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
            aria-label="Close sidebar menu"
          >
            <XIcon size={20} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <div className="px-2.5 text-[11px] font-bold uppercase tracking-wider text-sidebar-foreground/50">
              {group.label}
            </div>
            <nav className="space-y-1" aria-label={group.label}>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-xs"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/60"}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          item.badgeType === "warning"
                            ? "bg-tier-warning text-black"
                            : item.badgeType === "purple"
                            ? "bg-simulation text-white"
                            : "bg-white/15 text-sidebar-foreground"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Footer User Info */}
      <div className="p-3.5 border-t border-sidebar-border bg-black/15">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/30 border border-sidebar-primary/50 flex items-center justify-center text-xs font-bold text-white">
            SK
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">S. Kulkarni</div>
            <div className="text-[10px] text-sidebar-foreground/60 truncate">District Emergency Officer</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
     <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 flex flex-col h-full max-w-xs w-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
