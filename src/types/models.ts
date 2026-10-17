export type RiskTier = "Safe" | "Watch" | "Warning" | "Danger" | "Evacuate" | "Unknown";

export interface Village {
  id: string;
  name: string;
  taluka: string;
  river_zone: string;
  tier: RiskTier;
  hours_to_impact: number | null; // null for Safe
  probability: number; // percentage 0-100
  population: number;
  people_in_danger: number;
  gauge_level_m: number;
  danger_level_m: number;
  awaiting_approval?: boolean;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // percentage for SVG map (0-100)
    mapY: number; // percentage for SVG map (0-100)
  };
  has_open_sos?: boolean;
  assigned_shelters_count: number;
  assigned_boats_count: number;
  is_simulated: boolean;
}

export interface KpiStats {
  villages_at_risk_count: number;
  villages_split: string;
  alerts_sent_count: number;
  ack_rate_pct: number;
  open_sos_count: number;
  people_in_danger_count: number;
  available_shelters_count: number;
  pending_tasks_count: number;
  is_simulated: boolean;
}

export interface ActivityEvent {
  id: string;
  kind: "tier_escalation" | "alert_dispatched" | "sos_raised" | "ground_report" | "task_completed" | "source_health";
  title: string;
  description: string;
  time_ago: string;
  village_name?: string;
  tier?: RiskTier;
  target_url?: string;
}

export interface FloodZonePolygon {
  id: string;
  village_id: string;
  village_name: string;
  tier: RiskTier;
  svg_path: string;
  inundation_depth_m: string;
  is_simulated: boolean;
}
