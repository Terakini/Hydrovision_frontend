
"use client";

import { useMemo, useState } from "react";
import {
  BookOpen,
  Search,
  ShieldCheck,
  FileText,
  Waves,
  CloudRain,
  Siren,
  Map,
  ChevronRight,
  X,
  ExternalLink,
  LibraryBig,
  Info,
} from "lucide-react";

type Category =
  | "All Documents"
  | "Flood Preparedness"
  | "River Monitoring"
  | "Emergency Protocols"
  | "Evacuation Planning";

type KnowledgeDocument = {
  id: number;
  title: string;
  category: Exclude<Category, "All Documents">;
  description: string;
  source: string;
  documentType: string;
  status: "Reference topic" | "Illustrative entry";
  updated: string;
  readingTime: string;
  content: string[];
  icon: typeof FileText;
};

const categories: { name: Category; icon: typeof BookOpen }[] = [
  { name: "All Documents", icon: LibraryBig },
  { name: "Flood Preparedness", icon: ShieldCheck },
  { name: "River Monitoring", icon: Waves },
  { name: "Emergency Protocols", icon: Siren },
  { name: "Evacuation Planning", icon: Map },
];

const documents: KnowledgeDocument[] = [
  {
    id: 1,
    title: "Flood Preparedness Fundamentals",
    category: "Flood Preparedness",
    description:
      "A reference topic covering general preparedness before periods of heavy rainfall and possible flooding.",
    source: "HydroVision knowledge topic",
    documentType: "Preparedness guide",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "4 min read",
    icon: ShieldCheck,
    content: [
      "Overview",
      "Flood preparedness involves planning ahead, understanding local warning channels, protecting essential documents, and knowing how to reach safer locations when instructed by the relevant authorities.",
      "Preparation checklist",
      "Keep essential medicines, drinking water, a torch, charged communication devices, and important documents accessible. Learn the official evacuation routes and identify the local emergency contact channels before an incident occurs.",
      "During a warning",
      "Follow instructions issued by the responsible local authorities. Avoid entering floodwater, walking through moving water, or driving across flooded roads. Conditions can change quickly.",
      "Verification note",
      "This is general educational content for the interface demonstration. It is not an approved emergency procedure or a substitute for current local authority guidance.",
    ],
  },
  {
    id: 2,
    title: "Understanding River-Level Observations",
    category: "River Monitoring",
    description:
      "Learn what river gauges measure and why observations must be interpreted in their station-specific context.",
    source: "HydroVision knowledge topic",
    documentType: "Monitoring reference",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "5 min read",
    icon: Waves,
    content: [
      "Overview",
      "River gauges measure water level at a particular monitoring location. A reading describes conditions at that station and should not automatically be treated as the water level everywhere along the river.",
      "Interpreting observations",
      "Readings need a station identifier, observation timestamp, measurement unit, and information about the source. Comparing readings over time can help describe a rising or falling trend when the measurements are reliable and comparable.",
      "Thresholds and warnings",
      "Warning, danger, and high-flood levels are location-specific. Use thresholds published by the responsible authority for the relevant station. Do not infer an official danger threshold from an unrelated station or an illustrative dashboard value.",
      "Data quality",
      "Check for missing timestamps, duplicate observations, unusual jumps, sensor outages, and unit mismatches before using readings in analysis.",
      "Verification note",
      "This topic explains general concepts. No live gauge observations or official station thresholds are connected to this page.",
    ],
  },
  {
    id: 3,
    title: "Heavy Rainfall and Flood Risk",
    category: "Flood Preparedness",
    description:
      "A general overview of how rainfall, catchment conditions, drainage, and river response can interact.",
    source: "HydroVision knowledge topic",
    documentType: "Educational reference",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "4 min read",
    icon: CloudRain,
    content: [
      "Overview",
      "Heavy rainfall can increase runoff and river flow. The resulting impact depends on rainfall distribution, catchment characteristics, soil saturation, drainage, reservoir operations, and other local conditions.",
      "Why timing matters",
      "Rainfall and river-level changes do not always happen at the same time. Water can take time to travel through a catchment, and the response differs between locations and events.",
      "Interpreting risk",
      "A rainfall reading alone is not a complete flood prediction. Reliable assessments require appropriate observations, local context, validated methods, and clear uncertainty information.",
      "Operational caution",
      "Use current official forecasts and warnings for decisions. This knowledge entry does not estimate current flood risk.",
    ],
  },
  {
    id: 4,
    title: "Emergency Communication Checklist",
    category: "Emergency Protocols",
    description:
      "A planning topic for clear, time-stamped communication during a developing incident.",
    source: "HydroVision knowledge topic",
    documentType: "Communications checklist",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "3 min read",
    icon: Siren,
    content: [
      "Purpose",
      "Emergency communications should be clear, concise, time-stamped, and traceable to the person or organisation issuing the information.",
      "Information to record",
      "Record the observation time, location, reporting source, observed condition, confidence level, and the time at which the report was received. Separate directly observed facts from estimates or unverified reports.",
      "Escalation",
      "Follow the approved local incident reporting and escalation procedure. Record who received a report and whether it was acknowledged, verified, or escalated.",
      "Public messages",
      "Only authorised personnel should issue official warnings. Avoid presenting unverified reports as confirmed events.",
      "Verification note",
      "This is a generic planning checklist, not an official emergency communications protocol.",
    ],
  },
  {
    id: 5,
    title: "Evacuation Planning Considerations",
    category: "Evacuation Planning",
    description:
      "General planning considerations for safe movement, accessibility, and assistance during flood emergencies.",
    source: "HydroVision knowledge topic",
    documentType: "Planning reference",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "4 min read",
    icon: Map,
    content: [
      "Planning principles",
      "Evacuation planning should be led by the relevant authorities and account for local hazards, accessible routes, transport needs, shelter capacity, and the needs of people requiring assistance.",
      "Route conditions",
      "A route that was passable earlier may become unsafe as water levels change. Use current official route information and follow instructions from emergency personnel.",
      "Community needs",
      "Plans should consider children, older adults, people with disabilities, medical needs, and households that may need help reaching a designated safe location.",
      "Important caution",
      "Never treat a route shown in a demonstration interface as an approved evacuation route. Follow official local directions.",
    ],
  },
  {
    id: 6,
    title: "Checking the Quality of Flood Reports",
    category: "River Monitoring",
    description:
      "A practical overview of checking the completeness and traceability of incoming observations.",
    source: "HydroVision knowledge topic",
    documentType: "Data quality reference",
    status: "Illustrative entry",
    updated: "Not verified",
    readingTime: "5 min read",
    icon: FileText,
    content: [
      "Why quality checks matter",
      "Reports may contain incomplete locations, unclear observation times, duplicate entries, inconsistent units, or information that has not yet been independently confirmed.",
      "Recommended checks",
      "Check whether each report has a location, observation time, source, description, and any relevant supporting evidence. Preserve the original report and record corrections separately.",
      "Verification status",
      "Distinguish new, pending verification, verified, and rejected reports according to the workflow approved by the project team. A report should not be considered verified simply because it has been submitted.",
      "Audit trail",
      "Record changes and verification decisions so that reviewers can understand how the final record was produced.",
    ],
  },
];

