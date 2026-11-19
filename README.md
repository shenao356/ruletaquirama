# Ruleta de Descansos Fin de Año 2026 — Quirama

Aplicación web responsiva y equitativa para sortear los descansos de fin de año 2026 del equipo de **Quirama** (44 colaboradores), diseñada para usarse desde múltiples celulares y computadores con sincronización en tiempo real en **Google Drive** y exportación directa a **Microsoft Excel (`.xlsx`)**.

- **App en línea (GitHub Pages):** https://shenao356.github.io/ruletaquirama/
- **Hoja sincronizada en Google Drive:** [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit)
- **Carpeta en Google Drive:** [RULETA DICIEMBRE 2026](https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj)

## Fechas de descanso y equilibrio garantizado

| Opción | Fechas | Días | Total Quirama | A&B (25 personas) |
| --- | --- | --- | --- | --- |
| 1 | **23 y 24 de diciembre** | Mié 23 – Jue 24 Dic 2026 | **11 personas** | **6 o 7 personas** |
| 2 | **25 y 26 de diciembre** | Vie 25 – Sáb 26 Dic 2026 | **11 personas** | **6 o 7 personas** |
| 3 | **30 y 31 de diciembre** | Mié 30 – Jue 31 Dic 2026 | **11 personas** | **6 o 7 personas** |
| 4 | **01 y 02 de enero** | Vie 01 – Sáb 02 Ene 2027 | **11 personas** | **6 o 7 personas** |

Por defecto opera en modo **Equitativo estricto por área y fecha** usando aleatoriedad criptográfica (`crypto.getRandomValues`) combinada con balanceo exacto por área y global:
- **A&B (25 personas):** siempre queda repartido en **6, 6, 6 y 7** personas por fecha (diferencia máxima de 1).
- **Recepción (4)** y **Mantenimiento (4):** exactamente **1** persona por fecha.
- **Administrativa (5)** y **Ama de Llaves (5):** **1, 1, 1 y 2** personas por fecha.
- **Total general (44 personas):** exactamente **11 personas por fecha** (`11 / 11 / 11 / 11`), sin fechas sobrecargadas.
- Si se agregan o editan fechas/colaboradores, las metas equitativas se recalculan automáticamente.

## Activar sincronización en vivo con Google Drive (1 minuto)

La hoja `Descansos Quirama Fin de Año 2026` ya fue creada en tu carpeta de Google Drive con los 44 colaboradores y las 3 pestañas (`Descansos Quirama`, `Resumen por Área` con fórmulas e `Historial de Giros`). Para que todos los dispositivos lean y escriban en tiempo real sin duplicados:

1. Abre la hoja en Google Drive: [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit).
2. Ve al menú **Extensiones → Apps Script**.
3. Borra el código inicial, pega el contenido completo de [`apps-script/Code.gs`](./apps-script/Code.gs) y guarda (`Ctrl + S`).
4. Haz clic en **Implementar → Nueva implementación** (o **Administrar implementaciones → Editar → Nueva versión** si estás actualizando):
   - **Tipo:** Aplicación web
   - **Ejecutar como:** Yo (tu cuenta)
   - **Quién tiene acceso:** Cualquier usuario
5. Autoriza los permisos y copia la URL que termina en `/exec`.
6. **Para conectarla en todos los dispositivos:**
   - **Opción A (permanente):** pega esa URL en `APPS_SCRIPT_URL` dentro de [`config.js`](./config.js) y haz commit en GitHub.
   - **Opción B (al instante sin editar código):** abre la ruleta, pulsa **Conectar Drive**, pega la URL `/exec` y usa el botón **Copiar enlace para otros dispositivos** para enviarlo por WhatsApp.

## Funciones principales

- **Equilibrio estricto por área y fecha:** garantiza que ninguna fecha quede sobrecargada (máx. diferencia de 1 persona por fecha en cada área y en el total general), protegiendo especialmente la cobertura diaria de **A&B** (6–7 por fecha) y el resto de áreas. Cuando una fecha completa su cupo para el área del participante, se retira automáticamente de su ruleta.
- **Solo 1 giro por persona (bloqueo estricto):** cada colaborador puede girar la ruleta una sola vez. Al terminar su tiro, los botones de giro y atajos se bloquean, no existe opción de re-girar ni deshacer un giro, y el backend en Google Apps Script (`LockService`) rechaza cualquier segundo intento desde otro dispositivo.
- **Multi-dispositivo con bloqueo atómico:** `LockService` en Apps Script impide que dos celulares sorteen a la misma persona al mismo tiempo o excedan el cupo equitativo de una fecha; todos los dispositivos se actualizan cada 5 segundos.
- **Fechas editables y ampliables (`📅 Fechas`):** permite modificar, agregar (hasta 12 opciones) o eliminar fechas de descanso en cualquier momento, ajustando automáticamente la ruleta, las metas equitativas por área, el resumen por área y el archivo Excel.
- **Asignación manual con alerta (`✎ Asignar manual`):** permite asignar una fecha manualmente cuando haya un caso especial, mostrando ocupación actual por área/fecha, alerta si supera el cupo equitativo y marcando el registro como `Manual (sin ruleta)` en la tabla, historial, Google Drive y Excel.
- **Exportación real a Excel (`.xlsx`):** genera un archivo formateado con 3 hojas (`Descansos Quirama`, `Resumen por Área` con fórmulas `COUNTIFS`/`SUM` e `Historial de Giros`), además de CSV y copiado directo para pegar en Excel.
- **Tema claro y oscuro**, sonido mecánico opcional, búsqueda sin acentos por nombre o área y agregar colaboradores nuevos.
