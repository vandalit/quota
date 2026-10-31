# Roadmap — Quota Tracker

Cada tarea representa un incremento funcional y demostrable. Las tareas se construyen sobre las anteriores.

---

## Fase 1: Fundamentos

### Task 1: Scaffolding del proyecto Tauri v2 + React ✅
- [x] Inicializar proyecto con `create-tauri-app` (React + TypeScript)
- [x] Configurar `tauri.conf.json`: `decorations: false`, `transparent: true`, window bottom-right, 340px ancho
- [x] System tray: left-click toggle ventana, right-click menú Show/Hide + Quit
- [x] Window close interceptado: oculta a tray en vez de cerrar
- [x] Prettier config, `.gitignore`, estructura de carpetas completa
- [x] Tipos base definidos: `Service`, `Account`, `Entry`, `CooldownProgress`, `UISettings`
- [x] Design tokens CSS (`base.css`) y tema dark por defecto
- [x] `db.ts` stub con migration runner (4 tablas)
- [x] Rust: 0 errores, 0 warnings — TypeScript: 0 errores

### Task 2: SQLite + modelo de datos
- [ ] Instalar y configurar `tauri-plugin-sql` con SQLite
- [ ] Migration SQL inicial: tablas `services`, `accounts`, `entries`, `ui_settings`
- [ ] Implementar `src/services/db.ts` con funciones tipadas para CRUD
- [ ] Tests de integración básicos sobre las queries
- [ ] **Demo:** CRUD verificable desde DevTools entre reinicios

---

## Fase 2: Estado y datos

### Task 3: Store global + tipos
- [ ] Definir types en `src/types/index.ts`
- [ ] Implementar Zustand store con acciones para cargar y mutar estado
- [ ] Hook `useEntries.ts` conectando DB → store → componentes
- [ ] **Demo:** Store hidratado desde SQLite al arrancar, visible en React DevTools

### Task 4: Sistema de theming / design tokens
- [ ] CSS custom properties en `base.css`
- [ ] `tokens.ts` con valores exportados para uso en JS
- [ ] Estructura `themes/` con `default.css` (dark, vibrante)
- [ ] Documentar convención para skins futuros
- [ ] **Demo:** Cambiar una variable CSS cambia el aspecto global; arquitectura de skins demostrable

---

## Fase 3: UI principal

### Task 5: TrayPanel + ServiceGroup colapsable
- [ ] `TrayPanel.tsx`: columna 320px, dark bg, scroll vertical, fixed bottom-right
- [ ] `ServiceGroup.tsx`: header con nombre, emoji, botón triangular collapse/expand
- [ ] Estado de collapse persistido en `ui_settings`
- [ ] Animación suave de expand/collapse
- [ ] **Demo:** Panel con grupos mock, collapse/expand persistido entre reinicios

### Task 6: EntryBar + CooldownBar visual
- [ ] `EntryBar.tsx`: barra horizontal compacta con label, estado, botones
- [ ] `CooldownBar.tsx`: progreso rojo→verde según tiempo transcurrido
- [ ] Lógica: `progress = (now - burned_at) / (cooldown_hours * 3600) * 100`
- [ ] Texto overlay: "4h 23m restantes" o "Disponible ✓"
- [ ] **Demo:** Barras en distintos estados con datos mock, gradiente refleja progreso real

---

## Fase 4: Lógica de negocio

### Task 7: Timer reactivo (tick engine)
- [ ] Hook `useCooldownTimer.ts`: setInterval cada 60s, recalcula estados
- [ ] Transición automática `cooling → available`
- [ ] Actualización del store sin re-fetch a DB
- [ ] Cálculo correcto al reabrir app desde tray (offline time)
- [ ] **Demo:** Barra avanza en tiempo real; transición automática a verde al cumplirse cooldown

### Task 8: Botón 🔥 y flujo "quemar quota"
- [ ] Botón 🔥 en cada EntryBar
- [ ] Acción: `burned_at = now()`, `status = 'cooling'` en DB + store
- [ ] Feedback visual inmediato
- [ ] Reset manual desde configuración de entry
- [ ] **Demo:** Entry verde → click 🔥 → entry roja con countdown iniciado

---

## Fase 5: CRUD completo y polish

### Task 9: Modales de CRUD
- [ ] `AddServiceModal`: nombre, emoji, color accent
- [ ] `AddAccountModal`: label, asociada a servicio
- [ ] `AddEntryModal`: label, cooldown_hours, window_hours
- [ ] Botón "+" maestro en header
- [ ] Botón "+" en cada ServiceGroup para nueva cuenta
- [ ] Botón ⚙ en cada entry para editar/eliminar
- [ ] Validaciones básicas de formulario
- [ ] **Demo:** Flujo completo — crear servicio → cuenta → entry → ver barra verde

### Task 10: Polish, empaquetado Windows y distribución
- [ ] Configurar build de producción en `tauri.conf.json`
- [ ] Ícono de tray personalizado
- [ ] Autostart opcional al boot de Windows
- [ ] Comportamiento al cerrar: ocultar, no terminar
- [ ] Build del instalador `.msi` / `.exe` con `tauri build`
- [ ] README actualizado con instrucciones de build
- [ ] **Demo:** App instalada en Windows, arranca con el sistema, funciona end-to-end

---

## Estado actual

| Fase | Tarea | Estado |
|------|-------|--------|
| 1 | Task 1: Scaffolding Tauri | ✅ Completado |
| 1 | Task 2: SQLite + modelo de datos | ⬜ Pendiente |
| 2 | Task 3: Store global + tipos | ⬜ Pendiente |
| 2 | Task 4: Theming / design tokens | ⬜ Pendiente |
| 3 | Task 5: TrayPanel + ServiceGroup | ⬜ Pendiente |
| 3 | Task 6: EntryBar + CooldownBar | ⬜ Pendiente |
| 4 | Task 7: Timer reactivo | ⬜ Pendiente |
| 4 | Task 8: Botón 🔥 y burn flow | ⬜ Pendiente |
| 5 | Task 9: Modales CRUD | ⬜ Pendiente |
| 5 | Task 10: Polish + distribución | ⬜ Pendiente |

Leyenda: ⬜ Pendiente · 🔄 En progreso · ✅ Completado
