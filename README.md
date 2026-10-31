# Quota Tracker

App de system tray para Windows que trackea cooldowns de quotas de servicios LLM/AI.

## ¿Qué hace?

Permite registrar cuándo una quota de un servicio (Claude, GPT, Cursor, etc.) fue consumida, y visualiza en tiempo real cuánto tiempo falta para que se "descongele". Organiza las entradas jerárquicamente por servicio y cuenta de usuario.

## Stack

- **Frontend:** React + TypeScript
- **Backend/Shell nativo:** Tauri v2 (Rust)
- **Persistencia:** SQLite via `tauri-plugin-sql`
- **Estado global:** Zustand
- **Plataforma inicial:** Windows (system tray nativo)

## Estructura del proyecto

```
quota/
├── README.md
├── docs/
│   ├── PRD.md              # Documento maestro de producto
│   ├── ARCHITECTURE.md     # Decisiones técnicas y arquitectura
│   └── ROADMAP.md          # Fases de desarrollo con checkboxes
└── src-tauri/              # (pendiente — Task 1)
```

## Desarrollo

> Instrucciones de setup se agregarán en Task 1 al inicializar el proyecto Tauri.

## Convenciones Git

- Solo el autor del repositorio hace `git push`
- Los commits siguen el formato: `type(scope): description`
  - Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Documentación

Ver [`docs/PRD.md`](docs/PRD.md) para el documento maestro de producto.
Ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para decisiones técnicas.
Ver [`docs/ROADMAP.md`](docs/ROADMAP.md) para el estado actual del desarrollo.
