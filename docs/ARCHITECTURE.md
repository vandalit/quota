# Architecture — Quota Tracker

## Stack

| Capa | Tecnología | Versión | Razón |
|------|-----------|---------|-------|
| Shell nativo | Tauri | v2.x | System tray, window management, Rust backend |
| Frontend | React | 18.x | UI component model familiar |
| Lenguaje frontend | TypeScript | 5.x | Type safety end-to-end |
| Estado global | Zustand | latest | Liviano, sin boilerplate |
| Persistencia | SQLite via tauri-plugin-sql | latest | Local, relacional, sin servidor |
| Styling | CSS Modules + CSS custom properties | — | Theming via variables, zero runtime |
| Build | Vite | latest | Dev server rápido, bundling eficiente |

---

## Modelo de base de datos

```sql
-- Servicios (Claude, GPT, Cursor, etc.)
CREATE TABLE services (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  icon        TEXT,              -- emoji o path a ícono
  color_accent TEXT,             -- color hex para identidad visual
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cuentas subordinadas a un servicio
CREATE TABLE accounts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  service_id  INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,     -- "cuenta personal", "cuenta trabajo"
  is_collapsed BOOLEAN DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Entries: la quota en sí
CREATE TABLE entries (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id     INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  label          TEXT NOT NULL,
  cooldown_hours REAL NOT NULL,  -- duración del cooldown (ej: 5, 24, 144)
  window_hours   REAL,           -- ventana de tiempo del servicio
  status         TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'cooling')),
  burned_at      DATETIME,       -- cuándo se presionó 🔥
  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings de UI persistidos
CREATE TABLE ui_settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
```

---

## Estructura de carpetas (objetivo al completar el proyecto)

```
quota/
├── README.md
├── docs/
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   └── ROADMAP.md
├── src/                          # Frontend React
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── TrayPanel.tsx         # Columna principal bottom-right
│   │   ├── ServiceGroup.tsx      # Grupo colapsable por servicio
│   │   ├── AccountRow.tsx        # Fila por cuenta
│   │   ├── EntryBar.tsx          # Barra horizontal con cooldown
│   │   ├── CooldownBar.tsx       # Barra de progreso animada
│   │   └── modals/
│   │       ├── AddServiceModal.tsx
│   │       ├── AddAccountModal.tsx
│   │       └── AddEntryModal.tsx
│   ├── hooks/
│   │   ├── useEntries.ts         # CRUD + estado cooldowns
│   │   ├── useCooldownTimer.ts   # Tick engine cada 60s
│   │   └── useUISettings.ts     # Persist collapse state, theme
│   ├── store/
│   │   └── quotaStore.ts         # Zustand store
│   ├── services/
│   │   └── db.ts                 # Wrapper tipado sobre tauri-plugin-sql
│   ├── theme/
│   │   ├── base.css              # CSS custom properties base
│   │   ├── tokens.ts             # Design tokens en JS
│   │   └── themes/
│   │       └── default.css       # Skin por defecto (dark, vibrante)
│   └── types/
│       └── index.ts              # Service, Account, Entry, UISettings
└── src-tauri/                    # Backend Rust (Tauri)
    ├── src/
    │   └── main.rs
    ├── icons/
    └── tauri.conf.json
```

---

## Flujo de estados de una Entry

```
[available] ──── 🔥 burned ────► [cooling]
     ▲                                │
     │                                │
     └──── cooldown_hours elapsed ────┘
           (cálculo en memoria al tick)
```

---

## Comunicación Frontend ↔ Tauri

- El frontend llama a funciones Rust via `invoke('command_name', { payload })`
- La DB se accede desde el frontend via `tauri-plugin-sql` directamente (no requiere commands Rust custom para CRUD básico)
- Commands Rust custom necesarios:
  - `get_window_position()` — para posicionar la ventana bottom-right según resolución
  - `hide_window()` / `show_window()` — control de visibilidad desde tray

---

## Sistema de theming

```css
/* base.css — variables que todos los skins deben definir */
:root {
  --color-bg-primary: ...;
  --color-bg-secondary: ...;
  --color-accent-available: ...;    /* verde vibrante */
  --color-accent-cooling-start: ...; /* rojo */
  --color-accent-cooling-end: ...;   /* verde via amarillo */
  --color-text-primary: ...;
  --color-text-secondary: ...;
  --radius-bar: ...;
  --spacing-base: ...;
}
```

Para crear un nuevo skin: copiar `default.css`, cambiar los valores de las variables, registrar en `tokens.ts`.
