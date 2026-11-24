/**
 * ============================================================================
 * RULETA DE DESCANSOS FIN DE AÑO 2026 — QUIRAMA (v4 — 6 Fechas, A&B máx. 4, 2 Tiros)
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
const AREA_HARD_CAPS = { 'A&B': 4 };

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
  { id: '0', label: '23 y 24 de diciembre',          shortLabel: '23 y 24 Dic',     days: 'Mié 23 – Jue 24 Dic 2026',     seasonTag: 'Nochebuena', colorIndex: 0 },
  { id: '1', label: '24 y 25 de diciembre',          shortLabel: '24 y 25 Dic',     days: 'Jue 24 – Vie 25 Dic 2026',     seasonTag: 'Navidad',    colorIndex: 6 },
  { id: '2', label: '25 y 26 de diciembre',          shortLabel: '25 y 26 Dic',     days: 'Vie 25 – Sáb 26 Dic 2026',     seasonTag: 'Navidad',    colorIndex: 1 },
  { id: '3', label: '30 y 31 de diciembre',          shortLabel: '30 y 31 Dic',     days: 'Mié 30 – Jue 31 Dic 2026',     seasonTag: 'Fin de Año', colorIndex: 4 },
  { id: '4', label: '31 de diciembre y 01 de enero', shortLabel: '31 Dic y 01 Ene', days: 'Jue 31 Dic – Vie 01 Ene 2027', seasonTag: 'Año Nuevo',  colorIndex: 2 },
  { id: '5', label: '01 y 02 de enero',              shortLabel: '01 y 02 Ene',     days: 'Vie 01 – Sáb 02 Ene 2027',     seasonTag: 'Año Nuevo',  colorIndex: 3 }
];

// Fecha manual exclusiva que NO aparece en la ruleta (solo para GARCIA CARMONA SANTIAGO)
const EXCLUSIVE_MANUAL_OPTIONS = [
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
    exclusiveEmpId: 25
  }
];

const PRE_REGISTERED_MANUAL = [
  { empId: 4,  area: 'Administrativa', name: 'FRANCO OSPINA DIEGO ALEJANDRO',      optionId: '4',                label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado' },
  { empId: 5,  area: 'Administrativa', name: 'DIAZ BOHORQUEZ NINI JOHANA',         optionId: '1',                label: '24 y 25 de diciembre',          reason: 'Pre-registrado' },
  { empId: 2,  area: 'Administrativa', name: 'CASTRO VALENCIA ANDRES DAVID',       optionId: '4',                label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado' },
  { empId: 1,  area: 'Administrativa', name: 'SALAS HERNANDEZ JHONATAN JAVIER',    optionId: '1',                label: '24 y 25 de diciembre',          reason: 'Pre-registrado' },
  { empId: 15, area: 'A&B',            name: 'RENDON MEJIA PABLO ANDRES',          optionId: '1',                label: '24 y 25 de diciembre',          reason: 'Pre-registrado' },
  { empId: 41, area: 'Mantenimiento',  name: 'GOMEZ CALDERON ROBIRIO ANTONIO',     optionId: '4',                label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado' },
  { empId: 12, area: 'Ama de Llaves',  name: 'VILLA GONZALEZ BLANCA ALICIA',       optionId: '4',                label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado' },
  { empId: 29, area: 'A&B',            name: 'ALVAREZ SEPULVEDA WILSON ALEXANDER', optionId: '4',                label: '31 de diciembre y 01 de enero', reason: 'Pre-registrado' },
  { empId: 28, area: 'A&B',            name: 'MORALES HENAO RAUL SANTIAGO',        optionId: '2',                label: '25 y 26 de diciembre',          reason: 'Pre-registrado' },
  { empId: 20, area: 'A&B',            name: 'RIOS GARCIA CAROLINA',               optionId: '5',                label: '01 y 02 de enero',              reason: 'Pre-registrado' },
  { empId: 25, area: 'A&B',            name: 'GARCIA CARMONA SANTIAGO',            optionId: 'manual_26_27_dic', label: '26 y 27 de diciembre',          reason: 'Pre-registrado (fecha exclusiva)', exclusiveManual: true },
  { empId: 17, area: 'A&B',            name: 'MARIN VELASQUEZ JUAN PABLO',         optionId: '5',                label: '01 y 02 de enero',              reason: 'Pre-registrado' },
  { empId: 3,  area: 'Administrativa', name: 'LOPEZ BEDOYA ANA MARIA',             optionId: '2',                label: '25 y 26 de diciembre',          reason: 'Pre-registrado' }
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
  const migratedV4 = props.getProperty('RULETA_V4_MIGRATED') === '1';
  try {
    const raw = props.getProperty('RULETA_OPTIONS');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= 2) {
        const legacy4 = ['23 y 24 de diciembre', '25 y 26 de diciembre', '30 y 31 de diciembre', '01 y 02 de enero'];
        const isLegacy4 = !migratedV4 && parsed.length === 4 && parsed.every(function (o, i) {
          return o && String(o.label || '').trim().toLowerCase() === legacy4[i];
        });
        if (!isLegacy4) {
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
  const migratedV3 = props.getProperty('RULETA_EQUITY_V3') === '1';
  let mode = 'area_balanced';
  if (migratedV3 && (storedMode === 'area_balanced' || storedMode === 'balanced' || storedMode === 'equal')) {
    mode = storedMode;
  } else if (storedMode === 'balanced') {
    mode = 'balanced';
  }
  const quotas = {};
  const defaultPerOpt = Math.ceil(43 / Math.max(1, options.length));
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

function waterFill_(counts, pending, hardCap) {
  const k = counts.length;
  if (k === 0) {
    return { level: 0, baseNeed: [], extrasLeft: 0, eligibleForExtra: [], minAfterBase: [] };
  }
  if (pending <= 0) {
    return {
      level: Math.min.apply(null, counts),
      baseNeed: counts.map(function () { return 0; }),
      extrasLeft: 0,
      eligibleForExtra: counts.map(function () { return false; }),
      minAfterBase: counts.slice()
    };
  }

  let capCapacity = 0;
  const hasCap = hardCap !== null && hardCap !== undefined && isFinite(hardCap);
  if (hasCap) {
    for (let j = 0; j < k; j++) {
      if (counts[j] < hardCap) capCapacity += (hardCap - counts[j]);
    }
  }
  const useCap = hasCap && capCapacity >= pending;

  let L = Math.min.apply(null, counts);
  while (true) {
    const nextL = L + 1;
    if (useCap && nextL > hardCap) break;
    let needed = 0;
    for (let j = 0; j < k; j++) {
      if (counts[j] < nextL) needed += (nextL - counts[j]);
    }
    if (needed <= pending) {
      L = nextL;
    } else {
      break;
    }
  }
  const baseNeed = [];
  let baseSum = 0;
  const minAfterBase = [];
  const eligibleForExtra = [];
  for (let j = 0; j < k; j++) {
    const need = counts[j] < L ? (L - counts[j]) : 0;
    baseNeed.push(need);
    baseSum += need;
    minAfterBase.push(counts[j] + need);
    eligibleForExtra.push(counts[j] <= L && (!useCap || (L + 1) <= hardCap));
  }
  return {
    level: L,
    baseNeed: baseNeed,
    extrasLeft: pending - baseSum,
    eligibleForExtra: eligibleForExtra,
    minAfterBase: minAfterBase
  };
}

function minCostBalance_(activeAreas, minFinal, numOptions) {
  let baseSqSum = 0;
  for (let j = 0; j < numOptions; j++) {
    baseSqSum += minFinal[j] * minFinal[j];
  }
  let totalExtras = 0;
  for (let i = 0; i < activeAreas.length; i++) {
    totalExtras += activeAreas[i].extrasLeft;
  }
  if (totalExtras <= 0) return baseSqSum;

  const M = activeAreas.length;
  const S = 0;
  const dateOffset = 1 + M;
  const T = dateOffset + numOptions;
  const N = T + 1;
  const adj = [];
  for (let n = 0; n < N; n++) adj.push([]);

  function addEdge(u, v, cap, cost) {
    const fwd = { to: v, rev: adj[v].length, cap: cap, cost: cost };
    const bwd = { to: u, rev: adj[u].length, cap: 0, cost: -cost };
    adj[u].push(fwd);
    adj[v].push(bwd);
  }

  const dateDeg = [];
  for (let j = 0; j < numOptions; j++) dateDeg.push(0);

  for (let i = 0; i < M; i++) {
    const a = activeAreas[i];
    if (a.extrasLeft <= 0) continue;
    addEdge(S, 1 + i, a.extrasLeft, 0);
    for (let j = 0; j < numOptions; j++) {
      if (a.eligibleForExtra[j]) {
        addEdge(1 + i, dateOffset + j, 1, 0);
        dateDeg[j]++;
      }
    }
  }

  for (let j = 0; j < numOptions; j++) {
    for (let r = 1; r <= dateDeg[j]; r++) {
      const nextVal = minFinal[j] + r;
      addEdge(dateOffset + j, T, 1, 2 * nextVal - 1);
    }
  }

  let addedCost = 0;
  const INF = 1e12;
  for (let step = 0; step < totalExtras; step++) {
    const dist = [];
    const prevNode = [];
    const prevEdge = [];
    const inQueue = [];
    for (let n = 0; n < N; n++) {
      dist.push(INF);
      prevNode.push(-1);
      prevEdge.push(-1);
      inQueue.push(false);
    }
    const queue = [S];
    dist[S] = 0;
    inQueue[S] = true;

    for (let qHead = 0; qHead < queue.length; qHead++) {
      const u = queue[qHead];
      inQueue[u] = false;
      const edges = adj[u];
      for (let ei = 0; ei < edges.length; ei++) {
        const e = edges[ei];
        if (e.cap > 0 && dist[u] + e.cost < dist[e.to]) {
          dist[e.to] = dist[u] + e.cost;
          prevNode[e.to] = u;
          prevEdge[e.to] = ei;
          if (!inQueue[e.to]) {
            inQueue[e.to] = true;
            queue.push(e.to);
          }
        }
      }
    }

    if (dist[T] >= INF) break;
    addedCost += dist[T];
    let cur = T;
    while (cur !== S) {
      const p = prevNode[cur];
      const ei = prevEdge[cur];
      const e = adj[p][ei];
      e.cap -= 1;
      adj[cur][e.rev].cap += 1;
      cur = p;
    }
  }

  return baseSqSum + addedCost;
}

function computeEquityModel_(options, employees, assignments, pendingSpins, excludeEmpId) {
  const k = options.length;
  const optIndexById = {};
  for (let idx = 0; idx < k; idx++) {
    optIndexById[String(options[idx].id)] = idx;
  }

  const areaList = [];
  const areaMap = {};
  const pSpins = pendingSpins || {};
  for (let i = 0; i < employees.length; i++) {
    const emp = employees[i];
    const area = emp.area || 'General';
    if (!areaMap[area]) {
      const zeros = [];
      for (let j = 0; j < k; j++) zeros.push(0);
      areaMap[area] = { area: area, total: 0, exclusiveAssigned: 0, pending: 0, counts: zeros };
      areaList.push(areaMap[area]);
    }
    const entry = areaMap[area];
    entry.total++;
    const isExcluded = excludeEmpId !== null && excludeEmpId !== undefined && Number(emp.id) === Number(excludeEmpId);
    const rec = isExcluded ? null : (assignments[emp.id] || pSpins[emp.id] || null);
    if (rec) {
      const optIdx = optIndexById[String(rec.optionId)] !== undefined ? optIndexById[String(rec.optionId)] : -1;
      if (optIdx >= 0) {
        entry.counts[optIdx]++;
      } else {
        entry.exclusiveAssigned++;
      }
    } else {
      entry.pending++;
    }
  }

  const minFinal = [];
  for (let j = 0; j < k; j++) minFinal.push(0);

  const areaStates = areaList.map(function (entry) {
    const hardCap = AREA_HARD_CAPS[entry.area] !== undefined ? AREA_HARD_CAPS[entry.area] : null;
    const wf = waterFill_(entry.counts, entry.pending, hardCap);
    for (let j = 0; j < k; j++) minFinal[j] += wf.minAfterBase[j];
    return {
      area: entry.area,
      total: entry.total,
      exclusiveAssigned: entry.exclusiveAssigned,
      pending: entry.pending,
      counts: entry.counts,
      hardCap: hardCap,
      wf: wf
    };
  });

  const activeExtraAreas = [];
  for (let i = 0; i < areaStates.length; i++) {
    if (areaStates[i].wf.extrasLeft > 0) {
      activeExtraAreas.push({
        area: areaStates[i].area,
        extrasLeft: areaStates[i].wf.extrasLeft,
        eligibleForExtra: areaStates[i].wf.eligibleForExtra.slice()
      });
    }
  }

  const optCost = minCostBalance_(activeExtraAreas, minFinal, k);
  const byArea = {};

  for (let i = 0; i < areaStates.length; i++) {
    const a = areaStates[i];
    const feasibleExtras = [];
    const feasibleMap = [];
    for (let j = 0; j < k; j++) feasibleMap.push(false);

    if (a.wf.extrasLeft > 0) {
      let activeIdx = -1;
      for (let x = 0; x < activeExtraAreas.length; x++) {
        if (activeExtraAreas[x].area === a.area) { activeIdx = x; break; }
      }
      for (let j = 0; j < k; j++) {
        if (!a.wf.eligibleForExtra[j]) continue;
        const nextMinFinal = minFinal.slice();
        nextMinFinal[j] += 1;
        const nextActive = [];
        for (let x = 0; x < activeExtraAreas.length; x++) {
          const item = activeExtraAreas[x];
          if (x !== activeIdx) {
            nextActive.push(item);
          } else if (item.extrasLeft - 1 > 0) {
            const nextElig = item.eligibleForExtra.slice();
            nextElig[j] = false;
            nextActive.push({
              area: item.area,
              extrasLeft: item.extrasLeft - 1,
              eligibleForExtra: nextElig
            });
          }
        }
        const candCost = minCostBalance_(nextActive, nextMinFinal, k);
        if (candCost === optCost) {
          feasibleExtras.push(j);
          feasibleMap[j] = true;
        }
      }
      if (feasibleExtras.length === 0) {
        for (let j = 0; j < k; j++) {
          if (a.wf.eligibleForExtra[j]) {
            feasibleExtras.push(j);
            feasibleMap[j] = true;
          }
        }
      }
    }

    const weightsById = {};
    const countsById = {};
    for (let j = 0; j < k; j++) {
      const optId = String(options[j].id);
      const extraShare = feasibleMap[j] && feasibleExtras.length > 0
        ? (a.wf.extrasLeft / feasibleExtras.length)
        : 0;
      weightsById[optId] = a.wf.baseNeed[j] + extraShare;
      countsById[optId] = a.counts[j];
    }

    byArea[a.area] = {
      area: a.area,
      pending: a.pending,
      hardCap: a.hardCap,
      countsById: countsById,
      weightsById: weightsById
    };
  }

  return { byArea: byArea };
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
  const exclusiveLabels = [];

  if (mainSheet && mainSheet.getLastRow() >= 4) {
    const vals = mainSheet.getRange(4, 2, mainSheet.getLastRow() - 3, 3).getDisplayValues();
    for (let i = 0; i < vals.length; i++) {
      const a = String(vals[i][0] || '').trim();
      const dLabel = String(vals[i][2] || '').trim();
      if (a && areas.indexOf(a) === -1) areas.push(a);
      if (dLabel && dLabel.toLowerCase() !== 'pendiente' && !activeLowerSet[dLabel.toLowerCase()]) {
        if (exclusiveLabels.indexOf(dLabel) === -1) exclusiveLabels.push(dLabel);
      }
    }
  }
  if (areas.length === 0) areas.push('General');

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
    ? 'Fórmulas vinculadas a "Descansos Quirama" · A&B máx. 4/fecha en ruleta (columna naranja = fecha manual exclusiva fuera de ruleta)'
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

  for (let i = 0; i < areas.length; i++) {
    const r = areaStart + i;
    const rowFormulas = [];
    for (let c = 1; c <= totalCols - 2; c++) {
      const colL = colLetter_(c);
      rowFormulas.push('=COUNTIFS(' + rangeArea + ',$A' + r + ',' + rangeDate + ',' + colL + '$3)');
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
    pctFormulas.push('=IF($' + lastColLetter + '$' + totalRow + '>0,' + colL + totalRow + '/$' + lastColLetter + '$' + totalRow + ',0)');
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
  const pct = options.length > 0 ? Math.round((100 / options.length) * 10) / 10 : 16.7;
  const modeDesc = settings.mode === 'area_balanced'
    ? 'Equitativo estricto por área (A&B máx. 4/fecha · Hasta 2 tiros)'
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
          assignments[id] = {
            optionId: opt.id,
            optionLabel: opt.label,
            optionDays: opt.days,
            timestamp: ts || '',
            mode: isManual ? 'manual' : settings.mode,
            isManual: isManual,
            isPreRegistered: isPre,
            exclusiveManual: Boolean(opt.exclusiveManual),
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
            : (modeLower.indexOf('descartado') >= 0
                ? 'discarded'
                : (modeLower.indexOf('2/2') >= 0 ? 'second_final' : 'kept')));
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
    scriptVersion: 4,
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
    if (hName === target && hMode.indexOf('manual') < 0 && hMode.indexOf('por confirmar') < 0 && hMode.indexOf('descartado') < 0) {
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

      let opt = findOptionById_(options, body.optionId) || findExclusiveOptionById_(body.optionId);
      if (!opt && body.optionLabel) {
        opt = findAnyOptionByLabel_(options, body.optionLabel, body.optionDays);
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
      if (!isManual && (effectiveMode === 'area_balanced' || effectiveMode === 'balanced')) {
        const curState = readFullState_(ss);
        const excludeId = spinNumber === 2 ? empId : null;
        if (effectiveMode === 'area_balanced') {
          const eqModel = computeEquityModel_(options, curState.employees, curState.assignments, curState.pendingSpins, excludeId);
          const areaObj = eqModel.byArea[empArea];
          const hardCap = AREA_HARD_CAPS[empArea];
          const hitsHardCap = hardCap !== undefined && areaObj && (areaObj.countsById[String(opt.id)] || 0) >= hardCap;
          if (hitsHardCap || (areaObj && areaObj.pending > 0 && (areaObj.weightsById[String(opt.id)] || 0) <= 1e-9)) {
            return jsonResponse_({
              ok: false,
              quotaConflict: true,
              error: 'Esa fecha acaba de llenar su cupo equitativo para ' + empArea + ' en otro dispositivo. Gira nuevamente con las fechas disponibles.',
              state: curState
            });
          }
        } else if (effectiveMode === 'balanced') {
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
        ? 'Equitativo por área y fecha'
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
      const opt = findOptionById_(options, body.optionId) || findOptionByLabel_(options, curDate);
      if (!opt) return jsonResponse_({ ok: false, error: 'No hay un 1.er tiro válido para confirmar.' });

      if (curStatus.toLowerCase().indexOf('por confirmar') < 0 && findOptionByLabel_(options, curDate)) {
        return jsonResponse_({ ok: true, alreadyConfirmed: true, state: readFullState_(ss) });
      }

      const tsFormatted = formatNowBogota_();
      applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, false, '', 'Asignado (Tiro 1/2)');

      const settingsNow = getSettings_(options);
      const modeBase = settingsNow.mode === 'area_balanced'
        ? 'Equitativo por área y fecha'
        : (settingsNow.mode === 'balanced' ? 'Cupos globales' : 'Azar libre');
      appendHistoryRow_(histSheet, tsFormatted, empName, empArea, opt, modeBase + ' · Tiro 1/2 (Conservado)', false);

      bumpVersion_();
      const freshState = readFullState_(ss);
      updateBanner_(mainSheet, freshState.employees.length, Object.keys(freshState.assignments).length, settingsNow, options);
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
      props.setProperty('RULETA_V4_MIGRATED', '1');

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
          if (findExclusiveOptionByLabel_(curLabel)) continue;

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
            applyAssignmentToRow_(mainSheet, rNum, targetOpt, rows[i][3] || '', wasManual, prevReason, curStatus || '');
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
      const mode = (body.mode === 'area_balanced' || body.mode === 'balanced' || body.mode === 'equal')
        ? body.mode
        : 'area_balanced';
      props.setProperty('RULETA_MODE', mode);
      props.setProperty('RULETA_EQUITY_V3', '1');
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
      const tsFormatted = formatNowBogota_();
      for (let i = 0; i < PRE_REGISTERED_MANUAL.length; i++) {
        const pre = PRE_REGISTERED_MANUAL[i];
        const rowNum = findEmployeeRow_(mainSheet, pre.empId);
        if (rowNum < 0) continue;
        const opt = findOptionById_(options, pre.optionId) || findAnyOptionByLabel_(options, pre.label, '');
        if (!opt) continue;
        applyAssignmentToRow_(mainSheet, rowNum, opt, tsFormatted, true, pre.reason);
        appendHistoryRow_(histSheet, tsFormatted, pre.name, pre.area, opt, 'Manual (sin ruleta) — ' + pre.reason, true);
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
        props.setProperty('RULETA_V4_MIGRATED', '1');
      }
      const localAssignments = body.assignments || {};
      const ids = Object.keys(localAssignments);
      for (let i = 0; i < ids.length; i++) {
        const empId = Number(ids[i]);
        const rec = localAssignments[empId];
        if (!rec) continue;
        const opt = findOptionById_(options, rec.optionId) || findExclusiveOptionById_(rec.optionId) || findAnyOptionByLabel_(options, rec.optionLabel, rec.optionDays);
        if (!opt) continue;
        const rowNum = findEmployeeRow_(mainSheet, empId);
        if (rowNum < 0) continue;
        const existing = findAnyOptionByLabel_(options, mainSheet.getRange(rowNum, 4).getDisplayValue(), '');
        if (!existing) {
          const isMan = Boolean(rec.isManual);
          const spinStatus = isMan ? '' : (Number(rec.spinCount) === 2 ? 'Asignado (Tiro 2/2)' : 'Asignado (Tiro 1/2)');
          applyAssignmentToRow_(mainSheet, rowNum, opt, formatNowBogota_(), isMan, rec.manualReason || '', spinStatus);
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
