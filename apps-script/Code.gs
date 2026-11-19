/**
 * ============================================================================
 * RULETA DE DESCANSOS FIN DE AÑO 2026 — QUIRAMA
 * Backend de sincronización en vivo para Google Sheets / Google Drive
 * ============================================================================
 *
 * INSTALACIÓN (1 minuto):
 * 1. Abre tu hoja "Descansos Quirama Fin de Año 2026" en Google Drive:
 *    https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit
 * 2. Ve a: Extensiones -> Apps Script.
 * 3. Borra el contenido actual, pega TODO este archivo y guarda (Ctrl + S).
 * 4. Haz clic en: Implementar -> Nueva implementación.
 *    - Tipo: Aplicación web
 *    - Ejecutar como: Yo (tu cuenta)
 *    - Quién tiene acceso: Cualquier usuario
 * 5. Autoriza los permisos y copia la URL que termina en /exec.
 * 6. Pega esa URL en la app web (botón "Conectar Drive") o en config.js del repo.
 */

const SPREADSHEET_ID = '1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc';
const SHEET_MAIN = 'Descansos Quirama';
const SHEET_SUMMARY = 'Resumen por Área';
const SHEET_HISTORY = 'Historial de Giros';
const TIMEZONE = 'America/Bogota';

const REST_OPTIONS = [
  { id: 0, label: '23 y 24 de diciembre', days: 'Mié 23 – Jue 24 Dic 2026', bg: '#DCFCE7', fg: '#14532D' },
  { id: 1, label: '25 y 26 de diciembre', days: 'Vie 25 – Sáb 26 Dic 2026', bg: '#FEE2E2', fg: '#7F1D1D' },
  { id: 2, label: '30 y 31 de diciembre', days: 'Mié 30 – Jue 31 Dic 2026', bg: '#FEF3C7', fg: '#78350F' },
  { id: 3, label: '01 y 02 de enero',     days: 'Vie 01 – Sáb 02 Ene 2027', bg: '#E0F2FE', fg: '#0C4A6E' }
];

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSettings_() {
  const props = PropertiesService.getDocumentProperties();
  const mode = props.getProperty('RULETA_MODE') || 'equal';
  let quotas = [11, 11, 11, 11];
  try {
    const raw = props.getProperty('RULETA_QUOTAS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === 4) quotas = parsed.map(Number);
    }
  } catch (_) {}
  const version = Number(props.getProperty('RULETA_VERSION') || '1');
  return { mode, quotas, version };
}

function bumpVersion_() {
  const props = PropertiesService.getDocumentProperties();
  const next = Number(props.getProperty('RULETA_VERSION') || '1') + 1;
  props.setProperty('RULETA_VERSION', String(next));
  return next;
}

function optionByLabel_(label) {
  const clean = String(label || '').trim().toLowerCase();
  for (let i = 0; i < REST_OPTIONS.length; i++) {
    if (REST_OPTIONS[i].label.toLowerCase() === clean) return REST_OPTIONS[i];
  }
  return null;
}

function formatNowBogota_() {
  return Utilities.formatDate(new Date(), TIMEZONE, 'dd/MM/yyyy HH:mm:ss');
}

function ensureHistorySheet_(ss) {
  let sh = ss.getSheetByName(SHEET_HISTORY);
  if (!sh) {
    sh = ss.insertSheet(SHEET_HISTORY);
    sh.getRange('A1:F1').merge().setValue('HISTORIAL CRONOLÓGICO DE GIROS — RULETA QUIRAMA 2026')
      .setBackground('#14532D').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sh.getRange('A2:F2').setValues([['Giro #', 'Fecha y Hora', 'Colaborador', 'Área', 'Fecha Obtenida', 'Modo de Probabilidad']])
      .setBackground('#166534').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center');
    sh.setFrozenRows(2);
  }
  return sh;
}

function updateBanner_(mainSheet, totalEmps, assignedCount, settings) {
  const modeDesc = settings.mode === 'equal'
    ? 'Probabilidad igual (25% cada fecha)'
    : 'Cupos equilibrados (' + settings.quotas.join(' / ') + ')';
  const text = 'Actualizado: ' + formatNowBogota_() +
    '  |  Sorteados: ' + assignedCount + ' de ' + totalEmps +
    '  |  Modo: ' + modeDesc;
  mainSheet.getRange('A2').setValue(text);
}

