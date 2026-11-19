/**
 * ============================================================================
 * RULETA DE DESCANSOS FIN DE AÑO 2026 — QUIRAMA (v2 — Fechas Dinámicas)
 * Backend de sincronización en vivo para Google Sheets / Google Drive
 * ============================================================================
 *
 * INSTALACIÓN / ACTUALIZACIÓN (30 segundos):
 * 1. Abre tu hoja "Descansos Quirama Fin de Año 2026" en Google Drive:
 *    https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit
 * 2. Ve a: Extensiones -> Apps Script.
 * 3. Borra el contenido actual, pega TODO este archivo y guarda (Ctrl + S).
 * 4. Si es primera vez: Implementar -> Nueva implementación -> Aplicación web
 *    (Ejecutar como: Yo / Quién tiene acceso: Cualquier usuario).
 *    Si estás actualizando: Implementar -> Administrar implementaciones ->
 *    Editar (lápiz) -> Versión: "Nueva versión" -> Implementar
 *    (mantiene exactamente la misma URL /exec).
 */

const SPREADSHEET_ID = '1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc';
const SHEET_MAIN = 'Descansos Quirama';
const SHEET_SUMMARY = 'Resumen por Área';
const SHEET_HISTORY = 'Historial de Giros';
const TIMEZONE = 'America/Bogota';

const COLOR_PALETTE = [
  { bg: '#DCFCE7', fg: '#14532D' }, // 0 Emerald
  { bg: '#FEE2E2', fg: '#7F1D1D' }, // 1 Crimson
  { bg: '#FEF3C7', fg: '#78350F' }, // 2 Amber
  { bg: '#E0F2FE', fg: '#0C4A6E' }, // 3 Sapphire
  { bg: '#CCFBF1', fg: '#134E4A' }, // 4 Teal
  { bg: '#FFEDD5', fg: '#7C2D12' }, // 5 Terracotta
  { bg: '#DBEAFE', fg: '#1E3A8A' }, // 6 Indigo
  { bg: '#ECFCCB', fg: '#365314' }  // 7 Olive
];

const DEFAULT_OPTIONS = [
  { id: '0', label: '23 y 24 de diciembre', shortLabel: '23 y 24 Dic', days: 'Mié 23 – Jue 24 Dic 2026', seasonTag: 'Nochebuena', colorIndex: 0 },
  { id: '1', label: '25 y 26 de diciembre', shortLabel: '25 y 26 Dic', days: 'Vie 25 – Sáb 26 Dic 2026', seasonTag: 'Navidad',    colorIndex: 1 },
  { id: '2', label: '30 y 31 de diciembre', shortLabel: '30 y 31 Dic', days: 'Mié 30 – Jue 31 Dic 2026', seasonTag: 'Fin de Año', colorIndex: 2 },
  { id: '3', label: '01 y 02 de enero',     shortLabel: '01 y 02 Ene', days: 'Vie 01 – Sáb 02 Ene 2027', seasonTag: 'Año Nuevo',  colorIndex: 3 }
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

function enrichOption_(opt, fallbackIdx) {
  const idx = Number.isInteger(Number(opt.colorIndex)) ? Math.abs(Number(opt.colorIndex)) % COLOR_PALETTE.length : (fallbackIdx % COLOR_PALETTE.length);
  const pal = COLOR_PALETTE[idx];
  return {
    id: String(opt.id !== undefined ? opt.id : fallbackIdx),
    label: String(opt.label || '').trim(),
    shortLabel: String(opt.shortLabel || opt.label || '').trim(),
    days: String(opt.days || '').trim() || '—',
    seasonTag: String(opt.seasonTag || '').trim(),
    colorIndex: idx,
    bg: opt.bg || pal.bg,
    fg: opt.fg || pal.fg
  };
}

function getOptions_() {
  const props = PropertiesService.getDocumentProperties();
  try {
    const raw = props.getProperty('RULETA_OPTIONS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        return parsed.map(function (o, i) { return enrichOption_(o, i); });
      }
    }
  } catch (_) {}
  return DEFAULT_OPTIONS.map(function (o, i) { return enrichOption_(o, i); });
}

function getSettings_(options) {
  const props = PropertiesService.getDocumentProperties();
  const mode = props.getProperty('RULETA_MODE') || 'equal';
  let quotas = {};
  const defaultPerOpt = Math.ceil(44 / Math.max(1, options.length));
  options.forEach(function (o) { quotas[o.id] = defaultPerOpt; });

  try {
    const raw = props.getProperty('RULETA_QUOTAS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        options.forEach(function (o, i) {
          if (parsed[i] !== undefined) quotas[o.id] = Math.max(1, Number(parsed[i]) || defaultPerOpt);
        });
      } else if (parsed && typeof parsed === 'object') {
        options.forEach(function (o) {
          if (parsed[o.id] !== undefined) quotas[o.id] = Math.max(1, Number(parsed[o.id]) || defaultPerOpt);
        });
      }
    }
  } catch (_) {}

  const version = Number(props.getProperty('RULETA_VERSION') || '1');
  return { mode: mode, quotas: quotas, version: version };
}

