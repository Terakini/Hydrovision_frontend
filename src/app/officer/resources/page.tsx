
"use client";

import { useState } from "react";
import {
  LifeBuoyIcon,
  UsersIcon,
  AlertTriangleIcon,
  ClipboardCheckIcon,
} from "@/components/hv/Icons";

type ShelterStatus = "Open" | "Nearly Full" | "Full";
type TeamStatus = "Available" | "Deployed" | "On Break";

interface Shelter {
  id: number;
  name: string;
  village: string;
  capacity: number;
  occupied: number;
  supplies: string;
  status: ShelterStatus;
}

interface RescueTeam {
  id: number;
  name: string;
  area: string;
  members: number;
  specialty: string;
  status: TeamStatus;
}

const initialShelters: Shelter[] = [
  {
    id: 1,
    name: "Kasbe Digraj Community Hall",
    village: "Kasbe Digraj",
    capacity: 200,
    occupied: 142,
    supplies: "Food, water, first aid",
    status: "Open",
  },
  {
    id: 2,
    name: "Shahpur School Shelter",
    village: "Shahpur",
    capacity: 150,
    occupied: 132,
    supplies: "Water, blankets",
    status: "Nearly Full",
  },
  {
    id: 3,
    name: "District Relief Centre",
    village: "District HQ",
    capacity: 300,
    occupied: 300,
    supplies: "Food, water, medical kits",
    status: "Full",
  },
];

const initialTeams: RescueTeam[] = [
  {
    id: 1,
    name: "Rapid Response Alpha",
    area: "Kasbe Digraj",
    members: 8,
    specialty: "Flood rescue",
    status: "Available",
  },
  {
    id: 2,
    name: "Medical Response Bravo",
    area: "Shahpur",
    members: 6,
    specialty: "First aid and evacuation support",
    status: "Deployed",
  },
  {
    id: 3,
    name: "Volunteer Team Charlie",
    area: "District HQ",
    members: 12,
    specialty: "Supplies and relief",
    status: "Available",
  },
];

function getShelterStatus(
  occupied: number,
  capacity: number
): ShelterStatus {
  if (occupied >= capacity) return "Full";
  if (occupied / capacity >= 0.85) return "Nearly Full";
  return "Open";
}

function statusClass(status: ShelterStatus | TeamStatus) {
  switch (status) {
    case "Open":
    case "Available":
      return "bg-emerald-500/15 text-emerald-500";
    case "Nearly Full":
    case "Deployed":
      return "bg-amber-500/15 text-amber-500";
    case "Full":
      return "bg-red-500/15 text-red-500";
    case "On Break":
      return "bg-slate-500/15 text-slate-400";
  }
}

