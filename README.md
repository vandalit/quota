# Quota Tracker

App de system tray para Windows que trackea cooldowns de quotas de servicios LLM/AI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=1a1a22)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white&labelColor=1a1a22)
![Tauri](https://img.shields.io/badge/Tauri-v2-FFC131?logo=tauri&logoColor=white&labelColor=1a1a22)
![Rust](https://img.shields.io/badge/Rust-1.99-CE422B?logo=rust&logoColor=white&labelColor=1a1a22)
![SQLite](https://img.shields.io/badge/SQLite-local-003B57?logo=sqlite&logoColor=white&labelColor=1a1a22)
![Zustand](https://img.shields.io/badge/Zustand-state-orange?labelColor=1a1a22)
![Kiro](https://img.shields.io/badge/AI%20Agent-Kiro-818cf8?labelColor=1a1a22)

> Desarrollado con asistencia del agente de IA **Kiro** (Amazon). El uso de herramientas de IA en este proyecto es parte de una política de transparencia deliberada del autor.

---

## ¿Qué hace?

Permite registrar cuándo una quota de un servicio (Claude, GPT, Cursor, Antigravity, etc.) fue consumida, y visualiza en tiempo real cuánto tiempo falta para que se "descongele". Organiza las entradas jerárquicamente por servicio y cuenta de usuario.

**Caso de uso principal:** tener múltiples cuentas en múltiples servicios LLM y saber de un vistazo cuál está disponible en este momento.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + TypeScript 5 |
| Shell nativo | Tauri v2 (Rust) |
| Persistencia | SQLite via `tauri-plugin-sql` |
| Estado global | Zustand |
| Plataforma | Windows (system tray nativo) |
| Agente IA | Kiro |

## Estructura del proyecto

```
quota/
├── README.md
├── docs/
│   ├── PRD.md              # Documento maestro de producto
│   ├── ARCHITECTURE.md     # Decisiones técnicas y arquitectura
│   └── ROADMAP.md          # Fases de desarrollo con checkboxes
├── src/                    # Frontend React
│   ├── components/
│   ├── hooks/
│   ├── store/
│   ├── services/
│   ├── theme/
│   └── types/
└── src-tauri/              # Backend Rust (Tauri)
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Dev mode (abre la app en Windows con hot-reload)
npm run tauri dev

# Build de producción
npm run tauri build
```

> Requiere Rust, Node 20+ y las dependencias de sistema de Tauri. Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para detalles.

## Convenciones Git

- Solo el autor del repositorio hace `git push`
- Los commits siguen el formato: `type(scope): description`
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Documentación

- [`docs/PRD.md`](docs/PRD.md) — Documento maestro de producto
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Decisiones técnicas y arquitectura
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — Estado actual del desarrollo