function readFullState_(ss) {
  const mainSheet = ss.getSheetByName(SHEET_MAIN);
  if (!mainSheet) {
    throw new Error('No se encontró la hoja "' + SHEET_MAIN + '".');
  }

  const lastRow = mainSheet.getLastRow();
  const employees = [];
  const assignments = {};
  let maxId = 0;

  if (lastRow >= 4) {
    const values = mainSheet.getRange(4, 1, lastRow - 3, 7).getDisplayValues();
    for (let i = 0; i < values.length; i++) {
      const row = values[i];
      const name = String(row[2] || '').trim();
      if (!name) continue;
      const id = Number(row[0]) || (i + 1);
      if (id > maxId) maxId = id;
      const area = String(row[1] || '').trim() || 'General';
      const dateLabel = String(row[3] || '').trim();
      const ts = String(row[6] || '').trim();

      employees.push({ id: id, area: area, name: name });

      const opt = optionByLabel_(dateLabel);
      if (opt) {
        assignments[id] = {
          optionId: opt.id,
          timestamp: ts || '',
          mode: 'equal'
        };
      }
    }
  }

  // Read history sheet
  const history = [];
  const histSheet = ss.getSheetByName(SHEET_HISTORY);
  if (histSheet && histSheet.getLastRow() >= 3) {
    const hVals = histSheet.getRange(3, 1, histSheet.getLastRow() - 2, 6).getDisplayValues();
    for (let i = 0; i < hVals.length; i++) {
      const r = hVals[i];
      const hName = String(r[2] || '').trim();
      const opt = optionByLabel_(r[4]);
      if (!hName || !opt) continue;
      history.push({
        order: Number(r[0]) || (i + 1),
        timestamp: String(r[1] || '').trim(),
        name: hName,
        area: String(r[3] || '').trim(),
        optionId: opt.id,
        mode: String(r[5] || '').indexOf('Cupos') >= 0 ? 'balanced' : 'equal'
      });
    }
  }

  const settings = getSettings_();
  return {
    ok: true,
    serverTime: new Date().toISOString(),
    version: settings.version,
    mode: settings.mode,
    quotas: settings.quotas,
    nextEmpId: maxId + 1,
    employees: employees,
    assignments: assignments,
    history: history,
    sheetUrl: ss.getUrl()
  };
}

function findEmployeeRow_(mainSheet, empId) {
  const lastRow = mainSheet.getLastRow();
  if (lastRow < 4) return -1;
  const ids = mainSheet.getRange(4, 1, lastRow - 3, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (Number(ids[i][0]) === Number(empId)) {
      return 4 + i;
    }
  }
  return -1;
}

function applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted) {
  mainSheet.getRange(rowNum, 4, 1, 4).setValues([[
    opt.label,
    opt.days,
    'Asignado',
    tsFormatted
  ]]);
  mainSheet.getRange(rowNum, 4)
    .setBackground(opt.bg)
    .setFontColor(opt.fg)
    .setFontWeight('bold')
    .setFontStyle('normal')
    .setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 5).setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 6)
    .setBackground('#DCFCE7')
    .setFontColor('#14532D')
    .setFontWeight('bold')
    .setFontStyle('normal')
    .setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 7).setHorizontalAlignment('center');
}

function applyPendingToRow_(mainSheet, rowNum) {
  mainSheet.getRange(rowNum, 4, 1, 4).setValues([[
    'Pendiente',
    '—',
    'Pendiente',
    ''
  ]]);
  mainSheet.getRange(rowNum, 4)
    .setBackground('#F3F4F6')
    .setFontColor('#4B5563')
    .setFontWeight('normal')
    .setFontStyle('italic')
    .setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 5).setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 6)
    .setBackground('#F3F4F6')
    .setFontColor('#4B5563')
    .setFontWeight('normal')
    .setFontStyle('italic')
    .setHorizontalAlignment('center');
  mainSheet.getRange(rowNum, 7).setHorizontalAlignment('center');
}