export default function ResourcesPage() {
  const [shelters, setShelters] = useState(initialShelters);
  const [teams, setTeams] = useState(initialTeams);
  const [filter, setFilter] = useState<"All" | TeamStatus>("All");
  const [message, setMessage] = useState("");

  const totalCapacity = shelters.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0
  );
  const totalOccupied = shelters.reduce(
    (sum, shelter) => sum + shelter.occupied,
    0
  );
  const availableTeams = teams.filter(
    (team) => team.status === "Available"
  ).length;

  function changeTeamStatus(id: number, status: TeamStatus) {
    setTeams((current) =>
      current.map((team) =>
        team.id === id ? { ...team, status } : team
      )
    );
    setMessage("Demo team status updated. No real team was contacted.");
  }

  function changeOccupancy(id: number, change: number) {
    setShelters((current) =>
      current.map((shelter) => {
        if (shelter.id !== id) return shelter;

        const occupied = Math.max(
          0,
          Math.min(shelter.capacity, shelter.occupied + change)
        );

        return {
          ...shelter,
          occupied,
          status: getShelterStatus(occupied, shelter.capacity),
        };
      })
    );
    setMessage("Demo shelter occupancy updated.");
  }

  const filteredTeams =
    filter === "All"
      ? teams
      : teams.filter((team) => team.status === filter);

  return (
    <main className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Operations / Resource Management
        </p>
        <h1 className="mt-2 text-2xl font-bold text-foreground">
          Resources
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Monitor emergency shelter capacity and coordinate rescue teams
          and volunteers.
        </p>
      </header>

      <section className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangleIcon
            size={21}
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <div>
            <p className="font-semibold text-foreground">
              DEMO MODE — Sample resource data
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Shelter figures and team assignments are illustrative.
              Changes are temporary and local to this page. No real
              volunteers are contacted and no live inventory is updated.
            </p>
          </div>
        </div>
      </section>

      {message && (
        <div
          role="status"
          className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground"
        >
          {message}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Shelters Listed</p>
            <LifeBuoyIcon size={19} />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {shelters.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sample locations
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">People Accommodated</p>
            <UsersIcon size={19} />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {totalOccupied.toLocaleString()} / {totalCapacity.toLocaleString()}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{
                width: `${totalCapacity ? (totalOccupied / totalCapacity) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Available Teams</p>
            <ClipboardCheckIcon size={19} />
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">
            {availableTeams}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Of {teams.length} listed teams
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Emergency Shelters
            </h2>
            <p className="text-sm text-muted-foreground">
              Capacity, occupancy and listed supplies
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            {shelters.filter((shelter) => shelter.status === "Full").length} full
            {" · "}
            {shelters.filter((shelter) => shelter.status === "Nearly Full").length}{" "}
            nearly full
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {shelters.map((shelter) => {
            const occupancy = Math.round(
              (shelter.occupied / shelter.capacity) * 100
            );

            return (
              <article
                key={shelter.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {shelter.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {shelter.village}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(shelter.status)}`}
                  >
                    {shelter.status}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Occupancy
                    </p>
                    <p className="mt-1 text-xl font-bold text-foreground">
                      {shelter.occupied}
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}/ {shelter.capacity} people
                      </span>
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {occupancy}%
                  </p>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancy >= 100
                        ? "bg-red-500"
                        : occupancy >= 85
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${occupancy}%` }}
                  />
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Listed supplies:
                  </span>{" "}
                  {shelter.supplies}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => changeOccupancy(shelter.id, -1)}
                    disabled={shelter.occupied === 0}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    − 1 occupant
                  </button>
                  <button
                    type="button"
                    onClick={() => changeOccupancy(shelter.id, 1)}
                    disabled={shelter.occupied >= shelter.capacity}
                    className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-40"
                  >
                    + 1 occupant
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Rescue Teams &amp; Volunteers
          </h2>
          <p className="text-sm text-muted-foreground">
            Review demo assignments and availability.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", "Available", "Deployed", "On Break"] as const).map(
            (option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  filter === option
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
              >
                {option}
              </button>
            )
          )}
        </div>

        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Team</th>
                <th className="px-4 py-3 font-semibold">Area</th>
                <th className="px-4 py-3 font-semibold">Members</th>
                <th className="px-4 py-3 font-semibold">Specialty</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Demo Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTeams.map((team) => (
                <tr key={team.id} className="hover:bg-muted/20">
                  <td className="px-4 py-4 font-semibold text-foreground">
                    {team.name}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {team.area}
                  </td>
                  <td className="px-4 py-4 text-foreground">
                    {team.members}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {team.specialty}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(team.status)}`}
                    >
                      {team.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      aria-label={`Demo status for ${team.name}`}
                      value={team.status}
                      onChange={(event) =>
                        changeTeamStatus(
                          team.id,
                          event.target.value as TeamStatus
                        )
                      }
                      className="rounded-lg border border-border bg-background px-2 py-2 text-xs text-foreground"
                    >
                      <option value="Available">Available</option>
                      <option value="Deployed">Deployed</option>
                      <option value="On Break">On Break</option>
                    </select>
                  </td>
                </tr>
              ))}

              {filteredTeams.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No teams match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}