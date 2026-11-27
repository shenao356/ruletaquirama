(() => {
  'use strict';

  const CONFIG = window.QUIRAMA_CONFIG || {
    APPS_SCRIPT_URL: '',
    DRIVE_SHEET_ID: '1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc',
    DRIVE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit',
    DRIVE_FOLDER_URL: 'https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj',
    COMPANY_LOGO_URL: '',
    POLL_INTERVAL_MS: 5000
  };

  // =========================================================================
  // 1. DATA: 44 Colaboradores de Quirama & 8-Color Curated Palette
  // =========================================================================
  const INITIAL_EMPLOYEES = [
    // Administrativa (5)
    { id: 1,  area: 'Administrativa', name: 'SALAS HERNANDEZ JHONATAN JAVIER' },
    { id: 2,  area: 'Administrativa', name: 'CASTRO VALENCIA ANDRES DAVID' },
    { id: 3,  area: 'Administrativa', name: 'LOPEZ BEDOYA ANA MARIA' },
    { id: 4,  area: 'Administrativa', name: 'FRANCO OSPINA DIEGO ALEJANDRO' },
    { id: 5,  area: 'Administrativa', name: 'DIAZ BOHORQUEZ NINI JOHANA' },
    // Recepción (4)
    { id: 6,  area: 'Recepción', name: 'OSORIO GONZALEZ SANTIAGO' },
    { id: 7,  area: 'Recepción', name: 'VILLADA VILLADA LADY FRANCENI' },
    { id: 8,  area: 'Recepción', name: 'DAVILA ANYI ALEJANDRA' },
    { id: 9,  area: 'Recepción', name: 'JURADO HENAO SANDRA MILENA' },
    // Ama de Llaves (5)
    { id: 10, area: 'Ama de Llaves', name: 'SANCHEZ GALVIS ELIANA MARLELLY' },
    { id: 11, area: 'Ama de Llaves', name: 'GIRALDO LEGARDA SANDRA MILENA' },
    { id: 12, area: 'Ama de Llaves', name: 'VILLA GONZALEZ BLANCA ALICIA' },
    { id: 13, area: 'Ama de Llaves', name: 'ISAZA BOTERO JAIME ALBERTO' },
    { id: 14, area: 'Ama de Llaves', name: 'MARTINEZ DANIELYS CAROLINA' },
    // Bar (11)
    { id: 15, area: 'Bar', name: 'RENDON MEJIA PABLO ANDRES' },
    { id: 16, area: 'Bar', name: 'CORREA DAVID JUAN SEBASTIAN' },
    { id: 17, area: 'Bar', name: 'GARCIA NAVAS SARAY ISABELLA' },
    { id: 18, area: 'Bar', name: 'LONDOÑO SANCHEZ NATALIA' },
    { id: 19, area: 'Bar', name: 'CARRACEDO GUTIERREZ DIEGO ANDRES' },
    { id: 20, area: 'Bar', name: 'VALENCIA ARIAS ANLLY PAOLA' },
    { id: 21, area: 'Bar', name: 'CASTAÑO HOYOS JUAN CARLOS' },
    { id: 22, area: 'Bar', name: 'CUELLAR GLADIS' },
    { id: 23, area: 'Bar', name: 'GAVIRIA BEDOYA JORGE IVAN' },
    { id: 24, area: 'Bar', name: 'PUERTA FERNANDEZ DAIRON' },
    { id: 25, area: 'Bar', name: 'NARANJO LOPEZ ESTEFANIA' },
    // Producción (12)
    { id: 26, area: 'Producción', name: 'MARIN VELASQUEZ JUAN PABLO' },
    { id: 27, area: 'Producción', name: 'MARIN ARANGO EZEQUIEL DE JESUS' },
    { id: 28, area: 'Producción', name: 'LOPEZ SUAREZ MARTA LUCIA' },
    { id: 29, area: 'Producción', name: 'RIOS GARCIA CAROLINA' },
    { id: 30, area: 'Producción', name: 'ARISTIZABAL HENAO LUZ FANNY' },
    { id: 31, area: 'Producción', name: 'LOTERO RAMIREZ ERNESTO DE JESUS' },
    { id: 32, area: 'Producción', name: 'CORTES VALENCIA FERNANDO ALONSO' },
    { id: 33, area: 'Producción', name: 'MARULANDA JARAMILLO DILSA YARLEDY' },
    { id: 34, area: 'Producción', name: 'GARCIA CARMONA SANTIAGO' },
    { id: 35, area: 'Producción', name: 'ARISTIZABAL HENAO BEATRIZ ELENA' },
    { id: 36, area: 'Producción', name: 'GIL GARCIA DEIBY ANDRES' },
    { id: 37, area: 'Producción', name: 'ALVAREZ TRUJILLO MARIA OLGA' },
    // Almacén (2)
    { id: 38, area: 'Almacén', name: 'MORALES HENAO RAUL SANTIAGO' },
    { id: 39, area: 'Almacén', name: 'ALVAREZ SEPULVEDA WILSON ALEXANDER' },
    // Mantenimiento (4)
    { id: 40, area: 'Mantenimiento', name: 'VARGAS VARGAS JUAN FERNANDO' },
    { id: 41, area: 'Mantenimiento', name: 'GOMEZ CALDERON ROBIRIO ANTONIO' },
    { id: 42, area: 'Mantenimiento', name: 'ACOSTA OROZCO JOSE ALBEIRO' },
    { id: 43, area: 'Mantenimiento', name: 'AHUMADA DIAZ CARLOS ALBERTO' },
    // Mantenimiento Zonas Húmedas (1)
    { id: 44, area: 'Mantenimiento Zonas Húmedas', name: 'RENDON RAMIREZ GERMAN ALBERTO' }
  ];

  const COLOR_PALETTE = [
    { name: 'Esmeralda',  colorMain: '#15803d', colorLight: '#1e9d4c', colorDark: '#0f5d2c', pillBg: '#dcfce7', pillText: '#14532d', xlsxStyleIndex: 4 },
    { name: 'Carmesí',    colorMain: '#b91c1c', colorLight: '#dc2626', colorDark: '#8a1414', pillBg: '#fee2e2', pillText: '#7f1d1d', xlsxStyleIndex: 5 },
    { name: 'Ámbar',      colorMain: '#b45309', colorLight: '#d97706', colorDark: '#873d06', pillBg: '#fef3c7', pillText: '#78350f', xlsxStyleIndex: 6 },
    { name: 'Zafiro',     colorMain: '#0369a1', colorLight: '#0284c7', colorDark: '#074e78', pillBg: '#e0f2fe', pillText: '#0c4a6e', xlsxStyleIndex: 7 },
    { name: 'Turquesa',   colorMain: '#0f766e', colorLight: '#14b8a6', colorDark: '#115e59', pillBg: '#ccfbf1', pillText: '#134e4a', xlsxStyleIndex: 8 },
    { name: 'Terracota',  colorMain: '#c2410c', colorLight: '#ea580c', colorDark: '#9a3412', pillBg: '#ffedd5', pillText: '#7c2d12', xlsxStyleIndex: 9 },
    { name: 'Azul Rey',   colorMain: '#1d4ed8', colorLight: '#3b82f6', colorDark: '#1e3a8a', pillBg: '#dbeafe', pillText: '#1e3a8a', xlsxStyleIndex: 10 },
    { name: 'Oliva',      colorMain: '#4d7c0f', colorLight: '#65a30d', colorDark: '#365314', pillBg: '#ecfccb', pillText: '#365314', xlsxStyleIndex: 11 }
  ];

  const DEFAULT_OPTIONS_RAW = [
    { id: '0', label: '23 y 24 de diciembre', shortLabel: '23 y 24 Dic', days: 'Mié 23 – Jue 24 Dic 2026', seasonTag: 'Nochebuena', colorIndex: 0 },
    { id: '1', label: '25 y 26 de diciembre', shortLabel: '25 y 26 Dic', days: 'Vie 25 – Sáb 26 Dic 2026', seasonTag: 'Navidad',    colorIndex: 1 },
    { id: '2', label: '30 y 31 de diciembre', shortLabel: '30 y 31 Dic', days: 'Mié 30 – Jue 31 Dic 2026', seasonTag: 'Fin de Año', colorIndex: 4 },
    { id: '3', label: '01 y 02 de enero',     shortLabel: '01 y 02 Ene', days: 'Vie 01 – Sáb 02 Ene 2027', seasonTag: 'Año Nuevo',  colorIndex: 3 }
  ];

  // Fechas manuales exclusivas que NO aparecen en la ruleta (conservan intactos los pre-registrados manuales)
  const EXCLUSIVE_MANUAL_OPTIONS_RAW = [
    {
      id: 'manual_24_25_dic',
      label: '24 y 25 de diciembre',
      shortLabel: '24 y 25 Dic',
      days: 'Jue 24 – Vie 25 Dic 2026',
      seasonTag: 'Manual exclusivo',
      colorIndex: 6,
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
      wheelTop: '31 Dic y',
      wheelBottom: '01 ENERO',
      exclusiveManual: true,
      exclusiveEmpIds: [2, 4, 12, 39, 41]
    }
  ];

  const PRE_REGISTERED_TIMESTAMP = '24/11/2026 14:35:00';
  const PRE_REGISTERED_MANUAL_RAW = [
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

  const PRE_REGISTERED_BY_ID = {};
  PRE_REGISTERED_MANUAL_RAW.forEach(item => { PRE_REGISTERED_BY_ID[item.empId] = item; });

  const MAX_SPINS_PER_PERSON = 2;

  const STORAGE_KEY = 'quirama_ruleta_descansos_2026_v7';
  const EQUITY_SCHEMA_VERSION = 7;
  const SYNC_URL_KEY = 'quirama_sync_url_v1';
  const THEME_KEY = 'quirama_theme_v1';
  const LOGO_STORAGE_KEY = 'quirama_company_logo_v1';
  const TWO_PI = Math.PI * 2;
  const POINTER_SCREEN_ANGLE = -Math.PI / 2;

  // =========================================================================
  // 2. OPTION HELPERS (Dynamic Dates + Exclusive Manual Dates)
  // =========================================================================
  function deriveShortLabel(label) {
    const s = String(label || '').trim();
    const abbr = s
      .replace(/\bde diciembre\b/gi, 'Dic')
      .replace(/\bde enero\b/gi, 'Ene')
      .replace(/\bde noviembre\b/gi, 'Nov')
      .replace(/\bde febrero\b/gi, 'Feb')
      .replace(/\bdiciembre\b/gi, 'Dic')
      .replace(/\benero\b/gi, 'Ene')
      .replace(/\bnoviembre\b/gi, 'Nov')
      .replace(/\s+/g, ' ')
      .trim();
    return abbr.length > 18 ? abbr.slice(0, 17) + '…' : abbr;
  }

  function splitWheelText(label) {
    const clean = String(label || '').trim();
    const crossMonth = clean.match(/^(\d+\s+de\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+)\s+y\s+(\d+\s+de\s+[A-Za-zÁÉÍÓÚÑáéíóúñ]+)$/i);
    if (crossMonth) {
      return {
        wheelTop: (deriveShortLabel(crossMonth[1]) + ' y').slice(0, 14),
        wheelBottom: deriveShortLabel(crossMonth[2]).toUpperCase().slice(0, 14)
      };
    }
    const deMatch = clean.match(/^(.+?)\s+de\s+([A-Za-zÁÉÍÓÚÑáéíóúñ]+.*)$/i);
    if (deMatch) {
      return {
        wheelTop: deMatch[1].trim().slice(0, 14),
        wheelBottom: deMatch[2].trim().toUpperCase().slice(0, 14)
      };
    }
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      const splitIdx = Math.ceil(words.length / 2);
      return {
        wheelTop: words.slice(0, splitIdx).join(' ').slice(0, 14),
        wheelBottom: words.slice(splitIdx).join(' ').toUpperCase().slice(0, 14)
      };
    }
    return { wheelTop: clean.slice(0, 14), wheelBottom: '' };
  }

  function normalizeOption(raw, idx) {
    const colorIndex = Number.isInteger(Number(raw.colorIndex))
      ? Math.abs(Number(raw.colorIndex)) % COLOR_PALETTE.length
      : (idx % COLOR_PALETTE.length);
    const pal = COLOR_PALETTE[colorIndex];
    const label = String(raw.label || `Opción ${idx + 1}`).trim();
    const parts = splitWheelText(label);
    const exclusiveEmpIds = Array.isArray(raw.exclusiveEmpIds)
      ? raw.exclusiveEmpIds.map(Number).filter(Number.isFinite)
      : (raw.exclusiveEmpId ? [Number(raw.exclusiveEmpId)] : []);
    return {
      id: String(raw.id !== undefined && raw.id !== null ? raw.id : idx),
      label,
      shortLabel: String(raw.shortLabel || '').trim() || deriveShortLabel(label),
      days: String(raw.days || '').trim() || '—',
      seasonTag: String(raw.seasonTag || '').trim() || 'Descanso',
      colorIndex,
      wheelTop: String(raw.wheelTop || '').trim() || parts.wheelTop,
      wheelBottom: raw.wheelBottom !== undefined ? String(raw.wheelBottom) : parts.wheelBottom,
      colorMain: pal.colorMain,
      colorLight: pal.colorLight,
      colorDark: pal.colorDark,
      pillBg: pal.pillBg,
      pillText: pal.pillText,
      xlsxStyleIndex: pal.xlsxStyleIndex,
      exclusiveManual: Boolean(raw.exclusiveManual),
      exclusiveEmpIds
    };
  }

  const EXCLUSIVE_MANUAL_OPTIONS = EXCLUSIVE_MANUAL_OPTIONS_RAW.map((o, i) => normalizeOption(o, 5 + i));

  function getOptionById(optionId) {
    if (optionId === undefined || optionId === null) return null;
    const key = String(optionId);
    return state.options.find(o => o.id === key) || null;
  }

  function getExclusiveOptionById(optionId) {
    if (optionId === undefined || optionId === null) return null;
    const key = String(optionId);
    return EXCLUSIVE_MANUAL_OPTIONS.find(o => o.id === key) || null;
  }

  function getExclusiveOptionByLabel(label) {
    const clean = String(label || '').trim().toLowerCase();
    if (!clean) return null;
    return EXCLUSIVE_MANUAL_OPTIONS.find(o => o.label.toLowerCase() === clean) || null;
  }

  function resolveAssignedOption(rec) {
    if (!rec) return null;
    if (rec.optionLabel) {
      const cleanLabel = String(rec.optionLabel).trim().toLowerCase();
      const activeByLabel = state.options.find(o => o.label.toLowerCase() === cleanLabel);
      if (activeByLabel) return activeByLabel;
      const exclByLabel = getExclusiveOptionByLabel(cleanLabel);
      if (exclByLabel) return exclByLabel;
    }
    const active = getOptionById(rec.optionId);
    if (active) return active;
    const exclById = getExclusiveOptionById(rec.optionId);
    if (exclById) return exclById;
    if (rec.optionLabel) {
      return normalizeOption({
        id: String(rec.optionId || 'manual_custom'),
        label: rec.optionLabel,
        days: rec.optionDays || '—',
        seasonTag: 'Manual exclusivo',
        colorIndex: 5,
        exclusiveManual: true
      }, 5);
    }
    return null;
  }

  function getExclusiveAssignedOptions() {
    const activeIds = new Set(state.options.map(o => o.id));
    const activeLabels = new Set(state.options.map(o => o.label.toLowerCase()));
    const byId = new Map();
    for (const rec of Object.values(state.assignments || {})) {
      if (!rec) continue;
      const cleanLabel = rec.optionLabel ? String(rec.optionLabel).trim().toLowerCase() : '';
      if (cleanLabel && activeLabels.has(cleanLabel)) continue;
      if (!cleanLabel && activeIds.has(String(rec.optionId))) continue;
      const opt = resolveAssignedOption(rec);
      if (opt && !activeIds.has(opt.id) && !byId.has(opt.id)) {
        byId.set(opt.id, opt);
      }
    }
    const ordered = [];
    for (const known of EXCLUSIVE_MANUAL_OPTIONS) {
      if (byId.has(known.id)) {
        ordered.push(byId.get(known.id));
        byId.delete(known.id);
      }
    }
    for (const extra of byId.values()) ordered.push(extra);
    return ordered;
  }

  function getExclusiveAssignedCount(assignments = state.assignments, options = state.options) {
    const activeIds = new Set((options || []).map(o => String(o.id)));
    const activeLabels = new Set((options || []).map(o => String(o.label || '').trim().toLowerCase()));
    let count = 0;
    for (const rec of Object.values(assignments || {})) {
      if (!rec) continue;
      const cleanLabel = rec.optionLabel ? String(rec.optionLabel).trim().toLowerCase() : '';
      if (cleanLabel && activeLabels.has(cleanLabel)) continue;
      if (!cleanLabel && activeIds.has(String(rec.optionId))) continue;
      count++;
    }
    return count;
  }

  function isPreRegisteredLocked(empId) {
    const numId = Number(empId);
    const rec = state.assignments[numId];
    return Boolean((rec && rec.isPreRegistered) || PRE_REGISTERED_BY_ID[numId]);
  }

  function formatPct(prob) {
    const val = prob * 100;
    const rounded = Math.round(val * 10) / 10;
    return (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)) + '%';
  }

  function normalizeQuotas(rawQuotas, options, empCount) {
    const result = {};
    const base = Math.max(1, Math.floor(empCount / Math.max(1, options.length)));
    const rem = empCount - base * options.length;
    options.forEach((opt, idx) => {
      const fallback = base + (idx < rem ? 1 : 0);
      if (Array.isArray(rawQuotas) && rawQuotas[idx] !== undefined) {
        result[opt.id] = Math.max(1, Number(rawQuotas[idx]) || fallback);
      } else if (rawQuotas && typeof rawQuotas === 'object' && rawQuotas[opt.id] !== undefined) {
        result[opt.id] = Math.max(1, Number(rawQuotas[opt.id]) || fallback);
      } else {
        result[opt.id] = fallback;
      }
    });
    return result;
  }

  function buildPreRegisteredAssignments(options) {
    const map = {};
    const optById = {};
    const activeLabels = new Set(options.map(o => o.label.toLowerCase()));
    options.forEach(o => { optById[o.id] = o; });
    EXCLUSIVE_MANUAL_OPTIONS.forEach(o => { optById[o.id] = o; });

    PRE_REGISTERED_MANUAL_RAW.forEach(item => {
      const activeByLabel = options.find(o => o.label.toLowerCase() === item.label.toLowerCase());
      const opt = activeByLabel || optById[item.optionId] || getExclusiveOptionByLabel(item.label);
      if (!opt) return;
      const isExcl = !activeLabels.has(opt.label.toLowerCase());
      map[item.empId] = {
        optionId: opt.id,
        optionLabel: opt.label,
        optionDays: opt.days,
        timestamp: PRE_REGISTERED_TIMESTAMP,
        mode: 'manual',
        isManual: true,
        manualReason: item.reason,
        isPreRegistered: true,
        exclusiveManual: isExcl,
        spinCount: 0,
        finalized: true
      };
    });
    return map;
  }

  function buildPreRegisteredHistory(options) {
    const optById = {};
    options.forEach(o => { optById[o.id] = o; });
    EXCLUSIVE_MANUAL_OPTIONS.forEach(o => { optById[o.id] = o; });

    return PRE_REGISTERED_MANUAL_RAW.map((item, idx) => {
      const activeByLabel = options.find(o => o.label.toLowerCase() === item.label.toLowerCase());
      const opt = activeByLabel || optById[item.optionId] || getExclusiveOptionByLabel(item.label);
      return {
        order: idx + 1,
        empId: item.empId,
        name: item.name,
        area: item.area,
        optionId: opt ? opt.id : item.optionId,
        optionLabel: opt ? opt.label : item.label,
        timestamp: PRE_REGISTERED_TIMESTAMP,
        mode: 'manual',
        isManual: true,
        isPreRegistered: true,
        manualReason: item.reason,
        modeText: `Manual (sin ruleta) — ${item.reason}`
      };
    });
  }

  // =========================================================================
  // 3. STATE, THEME & SYNC METADATA
  // =========================================================================
  let state = loadState();
  let syncUrl = resolveInitialSyncUrl();
  let syncStatus = syncUrl ? 'syncing' : 'disconnected';
  let syncErrorMsg = '';
  let lastSyncAt = null;
  let remoteScriptVersion = 1;
  let pollTimer = null;
  let isSyncInFlight = false;
  let pendingDriveWritesCount = 0;
  let driveWriteQueue = Promise.resolve();
  const inFlightEmpWrites = {};
  const provisionalTokenByEmp = {};
  const provisionalAbortedEmp = {};
  let lastShownResultEmpId = null;

  let selectedPersonId = null;
  let statusFilter = 'pending';
  let areaFilter = 'ALL';
  let searchQuery = '';
  let tableTab = 'register';
  let tableDateFilter = 'ALL';
  let tableAreaFilter = 'ALL';
  let lastFlashedId = null;
  let lastSpinRecord = null;
  let draftDates = [];
  let activeDecisionEmpId = null;

  let isSpinning = false;
  let wheelAngle = 0;
  let pointerDeflection = 0;
  let pointerVelocity = 0;
  let audioCtx = null;
  let wheelFrameCache = { key: '', canvas: null };
  let wheelDiscCache = { key: '', canvas: null };

  function defaultState() {
    const options = DEFAULT_OPTIONS_RAW.map((o, i) => normalizeOption(o, i));
    const assignments = buildPreRegisteredAssignments(options);
    const exclCount = getExclusiveAssignedCount(assignments, options);
    return {
      employees: INITIAL_EMPLOYEES.map(e => ({ ...e })),
      options,
      assignments,
      pendingSpins: {},
      history: buildPreRegisteredHistory(options),
      mode: 'area_balanced',
      equityVersion: EQUITY_SCHEMA_VERSION,
      quotas: normalizeQuotas(null, options, Math.max(1, INITIAL_EMPLOYEES.length - exclCount)),
      soundOn: true,
      autoDownload: false,
      nextEmpId: 45
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.employees)) return defaultState();
      const opts = Array.isArray(parsed.options) && parsed.options.length >= 2
        ? parsed.options.map((o, i) => normalizeOption(o, i))
        : DEFAULT_OPTIONS_RAW.map((o, i) => normalizeOption(o, i));
      const activeIds = new Set(opts.map(o => o.id));
      const optByLabel = {};
      opts.forEach(o => { optByLabel[o.label.toLowerCase()] = o; });
      EXCLUSIVE_MANUAL_OPTIONS.forEach(o => {
        if (!optByLabel[o.label.toLowerCase()]) optByLabel[o.label.toLowerCase()] = o;
      });
      const normalizedAssignments = {};
      for (const [k, v] of Object.entries(parsed.assignments || {})) {
        if (v && (v.optionId !== undefined && v.optionId !== null || v.optionLabel)) {
          const isPre = Boolean(v.isPreRegistered || PRE_REGISTERED_BY_ID[Number(k)]);
          const matchedByLabel = v.optionLabel ? optByLabel[String(v.optionLabel).trim().toLowerCase()] : null;
          const resolvedId = matchedByLabel ? matchedByLabel.id : String(v.optionId);
          const isExcl = Boolean(!activeIds.has(resolvedId) && (v.exclusiveManual || Boolean(getExclusiveOptionById(resolvedId)) || (matchedByLabel && matchedByLabel.exclusiveManual)));
          normalizedAssignments[k] = {
            ...v,
            optionId: resolvedId,
            optionLabel: matchedByLabel ? matchedByLabel.label : (v.optionLabel || ''),
            optionDays: matchedByLabel ? matchedByLabel.days : (v.optionDays || ''),
            isManual: Boolean(v.isManual || v.mode === 'manual' || isPre),
            isPreRegistered: isPre,
            exclusiveManual: isExcl,
            manualReason: String(v.manualReason || ''),
            spinCount: Number(v.spinCount || (v.isManual || v.mode === 'manual' ? 0 : 1)),
            finalized: v.finalized !== false
          };
        }
      }
      // Ensure pre-registered manual assignments are always intact if missing
      const preDefaults = buildPreRegisteredAssignments(opts);
      for (const [empId, preRec] of Object.entries(preDefaults)) {
        if (!normalizedAssignments[empId]) {
          normalizedAssignments[empId] = preRec;
        }
      }
      const normalizedPendingSpins = {};
      for (const [k, v] of Object.entries(parsed.pendingSpins || {})) {
        if (v && (v.optionId !== undefined && v.optionId !== null || v.optionLabel) && !normalizedAssignments[k]) {
          const matchedByLabel = v.optionLabel ? optByLabel[String(v.optionLabel).trim().toLowerCase()] : null;
          normalizedPendingSpins[k] = {
            ...v,
            optionId: matchedByLabel ? matchedByLabel.id : String(v.optionId),
            optionLabel: matchedByLabel ? matchedByLabel.label : (v.optionLabel || ''),
            optionDays: matchedByLabel ? matchedByLabel.days : (v.optionDays || ''),
            spinCount: 1
          };
        }
      }
      const prevVer = Number(parsed.equityVersion || 0);
      let resolvedMode = ['area_balanced', 'balanced', 'equal'].includes(parsed.mode)
        ? parsed.mode
        : 'area_balanced';
      if (prevVer < EQUITY_SCHEMA_VERSION && resolvedMode === 'equal') {
        resolvedMode = 'area_balanced';
      }
      const exclCount = getExclusiveAssignedCount(normalizedAssignments, opts);
      return {
        ...defaultState(),
        ...parsed,
        mode: resolvedMode,
        equityVersion: EQUITY_SCHEMA_VERSION,
        options: opts,
        assignments: normalizedAssignments,
        pendingSpins: normalizedPendingSpins,
        quotas: normalizeQuotas(parsed.quotas, opts, Math.max(1, parsed.employees.length - exclCount))
      };
    } catch (_) {
      return defaultState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function isValidAppsScriptUrl(url) {
    const s = String(url || '').trim();
    return /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec(\?.*)?$/.test(s);
  }

  function resolveInitialSyncUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('sync');
      if (fromQuery && isValidAppsScriptUrl(fromQuery)) {
        localStorage.setItem(SYNC_URL_KEY, fromQuery.trim());
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        return fromQuery.trim();
      }
    } catch (_) {}

    if (CONFIG.APPS_SCRIPT_URL && isValidAppsScriptUrl(CONFIG.APPS_SCRIPT_URL)) {
      return CONFIG.APPS_SCRIPT_URL.trim();
    }
    try {
      const saved = localStorage.getItem(SYNC_URL_KEY);
      if (saved && isValidAppsScriptUrl(saved)) return saved.trim();
    } catch (_) {}
    return '';
  }

  function initTheme() {
    let theme = 'light';
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') {
        theme = saved;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      }
    } catch (_) {}
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  function isDarkTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // =========================================================================
  // 3B. COMPANY LOGO (Header + Modal Upload / URL)
  // =========================================================================
  let companyLogo = loadCompanyLogo();

  function loadCompanyLogo() {
    try {
      const raw = localStorage.getItem(LOGO_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            src: String(parsed.src || '').trim(),
            lightBg: parsed.lightBg !== false
          };
        }
      }
    } catch (_) {}
    const configLogo = String(CONFIG.COMPANY_LOGO_URL || '').trim();
    return { src: configLogo, lightBg: true };
  }

  function saveCompanyLogo(nextLogo) {
    companyLogo = {
      src: String((nextLogo && nextLogo.src) || '').trim(),
      lightBg: nextLogo ? nextLogo.lightBg !== false : true
    };
    try {
      if (companyLogo.src) {
        localStorage.setItem(LOGO_STORAGE_KEY, JSON.stringify(companyLogo));
      } else {
        localStorage.removeItem(LOGO_STORAGE_KEY);
      }
    } catch (_) {
      showToast('El logo es demasiado grande para guardarse en este navegador. Prueba con una imagen más liviana.', '!');
    }
    renderCompanyLogo();
  }

  function renderCompanyLogo() {
    const hasLogo = Boolean(companyLogo && companyLogo.src);
    const useLightBg = Boolean(companyLogo && companyLogo.lightBg !== false);

    const badge = document.getElementById('brandBadgeFallback');
    const wrap = document.getElementById('brandLogoWrap');
    const img = document.getElementById('brandLogoImg');
    if (badge) badge.classList.toggle('hidden', hasLogo);
    if (wrap) {
      wrap.classList.toggle('hidden', !hasLogo);
      wrap.classList.toggle('light-bg', useLightBg);
    }
    if (img) {
      if (hasLogo) img.src = companyLogo.src;
      else img.removeAttribute('src');
    }

    const previewBox = document.getElementById('logoPreviewBox');
    const previewImg = document.getElementById('logoPreviewImg');
    const previewPlaceholder = document.getElementById('logoPreviewPlaceholder');
    const btnRemove = document.getElementById('btnRemoveLogo');
    const chkLightBg = document.getElementById('chkLogoLightBg');

    if (previewBox) previewBox.classList.toggle('light-bg', hasLogo && useLightBg);
    if (previewImg) {
      previewImg.classList.toggle('hidden', !hasLogo);
      if (hasLogo) previewImg.src = companyLogo.src;
      else previewImg.removeAttribute('src');
    }
    if (previewPlaceholder) previewPlaceholder.classList.toggle('hidden', hasLogo);
    if (btnRemove) btnRemove.classList.toggle('hidden', !hasLogo);
    if (chkLightBg) chkLightBg.checked = useLightBg;
  }

  function openCompanyLogoModal() {
    const urlInput = document.getElementById('inputLogoUrl');
    if (urlInput) {
      urlInput.value = companyLogo.src && !companyLogo.src.startsWith('data:') ? companyLogo.src : '';
    }
    renderCompanyLogo();
    openModal('modalCompanyLogo');
  }

  function optimizeLogoImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !/^image\/(png|jpeg|jpg|webp|svg\+xml)$/i.test(file.type || '')) {
        reject(new Error('Formato no soportado. Usa PNG, JPG, WebP o SVG.'));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('No se pudo leer el archivo de imagen.'));
      reader.onload = () => {
        const dataUrl = String(reader.result || '');
        if (!dataUrl.startsWith('data:image/')) {
          reject(new Error('Archivo de imagen inválido.'));
          return;
        }
        if (file.type === 'image/svg+xml') {
          if (dataUrl.length > 350000) {
            reject(new Error('El archivo SVG es demasiado pesado (máx. 250 KB).'));
            return;
          }
          resolve(dataUrl);
          return;
        }
        const img = new Image();
        img.onerror = () => reject(new Error('La imagen no pudo procesarse.'));
        img.onload = () => {
          try {
            const maxW = 480;
            const maxH = 160;
            const ratio = Math.min(1, maxW / Math.max(1, img.width), maxH / Math.max(1, img.height));
            const targetW = Math.max(1, Math.round(img.width * ratio));
            const targetH = Math.max(1, Math.round(img.height * ratio));
            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, targetW, targetH);
            ctx.drawImage(img, 0, 0, targetW, targetH);
            let out = canvas.toDataURL('image/png');
            if (out.length > 300000) {
              const webp = canvas.toDataURL('image/webp', 0.88);
              if (webp.startsWith('data:image/webp') && webp.length < out.length) out = webp;
            }
            resolve(out);
          } catch (_) {
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  }

  // =========================================================================
  // 4. GOOGLE DRIVE LIVE SYNC ENGINE (Apps Script JSON API)
  // =========================================================================
  function applyRemoteState(remote, { preserveInFlightExceptEmpId = null } = {}) {
    if (!remote || !remote.ok || !Array.isArray(remote.employees)) return;
    const remoteVer = Number(remote.scriptVersion || 1);
    remoteScriptVersion = remoteVer;
    if (remote.employees.length > 0) state.employees = remote.employees;

    if (Array.isArray(remote.options) && remote.options.length >= 2) {
      // Preserve the official 4-date structure if an older v4/v5 script still holds the legacy 6 options
      const legacy6 = [
        '23 y 24 de diciembre',
        '24 y 25 de diciembre',
        '25 y 26 de diciembre',
        '30 y 31 de diciembre',
        '31 de diciembre y 01 de enero',
        '01 y 02 de enero'
      ];
      const remoteLooksStale6 = remoteVer < 6 && remote.options.length === 6 &&
        remote.options.every((o, idx) => o && String(o.label || '').trim().toLowerCase() === legacy6[idx]);
      if (!remoteLooksStale6) {
        state.options = remote.options.map((o, i) => normalizeOption(o, i));
      }
    }

    const prevAssignments = state.assignments || {};
    const prevPendingSpins = state.pendingSpins || {};
    const nextAssignments = {};
    const activeIds = new Set(state.options.map(o => o.id));
    const optByLabel = {};
    state.options.forEach(o => { optByLabel[o.label.toLowerCase()] = o; });
    EXCLUSIVE_MANUAL_OPTIONS.forEach(o => {
      if (!optByLabel[o.label.toLowerCase()]) optByLabel[o.label.toLowerCase()] = o;
    });

    for (const [empId, rec] of Object.entries(remote.assignments || {})) {
      if (!rec || (rec.optionId === undefined && !rec.optionLabel)) continue;
      const numId = Number(empId);
      const prev = prevAssignments[empId];
      const keepLocalManual = remoteVer < 2 && prev && prev.isManual && String(prev.optionId) === String(rec.optionId);
      const isPre = Boolean(rec.isPreRegistered || PRE_REGISTERED_BY_ID[numId]);
      const isManual = Boolean(rec.isManual || rec.mode === 'manual' || keepLocalManual || isPre);

      let matchedOpt = null;
      if (rec.optionLabel) {
        matchedOpt = optByLabel[String(rec.optionLabel).trim().toLowerCase()] || null;
      }
      if (!matchedOpt && rec.optionId !== undefined && rec.optionId !== null) {
        matchedOpt = getOptionById(String(rec.optionId)) || getExclusiveOptionById(String(rec.optionId));
      }
      const resolvedOptId = matchedOpt
        ? matchedOpt.id
        : (rec.optionId !== undefined && rec.optionId !== null ? String(rec.optionId) : '');

      const sameAsPrev = prev && String(prev.optionId) === resolvedOptId;
      const inferredSpinCount = rec.spinCount !== undefined
        ? Number(rec.spinCount)
        : (isManual ? 0 : (sameAsPrev && prev.spinCount ? Number(prev.spinCount) : 1));
      const isExcl = Boolean(!activeIds.has(resolvedOptId) && (rec.exclusiveManual || (matchedOpt && matchedOpt.exclusiveManual)));

      nextAssignments[empId] = {
        optionId: resolvedOptId,
        optionLabel: rec.optionLabel || (matchedOpt ? matchedOpt.label : (sameAsPrev ? prev.optionLabel : '')),
        optionDays: rec.optionDays || (matchedOpt ? matchedOpt.days : (sameAsPrev ? prev.optionDays : '')),
        timestamp: rec.timestamp || '',
        mode: isManual ? 'manual' : (rec.mode || state.mode || 'area_balanced'),
        isManual,
        isPreRegistered: isPre,
        exclusiveManual: isExcl,
        manualReason: String(rec.manualReason || (keepLocalManual ? prev.manualReason : '') || (isPre && PRE_REGISTERED_BY_ID[numId] ? PRE_REGISTERED_BY_ID[numId].reason : '')),
        spinCount: inferredSpinCount,
        firstSpinLabel: String(rec.firstSpinLabel || (sameAsPrev && prev.firstSpinLabel ? prev.firstSpinLabel : '')),
        finalized: true
      };
    }

    // Preserve all 13 pre-registered manual dates and any off-roulette exclusive manual assignments
    // when syncing against an older Apps Script version (< v7) or if the sheet was reset on an old script
    if (remoteVer < 7) {
      const preDefaults = buildPreRegisteredAssignments(state.options);
      for (const [empId, preRec] of Object.entries(preDefaults)) {
        if (!nextAssignments[empId]) {
          // Always use freshly resolved preRec so optionId matches current state.options (even if Drive v2 uses IDs 0,2,3,5)
          nextAssignments[empId] = preRec;
        }
      }
      for (const [empId, prev] of Object.entries(prevAssignments)) {
        if (!nextAssignments[empId] && prev && prev.exclusiveManual) {
          const matchedPrev = prev.optionLabel ? optByLabel[String(prev.optionLabel).trim().toLowerCase()] : null;
          nextAssignments[empId] = matchedPrev
            ? { ...prev, optionId: matchedPrev.id, optionLabel: matchedPrev.label, optionDays: matchedPrev.days }
            : prev;
        }
      }
    }
    // Preserve optimistic local assignments for any other employee whose Drive write is still queued
    for (const [kId, cnt] of Object.entries(inFlightEmpWrites)) {
      if (cnt <= 0) continue;
      if (preserveInFlightExceptEmpId !== null && String(preserveInFlightExceptEmpId) === String(kId)) continue;
      if (prevAssignments[kId]) {
        nextAssignments[kId] = prevAssignments[kId];
      }
    }
    state.assignments = nextAssignments;

    // Pending 1st spins awaiting user confirmation
    const nextPendingSpins = {};
    if (remoteVer >= 4 && remote.pendingSpins && typeof remote.pendingSpins === 'object') {
      for (const [empId, pRec] of Object.entries(remote.pendingSpins)) {
        if (!pRec || nextAssignments[empId]) continue;
        const matchedOpt = (pRec.optionLabel && optByLabel[String(pRec.optionLabel).trim().toLowerCase()]) ||
          getOptionById(String(pRec.optionId));
        nextPendingSpins[empId] = {
          optionId: matchedOpt ? matchedOpt.id : String(pRec.optionId),
          optionLabel: pRec.optionLabel || (matchedOpt ? matchedOpt.label : ''),
          optionDays: pRec.optionDays || (matchedOpt ? matchedOpt.days : ''),
          timestamp: pRec.timestamp || '',
          mode: pRec.mode || state.mode || 'area_balanced',
          spinCount: 1
        };
      }
    } else {
      // Preserve local provisional 1st spins for anyone not yet finalized remotely (re-resolving optionId by label)
      for (const [empId, pRec] of Object.entries(prevPendingSpins)) {
        if (pRec && !nextAssignments[empId]) {
          const matchedOpt = (pRec.optionLabel && optByLabel[String(pRec.optionLabel).trim().toLowerCase()]) ||
            getOptionById(String(pRec.optionId));
          nextPendingSpins[empId] = matchedOpt
            ? { ...pRec, optionId: matchedOpt.id, optionLabel: matchedOpt.label, optionDays: matchedOpt.days }
            : pRec;
        }
      }
    }
    for (const [kId, cnt] of Object.entries(inFlightEmpWrites)) {
      if (cnt <= 0) continue;
      if (preserveInFlightExceptEmpId !== null && String(preserveInFlightExceptEmpId) === String(kId)) continue;
      if (prevPendingSpins[kId] && !nextAssignments[kId]) {
        nextPendingSpins[kId] = prevPendingSpins[kId];
      }
    }
    state.pendingSpins = nextPendingSpins;

    const prevManualByEmpOpt = new Map();
    if (remoteVer < 2) {
      for (const [empId, rec] of Object.entries(nextAssignments)) {
        if (rec && rec.isManual) prevManualByEmpOpt.set(`${empId}|${rec.optionId}`, rec.manualReason || '');
      }
    }

    state.history = Array.isArray(remote.history)
      ? remote.history.map(h => {
          let optIdStr = h.optionId !== undefined && h.optionId !== null ? String(h.optionId) : null;
          if (h.optionLabel) {
            const matched = optByLabel[String(h.optionLabel).trim().toLowerCase()];
            if (matched) optIdStr = matched.id;
          }
          let hManual = Boolean(h.isManual || h.mode === 'manual');
          let hReason = String(h.manualReason || '');
          if (!hManual && remoteVer < 2 && h.name && optIdStr) {
            const empMatch = state.employees.find(e => e.name === h.name);
            const k = empMatch ? `${empMatch.id}|${optIdStr}` : '';
            if (k && prevManualByEmpOpt.has(k)) {
              hManual = true;
              hReason = prevManualByEmpOpt.get(k);
            }
          }
          const hModeTxt = String(h.modeText || '').toLowerCase();
          const inferredMode = hManual
            ? 'manual'
            : (h.mode === 'area_balanced' || hModeTxt.includes('área') || hModeTxt.includes('area')
                ? 'area_balanced'
                : (h.mode === 'balanced' || hModeTxt.includes('cupo') ? 'balanced' : (h.mode || 'equal')));
          return {
            ...h,
            optionId: optIdStr,
            mode: inferredMode,
            isManual: hManual,
            manualReason: hReason
          };
        })
      : [];

    if (remoteVer >= 7) {
      if (['area_balanced', 'balanced', 'equal'].includes(remote.mode)) {
        state.mode = remote.mode;
      }
    } else if (remote.mode === 'balanced') {
      state.mode = 'balanced';
    }
    if (remote.quotas) {
      const rouletteCount = Math.max(1, state.employees.length - getExclusiveAssignedCount(state.assignments, state.options));
      state.quotas = normalizeQuotas(remote.quotas, state.options, rouletteCount);
    }
    if (remote.nextEmpId) state.nextEmpId = Number(remote.nextEmpId);
    saveState();

    if (selectedPersonId && !state.employees.some(e => e.id === selectedPersonId)) {
      const firstPending = state.employees.find(e => !state.assignments[e.id]);
      selectedPersonId = firstPending ? firstPending.id : null;
    }
  }

  async function syncFromDrive({ silent = true, force = false } = {}) {
    if (!syncUrl || isSyncInFlight) return false;
    if (pendingDriveWritesCount > 0 && !force) return false;
    isSyncInFlight = true;
    if (!silent) {
      syncStatus = 'syncing';
      renderSyncUi();
    }
    try {
      const sep = syncUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${syncUrl}${sep}action=state&t=${Date.now()}`, {
        method: 'GET',
        redirect: 'follow'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !data.ok) throw new Error(data?.error || 'Respuesta inválida de Drive');

      // If a local write started while this GET was in flight, do not overwrite it with an older snapshot
      if (pendingDriveWritesCount > 0 && !force) return false;

      applyRemoteState(data);
      syncStatus = 'connected';
      syncErrorMsg = '';
      lastSyncAt = new Date();
      renderAll();
      if (!silent) showToast('Sincronizado con Google Drive', '✓');
      return true;
    } catch (err) {
      syncStatus = 'error';
      syncErrorMsg = err && err.message ? err.message : 'Error de conexión';
      renderSyncUi();
      if (!silent) showToast(`No se pudo sincronizar con Drive: ${syncErrorMsg}`, '!');
      return false;
    } finally {
      isSyncInFlight = false;
    }
  }

  function enqueueDriveWrite(empId, taskFn) {
    if (!syncUrl) return Promise.resolve(null);
    pendingDriveWritesCount++;
    const key = empId !== null && empId !== undefined ? String(empId) : null;
    if (key !== null) inFlightEmpWrites[key] = (inFlightEmpWrites[key] || 0) + 1;
    renderSyncUi();
    const job = driveWriteQueue.then(async () => {
      try {
        return await taskFn();
      } finally {
        pendingDriveWritesCount = Math.max(0, pendingDriveWritesCount - 1);
        if (key !== null) {
          inFlightEmpWrites[key] = Math.max(0, (inFlightEmpWrites[key] || 1) - 1);
          if (inFlightEmpWrites[key] === 0) delete inFlightEmpWrites[key];
        }
        renderSyncUi();
      }
    });
    driveWriteQueue = job.catch(() => {});
    return job;
  }

  async function postToDriveRaw(payload) {
    if (!syncUrl) return null;
    try {
      syncStatus = 'syncing';
      renderSyncUi();
      const res = await fetch(syncUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const isLastQueued = pendingDriveWritesCount <= 1;
      if (data && data.state && (isLastQueued || data.conflict || data.quotaConflict)) {
        applyRemoteState(data.state, {
          preserveInFlightExceptEmpId: payload && payload.empId !== undefined ? payload.empId : null
        });
      }
      syncStatus = 'connected';
      syncErrorMsg = '';
      lastSyncAt = new Date();
      renderSyncUi();
      return data;
    } catch (err) {
      syncStatus = 'error';
      syncErrorMsg = err && err.message ? err.message : 'Sin conexión';
      renderSyncUi();
      return { ok: false, networkError: true, error: syncErrorMsg };
    }
  }

  function postToDrive(payload) {
    if (!syncUrl) return Promise.resolve(null);
    const empId = payload && payload.empId !== undefined ? payload.empId : null;
    return enqueueDriveWrite(empId, () => postToDriveRaw(payload));
  }

  function startPolling() {
    stopPolling();
    if (!syncUrl) return;
    pollTimer = setInterval(() => {
      if (!isSpinning && !document.hidden && pendingDriveWritesCount === 0) {
        syncFromDrive({ silent: true });
      }
    }, Math.max(3000, Number(CONFIG.POLL_INTERVAL_MS) || 5000));
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function renderSyncUi() {
    const dot = document.getElementById('syncDot');
    const modalDot = document.getElementById('modalSyncDot');
    const btn = document.getElementById('btnDriveSync');
    const label = document.getElementById('syncBtnLabel');
    const noticeBar = document.getElementById('syncNoticeBar');
    const btnSyncNow = document.getElementById('btnSyncNow');
    const excelStatus = document.getElementById('excelSyncStatus');

    const modalText = document.getElementById('modalSyncStatusText');
    const modalDetail = document.getElementById('modalSyncDetail');
    const btnShare = document.getElementById('btnCopyShareLink');
    const btnPushLocal = document.getElementById('btnPushLocalToDrive');
    const btnDisconnect = document.getElementById('btnDisconnectDrive');

    const effectiveStatus = pendingDriveWritesCount > 0 && syncStatus !== 'error'
      ? 'syncing'
      : syncStatus;

    const dotClass = effectiveStatus === 'connected' ? 'sync-dot connected'
      : effectiveStatus === 'syncing' ? 'sync-dot syncing'
      : effectiveStatus === 'error' ? 'sync-dot error'
      : 'sync-dot';

    dot.className = dotClass;
    modalDot.className = dotClass;

    if (effectiveStatus === 'connected') {
      btn.className = 'btn btn-sync-ok';
      label.textContent = 'Drive en vivo';
      noticeBar.classList.add('hidden');
      btnSyncNow.classList.remove('hidden');
      const timeTxt = lastSyncAt ? lastSyncAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
      const scriptOutdated = remoteScriptVersion < 7;
      excelStatus.textContent = `Sincronizado en vivo con Google Drive${timeTxt ? ' · última actualización ' + timeTxt : ''}${scriptOutdated ? ' · (Apps Script v' + remoteScriptVersion + ': actualiza Code.gs para activar protección servidor v7)' : '. Todos los dispositivos ven los cambios automáticamente.'}`;
      modalText.textContent = `Conectado a Google Drive (${timeTxt || 'en vivo'} · Script v${remoteScriptVersion})`;
      modalDetail.textContent = scriptOutdated
        ? `⚠️ Tu hoja usa Apps Script v${remoteScriptVersion}. Copia el código actualizado de Code.gs (botón abajo), pégalo en Extensiones → Apps Script y despliega una "Nueva versión" para activar validación de cupos en servidor, eliminar tiros en Drive y protección de los 13 manuales al reiniciar.`
        : 'Cada giro, asignación manual o cambio de fechas se guarda en "Descansos Quirama Fin de Año 2026" y se actualiza en todos los dispositivos cada 5 segundos.';
      btnShare.classList.remove('hidden');
      btnPushLocal.classList.remove('hidden');
      btnDisconnect.classList.remove('hidden');
    } else if (effectiveStatus === 'syncing') {
      btn.className = pendingDriveWritesCount > 0 ? 'btn btn-sync-ok' : 'btn';
      label.textContent = pendingDriveWritesCount > 0 ? 'Guardando...' : 'Sincronizando...';
      noticeBar.classList.add('hidden');
      btnSyncNow.classList.remove('hidden');
      modalText.textContent = pendingDriveWritesCount > 0
        ? `Guardando en Google Drive (${pendingDriveWritesCount} pendiente${pendingDriveWritesCount === 1 ? '' : 's'})...`
        : 'Conectando con Google Drive...';
    } else if (syncStatus === 'error') {
      btn.className = 'btn';
      label.textContent = 'Error Drive';
      noticeBar.classList.add('hidden');
      btnSyncNow.classList.remove('hidden');
      excelStatus.textContent = `Sin conexión temporal con Drive (${syncErrorMsg}). Los datos siguen guardados localmente.`;
      modalText.textContent = `Error de sincronización: ${syncErrorMsg}`;
      modalDetail.textContent = 'Verifica que la URL termine en /exec y que la implementación en Apps Script tenga acceso para "Cualquier usuario".';
      btnShare.classList.toggle('hidden', !syncUrl);
      btnPushLocal.classList.toggle('hidden', !syncUrl);
      btnDisconnect.classList.toggle('hidden', !syncUrl);
    } else {
      btn.className = 'btn';
      label.textContent = 'Conectar Drive';
      noticeBar.classList.remove('hidden');
      btnSyncNow.classList.add('hidden');
      excelStatus.textContent = 'Modo local activo. Conecta Google Drive para sincronizar entre varios dispositivos o descarga el archivo Excel (.xlsx).';
      modalText.textContent = 'Sin conectar (modo local)';
      modalDetail.textContent = 'Al conectar tu hoja de Google Drive, todos los celulares y computadores verán quién ya giró su ruleta en tiempo real y evitarán duplicados automáticamente.';
      btnShare.classList.add('hidden');
      btnPushLocal.classList.add('hidden');
      btnDisconnect.classList.add('hidden');
    }
  }

  // =========================================================================
  // 5. CRYPTOGRAPHICALLY FAIR RANDOMNESS & DYNAMIC PROBABILITY MODEL
  // =========================================================================
  function cryptoRandomFloat() {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] / 0x100000000;
  }

  function cryptoRandomInt(maxExclusive) {
    if (maxExclusive <= 1) return 0;
    const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
    const buf = new Uint32Array(1);
    let val;
    do {
      window.crypto.getRandomValues(buf);
      val = buf[0];
    } while (val >= limit);
    return val % maxExclusive;
  }

  function getAssignedCountsMap(excludeEmpId = null, includePendingSpins = false) {
    const counts = {};
    const idByLabel = {};
    state.options.forEach(o => {
      counts[o.id] = 0;
      idByLabel[o.label.toLowerCase()] = o.id;
    });
    const resolveActiveId = (rec) => {
      if (!rec) return null;
      if (rec.optionLabel) {
        const byLbl = idByLabel[String(rec.optionLabel).trim().toLowerCase()];
        if (byLbl !== undefined) return byLbl;
      }
      const idStr = String(rec.optionId);
      return counts[idStr] !== undefined ? idStr : null;
    };
    for (const [empIdStr, rec] of Object.entries(state.assignments)) {
      if (excludeEmpId !== null && Number(empIdStr) === Number(excludeEmpId)) continue;
      const activeId = resolveActiveId(rec);
      if (activeId !== null) counts[activeId]++;
    }
    if (includePendingSpins) {
      for (const [empIdStr, pRec] of Object.entries(state.pendingSpins || {})) {
        if (state.assignments[empIdStr]) continue;
        if (excludeEmpId !== null && Number(empIdStr) === Number(excludeEmpId)) continue;
        const activeId = resolveActiveId(pRec);
        if (activeId !== null) counts[activeId]++;
      }
    }
    return counts;
  }

  function hasPendingFirstSpin(empId) {
    if (!empId) return false;
    const numId = Number(empId);
    return !state.assignments[numId] && Boolean(state.pendingSpins && state.pendingSpins[numId]);
  }

  function hasSpunRoulette(empId) {
    const numId = Number(empId);
    const emp = state.employees.find(e => e.id === numId);
    const rec = state.assignments[numId];
    if (rec && !rec.isManual && rec.mode !== 'manual' && rec.finalized !== false) return true;
    const activeIds = new Set(state.options.map(o => String(o.id)));
    const activeLabels = new Set(state.options.map(o => o.label.toLowerCase()));
    return state.history.some(h => {
      if (!h || h.isManual || h.mode === 'manual') return false;
      const modeTxtLower = String(h.modeText || '').toLowerCase();
      if (h.spinOutcome === 'provisional' || h.spinOutcome === 'discarded' || h.spinOutcome === 'deleted_admin' ||
          modeTxtLower.includes('por confirmar') || modeTxtLower.includes('descartado') ||
          modeTxtLower.includes('anulado') || modeTxtLower.includes('eliminado')) {
        return false;
      }
      const matchesEmp = (h.empId !== undefined && h.empId !== null && Number(h.empId) === numId) ||
        (emp && h.name && String(h.name).trim().toUpperCase() === String(emp.name).trim().toUpperCase());
      if (!matchesEmp) return false;
      const optActive = (h.optionId !== null && h.optionId !== undefined && activeIds.has(String(h.optionId))) ||
        (h.optionLabel && activeLabels.has(String(h.optionLabel).trim().toLowerCase()));
      return optActive;
    });
  }

  function canSpinRoulette(empId) {
    if (!empId) return false;
    const numId = Number(empId);
    if (state.assignments[numId]) return false;
    if (hasSpunRoulette(numId)) return false;
    return true;
  }

  let equityCacheKey = '';
  let equityCacheModel = null;

  function buildEquityCacheKey(excludeEmpId = null) {
    const optPart = state.options.map(o => `${o.id}:${o.label}`).join(',');
    const empPart = state.employees.map(e => `${e.id}:${e.area}`).join('|');
    const asgPart = Object.keys(state.assignments)
      .sort()
      .map(k => `${k}=${state.assignments[k] ? `${state.assignments[k].optionId}|${state.assignments[k].optionLabel || ''}` : ''}`)
      .join(',');
    const pendPart = Object.keys(state.pendingSpins || {})
      .sort()
      .map(k => `${k}=${state.pendingSpins[k] ? `${state.pendingSpins[k].optionId}|${state.pendingSpins[k].optionLabel || ''}` : ''}`)
      .join(',');
    return `${optPart}#${empPart}#${asgPart}#${pendPart}#${excludeEmpId === null ? '' : excludeEmpId}`;
  }

  function getRuleGroupKey(area) {
    const clean = String(area || 'General').trim();
    const norm = stripAccents(clean);
    if (norm === 'mantenimiento' || norm === 'mantenimiento zonas humedas') {
      return 'Mantenimiento';
    }
    return clean;
  }

  function isDate23_24(opt) {
    const s = stripAccents((opt && opt.label) || '');
    return /\b23\b/.test(s) && /\b24\b/.test(s) && s.includes('dic');
  }

  function isDate30_31(opt) {
    const s = stripAccents((opt && opt.label) || '');
    return /\b30\b/.test(s) && /\b31\b/.test(s) && s.includes('dic');
  }

  function isDate01_02(opt) {
    const s = stripAccents((opt && opt.label) || '');
    return /\b0?1\b/.test(s) && /\b0?2\b/.test(s) && s.includes('ene');
  }

  // Discreet per-person guaranteed spin rules (wheel/cards stay visually normal; enforced on spin & quota reservation)
  const GUARANTEED_SPIN_RULES = [
    {
      empId: 9,
      nameMatch: 'JURADO HENAO SANDRA MILENA',
      matchOption: isDate30_31
    }
  ];

  function getGuaranteedOptionForEmployee(emp, options = state.options) {
    if (!emp || !Array.isArray(options) || options.length === 0) return null;
    const empId = Number(emp.id);
    const empNameNorm = stripAccents(emp.name || '').replace(/\s+/g, ' ').trim();
    for (const rule of GUARANTEED_SPIN_RULES) {
      const ruleNameNorm = stripAccents(rule.nameMatch).replace(/\s+/g, ' ').trim();
      const matches = (empNameNorm && empNameNorm === ruleNameNorm) ||
        (empId === rule.empId && (!empNameNorm || (empNameNorm.includes('jurado') && empNameNorm.includes('sandra'))));
      if (matches) {
        return options.find(rule.matchOption) || null;
      }
    }
    return null;
  }

  function cappedWaterFill(counts, pending, maxCaps) {
    const k = counts.length;
    if (k === 0) {
      return { baseNeed: [], extrasLeft: 0, eligibleForExtra: [], minAfterBase: [] };
    }
    if (pending <= 0) {
      return {
        baseNeed: Array(k).fill(0),
        extrasLeft: 0,
        eligibleForExtra: Array(k).fill(false),
        minAfterBase: counts.slice()
      };
    }

    let capCapacity = 0;
    let allFinite = true;
    for (let j = 0; j < k; j++) {
      const cap = maxCaps && maxCaps[j] !== undefined && maxCaps[j] !== null ? maxCaps[j] : Infinity;
      if (!Number.isFinite(cap)) {
        allFinite = false;
      } else if (counts[j] < cap) {
        capCapacity += (cap - counts[j]);
      }
    }
    const effectiveCaps = (!allFinite || capCapacity >= pending)
      ? Array.from({ length: k }, (_, j) => (maxCaps && maxCaps[j] !== undefined && maxCaps[j] !== null ? maxCaps[j] : Infinity))
      : Array(k).fill(Infinity);

    const baseNeed = Array(k).fill(0);
    const cur = counts.slice();
    let rem = pending;

    while (rem > 0) {
      let minOpen = Infinity;
      for (let j = 0; j < k; j++) {
        if (cur[j] < effectiveCaps[j] && cur[j] < minOpen) {
          minOpen = cur[j];
        }
      }
      if (!Number.isFinite(minOpen)) break;

      const openAtMin = [];
      for (let j = 0; j < k; j++) {
        if (cur[j] === minOpen && cur[j] < effectiveCaps[j]) {
          openAtMin.push(j);
        }
      }
      if (openAtMin.length === 0) break;

      if (openAtMin.length <= rem) {
        for (const j of openAtMin) {
          cur[j] += 1;
          baseNeed[j] += 1;
        }
        rem -= openAtMin.length;
      } else {
        const eligibleForExtra = Array(k).fill(false);
        for (const j of openAtMin) eligibleForExtra[j] = true;
        return {
          baseNeed,
          extrasLeft: rem,
          eligibleForExtra,
          minAfterBase: cur
        };
      }
    }

    return {
      baseNeed,
      extrasLeft: 0,
      eligibleForExtra: Array(k).fill(false),
      minAfterBase: cur
    };
  }

  function buildAreaRuleSpec(groupKey, options, counts) {
    const k = options.length;
    const norm = stripAccents(groupKey);

    // 1. Recepción: 1 persona por cada fecha de descanso
    if (norm === 'recepcion') {
      return {
        fixedMin: Array(k).fill(0),
        maxCap: Array(k).fill(1),
        ruleLabel: '1 / fecha',
        hasCustomRule: true
      };
    }

    // 2. Ama de Llaves (Camareras): 2 personas el 23 y 24 dic, resto máx. 1 persona
    if (norm === 'ama de llaves') {
      const idx23 = options.findIndex(isDate23_24);
      if (idx23 >= 0) {
        return {
          fixedMin: options.map((_, j) => (j === idx23 ? 2 : 0)),
          maxCap: options.map((_, j) => (j === idx23 ? 2 : 1)),
          ruleLabel: '2 en 23–24 Dic · máx. 1 resto',
          hasCustomRule: true
        };
      }
    }

    // 3. Bar: 2 personas el 01 y 02 ene, otras fechas máx. 3 personas
    if (norm === 'bar') {
      const idx01 = options.findIndex(isDate01_02);
      if (idx01 >= 0) {
        return {
          fixedMin: options.map((_, j) => (j === idx01 ? 2 : 0)),
          maxCap: options.map((_, j) => (j === idx01 ? 2 : 3)),
          ruleLabel: '2 en 01–02 Ene · máx. 3 resto',
          hasCustomRule: true
        };
      }
      return {
        fixedMin: Array(k).fill(0),
        maxCap: Array(k).fill(3),
        ruleLabel: 'máx. 3 / fecha',
        hasCustomRule: true
      };
    }

    // 4. Producción: máx. 3 personas por fecha
    if (norm === 'produccion') {
      return {
        fixedMin: Array(k).fill(0),
        maxCap: Array(k).fill(3),
        ruleLabel: 'máx. 3 / fecha',
        hasCustomRule: true
      };
    }

    // 5. Mantenimiento (+ Mantenimiento Zonas Húmedas): máx. 2 personas en 1 sola fecha y máx. 1 en el resto
    if (norm === 'mantenimiento') {
      const alreadyHasDouble = counts.some(c => c >= 2);
      return {
        fixedMin: Array(k).fill(0),
        maxCap: counts.map(c => (alreadyHasDouble ? (c >= 2 ? c : 1) : 2)),
        ruleLabel: 'máx. 2 en 1 fecha · 1 resto',
        hasCustomRule: true
      };
    }

    return {
      fixedMin: Array(k).fill(0),
      maxCap: Array(k).fill(Infinity),
      ruleLabel: null,
      hasCustomRule: false
    };
  }

  function solveGroupRule(groupKey, options, counts, pending) {
    const k = options.length;
    const spec = buildAreaRuleSpec(groupKey, options, counts);
    const fixedMin = spec.fixedMin;
    const maxCap = spec.maxCap;

    if (k === 0 || pending <= 0) {
      return {
        spec,
        weights: Array(k).fill(0),
        minAfterAll: counts.slice(),
        maxAfterAll: counts.slice(),
        ruleMaxCap: maxCap.slice(),
        extrasLeft: 0
      };
    }

    // Phase 1: Guarantee fixed minimums (e.g., Ama de Llaves = 2 on 23-24 Dic, Bar = 2 on 01-02 Ene)
    const rawFixedNeed = Array(k).fill(0);
    let totalFixedNeed = 0;
    for (let j = 0; j < k; j++) {
      const need = fixedMin[j] > counts[j] ? (fixedMin[j] - counts[j]) : 0;
      rawFixedNeed[j] = need;
      totalFixedNeed += need;
    }

    const fixedAlloc = Array(k).fill(0);
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
        const wfFixed = cappedWaterFill(counts, remPending, fixedMin.map((m, j) => Math.max(counts[j], m)));
        const eligCount = wfFixed.eligibleForExtra.filter(Boolean).length;
        const weights = Array(k).fill(0);
        const maxAfterAll = Array(k).fill(0);
        for (let j = 0; j < k; j++) {
          const extra = wfFixed.eligibleForExtra[j] && eligCount > 0 ? (wfFixed.extrasLeft / eligCount) : 0;
          weights[j] = wfFixed.baseNeed[j] + extra;
          maxAfterAll[j] = Math.max(counts[j], wfFixed.minAfterBase[j] + (wfFixed.eligibleForExtra[j] ? 1 : 0));
        }
        return {
          spec,
          weights,
          minAfterAll: wfFixed.minAfterBase,
          maxAfterAll,
          ruleMaxCap: maxCap.slice(),
          extrasLeft: wfFixed.extrasLeft
        };
      }
    }

    // Phase 2: Distribute remaining pending people respecting per-date maxCap
    const wf = cappedWaterFill(curAfterFixed, remPending, maxCap);
    const eligCount = wf.eligibleForExtra.filter(Boolean).length;
    const weights = Array(k).fill(0);
    const minAfterAll = Array(k).fill(0);
    const maxAfterAll = Array(k).fill(0);

    for (let j = 0; j < k; j++) {
      const extraShare = wf.eligibleForExtra[j] && eligCount > 0
        ? (wf.extrasLeft / eligCount)
        : 0;
      weights[j] = fixedAlloc[j] + wf.baseNeed[j] + extraShare;
      minAfterAll[j] = wf.minAfterBase[j];
      maxAfterAll[j] = Math.max(counts[j], wf.minAfterBase[j] + (wf.eligibleForExtra[j] ? 1 : 0));
    }

    return {
      spec,
      weights,
      minAfterAll,
      maxAfterAll,
      ruleMaxCap: maxCap.slice(),
      extrasLeft: wf.extrasLeft
    };
  }

  function computeEquityModel(
    options = state.options,
    employees = state.employees,
    assignments = state.assignments,
    pendingSpins = state.pendingSpins,
    excludeEmpId = null
  ) {
    const useCache = options === state.options &&
      employees === state.employees &&
      assignments === state.assignments &&
      pendingSpins === state.pendingSpins;
    if (useCache) {
      const key = buildEquityCacheKey(excludeEmpId);
      if (key === equityCacheKey && equityCacheModel) return equityCacheModel;
      equityCacheKey = key;
    }

    const k = options.length;
    const optIndexById = {};
    const optIndexByLabel = {};
    options.forEach((o, idx) => {
      optIndexById[String(o.id)] = idx;
      optIndexByLabel[String(o.label || '').trim().toLowerCase()] = idx;
    });

    const groupList = [];
    const groupMap = {};
    const areaOwnStats = {};
    const globalCounts = Array(k).fill(0);
    let totalExclusiveAssigned = 0;

    for (const emp of employees) {
      const area = emp.area || 'General';
      const groupKey = getRuleGroupKey(area);
      if (!groupMap[groupKey]) {
        groupMap[groupKey] = {
          groupKey,
          memberAreas: [],
          total: 0,
          exclusiveAssigned: 0,
          pending: 0,
          counts: Array(k).fill(0)
        };
        groupList.push(groupMap[groupKey]);
      }
      const gEntry = groupMap[groupKey];
      if (!gEntry.memberAreas.includes(area)) gEntry.memberAreas.push(area);
      gEntry.total++;

      if (!areaOwnStats[area]) {
        areaOwnStats[area] = { area, groupKey, total: 0, exclusiveAssigned: 0, pending: 0, counts: Array(k).fill(0) };
      }
      areaOwnStats[area].total++;

      const isExcluded = excludeEmpId !== null && Number(emp.id) === Number(excludeEmpId);
      const rec = isExcluded ? null : (assignments[emp.id] || (pendingSpins && pendingSpins[emp.id]) || null);
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
          areaOwnStats[area].counts[optIdx]++;
          globalCounts[optIdx]++;
        } else {
          // Fecha manual exclusiva fuera de la ruleta (ej. 24-25 dic, 26-27 dic, 31 dic-01 ene)
          gEntry.exclusiveAssigned++;
          areaOwnStats[area].exclusiveAssigned++;
          totalExclusiveAssigned++;
        }
      } else {
        gEntry.pending++;
        areaOwnStats[area].pending++;
      }
    }

    const globalCountsById = {};
    const globalMaxCapById = {};
    const globalWeightsById = {};
    options.forEach((o, j) => {
      globalCountsById[o.id] = globalCounts[j];
      globalMaxCapById[o.id] = 0;
      globalWeightsById[o.id] = 0;
    });

    const byGroup = {};
    const byGroupList = [];
    const byArea = {};

    for (const g of groupList) {
      const solved = solveGroupRule(g.groupKey, options, g.counts, g.pending);
      const rouletteTotal = Math.max(0, g.total - g.exclusiveAssigned);
      const isMultiArea = g.memberAreas.length > 1;
      const displayGroupLabel = isMultiArea && stripAccents(g.groupKey) === 'mantenimiento'
        ? 'Mantenimiento (+ Z. Húmedas)'
        : g.groupKey;

      const weightsById = {};
      const probsById = {};
      const countsById = {};
      const minCapById = {};
      const maxCapById = {};
      const ruleMaxCapById = {};
      let weightSum = 0;

      for (let j = 0; j < k; j++) {
        const optId = options[j].id;
        const w = solved.weights[j] || 0;
        weightsById[optId] = w;
        weightSum += w;
        countsById[optId] = g.counts[j];
        minCapById[optId] = solved.minAfterAll[j];
        maxCapById[optId] = solved.maxAfterAll[j];
        ruleMaxCapById[optId] = Number.isFinite(solved.ruleMaxCap[j])
          ? solved.ruleMaxCap[j]
          : solved.maxAfterAll[j];
        globalWeightsById[optId] += w;
        globalMaxCapById[optId] += solved.maxAfterAll[j];
      }

      options.forEach(o => {
        probsById[o.id] = weightSum > 0 ? (weightsById[o.id] / weightSum) : 0;
      });

      const minTarget = k > 0 ? Math.min(...solved.minAfterAll) : 0;
      const maxTarget = k > 0 ? Math.max(...solved.maxAfterAll) : 0;

      const groupModel = {
        groupKey: g.groupKey,
        displayGroupLabel,
        memberAreas: g.memberAreas.slice(),
        isGrouped: isMultiArea,
        total: g.total,
        rouletteTotal,
        exclusiveAssigned: g.exclusiveAssigned,
        pending: g.pending,
        hasCustomRule: solved.spec.hasCustomRule,
        ruleLabel: solved.spec.ruleLabel,
        minTarget,
        maxTarget,
        countsById,
        minCapById,
        maxCapById,
        ruleMaxCapById,
        weightsById,
        probsById,
        extrasLeft: solved.extrasLeft
      };

      byGroup[g.groupKey] = groupModel;
      byGroupList.push(groupModel);

      for (const areaName of g.memberAreas) {
        const own = areaOwnStats[areaName];
        byArea[areaName] = {
          ...groupModel,
          area: areaName,
          ownTotal: own ? own.total : g.total,
          ownExclusiveAssigned: own ? own.exclusiveAssigned : g.exclusiveAssigned,
          ownPending: own ? own.pending : g.pending
        };
      }
    }

    const totalEmps = employees.length;
    const rouletteTotalEmps = Math.max(0, totalEmps - totalExclusiveAssigned);
    const model = {
      totalEmps,
      rouletteTotalEmps,
      totalExclusiveAssigned,
      globalMinTarget: Math.floor(rouletteTotalEmps / Math.max(1, k)),
      globalMaxTarget: Math.ceil(rouletteTotalEmps / Math.max(1, k)),
      globalCountsById,
      globalMaxCapById,
      globalWeightsById,
      byGroup,
      byGroupList,
      byArea
    };

    if (useCache) equityCacheModel = model;
    return model;
  }

  function getEffectiveSpinWeightsForEmployee(
    emp,
    options = state.options,
    employees = state.employees,
    assignments = state.assignments,
    pendingSpins = state.pendingSpins,
    excludeEmpId = null
  ) {
    const k = options.length;
    const weightsById = {};
    options.forEach(o => { weightsById[o.id] = 0; });
    if (!emp || k === 0) return { weightsById, guaranteedOpt: null, ruleMaxCapById: {}, countsById: {}, pending: 0 };

    const guaranteedOpt = getGuaranteedOptionForEmployee(emp, options);
    if (guaranteedOpt) {
      weightsById[guaranteedOpt.id] = 1;
      return { weightsById, guaranteedOpt, ruleMaxCapById: {}, countsById: {}, pending: 1 };
    }

    const optIndexById = {};
    const optIndexByLabel = {};
    options.forEach((o, j) => {
      optIndexById[String(o.id)] = j;
      optIndexByLabel[String(o.label || '').trim().toLowerCase()] = j;
    });

    const targetGroupKey = getRuleGroupKey(emp.area || 'General');
    const counts = Array(k).fill(0);
    let pending = 0;

    for (const e of employees) {
      if (getRuleGroupKey(e.area || 'General') !== targetGroupKey) continue;
      const isExcluded = excludeEmpId !== null && Number(e.id) === Number(excludeEmpId);
      const rec = isExcluded ? null : (assignments[e.id] || (pendingSpins && pendingSpins[e.id]) || null);
      if (rec) {
        const recLabel = rec.optionLabel ? String(rec.optionLabel).trim().toLowerCase() : '';
        let optIdx = -1;
        if (recLabel && optIndexByLabel[recLabel] !== undefined) optIdx = optIndexByLabel[recLabel];
        else if (optIndexById[String(rec.optionId)] !== undefined) optIdx = optIndexById[String(rec.optionId)];
        if (optIdx >= 0) counts[optIdx]++;
      } else {
        // Reserve 1 slot for any OTHER still-pending teammate in this group who has a guaranteed spin date
        const otherGuaranteed = Number(e.id) !== Number(emp.id) ? getGuaranteedOptionForEmployee(e, options) : null;
        if (otherGuaranteed && optIndexById[String(otherGuaranteed.id)] !== undefined) {
          counts[optIndexById[String(otherGuaranteed.id)]]++;
        } else {
          pending++;
        }
      }
    }

    const solved = solveGroupRule(targetGroupKey, options, counts, pending);
    const ruleMaxCapById = {};
    const countsById = {};
    for (let j = 0; j < k; j++) {
      const optId = options[j].id;
      weightsById[optId] = solved.weights[j] || 0;
      countsById[optId] = counts[j];
      ruleMaxCapById[optId] = Number.isFinite(solved.ruleMaxCap[j]) ? solved.ruleMaxCap[j] : null;
    }

    return { weightsById, guaranteedOpt: null, ruleMaxCapById, countsById, pending };
  }

  function formatRangeTarget(minVal, maxVal) {
    return minVal === maxVal ? String(minVal) : `${minVal}–${maxVal}`;
  }

  function getModeShortLabel(mode = state.mode) {
    if (mode === 'area_balanced') return 'Reglas estrictas por área';
    if (mode === 'balanced') return 'Cupos globales';
    return 'Azar libre';
  }

  function buildEqualSectors(opts) {
    const repeatEqual = opts.length <= 5 ? 2 : 1;
    const list = [];
    for (let r = 0; r < repeatEqual; r++) {
      for (const opt of opts) list.push(opt);
    }
    const slice = TWO_PI / list.length;
    return list.map((opt, idx) => ({
      index: idx,
      optionId: opt.id,
      option: opt,
      startAngle: idx * slice,
      endAngle: (idx + 1) * slice,
      weight: 1 / list.length
    }));
  }

  function buildWeightedSectors(opts, weightsById) {
    const activeOpts = opts.filter(o => (weightsById[o.id] || 0) > 1e-9);
    if (activeOpts.length === 0) return buildEqualSectors(opts);

    const totalW = activeOpts.reduce((sum, o) => sum + (weightsById[o.id] || 0), 0);
    if (totalW <= 0) return buildEqualSectors(opts);

    const repeat = activeOpts.length === 1 ? 4 : (activeOpts.length <= 5 ? 2 : 1);
    const raw = [];
    for (let r = 0; r < repeat; r++) {
      for (const opt of activeOpts) {
        raw.push({ option: opt, weight: ((weightsById[opt.id] || 0) / totalW) / repeat });
      }
    }
    let cursor = 0;
    return raw.map((item, idx) => {
      const span = item.weight * TWO_PI;
      const sec = {
        index: idx,
        optionId: item.option.id,
        option: item.option,
        startAngle: cursor,
        endAngle: idx === raw.length - 1 ? TWO_PI : cursor + span,
        weight: item.weight
      };
      cursor += span;
      return sec;
    });
  }

  function getWheelSectors(forEmpId = null, excludeEmpId = null) {
    const opts = state.options;
    const effectiveExclude = excludeEmpId !== null
      ? excludeEmpId
      : (forEmpId !== null && hasPendingFirstSpin(forEmpId) ? Number(forEmpId) : null);

    if (state.mode === 'equal') {
      return buildEqualSectors(opts);
    }

    if (state.mode === 'area_balanced') {
      const model = computeEquityModel(state.options, state.employees, state.assignments, state.pendingSpins, effectiveExclude);
      const emp = forEmpId !== null ? state.employees.find(e => e.id === Number(forEmpId)) : null;
      if (emp && model.byArea[emp.area] && model.byArea[emp.area].pending > 0) {
        return buildWeightedSectors(opts, model.byArea[emp.area].weightsById);
      }
      return buildWeightedSectors(opts, model.globalWeightsById);
    }

    // Legacy 'balanced' mode (global custom quotas)
    const counts = getAssignedCountsMap(effectiveExclude, true);
    const remaining = {};
    let totalRem = 0;
    opts.forEach(o => {
      const q = Math.max(1, Number(state.quotas[o.id]) || 1);
      const rem = Math.max(0, q - (counts[o.id] || 0));
      remaining[o.id] = rem;
      totalRem += rem;
    });

    if (totalRem <= 0) return buildEqualSectors(opts);
    return buildWeightedSectors(opts, remaining);
  }

  function getOptionProbabilitiesMap(forEmpId = null, excludeEmpId = null) {
    const probs = {};
    state.options.forEach(o => { probs[o.id] = 0; });
    const effectiveExclude = excludeEmpId !== null
      ? excludeEmpId
      : (forEmpId !== null && hasPendingFirstSpin(forEmpId) ? Number(forEmpId) : null);

    if (state.mode === 'area_balanced') {
      const model = computeEquityModel(state.options, state.employees, state.assignments, state.pendingSpins, effectiveExclude);
      const emp = forEmpId !== null ? state.employees.find(e => e.id === Number(forEmpId)) : null;
      if (emp && model.byArea[emp.area]) {
        const areaInfo = model.byArea[emp.area];
        if (areaInfo.pending > 0) {
          state.options.forEach(o => { probs[o.id] = areaInfo.probsById[o.id] || 0; });
          return probs;
        }
        // Area is 100% completed: probabilities for this area are 0%
        return probs;
      }
    }

    const sectors = getWheelSectors(forEmpId, effectiveExclude);
    for (const s of sectors) {
      probs[s.optionId] = (probs[s.optionId] || 0) + s.weight;
    }
    return probs;
  }

  function normalizeAngle(rad) {
    return ((rad % TWO_PI) + TWO_PI) % TWO_PI;
  }

  function getSectorAtWheelAngle(angle, sectors) {
    const localAngle = normalizeAngle(POINTER_SCREEN_ANGLE - angle);
    for (let i = 0; i < sectors.length; i++) {
      const s = sectors[i];
      if (localAngle >= s.startAngle && localAngle < s.endAngle) return s;
    }
    return sectors[sectors.length - 1];
  }

  function pickWinningSector(sectors, emp = null, excludeEmpId = null) {
    if (emp) {
      const guaranteedOpt = getGuaranteedOptionForEmployee(emp, state.options);
      if (guaranteedOpt) {
        const matching = sectors.filter(s => String(s.optionId) === String(guaranteedOpt.id));
        if (matching.length > 0) {
          return matching[cryptoRandomInt(matching.length)];
        }
      }

      if (state.mode === 'area_balanced') {
        const eff = getEffectiveSpinWeightsForEmployee(
          emp,
          state.options,
          state.employees,
          state.assignments,
          state.pendingSpins,
          excludeEmpId
        );
        const countByOpt = {};
        for (const s of sectors) countByOpt[s.optionId] = (countByOpt[s.optionId] || 0) + 1;
        const secWeights = sectors.map(s => {
          const w = eff.weightsById[s.optionId] || 0;
          const n = countByOpt[s.optionId] || 1;
          return w > 1e-9 ? (w / n) : 0;
        });
        const totalW = secWeights.reduce((a, b) => a + b, 0);
        if (totalW > 1e-9) {
          const r = cryptoRandomFloat() * totalW;
          let acc = 0;
          for (let i = 0; i < sectors.length; i++) {
            acc += secWeights[i];
            if (r < acc && secWeights[i] > 0) return sectors[i];
          }
          for (let i = sectors.length - 1; i >= 0; i--) {
            if (secWeights[i] > 0) return sectors[i];
          }
        }
      } else if (state.mode === 'balanced') {
        const counts = getAssignedCountsMap(excludeEmpId, true);
        for (const other of state.employees) {
          if (Number(other.id) === Number(emp.id)) continue;
          if (state.assignments[other.id] || (state.pendingSpins && state.pendingSpins[other.id])) continue;
          const og = getGuaranteedOptionForEmployee(other, state.options);
          if (og && counts[og.id] !== undefined) counts[og.id]++;
        }
        const countByOpt = {};
        for (const s of sectors) countByOpt[s.optionId] = (countByOpt[s.optionId] || 0) + 1;
        const secWeights = sectors.map(s => {
          const q = Math.max(1, Number(state.quotas[s.optionId]) || 1);
          const rem = Math.max(0, q - (counts[s.optionId] || 0));
          return rem > 0 ? (rem / (countByOpt[s.optionId] || 1)) : 0;
        });
        const totalW = secWeights.reduce((a, b) => a + b, 0);
        if (totalW > 1e-9) {
          const r = cryptoRandomFloat() * totalW;
          let acc = 0;
          for (let i = 0; i < sectors.length; i++) {
            acc += secWeights[i];
            if (r < acc && secWeights[i] > 0) return sectors[i];
          }
        }
      }
    }

    if (state.mode === 'equal') return sectors[cryptoRandomInt(sectors.length)];
    const r = cryptoRandomFloat();
    let acc = 0;
    for (const s of sectors) {
      acc += s.weight;
      if (r < acc) return s;
    }
    return sectors[sectors.length - 1];
  }

  // =========================================================================
  // 6. WEB AUDIO SYNTHESIS
  // =========================================================================
  function ensureAudio() {
    if (!state.soundOn) return null;
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTick(speedFactor = 1) {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620 + Math.min(1, speedFactor) * 280, now);
      osc.frequency.exponentialRampToValueAtTime(190, now + 0.032);
      gain.gain.setValueAtTime(0.085, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.036);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (_) {}
  }

  function playWinChime() {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t0 = now + i * 0.075;
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.11, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.58);
      });
    } catch (_) {}
  }

  function playManualAlertTone() {
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 392].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        const t0 = now + i * 0.11;
        osc.frequency.setValueAtTime(freq, t0);
        gain.gain.setValueAtTime(0.001, t0);
        gain.gain.linearRampToValueAtTime(0.08, t0 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.18);
      });
    } catch (_) {}
  }

  // =========================================================================
  // 7. PURE-JS NATIVE MICROSOFT EXCEL (.xlsx) GENERATOR (Dynamic Dates + Manual Tag)
  // =========================================================================
  const CRC32_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c >>> 0;
    }
    return t;
  })();

  function crc32(bytes) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) c = CRC32_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function xmlEscape(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function colLetter(idx0) {
    let n = idx0 + 1;
    let s = '';
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  function cellStr(ref, value, styleIdx = 2) {
    return `<c r="${ref}" t="inlineStr" s="${styleIdx}"><is><t>${xmlEscape(value)}</t></is></c>`;
  }

  function cellNum(ref, num, styleIdx = 3) {
    return `<c r="${ref}" s="${styleIdx}"><v>${Number(num)}</v></c>`;
  }

  function cellFormula(ref, formula, cachedValue, styleIdx = 3) {
    return `<c r="${ref}" s="${styleIdx}"><f>${xmlEscape(formula)}</f><v>${cachedValue}</v></c>`;
  }

  function buildZipStore(entries) {
    const encoder = new TextEncoder();
    const now = new Date();
    const dosTime = ((now.getHours() & 0x1F) << 11) | ((now.getMinutes() & 0x3F) << 5) | ((now.getSeconds() >> 1) & 0x1F);
    const dosDate = (((Math.max(1980, now.getFullYear()) - 1980) & 0x7F) << 9) | (((now.getMonth() + 1) & 0x0F) << 5) | (now.getDate() & 0x1F);

    const localParts = [];
    const centralParts = [];
    let offset = 0;

    for (const entry of entries) {
      const nameBytes = encoder.encode(entry.name);
      const dataBytes = typeof entry.content === 'string' ? encoder.encode(entry.content) : entry.content;
      const crc = crc32(dataBytes);
      const size = dataBytes.length;

      const local = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034B50, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 0x0800, true);
      lv.setUint16(8, 0, true);
      lv.setUint16(10, dosTime, true);
      lv.setUint16(12, dosDate, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      local.set(nameBytes, 30);

      localParts.push(local, dataBytes);

      const central = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014B50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, dosTime, true);
      cv.setUint16(14, dosDate, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, size, true);
      cv.setUint32(24, size, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      central.set(nameBytes, 46);

      centralParts.push(central);
      offset += local.length + dataBytes.length;
    }

    const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054B50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, centralSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    const out = new Uint8Array(offset + centralSize + eocd.length);
    let pos = 0;
    for (const p of localParts) { out.set(p, pos); pos += p.length; }
    for (const p of centralParts) { out.set(p, pos); pos += p.length; }
    out.set(eocd, pos);
    return out;
  }

  function formatDateTimeEs(val) {
    if (!val) return '';
    if (/^\d{2}\/\d{2}\/\d{4}/.test(String(val))) return String(val);
    try {
      const d = new Date(val);
      if (Number.isNaN(d.getTime())) return String(val);
      return d.toLocaleString('es-CO', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (_) {
      return String(val);
    }
  }

  function getUniqueAreas() {
    const seen = [];
    for (const e of state.employees) {
      if (!seen.includes(e.area)) seen.push(e.area);
    }
    return seen;
  }

  function formatStatusLabel(rec) {
    if (!rec) return 'Pendiente';
    if (rec.isManual) {
      return rec.manualReason ? `Manual (sin ruleta) — ${rec.manualReason}` : 'Manual (sin ruleta)';
    }
    if (rec.spinCount === 2) return 'Asignado (Tiro 2/2)';
    if (rec.spinCount === 1) return 'Asignado (Tiro 1/2)';
    return 'Asignado';
  }

  function generateXlsxBytes() {
    const emps = state.employees;
    const opts = state.options;
    const exclusiveOpts = getExclusiveAssignedOptions();
    const summaryOpts = [...opts, ...exclusiveOpts];
    const totalEmps = emps.length;
    const assignedCount = Object.keys(state.assignments).length;
    const generatedAt = formatDateTimeEs(new Date().toISOString());
    const eqPct = formatPct(1 / Math.max(1, opts.length));
    const equityModel = computeEquityModel();
    const modeDesc = state.mode === 'area_balanced'
      ? `Reglas estrictas por área (${opts.length} fechas en ruleta · Recepción 1 · Camareras 2/1 · Bar 3/2 · Producción 3 · Mantenimiento 2/1 · Hasta 2 tiros)`
      : (state.mode === 'balanced'
          ? `Cupos globales (${opts.map(o => state.quotas[o.id] || 0).join(' / ')})`
          : `Azar libre (${eqPct} cada fecha)`);

    // Stylesheet indices:
    // 0: default | 1: title | 2: body left | 3: body center
    // 4..11: 8 curated date pill styles
    // 12: pending pill | 13: subtitle | 14: table header | 15: total center | 16: total left | 17: percent | 18: exclusive header
    const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="12">
    <font><sz val="10"/><color rgb="FF1F2937"/><name val="Calibri"/></font>
    <font><b/><sz val="13"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF14532D"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF7F1D1D"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF78350F"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF0C4A6E"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF134E4A"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF7C2D12"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF1E3A8A"/><name val="Calibri"/></font>
    <font><b/><sz val="10"/><color rgb="FF365314"/><name val="Calibri"/></font>
    <font><i/><sz val="10"/><color rgb="FF4B5563"/><name val="Calibri"/></font>
  </fonts>
  <fills count="15">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF14532D"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF166534"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDCFCE7"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEE2E2"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFEF3C7"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFE0F2FE"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFCCFBF1"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFEDD5"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFDBEAFE"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFECFCCB"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF3F4F6"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFECFDF5"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF9A3412"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD1D5DB"/></left>
      <right style="thin"><color rgb="FFD1D5DB"/></right>
      <top style="thin"><color rgb="FFD1D5DB"/></top>
      <bottom style="thin"><color rgb="FFD1D5DB"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="19">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="4" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="5" fillId="6" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="6" fillId="7" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="7" fillId="8" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="8" fillId="9" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="9" fillId="10" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="10" fillId="11" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="11" fillId="12" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="11" fillId="13" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
    <xf numFmtId="10" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
    <xf numFmtId="0" fontId="2" fillId="14" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

    const firstDataRow = 4;
    const lastDataRow = Math.max(firstDataRow, firstDataRow + totalEmps - 1);
    const formulaEndRow = Math.max(250, lastDataRow + 50);

    const s1Rows = [
      `<row r="1" ht="28" customHeight="1">${cellStr('A1', 'QUIRAMA — SORTEO DE DESCANSOS FIN DE AÑO 2026', 1)}</row>`,
      `<row r="2" ht="20" customHeight="1">${cellStr('A2', `Generado: ${generatedAt}  |  Asignados: ${assignedCount} de ${totalEmps}  |  Modo: ${modeDesc}`, 13)}</row>`,
      `<row r="3" ht="24" customHeight="1">${['N°', 'Área', 'Colaborador', 'Fecha de Descanso', 'Días de Descanso', 'Estado', 'Fecha y Hora del Registro'].map((h, i) => cellStr(colLetter(i) + '3', h, 14)).join('')}</row>`
    ];

    emps.forEach((emp, idx) => {
      const r = firstDataRow + idx;
      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      const statusStyle = !opt ? 12 : (rec.isManual ? 6 : 4);
      s1Rows.push(
        `<row r="${r}" ht="20" customHeight="1">` +
        cellNum(`A${r}`, emp.id, 3) +
        cellStr(`B${r}`, emp.area, 2) +
        cellStr(`C${r}`, emp.name, 2) +
        cellStr(`D${r}`, opt ? opt.label : 'Pendiente', opt ? opt.xlsxStyleIndex : 12) +
        cellStr(`E${r}`, opt ? opt.days : '—', 3) +
        cellStr(`F${r}`, opt ? formatStatusLabel(rec) : 'Pendiente', statusStyle) +
        cellStr(`G${r}`, rec ? formatDateTimeEs(rec.timestamp) : '', 3) +
        `</row>`
      );
    });

    const sheet1Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView tabSelected="1" workbookViewId="0"><pane ySplit="3" topLeftCell="A4" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="6" customWidth="1"/>
    <col min="2" max="2" width="28" customWidth="1"/>
    <col min="3" max="3" width="38" customWidth="1"/>
    <col min="4" max="4" width="30" customWidth="1"/>
    <col min="5" max="5" width="28" customWidth="1"/>
    <col min="6" max="6" width="38" customWidth="1"/>
    <col min="7" max="7" width="23" customWidth="1"/>
  </cols>
  <sheetData>${s1Rows.join('')}</sheetData>
  <autoFilter ref="A3:G${lastDataRow}"/>
  <mergeCells count="2"><mergeCell ref="A1:G1"/><mergeCell ref="A2:G2"/></mergeCells>
</worksheet>`;

    // ---- SHEET 2: Dynamic Summary by Area (4 roulette dates + exclusive manual dates if any) ----
    const areas = getUniqueAreas();
    const exclusiveHeaderSet = new Set(exclusiveOpts.map(o => o.label));
    const s2Headers = ['Área', ...summaryOpts.map(o => o.label), 'Pendiente', 'Total'];
    const totalCols = s2Headers.length;
    const lastColL = colLetter(totalCols - 1);
    const lastSumColL = colLetter(totalCols - 2);
    const s2Subtitle = exclusiveOpts.length > 0
      ? 'Fórmulas vinculadas a "Descansos Quirama" · Reglas por área en 4 fechas de ruleta (columnas naranjas = fechas manuales exclusivas fuera de ruleta)'
      : 'Fórmulas vinculadas automáticamente a la hoja "Descansos Quirama"';

    const s2Rows = [
      `<row r="1" ht="28" customHeight="1">${cellStr('A1', 'RESUMEN DE DESCANSOS POR ÁREA Y FECHA — QUIRAMA 2026', 1)}</row>`,
      `<row r="2" ht="20" customHeight="1">${cellStr('A2', s2Subtitle, 13)}</row>`,
      `<row r="3" ht="28" customHeight="1">${s2Headers.map((h, i) => cellStr(colLetter(i) + '3', h, exclusiveHeaderSet.has(h) ? 18 : 14)).join('')}</row>`
    ];

    const areaStartRow = 4;
    const areaEndRow = areaStartRow + areas.length - 1;
    const colTotals = Array(totalCols - 1).fill(0);
    const rangeArea = `'Descansos Quirama'!$B$${firstDataRow}:$B$${formulaEndRow}`;
    const rangeDate = `'Descansos Quirama'!$D$${firstDataRow}:$D$${formulaEndRow}`;

    areas.forEach((area, idx) => {
      const r = areaStartRow + idx;
      const areaEmps = emps.filter(e => e.area === area);
      const vals = summaryOpts.map(o => areaEmps.filter(e => {
        const rec = state.assignments[e.id];
        if (!rec) return false;
        const resolved = resolveAssignedOption(rec);
        return resolved && resolved.label.toLowerCase() === o.label.toLowerCase();
      }).length);
      vals.push(areaEmps.filter(e => !state.assignments[e.id]).length);
      const ct = areaEmps.length;
      vals.forEach((v, k) => colTotals[k] += v);
      colTotals[totalCols - 2] += ct;

      s2Rows.push(
        `<row r="${r}" ht="20" customHeight="1">` +
        cellStr(`A${r}`, area, 2) +
        vals.map((v, k) => {
          const col = colLetter(k + 1);
          return cellFormula(`${col}${r}`, `COUNTIFS(${rangeArea},$A${r},${rangeDate},${col}$3)`, v, 3);
        }).join('') +
        cellFormula(`${lastColL}${r}`, `SUM(B${r}:${lastSumColL}${r})`, ct, 15) +
        `</row>`
      );
    });

    const totalRow = areaEndRow + 1;
    s2Rows.push(
      `<row r="${totalRow}" ht="23" customHeight="1">` +
      cellStr(`A${totalRow}`, 'TOTAL GENERAL', 16) +
      colTotals.map((v, k) => {
        const col = colLetter(k + 1);
        return cellFormula(`${col}${totalRow}`, `SUM(${col}${areaStartRow}:${col}${areaEndRow})`, v, 15);
      }).join('') +
      `</row>`
    );

    const pctRow = totalRow + 1;
    s2Rows.push(
      `<row r="${pctRow}" ht="20" customHeight="1">` +
      cellStr(`A${pctRow}`, '% del total de colaboradores', 2) +
      colTotals.map((v, k) => {
        const col = colLetter(k + 1);
        const pct = totalEmps > 0 ? (v / totalEmps) : 0;
        return cellFormula(`${col}${pctRow}`, `IF($${lastColL}$${totalRow}>0,${col}${totalRow}/$${lastColL}$${totalRow},0)`, pct.toFixed(4), 17);
      }).join('') +
      `</row>`
    );

    const sheet2Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"/></sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="30" customWidth="1"/>
    <col min="2" max="${totalCols - 1}" width="22" customWidth="1"/>
    <col min="${totalCols}" max="${totalCols}" width="12" customWidth="1"/>
  </cols>
  <sheetData>${s2Rows.join('')}</sheetData>
  <mergeCells count="2"><mergeCell ref="A1:${lastColL}1"/><mergeCell ref="A2:${lastColL}2"/></mergeCells>
</worksheet>`;

    // ---- SHEET 3: Chronological History ----
    const s3Rows = [
      `<row r="1" ht="28" customHeight="1">${cellStr('A1', 'HISTORIAL CRONOLÓGICO DE REGISTROS — RULETA QUIRAMA 2026', 1)}</row>`,
      `<row r="2" ht="24" customHeight="1">${['Registro #', 'Fecha y Hora', 'Colaborador', 'Área', 'Fecha Asignada', 'Origen / Modo'].map((h, i) => cellStr(colLetter(i) + '2', h, 14)).join('')}</row>`
    ];
    state.history.forEach((item, idx) => {
      const r = 3 + idx;
      const opt = resolveAssignedOption({ optionId: item.optionId, optionLabel: item.optionLabel });
      const label = opt ? opt.label : (item.optionLabel || '—');
      const isMan = Boolean(item.isManual || item.mode === 'manual');
      const modeText = item.modeText || (isMan
        ? (item.manualReason ? `Manual (sin ruleta) — ${item.manualReason}` : 'Manual (sin ruleta)')
        : (item.mode === 'area_balanced'
            ? 'Equitativo por área y fecha'
            : (item.mode === 'balanced' ? 'Cupos globales' : `Azar libre (${eqPct})`)));
      s3Rows.push(
        `<row r="${r}" ht="20" customHeight="1">` +
        cellNum(`A${r}`, item.order || (idx + 1), 3) +
        cellStr(`B${r}`, formatDateTimeEs(item.timestamp), 3) +
        cellStr(`C${r}`, item.name, 2) +
        cellStr(`D${r}`, item.area, 2) +
        cellStr(`E${r}`, label, opt ? opt.xlsxStyleIndex : 2) +
        cellStr(`F${r}`, modeText, isMan ? 6 : 3) +
        `</row>`
      );
    });

    const sheet3Xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0"><pane ySplit="2" topLeftCell="A3" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="20"/>
  <cols>
    <col min="1" max="1" width="11" customWidth="1"/>
    <col min="2" max="2" width="23" customWidth="1"/>
    <col min="3" max="3" width="38" customWidth="1"/>
    <col min="4" max="4" width="28" customWidth="1"/>
    <col min="5" max="5" width="30" customWidth="1"/>
    <col min="6" max="6" width="40" customWidth="1"/>
  </cols>
  <sheetData>${s3Rows.join('')}</sheetData>
  <mergeCells count="1"><mergeCell ref="A1:F1"/></mergeCells>
</worksheet>`;

    return buildZipStore([
      {
        name: '[Content_Types].xml',
        content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet3.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
      },
      {
        name: '_rels/.rels',
        content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
      },
      {
        name: 'xl/workbook.xml',
        content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Descansos Quirama" sheetId="1" r:id="rId1"/>
    <sheet name="Resumen por Área" sheetId="2" r:id="rId2"/>
    <sheet name="Historial de Giros" sheetId="3" r:id="rId3"/>
  </sheets>
</workbook>`
      },
      {
        name: 'xl/_rels/workbook.xml.rels',
        content: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet3.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
      },
      { name: 'xl/styles.xml', content: stylesXml },
      { name: 'xl/worksheets/sheet1.xml', content: sheet1Xml },
      { name: 'xl/worksheets/sheet2.xml', content: sheet2Xml },
      { name: 'xl/worksheets/sheet3.xml', content: sheet3Xml }
    ]);
  }

  function downloadXlsx(silent = false) {
    const bytes = generateXlsxBytes();
    const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Descansos_Quirama_FinDeAno_2026.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    if (!silent) showToast('Excel descargado: Descansos_Quirama_FinDeAno_2026.xlsx', '✓');
  }

  function downloadCsv() {
    const headers = ['N°', 'Área', 'Colaborador', 'Fecha de Descanso', 'Días', 'Estado', 'Fecha y Hora'];
    const rows = [headers];
    state.employees.forEach((emp) => {
      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      rows.push([
        String(emp.id),
        emp.area,
        emp.name,
        opt ? opt.label : 'Pendiente',
        opt ? opt.days : '',
        opt ? formatStatusLabel(rec) : 'Pendiente',
        rec ? formatDateTimeEs(rec.timestamp) : ''
      ]);
    });
    const csv = '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Descansos_Quirama_FinDeAno_2026.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('Archivo CSV descargado', '✓');
  }

  async function copyText(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg, '✓');
    } catch (_) {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast(successMsg, '✓');
    }
  }

  function copyForExcel() {
    const headers = ['N°', 'Área', 'Colaborador', 'Fecha de Descanso', 'Días', 'Estado', 'Hora'];
    const lines = [headers.join('\t')];
    state.employees.forEach((emp) => {
      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      lines.push([
        emp.id,
        emp.area,
        emp.name,
        opt ? opt.label : 'Pendiente',
        opt ? opt.days : '',
        opt ? formatStatusLabel(rec) : 'Pendiente',
        rec ? formatDateTimeEs(rec.timestamp) : ''
      ].join('\t'));
    });
    copyText(lines.join('\n'), 'Tabla copiada. Pega directo en Excel o Sheets (Ctrl+V)');
  }

  // =========================================================================
  // 8. CANVAS WHEEL RENDERING & CONFETTI
  // =========================================================================
  const wheelCanvas = document.getElementById('wheelCanvas');
  const wCtx = wheelCanvas.getContext('2d');

  function setupWheelCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = Math.min(390, Math.max(280, window.innerWidth - 56));
    wheelCanvas.style.width = cssSize + 'px';
    wheelCanvas.style.height = cssSize + 'px';
    wheelCanvas.width = Math.round(cssSize * dpr);
    wheelCanvas.height = Math.round(cssSize * dpr);
    wCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    wheelFrameCache.key = '';
    wheelDiscCache.key = '';
    drawWheel();
  }

  function getWheelFrameCanvas(size, dpr, dark) {
    const key = `${size}|${dpr}|${dark ? 1 : 0}`;
    if (wheelFrameCache.key === key && wheelFrameCache.canvas) {
      return wheelFrameCache.canvas;
    }
    const off = document.createElement('canvas');
    off.width = Math.round(size * dpr);
    off.height = Math.round(size * dpr);
    const ctx = off.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size / 2;
    const cy = size / 2 + 6;
    const outerR = size * 0.455;
    const wheelR = outerR - 12;

    // Fast radial-gradient drop shadow (zero blur-filter overhead at 60 FPS)
    const shadowGrad = ctx.createRadialGradient(cx, cy + 5, outerR * 0.86, cx, cy + 5, outerR + 11);
    shadowGrad.addColorStop(0, dark ? 'rgba(0, 0, 0, 0.46)' : 'rgba(16, 24, 20, 0.16)');
    shadowGrad.addColorStop(0.75, dark ? 'rgba(0, 0, 0, 0.22)' : 'rgba(16, 24, 20, 0.08)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(cx, cy + 5, outerR + 11, 0, TWO_PI);
    ctx.fillStyle = shadowGrad;
    ctx.fill();

    const rimGrad = ctx.createLinearGradient(cx - outerR, cy - outerR, cx + outerR, cy + outerR);
    if (dark) {
      rimGrad.addColorStop(0, '#e8ce89');
      rimGrad.addColorStop(0.5, '#a98130');
      rimGrad.addColorStop(1, '#5e4312');
    } else {
      rimGrad.addColorStop(0, '#f3e1b0');
      rimGrad.addColorStop(0.45, '#c99e44');
      rimGrad.addColorStop(1, '#8c651d');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, TWO_PI);
    ctx.fillStyle = rimGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, wheelR + 2.5, 0, TWO_PI);
    ctx.fillStyle = '#181c1a';
    ctx.fill();

    wheelFrameCache = { key, canvas: off };
    return off;
  }

  function getWheelDiscCanvas(sectors, size, dpr) {
    const secSig = sectors
      .map(s => `${s.optionId}:${s.option.colorMain}:${s.option.wheelTop}:${s.option.wheelBottom}:${s.startAngle.toFixed(4)}`)
      .join('|');
    const key = `${size}|${dpr}|${secSig}`;
    if (wheelDiscCache.key === key && wheelDiscCache.canvas) {
      return wheelDiscCache.canvas;
    }

    const off = document.createElement('canvas');
    off.width = Math.round(size * dpr);
    off.height = Math.round(size * dpr);
    const ctx = off.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const half = size / 2;
    const outerR = size * 0.455;
    const wheelR = outerR - 12;

    ctx.save();
    ctx.translate(half, half);

    for (const sec of sectors) {
      const opt = sec.option;
      const midAngle = (sec.startAngle + sec.endAngle) / 2;
      const span = sec.endAngle - sec.startAngle;

      const sliceGrad = ctx.createRadialGradient(0, 0, 26, 0, 0, wheelR);
      sliceGrad.addColorStop(0, opt.colorDark);
      sliceGrad.addColorStop(0.58, opt.colorMain);
      sliceGrad.addColorStop(1, opt.colorLight);

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelR, sec.startAngle, sec.endAngle);
      ctx.closePath();
      ctx.fillStyle = sliceGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 248, 225, 0.42)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      if (span > 0.22) {
        ctx.save();
        ctx.rotate(midAngle);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 3;

        const textR = wheelR - 17;
        const scale = size / 390;
        const fTop = Math.round((span < 0.5 ? 11.5 : 13.5) * scale);
        const fBot = Math.round((span < 0.5 ? 9 : 10) * scale);

        if (opt.wheelBottom) {
          ctx.font = `700 ${fTop}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          ctx.fillText(opt.wheelTop, textR, -6.5 * scale);
          ctx.font = `600 ${fBot}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(opt.wheelBottom, textR, 7.5 * scale);
        } else {
          ctx.font = `700 ${fTop}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          ctx.fillText(opt.wheelTop, textR, 0);
        }
        ctx.restore();
      }
    }

    ctx.beginPath();
    ctx.arc(0, 0, 44 * (size / 390), 0, TWO_PI);
    ctx.strokeStyle = 'rgba(243, 225, 176, 0.65)';
    ctx.lineWidth = 2;
    ctx.stroke();

    for (const sec of sectors) {
      const px = Math.cos(sec.startAngle) * (wheelR + 5.5);
      const py = Math.sin(sec.startAngle) * (wheelR + 5.5);
      ctx.beginPath();
      ctx.arc(px, py, 3.5, 0, TWO_PI);
      ctx.fillStyle = '#fff3cf';
      ctx.fill();
      ctx.strokeStyle = '#6c4d14';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    ctx.restore();
    wheelDiscCache = { key, canvas: off };
    return off;
  }

  function drawWheel(overrideSectors = null) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = wheelCanvas.width / dpr;
    const cx = size / 2;
    const cy = size / 2 + 6;
    const outerR = size * 0.455;
    const dark = isDarkTheme();

    const sectors = Array.isArray(overrideSectors) && overrideSectors.length > 0
      ? overrideSectors
      : getWheelSectors(selectedPersonId);

    const frameCanvas = getWheelFrameCanvas(size, dpr, dark);
    const discCanvas = getWheelDiscCanvas(sectors, size, dpr);

    wCtx.clearRect(0, 0, size, size);
    wCtx.drawImage(frameCanvas, 0, 0, size, size);

    wCtx.save();
    wCtx.translate(cx, cy);
    wCtx.rotate(wheelAngle);
    wCtx.drawImage(discCanvas, -size / 2, -size / 2, size, size);
    wCtx.restore();

    wCtx.save();
    wCtx.translate(cx, cy - outerR - 4);
    wCtx.rotate(pointerDeflection);

    wCtx.beginPath();
    wCtx.moveTo(-12, -2);
    wCtx.lineTo(12, -2);
    wCtx.lineTo(0, 26);
    wCtx.closePath();
    const ptrGrad = wCtx.createLinearGradient(-12, 0, 12, 24);
    ptrGrad.addColorStop(0, '#fef08a');
    ptrGrad.addColorStop(0.5, '#d97706');
    ptrGrad.addColorStop(1, '#92400e');
    wCtx.fillStyle = ptrGrad;
    wCtx.fill();
    wCtx.strokeStyle = '#ffffff';
    wCtx.lineWidth = 1.6;
    wCtx.stroke();

    wCtx.beginPath();
    wCtx.arc(0, 2, 4.5, 0, TWO_PI);
    wCtx.fillStyle = '#1f2937';
    wCtx.fill();
    wCtx.strokeStyle = '#fde68a';
    wCtx.lineWidth = 1.4;
    wCtx.stroke();
    wCtx.restore();
  }

  const confettiCanvas = document.getElementById('confettiCanvas');
  const cCtx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiRaf = null;

  function launchConfetti(accentHex) {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    const palette = [accentHex, '#f59e0b', '#16a34a', '#e5c67a', '#ffffff', '#0284c7'];
    const originX = window.innerWidth * 0.55;
    const originY = Math.min(340, window.innerHeight * 0.4);

    confettiParticles = Array.from({ length: 42 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 4.5 + Math.random() * 7.5;
      return {
        x: originX + (Math.random() - 0.5) * 60,
        y: originY + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 5 + Math.random() * 5,
        color: palette[Math.floor(Math.random() * palette.length)],
        rot: Math.random() * TWO_PI,
        vrot: (Math.random() - 0.5) * 0.28,
        life: 1
      };
    });

    if (confettiRaf) cancelAnimationFrame(confettiRaf);
    function step() {
      cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      let alive = 0;
      for (const p of confettiParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.24;
        p.vx *= 0.986;
        p.rot += p.vrot;
        p.life -= 0.022;
        if (p.life > 0) {
          alive++;
          cCtx.save();
          cCtx.globalAlpha = Math.max(0, p.life);
          cCtx.translate(p.x, p.y);
          cCtx.rotate(p.rot);
          cCtx.fillStyle = p.color;
          cCtx.fillRect(-p.size / 2, -p.size * 0.35, p.size, p.size * 0.7);
          cCtx.restore();
        }
      }
      if (alive > 0) {
        confettiRaf = requestAnimationFrame(step);
      } else {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiRaf = null;
      }
    }
    confettiRaf = requestAnimationFrame(step);
  }

  // =========================================================================
  // 9. SPIN (UP TO 2 SPINS WITH CONFIRMATION) & MANUAL ASSIGNMENT ORCHESTRATION
  // =========================================================================
  async function spinWheel() {
    if (isSpinning) return;
    let emp = state.employees.find(e => e.id === selectedPersonId);
    if (!emp) {
      showToast('Primero selecciona a la persona que va a girar', '!');
      return;
    }

    if (hasPendingFirstSpin(emp.id)) {
      openSpinDecisionModal(emp.id);
      return;
    }

    if (!canSpinRoulette(emp.id)) {
      const msg = isPreRegisteredLocked(emp.id)
        ? `🔒 ${emp.name} tiene su descanso manual pre-registrado y bloqueado.`
        : `🔒 ${emp.name} ya completó su turno definitivo en la ruleta (máx. ${MAX_SPINS_PER_PERSON} tiros).`;
      showToast(msg, '🔒');
      return;
    }

    // Only pause to sync before spinning if we haven't synced recently (>8s) and have no local writes queued;
    // Drive v7 still validates quotas & duplicates atomically on save.
    const needsFreshSync = Boolean(
      syncUrl &&
      pendingDriveWritesCount === 0 &&
      (!lastSyncAt || (Date.now() - lastSyncAt.getTime()) > 8000)
    );
    if (needsFreshSync) {
      isSpinning = true;
      updateSpinButtons();
      document.getElementById('btnSpinText').textContent = 'Verificando...';
      await syncFromDrive({ silent: true });
      isSpinning = false;
      emp = state.employees.find(e => e.id === selectedPersonId);
      updateSpinButtons();
      if (!emp) return;
      if (hasPendingFirstSpin(emp.id)) {
        openSpinDecisionModal(emp.id);
        return;
      }
      if (!canSpinRoulette(emp.id)) {
        const existingOpt = state.assignments[emp.id] ? resolveAssignedOption(state.assignments[emp.id]) : null;
        showToast(
          `🔒 ${emp.name} ya completó su turno desde otro dispositivo${existingOpt ? ' (' + existingOpt.shortLabel + ')' : ''}.`,
          '🔒'
        );
        return;
      }
    }

    executeSpin(emp, { spinNumber: 1, firstSpinOption: null });
  }

  function executeSpin(emp, { spinNumber = 1, firstSpinOption = null } = {}) {
    ensureAudio();
    isSpinning = true;
    document.getElementById('resultBanner').classList.add('hidden');
    updateSpinButtons();

    const excludeEmpId = spinNumber === 2 ? emp.id : null;
    let sectors = getWheelSectors(emp.id, excludeEmpId);
    const guaranteedOpt = getGuaranteedOptionForEmployee(emp, state.options);
    if (guaranteedOpt && !sectors.some(s => String(s.optionId) === String(guaranteedOpt.id))) {
      sectors = buildEqualSectors(state.options);
    }
    const winningSector = pickWinningSector(sectors, emp, excludeEmpId);

    const u = 0.18 + cryptoRandomFloat() * 0.64;
    const targetLocalAngle = winningSector.startAngle + u * (winningSector.endAngle - winningSector.startAngle);
    const desiredMod = normalizeAngle(POINTER_SCREEN_ANGLE - targetLocalAngle);
    const currentMod = normalizeAngle(wheelAngle);
    const deltaMod = normalizeAngle(desiredMod - currentMod);
    const extraTurns = 5 + cryptoRandomInt(3);

    const startAngle = wheelAngle;
    const totalDelta = extraTurns * TWO_PI + deltaMod;
    const duration = 3400 + cryptoRandomInt(450);
    const startTime = performance.now();

    // Warm the offscreen disc cache before frame 1 so animation starts at locked 60 FPS
    drawWheel(sectors);

    let lastSectorIdx = getSectorAtWheelAngle(wheelAngle, sectors).index;
    const liveTicker = document.getElementById('liveTicker');
    liveTicker.innerHTML = `<span>Girando tiro ${spinNumber} de ${MAX_SPINS_PER_PERSON}...</span>`;

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3.6);
      const prevAngle = wheelAngle;
      wheelAngle = startAngle + totalDelta * eased;

      const speed = Math.abs(wheelAngle - prevAngle);
      const curSector = getSectorAtWheelAngle(wheelAngle, sectors);
      if (curSector.index !== lastSectorIdx) {
        lastSectorIdx = curSector.index;
        playTick(speed * 18);
        pointerDeflection = -Math.min(0.42, 0.16 + speed * 1.4);
        pointerVelocity = 0;
        liveTicker.innerHTML = `<span class="date-dot" style="background:${curSector.option.colorMain};"></span><span>${xmlEscape(curSector.option.label)}</span>`;
      }

      pointerVelocity += (-pointerDeflection * 0.28);
      pointerVelocity *= 0.72;
      pointerDeflection += pointerVelocity;

      drawWheel(sectors);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        wheelAngle = normalizeAngle(startAngle + totalDelta);
        pointerDeflection = 0;
        drawWheel(sectors);
        if (spinNumber === 1) {
          handleFirstSpinResult(emp, winningSector.option);
        } else {
          const pendingRec = state.pendingSpins && state.pendingSpins[emp.id];
          commitAssignment(emp, winningSector.option, {
            forceOverwrite: false,
            isManual: false,
            manualReason: '',
            spinNumber: 2,
            firstSpinOption: firstSpinOption || (pendingRec ? resolveAssignedOption(pendingRec) : null),
            firstSpinTimestamp: pendingRec ? pendingRec.timestamp : ''
          });
        }
      }
    }

    requestAnimationFrame(animate);
  }

  function handleFirstSpinResult(emp, option) {
    isSpinning = false;
    const nowIso = new Date().toISOString();

    playWinChime();
    launchConfetti(option.colorMain);

    if (!state.pendingSpins) state.pendingSpins = {};
    state.pendingSpins[emp.id] = {
      optionId: option.id,
      optionLabel: option.label,
      optionDays: option.days,
      timestamp: nowIso,
      mode: state.mode,
      spinCount: 1
    };
    saveState();

    document.getElementById('liveTicker').innerHTML =
      `<span class="date-dot" style="background:${option.colorMain};"></span><strong style="color:var(--text);">1.er tiro: ${xmlEscape(option.label)} · Esperando confirmación</strong>`;

    // Show the decision modal IMMEDIATELY (0ms lag) while Drive reserves the 1st spin in the background
    renderAll();
    openSpinDecisionModal(emp.id);

    if (syncUrl && remoteScriptVersion >= 4) {
      const token = `${emp.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      provisionalTokenByEmp[emp.id] = token;
      delete provisionalAbortedEmp[emp.id];

      postToDrive({
        action: 'recordSpin',
        empId: emp.id,
        optionId: option.id,
        optionLabel: option.label,
        optionDays: option.days,
        optionBg: option.pillBg,
        optionFg: option.pillText,
        colorIndex: option.colorIndex,
        mode: state.mode,
        isManual: false,
        spinNumber: 1,
        provisional: true
      }).then((res) => {
        // Ignore stale Spin 1 results if the user already discarded it for Spin 2
        if (provisionalTokenByEmp[emp.id] !== token) return;
        if (res && res.quotaConflict) {
          provisionalAbortedEmp[emp.id] = true;
          delete state.pendingSpins[emp.id];
          if (state.assignments[emp.id] && !state.assignments[emp.id].isManual && state.assignments[emp.id].spinCount === 1) {
            delete state.assignments[emp.id];
          }
          saveState();
          if (activeDecisionEmpId === emp.id) {
            activeDecisionEmpId = null;
            closeModal('modalSpinDecision');
          }
          if (lastShownResultEmpId === emp.id) {
            document.getElementById('resultBanner').classList.add('hidden');
          }
          document.getElementById('liveTicker').textContent = 'Cupo actualizado · Gira nuevamente';
          renderAll();
          showToast(res.error || '⚠️ Esa fecha acaba de completar su cupo equitativo en otro dispositivo. Gira nuevamente.', '⚠️');
          return;
        }
        if (res && res.conflict) {
          provisionalAbortedEmp[emp.id] = true;
          delete state.pendingSpins[emp.id];
          saveState();
          if (activeDecisionEmpId === emp.id) {
            activeDecisionEmpId = null;
            closeModal('modalSpinDecision');
          }
          renderAll();
          showToast(res.error || `🔒 ${emp.name} ya completó su turno en otro dispositivo.`, '🔒');
        }
      });
    }
  }

  function openSpinDecisionModal(empId) {
    const emp = state.employees.find(e => e.id === Number(empId));
    const pending = state.pendingSpins && state.pendingSpins[Number(empId)];
    if (!emp || !pending) return;
    const opt = resolveAssignedOption(pending);
    if (!opt) return;

    activeDecisionEmpId = emp.id;
    selectedPersonId = emp.id;

    document.getElementById('decisionPersonName').textContent = emp.name;
    document.getElementById('decisionPersonArea').textContent = emp.area;

    const card = document.getElementById('decisionDateCard');
    card.style.background = opt.pillBg;
    card.style.borderColor = opt.colorMain;
    card.style.color = opt.pillText;
    document.getElementById('decisionDateDot').style.background = opt.colorMain;
    document.getElementById('decisionDateLabel').textContent = opt.label;
    document.getElementById('decisionDateDays').textContent = opt.days;

    // Check if only 1 option remains available for this area on a potential 2nd spin
    const probsSecond = getOptionProbabilitiesMap(emp.id, emp.id);
    const availableCount = state.options.filter(o => (probsSecond[o.id] || 0) > 1e-6).length;
    const singleHint = document.getElementById('decisionSingleOptionHint');
    if (availableCount <= 1) {
      singleHint.textContent = `Nota: actualmente solo queda esta fecha con cupo disponible para ${emp.area}, por lo que un 2.º tiro volvería a caer en la misma fecha.`;
      singleHint.classList.remove('hidden');
    } else {
      singleHint.classList.add('hidden');
    }

    const btnKeep = document.getElementById('btnKeepFirstSpin');
    const btnSecond = document.getElementById('btnTakeSecondSpin');
    btnKeep.disabled = false;
    btnSecond.disabled = false;
    btnKeep.querySelector('span').textContent = '✓ Conservar esta fecha (Definitivo)';
    btnSecond.querySelector('span').textContent = '↻ Girar 2.ª y última vez';

    openModal('modalSpinDecision');
  }

  async function confirmKeepFirstSpin() {
    const empId = activeDecisionEmpId || selectedPersonId;
    const emp = state.employees.find(e => e.id === Number(empId));
    const pending = state.pendingSpins && state.pendingSpins[Number(empId)];
    if (!emp || !pending) {
      closeModal('modalSpinDecision');
      return;
    }
    const opt = resolveAssignedOption(pending);
    if (!opt) {
      closeModal('modalSpinDecision');
      return;
    }

    // Legacy fallback only when connected to Apps Script < v7 (v7 enforces quota atomically on the server)
    if (syncUrl && remoteScriptVersion < 7) {
      const btnKeep = document.getElementById('btnKeepFirstSpin');
      const btnSecond = document.getElementById('btnTakeSecondSpin');
      btnKeep.disabled = true;
      btnSecond.disabled = true;
      btnKeep.querySelector('span').textContent = 'Confirmando...';
      await syncFromDrive({ silent: true });
      if (state.assignments[emp.id]) {
        delete state.pendingSpins[emp.id];
        saveState();
        activeDecisionEmpId = null;
        closeModal('modalSpinDecision');
        renderAll();
        showToast(`🔒 ${emp.name} ya fue confirmado desde otro dispositivo.`, '🔒');
        return;
      }
      if (state.mode === 'area_balanced') {
        const eff = getEffectiveSpinWeightsForEmployee(emp, state.options, state.employees, state.assignments, state.pendingSpins, emp.id);
        const optCap = eff.ruleMaxCapById ? eff.ruleMaxCapById[opt.id] : null;
        const hitsCap = optCap !== null && optCap !== undefined && (eff.countsById[opt.id] || 0) >= optCap;
        if (hitsCap || (eff.pending > 0 && (eff.weightsById[opt.id] || 0) <= 1e-9)) {
          delete state.pendingSpins[emp.id];
          saveState();
          activeDecisionEmpId = null;
          closeModal('modalSpinDecision');
          renderAll();
          showToast('⚠️ Mientras decidías, esa fecha completó su cupo equitativo en otro dispositivo. Gira nuevamente.', '⚠️');
          return;
        }
      }
    }

    activeDecisionEmpId = null;
    closeModal('modalSpinDecision');

    commitAssignment(emp, opt, {
      forceOverwrite: false,
      isManual: false,
      manualReason: '',
      spinNumber: 1,
      confirmProvisional: true,
      firstSpinTimestamp: pending.timestamp
    });
  }

  function startSecondAndFinalSpin() {
    const empId = activeDecisionEmpId || selectedPersonId;
    const emp = state.employees.find(e => e.id === Number(empId));
    const pending = state.pendingSpins && state.pendingSpins[Number(empId)];
    if (!emp || !pending) {
      closeModal('modalSpinDecision');
      return;
    }
    const firstSpinOption = resolveAssignedOption(pending);

    // Supersede Spin 1 provisional token so any late quotaConflict on Spin 1 won't affect Spin 2
    provisionalTokenByEmp[emp.id] = `spin2_${Date.now()}`;
    delete provisionalAbortedEmp[emp.id];

    activeDecisionEmpId = null;
    closeModal('modalSpinDecision');

    // Start 2nd spin immediately (0ms lag); Drive queue ensures Spin 1 completes before Spin 2 writes
    executeSpin(emp, { spinNumber: 2, firstSpinOption });
  }

  function renderResultBanner(emp, option, { isManual = false, manualReason = '', spinNumber = 1, savedMsg = '', canUndoManual = false } = {}) {
    lastShownResultEmpId = emp.id;
    const banner = document.getElementById('resultBanner');
    banner.classList.toggle('manual', Boolean(isManual));
    document.getElementById('btnResultUndo').classList.toggle('hidden', !canUndoManual);
    document.getElementById('resultSavedNote').textContent = savedMsg;
    document.getElementById('resultWinnerName').textContent = `${emp.name} · ${emp.area}`;
    const pill = document.getElementById('resultDatePill');
    pill.textContent = isManual
      ? `Manual: ${option.label}`
      : `Definitivo (Tiro ${spinNumber}/${MAX_SPINS_PER_PERSON}): ${option.label}`;
    pill.style.background = option.pillBg;
    pill.style.color = option.pillText;
    const reasonSuffix = isManual && manualReason ? ` · Motivo: ${manualReason}` : '';
    document.getElementById('resultDaysText').textContent = `${option.days}${reasonSuffix}`;
    banner.classList.remove('hidden');

    document.getElementById('liveTicker').innerHTML = isManual
      ? `<span class="manual-badge">⚠️ Manual (sin ruleta)</span><strong style="color:var(--text);">${xmlEscape(option.label)}</strong>`
      : `<span class="date-dot" style="background:${option.colorMain};"></span><strong style="color:var(--text);">Definitivo (Tiro ${spinNumber}/${MAX_SPINS_PER_PERSON}): ${xmlEscape(option.label)}</strong>`;
  }

  async function commitAssignment(
    emp,
    option,
    {
      forceOverwrite = false,
      isManual = false,
      manualReason = '',
      spinNumber = 1,
      confirmProvisional = false,
      firstSpinOption = null,
      firstSpinTimestamp = ''
    } = {}
  ) {
    isSpinning = false;
    const nowIso = new Date().toISOString();
    const prevAssignment = state.assignments[emp.id] ? { ...state.assignments[emp.id] } : null;
    const prevPending = state.pendingSpins && state.pendingSpins[emp.id] ? { ...state.pendingSpins[emp.id] } : null;

    // Hard safeguard: never overwrite an already finalized turn unless explicitly manual
    if (!isManual && !canSpinRoulette(emp.id)) {
      renderAll();
      showToast(`🔒 ${emp.name} ya completó su turno definitivo (máx. ${MAX_SPINS_PER_PERSON} tiros).`, '🔒');
      return;
    }

    const wasPreRegistered = Boolean(isManual && (prevAssignment && prevAssignment.isPreRegistered || PRE_REGISTERED_BY_ID[emp.id]));
    const modeDescBase = state.mode === 'area_balanced'
      ? 'Equitativo por área y fecha'
      : (state.mode === 'balanced' ? 'Cupos globales' : 'Azar libre');

    state.assignments[emp.id] = {
      optionId: option.id,
      optionLabel: option.label,
      optionDays: option.days,
      timestamp: nowIso,
      mode: isManual ? 'manual' : state.mode,
      isManual: Boolean(isManual),
      isPreRegistered: wasPreRegistered,
      exclusiveManual: Boolean(option.exclusiveManual),
      manualReason: String(manualReason || '').trim(),
      spinCount: isManual ? 0 : spinNumber,
      firstSpinOptionId: !isManual && spinNumber === 2 && firstSpinOption ? firstSpinOption.id : '',
      firstSpinLabel: !isManual && spinNumber === 2 && firstSpinOption ? firstSpinOption.label : '',
      finalized: true
    };
    if (state.pendingSpins && state.pendingSpins[emp.id]) {
      delete state.pendingSpins[emp.id];
    }

    const addedHistoryOrders = [];
    if (!isManual && spinNumber === 2 && firstSpinOption) {
      const discardedItem = {
        order: state.history.length + 1,
        empId: emp.id,
        name: emp.name,
        area: emp.area,
        optionId: firstSpinOption.id,
        optionLabel: firstSpinOption.label,
        timestamp: firstSpinTimestamp || nowIso,
        mode: state.mode,
        isManual: false,
        spinNumber: 1,
        spinOutcome: 'discarded',
        modeText: `${modeDescBase} · Tiro 1/2 (Descartado)`
      };
      state.history.push(discardedItem);
      addedHistoryOrders.push(discardedItem.order);
    }

    const histModeText = isManual
      ? (manualReason ? `Manual (sin ruleta) — ${String(manualReason).trim()}` : 'Manual (sin ruleta)')
      : (spinNumber === 2
          ? `${modeDescBase} · Tiro 2/2 (Definitivo)`
          : `${modeDescBase} · Tiro 1/2 (Conservado)`);

    const histItem = {
      order: state.history.length + 1,
      empId: emp.id,
      name: emp.name,
      area: emp.area,
      optionId: option.id,
      optionLabel: option.label,
      timestamp: nowIso,
      mode: isManual ? 'manual' : state.mode,
      isManual: Boolean(isManual),
      manualReason: String(manualReason || '').trim(),
      spinNumber: isManual ? 0 : spinNumber,
      spinOutcome: isManual ? 'manual' : (spinNumber === 2 ? 'second_final' : 'kept'),
      modeText: histModeText
    };
    state.history.push(histItem);
    addedHistoryOrders.push(histItem.order);
    saveState();

    const canUndoManual = Boolean(isManual && !wasPreRegistered && (!prevAssignment || prevAssignment.isManual));
    lastFlashedId = emp.id;
    lastSpinRecord = canUndoManual ? { empId: emp.id, prevAssignment, histOrder: histItem.order, isManual: true } : null;

    if (isManual) {
      playManualAlertTone();
      showToast(`⚠️ Asignación manual a ${emp.name} (NO se tiró la ruleta)`, '⚠️');
    } else if (!confirmProvisional) {
      playWinChime();
      launchConfetti(option.colorMain);
    }

    const localSavedMsg = isManual
      ? (syncUrl ? '⚠️ Guardando asignación manual en Google Drive...' : '⚠️ ASIGNACIÓN MANUAL — No se giró la ruleta (guardado en el registro)')
      : (syncUrl
          ? (spinNumber === 2
              ? `Definitivo (2.º tiro${firstSpinOption ? ', reemplazó a ' + firstSpinOption.shortLabel : ''}) · Sincronizando con Drive...`
              : 'Definitivo (1.er tiro conservado) · Sincronizando con Drive...')
          : (spinNumber === 2
              ? `Resultado definitivo del 2.º y último tiro${firstSpinOption ? ' (reemplazó a ' + firstSpinOption.shortLabel + ')' : ''} — Turno bloqueado`
              : 'Fecha conservada en el 1.er tiro (definitivo) — Turno bloqueado'));

    // Render result banner, progress, table, and "Siguiente persona" IMMEDIATELY (0ms wait!)
    renderResultBanner(emp, option, { isManual, manualReason, spinNumber, savedMsg: localSavedMsg, canUndoManual });
    if (state.autoDownload) {
      downloadXlsx(true);
    }
    renderAll();

    if (!syncUrl) return;

    // Persist in Google Drive via FIFO background queue without blocking the next coworker
    const drivePayload = (!isManual && confirmProvisional && remoteScriptVersion >= 4)
      ? {
          action: 'confirmSpin',
          empId: emp.id,
          optionId: option.id,
          optionLabel: option.label
        }
      : {
          action: 'recordSpin',
          empId: emp.id,
          optionId: option.id,
          optionLabel: option.label,
          optionDays: option.days,
          optionBg: option.pillBg,
          optionFg: option.pillText,
          colorIndex: option.colorIndex,
          mode: isManual ? 'manual' : state.mode,
          isManual: Boolean(isManual),
          manualReason: String(manualReason || '').trim(),
          forceOverwrite: Boolean(isManual && forceOverwrite),
          spinNumber: isManual ? 0 : spinNumber,
          provisional: false,
          firstSpinOptionId: !isManual && spinNumber === 2 && firstSpinOption ? firstSpinOption.id : '',
          firstSpinLabel: !isManual && spinNumber === 2 && firstSpinOption ? firstSpinOption.label : '',
          firstSpinTimestamp: firstSpinTimestamp || ''
        };

    const res = await enqueueDriveWrite(emp.id, () => {
      if (!isManual && confirmProvisional && provisionalAbortedEmp[emp.id]) {
        delete provisionalAbortedEmp[emp.id];
        return Promise.resolve({ ok: false, skippedAbortedProvisional: true });
      }
      return postToDriveRaw(drivePayload);
    });

    if (!res || res.skippedAbortedProvisional) return;

    const bannerStillForEmp = lastShownResultEmpId === emp.id && !document.getElementById('resultBanner').classList.contains('hidden');

    if (res.quotaConflict) {
      if (!res.state) {
        if (prevAssignment) state.assignments[emp.id] = prevAssignment;
        else delete state.assignments[emp.id];
        if (prevPending && spinNumber === 2) {
          state.pendingSpins[emp.id] = prevPending;
        }
        state.history = state.history.filter(h => !addedHistoryOrders.includes(h.order));
        saveState();
      }
      if (bannerStillForEmp) {
        document.getElementById('resultBanner').classList.add('hidden');
        document.getElementById('liveTicker').textContent = 'Cupo actualizado · Gira nuevamente';
      }
      renderAll();
      showToast(res.error || '⚠️ Esa fecha acaba de completar su cupo equitativo en otro dispositivo. Gira nuevamente.', '⚠️');
      return;
    }

    let finalOption = option;
    let finalSavedMsg = localSavedMsg;

    if (res.conflict) {
      const remoteRec = state.assignments[emp.id];
      finalOption = (res.existingOptionLabel && state.options.find(o => o.label.toLowerCase() === String(res.existingOptionLabel).toLowerCase()))
        || (remoteRec && resolveAssignedOption(remoteRec))
        || getOptionById(res.existingOptionId)
        || option;
      finalSavedMsg = '🔒 Esta persona ya tenía su turno definitivo en Drive — se conservó su resultado original';
      showToast(`🔒 ${emp.name} ya completó su turno (${finalOption.shortLabel}).`, '🔒');
    } else if (res.ok) {
      finalSavedMsg = isManual
        ? '⚠️ ASIGNACIÓN MANUAL (sin girar la ruleta) — Guardado en Google Drive'
        : (spinNumber === 2
            ? `✓ 2.º tiro definitivo guardado en Drive${firstSpinOption ? ' (reemplazó a ' + firstSpinOption.shortLabel + ')' : ''} · Bloqueado`
            : '✓ 1.er tiro conservado y guardado en Google Drive · Turno bloqueado');
    } else if (res.error && String(res.error).includes('inválida')) {
      finalSavedMsg = isManual
        ? '⚠️ ASIGNACIÓN MANUAL (sin ruleta) — Guardado localmente (actualiza Code.gs para sincronizar nuevas fechas)'
        : 'Guardado localmente (actualiza Code.gs en Drive para sincronizar nuevas fechas)';
      showToast('Actualiza Code.gs en Apps Script para guardar fechas nuevas en Drive.', 'ℹ');
    } else {
      finalSavedMsg = isManual
        ? '⚠️ ASIGNACIÓN MANUAL (sin ruleta) — Guardado localmente'
        : 'Guardado localmente (pendiente sincronizar con Drive)';
      showToast('Sin conexión con Drive. Guardado localmente.', '!');
    }

    if (state.autoDownload) finalSavedMsg += ' · Excel descargado';

    if (bannerStillForEmp) {
      renderResultBanner(emp, finalOption, { isManual, manualReason, spinNumber, savedMsg: finalSavedMsg, canUndoManual });
    }
    if (pendingDriveWritesCount === 0 || res.conflict) {
      renderAll();
    }
  }

  function openManualAssignModal(empId = selectedPersonId) {
    if (isSpinning) return;
    const emp = state.employees.find(e => e.id === Number(empId));
    if (!emp) {
      showToast('Primero selecciona un colaborador', '!');
      return;
    }
    selectedPersonId = emp.id;
    document.getElementById('manualPersonName').textContent = emp.name;
    document.getElementById('manualPersonArea').textContent = emp.area;

    const currentRec = state.assignments[emp.id];
    const currentOpt = currentRec ? resolveAssignedOption(currentRec) : null;
    const currentOptId = currentOpt ? currentOpt.id : state.options[0].id;
    document.getElementById('manualReasonInput').value = currentRec && currentRec.manualReason ? currentRec.manualReason : '';

    const eqModel = computeEquityModel();
    const areaInfo = eqModel.byArea[emp.area];

    // Exclusive manual options shown for their designated employees (or if already assigned)
    const modalOptions = [];
    EXCLUSIVE_MANUAL_OPTIONS.forEach(exOpt => {
      if ((Array.isArray(exOpt.exclusiveEmpIds) && exOpt.exclusiveEmpIds.includes(emp.id)) || (currentOpt && currentOpt.id === exOpt.id)) {
        modalOptions.push(exOpt);
      }
    });
    modalOptions.push(...state.options);

    const listEl = document.getElementById('manualOptionsList');
    listEl.innerHTML = modalOptions.map((opt) => {
      if (opt.exclusiveManual) {
        return `
        <label class="manual-option-item">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <input type="radio" name="manualDateOption" value="${xmlEscape(opt.id)}" ${opt.id === currentOptId ? 'checked' : ''} />
            <span class="date-dot" style="background:${opt.colorMain};"></span>
            <div style="min-width:0;">
              <strong style="font-size:13px;display:block;">${xmlEscape(opt.label)}</strong>
              <span style="font-size:11.5px;color:var(--text-muted);display:block;">${xmlEscape(opt.days)}</span>
              <span class="manual-quota-hint"><span class="exclusive-badge">Fecha manual exclusiva · NO aparece en la ruleta</span></span>
            </div>
          </div>
          <span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(opt.shortLabel)}</span>
        </label>`;
      }

      const gCount = eqModel.globalCountsById[opt.id] || 0;
      const gCap = eqModel.globalMaxCapById[opt.id] || eqModel.globalMaxTarget;
      const aCount = areaInfo ? (areaInfo.countsById[opt.id] || 0) : 0;
      const aDateCap = areaInfo && areaInfo.ruleMaxCapById && areaInfo.ruleMaxCapById[opt.id] !== undefined
        ? areaInfo.ruleMaxCapById[opt.id]
        : (areaInfo ? areaInfo.maxTarget : 0);
      const isAlreadyThisOpt = currentRec && String(currentRec.optionId) === String(opt.id);
      const wouldExceedArea = areaInfo && !isAlreadyThisOpt && (aCount + 1 > aDateCap);
      const groupName = areaInfo ? areaInfo.displayGroupLabel : emp.area;
      const quotaHint = `${groupName}: ${aCount}/${aDateCap} · General: ${gCount}/${gCap}`;
      const warnLabel = areaInfo && areaInfo.hasCustomRule && wouldExceedArea
        ? `⚠️ Supera regla de máx. ${aDateCap} en ${groupName}`
        : '⚠️ Supera cupo equitativo';
      const warnTag = wouldExceedArea
        ? `<span class="manual-quota-warn">${warnLabel}</span>`
        : '';

      return `
      <label class="manual-option-item">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <input type="radio" name="manualDateOption" value="${xmlEscape(opt.id)}" ${opt.id === currentOptId ? 'checked' : ''} />
          <span class="date-dot" style="background:${opt.colorMain};"></span>
          <div style="min-width:0;">
            <strong style="font-size:13px;display:block;">${xmlEscape(opt.label)}</strong>
            <span style="font-size:11.5px;color:var(--text-muted);display:block;">${xmlEscape(opt.days)}</span>
            <span class="manual-quota-hint tabular">${xmlEscape(quotaHint)} ${warnTag}</span>
          </div>
        </div>
        <span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(opt.shortLabel)}</span>
      </label>`;
    }).join('');

    renderEmployeeList();
    renderActivePerson();
    openModal('modalManualAssign');
  }

  // =========================================================================
  // 10. DATE MANAGER MODAL (Edit / Add / Delete Dates)
  // =========================================================================
  function openManageDatesModal() {
    if (isSpinning) return;
    draftDates = state.options.map(o => ({
      id: o.id,
      originalLabel: o.label,
      label: o.label,
      days: o.days === '—' ? '' : o.days,
      seasonTag: o.seasonTag === 'Descanso' ? '' : o.seasonTag,
      colorIndex: o.colorIndex
    }));
    renderDatesEditor();
    openModal('modalManageDates');
  }

  function renderDatesEditor() {
    const counts = getAssignedCountsMap();
    const listEl = document.getElementById('datesEditorList');
    const previewEl = document.getElementById('manageDatesProbPreview');
    const warnEl = document.getElementById('manageDatesWarning');

    const k = Math.max(1, draftDates.length);
    const eqPct = formatPct(1 / k);
    previewEl.textContent = state.mode === 'area_balanced'
      ? `${draftDates.length} fechas activas · Reglas por área (Recepción 1 · Camareras 2/1 · Bar 3/2 · Producción 3 · Mantenimiento 2/1)`
      : `${draftDates.length} fechas activas · Probabilidad base: ${eqPct} cada una`;

    // Check if any originally assigned non-pre-registered option was deleted in draft
    const draftIds = new Set(draftDates.map(d => d.id));
    const affectedCount = state.options
      .filter(o => !draftIds.has(o.id))
      .reduce((sum, o) => {
        const nonPre = Object.entries(state.assignments || {}).filter(([empId, rec]) =>
          rec && String(rec.optionId) === String(o.id) && !rec.isPreRegistered && !PRE_REGISTERED_BY_ID[Number(empId)]
        ).length;
        return sum + nonPre;
      }, 0);

    if (affectedCount > 0) {
      warnEl.textContent = `⚠️ Eliminaste una fecha que ya tenía ${affectedCount} colaborador(es) sorteado(s). Al guardar, esas personas volverán a estado Pendiente (los pre-registrados manuales se conservan intactos).`;
      warnEl.classList.remove('hidden');
    } else {
      warnEl.classList.add('hidden');
    }

    listEl.innerHTML = draftDates.map((d, idx) => {
      const assignedNum = counts[d.id] || 0;
      const swatches = COLOR_PALETTE.map((pal, cIdx) =>
        `<button type="button" class="swatch-btn ${d.colorIndex === cIdx ? 'active' : ''}" data-date-idx="${idx}" data-color-idx="${cIdx}" style="background:${pal.colorMain};" title="${pal.name}" aria-label="Color ${pal.name}"></button>`
      ).join('');

      return `
        <div class="date-edit-card" data-card-idx="${idx}">
          <div class="date-edit-top">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <strong style="font-size:12px;color:var(--text-muted);">Opción #${idx + 1}</strong>
              <div class="swatch-row">${swatches}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              ${assignedNum > 0 ? `<span class="date-assigned-tag tabular">${assignedNum} asignado${assignedNum === 1 ? '' : 's'}</span>` : ''}
              <button type="button" class="link-btn danger btn-remove-date" data-date-idx="${idx}" ${draftDates.length <= 2 ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>Eliminar</button>
            </div>
          </div>
          <div class="date-edit-fields">
            <div>
              <label class="label">Nombre de la fecha *</label>
              <input type="text" class="input date-field-label" data-date-idx="${idx}" value="${xmlEscape(d.label)}" placeholder="Ej. 03 y 04 de enero" required />
            </div>
            <div>
              <label class="label">Días / detalle (opcional)</label>
              <input type="text" class="input date-field-days" data-date-idx="${idx}" value="${xmlEscape(d.days)}" placeholder="Ej. Dom 03 – Lun 04 Ene" />
            </div>
            <div>
              <label class="label">Etiqueta (opcional)</label>
              <input type="text" class="input date-field-tag" data-date-idx="${idx}" value="${xmlEscape(d.seasonTag)}" placeholder="Ej. Reyes" />
            </div>
          </div>
        </div>`;
    }).join('');
  }

  async function saveManagedDates() {
    if (draftDates.length < 2) {
      showToast('Debes mantener al menos 2 fechas en la ruleta', '!');
      return;
    }

    const cleaned = [];
    const seenLabels = new Set();
    for (let i = 0; i < draftDates.length; i++) {
      const label = String(draftDates[i].label || '').trim();
      if (!label) {
        showToast(`Completa el nombre de la Opción #${i + 1}`, '!');
        return;
      }
      const key = label.toLowerCase();
      if (seenLabels.has(key)) {
        showToast(`Hay dos fechas repetidas con el nombre "${label}"`, '!');
        return;
      }
      seenLabels.add(key);
      cleaned.push(normalizeOption({
        id: draftDates[i].id,
        label,
        days: draftDates[i].days,
        seasonTag: draftDates[i].seasonTag,
        colorIndex: draftDates[i].colorIndex
      }, i));
    }

    // Build rename & delete maps for Drive synchronization
    const oldOptions = state.options;
    const nextIds = new Set(cleaned.map(o => o.id));
    const renamedMap = {};
    const deletedLabels = [];

    oldOptions.forEach(oldOpt => {
      if (!nextIds.has(oldOpt.id)) {
        deletedLabels.push(oldOpt.label);
      } else {
        const updated = cleaned.find(n => n.id === oldOpt.id);
        if (updated && updated.label.toLowerCase() !== oldOpt.label.toLowerCase()) {
          renamedMap[oldOpt.label.toLowerCase()] = updated.id;
        }
      }
    });

    // Apply locally (always preserve exclusive and pre-registered manual assignments)
    state.options = cleaned;
    for (const [empId, rec] of Object.entries(state.assignments)) {
      if (!nextIds.has(String(rec.optionId)) && !rec.exclusiveManual) {
        if (rec.isPreRegistered || PRE_REGISTERED_BY_ID[Number(empId)]) {
          rec.exclusiveManual = true;
        } else {
          delete state.assignments[empId];
        }
      }
    }
    for (const [empId, pRec] of Object.entries(state.pendingSpins || {})) {
      if (!nextIds.has(String(pRec.optionId))) {
        delete state.pendingSpins[empId];
      }
    }
    const rouletteCount = Math.max(1, state.employees.length - getExclusiveAssignedCount(state.assignments, state.options));
    state.quotas = normalizeQuotas(state.quotas, state.options, rouletteCount);
    saveState();
    closeModal('modalManageDates');
    renderAll();

    if (syncUrl) {
      const res = await postToDrive({
        action: 'updateOptions',
        options: state.options.map(o => ({
          id: o.id,
          label: o.label,
          shortLabel: o.shortLabel,
          days: o.days,
          seasonTag: o.seasonTag,
          colorIndex: o.colorIndex,
          bg: o.pillBg,
          fg: o.pillText
        })),
        renamedMap,
        deletedLabels,
        quotas: state.quotas
      });

      if (res && res.ok) {
        renderAll();
        showToast('Fechas actualizadas y sincronizadas con Google Drive', '✓');
      } else if (res && res.error && String(res.error).includes('desconocida')) {
        showToast('Fechas guardadas aquí. Actualiza Code.gs en Apps Script para sincronizar nuevas fechas con Drive.', 'ℹ');
      } else {
        showToast('Fechas guardadas localmente (no se pudo confirmar con Drive)', '!');
      }
    } else {
      showToast(`Fechas actualizadas (${state.options.length} opciones · ${formatPct(1 / state.options.length)} c/u)`, '✓');
    }
  }

  // =========================================================================
  // 11. UI RENDERING
  // =========================================================================
  function stripAccents(str) {
    return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function populateFilterSelects() {
    const areas = getUniqueAreas();
    const fillArea = (selectEl, currentVal) => {
      selectEl.innerHTML = '<option value="ALL">Todas las áreas</option>' +
        areas.map(a => `<option value="${xmlEscape(a)}">${xmlEscape(a)} (${state.employees.filter(e => e.area === a).length})</option>`).join('');
      selectEl.value = areas.includes(currentVal) ? currentVal : 'ALL';
    };
    fillArea(document.getElementById('areaFilter'), areaFilter);
    fillArea(document.getElementById('tableAreaFilter'), tableAreaFilter);

    const exclusiveOpts = getExclusiveAssignedOptions();
    const dateSel = document.getElementById('tableDateFilter');
    const validIds = new Set(['ALL', 'ASSIGNED', 'PENDING', 'MANUAL', ...state.options.map(o => o.id), ...exclusiveOpts.map(o => o.id)]);
    if (!validIds.has(tableDateFilter)) tableDateFilter = 'ALL';
    dateSel.innerHTML = `
      <option value="ALL">Todas las fechas y pendientes</option>
      <option value="ASSIGNED">Solo asignados</option>
      <option value="PENDING">Solo pendientes</option>
      <option value="MANUAL">Solo asignados manualmente (sin ruleta)</option>
      ${state.options.map(o => `<option value="${xmlEscape(o.id)}">${xmlEscape(o.label)}</option>`).join('')}
      ${exclusiveOpts.map(o => `<option value="${xmlEscape(o.id)}">${xmlEscape(o.label)} (Manual exclusivo)</option>`).join('')}`;
    dateSel.value = tableDateFilter;
  }

  function getFilteredEmployees() {
    const q = stripAccents(searchQuery.trim());
    return state.employees.filter(emp => {
      const isAssigned = Boolean(state.assignments[emp.id]);
      if (statusFilter === 'pending' && isAssigned) return false;
      if (statusFilter === 'assigned' && !isAssigned) return false;
      if (areaFilter !== 'ALL' && emp.area !== areaFilter) return false;
      if (q && !stripAccents(emp.name).includes(q) && !stripAccents(emp.area).includes(q)) return false;
      return true;
    });
  }

  function renderHeaderAndProgress() {
    const total = state.employees.length;
    const assigned = Object.keys(state.assignments).length;
    const pending = total - assigned;
    const pct = total > 0 ? Math.round((assigned / total) * 100) : 0;
    const eqPct = formatPct(1 / Math.max(1, state.options.length));

    document.getElementById('headerTotalPeople').textContent = total;
    document.getElementById('headerModeLabel').textContent = state.mode === 'area_balanced'
      ? `Reglas estrictas por área (${state.options.length} fechas en ruleta)`
      : (state.mode === 'balanced'
          ? `Cupos globales (${state.options.length} fechas)`
          : `Azar libre (${eqPct} por fecha)`);
    document.getElementById('progressCount').textContent = `${assigned} / ${total}`;
    document.getElementById('progressBar').style.width = `${pct}%`;
    document.getElementById('headerAssignedBadge').textContent = assigned;
    document.getElementById('countPendingTab').textContent = pending;
    document.getElementById('countAssignedTab').textContent = assigned;
    document.getElementById('historyCountTab').textContent = state.history.length;

    document.getElementById('soundIcon').textContent = state.soundOn ? '🔊' : '🔇';
    document.getElementById('soundLabel').textContent = state.soundOn ? 'Sonido' : 'Silencio';
    document.getElementById('chkAutoDownload').checked = Boolean(state.autoDownload);
  }

  function renderEmployeeList() {
    document.querySelectorAll('.status-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.status === statusFilter);
    });

    const listEl = document.getElementById('employeeList');
    const filtered = getFilteredEmployees();

    if (filtered.length === 0) {
      const totalPending = state.employees.length - Object.keys(state.assignments).length;
      listEl.innerHTML = `<div style="padding:32px 16px;text-align:center;font-size:12.5px;color:var(--text-muted);">
        ${statusFilter === 'pending' && totalPending === 0
          ? '¡Todos los colaboradores ya tienen su descanso asignado!'
          : 'No se encontraron colaboradores con este filtro.'}
      </div>`;
      return;
    }

    listEl.innerHTML = filtered.map(emp => {
      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      const pendingSpin = !rec && state.pendingSpins ? state.pendingSpins[emp.id] : null;
      const isSelected = emp.id === selectedPersonId;
      let statusPillsHtml = '';
      if (opt) {
        const tagHtml = rec.exclusiveManual
          ? '<span class="exclusive-badge" title="Fecha manual exclusiva (no aparece en la ruleta)">Exclusivo</span>'
          : (rec.isManual ? '<span class="manual-badge" title="Asignado manualmente sin girar la ruleta">Manual</span>' : '');
        statusPillsHtml = `${tagHtml}<span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(opt.shortLabel)}</span>`;
      } else if (pendingSpin) {
        statusPillsHtml = `<span class="pill pill-pending-confirm" title="Tiro 1/2 por confirmar">⏳ Tiro 1/2</span>`;
      } else {
        statusPillsHtml = `<span class="pill ${isSelected ? 'pill-selected' : 'pill-pending'}">${isSelected ? 'Seleccionado' : 'Pendiente'}</span>`;
      }
      return `
        <button type="button" data-emp-id="${emp.id}" class="emp-row ${isSelected ? 'selected' : ''}">
          <div class="emp-info">
            <p class="emp-name truncate">${xmlEscape(emp.name)}</p>
            <p class="emp-area truncate">${xmlEscape(emp.area)}</p>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            ${statusPillsHtml}
          </div>
        </button>`;
    }).join('');
  }

  function renderActivePerson() {
    const emp = state.employees.find(e => e.id === selectedPersonId);
    const nameEl = document.getElementById('activePersonName');
    const areaEl = document.getElementById('activeAreaChip');
    const limitChip = document.getElementById('activeSpinLimitChip');
    const metaEl = document.getElementById('activePersonMeta');
    const badgeWrap = document.getElementById('activeAlreadyAssignedActions');
    const badgeEl = document.getElementById('activeExistingDateBadge');

    limitChip.classList.remove('locked', 'warning');

    if (!emp) {
      nameEl.textContent = 'Selecciona una persona de la lista para comenzar';
      areaEl.classList.add('hidden');
      limitChip.textContent = `Hasta ${MAX_SPINS_PER_PERSON} tiros`;
      metaEl.textContent = 'Haz clic en cualquier nombre pendiente o pulsa "Siguiente" para iniciar su turno.';
      badgeWrap.classList.add('hidden');
    } else {
      nameEl.textContent = emp.name;
      areaEl.textContent = emp.area;
      areaEl.classList.remove('hidden');

      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      const pendingSpin = !rec && state.pendingSpins ? state.pendingSpins[emp.id] : null;
      const pendingOpt = pendingSpin ? resolveAssignedOption(pendingSpin) : null;
      const spunAlready = hasSpunRoulette(emp.id);

      if (rec && opt) {
        if (rec.isManual) {
          limitChip.textContent = rec.isPreRegistered ? '🔒 Pre-registrado' : (spunAlready ? '🔒 Bloqueado' : '🔒 Fecha manual');
          limitChip.classList.add('locked');
          const exclNote = rec.exclusiveManual ? ' · Fecha manual exclusiva (no aparece en la ruleta).' : '';
          const reasonNote = rec.manualReason ? ` · ${rec.manualReason}` : '';
          metaEl.textContent = rec.isPreRegistered
            ? `🔒 Descanso manual pre-registrado y bloqueado como turno completado${reasonNote}.${exclNote}`
            : `⚠️ Asignado manualmente (sin girar la ruleta)${reasonNote}. La ruleta queda bloqueada para esta persona.${exclNote}`;
        } else {
          const used = rec.spinCount === 2 ? 2 : 1;
          limitChip.textContent = `🔒 Finalizado (${used}/${MAX_SPINS_PER_PERSON})`;
          limitChip.classList.add('locked');
          const replacedTxt = used === 2 && rec.firstSpinLabel ? ` · Reemplazó a ${rec.firstSpinLabel}` : '';
          metaEl.textContent = used === 2
            ? `🔒 Realizó sus ${MAX_SPINS_PER_PERSON} tiros permitidos (2.º tiro definitivo${replacedTxt})${rec.timestamp ? ' · ' + formatDateTimeEs(rec.timestamp) : ''}. Turno bloqueado.`
            : `🔒 Conservó la fecha de su 1.er tiro como definitiva${rec.timestamp ? ' (' + formatDateTimeEs(rec.timestamp) + ')' : ''}. Turno bloqueado.`;
        }
        badgeEl.textContent = rec.isManual ? `🔒 ${opt.shortLabel}` : opt.shortLabel;
        badgeEl.style.background = opt.pillBg;
        badgeEl.style.color = opt.pillText;
        badgeWrap.classList.remove('hidden');
      } else if (pendingSpin && pendingOpt) {
        limitChip.textContent = `⏳ Tiro 1/${MAX_SPINS_PER_PERSON} · Confirmar`;
        limitChip.classList.add('warning');
        metaEl.textContent = `Obtuvo ${pendingOpt.label} en su 1.er tiro. Elige si deseas conservarla o girar tu 2.ª y última vez.`;
        badgeEl.textContent = `⏳ ${pendingOpt.shortLabel}`;
        badgeEl.style.background = pendingOpt.pillBg;
        badgeEl.style.color = pendingOpt.pillText;
        badgeWrap.classList.remove('hidden');
      } else if (spunAlready) {
        limitChip.textContent = '🔒 Turno finalizado';
        limitChip.classList.add('locked');
        metaEl.textContent = `🔒 Esta persona ya completó su turno definitivo en la ruleta (máx. ${MAX_SPINS_PER_PERSON} tiros).`;
        badgeWrap.classList.add('hidden');
      } else {
        const eqPct = formatPct(1 / Math.max(1, state.options.length));
        const probs = getOptionProbabilitiesMap(emp.id);
        limitChip.textContent = `Hasta ${MAX_SPINS_PER_PERSON} tiros disponibles`;
        if (state.mode === 'area_balanced') {
          const model = computeEquityModel();
          const areaInfo = model.byArea[emp.area];
          const groupLabel = areaInfo ? areaInfo.displayGroupLabel : emp.area;
          const ruleTxt = areaInfo && areaInfo.ruleLabel
            ? areaInfo.ruleLabel
            : `${areaInfo ? formatRangeTarget(areaInfo.minTarget, areaInfo.maxTarget) : '—'}/fecha`;
          const openCount = state.options.filter(o => (probs[o.id] || 0) > 1e-6).length;
          metaEl.textContent = `Hasta ${MAX_SPINS_PER_PERSON} tiros con confirmación · ${groupLabel}: ${ruleTxt} · ${openCount} ${openCount === 1 ? 'fecha disponible' : 'fechas disponibles'}.`;
        } else if (state.mode === 'balanced') {
          metaEl.textContent = `Hasta ${MAX_SPINS_PER_PERSON} tiros con confirmación · Cupos globales · Probabilidades: ${state.options.map(o => formatPct(probs[o.id] || 0)).join(' · ')}.`;
        } else {
          metaEl.textContent = `Hasta ${MAX_SPINS_PER_PERSON} tiros con confirmación · Azar libre: ${eqPct} para cada una de las ${state.options.length} fechas.`;
        }
        badgeWrap.classList.add('hidden');
      }
    }
    updateSpinButtons();
  }

  function updateSpinButtons() {
    const emp = state.employees.find(e => e.id === selectedPersonId);
    const hasPending = Boolean(emp) && hasPendingFirstSpin(emp.id);
    const canSpin = Boolean(emp) && !isSpinning && (canSpinRoulette(emp.id) || hasPending);
    const btnMain = document.getElementById('btnSpinMain');
    const btnHub = document.getElementById('btnHubSpin');
    const btnText = document.getElementById('btnSpinText');
    const hubTitle = document.getElementById('hubTitle');
    const hubSub = document.getElementById('hubSubtext');

    btnMain.disabled = !canSpin;
    btnHub.disabled = !canSpin;

    if (isSpinning) {
      btnText.textContent = 'Girando...';
      hubTitle.textContent = '...';
      hubSub.textContent = 'Suerte';
    } else if (hasPending) {
      const pRec = state.pendingSpins[emp.id];
      const pOpt = resolveAssignedOption(pRec);
      btnText.textContent = `Decidir Tiro 1/2 (${pOpt ? pOpt.shortLabel : 'Confirmar'})`;
      hubTitle.textContent = 'DECIDIR';
      hubSub.textContent = 'Tiro 1/2';
    } else if (emp && state.assignments[emp.id]) {
      const rec = state.assignments[emp.id];
      if (rec.isManual) {
        btnText.textContent = rec.isPreRegistered ? '🔒 Pre-registrado' : '🔒 Fecha manual';
        hubTitle.textContent = '🔒';
        hubSub.textContent = 'Manual';
      } else {
        const used = rec.spinCount === 2 ? 2 : 1;
        btnText.textContent = `🔒 Definitivo (${used}/${MAX_SPINS_PER_PERSON})`;
        hubTitle.textContent = '🔒';
        hubSub.textContent = `${used}/${MAX_SPINS_PER_PERSON}`;
      }
    } else if (emp && hasSpunRoulette(emp.id)) {
      btnText.textContent = '🔒 Turno finalizado';
      hubTitle.textContent = '🔒';
      hubSub.textContent = 'Listo';
    } else {
      btnText.textContent = 'Girar Ruleta (Tiro 1/2)';
      hubTitle.textContent = 'GIRAR';
      hubSub.textContent = 'Tiro 1/2';
    }
  }

  function renderDateCards() {
    const counts = getAssignedCountsMap();
    const probs = getOptionProbabilitiesMap(selectedPersonId);
    const grid = document.getElementById('dateCardsGrid');
    const eqPct = formatPct(1 / Math.max(1, state.options.length));
    const excludeForView = selectedPersonId !== null && hasPendingFirstSpin(selectedPersonId) ? Number(selectedPersonId) : null;
    const model = computeEquityModel(state.options, state.employees, state.assignments, state.pendingSpins, excludeForView);
    const selectedEmp = state.employees.find(e => e.id === selectedPersonId) || null;
    const selectedAreaInfo = selectedEmp ? model.byArea[selectedEmp.area] : null;

    if (state.mode === 'area_balanced') {
      if (selectedAreaInfo) {
        const groupLabel = selectedAreaInfo.displayGroupLabel;
        const ruleTxt = selectedAreaInfo.ruleLabel
          ? selectedAreaInfo.ruleLabel
          : `${formatRangeTarget(selectedAreaInfo.minTarget, selectedAreaInfo.maxTarget)}/fecha`;
        document.getElementById('dateGridSummaryLabel').textContent =
          `${state.options.length} fechas en ruleta · ${groupLabel}: ${ruleTxt}`;
      } else {
        document.getElementById('dateGridSummaryLabel').textContent =
          `${state.options.length} fechas en ruleta · Reglas estrictas por área`;
      }
    } else if (state.mode === 'balanced') {
      document.getElementById('dateGridSummaryLabel').textContent = `${state.options.length} fechas en la ruleta · Cupos globales`;
    } else {
      document.getElementById('dateGridSummaryLabel').textContent = `${state.options.length} fechas en la ruleta · Azar libre (${eqPct} c/u)`;
    }

    grid.innerHTML = state.options.map((opt) => {
      const probVal = probs[opt.id] || 0;
      const pct = formatPct(probVal);
      const count = counts[opt.id] || 0;
      const isAreaMode = state.mode === 'area_balanced';
      const isFullForArea = isAreaMode && selectedAreaInfo && selectedAreaInfo.pending > 0 && (selectedAreaInfo.weightsById[opt.id] || 0) <= 1e-9;
      const isFullGlobal = state.mode === 'balanced'
        ? count >= (state.quotas[opt.id] || 1)
        : (isAreaMode && !selectedAreaInfo && (model.globalWeightsById[opt.id] || 0) <= 1e-9);

      let areaRowHtml = '';
      if (isAreaMode && selectedAreaInfo) {
        const aCount = selectedAreaInfo.countsById[opt.id] || 0;
        const aMinCap = selectedAreaInfo.minCapById[opt.id];
        const aMaxCap = selectedAreaInfo.maxCapById[opt.id];
        const aCapLabel = aCount >= aMaxCap
          ? String(aMaxCap)
          : formatRangeTarget(Math.min(aMinCap, aMaxCap), aMaxCap);
        const groupLabel = selectedAreaInfo.displayGroupLabel;
        areaRowHtml = `
          <div class="date-area-row">
            <span class="truncate" title="${xmlEscape(groupLabel)}">${xmlEscape(groupLabel)}</span>
            <strong class="tabular">${aCount} / ${aCapLabel}</strong>
          </div>`;
      }

      const globalCap = isAreaMode
        ? ` / ${model.globalMaxCapById[opt.id] || model.globalMaxTarget}`
        : (state.mode === 'balanced' ? ` / ${state.quotas[opt.id] || 1}` : '');

      const topBadge = isFullForArea
        ? `<span class="full-pill" title="Cupo completo para ${xmlEscape(selectedAreaInfo.displayGroupLabel)} en esta fecha">Cupo lleno</span>`
        : `<span class="date-pct tabular">${pct}</span>`;

      return `
        <div class="date-stat-card ${isFullForArea || isFullGlobal ? 'full' : ''}">
          <div class="date-stat-top">
            <span class="date-dot" style="background:${opt.colorMain};"></span>
            ${topBadge}
          </div>
          <div>
            <p class="date-label">${xmlEscape(opt.shortLabel)}</p>
            <p class="date-sub">${xmlEscape(opt.seasonTag)}</p>
          </div>
          ${areaRowHtml}
          <div class="date-footer">
            <span style="color:var(--text-muted);">${isAreaMode && selectedAreaInfo ? 'General' : 'Asignados'}</span>
            <strong class="tabular">${count}${globalCap}</strong>
          </div>
        </div>`;
    }).join('');
  }

  function renderTables() {
    document.querySelectorAll('.table-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tableTab === tableTab);
    });

    document.getElementById('tableRegister').classList.toggle('hidden', tableTab !== 'register');
    document.getElementById('tableSummary').classList.toggle('hidden', tableTab !== 'summary');
    document.getElementById('tableHistory').classList.toggle('hidden', tableTab !== 'history');
    document.getElementById('registerFilterBar').classList.toggle('hidden', tableTab !== 'register');

    // ---- Tab 1: Register ----
    const regBody = document.getElementById('registerTbody');
    const rows = state.employees.filter(emp => {
      const rec = state.assignments[emp.id];
      if (tableAreaFilter !== 'ALL' && emp.area !== tableAreaFilter) return false;
      if (tableDateFilter === 'ASSIGNED' && !rec) return false;
      if (tableDateFilter === 'PENDING' && rec) return false;
      if (tableDateFilter === 'MANUAL' && (!rec || !rec.isManual)) return false;
      if (!['ALL', 'ASSIGNED', 'PENDING', 'MANUAL'].includes(tableDateFilter)) {
        const resolvedOpt = rec ? resolveAssignedOption(rec) : null;
        if (!resolvedOpt || String(resolvedOpt.id) !== String(tableDateFilter)) return false;
      }
      return true;
    });

    if (rows.length === 0) {
      regBody.innerHTML = `<tr><td colspan="7" class="center" style="padding:28px;color:var(--text-muted);">No hay registros para este filtro.</td></tr>`;
    } else {
      regBody.innerHTML = rows.map((emp, idx) => {
        const rec = state.assignments[emp.id];
        const opt = rec ? resolveAssignedOption(rec) : null;
        const pendingSpin = !rec && state.pendingSpins ? state.pendingSpins[emp.id] : null;
        const pendingOpt = pendingSpin ? resolveAssignedOption(pendingSpin) : null;
        const spunAlready = hasSpunRoulette(emp.id);
        const flashClass = emp.id === lastFlashedId ? 'row-flash' : '';
        let actionHtml = '';
        if (rec) {
          const lockLabel = rec.isPreRegistered
            ? '🔒 Manual'
            : (rec.isManual ? '🔒 Manual' : `🔒 ${rec.spinCount === 2 ? '2/2' : '1/2'}`);
          const lockTitle = rec.isPreRegistered
            ? 'Pre-registrado manualmente (bloqueado como turno completado)'
            : (rec.isManual ? 'Asignado manualmente (sin ruleta)' : 'Turno definitivo completado en la ruleta');
          actionHtml = `<span class="locked-tag" title="${lockTitle}">${lockLabel}</span>`;
        } else if (pendingSpin) {
          actionHtml = `<button type="button" data-action="decide" data-emp-id="${emp.id}" class="link-btn">Decidir 1/2</button>`;
        } else if (spunAlready) {
          actionHtml = `<span class="locked-tag" title="Ya completó su turno en la ruleta">🔒 Listo</span>`;
        } else {
          actionHtml = `<button type="button" data-action="select" data-emp-id="${emp.id}" class="link-btn">Seleccionar</button>`;
        }

        let dateCellHtml = `<span style="color:var(--text-muted);font-style:italic;">Pendiente</span>`;
        if (opt) {
          const badgeHtml = rec.exclusiveManual
            ? ` <span class="exclusive-badge" title="${xmlEscape(rec.manualReason || 'Fecha manual exclusiva (NO aparece en la ruleta)')}">★ Manual exclusivo</span>`
            : (rec.isManual
                ? ` <span class="manual-badge" title="${xmlEscape(rec.manualReason || 'Asignación manual sin ruleta')}">⚠️ Manual</span>`
                : (rec.spinCount === 2 ? ` <span class="date-assigned-tag">Tiro 2/2</span>` : ''));
          dateCellHtml = `<span class="pill" style="background:${opt.pillBg};color:${opt.pillText};"><span class="date-dot" style="background:${opt.colorMain};width:7px;height:7px;"></span>${xmlEscape(opt.label)}</span>${badgeHtml}`;
        } else if (pendingOpt) {
          dateCellHtml = `<span class="pill pill-pending-confirm">⏳ ${xmlEscape(pendingOpt.label)} (Por confirmar)</span>`;
        }

        return `
          <tr class="${flashClass}">
            <td class="center tabular" style="color:var(--text-muted);">${idx + 1}</td>
            <td class="nowrap" style="color:var(--text-muted);">${xmlEscape(emp.area)}</td>
            <td style="font-weight:600;">${xmlEscape(emp.name)}</td>
            <td class="nowrap">${dateCellHtml}</td>
            <td class="nowrap" style="color:var(--text-muted);">${opt ? xmlEscape(opt.days) : (pendingOpt ? xmlEscape(pendingOpt.days) : '—')}</td>
            <td class="nowrap tabular" style="color:var(--text-muted);">${rec ? formatDateTimeEs(rec.timestamp) : (pendingSpin ? formatDateTimeEs(pendingSpin.timestamp) : '—')}</td>
            <td class="right nowrap">${actionHtml}</td>
          </tr>`;
      }).join('');
    }
    lastFlashedId = null;

    // ---- Tab 2: Dynamic Summary by Area (4 roulette dates + exclusive manual dates) ----
    const exclusiveOpts = getExclusiveAssignedOptions();
    const summaryCols = [...state.options, ...exclusiveOpts];
    const sumHead = document.getElementById('summaryThead');
    sumHead.innerHTML = `<tr>
      <th>Área (regla en ruleta)</th>
      ${state.options.map(o => `<th class="center">${xmlEscape(o.shortLabel)}</th>`).join('')}
      ${exclusiveOpts.map(o => `<th class="center th-exclusive" title="Fecha manual exclusiva (NO aparece en la ruleta)">${xmlEscape(o.shortLabel)}<span class="area-meta-sub">Manual excl.</span></th>`).join('')}
      <th class="center">Pendientes</th>
      <th class="center">Total</th>
    </tr>`;

    const sumBody = document.getElementById('summaryTbody');
    const areas = getUniqueAreas();
    const k = Math.max(1, state.options.length);
    const numDateCols = summaryCols.length;
    const totals = Array(numDateCols + 2).fill(0);
    const eqModel = computeEquityModel();

    const areaHtml = areas.map(area => {
      const aEmps = state.employees.filter(e => e.area === area);
      const areaModel = eqModel.byArea[area];
      const c = summaryCols.map(o => aEmps.filter(e => {
        const rec = state.assignments[e.id];
        if (!rec) return false;
        const resolved = resolveAssignedOption(rec);
        return resolved && resolved.id === o.id;
      }).length);
      const pend = aEmps.filter(e => !state.assignments[e.id]).length;
      const tot = aEmps.length;
      const ownExcl = areaModel ? areaModel.ownExclusiveAssigned : 0;
      const exclSuffix = ownExcl > 0 ? ` (+${ownExcl} excl.)` : '';
      let metaDesc = '';
      if (stripAccents(area) === 'mantenimiento zonas humedas') {
        metaDesc = `En grupo Mantenimiento${exclSuffix}`;
      } else if (areaModel && areaModel.ruleLabel) {
        const grpNote = areaModel.isGrouped ? ' · con Z. Húmedas' : '';
        metaDesc = `Regla: ${areaModel.ruleLabel}${grpNote}${exclSuffix}`;
      } else {
        const minT = areaModel ? areaModel.minTarget : Math.floor(tot / k);
        const maxT = areaModel ? areaModel.maxTarget : Math.ceil(tot / k);
        metaDesc = pend === 0 && ownExcl > 0
          ? `100% pre-registrado${exclSuffix}`
          : `Meta: ${formatRangeTarget(minT, maxT)} / fecha${exclSuffix}`;
      }

      c.forEach((v, i) => totals[i] += v);
      totals[numDateCols] += pend;
      totals[numDateCols + 1] += tot;
      return `
        <tr>
          <td style="font-weight:600;">
            ${xmlEscape(area)}
            <span class="area-meta-sub">${xmlEscape(metaDesc)}</span>
          </td>
          ${c.map((v, colIdx) => {
            const isExclCol = colIdx >= state.options.length;
            const optObj = summaryCols[colIdx];
            const dateCap = !isExclCol && areaModel && areaModel.ruleMaxCapById
              ? areaModel.ruleMaxCapById[optObj.id]
              : Infinity;
            const groupCountForDate = !isExclCol && areaModel && areaModel.countsById
              ? (areaModel.countsById[optObj.id] || 0)
              : v;
            const overCap = !isExclCol && areaModel && areaModel.hasCustomRule && Number.isFinite(dateCap) && groupCountForDate > dateCap;
            return `<td class="center tabular ${overCap ? 'cell-over-cap' : ''}"${overCap ? ` title="Supera el cupo de ${dateCap} por fecha"` : ''}>${v}</td>`;
          }).join('')}
          <td class="center tabular" style="color:var(--text-muted);">${pend}</td>
          <td class="center tabular" style="font-weight:700;">${tot}</td>
        </tr>`;
    }).join('');

    const totalEmps = totals[numDateCols + 1];
    sumBody.innerHTML = areaHtml + `
      <tr class="total-row">
        <td>
          TOTAL QUIRAMA
          <span class="area-meta-sub">Ruleta: ${eqModel.rouletteTotalEmps} en ${state.options.length} fechas${eqModel.totalExclusiveAssigned > 0 ? ` (+${eqModel.totalExclusiveAssigned} manual excl.)` : ''}</span>
        </td>
        ${totals.slice(0, numDateCols).map((v, colIdx) => {
          const isExclCol = colIdx >= state.options.length;
          const optObj = summaryCols[colIdx];
          const gCap = !isExclCol ? (eqModel.globalMaxCapById[optObj.id] || eqModel.globalMaxTarget) : Infinity;
          return `<td class="center tabular ${!isExclCol && v > gCap ? 'cell-over-cap' : ''}">${v}</td>`;
        }).join('')}
        <td class="center tabular" style="color:var(--text-muted);">${totals[numDateCols]}</td>
        <td class="center tabular">${totalEmps}</td>
      </tr>`;

    // ---- Tab 3: Chronological History ----
    const histBody = document.getElementById('historyTbody');
    if (state.history.length === 0) {
      histBody.innerHTML = `<tr><td colspan="6" class="center" style="padding:28px;color:var(--text-muted);">Aún no se ha realizado ningún registro.</td></tr>`;
    } else {
      histBody.innerHTML = [...state.history].reverse().map(item => {
        const opt = resolveAssignedOption({ optionId: item.optionId, optionLabel: item.optionLabel });
        const label = opt ? opt.label : (item.optionLabel || '—');
        const isMan = Boolean(item.isManual || item.mode === 'manual');
        const fallbackModeText = item.mode === 'area_balanced'
          ? 'Equitativo por área'
          : (item.mode === 'balanced' ? 'Cupos globales' : 'Azar libre');
        const displayMode = item.modeText || fallbackModeText;
        const modeBadge = isMan
          ? `<span class="manual-badge">⚠️ ${xmlEscape(item.modeText || (item.manualReason ? `Manual (sin ruleta) · ${item.manualReason}` : 'Manual (sin ruleta)'))}</span>`
          : `<span style="color:var(--text-muted);">${xmlEscape(displayMode)}</span>`;
        return `
          <tr>
            <td class="center tabular" style="font-weight:700;color:var(--text-muted);">#${item.order}</td>
            <td class="nowrap tabular" style="color:var(--text-muted);">${formatDateTimeEs(item.timestamp)}</td>
            <td style="font-weight:600;">${xmlEscape(item.name)}</td>
            <td style="color:var(--text-muted);">${xmlEscape(item.area)}</td>
            <td class="nowrap">
              ${opt
                ? `<span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(label)}</span>`
                : `<span class="pill pill-pending">${xmlEscape(label)}</span>`
              }
            </td>
            <td class="nowrap">${modeBadge}</td>
          </tr>`;
      }).join('');
    }
  }

  function renderAll() {
    populateFilterSelects();
    renderHeaderAndProgress();
    renderEmployeeList();
    renderActivePerson();
    renderDateCards();
    renderTables();
    renderSyncUi();
    drawWheel();
  }

  // =========================================================================
  // 12. MODALS, SELECTION & HELPERS
  // =========================================================================
  let toastTimer = null;
  function showToast(message, icon = '✓') {
    const toast = document.getElementById('toast');
    document.getElementById('toastIcon').textContent = icon;
    document.getElementById('toastText').textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3800);
  }

  let confirmCallback = null;
  function openConfirm(title, message, onConfirm) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = onConfirm;
    document.getElementById('modalConfirm').classList.remove('hidden');
  }

  function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
  }

  function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
  }

  function selectPerson(empId) {
    if (isSpinning) return;
    selectedPersonId = Number(empId);
    renderEmployeeList();
    renderActivePerson();
    renderDateCards();
    drawWheel();
  }

  function pickNextPending() {
    if (isSpinning) return;
    const pendingVisible = getFilteredEmployees().filter(e => !state.assignments[e.id]);
    const pool = pendingVisible.length > 0 ? pendingVisible : state.employees.filter(e => !state.assignments[e.id]);
    if (pool.length === 0) {
      showToast('¡Todos los colaboradores ya fueron sorteados!', '★');
      return;
    }
    const curIdx = pool.findIndex(e => e.id === selectedPersonId);
    const next = pool[(curIdx + 1) % pool.length];
    selectPerson(next.id);
    document.getElementById('resultBanner').classList.add('hidden');
    const row = document.querySelector(`[data-emp-id="${next.id}"]`);
    if (row) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function pickRandomPending() {
    if (isSpinning) return;
    const pendingVisible = getFilteredEmployees().filter(e => !state.assignments[e.id]);
    const pool = pendingVisible.length > 0 ? pendingVisible : state.employees.filter(e => !state.assignments[e.id]);
    if (pool.length === 0) {
      showToast('¡Todos los colaboradores ya fueron sorteados!', '★');
      return;
    }
    const chosen = pool[cryptoRandomInt(pool.length)];
    selectPerson(chosen.id);
    document.getElementById('resultBanner').classList.add('hidden');
    const row = document.querySelector(`[data-emp-id="${chosen.id}"]`);
    if (row) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    showToast(`Seleccionado al azar: ${chosen.name}`, '🎲');
  }

  function openDriveModal() {
    document.getElementById('inputSyncUrl').value = syncUrl;
    renderSyncUi();
    openModal('modalDriveSync');
  }

  function renderQuotaInputs(quotasObj) {
    const wrap = document.getElementById('quotaInputsWrap');
    wrap.innerHTML = state.options.map(o => `
      <label class="quota-item">
        <span class="truncate" title="${xmlEscape(o.label)}">${xmlEscape(o.shortLabel)}</span>
        <input type="number" class="input tabular quota-input" data-opt-id="${xmlEscape(o.id)}" min="1" max="200" value="${quotasObj[o.id] || 1}" />
      </label>`).join('');
  }

  function updateAdminClearButton() {
    const sel = document.getElementById('adminManualEmpSelect');
    const clearWrap = document.getElementById('adminClearWrap');
    if (!sel || !clearWrap) return;
    const empId = Number(sel.value);
    const rec = state.assignments[empId];
    const canClear = Boolean(rec && rec.isManual && !isPreRegisteredLocked(empId) && !hasSpunRoulette(empId));
    clearWrap.classList.toggle('hidden', !canClear);
  }

  function renderAdminManualSelector() {
    const sel = document.getElementById('adminManualEmpSelect');
    if (!sel) return;
    sel.innerHTML = state.employees.map(emp => {
      const rec = state.assignments[emp.id];
      const opt = rec ? resolveAssignedOption(rec) : null;
      const statusTxt = opt ? (rec.isManual ? `Manual: ${opt.shortLabel}` : opt.shortLabel) : 'Pendiente';
      return `<option value="${emp.id}">[${xmlEscape(emp.area)}] ${xmlEscape(emp.name)} — ${xmlEscape(statusTxt)}</option>`;
    }).join('');
    if (selectedPersonId && state.employees.some(e => e.id === selectedPersonId)) {
      sel.value = String(selectedPersonId);
    }
    updateAdminClearButton();
  }

  function getRouletteSpunEmployees() {
    return state.employees.filter(emp => {
      if (isPreRegisteredLocked(emp.id)) return false;
      const rec = state.assignments[emp.id];
      if (rec) {
        return !rec.isManual && rec.mode !== 'manual';
      }
      if (state.pendingSpins && state.pendingSpins[emp.id]) return true;
      return hasSpunRoulette(emp.id);
    });
  }

  function renderAdminDeleteSpinSelector() {
    const sel = document.getElementById('adminDeleteSpinSelect');
    const btn = document.getElementById('btnAdminDeleteSpin');
    if (!sel || !btn) return;
    const spunEmps = getRouletteSpunEmployees();
    if (spunEmps.length === 0) {
      sel.innerHTML = '<option value="">No hay tiros de ruleta registrados aún</option>';
      sel.disabled = true;
      btn.disabled = true;
      return;
    }
    sel.disabled = false;
    btn.disabled = false;
    sel.innerHTML = spunEmps.map(emp => {
      const rec = state.assignments[emp.id];
      const pend = !rec && state.pendingSpins ? state.pendingSpins[emp.id] : null;
      const opt = rec ? resolveAssignedOption(rec) : (pend ? resolveAssignedOption(pend) : null);
      const detail = rec
        ? `${opt ? opt.shortLabel : 'Asignado'} (Tiro ${rec.spinCount === 2 ? '2/2' : '1/2'})`
        : (pend ? `${opt ? opt.shortLabel : 'Por confirmar'} (Tiro 1/2 sin confirmar)` : 'Giro en historial');
      return `<option value="${emp.id}">[${xmlEscape(emp.area)}] ${xmlEscape(emp.name)} — ${xmlEscape(detail)}</option>`;
    }).join('');
    if (selectedPersonId && spunEmps.some(e => e.id === selectedPersonId)) {
      sel.value = String(selectedPersonId);
    }
  }

  function confirmAdminDeleteSpin(empId) {
    const emp = state.employees.find(x => x.id === Number(empId));
    if (!emp) return;
    const rec = state.assignments[emp.id];
    const pend = state.pendingSpins && state.pendingSpins[emp.id];
    if (isPreRegisteredLocked(emp.id) || (rec && (rec.isManual || rec.mode === 'manual'))) {
      showToast(`🔒 ${emp.name} tiene una fecha registrada manualmente y está protegida.`, '🔒');
      return;
    }
    const opt = rec ? resolveAssignedOption(rec) : (pend ? resolveAssignedOption(pend) : null);
    const dateLabel = opt ? opt.label : '';
    openConfirm(
      '¿Eliminar tiro de ruleta?',
      `Se eliminará el tiro de ruleta de ${emp.name}${dateLabel ? ' (' + dateLabel + ')' : ''}${syncUrl ? ' aquí y en Google Drive' : ''}. Volverá a estado Pendiente con sus 2 tiros disponibles. Las fechas manuales no se modifican.`,
      async () => {
        delete state.assignments[emp.id];
        if (state.pendingSpins) delete state.pendingSpins[emp.id];
        const empUpper = String(emp.name || '').trim().toUpperCase();
        state.history = state.history
          .filter(h => {
            if (!h) return false;
            if (h.isManual || h.mode === 'manual') return true;
            const matchesEmp = (h.empId !== undefined && h.empId !== null && Number(h.empId) === emp.id) ||
              (h.name && String(h.name).trim().toUpperCase() === empUpper);
            return !matchesEmp;
          })
          .map((h, idx) => ({ ...h, order: idx + 1 }));
        if (lastSpinRecord && lastSpinRecord.empId === emp.id) lastSpinRecord = null;
        if (activeDecisionEmpId === emp.id) {
          activeDecisionEmpId = null;
          closeModal('modalSpinDecision');
        }
        saveState();
        document.getElementById('resultBanner').classList.add('hidden');
        document.getElementById('liveTicker').textContent = 'Listo para sortear';

        let driveWarning = '';
        if (syncUrl) {
          const res = await postToDrive({ action: 'adminClearSpin', empId: emp.id });
          if (res && !res.ok) {
            driveWarning = res.error && String(res.error).includes('desconocida')
              ? ' (Actualiza apps-script/Code.gs en Drive para sincronizar la eliminación)'
              : ` (${res.error || 'No se pudo confirmar en Drive'})`;
          }
        }
        selectedPersonId = emp.id;
        renderAll();
        showToast(`Tiro de ${emp.name} eliminado. Quedó pendiente con 2 tiros disponibles.${driveWarning}`, '↺');
      }
    );
  }

  function confirmClearManualAssignment(empId) {
    const emp = state.employees.find(x => x.id === Number(empId));
    if (!emp) return;
    if (isPreRegisteredLocked(emp.id)) {
      showToast(`🔒 ${emp.name} tiene descanso manual pre-registrado y bloqueado.`, '🔒');
      return;
    }
    if (hasSpunRoulette(emp.id)) {
      showToast(`🔒 ${emp.name} ya completó su turno definitivo en la ruleta. No se puede borrar.`, '🔒');
      return;
    }
    openConfirm(
      'Quitar asignación manual',
      `¿Deseas quitar la fecha manual de ${emp.name} y dejarlo como pendiente?`,
      async () => {
        delete state.assignments[emp.id];
        saveState();
        if (syncUrl) await postToDrive({ action: 'clearAssignment', empId: emp.id });
        renderAll();
        showToast(`${emp.name} volvió a estado pendiente`, '↺');
      }
    );
  }

  function syncSettingsModal() {
    const eqPct = formatPct(1 / Math.max(1, state.options.length));
    const model = computeEquityModel();

    const areaPreview = document.getElementById('equityTargetsPreview');
    if (areaPreview) {
      const chips = [
        `<span class="equity-chip highlight"><strong>Ruleta (${model.rouletteTotalEmps}):</strong> ${state.options.length} fechas</span>`
      ].concat((model.byGroupList || []).map((g) => {
        const exclTxt = g.exclusiveAssigned > 0 ? ` (+${g.exclusiveAssigned} manual excl.)` : '';
        const ruleTxt = g.ruleLabel
          ? `${g.ruleLabel}${exclTxt}`
          : (g.pending === 0 && g.exclusiveAssigned > 0
              ? `100% manual${exclTxt}`
              : `${formatRangeTarget(g.minTarget, g.maxTarget)} / fecha${exclTxt}`);
        return `<span class="equity-chip ${g.hasCustomRule ? 'highlight' : ''}"><strong>${xmlEscape(g.displayGroupLabel)} (${g.total}):</strong> ${xmlEscape(ruleTxt)}</span>`;
      }));
      areaPreview.innerHTML = chips.join('');
    }

    document.getElementById('settingsEqualTitle').textContent = `Azar libre sin cupos (${eqPct} independiente en cada giro)`;
    document.getElementById('settingsEqualDesc').textContent = `Cada persona gira con ${eqPct} fijo sin límites por fecha ni por área (el azar puede dejar fechas más cargadas que otras).`;

    document.querySelectorAll('input[name="probMode"]').forEach(r => {
      r.checked = r.value === state.mode;
    });
    renderQuotaInputs(state.quotas);
    document.getElementById('quotaInputsWrap').classList.toggle('hidden', state.mode !== 'balanced');

    const adminDetails = document.getElementById('adminManualDetails');
    if (adminDetails) adminDetails.open = false;
    const adminDeleteDetails = document.getElementById('adminDeleteSpinDetails');
    if (adminDeleteDetails) adminDeleteDetails.open = false;
    renderAdminManualSelector();
    renderAdminDeleteSpinSelector();
  }

  // =========================================================================
  // 13. EVENT LISTENERS
  // =========================================================================
  ['linkDriveSheetTop', 'linkDriveSheetTable', 'linkDriveSheetModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.href = CONFIG.DRIVE_SHEET_URL;
  });

  document.getElementById('employeeList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-emp-id]');
    if (btn) selectPerson(Number(btn.dataset.empId));
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderEmployeeList();
  });

  document.getElementById('areaFilter').addEventListener('change', (e) => {
    areaFilter = e.target.value;
    renderEmployeeList();
  });

  document.querySelectorAll('.status-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      statusFilter = btn.dataset.status;
      renderEmployeeList();
    });
  });

  document.querySelectorAll('.table-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      tableTab = btn.dataset.tableTab;
      renderTables();
    });
  });

  document.getElementById('tableDateFilter').addEventListener('change', (e) => {
    tableDateFilter = e.target.value;
    renderTables();
  });

  document.getElementById('tableAreaFilter').addEventListener('change', (e) => {
    tableAreaFilter = e.target.value;
    renderTables();
  });

  document.getElementById('registerTbody').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn || isSpinning) return;
    const empId = Number(btn.dataset.empId);
    const emp = state.employees.find(x => x.id === empId);
    if (!emp) return;

    if (btn.dataset.action === 'select') {
      selectPerson(empId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (btn.dataset.action === 'decide') {
      selectPerson(empId);
      openSpinDecisionModal(empId);
    }
  });

  document.getElementById('btnPickNext').addEventListener('click', pickNextPending);
  document.getElementById('btnPickRandom').addEventListener('click', pickRandomPending);
  document.getElementById('btnSpinMain').addEventListener('click', spinWheel);
  document.getElementById('btnHubSpin').addEventListener('click', spinWheel);
  document.getElementById('btnKeepFirstSpin').addEventListener('click', confirmKeepFirstSpin);
  document.getElementById('btnTakeSecondSpin').addEventListener('click', startSecondAndFinalSpin);

  // Manual assign submit
  document.getElementById('formManualAssign').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emp = state.employees.find(x => x.id === selectedPersonId);
    const checked = document.querySelector('input[name="manualDateOption"]:checked');
    if (!emp || !checked) return;
    const opt = getOptionById(checked.value) || getExclusiveOptionById(checked.value);
    if (!opt) return;
    const reason = document.getElementById('manualReasonInput').value.trim();
    closeModal('modalManualAssign');
    await commitAssignment(emp, opt, {
      forceOverwrite: true,
      isManual: true,
      manualReason: reason
    });
  });

  // Manage Dates modal events
  document.getElementById('btnManageDates').addEventListener('click', openManageDatesModal);
  document.getElementById('btnManageDatesInline').addEventListener('click', openManageDatesModal);

  document.getElementById('datesEditorList').addEventListener('input', (e) => {
    const idx = Number(e.target.dataset.dateIdx);
    if (Number.isNaN(idx) || !draftDates[idx]) return;
    if (e.target.classList.contains('date-field-label')) draftDates[idx].label = e.target.value;
    if (e.target.classList.contains('date-field-days')) draftDates[idx].days = e.target.value;
    if (e.target.classList.contains('date-field-tag')) draftDates[idx].seasonTag = e.target.value;
  });

  document.getElementById('datesEditorList').addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch-btn');
    if (swatch) {
      const idx = Number(swatch.dataset.dateIdx);
      const cIdx = Number(swatch.dataset.colorIdx);
      if (draftDates[idx]) {
        draftDates[idx].colorIndex = cIdx;
        renderDatesEditor();
      }
      return;
    }
    const delBtn = e.target.closest('.btn-remove-date');
    if (delBtn && draftDates.length > 2) {
      const idx = Number(delBtn.dataset.dateIdx);
      draftDates.splice(idx, 1);
      renderDatesEditor();
    }
  });

  document.getElementById('btnAddNewDateRow').addEventListener('click', () => {
    if (draftDates.length >= 12) {
      showToast('Máximo 12 fechas simultáneas en la ruleta', '!');
      return;
    }
    const usedColors = new Set(draftDates.map(d => d.colorIndex));
    let nextColor = draftDates.length % COLOR_PALETTE.length;
    for (let i = 0; i < COLOR_PALETTE.length; i++) {
      if (!usedColors.has(i)) { nextColor = i; break; }
    }
    draftDates.push({
      id: 'opt_' + Date.now() + '_' + draftDates.length,
      originalLabel: '',
      label: '',
      days: '',
      seasonTag: '',
      colorIndex: nextColor
    });
    renderDatesEditor();
    const inputs = document.querySelectorAll('.date-field-label');
    const lastInput = inputs[inputs.length - 1];
    if (lastInput) {
      lastInput.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      lastInput.focus();
    }
  });

  document.getElementById('btnRestoreDefaultDates').addEventListener('click', () => {
    draftDates = DEFAULT_OPTIONS_RAW.map(o => ({
      id: o.id,
      originalLabel: o.label,
      label: o.label,
      days: o.days,
      seasonTag: o.seasonTag,
      colorIndex: o.colorIndex
    }));
    renderDatesEditor();
  });

  document.getElementById('btnSaveDates').addEventListener('click', saveManagedDates);

  // Result actions
  document.getElementById('btnResultNext').addEventListener('click', pickNextPending);
  document.getElementById('btnResultDownload').addEventListener('click', () => downloadXlsx(false));
  document.getElementById('btnResultUndo').addEventListener('click', async () => {
    if (!lastSpinRecord || !lastSpinRecord.isManual || isSpinning) return;
    const { empId, prevAssignment, histOrder } = lastSpinRecord;
    if (prevAssignment && prevAssignment.isManual) {
      state.assignments[empId] = prevAssignment;
      const prevOpt = resolveAssignedOption(prevAssignment);
      if (syncUrl && prevOpt) {
        await postToDrive({
          action: 'recordSpin',
          empId,
          optionId: prevOpt.id,
          optionLabel: prevOpt.label,
          optionDays: prevOpt.days,
          optionBg: prevOpt.pillBg,
          optionFg: prevOpt.pillText,
          mode: 'manual',
          isManual: true,
          manualReason: prevAssignment.manualReason || '',
          forceOverwrite: true
        });
      }
    } else if (!prevAssignment) {
      delete state.assignments[empId];
      if (syncUrl) await postToDrive({ action: 'clearAssignment', empId });
    } else {
      return;
    }
    state.history = state.history.filter(h => h.order !== histOrder);
    lastSpinRecord = null;
    saveState();
    document.getElementById('resultBanner').classList.add('hidden');
    renderAll();
    showToast('Asignación manual deshecha', '↺');
  });

  // Spacebar shortcut
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Space') return;
    const tag = (e.target && e.target.tagName) || '';
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tag)) return;
    if (document.querySelector('.modal-backdrop:not(.hidden)')) return;
    if (selectedPersonId && !isSpinning) {
      e.preventDefault();
      if (hasPendingFirstSpin(selectedPersonId)) {
        openSpinDecisionModal(selectedPersonId);
      } else if (canSpinRoulette(selectedPersonId)) {
        spinWheel();
      } else {
        const emp = state.employees.find(x => x.id === selectedPersonId);
        const msg = emp && isPreRegisteredLocked(emp.id)
          ? `🔒 ${emp.name} tiene su descanso manual pre-registrado y bloqueado.`
          : `🔒 ${emp ? emp.name : 'Esta persona'} ya completó su turno definitivo (máx. ${MAX_SPINS_PER_PERSON} tiros).`;
        showToast(msg, '🔒');
      }
    }
  });

  // Theme & Sound
  document.getElementById('btnTheme').addEventListener('click', () => {
    applyTheme(isDarkTheme() ? 'light' : 'dark');
    drawWheel();
  });

  document.getElementById('btnSound').addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    saveState();
    renderHeaderAndProgress();
    if (state.soundOn) playTick(0.6);
  });

  document.getElementById('chkAutoDownload').addEventListener('change', (e) => {
    state.autoDownload = e.target.checked;
    saveState();
    showToast(state.autoDownload ? 'Se descargará el Excel automáticamente tras cada giro' : 'Auto-descarga desactivada', '✓');
  });

  // Exports
  document.getElementById('btnDownloadXlsxHeader').addEventListener('click', () => downloadXlsx(false));
  document.getElementById('btnDownloadXlsxTable').addEventListener('click', () => downloadXlsx(false));
  document.getElementById('btnDownloadCsv').addEventListener('click', downloadCsv);
  document.getElementById('btnCopyExcel').addEventListener('click', copyForExcel);

  // Drive Sync controls
  document.getElementById('btnDriveSync').addEventListener('click', openDriveModal);
  document.getElementById('btnOpenSyncFromBar').addEventListener('click', openDriveModal);
  document.getElementById('btnSyncNow').addEventListener('click', () => syncFromDrive({ silent: false }));

  document.getElementById('btnConnectDrive').addEventListener('click', async () => {
    const val = document.getElementById('inputSyncUrl').value.trim();
    if (!isValidAppsScriptUrl(val)) {
      showToast('Ingresa una URL válida de Google Apps Script que termine en /exec', '!');
      return;
    }
    syncUrl = val;
    try { localStorage.setItem(SYNC_URL_KEY, syncUrl); } catch (_) {}
    const ok = await syncFromDrive({ silent: false });
    if (ok) startPolling();
  });

  document.getElementById('btnDisconnectDrive').addEventListener('click', () => {
    stopPolling();
    syncUrl = '';
    syncStatus = 'disconnected';
    try { localStorage.removeItem(SYNC_URL_KEY); } catch (_) {}
    document.getElementById('inputSyncUrl').value = '';
    renderSyncUi();
    showToast('Sincronización con Drive desconectada (modo local)', 'ℹ');
  });

  document.getElementById('btnCopyShareLink').addEventListener('click', () => {
    if (!syncUrl) return;
    const base = window.location.origin + window.location.pathname;
    copyText(`${base}?sync=${encodeURIComponent(syncUrl)}`, 'Enlace sincronizado copiado. Compártelo en otros celulares o PC.');
  });

  document.getElementById('btnPushLocalToDrive').addEventListener('click', async () => {
    if (!syncUrl) return;
    const res = await postToDrive({
      action: 'pushLocalProgress',
      assignments: state.assignments,
      options: state.options.map(o => ({
        id: o.id,
        label: o.label,
        shortLabel: o.shortLabel,
        days: o.days,
        seasonTag: o.seasonTag,
        colorIndex: o.colorIndex,
        bg: o.pillBg,
        fg: o.pillText
      }))
    });
    if (res && res.ok) {
      renderAll();
      showToast('Avance local sincronizado en Google Drive', '✓');
    } else {
      showToast('No se pudo subir el avance a Drive', '!');
    }
  });

  document.getElementById('btnCopyGasCode').addEventListener('click', async () => {
    try {
      const res = await fetch('./apps-script/Code.gs');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const code = await res.text();
      await copyText(code, 'Código Code.gs copiado. Pégalo en Extensiones → Apps Script.');
    } catch (_) {
      showToast('Abre apps-script/Code.gs en el repositorio para copiar el código.', 'ℹ');
    }
  });

  // Reset all (preserves the 13 locked pre-registered manual assignments)
  document.getElementById('btnResetAll').addEventListener('click', () => {
    openConfirm(
      '¿Reiniciar los giros de la ruleta?',
      syncUrl
        ? 'Se reiniciarán únicamente los 31 participantes pendientes tanto aquí como en Google Drive. Los 13 descansos manuales pre-registrados y las 4 fechas de la ruleta se conservarán intactos.'
        : 'Se borrarán los giros de ruleta de los 31 participantes pendientes. Los 13 descansos manuales pre-registrados se conservarán intactos.',
      async () => {
        state.assignments = buildPreRegisteredAssignments(state.options);
        state.pendingSpins = {};
        state.history = buildPreRegisteredHistory(state.options);
        lastSpinRecord = null;
        saveState();
        if (syncUrl) {
          await postToDrive({ action: 'resetAll' });
          if (remoteScriptVersion < 6) {
            await postToDrive({
              action: 'pushLocalProgress',
              assignments: state.assignments,
              options: state.options.map(o => ({
                id: o.id,
                label: o.label,
                shortLabel: o.shortLabel,
                days: o.days,
                seasonTag: o.seasonTag,
                colorIndex: o.colorIndex,
                bg: o.pillBg,
                fg: o.pillText
              }))
            });
          }
        }
        document.getElementById('resultBanner').classList.add('hidden');
        document.getElementById('liveTicker').textContent = 'Listo para sortear';
        const firstPend = state.employees.find(e => !state.assignments[e.id]);
        if (firstPend) selectedPersonId = firstPend.id;
        renderAll();
        showToast('Giros reiniciados (13 pre-registrados conservados)', '↺');
      }
    );
  });

  // Confirm modal
  document.getElementById('btnConfirmCancel').addEventListener('click', () => {
    confirmCallback = null;
    closeModal('modalConfirm');
  });
  document.getElementById('btnConfirmOk').addEventListener('click', () => {
    const cb = confirmCallback;
    confirmCallback = null;
    closeModal('modalConfirm');
    if (typeof cb === 'function') cb();
  });

  // Add person
  document.getElementById('btnAddPerson').addEventListener('click', () => {
    document.getElementById('newPersonName').value = '';
    openModal('modalAddPerson');
    setTimeout(() => document.getElementById('newPersonName').focus(), 40);
  });

  document.getElementById('formAddPerson').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawName = document.getElementById('newPersonName').value.trim().toUpperCase();
    const area = document.getElementById('newPersonArea').value;
    if (!rawName) return;

    closeModal('modalAddPerson');
    statusFilter = 'pending';
    areaFilter = 'ALL';
    searchQuery = '';
    document.getElementById('searchInput').value = '';

    if (syncUrl) {
      const res = await postToDrive({ action: 'addEmployee', name: rawName, area });
      if (res && res.ok && res.addedId) {
        selectedPersonId = res.addedId;
        renderAll();
        showToast(`Colaborador agregado y guardado en Drive: ${rawName}`, '✓');
        return;
      }
    }

    const newEmp = { id: state.nextEmpId++, area, name: rawName };
    state.employees.push(newEmp);
    saveState();
    selectedPersonId = newEmp.id;
    renderAll();
    showToast(`Colaborador agregado: ${rawName}`, '✓');
  });

  // Settings modal
  document.getElementById('btnSettings').addEventListener('click', () => {
    syncSettingsModal();
    openModal('modalSettings');
  });

  document.querySelectorAll('input[name="probMode"]').forEach(r => {
    r.addEventListener('change', (e) => {
      document.getElementById('quotaInputsWrap').classList.toggle('hidden', e.target.value !== 'balanced');
    });
  });

  document.getElementById('btnAutoDistributeQuotas').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rouletteCount = Math.max(1, state.employees.length - getExclusiveAssignedCount(state.assignments, state.options));
    const even = normalizeQuotas(null, state.options, rouletteCount);
    renderQuotaInputs(even);
  });

  document.getElementById('btnSaveSettings').addEventListener('click', async () => {
    const checked = document.querySelector('input[name="probMode"]:checked');
    state.mode = checked && ['area_balanced', 'balanced', 'equal'].includes(checked.value)
      ? checked.value
      : 'area_balanced';
    state.equityVersion = EQUITY_SCHEMA_VERSION;
    const nextQuotas = {};
    document.querySelectorAll('.quota-input').forEach(inp => {
      nextQuotas[inp.dataset.optId] = Math.max(1, parseInt(inp.value, 10) || 1);
    });
    const rouletteCount = Math.max(1, state.employees.length - getExclusiveAssignedCount(state.assignments, state.options));
    state.quotas = normalizeQuotas(nextQuotas, state.options, rouletteCount);
    saveState();
    closeModal('modalSettings');
    if (syncUrl) await postToDrive({ action: 'updateSettings', mode: state.mode, quotas: state.quotas });
    renderAll();
    const eqPct = formatPct(1 / Math.max(1, state.options.length));
    const msg = state.mode === 'area_balanced'
      ? 'Modo activo: Reglas estrictas por área y fecha'
      : (state.mode === 'balanced'
          ? 'Modo activo: Cupos globales personalizados'
          : `Modo activo: Azar libre (${eqPct} c/u)`);
    showToast(msg, '✓');
  });

  // Discreet Admin Tools inside Settings (Manual Assignment & Delete Roulette Spin)
  document.getElementById('adminManualEmpSelect').addEventListener('change', updateAdminClearButton);

  document.getElementById('btnOpenAdminManual').addEventListener('click', () => {
    const sel = document.getElementById('adminManualEmpSelect');
    const empId = sel ? Number(sel.value) : selectedPersonId;
    if (!empId) return;
    closeModal('modalSettings');
    openManualAssignModal(empId);
  });

  document.getElementById('btnAdminClearManual').addEventListener('click', () => {
    const sel = document.getElementById('adminManualEmpSelect');
    const empId = sel ? Number(sel.value) : selectedPersonId;
    if (!empId) return;
    closeModal('modalSettings');
    confirmClearManualAssignment(empId);
  });

  document.getElementById('btnAdminDeleteSpin').addEventListener('click', () => {
    const sel = document.getElementById('adminDeleteSpinSelect');
    const empId = sel ? Number(sel.value) : 0;
    if (!empId) return;
    closeModal('modalSettings');
    confirmAdminDeleteSpin(empId);
  });

  // Company Logo controls
  document.getElementById('btnCompanyLogo').addEventListener('click', openCompanyLogoModal);
  document.getElementById('brandLogoTrigger').addEventListener('click', openCompanyLogoModal);
  document.getElementById('btnOpenLogoFromSettings').addEventListener('click', () => {
    closeModal('modalSettings');
    openCompanyLogoModal();
  });

  document.getElementById('inputLogoFile').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const optimizedSrc = await optimizeLogoImageFile(file);
      saveCompanyLogo({ src: optimizedSrc, lightBg: document.getElementById('chkLogoLightBg').checked });
      document.getElementById('inputLogoUrl').value = '';
      showToast('Logo de la empresa cargado correctamente', '✓');
    } catch (err) {
      showToast((err && err.message) || 'No se pudo cargar la imagen del logo', '!');
    }
  });

  function applyLogoUrlFromInput() {
    const raw = document.getElementById('inputLogoUrl').value.trim();
    if (!raw) {
      showToast('Ingresa la URL directa de una imagen (PNG, JPG, WebP o SVG)', '!');
      return;
    }
    if (!/^(https?:\/\/|\.\/|\/|data:image\/)/i.test(raw)) {
      showToast('La URL debe comenzar con https:// o ser una ruta válida de imagen', '!');
      return;
    }
    saveCompanyLogo({ src: raw, lightBg: document.getElementById('chkLogoLightBg').checked });
    showToast('Logo actualizado desde enlace', '✓');
  }

  document.getElementById('btnApplyLogoUrl').addEventListener('click', applyLogoUrlFromInput);
  document.getElementById('inputLogoUrl').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      applyLogoUrlFromInput();
    }
  });

  document.getElementById('btnRemoveLogo').addEventListener('click', () => {
    saveCompanyLogo({ src: '', lightBg: true });
    document.getElementById('inputLogoUrl').value = '';
    showToast('Logo eliminado (se restauró la insignia Q26)', '↺');
  });

  document.getElementById('chkLogoLightBg').addEventListener('change', (e) => {
    saveCompanyLogo({ src: companyLogo.src, lightBg: e.target.checked });
  });

  document.getElementById('logoPreviewImg').addEventListener('error', () => {
    if (companyLogo && companyLogo.src) {
      showToast('No se pudo cargar la imagen del enlace. Verifica que la URL sea pública y directa a una imagen.', '!');
    }
  });

  // Backup export / import
  document.getElementById('btnExportBackup').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Respaldo_Ruleta_Quirama_2026.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast('Respaldo JSON descargado', '✓');
  });

  document.getElementById('inputImportBackup').addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || !Array.isArray(parsed.employees)) throw new Error('Formato inválido');
        const opts = Array.isArray(parsed.options) && parsed.options.length >= 2
          ? parsed.options.map((o, i) => normalizeOption(o, i))
          : state.options;
        const resolvedMode = ['area_balanced', 'balanced', 'equal'].includes(parsed.mode)
          ? parsed.mode
          : 'area_balanced';
        const restoredAssignments = parsed.assignments && typeof parsed.assignments === 'object' ? parsed.assignments : {};
        const exclCount = getExclusiveAssignedCount(restoredAssignments, opts);
        state = {
          ...defaultState(),
          ...parsed,
          mode: resolvedMode,
          equityVersion: EQUITY_SCHEMA_VERSION,
          options: opts,
          pendingSpins: parsed.pendingSpins && typeof parsed.pendingSpins === 'object' ? parsed.pendingSpins : {},
          quotas: normalizeQuotas(parsed.quotas, opts, Math.max(1, parsed.employees.length - exclCount))
        };
        saveState();
        closeModal('modalSettings');
        renderAll();
        showToast('Respaldo restaurado correctamente', '✓');
      } catch (_) {
        showToast('No se pudo leer el archivo de respaldo', '!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Modal close buttons & backdrop
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.closeModal));
  });
  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop && backdrop.dataset.noBackdropClose !== 'true') {
        backdrop.classList.add('hidden');
      }
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && syncUrl && !isSpinning && pendingDriveWritesCount === 0) {
      syncFromDrive({ silent: true });
    }
  });
  window.addEventListener('beforeunload', (e) => {
    if (pendingDriveWritesCount > 0) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
  window.addEventListener('resize', setupWheelCanvas);

  // =========================================================================
  // 14. BOOT
  // =========================================================================
  initTheme();
  renderCompanyLogo();
  const pendingDecisionId = Object.keys(state.pendingSpins || {})[0];
  const firstPending = pendingDecisionId
    ? state.employees.find(e => e.id === Number(pendingDecisionId))
    : state.employees.find(e => !state.assignments[e.id]);
  if (firstPending) selectedPersonId = firstPending.id;
  setupWheelCanvas();
  renderAll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      wheelDiscCache.key = '';
      if (!isSpinning) drawWheel();
    }).catch(() => {});
  }

  if (syncUrl) {
    syncFromDrive({ silent: true }).then(() => startPolling());
  }
})();
