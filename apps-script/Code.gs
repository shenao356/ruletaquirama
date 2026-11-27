/**
 * ============================================================================
 * RULETA DE DESCANSOS FIN DE AÑO 2026 — QUIRAMA (v7 — 4 Fechas, Reglas por Área, 2 Tiros, Admin)
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
const MAX_SPINS_PER_PERSON = 2;
const PRE_REGISTERED_TIMESTAMP = '24/11/2026 14:35:00';

const COLOR_PALETTE = [
  { bg: '#DCFCE7', fg: '#14532D' }, // 0 Esmeralda
  { bg: '#FEE2E2', fg: '#7F1D1D' }, // 1 Carmesí
  { bg: '#FEF3C7', fg: '#78350F' }, // 2 Ámbar
  { bg: '#E0F2FE', fg: '#0C4A6E' }, // 3 Zafiro
  { bg: '#CCFBF1', fg: '#134E4A' }, // 4 Turquesa
  { bg: '#FFEDD5', fg: '#7C2D12' }, // 5 Terracota
  { bg: '#DBEAFE', fg: '#1E3A8A' }, // 6 Azul Rey
  { bg: '#ECFCCB', fg: '#365314' }  // 7 Oliva
];

const DEFAULT_OPTIONS = [
  { id: '0', label: '23 y 24 de diciembre', shortLabel: '23 y 24 Dic', days: 'Mié 23 – Jue 24 Dic 2026', seasonTag: 'Nochebuena', colorIndex: 0 },
  { id: '1', label: '25 y 26 de diciembre', shortLabel: '25 y 26 Dic', days: 'Vie 25 – Sáb 26 Dic 2026', seasonTag: 'Navidad',    colorIndex: 1 },
  { id: '2', label: '30 y 31 de diciembre', shortLabel: '30 y 31 Dic', days: 'Mié 30 – Jue 31 Dic 2026', seasonTag: 'Fin de Año', colorIndex: 4 },
  { id: '3', label: '01 y 02 de enero',     shortLabel: '01 y 02 Ene', days: 'Vie 01 – Sáb 02 Ene 2027', seasonTag: 'Año Nuevo',  colorIndex: 3 }
];

// Fechas manuales exclusivas que NO aparecen en la ruleta (conservan intactos los pre-registrados)
const EXCLUSIVE_MANUAL_OPTIONS = [
  {
    id: 'manual_24_25_dic',
    label: '24 y 25 de diciembre',
    shortLabel: '24 y 25 Dic',
    days: 'Jue 24 – Vie 25 Dic 2026',
    seasonTag: 'Manual exclusivo',
    colorIndex: 6,
    bg: '#DBEAFE',
    fg: '#1E3A8A',
    exclusiveManual: true,
    exclusiveEmpIds: [1, 5, 15]
  },
  {
    id: 'manual_26_27_dic',
    label: '26 y 27 de diciembre',
    shortLabel: '26 y 27 Dic',
    days: 'Sáb 26 – Dom 27 Dic 2026',
    seasonTag: 'Manual exclusivo',
    colorIndex: 5,
    bg: '#FFEDD5',
    fg: '#7C2D12',
    exclusiveManual: true,
    exclusiveEmpIds: [34]
  },
  {
    id: 'manual_31_dic_01_ene',
    label: '31 de diciembre y 01 de enero',
    shortLabel: '31 Dic y 01 Ene',
    days: 'Jue 31 Dic – Vie 01 Ene 2027',
    seasonTag: 'Manual exclusivo',
    colorIndex: 2,
    bg: '#FEF3C7',
    fg: '#78350F',
    exclusiveManual: true,
    exclusiveEmpIds: [2, 4, 12, 39, 41]
  }
];

const PRE_REGISTERED_MANUAL = [
  { empId: 4,  area: 'Administrativa', name: 'FRANCO OSPINA DIEGO ALEJANDRO',      optionId: 'manual_31_dic_01_ene', label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 5,  area: 'Administrativa', name: 'DIAZ BOHORQUEZ NINI JOHANA',         optionId: 'manual_24_25_dic',     label: '24 y 25 de diciembre',          reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 2,  area: 'Administrativa', name: 'CASTRO VALENCIA ANDRES DAVID',       optionId: 'manual_31_dic_01_ene', label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 1,  area: 'Administrativa', name: 'SALAS HERNANDEZ JHONATAN JAVIER',    optionId: 'manual_24_25_dic',     label: '24 y 25 de diciembre',          reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 15, area: 'Bar',            name: 'RENDON MEJIA PABLO ANDRES',          optionId: 'manual_24_25_dic',     label: '24 y 25 de diciembre',          reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 41, area: 'Mantenimiento',  name: 'GOMEZ CALDERON ROBIRIO ANTONIO',     optionId: 'manual_31_dic_01_ene', label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 12, area: 'Ama de Llaves',  name: 'VILLA GONZALEZ BLANCA ALICIA',       optionId: 'manual_31_dic_01_ene', label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 39, area: 'Almacén',        name: 'ALVAREZ SEPULVEDA WILSON ALEXANDER', optionId: 'manual_31_dic_01_ene', label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado', exclusiveManual: true },
  { empId: 38, area: 'Almacén',        name: 'MORALES HENAO RAUL SANTIAGO',        optionId: '1',                    label: '25 y 26 de diciembre',          reason: 'Pre-registrado' },
  { empId: 29, area: 'Producción',     name: 'RIOS GARCIA CAROLINA',               optionId: '3',                    label: '01 y 02 de enero',              reason: 'Pre-registrado' },
  { empId: 34, area: 'Producción',     name: 'GARCIA CARMONA SANTIAGO',            optionId: 'manual_26_27_dic',     label: '26 y 27 de diciembre',          reason: 'Pre-registrado (fecha exclusiva)', exclusiveManual: true },
  { empId: 26, area: 'Producción',     name: 'MARIN VELASQUEZ JUAN PABLO',         optionId: '3',                    label: '01 y 02 de enero',              reason: 'Pre-registrado' },
  { empId: 3,  area: 'Administrativa', name: 'LOPEZ BEDOYA ANA MARIA',             optionId: '1',                    label: '25 y 26 de diciembre',          reason: 'Pre-registrado' }
];

function isPreRegisteredId_(empId) {
  const target = Number(empId);
  for (let i = 0; i < PRE_REGISTERED_MANUAL.length; i++) {
    if (PRE_REGISTERED_MANUAL[i].empId === target) return true;
  }
  return false;
}

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

function stripAccents_(str) {
  return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function getRuleGroupKey_(area) {
  const clean = String(area || 'General').trim();
  const norm = stripAccents_(clean);
  if (norm === 'mantenimiento' || norm === 'mantenimiento zonas humedas') {
    return 'Mantenimiento';
  }
  return clean;
}

function isDate23_24_(opt) {
  const s = stripAccents_(opt && opt.label ? opt.label : '');
  return /\b23\b/.test(s) && /\b24\b/.test(s) && s.indexOf('dic') >= 0;
}

function isDate30_31_(opt) {
  const s = stripAccents_(opt && opt.label ? opt.label : '');
  return /\b30\b/.test(s) && /\b31\b/.test(s) && s.indexOf('dic') >= 0;
}

function isDate01_02_(opt) {
  const s = stripAccents_(opt && opt.label ? opt.label : '');
  return /\b0?1\b/.test(s) && /\b0?2\b/.test(s) && s.indexOf('ene') >= 0;
}

const GUARANTEED_SPIN_RULES = [
  {
    empId: 9,
    nameMatch: 'JURADO HENAO SANDRA MILENA',
    matchOption: isDate30_31_
  }
];

function getGuaranteedOptionForEmployee_(emp, options) {
  if (!emp || !Array.isArray(options) || options.length === 0) return null;
  const empId = Number(emp.id);
  const empNameNorm = stripAccents_(emp.name || '').replace(/\s+/g, ' ').trim();
  for (let r = 0; r < GUARANTEED_SPIN_RULES.length; r++) {
    const rule = GUARANTEED_SPIN_RULES[r];
    const ruleNameNorm = stripAccents_(rule.nameMatch).replace(/\s+/g, ' ').trim();
    const matches = (empNameNorm && empNameNorm === ruleNameNorm) ||
      (empId === rule.empId && (!empNameNorm || (empNameNorm.indexOf('jurado') >= 0 && empNameNorm.indexOf('sandra') >= 0)));
    if (matches) {
      for (let j = 0; j < options.length; j++) {
        if (rule.matchOption(options[j])) return options[j];
      }
    }
  }
  return null;
}

function enrichOption_(opt, fallbackIdx) {
  const idx = Number.isInteger(Number(opt.colorIndex))
    ? Math.abs(Number(opt.colorIndex)) % COLOR_PALETTE.length
    : (fallbackIdx % COLOR_PALETTE.length);
  const pal = COLOR_PALETTE[idx];
  return {
    id: String(opt.id !== undefined ? opt.id : fallbackIdx),
    label: String(opt.label || '').trim(),
    shortLabel: String(opt.shortLabel || opt.label || '').trim(),
    days: String(opt.days || '').trim() || '—',
    seasonTag: String(opt.seasonTag || '').trim(),
    colorIndex: idx,
    bg: opt.bg || pal.bg,
    fg: opt.fg || pal.fg,
    exclusiveManual: Boolean(opt.exclusiveManual)
  };
}

function getOptions_() {
  const props = PropertiesService.getDocumentProperties();
  const migratedV7 = props.getProperty('RULETA_V7_MIGRATED') === '1';
  try {
    const raw = props.getProperty('RULETA_OPTIONS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        const legacy6 = [
          '23 y 24 de diciembre',
          '24 y 25 de diciembre',
          '25 y 26 de diciembre',
          '30 y 31 de diciembre',
          '31 de diciembre y 01 de enero',
          '01 y 02 de enero'
        ];
        const isLegacy6 = !migratedV7 && parsed.length === 6 && parsed.every(function (o, i) {
          return o && String(o.label || '').trim().toLowerCase() === legacy6[i];
        });
        const isOfficial4WithLegacyIds = !migratedV7 && parsed.length === DEFAULT_OPTIONS.length && parsed.every(function (o, i) {
          return o && String(o.label || '').trim().toLowerCase() === DEFAULT_OPTIONS[i].label.toLowerCase();
        });
        if (!isLegacy6 && !isOfficial4WithLegacyIds) {
          return parsed.map(function (o, i) { return enrichOption_(o, i); });
        }
      }
    }
  } catch (_) {}
  return DEFAULT_OPTIONS.map(function (o, i) { return enrichOption_(o, i); });
}

function getSettings_(options) {
  const props = PropertiesService.getDocumentProperties();
  const storedMode = props.getProperty('RULETA_MODE');
  const migratedV7 = props.getProperty('RULETA_V7_MIGRATED') === '1';
  let mode = 'area_balanced';
  if (migratedV7 && (storedMode === 'area_balanced' || storedMode === 'balanced' || storedMode === 'equal')) {
    mode = storedMode;
  } else if (storedMode === 'balanced') {
    mode = 'balanced';
  }
  const quotas = {};
  const defaultPerOpt = Math.ceil(35 / Math.max(1, options.length));
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

function cappedWaterFill_(counts, pending, maxCaps) {
  const k = counts.length;
  if (k === 0) {
    return { baseNeed: [], extrasLeft: 0, eligibleForExtra: [], minAfterBase: [] };
  }
  if (pending <= 0) {
    const zeros = [];
    const falses = [];
    for (let j = 0; j < k; j++) { zeros.push(0); falses.push(false); }
    return {
      baseNeed: zeros,
      extrasLeft: 0,
      eligibleForExtra: falses,
      minAfterBase: counts.slice()
    };
  }

  let capCapacity = 0;
  let allFinite = true;
  for (let j = 0; j < k; j++) {
    const cap = maxCaps && maxCaps[j] !== undefined && maxCaps[j] !== null ? maxCaps[j] : Infinity;
    if (!isFinite(cap)) {
      allFinite = false;
    } else if (counts[j] < cap) {
      capCapacity += (cap - counts[j]);
    }
  }

  const effectiveCaps = [];
  for (let j = 0; j < k; j++) {
    if (!allFinite || capCapacity >= pending) {
      effectiveCaps.push(maxCaps && maxCaps[j] !== undefined && maxCaps[j] !== null ? maxCaps[j] : Infinity);
    } else {
      effectiveCaps.push(Infinity);
    }
  }

  const baseNeed = [];
  for (let j = 0; j < k; j++) baseNeed.push(0);
  const cur = counts.slice();
  let rem = pending;

  while (rem > 0) {
    let minOpen = Infinity;
    for (let j = 0; j < k; j++) {
      if (cur[j] < effectiveCaps[j] && cur[j] < minOpen) {
        minOpen = cur[j];
      }
    }
    if (!isFinite(minOpen)) break;

    const openAtMin = [];
    for (let j = 0; j < k; j++) {
      if (cur[j] === minOpen && cur[j] < effectiveCaps[j]) {
        openAtMin.push(j);
      }
    }
    if (openAtMin.length === 0) break;

    if (openAtMin.length <= rem) {
      for (let idx = 0; idx < openAtMin.length; idx++) {
        const j = openAtMin[idx];
        cur[j] += 1;
        baseNeed[j] += 1;
      }
      rem -= openAtMin.length;
    } else {
      const eligibleForExtra = [];
      for (let j = 0; j < k; j++) eligibleForExtra.push(false);
      for (let idx = 0; idx < openAtMin.length; idx++) eligibleForExtra[openAtMin[idx]] = true;
      return {
        baseNeed: baseNeed,
        extrasLeft: rem,
        eligibleForExtra: eligibleForExtra,
        minAfterBase: cur
      };
    }
  }

  const noneElig = [];
  for (let j = 0; j < k; j++) noneElig.push(false);
  return {
    baseNeed: baseNeed,
    extrasLeft: 0,
    eligibleForExtra: noneElig,
    minAfterBase: cur
  };
}

function buildAreaRuleSpec_(groupKey, options, counts) {
  const k = options.length;
  const norm = stripAccents_(groupKey);
  const zeros = [];
  for (let j = 0; j < k; j++) zeros.push(0);

  if (norm === 'recepcion') {
    const caps = [];
    for (let j = 0; j < k; j++) caps.push(1);
    return { fixedMin: zeros, maxCap: caps, hasCustomRule: true };
  }

  if (norm === 'ama de llaves') {
    let idx23 = -1;
    for (let j = 0; j < k; j++) {
      if (isDate23_24_(options[j])) { idx23 = j; break; }
    }
    if (idx23 >= 0) {
      const fMin = [];
      const mCap = [];
      for (let j = 0; j < k; j++) {
        fMin.push(j === idx23 ? 2 : 0);
        mCap.push(j === idx23 ? 2 : 1);
      }
      return { fixedMin: fMin, maxCap: mCap, hasCustomRule: true };
    }
  }

  if (norm === 'bar') {
    let idx01 = -1;
    for (let j = 0; j < k; j++) {
      if (isDate01_02_(options[j])) { idx01 = j; break; }
    }
    if (idx01 >= 0) {
      const fMin = [];
      const mCap = [];
      for (let j = 0; j < k; j++) {
        fMin.push(j === idx01 ? 2 : 0);
        mCap.push(j === idx01 ? 2 : 3);
      }
      return { fixedMin: fMin, maxCap: mCap, hasCustomRule: true };
    }
    const caps3 = [];
    for (let j = 0; j < k; j++) caps3.push(3);
    return { fixedMin: zeros, maxCap: caps3, hasCustomRule: true };
  }

  if (norm === 'produccion') {
    const caps3 = [];
    for (let j = 0; j < k; j++) caps3.push(3);
    return { fixedMin: zeros, maxCap: caps3, hasCustomRule: true };
  }

  if (norm === 'mantenimiento') {
    let alreadyHasDouble = false;
    for (let j = 0; j < k; j++) {
      if (counts[j] >= 2) { alreadyHasDouble = true; break; }
    }
    const mCap = [];
    for (let j = 0; j < k; j++) {
      mCap.push(alreadyHasDouble ? (counts[j] >= 2 ? counts[j] : 1) : 2);
    }
    return { fixedMin: zeros, maxCap: mCap, hasCustomRule: true };
  }

  const infCaps = [];
  for (let j = 0; j < k; j++) infCaps.push(Infinity);
  return { fixedMin: zeros, maxCap: infCaps, hasCustomRule: false };
}

function solveGroupRule_(groupKey, options, counts, pending) {
  const k = options.length;
  const spec = buildAreaRuleSpec_(groupKey, options, counts);
  const fixedMin = spec.fixedMin;
  const maxCap = spec.maxCap;

  if (k === 0 || pending <= 0) {
    const zeros = [];
    for (let j = 0; j < k; j++) zeros.push(0);
    return { spec: spec, weights: zeros, ruleMaxCap: maxCap.slice() };
  }

  const rawFixedNeed = [];
  let totalFixedNeed = 0;
  for (let j = 0; j < k; j++) {
    const need = fixedMin[j] > counts[j] ? (fixedMin[j] - counts[j]) : 0;
    rawFixedNeed.push(need);
    totalFixedNeed += need;
  }

  const fixedAlloc = [];
  for (let j = 0; j < k; j++) fixedAlloc.push(0);
  const curAfterFixed = counts.slice();
  let remPending = pending;

  if (totalFixedNeed > 0) {
    if (totalFixedNeed <= remPending) {
      for (let j = 0; j < k; j++) {
        fixedAlloc[j] = rawFixedNeed[j];
        curAfterFixed[j] += rawFixedNeed[j];
      }
      remPending -= totalFixedNeed;
    } else {
      const fCaps = [];
      for (let j = 0; j < k; j++) fCaps.push(Math.max(counts[j], fixedMin[j]));
      const wfFixed = cappedWaterFill_(counts, remPending, fCaps);
      let eligCount = 0;
      for (let j = 0; j < k; j++) if (wfFixed.eligibleForExtra[j]) eligCount++;
      const weights = [];
      for (let j = 0; j < k; j++) {
        const extra = wfFixed.eligibleForExtra[j] && eligCount > 0 ? (wfFixed.extrasLeft / eligCount) : 0;
        weights.push(wfFixed.baseNeed[j] + extra);
      }
      return { spec: spec, weights: weights, ruleMaxCap: maxCap.slice() };
    }
  }

  const wf = cappedWaterFill_(curAfterFixed, remPending, maxCap);
  let eligCount = 0;
  for (let j = 0; j < k; j++) if (wf.eligibleForExtra[j]) eligCount++;
  const weights = [];
  for (let j = 0; j < k; j++) {
    const extraShare = wf.eligibleForExtra[j] && eligCount > 0 ? (wf.extrasLeft / eligCount) : 0;
    weights.push(fixedAlloc[j] + wf.baseNeed[j] + extraShare);
  }
  return { spec: spec, weights: weights, ruleMaxCap: maxCap.slice() };
}

function computeEquityModel_(options, employees, assignments, pendingSpins, excludeEmpId) {
  const k = options.length;
  const optIndexById = {};
  const optIndexByLabel = {};
  for (let idx = 0; idx < k; idx++) {
    optIndexById[String(options[idx].id)] = idx;
    optIndexByLabel[String(options[idx].label || '').trim().toLowerCase()] = idx;
  }

  const groupList = [];
  const groupMap = {};
  const pSpins = pendingSpins || {};

  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    const area = emp.area || 'General';
    const groupKey = getRuleGroupKey_(area);
    if (!groupMap[groupKey]) {
      const zeros = [];
      for (let j = 0; j < k; j++) zeros.push(0);
      groupMap[groupKey] = { groupKey: groupKey, memberAreas: [], total: 0, exclusiveAssigned: 0, pending: 0, counts: zeros };
      groupList.push(groupMap[groupKey]);
    }
    const gEntry = groupMap[groupKey];
    if (gEntry.memberAreas.indexOf(area) === -1) gEntry.memberAreas.push(area);
    gEntry.total++;

    const isExcluded = excludeEmpId !== null && excludeEmpId !== undefined && Number(emp.id) === Number(excludeEmpId);
    const rec = isExcluded ? null : (assignments[emp.id] || pSpins[emp.id] || null);
    if (rec) {
      const recLabel = rec.optionLabel ? String(rec.optionLabel).trim().toLowerCase() : '';
      let optIdx = -1;
      if (recLabel && optIndexByLabel[recLabel] !== undefined) {
        optIdx = optIndexByLabel[recLabel];
      } else if (optIndexById[String(rec.optionId)] !== undefined) {
        optIdx = optIndexById[String(rec.optionId)];
      }
      if (optIdx >= 0) {
        gEntry.counts[optIdx]++;
      } else {
        gEntry.exclusiveAssigned++;
      }
    } else {
      gEntry.pending++;
    }
  }

  const byArea = {};
  for (let i = 0; i < groupList.length; i++) {
    const g = groupList[i];
    const solved = solveGroupRule_(g.groupKey, options, g.counts, g.pending);
    const weightsById = {};
    const countsById = {};
    const ruleMaxCapById = {};
    for (let j = 0; j < k; j++) {
      const optId = String(options[j].id);
      weightsById[optId] = solved.weights[j] || 0;
      countsById[optId] = g.counts[j];
      ruleMaxCapById[optId] = isFinite(solved.ruleMaxCap[j]) ? solved.ruleMaxCap[j] : null;
    }
    const payload = {
      groupKey: g.groupKey,
      pending: g.pending,
      hasCustomRule: solved.spec.hasCustomRule,
      countsById: countsById,
      ruleMaxCapById: ruleMaxCapById,
      weightsById: weightsById
    };
    for (let m = 0; m < g.memberAreas.length; m++) {
      byArea[g.memberAreas[m]] = payload;
    }
  }

  return { byArea: byArea };
}

function getEffectiveSpinWeightsForEmployee_(emp, options, employees, assignments, pendingSpins, excludeEmpId) {
  const k = options.length;
  const weightsById = {};
  for (let j = 0; j < k; j++) weightsById[String(options[j].id)] = 0;
  if (!emp || k === 0) return { weightsById: weightsById, guaranteedOpt: null, ruleMaxCapById: {}, countsById: {} };

  const guaranteedOpt = getGuaranteedOptionForEmployee_(emp, options);
  if (guaranteedOpt) {
    weightsById[String(guaranteedOpt.id)] = 1;
    return { weightsById: weightsById, guaranteedOpt: guaranteedOpt, ruleMaxCapById: {}, countsById: {} };
  }

  const optIndexById = {};
  const optIndexByLabel = {};
  for (let j = 0; j < k; j++) {
    optIndexById[String(options[j].id)] = j;
    optIndexByLabel[String(options[j].label || '').trim().toLowerCase()] = j;
  }

  const targetGroupKey = getRuleGroupKey_(emp.area || 'General');
  const counts = [];
  for (let j = 0; j < k; j++) counts.push(0);
  let pending = 0;
  const pSpins = pendingSpins || {};

  for (let i = 0; i < employees.length; i++) {
    const e = employees[i];
    if (getRuleGroupKey_(e.area || 'General') !== targetGroupKey) continue;
    const isExcluded = excludeEmpId !== null && excludeEmpId !== undefined && Number(e.id) === Number(excludeEmpId);
    const rec = isExcluded ? null : (assignments[e.id] || pSpins[e.id] || null);
    if (rec) {
      const recLabel = rec.optionLabel ? String(rec.optionLabel).trim().toLowerCase() : '';
      let optIdx = -1;
      if (recLabel && optIndexByLabel[recLabel] !== undefined) optIdx = optIndexByLabel[recLabel];
      else if (optIndexById[String(rec.optionId)] !== undefined) optIdx = optIndexById[String(rec.optionId)];
      if (optIdx >= 0) counts[optIdx]++;
    } else {
      // Reserve slot for any OTHER still-pending teammate in this group who has a guaranteed spin date
      const otherGuaranteed = Number(e.id) !== Number(emp.id) ? getGuaranteedOptionForEmployee_(e, options) : null;
      if (otherGuaranteed && optIndexById[String(otherGuaranteed.id)] !== undefined) {
        counts[optIndexById[String(otherGuaranteed.id)]]++;
      } else {
        pending++;
      }
    }
  }

  const solved = solveGroupRule_(targetGroupKey, options, counts, pending);
  const ruleMaxCapById = {};
  const countsById = {};
  for (let j = 0; j < k; j++) {
    const optId = String(options[j].id);
    weightsById[optId] = solved.weights[j] || 0;
    countsById[optId] = counts[j];
    ruleMaxCapById[optId] = isFinite(solved.ruleMaxCap[j]) ? solved.ruleMaxCap[j] : null;
  }
  return {
    weightsById: weightsById,
    guaranteedOpt: null,
    ruleMaxCapById: ruleMaxCapById,
    countsById: countsById,
    pending: pending
  };
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

function findExclusiveOptionById_(id) {
  const key = String(id);
  for (let i = 0; i < EXCLUSIVE_MANUAL_OPTIONS.length; i++) {
    if (String(EXCLUSIVE_MANUAL_OPTIONS[i].id) === key) return enrichOption_(EXCLUSIVE_MANUAL_OPTIONS[i], 5);
  }
  return null;
}

function findExclusiveOptionByLabel_(label) {
  const clean = String(label || '').trim().toLowerCase();
  if (!clean) return null;
  for (let i = 0; i < EXCLUSIVE_MANUAL_OPTIONS.length; i++) {
    if (EXCLUSIVE_MANUAL_OPTIONS[i].label.toLowerCase() === clean) return enrichOption_(EXCLUSIVE_MANUAL_OPTIONS[i], 5);
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

function findAnyOptionByLabel_(options, label, fallbackDays) {
  const clean = String(label || '').trim();
  if (!clean || clean.toLowerCase() === 'pendiente') return null;
  const active = findOptionByLabel_(options, clean);
  if (active) return active;
  const excl = findExclusiveOptionByLabel_(clean);
  if (excl) return excl;
  return enrichOption_({
    id: 'manual_' + clean.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
    label: clean,
    days: fallbackDays || '—',
    seasonTag: 'Manual exclusivo',
    colorIndex: 5,
    exclusiveManual: true
  }, 5);
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

  const areas = [];
  const activeLowerSet = {};
  options.forEach(function (o) { activeLowerSet[o.label.toLowerCase()] = true; });
  const foundExclSet = {};
  const extraExclLabels = [];

  if (mainSheet && mainSheet.getLastRow() >= 4) {
    const vals = mainSheet.getRange(4, 2, mainSheet.getLastRow() - 3, 3).getDisplayValues();
    for (let i = 0; i < vals.length; i++) {
      const a = String(vals[i][0] || '').trim();
      const dLabel = String(vals[i][2] || '').trim();
      if (a && areas.indexOf(a) === -1) areas.push(a);
      if (dLabel && dLabel.toLowerCase() !== 'pendiente' && !activeLowerSet[dLabel.toLowerCase()]) {
        const lowerKey = dLabel.toLowerCase();
        if (!foundExclSet[lowerKey]) {
          foundExclSet[lowerKey] = dLabel;
          extraExclLabels.push(dLabel);
        }
      }
    }
  }
  if (areas.length === 0) areas.push('General');

  // Order known exclusive manual dates chronologically first
  const exclusiveLabels = [];
  for (let i = 0; i < EXCLUSIVE_MANUAL_OPTIONS.length; i++) {
    const knownLower = EXCLUSIVE_MANUAL_OPTIONS[i].label.toLowerCase();
    if (foundExclSet[knownLower]) {
      exclusiveLabels.push(foundExclSet[knownLower]);
      delete foundExclSet[knownLower];
    }
  }
  for (let i = 0; i < extraExclLabels.length; i++) {
    const lKey = extraExclLabels[i].toLowerCase();
    if (foundExclSet[lKey]) {
      exclusiveLabels.push(extraExclLabels[i]);
      delete foundExclSet[lKey];
    }
  }

  const headers = ['Área']
    .concat(options.map(function (o) { return o.label; }))
    .concat(exclusiveLabels)
    .concat(['Pendiente', 'Total']);
  const totalCols = headers.length;
  const lastColLetter = colLetter_(totalCols - 1);
  const lastSumColLetter = colLetter_(totalCols - 2);
  const exclStartCol = 2 + options.length; // 1-indexed

  sumSheet.getRange('A1:' + lastColLetter + '1').merge()
    .setValue('RESUMEN DE DESCANSOS POR ÁREA Y FECHA — QUIRAMA 2026')
    .setBackground('#14532D').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center').setVerticalAlignment('center');
  sumSheet.setRowHeight(1, 28);

  const subText = exclusiveLabels.length > 0
    ? 'Fórmulas vinculadas a "Descansos Quirama" · Reglas por área en 4 fechas de ruleta (columnas naranjas = fechas manuales exclusivas fuera de ruleta)'
    : 'Fórmulas vinculadas automáticamente a la hoja "Descansos Quirama"';
  sumSheet.getRange('A2:' + lastColLetter + '2').merge()
    .setValue(subText)
    .setBackground('#ECFDF5').setFontColor('#4B5563').setFontStyle('italic').setHorizontalAlignment('center').setVerticalAlignment('center');
  sumSheet.setRowHeight(2, 20);

  sumSheet.getRange(3, 1, 1, totalCols).setValues([headers])
    .setBackground('#166534').setFontColor('#FFFFFF').setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('center').setWrap(true);
  for (let e = 0; e < exclusiveLabels.length; e++) {
    sumSheet.getRange(3, exclStartCol + e)
      .setBackground('#9A3412')
      .setFontColor('#FFFFFF')
      .setNote('Fecha manual exclusiva (NO aparece en la ruleta)');
  }
  sumSheet.setRowHeight(3, 28);

  const areaStart = 4;
  const areaEnd = areaStart + areas.length - 1;
  const rangeArea = "'" + SHEET_MAIN + "'!$B$4:$B$250";
  const rangeDate = "'" + SHEET_MAIN + "'!$D$4:$D$250";
  const loc = String((ss && ss.getSpreadsheetLocale && ss.getSpreadsheetLocale()) || '').toLowerCase();
  const sep = (/^(es_|pt_|fr_|de_|it_|nl_|pl_|ru_|sv_|tr_|cs_|da_|fi_|nb_|no_|ro_|sk_|sl_|uk_|vi_|id_|el_|hu_)/.test(loc) && loc !== 'es_mx')
    ? ';'
    : ',';

  for (let i = 0; i < areas.length; i++) {
    const r = areaStart + i;
    const rowFormulas = [];
    for (let c = 1; c <= totalCols - 2; c++) {
      const colL = colLetter_(c);
      rowFormulas.push('=COUNTIFS(' + rangeArea + sep + '$A' + r + sep + rangeDate + sep + colL + '$3)');
    }
    rowFormulas.push('=SUM(B' + r + ':' + lastSumColLetter + r + ')');
    sumSheet.getRange(r, 1).setValue(areas[i]);
    sumSheet.getRange(r, 2, 1, totalCols - 1).setFormulas([rowFormulas]).setHorizontalAlignment('center');
    sumSheet.getRange(r, totalCols).setBackground('#DCFCE7').setFontColor('#14532D').setFontWeight('bold');
  }

  const totalRow = areaEnd + 1;
  const totalFormulas = [];
  for (let c = 1; c < totalCols; c++) {
    const colL = colLetter_(c);
    totalFormulas.push('=SUM(' + colL + areaStart + ':' + colL + areaEnd + ')');
  }
  sumSheet.getRange(totalRow, 1).setValue('TOTAL GENERAL');
  sumSheet.getRange(totalRow, 2, 1, totalCols - 1).setFormulas([totalFormulas]).setHorizontalAlignment('center');
  sumSheet.getRange(totalRow, 1, 1, totalCols).setBackground('#DCFCE7').setFontColor('#14532D').setFontWeight('bold');

  const pctRow = totalRow + 1;
  const pctFormulas = [];
  for (let c = 1; c < totalCols; c++) {
    const colL = colLetter_(c);
    pctFormulas.push('=IF($' + lastColLetter + '$' + totalRow + '>0' + sep + colL + totalRow + '/$' + lastColLetter + '$' + totalRow + sep + '0)');
  }
  sumSheet.getRange(pctRow, 1).setValue('% del total de colaboradores');
  sumSheet.getRange(pctRow, 2, 1, totalCols - 1).setFormulas([pctFormulas]).setNumberFormat('0.0%').setHorizontalAlignment('center');

  sumSheet.getRange(3, 1, pctRow - 2, totalCols).setBorder(true, true, true, true, true, true, '#D1D5DB', SpreadsheetApp.BorderStyle.SOLID);
  sumSheet.setColumnWidth(1, 220);
  for (let c = 2; c <= totalCols; c++) {
    sumSheet.setColumnWidth(c, c === totalCols ? 95 : 155);
  }
}

function updateBanner_(mainSheet, totalEmps, assignedCount, settings, options) {
  const pct = options.length > 0 ? Math.round((100 / options.length) * 10) / 10 : 25;
  const modeDesc = settings.mode === 'area_balanced'
    ? 'Reglas estrictas por área (' + options.length + ' fechas · Hasta 2 tiros)'
    : (settings.mode === 'balanced'
        ? 'Cupos globales (' + options.map(function (o) { return settings.quotas[o.id] || 0; }).join(' / ') + ')'
        : 'Azar libre (' + pct + '% cada fecha)');
  const text = 'Actualizado: ' + formatNowBogota_() +
    '  |  Asignados: ' + assignedCount + ' de ' + totalEmps +
    '  |  Modo: ' + modeDesc;
  mainSheet.getRange('A2').setValue(text);
}

function readFullState_(ss) {
  const mainSheet = ss.getSheetByName(SHEET_MAIN);
  if (!mainSheet) {
    throw new Error('No se encontró la hoja "' + SHEET_MAIN + '".');
  }

  const options = getOptions_();
  const settings = getSettings_(options);
  const lastRow = mainSheet.getLastRow();
  const employees = [];
  const assignments = {};
  const pendingSpins = {};
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
      const daysText = String(row[4] || '').trim();
      const statusText = String(row[5] || '').trim();
      const statusLower = statusText.toLowerCase();
      const ts = String(row[6] || '').trim();

      employees.push({ id: id, area: area, name: name });

      const opt = findAnyOptionByLabel_(options, dateLabel, daysText);
      if (opt) {
        if (statusLower.indexOf('por confirmar') >= 0) {
          pendingSpins[id] = {
            optionId: opt.id,
            optionLabel: opt.label,
            optionDays: opt.days,
            timestamp: ts || '',
            mode: settings.mode,
            spinCount: 1
          };
        } else {
          const isManual = statusLower.indexOf('manual') >= 0 || isPreRegisteredId_(id);
          const isPre = isPreRegisteredId_(id) || statusLower.indexOf('pre-registrado') >= 0;
          let manualReason = '';
          if (isManual && statusText.indexOf('—') >= 0) {
            manualReason = statusText.split('—').slice(1).join('—').trim();
          }
          const spinCount = isManual ? 0 : (statusLower.indexOf('2/2') >= 0 ? 2 : 1);
          const isActiveOpt = Boolean(findOptionByLabel_(options, opt.label));
          assignments[id] = {
            optionId: opt.id,
            optionLabel: opt.label,
            optionDays: opt.days,
            timestamp: ts || '',
            mode: isManual ? 'manual' : settings.mode,
            isManual: isManual,
            isPreRegistered: isPre,
            exclusiveManual: Boolean(!isActiveOpt && (opt.exclusiveManual || isManual)),
            manualReason: manualReason,
            spinCount: spinCount,
            finalized: true
          };
        }
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
      const opt = findAnyOptionByLabel_(options, label, '');
      const modeCell = String(r[5] || '');
      const modeLower = modeCell.toLowerCase();
      const hManual = modeLower.indexOf('manual') >= 0;
      const parsedMode = hManual
        ? 'manual'
        : (modeLower.indexOf('área') >= 0 || modeLower.indexOf('area') >= 0
            ? 'area_balanced'
            : (modeLower.indexOf('cupo') >= 0 ? 'balanced' : 'equal'));
      const spinOutcome = hManual
        ? 'manual'
        : (modeLower.indexOf('por confirmar') >= 0
            ? 'provisional'
            : (modeLower.indexOf('anulado') >= 0 || modeLower.indexOf('eliminado') >= 0
                ? 'deleted_admin'
                : (modeLower.indexOf('descartado') >= 0
                    ? 'discarded'
                    : (modeLower.indexOf('2/2') >= 0 ? 'second_final' : 'kept'))));
      history.push({
        order: Number(r[0]) || (i + 1),
        timestamp: String(r[1] || '').trim(),
        name: hName,
        area: String(r[3] || '').trim(),
        optionId: opt ? opt.id : null,
        optionLabel: label,
        mode: parsedMode,
        isManual: hManual,
        spinOutcome: spinOutcome,
        modeText: modeCell
      });
    }
  }

  return {
    ok: true,
    scriptVersion: 7,
    serverTime: new Date().toISOString(),
    version: settings.version,
    options: options,
    mode: settings.mode,
    quotas: settings.quotas,
    nextEmpId: maxId + 1,
    employees: employees,
    assignments: assignments,
    pendingSpins: pendingSpins,
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

function applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, isManual, manualReason, customStatus) {
  const reasonClean = String(manualReason || '').trim();
  const statusVal = customStatus
    ? String(customStatus)
    : (isManual
        ? (reasonClean ? 'Manual (sin ruleta) — ' + reasonClean : 'Manual (sin ruleta)')
        : 'Asignado');
  const isProvisional = statusVal.toLowerCase().indexOf('por confirmar') >= 0;
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
    .setBackground(isManual || isProvisional ? '#FEF3C7' : '#DCFCE7')
    .setFontColor(isManual || isProvisional ? '#78350F' : '#14532D')
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

function appendHistoryRow_(histSheet, tsFormatted, empName, empArea, opt, modeLabel, isAmber) {
  const nextOrder = Math.max(1, histSheet.getLastRow() - 1);
  const newHistRow = histSheet.getLastRow() + 1;
  histSheet.getRange(newHistRow, 1, 1, 6).setValues([[
    nextOrder, tsFormatted, empName, empArea, opt.label, modeLabel
  ]]);
  histSheet.getRange(newHistRow, 1).setHorizontalAlignment('center');
  histSheet.getRange(newHistRow, 2).setHorizontalAlignment('center');
  histSheet.getRange(newHistRow, 5).setBackground(opt.bg).setFontColor(opt.fg).setFontWeight('bold').setHorizontalAlignment('center');
  histSheet.getRange(newHistRow, 6)
    .setBackground(isAmber ? '#FEF3C7' : '#FFFFFF')
    .setFontColor(isAmber ? '#78350F' : '#1F2937')
    .setFontWeight(isAmber ? 'bold' : 'normal')
    .setHorizontalAlignment('center');
}

function removeRouletteHistoryForEmployee_(histSheet, empName) {
  if (!histSheet || histSheet.getLastRow() < 3) return;
  const target = String(empName || '').trim().toUpperCase();
  if (!target) return;
  const lastRow = histSheet.getLastRow();
  const hVals = histSheet.getRange(3, 1, lastRow - 2, 6).getDisplayValues();
  for (let i = hVals.length - 1; i >= 0; i--) {
    const hName = String(hVals[i][2] || '').trim().toUpperCase();
    const hMode = String(hVals[i][5] || '').toLowerCase();
    if (hName === target && hMode.indexOf('manual') < 0) {
      histSheet.deleteRow(3 + i);
    }
  }
  const newLastRow = histSheet.getLastRow();
  if (newLastRow >= 3) {
    const orders = [];
    for (let i = 0; i < newLastRow - 2; i++) orders.push([i + 1]);
    histSheet.getRange(3, 1, orders.length, 1).setValues(orders).setHorizontalAlignment('center');
  }
}

function hasFinalizedRouletteSpin_(histSheet, empName, options) {
  if (!histSheet || histSheet.getLastRow() < 3) return null;
  const target = String(empName || '').trim().toUpperCase();
  if (!target) return null;
  const hVals = histSheet.getRange(3, 1, histSheet.getLastRow() - 2, 6).getDisplayValues();
  for (let i = 0; i < hVals.length; i++) {
    const r = hVals[i];
    const hName = String(r[2] || '').trim().toUpperCase();
    const hLabel = String(r[4] || '').trim();
    const hMode = String(r[5] || '').toLowerCase();
    if (
      hName === target &&
      hMode.indexOf('manual') < 0 &&
      hMode.indexOf('por confirmar') < 0 &&
      hMode.indexOf('descartado') < 0 &&
      hMode.indexOf('anulado') < 0 &&
      hMode.indexOf('eliminado') < 0
    ) {
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
      const spinNumber = isManual ? 0 : (Number(body.spinNumber) === 2 ? 2 : 1);
      const isProvisional = !isManual && spinNumber === 1 && Boolean(body.provisional);
      const allowOverwrite = isManual && Boolean(body.forceOverwrite);

      let opt = null;
      if (body.optionLabel) {
        opt = findAnyOptionByLabel_(options, body.optionLabel, body.optionDays);
      }
      if (!opt) {
        opt = findOptionById_(options, body.optionId) || findExclusiveOptionById_(body.optionId);
      }
      if (!opt) return jsonResponse_({ ok: false, error: 'Opción de fecha inválida.' });
      if (!isManual && opt.exclusiveManual) {
        return jsonResponse_({ ok: false, error: 'Esa fecha es exclusiva manual y no participa en la ruleta.' });
      }

      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado en la hoja.' });

      const empArea = String(mainSheet.getRange(rowNum, 2).getDisplayValue() || '').trim();
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const currentDateLabel = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const currentStatus = String(mainSheet.getRange(rowNum, 6).getDisplayValue() || '').trim();
      const currentStatusLower = currentStatus.toLowerCase();
      const isCurrentlyProvisional = currentStatusLower.indexOf('por confirmar') >= 0;
      const existingOpt = findAnyOptionByLabel_(options, currentDateLabel, '');
      const finalizedPrior = !isManual ? hasFinalizedRouletteSpin_(histSheet, empName, options) : null;

      // Allow spinNumber 2 to replace a provisional Spin 1; reject finalized turns or locked pre-registered people
      const canReplaceProvisional = !isManual && spinNumber === 2 && isCurrentlyProvisional;
      if (!allowOverwrite && !canReplaceProvisional && ((existingOpt && !isCurrentlyProvisional) || finalizedPrior || (!isManual && isPreRegisteredId_(empId)))) {
        const lockedOpt = existingOpt || finalizedPrior;
        return jsonResponse_({
          ok: false,
          conflict: true,
          alreadySpun: true,
          error: 'Esta persona ya completó su turno definitivo (máx. ' + MAX_SPINS_PER_PERSON + ' tiros).',
          existingOptionId: lockedOpt ? lockedOpt.id : '',
          existingOptionLabel: lockedOpt ? lockedOpt.label : currentDateLabel,
          state: readFullState_(ss)
        });
      }

      const settingsNow = getSettings_(options);
      const effectiveMode = isManual ? 'manual' : (body.mode || settingsNow.mode || 'area_balanced');
      if (!isManual) {
        const curState = readFullState_(ss);
        const excludeId = spinNumber === 2 ? empId : null;
        const empObj = { id: empId, area: empArea, name: empName };
        const guaranteedOpt = getGuaranteedOptionForEmployee_(empObj, options);
        if (guaranteedOpt && String(opt.id) !== String(guaranteedOpt.id)) {
          return jsonResponse_({
            ok: false,
            quotaConflict: true,
            error: 'La ruleta se ha actualizado. Gira nuevamente.',
            state: curState
          });
        }
        if (effectiveMode === 'area_balanced' && !guaranteedOpt) {
          const eff = getEffectiveSpinWeightsForEmployee_(empObj, options, curState.employees, curState.assignments, curState.pendingSpins, excludeId);
          const optCap = eff.ruleMaxCapById ? eff.ruleMaxCapById[String(opt.id)] : null;
          const hitsRuleCap = optCap !== null && optCap !== undefined && (eff.countsById[String(opt.id)] || 0) >= optCap;
          if (hitsRuleCap || (eff.pending > 0 && (eff.weightsById[String(opt.id)] || 0) <= 1e-9)) {
            return jsonResponse_({
              ok: false,
              quotaConflict: true,
              error: 'Esa fecha acaba de llenar su cupo para ' + empArea + ' en otro dispositivo. Gira nuevamente con las fechas disponibles.',
              state: curState
            });
          }
        } else if (effectiveMode === 'balanced' && !guaranteedOpt) {
          const counts = {};
          options.forEach(function (o) { counts[o.id] = 0; });
          Object.keys(curState.assignments).forEach(function (kId) {
            if (excludeId !== null && Number(kId) === Number(excludeId)) return;
            const r = curState.assignments[kId];
            if (r && counts[String(r.optionId)] !== undefined) counts[String(r.optionId)]++;
          });
          Object.keys(curState.pendingSpins || {}).forEach(function (kId) {
            if (curState.assignments[kId]) return;
            if (excludeId !== null && Number(kId) === Number(excludeId)) return;
            const r = curState.pendingSpins[kId];
            if (r && counts[String(r.optionId)] !== undefined) counts[String(r.optionId)]++;
          });
          // Reserve slots for still-pending guaranteed employees
          for (let ei = 0; ei < curState.employees.length; ei++) {
            const other = curState.employees[ei];
            if (Number(other.id) === empId) continue;
            if (curState.assignments[other.id] || (curState.pendingSpins && curState.pendingSpins[other.id])) continue;
            const og = getGuaranteedOptionForEmployee_(other, options);
            if (og && counts[String(og.id)] !== undefined) counts[String(og.id)]++;
          }
          let totalRem = 0;
          options.forEach(function (o) {
            const q = Math.max(1, Number(settingsNow.quotas[o.id]) || 1);
            totalRem += Math.max(0, q - (counts[o.id] || 0));
          });
          const optQuota = Math.max(1, Number(settingsNow.quotas[opt.id]) || 1);
          if (totalRem > 0 && (counts[opt.id] || 0) >= optQuota) {
            return jsonResponse_({
              ok: false,
              quotaConflict: true,
              error: 'Esa fecha acaba de completar su cupo en otro dispositivo. Gira nuevamente con las fechas disponibles.',
              state: curState
            });
          }
        }
      }

      const tsFormatted = formatNowBogota_();
      const manualReason = String(body.manualReason || '').trim();
      const rowStatus = isManual
        ? (manualReason ? 'Manual (sin ruleta) — ' + manualReason : 'Manual (sin ruleta)')
        : (isProvisional
            ? 'Tiro 1/2 (Por confirmar)'
            : (spinNumber === 2 ? 'Asignado (Tiro 2/2)' : 'Asignado (Tiro 1/2)'));

      applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, isManual, manualReason, rowStatus);

      const pct = Math.round((100 / Math.max(1, options.length)) * 10) / 10;
      const modeBase = effectiveMode === 'area_balanced'
        ? 'Reglas estrictas por área'
        : (effectiveMode === 'balanced' ? 'Cupos globales' : 'Azar libre (' + pct + '%)');

      if (!isManual && spinNumber === 2 && body.firstSpinLabel && !isCurrentlyProvisional) {
        const firstOpt = findAnyOptionByLabel_(options, body.firstSpinLabel, '');
        if (firstOpt) {
          appendHistoryRow_(histSheet, tsFormatted, empName, empArea, firstOpt, modeBase + ' · Tiro 1/2 (Descartado)', true);
        }
      }

      const modeLabel = isManual
        ? (manualReason ? 'Manual (sin ruleta) — ' + manualReason : 'Manual (sin ruleta)')
        : (isProvisional
            ? modeBase + ' · Tiro 1/2 (Por confirmar)'
            : (spinNumber === 2
                ? modeBase + ' · Tiro 2/2 (Definitivo)'
                : modeBase + ' · Tiro 1/2 (Conservado)'));

      appendHistoryRow_(histSheet, tsFormatted, empName, empArea, opt, modeLabel, isManual || isProvisional);

      if (opt.exclusiveManual) {
        rebuildSummarySheet_(ss, options);
      }

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'confirmSpin') {
      const empId = Number(body.empId);
      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado.' });
      const empArea = String(mainSheet.getRange(rowNum, 2).getDisplayValue() || '').trim();
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const curDate = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const curStatus = String(mainSheet.getRange(rowNum, 6).getDisplayValue() || '').trim();
      const opt = (body.optionLabel && findOptionByLabel_(options, body.optionLabel)) ||
        findOptionByLabel_(options, curDate) ||
        findOptionById_(options, body.optionId);
      if (!opt) return jsonResponse_({ ok: false, error: 'No hay un 1.er tiro válido para confirmar.' });

      if (curStatus.toLowerCase().indexOf('por confirmar') < 0 && findOptionByLabel_(options, curDate)) {
        return jsonResponse_({ ok: true, alreadyConfirmed: true, state: readFullState_(ss) });
      }

      const settingsNow = getSettings_(options);
      const curState = readFullState_(ss);
      const empObj = { id: empId, area: empArea, name: empName };
      const guaranteedOpt = getGuaranteedOptionForEmployee_(empObj, options);
      if (guaranteedOpt && String(opt.id) !== String(guaranteedOpt.id)) {
        return jsonResponse_({ ok: false, quotaConflict: true, error: 'La ruleta se ha actualizado. Gira nuevamente.', state: curState });
      }
      if (settingsNow.mode === 'area_balanced' && !guaranteedOpt) {
        const eff = getEffectiveSpinWeightsForEmployee_(empObj, options, curState.employees, curState.assignments, curState.pendingSpins, empId);
        const optCap = eff.ruleMaxCapById ? eff.ruleMaxCapById[String(opt.id)] : null;
        const hitsRuleCap = optCap !== null && optCap !== undefined && (eff.countsById[String(opt.id)] || 0) >= optCap;
        if (hitsRuleCap || (eff.pending > 0 && (eff.weightsById[String(opt.id)] || 0) <= 1e-9)) {
          return jsonResponse_({
            ok: false,
            quotaConflict: true,
            error: 'Esa fecha completó su cupo para ' + empArea + '. Gira nuevamente.',
            state: curState
          });
        }
      }

      const tsFormatted = formatNowBogota_();
      applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, false, '', 'Asignado (Tiro 1/2)');

      const modeBase = settingsNow.mode === 'area_balanced'
        ? 'Reglas estrictas por área'
        : (settingsNow.mode === 'balanced' ? 'Cupos globales' : 'Azar libre');
      appendHistoryRow_(histSheet, tsFormatted, empName, empArea, opt, modeBase + ' · Tiro 1/2 (Conservado)', false);

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, settingsNow, options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'adminClearSpin') {
      const empId = Number(body.empId);
      const rowNum = findEmployeeRow_(mainSheet, empId);
      if (rowNum < 0) return jsonResponse_({ ok: false, error: 'Colaborador no encontrado.' });
      if (isPreRegisteredId_(empId)) {
        return jsonResponse_({
          ok: false,
          error: 'No se puede eliminar una fecha registrada manualmente (pre-registrada).',
          state: readFullState_(ss)
        });
      }
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const curStatus = String(mainSheet.getRange(rowNum, 6).getDisplayValue() || '').toLowerCase();
      if (curStatus.indexOf('manual') >= 0) {
        return jsonResponse_({
          ok: false,
          error: 'Esta persona tiene una fecha asignada manualmente (sin ruleta) y está protegida.',
          state: readFullState_(ss)
        });
      }
      applyPendingToRow_(mainSheet, rowNum);
      removeRouletteHistoryForEmployee_(histSheet, empName);
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
      props.setProperty('RULETA_V7_MIGRATED', '1');

      const renamedMap = body.renamedMap || {};
      const deletedLabels = (Array.isArray(body.deletedLabels) ? body.deletedLabels : []).map(function (s) {
        return String(s || '').trim().toLowerCase();
      });

      const lastRow = mainSheet.getLastRow();
      if (lastRow >= 4) {
        const rows = mainSheet.getRange(4, 1, lastRow - 3, 7).getDisplayValues();
        for (let i = 0; i < rows.length; i++) {
          const rNum = 4 + i;
          const empId = Number(rows[i][0]);
          const curLabel = String(rows[i][3] || '').trim();
          const curStatus = String(rows[i][5] || '');
          const curTs = String(rows[i][6] || '');
          const curLower = curLabel.toLowerCase();
          if (!curLabel || curLower === 'pendiente') continue;
          if (findExclusiveOptionByLabel_(curLabel)) continue;
          // NEVER clear pre-registered or manual dates when editing roulette options
          if (isPreRegisteredId_(empId) || curStatus.toLowerCase().indexOf('manual') >= 0) continue;

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
            applyAssignmentToRow_(mainSheet, rNum, targetOpt, curTs, false, '', curStatus || '');
          }
        }
      }

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
      if (isPreRegisteredId_(empId)) {
        return jsonResponse_({
          ok: false,
          error: 'No se puede borrar un descanso manual pre-registrado y bloqueado.',
          state: readFullState_(ss)
        });
      }
      const empName = String(mainSheet.getRange(rowNum, 3).getDisplayValue() || '').trim();
      const curDate = String(mainSheet.getRange(rowNum, 4).getDisplayValue() || '').trim();
      const curStatus = String(mainSheet.getRange(rowNum, 6).getDisplayValue() || '').toLowerCase();
      const hasExisting = Boolean(findOptionByLabel_(options, curDate));
      const spunBefore = (hasExisting && curStatus.indexOf('manual') < 0 && curStatus.indexOf('por confirmar') < 0) ||
        Boolean(hasFinalizedRouletteSpin_(histSheet, empName, options));
      if (spunBefore) {
        return jsonResponse_({
          ok: false,
          error: 'No se puede borrar un turno definitivo ya completado en la ruleta.',
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
      const area = String(body.area || 'Bar').trim();
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
      const mode = (body.mode === 'area_balanced' || body.mode === 'balanced' || body.mode === 'equal')
        ? body.mode
        : 'area_balanced';
      props.setProperty('RULETA_MODE', mode);
      props.setProperty('RULETA_V7_MIGRATED', '1');
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
      // Restore the 13 locked pre-registered manual assignments
      for (let i = 0; i < PRE_REGISTERED_MANUAL.length; i++) {
        const pre = PRE_REGISTERED_MANUAL[i];
        const rowNum = findEmployeeRow_(mainSheet, pre.empId);
        if (rowNum < 0) continue;
        const opt = findAnyOptionByLabel_(options, pre.label, '') || findOptionById_(options, pre.optionId);
        if (!opt) continue;
        applyAssignmentToRow_(mainSheet, rowNum, opt, PRE_REGISTERED_TIMESTAMP, true, pre.reason);
        appendHistoryRow_(histSheet, PRE_REGISTERED_TIMESTAMP, pre.name, pre.area, opt, 'Manual (sin ruleta) — ' + pre.reason, true);
      }
      rebuildSummarySheet_(ss, options);
      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, getSettings_(options), options);
      return jsonResponse_({ ok: true, state: freshState });
    }

    if (action === 'pushLocalProgress') {
      if (Array.isArray(body.options) && body.options.length >= 2) {
        options = body.options.map(function (o, i) { return enrichOption_(o, i); });
        const props = PropertiesService.getDocumentProperties();
        props.setProperty('RULETA_OPTIONS', JSON.stringify(options));
        props.setProperty('RULETA_V7_MIGRATED', '1');
      }
      const localAssignments = body.assignments || {};
      const ids = Object.keys(localAssignments);
      for (let i = 0; i < ids.length; i++) {
        const empId = Number(ids[i]);
        const rec = localAssignments[empId];
        if (!rec) continue;
        const opt = (rec.optionLabel && findAnyOptionByLabel_(options, rec.optionLabel, rec.optionDays)) ||
          findOptionById_(options, rec.optionId) || findExclusiveOptionById_(rec.optionId);
        if (!opt) continue;
        const rowNum = findEmployeeRow_(mainSheet, empId);
        if (rowNum < 0) continue;
        const existing = findAnyOptionByLabel_(options, mainSheet.getRange(rowNum, 4).getDisplayValue(), '');
        if (!existing) {
          const isMan = Boolean(rec.isManual);
          const spinStatus = isMan ? '' : (Number(rec.spinCount) === 2 ? 'Asignado (Tiro 2/2)' : 'Asignado (Tiro 1/2)');
          const tsVal = rec.isPreRegistered ? PRE_REGISTERED_TIMESTAMP : formatNowBogota_();
          applyAssignmentToRow_(mainSheet, rowNum, opt, tsVal, isMan, rec.manualReason || '', spinStatus);
        }
      }
      rebuildSummarySheet_(ss, options);
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