function bumpVersion_() {
  const props = PropertiesService.getDocumentProperties();
  const next = Number(props.getProperty('RULETA_VERSION') || '1') + 1;
  props.setProperty('RULETA_VERSION', String(next));
  return next;
}

function findOptionById_(options, id) {
  const key = String(id);
  for (let i = 0; i < options.length; i++) {
    if (String(options[i].id) === key) return options[i];
  }
  return null;
}

function findOptionByLabel_(options, label) {
  const clean = String(label || '').trim().toLowerCase();
  if (!clean || clean === 'pendiente') return null;
  for (let i = 0; i < options.length; i++) {
    if (options[i].label.toLowerCase() === clean) return options[i];
  }
  return null;
}

function colLetter_(idx0) {
  let n = idx0 + 1;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
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

function rebuildSummarySheet_(ss, options) {
  const mainSheet = ss.getSheetByName(SHEET_MAIN);
  let sumSheet = ss.getSheetByName(SHEET_SUMMARY);
  if (!sumSheet) {
    sumSheet = ss.insertSheet(SHEET_SUMMARY);
  }
  sumSheet.clear();

  // Gather unique areas from Descansos Quirama
  const areas = [];
  if (mainSheet && mainSheet.getLastRow() >= 4) {
    const areaVals = mainSheet.getRange(4, 2, mainSheet.getLastRow() - 3, 1).getDisplayValues();
    for (let i = 0; i < areaVals.length; i++) {
      const a = String(areaVals[i][0] || '').trim();
      if (a && areas.indexOf(a) === -1) areas.push(a);
    }
  }
  if (areas.length === 0) areas.push('General');

  const headers = ['Área'].concat(options.map(function (o) { return o.label; })).concat(['Pendiente', 'Total']);
  const totalCols = headers.length;
  const lastColLetter = colLetter_(totalCols - 1);
  const lastSumColLetter = colLetter_(totalCols - 2);

  sumSheet.getRange('A1:' + lastColLetter + '1').merge()
    .setValue('RESUMEN DE DESCANSOS POR ÁREA Y FECHA — QUIRAMA 2026')
    .setBackground('#14532D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center').setVerticalAlignment('center');
  sumSheet.setRowHeight(1, 28);

  sumSheet.getRange('A2:' + lastColLetter + '2').merge()
    .setValue('Fórmulas vinculadas automáticamente a la hoja "Descansos Quirama"')
    .setBackground('#ECFDF5').setFontColor('#4B5563').setFontStyle('italic').setHorizontalAlignment('center').setVerticalAlignment('center');
  sumSheet.setRowHeight(2, 20);

  sumSheet.getRange(3, 1, 1, totalCols).setValues([headers])
    .setBackground('#166534').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('center').setWrap(true);
  sumSheet.setRowHeight(3, 26);

  const areaStart = 4;
  const areaEnd = areaStart + areas.length - 1;
  const rangeArea = "'" + SHEET_MAIN + "'!$B$4:$B$250";
  const rangeDate = "'" + SHEET_MAIN + "'!$D$4:$D$250";

  for (let i = 0; i < areas.length; i++) {
    const r = areaStart + i;
    const rowFormulas = [areas[i]];
    for (let c = 1; c <= totalCols - 2; c++) {
      const colL = colLetter_(c);
      rowFormulas.push('=COUNTIFS(' + rangeArea + ',$A' + r + ',' + rangeDate + ',' + colL + '$3)');
    }
    rowFormulas.push('=SUM(B' + r + ':' + lastSumColLetter + r + ')');
    sumSheet.getRange(r, 1, 1, totalCols).setValues([rowFormulas]);
    sumSheet.getRange(r, 2, 1, totalCols - 1).setHorizontalAlignment('center');
    sumSheet.getRange(r, totalCols).setBackground('#DCFCE7').setFontColor('#14532D').setFontWeight('bold');
  }

  const totalRow = areaEnd + 1;
  const totalFormulas = ['TOTAL GENERAL'];
  for (let c = 1; c < totalCols; c++) {
    const colL = colLetter_(c);
    totalFormulas.push('=SUM(' + colL + areaStart + ':' + colL + areaEnd + ')');
  }
  sumSheet.getRange(totalRow, 1, 1, totalCols).setValues([totalFormulas])
    .setBackground('#DCFCE7').setFontColor('#14532D').setFontWeight('bold');
  sumSheet.getRange(totalRow, 2, 1, totalCols - 1).setHorizontalAlignment('center');

  const pctRow = totalRow + 1;
  const pctFormulas = ['% del total de colaboradores'];
  for (let c = 1; c < totalCols; c++) {
    const colL = colLetter_(c);
    pctFormulas.push('=IF($' + lastColLetter + '$' + totalRow + '>0,' + colL + totalRow + '/$' + lastColLetter + '$' + totalRow + ',0)');
  }
  sumSheet.getRange(pctRow, 1, 1, totalCols).setValues([pctFormulas]);
  sumSheet.getRange(pctRow, 2, 1, totalCols - 1).setNumberFormat('0.0%').setHorizontalAlignment('center');

  sumSheet.getRange(3, 1, pctRow - 2, totalCols).setBorder(true, true, true, true, true, true, '#D1D5DB', SpreadsheetApp.BorderStyle.SOLID);
  sumSheet.setColumnWidth(1, 220);
  for (let c = 2; c <= totalCols; c++) {
    sumSheet.setColumnWidth(c, c === totalCols ? 95 : 155);
  }
}

function updateBanner_(mainSheet, totalEmps, assignedCount, settings, options) {
  const pct = options.length > 0 ? Math.round((100 / options.length) * 10) / 10 : 25;
  const modeDesc = settings.mode === 'equal'
    ? 'Probabilidad igual (' + pct + '% cada fecha)'
    : 'Cupos equilibrados (' + options.map(function (o) { return settings.quotas[o.id] || 0; }).join(' / ') + ')';
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

  const options = getOptions_();
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
      const statusText = String(row[5] || '').trim();
      const ts = String(row[6] || '').trim();

      employees.push({ id: id, area: area, name: name });

      const opt = findOptionByLabel_(options, dateLabel);
      if (opt) {
        const isManual = statusText.toLowerCase().indexOf('manual') >= 0;
        let manualReason = '';
        if (isManual && statusText.indexOf('—') >= 0) {
          manualReason = statusText.split('—').slice(1).join('—').trim();
        }
        assignments[id] = {
          optionId: opt.id,
          timestamp: ts || '',
          mode: isManual ? 'manual' : 'equal',
          isManual: isManual,
          manualReason: manualReason
        };
      }
    }
  }

  const history = [];
  const histSheet = ss.getSheetByName(SHEET_HISTORY);
  if (histSheet && histSheet.getLastRow() >= 3) {
    const hVals = histSheet.getRange(3, 1, histSheet.getLastRow() - 2, 6).getDisplayValues();
    for (let i = 0; i < hVals.length; i++) {
      const r = hVals[i];
      const hName = String(r[2] || '').trim();
      const label = String(r[4] || '').trim();
      if (!hName || !label) continue;
      const opt = findOptionByLabel_(options, label);
      const modeCell = String(r[5] || '');
      const hManual = modeCell.toLowerCase().indexOf('manual') >= 0;
      history.push({
        order: Number(r[0]) || (i + 1),
        timestamp: String(r[1] || '').trim(),
        name: hName,
        area: String(r[3] || '').trim(),
        optionId: opt ? opt.id : null,
        optionLabel: label,
        mode: hManual ? 'manual' : (modeCell.indexOf('Cupos') >= 0 ? 'balanced' : 'equal'),
        isManual: hManual,
        modeText: modeCell
      });
    }
  }

  const settings = getSettings_(options);
  return {
    ok: true,
    scriptVersion: 2,
    serverTime: new Date().toISOString(),
    version: settings.version,
    options: options,
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

function applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, isManual, manualReason) {
  const reasonClean = String(manualReason || '').trim();
  const statusVal = isManual
    ? (reasonClean ? 'Manual (sin ruleta) — ' + reasonClean : 'Manual (sin ruleta)')
    : 'Asignado';
  mainSheet.getRange(rowNum, 4, 1, 4).setValues([[
    opt.label,
    opt.days || '—',
    statusVal,
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
    .setBackground(isManual ? '#FEF3C7' : '#DCFCE7')
    .setFontColor(isManual ? '#78350F' : '#14532D')
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

function hasPriorRouletteSpin_(histSheet, empName, options) {
  if (!histSheet || histSheet.getLastRow() < 3) return null;
  const target = String(empName || '').trim().toUpperCase();
  if (!target) return null;
  const hVals = histSheet.getRange(3, 1, histSheet.getLastRow() - 2, 6).getDisplayValues();
  for (let i = 0; i < hVals.length; i++) {
    const r = hVals[i];
    const hName = String(r[2] || '').trim().toUpperCase();
    const hLabel = String(r[4] || '').trim();
    const hMode = String(r[5] || '').toLowerCase();
    if (hName === target && hMode.indexOf('manual') < 0) {
      const matched = findOptionByLabel_(options, hLabel);
      if (matched) return matched;
    }
  }
  return null;
}

function doGet(e) {
  try {
    const ss = getSpreadsheet_();
    return jsonResponse_(readFullState_(ss));
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
    let options = getOptions_();

    if (action === 'recordSpin') {
      const empId = Number(body.empId);
      const isManual = Boolean(body.isManual) || body.mode === 'manual';
      // Solo se permite sobrescribir mediante asignación manual explícita; la ruleta es 1 giro único por persona.
      const allowOverwrite = isManual && Boolean(body.forceOverwrite);
      let opt = findOptionById_(options, body.optionId);
      if (!opt && body.optionLabel) {
        opt = findOptionByLabel_(options, body.optionLabel) || enrichOption_({
          id: String(body.optionId || 'custom'),
          label: body.optionLabel,
          days: body.optionDays || '—',
          bg: body.optionBg || '#DCFCE7',
          fg: body.optionFg || '#14532D',
          colorIndex: Number(body.colorIndex) || 0
        }, 0);
      }
      if (!opt) return jsonResponse_({ ok: false, error: 'Opción de fecha inválida.' });

      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado en la hoja.' });

      const empArea = String(mainSheet.getRange(rowNum, 2).getDisplayValue() || '').trim();
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const currentDateLabel = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const existingOpt = findOptionByLabel_(options, currentDateLabel);
      const priorSpinOpt = !isManual ? hasPriorRouletteSpin_(histSheet, empName, options) : null;

      if (!allowOverwrite && (existingOpt || priorSpinOpt)) {
        const lockedOpt = existingOpt || priorSpinOpt;
        return jsonResponse_({
          ok: false,
          conflict: true,
          alreadySpun: true,
          error: 'Esta persona ya tiró la ruleta. Solo se permite 1 giro por persona.',
          existingOptionId: lockedOpt.id,
          existingOptionLabel: lockedOpt.label,
          state: readFullState_(ss)
        });
      }

      const tsFormatted = formatNowBogota_();
      const manualReason = String(body.manualReason || '').trim();
      applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, isManual, manualReason);

      const nextOrder = Math.max(1, histSheet.getLastRow() - 1);
      const pct = Math.round((100 / Math.max(1, options.length)) * 10) / 10;
      const modeLabel = isManual
        ? (manualReason ? 'Manual (sin ruleta) — ' + manualReason : 'Manual (sin ruleta)')
        : (body.mode === 'balanced' ? 'Cupos equilibrados' : 'Probabilidad igual (' + pct + '%)');
      const newHistRow = histSheet.getLastRow() + 1;
      histSheet.getRange(newHistRow, 1, 1, 6).setValues([[
        nextOrder, tsFormatted, empName, empArea, opt.label, modeLabel
      ]]);
      histSheet.getRange(newHistRow, 1).setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 2).setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 5).setBackground(opt.bg).setFontColor(opt.fg).setFontWeight('bold').setHorizontalAlignment('center');
      histSheet.getRange(newHistRow, 6)
        .setBackground(isManual ? '#FEF3C7' : '#FFFFFF')
        .setFontColor(isManual ? '#78350F' : '#1F2937')
        .setFontWeight(isManual ? 'bold' : 'normal')
        .setHorizontalAlignment('center');

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'updateOptions') {
      const incoming = Array.isArray(body.options) ? body.options : [];
      if (incoming.length < 2) {
        return jsonResponse_({ ok: false, error: 'Se requieren al menos 2 fechas en la ruleta.' });
      }
      const nextOptions = incoming.map(function (o, i) { return enrichOption_(o, i); });
      const props = PropertiesService.getDocumentProperties();
      props.setProperty('RULETA_OPTIONS', JSON.stringify(nextOptions));

      const renamedMap = body.renamedMap || {};
      const deletedLabels = (Array.isArray(body.deletedLabels) ? body.deletedLabels : []).map(function (s) {
        return String(s || '').trim().toLowerCase();
      });

      const lastRow = mainSheet.getLastRow();
      if (lastRow >= 4) {
        const rows = mainSheet.getRange(4, 4, lastRow - 3, 4).getDisplayValues();
        for (let i = 0; i < rows.length; i++) {
          const rNum = 4 + i;
          const curLabel = String(rows[i][0] || '').trim();
          const curLower = curLabel.toLowerCase();
          if (!curLabel || curLower === 'pendiente') continue;

          if (deletedLabels.indexOf(curLower) >= 0) {
            applyPendingToRow_(mainSheet, rNum);
            continue;
          }

          let targetOpt = null;
          if (renamedMap[curLower] !== undefined) {
            targetOpt = findOptionById_(nextOptions, renamedMap[curLower]);
          } else {
            targetOpt = findOptionByLabel_(nextOptions, curLabel);
          }

          if (targetOpt) {
            const curStatus = String(rows[i][2] || '');
            const wasManual = curStatus.toLowerCase().indexOf('manual') >= 0;
            const mSplit = curStatus.split('—');
            const prevReason = wasManual && mSplit.length > 1 ? mSplit.slice(1).join('—').trim() : '';
            applyAssignmentToRow_(mainSheet, rNum, targetOpt, rows[i][3] || '', wasManual, prevReason);
          }
        }
      }

      // Also update renamed labels in Historial de Giros
      if (histSheet.getLastRow() >= 3 && Object.keys(renamedMap).length > 0) {
        const hLabels = histSheet.getRange(3, 5, histSheet.getLastRow() - 2, 1).getDisplayValues();
        for (let i = 0; i < hLabels.length; i++) {
          const curLower = String(hLabels[i][0] || '').trim().toLowerCase();
          if (renamedMap[curLower] !== undefined) {
            const targetOpt = findOptionById_(nextOptions, renamedMap[curLower]);
            if (targetOpt) {
              histSheet.getRange(3 + i, 5)
                .setValue(targetOpt.label)
                .setBackground(targetOpt.bg)
                .setFontColor(targetOpt.fg)
                .setFontWeight('bold');
            }
          }
        }
      }

      if (body.quotas && typeof body.quotas === 'object') {
        props.setProperty('RULETA_QUOTAS', JSON.stringify(body.quotas));
      }

      rebuildSummarySheet_(ss, nextOptions);
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(nextOptions), nextOptions);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'clearAssignment') {
      const empId = Number(body.empId);
      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado.' });
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const curDate = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const curStatus = String(mainSheet.getRange(rowNum, 6).getDisplayValue() || '').toLowerCase();
      const hasExisting = Boolean(findOptionByLabel_(options, curDate));
      const spunBefore = (hasExisting && curStatus.indexOf('manual') < 0) || Boolean(hasPriorRouletteSpin_(histSheet, empName, options));
      if (spunBefore) {
        return jsonResponse_({
          ok: false,
          error: 'No se puede borrar un giro de ruleta ya realizado. Solo se permite 1 giro por persona.',
          state: readFullState_(ss)
        });
      }
      applyPendingToRow_(mainSheet, rowNum);
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
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

      rebuildSummarySheet_(ss, options);
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
      return jsonResponse_({ ok: true, addedId: newId, state: freshState });
    }

    if (action === 'updateSettings') {
      const props = PropertiesService.getDocumentProperties();
      const mode = body.mode === 'balanced' ? 'balanced' : 'equal';
      props.setProperty('RULETA_MODE', mode);
      if (body.quotas && typeof body.quotas === 'object') {
        props.setProperty('RULETA_QUOTAS', JSON.stringify(body.quotas));
      }
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
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
      updateBanner_(mainSheet, freshState.employees.length, 0, getSettings_(options), options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'pushLocalProgress') {
      if (Array.isArray(body.options) && body.options.length >= 2) {
        options = body.options.map(function (o, i) { return enrichOption_(o, i); });
        PropertiesService.getDocumentProperties().setProperty('RULETA_OPTIONS', JSON.stringify(options));
        rebuildSummarySheet_(ss, options);
      }
      const localAssignments = body.assignments || {};
      const ids = Object.keys(localAssignments);
      for (let i = 0; i < ids.length; i++) {
        const empId = Number(ids[i]);
        const rec = localAssignments[empId];
        const opt = rec ? findOptionById_(options, rec.optionId) : null;
        if (!opt) continue;
        const rowNum = findEmployeeRow_(mainSheet, empId);
        if (rowNum < 0) continue;
        const existing = findOptionByLabel_(options, mainSheet.getRange(rowNum, 4).getDisplayValue());
        if (!existing) {
          applyAssignmentToRow_(mainSheet, rowNum, opt, formatNowBogota_(), Boolean(rec.isManual), rec.manualReason || '');
        }
      }
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    return jsonResponse_({ ok: false, error: 'Acción desconocida: ' + action });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}
