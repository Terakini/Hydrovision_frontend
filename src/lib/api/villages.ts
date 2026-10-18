
import type { Village, RiskTier } from "@/types/models";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://hydrovision-backend.onrender.com";

interface BackendVillage {
  id: string;
  code: string;
  name: string;
  district: string;
  state: string;
  geom: string | null;
}

interface VillagesApiResponse {
  data: {
    villages: BackendVillage[];
    total: number;
  };
}

function decodePoint(ewkb: string | null): {
  lat: number;
  lng: number;
} | null {
  if (!ewkb || !/^[0-9a-fA-F]+$/.test(ewkb)) return null;

  try {
    const bytes = new Uint8Array(
      ewkb.match(/.{2}/g)!.map((byte) => parseInt(byte, 16)),
    );

    // EWKB point: byte order, type/SRID, then longitude and latitude.
    const littleEndian = bytes[0] === 1;
    const view = new DataView(bytes.buffer);

    const type = view.getUint32(1, littleEndian);
    const hasSrid = (type & 0x20000000) !== 0;
    const coordinateOffset = hasSrid ? 9 : 5;

    const lng = view.getFloat64(coordinateOffset, littleEndian);
    const lat = view.getFloat64(coordinateOffset + 8, littleEndian);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      Math.abs(lat) > 90 ||
      Math.abs(lng) > 180
    ) {
      return null;
    }

    return { lat, lng };
  } catch {
    return null;
  }
}

export async function fetchBackendVillages(): Promise<Village[]> {
  const response = await fetch(`${API_BASE_URL}/api/v1/villages`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Village API request failed (${response.status}).`);
  }

  const payload = (await response.json()) as VillagesApiResponse;

  if (!Array.isArray(payload.data?.villages)) {
    throw new Error("Village API returned an unexpected response.");
  }

  return payload.data.villages.map((item, index) => {
    const point = decodePoint(item.geom);

    // These map positions are illustrative SVG positions, not geographic
    // projections. They must not be interpreted as a real flood map.
    const mapX = 50 + ((index % 5) - 2) * 8;
    const mapY = 50 + (Math.floor(index / 5) - 1) * 10;

    const tier: RiskTier = "Unknown";

    return {
      id: item.id,
      code: item.code,
      name: item.name,
      taluka: item.district || "Unknown",
      river_zone: "Unknown",
      tier,
      hours_to_impact: null,
      probability: 0,
      population: 0,
      people_in_danger: 0,
      gauge_level_m: 0,
      danger_level_m: 0,
      coordinates: {
        lat: point?.lat ?? 0,
        lng: point?.lng ?? 0,
        mapX,
        mapY,
      },
      has_open_sos: false,
      assigned_shelters_count: 0,
      assigned_boats_count: 0,
      is_simulated: false,
    };
  });
}
