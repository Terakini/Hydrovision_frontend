"use client";

import React, { useState } from "react";
import { OfficerSidebar } from "@/components/officer/OfficerSidebar";
import { OfficerHeader } from "@/components/officer/OfficerHeader";

export default function OfficerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
   <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Persistent Deep-Green Sidebar */}
      <OfficerSidebar
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Viewport */}
     <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <OfficerHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
       <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
