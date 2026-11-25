# Ruleta de Descansos Fin de Año 2026 — Quirama

Aplicación web responsiva y equitativa para sortear los descansos de fin de año 2026 del equipo de **Quirama** (44 colaboradores), diseñada para usarse desde múltiples celulares y computadores con sincronización en tiempo real en **Google Drive** y exportación directa a **Microsoft Excel (`.xlsx`)**.

- **App en línea (GitHub Pages):** https://shenao356.github.io/ruletaquirama/
- **Hoja sincronizada en Google Drive:** [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit)
- **Carpeta en Google Drive:** [RULETA DICIEMBRE 2026](https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj)

## Fechas activas en la ruleta y reglas por área

| Opción | Fechas en ruleta | Días | Recepción | Ama de Llaves (Camareras) | Bar | Producción | Mantenimiento (+ Z. Húmedas) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | **23 y 24 de diciembre** | Mié 23 – Jue 24 Dic 2026 | **1 persona** | **2 personas (fijo)** | **Máx. 3 personas** | **Máx. 3 personas** | **Máx. 2 en 1 fecha, resto 1** |
| 2 | **25 y 26 de diciembre** | Vie 25 – Sáb 26 Dic 2026 | **1 persona** | **Máx. 1 persona** | **Máx. 3 personas** | **Máx. 3 personas** | **Máx. 2 en 1 fecha, resto 1** |
| 3 | **30 y 31 de diciembre** | Mié 30 – Jue 31 Dic 2026 | **1 persona** | **Máx. 1 persona** | **Máx. 3 personas** | **Máx. 3 personas** | **Máx. 2 en 1 fecha, resto 1** |
| 4 | **01 y 02 de enero** | Vie 01 – Sáb 02 Ene 2027 | **1 persona** | **Máx. 1 persona** | **2 personas (fijo)** | **Máx. 3 personas** | **Máx. 2 en 1 fecha, resto 1** |

> **Nota sobre fechas manuales pre-registradas:** Los **13 colaboradores pre-registrados manualmente** se conservan intactos y bloqueados desde el inicio. Las fechas **24 y 25 de diciembre** (3 personas), **26 y 27 de diciembre** (1 persona) y **31 de diciembre y 01 de enero** (5 personas) quedan como **fechas manuales exclusivas** fuera de la ruleta, y no ocupan cupo de las 4 fechas activas.

Por defecto opera en modo **Reglas estrictas por área y fecha** usando aleatoriedad criptográfica (`crypto.getRandomValues`):
- **Recepción (4 personas):** exactamente **1 persona** por cada fecha de descanso (`1 / 1 / 1 / 1`).
- **Ama de Llaves / Camareras (5 personas = 4 en ruleta + 1 manual en `31 dic y 01 ene`):** garantiza **2 personas el 23 y 24 de diciembre** y máximo **1 persona** en el resto de fechas.
- **Bar (11 personas = 10 en ruleta + 1 manual en `24 y 25 dic`):** garantiza **2 personas el 01 y 02 de enero** y máximo **3 personas** en las otras fechas.
- **Producción (12 personas = 11 en ruleta [2 pre-registrados en `01 y 02 ene` + 9 pendientes] + 1 manual en `26 y 27 dic`):** máximo **3 personas** por fecha.
- **Mantenimiento (4) + Mantenimiento Zonas Húmedas (1) = 5 personas (4 en ruleta + 1 manual en `31 dic y 01 ene`):** agrupados bajo la misma regla de **máximo 2 personas en una sola fecha y 1 persona en el resto**.
- **Administrativa (5) y Almacén (2):** todos sus colaboradores ya tienen su fecha manual pre-registrada.
- **Hasta 2 tiros por persona con confirmación:** al terminar el 1.er tiro, la app pregunta explícitamente si desea **conservar la fecha obtenida** (definitivo y bloqueado) o **girar una 2.ª y última vez** (el 2.º resultado reemplaza al 1.º y queda definitivo e irreversible).

## Actualizar o activar sincronización en vivo con Google Drive

La hoja `Descansos Quirama Fin de Año 2026` cuenta con 3 pestañas (`Descansos Quirama`, `Resumen por Área` con fórmulas e `Historial de Giros`). Para activar la versión v6 (4 fechas, nuevas reglas exactas por área, 13 pre-registrados protegidos, 2 tiros con bloqueo atómico y anulación de tiros desde administración):

1. Abre la hoja en Google Drive: [Descansos Quirama Fin de Año 2026](https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit).
2. Ve al menú **Extensiones → Apps Script**.
3. Borra el código anterior, pega el contenido completo de [`apps-script/Code.gs`](./apps-script/Code.gs) y guarda (`Ctrl + S`).
4. Haz clic en **Implementar → Administrar implementaciones → Editar (lápiz) → Versión: Nueva versión → Implementar** (mantiene exactamente la misma URL `/exec` configurada en [`config.js`](./config.js)).

## Funciones principales

- **Reglas estrictas por área en las 4 fechas activas:** garantiza automáticamente las cuotas exactas de Recepción, Ama de Llaves, Bar, Producción y Mantenimiento (+ Zonas Húmedas).
- **Hasta 2 tiros con confirmación explícita:** tras el 1.er tiro se abre un modal obligatorio para conservar la fecha o girar una 2.ª y última vez; una vez confirmado o tras el 2.º tiro, el turno queda bloqueado.
- **Herramientas administrativas ocultas en ajustes:** dentro de **⚙ Reglas → Opciones avanzadas (administración)** (plegado por defecto y oculto en la pantalla principal) se encuentra la asignación manual y la subsección oculta **Eliminar tiro de ruleta de una persona** para devolver un giro a estado *Pendiente* con 2 tiros disponibles sin modificar las fechas manuales.
- **Logo personalizable de la empresa:** sube el logotipo (PNG, JPG, WebP o SVG) o pega su URL desde el botón **🖼️ Logo** en el encabezado (o haciendo clic en la insignia `Q26`, o configurando `COMPANY_LOGO_URL` en [`config.js`](./config.js)).
- **13 personas pre-registradas y bloqueadas:** conservadas intactas en la app, en Google Sheets y en el Excel `.xlsx`, con columnas dedicadas para las fechas manuales exclusivas fuera de la ruleta.
- **Multi-dispositivo con sincronización en vivo:** `LockService` en Apps Script evita conflictos entre dispositivos y actualiza el estado cada 5 segundos.
- **Exportación real a Excel (`.xlsx`):** genera un archivo formateado con 3 hojas (`Descansos Quirama`, `Resumen por Área` con fórmulas `COUNTIFS`/`SUM` incluyendo las columnas manuales exclusivas, e `Historial de Giros`), además de CSV y copiado directo para Excel.
- **Tema claro y oscuro**, sonido mecánico opcional, búsqueda sin acentos por nombre o área y gestión dinámica de fechas.
