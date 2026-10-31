// ─── Domain types ────────────────────────────────────────────────────────────

export interface Service {
  id: number;
  name: string;
  icon: string | null;       // emoji or icon path
  color_accent: string | null; // hex color for visual identity
  created_at: string;
}

export interface Account {
  id: number;
  service_id: number;
  label: string;             // e.g. "personal account", "work account"
  is_collapsed: boolean;
  created_at: string;
}

export type EntryStatus = "available" | "cooling";

export interface Entry {
  id: number;
  account_id: number;
  label: string;
  cooldown_hours: number;    // duration of cooldown (e.g. 5, 24, 144)
  window_hours: number | null; // service's usage window
  status: EntryStatus;
  burned_at: string | null;  // ISO datetime when 🔥 was pressed
  created_at: string;
}

// ─── Derived / computed types ─────────────────────────────────────────────────

export interface CooldownProgress {
  status: EntryStatus;
  progressPercent: number;   // 0–100, where 100 = fully cooled = available
  remainingMs: number;       // milliseconds until available (0 if available)
  remainingLabel: string;    // e.g. "4h 23m" or "Available"
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface UISettings {
  key: string;
  value: string;
}

// Hydrated tree used by the UI (joins services → accounts → entries)
export interface ServiceWithAccounts extends Service {
  accounts: AccountWithEntries[];
  is_collapsed: boolean;     // service-level collapse state from ui_settings
}

export interface AccountWithEntries extends Account {
  entries: Entry[];
}
