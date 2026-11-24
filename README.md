# Ruleta de Descansos Fin de Año 2026 — Quirama

Aplicación web responsiva y equitativa para sortear los descansos de fin de año 2026 del equipo de **Quirama** (44 colaboradores), diseñada para usarse desde múltiples celulares y computadores con sincronización en tiempo real en **Google Drive** y exportación directa a **Microsoft Excel (`.xlsx`)**.

- **App en línea (GitHub Pages):** https://shenao356.github.io/ruletaquirama/
- **Hoja sincronizada en Google Drive:** [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit)
- **Carpeta en Google Drive:** [RULETA DICIEMBRE 2026](https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj)

## Fechas activas en la ruleta y equilibrio garantizado

| Opción | Fechas | Días | Bar (11 en ruleta) | Producción (11 en ruleta) | Total Quirama (43 en ruleta) |
| --- | --- | --- | --- | --- | --- |
| 1 | **23 y 24 de diciembre** | Mié 23 – Jue 24 Dic 2026 | **Máx. 2 personas** | **Máx. 2 personas** | **7 personas** |
| 2 | **24 y 25 de diciembre** | Jue 24 – Vie 25 Dic 2026 | **Máx. 2 personas** | **Máx. 2 personas** | **7 personas** |
| 3 | **25 y 26 de diciembre** | Vie 25 – Sáb 26 Dic 2026 | **Máx. 2 personas** | **Máx. 2 personas** | **7 personas** |
| 4 | **30 y 31 de diciembre** | Mié 30 – Jue 31 Dic 2026 | **Máx. 2 personas** | **Máx. 2 personas** | **7 personas** |
| 5 | **31 de diciembre y 01 de enero** | Jue 31 Dic – Vie 01 Ene 2027 | **Máx. 2 personas** | **Máx. 2 personas** | **8 personas** |
| 6 | **01 y 02 de enero** | Vie 01 – Sáb 02 Ene 2027 | **Máx. 2 personas** | **Máx. 2 personas (2/2 lleno)** | **7 personas** |

> **Nota:** Adicionalmente, **GARCIA CARMONA SANTIAGO (Producción)** cuenta con la fecha manual exclusiva **26 y 27 de diciembre** (`Sáb 26 – Dom 27 Dic 2026`), la cual **no aparece en la ruleta** y completa el total de 12 personas en Producción y 44 colaboradores en Quirama.

Por defecto opera en modo **Equitativo estricto por área y fecha** usando aleatoriedad criptográfica (`crypto.getRandomValues`) combinada con balanceo exacto por área y global:
- **8 áreas ordenadas:** `Administrativa` (5), `Recepción` (4), `Ama de Llaves` (5), `Bar` (11), `Producción` (12), `Almacén` (2), `Mantenimiento` (4) y `Mantenimiento Zonas Húmedas` (1).
- **13 colaboradores pre-registrados manualmente** (bloqueados desde el inicio como turnos completados, reflejados en la app, en Google Sheets y en el `.xlsx`); quedan **31 colaboradores pendientes** por girar.
- **Bar (11 personas):** regla estricta de **máximo 2 personas por fecha** en las 6 fechas activas (1 pre-registrado en `24 y 25 de diciembre` + 10 pendientes).
- **Producción (12 personas = 11 en ruleta + 1 exclusiva):** regla estricta de **máximo 2 personas por fecha** en las 6 fechas activas (2 pre-registrados ya ocupan el tope de `01 y 02 de enero`, más 9 pendientes distribuidos en las otras 5 fechas y 1 fecha exclusiva manual `26 y 27 de diciembre`).
- **Almacén (2):** ambos colaboradores ya están pre-registrados (`25 y 26 de diciembre` y `31 de diciembre y 01 de enero`).
- **Recepción (4), Ama de Llaves (5), Mantenimiento (4) y Mantenimiento Zonas Húmedas (1):** reparto equitativo de máximo 1 persona por fecha en cada área y balanceo global final de **7–8 personas por fecha**.
- **Hasta 2 tiros por persona con confirmación:** al terminar el 1.er tiro, la app pregunta explícitamente si desea **conservar la fecha obtenida** (definitivo y bloqueado) o **girar una 2.ª y última vez** (el 2.º resultado reemplaza al 1.º y queda definitivo e irreversible).

## Actualizar o activar sincronización en vivo con Google Drive

La hoja `Descansos Quirama Fin de Año 2026` cuenta con 3 pestañas (`Descansos Quirama`, `Resumen por Área` con fórmulas e `Historial de Giros`). Para activar la versión más reciente (2 tiros con bloqueo atómico en servidor, 6 fechas, Bar/Producción máx. 2/fecha y fecha manual exclusiva):

1. Abre la hoja en Google Drive: [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit).
2. Ve al menú **Extensiones → Apps Script**.
3. Borra el código anterior, pega el contenido completo de [`apps-script/Code.gs`](./apps-script/Code.gs) y guarda (`Ctrl + S`).
4. Haz clic en **Implementar → Administrar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar** (mantiene exactamente la misma URL `/exec` configurada en [`config.js`](./config.js)).

## Funciones principales

- **Regla estricta en Bar y Producción (máx. 2/fecha) y equilibrio global:** protege la cobertura de Bar y Producción en las 6 fechas activas y distribuye equitativamente el resto de áreas sin sobrecargar fechas.
- **Hasta 2 tiros con confirmación explícita:** tras el 1.er tiro se abre un modal obligatorio para conservar la fecha o girar una 2.ª y última vez; una vez confirmado o tras el 2.º tiro, el turno queda bloqueado.
- **Logo personalizable de la empresa:** sube el logotipo (PNG, JPG, WebP o SVG) o pega su URL desde el botón **🖼️ Logo** en el encabezado (o haciendo clic en la insignia `Q26`, o configurando `COMPANY_LOGO_URL` en [`config.js`](./config.js)).
- **Registro manual oculto en ajustes:** la asignación manual ya no aparece en la pantalla principal ni en la tabla de participantes; se mantiene de forma discreta dentro de **⚙ Reglas → Opciones avanzadas (administración)** solo para uso administrativo.
- **13 personas pre-registradas y bloqueadas:** cargadas en la app, en Google Sheets y en el Excel `.xlsx`, incluyendo la fecha manual exclusiva `26 y 27 de diciembre` para Santiago García Carmona (sin aparecer en la ruleta).
- **Multi-dispositivo con sincronización en vivo:** `LockService` en Apps Script evita conflictos entre dispositivos y actualiza el estado cada 5 segundos.
- **Exportación real a Excel (`.xlsx`):** genera un archivo formateado con 3 hojas (`Descansos Quirama`, `Resumen por Área` con fórmulas `COUNTIFS`/`SUM` incluyendo la columna exclusiva manual, e `Historial de Giros`), además de CSV y copiado directo para Excel.
- **Tema claro y oscuro**, sonido mecánico opcional, búsqueda sin acentos por nombre o área y gestión dinámica de fechas.