const categoryColors: Record<string, string> = {
  "Flood Preparedness": "border-emerald-300/50 bg-emerald-950 text-emerald-100",
  "River Monitoring": "border-sky-300/50 bg-sky-950 text-sky-100",
  "Emergency Protocols": "border-amber-300/50 bg-amber-950 text-amber-100",
  "Evacuation Planning": "border-purple-300/50 bg-purple-950 text-purple-100",
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<Category>("All Documents");
  const [selectedDocument, setSelectedDocument] =
    useState<KnowledgeDocument | null>(null);

  const filteredDocuments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return documents.filter((document) => {
      const matchesCategory =
        activeCategory === "All Documents" ||
        document.category === activeCategory;

      const searchableText = [
        document.title,
        document.description,
        document.category,
        document.source,
        document.documentType,
        ...document.content,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-full space-y-6 bg-[#061A13] p-1 text-white">
      {/* Header */}
      <section className="rounded-2xl border border-emerald-300/40 bg-[#0B2A1F] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-950">
              <BookOpen size={28} className="text-white" />
            </div>
            <div>
              <h1 className="!text-3xl !font-bold !leading-tight !text-white sm:!text-4xl">
                Knowledge Base
              </h1>
              <p className="mt-2 !text-sm !leading-6 !text-white">
                Flood intelligence references, monitoring concepts, and
                preparedness resources.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-950 px-4 py-2.5 !text-xs !font-bold !text-white">
            <LibraryBig size={16} />
            REFERENCE LIBRARY
          </div>
        </div>
      </section>

     

      {/* Search */}
      <section className="rounded-2xl border border-emerald-300/40 bg-[#0B2A1F] p-4 sm:p-5">
        <label
          htmlFor="knowledge-search"
          className="mb-2 block !text-sm !font-bold !text-white"
        >
          SEARCH THE KNOWLEDGE BASE
        </label>

        <div className="flex items-center gap-3 rounded-xl border-2 border-emerald-200/60 bg-[#061A13] px-4">
          <Search size={21} className="shrink-0 text-emerald-200" />
          <input
            id="knowledge-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search flood preparedness, river levels, emergency plans..."
            className="min-h-12 w-full bg-transparent !text-sm !text-white outline-none placeholder:!text-emerald-100"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="rounded-lg p-1 text-white hover:bg-emerald-900"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <p className="mt-3 !text-sm !text-white">
          Search document titles, descriptions, categories, and content.
        </p>
      </section>

      {/* Category filters */}
      <section className="space-y-3">
        <h2 className="!text-lg !font-bold !text-white">
          Browse by category
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = activeCategory === category.name;

            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(category.name)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl border-2 px-4 py-3 !text-sm !font-bold transition-colors ${
                  active
                    ? "border-emerald-200 bg-emerald-400 !text-[#061A13]"
                    : "border-emerald-300/50 bg-[#0B2A1F] !text-white hover:bg-[#174B35]"
                }`}
              >
                <Icon size={17} />
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Library and document cards */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="!text-xl !font-bold !text-white">
              Document library
            </h2>
            <p className="mt-1 !text-sm !text-white">
              Browse a topic or open an entry to read its contents.
            </p>
          </div>

          <p className="rounded-lg border border-emerald-200/50 bg-[#0B2A1F] px-3 py-2 !text-sm !font-bold !text-white">
            {filteredDocuments.length}{" "}
            {filteredDocuments.length === 1 ? "entry" : "entries"}
          </p>
        </div>

        {filteredDocuments.length === 0 ? (
          <div className="rounded-2xl border-2 border-emerald-300/40 bg-[#0B2A1F] px-5 py-12 text-center">
            <Search size={32} className="mx-auto text-emerald-200" />
            <h3 className="mt-4 !text-lg !font-bold !text-white">
              No matching entries
            </h3>
            <p className="mt-2 !text-sm !text-white">
              Try another keyword or choose a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All Documents");
              }}
              className="mt-4 rounded-xl border border-emerald-200 bg-emerald-400 px-4 py-2.5 !text-sm !font-bold !text-[#061A13]"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filteredDocuments.map((document) => {
              const Icon = document.icon;

              return (
                <article
                  key={document.id}
                  className="flex flex-col rounded-2xl border border-emerald-300/40 bg-[#0B2A1F] p-5 transition-colors hover:border-emerald-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-200/50 bg-[#061A13]">
                      <Icon size={23} className="text-emerald-200" />
                    </div>

                    <span
                      className={`rounded-lg border px-2.5 py-1.5 !text-xs !font-bold ${
                        categoryColors[document.category]
                      }`}
                    >
                      {document.category}
                    </span>
                  </div>

                  <h3 className="mt-4 !text-lg !font-bold !leading-7 !text-white">
                    {document.title}
                  </h3>

                  <p className="mt-2 !text-sm !leading-6 !text-white">
                    {document.description}
                  </p>

                  <div className="mt-4 space-y-2 border-t border-emerald-300/30 pt-4">
                    <div className="flex items-start gap-2">
                      <FileText
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-200"
                      />
                      <p className="!text-sm !text-white">
                        <span className="!font-bold">Type:</span>{" "}
                        {document.documentType}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Info
                        size={16}
                        className="mt-0.5 shrink-0 text-amber-200"
                      />
                      <p className="!text-sm !text-white">
                        <span className="!font-bold">Status:</span>{" "}
                        {document.status}
                      </p>
                    </div>

                    <p className="!text-xs !text-emerald-100">
                      Source: {document.source} · {document.updated}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-emerald-300/30 pt-4">
                    <span className="!text-xs !font-semibold !text-white">
                      {document.readingTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedDocument(document)}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-400 px-4 py-2.5 !text-sm !font-bold !text-[#061A13] hover:bg-emerald-300"
                    >
                      Read entry
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

     
      {/* Document reader modal */}
      {selectedDocument && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedDocument(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-title"
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-2 border-emerald-200/70 bg-[#061A13] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-emerald-300/40 bg-[#0B2A1F] p-5">
              <div>
                <p className="!text-xs !font-bold !text-emerald-200">
                  KNOWLEDGE BASE ENTRY
                </p>
                <h2
                  id="document-title"
                  className="mt-2 !text-xl !font-bold !leading-7 !text-white sm:!text-2xl"
                >
                  {selectedDocument.title}
                </h2>
                <p className="mt-2 !text-sm !text-white">
                  {selectedDocument.category} · {selectedDocument.readingTime}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                aria-label="Close document"
                className="rounded-xl border border-emerald-200 bg-[#061A13] p-2.5 !text-white hover:bg-[#174B35]"
              >
                <X size={20} />
              </button>
            </header>

            <div className="overflow-y-auto p-5 sm:p-7">
              <div className="mb-5 rounded-xl border-2 border-amber-300 bg-[#29200B] p-4">
                <p className="!text-sm !font-bold !text-amber-200">
                  Illustrative content — not verified official guidance
                </p>
                <p className="mt-1 !text-sm !leading-6 !text-white">
                  Confirm any operational information against the responsible
                  authority&apos;s current publications.
                </p>
              </div>

              <div className="space-y-5">
                {selectedDocument.content.map((paragraph, index) => {
                  const isHeading =
                    index === 0 ||
                    [
                      "Preparation checklist",
                      "During a warning",
                      "Interpreting observations",
                      "Thresholds and warnings",
                      "Data quality",
                      "Why timing matters",
                      "Interpreting risk",
                      "Operational caution",
                      "Information to record",
                      "Escalation",
                      "Public messages",
                      "Route conditions",
                      "Community needs",
                      "Important caution",
                      "Why quality checks matter",
                      "Recommended checks",
                      "Verification status",
                      "Audit trail",
                      "Planning principles",
                    ].includes(paragraph) ||
                    paragraph === "Verification note";

                  return isHeading ? (
                    <h3
                      key={`${index}-${paragraph}`}
                      className="!text-base !font-bold !text-emerald-200"
                    >
                      {paragraph}
                    </h3>
                  ) : (
                    <p
                      key={`${index}-${paragraph}`}
                      className="!text-sm !leading-7 !text-white"
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              <div className="mt-7 rounded-xl border border-emerald-300/40 bg-[#0B2A1F] p-4">
                <p className="!text-xs !font-bold !text-emerald-200">
                  ENTRY METADATA
                </p>
                <p className="mt-2 !text-sm !text-white">
                  Source: {selectedDocument.source}
                </p>
                <p className="mt-1 !text-sm !text-white">
                  Document type: {selectedDocument.documentType}
                </p>
                <p className="mt-1 !text-sm !text-white">
                  Verification: {selectedDocument.status}
                </p>
                <p className="mt-1 !text-sm !text-white">
                  Publication or review date: {selectedDocument.updated}
                </p>
              </div>
            </div>

            <footer className="flex justify-end border-t border-emerald-300/40 bg-[#0B2A1F] p-4">
              <button
                type="button"
                onClick={() => setSelectedDocument(null)}
                className="rounded-xl border border-emerald-200 bg-emerald-400 px-5 py-2.5 !text-sm !font-bold !text-[#061A13] hover:bg-emerald-300"
              >
                Close document
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}
