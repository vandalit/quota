# PRD — Quota Tracker

**Versión:** 0.1.0  
**Estado:** En desarrollo  
**Última actualización:** 2025  
**Autor:** vandalit

---

## 1. Problema

Los servicios LLM y herramientas AI (Claude, GPT, Cursor, Antigraviity, etc.) implementan quotas de uso con ventanas de tiempo variables: 5 horas, 24 horas, 6 días, semanas o meses. Un usuario con múltiples cuentas en múltiples servicios no tiene forma rápida de saber qué cuenta está disponible en este momento.

**Caso borde crítico:** El usuario tiene todas sus quotas consumidas y no sabe cuál se va a "descongelar" primero. Necesita una ayuda visual instantánea.

---

## 2. Solución

App de system tray persistente en Windows. Al hacer click en el ícono se despliega una columna compacta en la esquina inferior derecha con todas las entradas organizadas por servicio. Cada entrada muestra su estado actual (disponible/enfriando) y cuánto tiempo falta si está en cooldown.

---

## 3. Usuarios objetivo

- Desarrolladores y usuarios avanzados que trabajan con múltiples servicios LLM/AI
- Usuarios con múltiples cuentas en el mismo servicio
- Power users que optimizan su flujo de trabajo entre herramientas AI

---

## 4. Requerimientos funcionales

### 4.1 Modelo de datos jerárquico

```
Service (ej: "Claude", "Cursor", "ChatGPT")
  └── Account (ej: "cuenta personal", "cuenta trabajo")
        └── Entry (la quota en sí, con su cooldown configurado)
```

- Un **Service** puede tener N **Accounts**
- Una **Account** puede tener N **Entries** (distintas quotas del mismo servicio)
- Cada **Entry** tiene: label, duración del cooldown (horas), ventana de tiempo, estado

### 4.2 Estados de una Entry

| Estado | Color | Descripción |
|--------|-------|-------------|
| `available` | Verde vibrante | Quota disponible, no hay cooldown activo |
| `cooling` | Rojo → Amarillo → Verde (gradiente según progreso) | Quota consumida, cooldown en curso |

Transición:
- `available → cooling`: usuario presiona 🔥 (quota burned)
- `cooling → available`: automático cuando `burned_at + cooldown_hours >= now()`

### 4.3 Interfaz principal

- **Trigger:** click en ícono de system tray
- **Posición:** columna fija en esquina inferior derecha de la pantalla
- **Ancho:** ~320px (a refinar en diseño)
- **Overflow vertical:** scroll interno si hay más items de los que caben
- **Agrupación:** por Service, con collapse/expand persistido
- **Botón collapse:** triángulo minimalista por grupo
- **Estado collapse:** persistido en `ui_settings` en SQLite

### 4.4 Interacciones por Entry

| Acción | UI | Resultado |
|--------|-----|-----------|
| Marcar quota consumida | Botón 🔥 | Entry pasa a `cooling`, `burned_at = now()` |
| Ver tiempo restante | Display en barra | Texto "Xh Ym restantes" |
| Configurar entry | Botón ⚙ | Modal con label, cooldown_hours, window_hours |
| Eliminar entry | En modal ⚙ | Confirmación + delete |
| Reset manual | En modal ⚙ | Vuelve a `available` (por error de click) |

### 4.5 Gestión de Servicios y Cuentas

- Botón "+" maestro en header del panel → modal para agregar Service
- Botón "+" en cada ServiceGroup → modal para agregar Account
- Cada Account tiene botón para agregar Entry

### 4.6 Persistencia de la app

- Al cerrar la ventana, la app NO termina — se oculta y persiste en tray
- El proceso sigue corriendo en background calculando cooldowns
- Al reabrir, el estado es calculado comparando `burned_at` con `Date.now()`

---

## 5. Requerimientos no funcionales

- **Memoria idle:** < 50MB RAM cuando está minimizada en tray
- **Arranque:** puede tolerar 1-2 segundos
- **Plataforma:** Windows (principal), cross-platform en el futuro
- **Offline:** 100% local, sin dependencias de red
- **Autostart:** opcional al boot de Windows

---

## 6. Theming y extensibilidad

- Arquitectura preparada para sistema de skins intercambiables
- CSS custom properties como design tokens
- Carpeta `themes/` con `default.css` como referencia
- Potencial futuro: skins comunitarios

---

## 7. Funcionalidades futuras (fuera de scope v1)

- Tracking de tokens consumidos (requiere APIs de los servicios)
- Sync entre máquinas
- Notificaciones push cuando una quota se desbloquea
- Gestión de sesiones y tokens
- Plataforma Linux/macOS

---

## 8. Decisiones de diseño registradas

| Decisión | Alternativas consideradas | Razón elegida |
|----------|--------------------------|---------------|
| Tauri v2 | Electron, PyQt6, CustomTkinter | Menor footprint de memoria, UI web familiar, Rust nativo |
| React + TS | Vue, Svelte | Exploración activa del autor, ecosistema amplio |
| SQLite local | JSON flat file, PostgreSQL | Relacional simple, sin servidor, fácil de inspeccionar |
| Zustand | Redux, Context API | Liviano, sin boilerplate, compatible con Tauri |
| Modelo jerárquico Service→Account→Entry | Flat list con tags | Semánticamente correcto, refleja la realidad del dominio |
| Columna bottom-right | Popup, ventana normal | Acceso rápido sin interrumpir el flujo de trabajo |
