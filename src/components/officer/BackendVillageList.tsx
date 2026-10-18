
"use client";

import { useEffect, useState } from "react";

type BackendVillage = {
  id: string;
  code: string;
  name: string;
  district: string | null;
  state: string | null;
  created_at?: string;
};

type VillageListResponse = {
  data: {
    villages: BackendVillage[];
    total: number;
  };
};

export function BackendVillageList() {
  const [villages, setVillages] = useState<BackendVillage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadVillages() {
      try {
        const response = await fetch(
          "https://hydrovision-backend.onrender.com/api/v1/villages"
        );

        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const result: VillageListResponse = await response.json();

        if (!cancelled) {
          setVillages(result.data.villages ?? []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load villages"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadVillages();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Backend Village Records
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Actual village records retrieved from the backend
          </p>
        </div>

        <span className="rounded-full border border-border px-3 py-1 text-xs">
          Live API
        </span>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Loading village records...
        </p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-600">
          Could not load village records: {error}
        </p>
      ) : villages.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No village records were returned by the backend.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-muted-foreground">
            {villages.length} village record(s) returned
          </p>

          {villages.map((village) => (
            <div
              key={village.id}
              className="rounded-lg border border-border p-4"
            >
              <h3 className="font-semibold text-foreground">
                {village.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Code: {village.code}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                District: {village.district ?? "Unavailable"}
                {" · "}
                State: {village.state ?? "Unavailable"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
