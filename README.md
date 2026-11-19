# Ruleta de Descansos Fin de Año 2026 — Quirama

Aplicación web responsiva y equitativa para sortear los descansos de fin de año 2026 del equipo de **Quirama** (44 colaboradores), diseñada para usarse desde múltiples celulares y computadores con sincronización en tiempo real en **Google Drive** y exportación directa a **Microsoft Excel (`.xlsx`)**.

- **App en línea (GitHub Pages):** https://shenao356.github.io/ruletaquirama/
- **Hoja sincronizada en Google Drive:** [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit)
- **Carpeta en Google Drive:** [RULETA DICIEMBRE 2026](https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj)

## Fechas de descanso y probabilidades

| Opción | Fechas | Días | Probabilidad |
| --- | --- | --- | --- |
| 1 | **23 y 24 de diciembre** | Mié 23 – Jue 24 Dic 2026 | **25%** |
| 2 | **25 y 26 de diciembre** | Vie 25 – Sáb 26 Dic 2026 | **25%** |
| 3 | **30 y 31 de diciembre** | Mié 30 – Jue 31 Dic 2026 | **25%** |
| 4 | **01 y 02 de enero** | Vie 01 – Sáb 02 Ene 2027 | **25%** |

Por defecto opera con **probabilidad idéntica (25% exacto por fecha en cada giro)** usando aleatoriedad criptográfica (`crypto.getRandomValues`). También incluye en **Reglas** un modo opcional de **Cupos equilibrados** (11 por fecha) si se requiere limitar la cantidad máxima por turno.

## Activar sincronización en vivo con Google Drive (1 minuto)

La hoja `Descansos Quirama Fin de Año 2026` ya fue creada en tu carpeta de Google Drive con los 44 colaboradores y las 3 pestañas (`Descansos Quirama`, `Resumen por Área` con fórmulas e `Historial de Giros`). Para que todos los dispositivos lean y escriban en tiempo real sin duplicados:

1. Abre la hoja en Google Drive: [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit).
2. Ve al menú **Extensiones → Apps Script**.
3. Borra el código inicial, pega el contenido completo de [`apps-script/Code.gs`](./apps-script/Code.gs) y guarda (`Ctrl + S`).
4. Haz clic en **Implementar → Nueva implementación**:
   - **Tipo:** Aplicación web
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
5. Autoriza los permisos y copia la URL que termina en `/exec`.
6. **Para conectarla en todos los dispositivos:**
   - **Opción A (permanente):** pega esa URL en `APPS_SCRIPT_URL` dentro de [`config.js`](./config.js) y haz commit en GitHub.
   - **Opción B (al instante sin editar código):** abre la ruleta, pulsa **Conectar Drive**, pega la URL `/exec` y usa el botón **Copiar enlace para otros dispositivos** para enviarlo por WhatsApp.

## Funciones principales

- **Multi-dispositivo con bloqueo atómico:** `LockService` en Apps Script impide que dos celulares sorteen a la misma persona al mismo tiempo; todos los dispositivos se actualizan cada 5 segundos.
- **Exportación real a Excel (`.xlsx`):** genera un archivo formateado con 3 hojas (`Descansos Quirama`, `Resumen por Área` con fórmulas `COUNTIFS`/`SUM` e `Historial de Giros`), además de CSV y copiado directo para pegar en Excel.
- **Tema claro y oscuro**, sonido mecánico opcional, búsqueda sin acentos por nombre o área, deshacer giro, re-sortear y agregar colaboradores nuevos.
