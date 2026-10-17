<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HydroVision Frontend — Engineering Rules & Constraints

## 1. Source of Truth & Scope
- **Source of Truth:** The HydroVision documentation inside `docs/` (`HydroVision_UI_Specifications_Final.docx`, `Latest HydroVision feature table.docx`, `HydroVision_Decisions_Tracker_and_Contracts.docx`, `01_HydroVision_Integration_Contract.docx`, `HydroVision_Supabase_Schema_Contract.docx`, and `HydroVision_Svi_AI_First_Exact_Build_Guide.docx`) is the single source of truth for screen names, exact UI labels, layouts, behavior, and design tokens. UI specification labels override screenshot labels.
- **Frontend Exclusivity:** Svi's responsibility is exclusively the frontend. Do NOT implement backend services, database migrations, AI model pipelines, or n8n workflows.
- **No Invented Backend Contracts:** Never invent missing API endpoints, database columns, response fields, or authentication claims. Mark any missing or unresolved detail explicitly as `REVIEW`.
- **Preserve Documentation:** Never delete, overwrite, or modify files inside `docs/`.

## 2. Architecture & Data Decoupling
- **Typed Service Interfaces:** Keep UI presentation components independent of the backend. Components must consume typed service interfaces rather than scattered fetch or Supabase calls.
- **Isolated Mock Layer:** Use mock data while backend contracts are unavailable. Keep mock fixtures in `src/lib/mock/` behind a service adapter interface.
- **Simulation & Mock Labeling:** Clearly label mock and simulated flood data in the UI. All mock/replay entities must carry `is_simulated: true`. Purple tokens (`--simulation`) are reserved strictly for simulation. Never present mock or simulated data as live flood information.

## 3. Critical Safety Invariants
- **Evacuation Alerts:** Evacuate alerts strictly require explicit officer approval in O4 and must NEVER be automatically sent. Reminders escalate after 10 minutes if unapproved.
- **SOS Cancellation Window:** Residents have a 60-second countdown window to cancel an accidental SOS broadcast.
- **Atomic Task Claiming:** Volunteer task acceptance must be atomic (first accept wins; subsequent claimants see an "Already taken" notification).
- **Shelter Status:** Display shelter capacity and status as `Open`, `Full`, or `Closed`. Do NOT guess or display occupancy numbers.
- **Data Freshness Rules:** Data `<30 min` is fresh; `30–45 min` is aging; `>45 min` is outdated. Display explicit stale-data badges when data is aging or outdated.
- **Simulation Isolation:** Reset operations must delete ONLY records where `is_simulated = true`. Live records must remain untouched.

## 4. UI Quality, Accessibility & States
- **Four Mandatory Visual States:** Every data-driven component must handle Loading (skeleton), Empty (calm neutral state), Error (with retry trigger), and Populated states.
- **No Color-Only Communication:** Never communicate risk or status through color alone. Pair color with explicit icons and text labels.
- **Responsive Viewports:**
  - Officer Console (O1–O10): Desktop-first (1280px+ full sidebar, 768px tablet icon rail, stacked mobile fallback).
  - Resident PWA (R0–R5): Mobile-first (360–400px base width, bottom tab bar, minimum 44px touch targets).
  - Field Mode (Field-Ack, Field-Shelter, Field-Tasks, Field-Verify): Mobile-first with role-switching navigation.
- **Component Discipline:** Raw shadcn primitives belong in `src/components/ui/`. HydroVision wrappers belong in `src/components/hv/`. Keep files focused and avoid giant monolith components.
- **No Unverified Completion Claims:** Never claim a feature or screen is complete unless it has been implemented and verified in the browser.

## 5. Standard Commands
- Development server: `npm run dev`
- Production build check: `npm run build`
- Lint check: `npm run lint`
