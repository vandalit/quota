// ─── Design tokens as JS constants ────────────────────────────────────────────
// Mirrors the CSS variables in base.css for use in TypeScript logic
// (e.g. canvas drawing, dynamic gradient calculations).
// Keep in sync with base.css.

export const colors = {
  bgPrimary: "#0f0f13",
  bgSecondary: "#1a1a22",
  bgTertiary: "#22222e",
  bgHover: "#2a2a38",

  available: "#22c55e",
  availableDim: "#16a34a",
  coolingStart: "#ef4444",
  coolingMid: "#f59e0b",
  coolingEnd: "#22c55e",
  burned: "#ef4444",

  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#475569",

  border: "#2a2a38",
  borderHover: "#3f3f52",

  accent: "#818cf8",
  accentHover: "#6366f1",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  full: 9999,
} as const;

export const typography = {
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  sizeXs: 10,
  sizeSm: 12,
  sizeBase: 13,
  sizeMd: 14,
} as const;

export const panel = {
  width: 340,
  barHeight: 36,
} as const;