function doGet(e) {
  try {
    const ss = getSpreadsheet_();
    const state = readFullState_(ss);
    return jsonResponse_(state);
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const body = JSON.parse((e && e.postData && e.postData.contents) ? e.postData.contents : '{}');
    const action = String(body.action || '');
    const ss = getSpreadsheet_();
    const mainSheet = ss.getSheetByName(SHEET_MAIN);
    const histSheet = ensureHistorySheet_(ss);

    if (action === 'recordSpin') {
      const empId = Number(body.empId);
      const optionId = Number(body.optionId);
      const forceOverwrite = Boolean(body.forceOverwrite);
      const opt = REST_OPTIONS[optionId];
      if (!opt) return jsonResponse_({ ok: false, error: 'Opción de fecha inválida.' });

      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado en la hoja.' });

      const currentDateLabel = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const existingOpt = optionByLabel_(currentDateLabel);
      if (existingOpt && !forceOverwrite) {
        return jsonResponse_({
          ok: false,
          conflict: true,
          existingOptionId: existingOpt.id,
          existingOptionLabel: existingOpt.label,
          state: readFullState_(ss)
        });
      }

      const tsFormatted = formatNowBogota_();
      applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted);

      const empArea = String(mainSheet.getRange(rowNum, 2).getDisplayValue() || '').trim();
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const nextOrder = Math.max(1, histSheet.getLastRow() - 1);
      const modeLabel = body.mode === 'balanced' ? 'Cupos equilibrados' : 'Probabilidad igual (25%)';
      const newHistRow = histSheet.getLastRow() + 1;
      histSheet.getRange(newHistRow, 1, 1, 6).setValues([[
        nextOrder, tsFormatted, empName, empArea, opt.label, modeLabel
      ]]);
      histSheet.getRange(newHistRow, 1).setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 2).setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 5).setBackground(opt.bg).setFontColor(opt.fg).setFontWeight('bold').setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 6).setHorizontalAlignment('center');

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_());
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'clearAssignment') {
      const empId = Number(body.empId);
      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado.' });
      applyPendingToRow_(mainSheet, rowNum);
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_());
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'addEmployee') {
      const name = String(body.name || '').trim().toUpperCase();
      const area = String(body.area || 'A&B').trim();
      if (!name) return jsonResponse_({ ok: false, error: 'Nombre vacío.' });

      const currentState = readFullState_(ss);
      const newId = currentState.nextEmpId;
      const newRow = Math.max(4, mainSheet.getLastRow() + 1);
      mainSheet.getRange(newRow, 1, 1, 7).setValues([[
        newId, area, name, 'Pendiente', '—', 'Pendiente', ''
      ]]);
      mainSheet.getRange(newRow, 1, 1, 7).setBorder(true, true, true, true, true, true, '#D1D5DB', SpreadsheetApp.BorderStyle.SOLID);
      mainSheet.getRange(newRow, 1).setHorizontalAlignment('center');
      applyPendingToRow_(mainSheet, newRow);

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_());
      return jsonResponse_({ ok: true, addedId: newId, state: freshState });
    }

    if (action === 'updateSettings') {
      const props = PropertiesService.getDocumentProperties();
      const mode = body.mode === 'balanced' ? 'balanced' : 'equal';
      const quotas = Array.isArray(body.quotas) && body.quotas.length === 4
        ? body.quotas.map(n => Math.max(1, Number(n) || 11))
        : [11, 11, 11, 11];
      props.setProperty('RULETA_MODE', mode);
      props.setProperty('RULETA_QUOTAS', JSON.stringify(quotas));
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_());
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'resetAll') {
      const lastRow = mainSheet.getLastRow();
      for (let r = 4; r <= lastRow; r++) {
        if (String(mainSheet.getRange(r, 3).getDisplayValue() || '').trim()) {
          applyPendingToRow_(mainSheet, r);
        }
      }
      if (histSheet.getLastRow() >= 3) {
        histSheet.deleteRows(3, histSheet.getLastRow() - 2);
      }
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, 0, getSettings_());
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'pushLocalProgress') {
      const localAssignments = body.assignments || {};
      const ids = Object.keys(localAssignments);
      for (let i = 0; i < ids.length; i++) {
        const empId = Number(ids[i]);
        const rec = localAssignments[empId];
        const opt = rec ? REST_OPTIONS[Number(rec.optionId)] : null;
        if (!opt) continue;
        const rowNum = findEmployeeRow_(mainSheet, empId);
        if (rowNum < 0) continue;
        const existing = optionByLabel_(mainSheet.getRange(rowNum, 4).getDisplayValue());
        if (!existing) {
          applyAssignmentToRow_(mainSheet, rowNum, opt, formatNowBogota_());
        }
      }
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_());
      return jsonResponse_({ ok: true, state: freshState });
    }

    return jsonResponse_({ ok: false, error: 'Acción desconocida: ' + action });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
