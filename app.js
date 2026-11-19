(() => {
  'use strict';

  const CONFIG = window.QUIRAMA_CONFIG || {
    APPS_SCRIPT_URL: '',
    DRIVE_SHEET_ID: '1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc',
    DRIVE_SHEET_URL: 'https://docs.google.com/spreadsheets/d/1oMbzcsW7UjO4vrRzRPwsgYIQwRn5OXRF3w0N-mR-vKc/edit',
    DRIVE_FOLDER_URL: 'https://drive.google.com/drive/folders/1C6f0Fm4svcNAL6-IpEDxkFTSKZEuIMcj',
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
    // A&B (25)
    { id: 15, area: 'A&B', name: 'RENDON MEJIA PABLO ANDRES' },
    { id: 16, area: 'A&B', name: 'CORREA DAVID JUAN SEBASTIAN' },
    { id: 17, area: 'A&B', name: 'MARIN VELASQUEZ JUAN PABLO' },
    { id: 18, area: 'A&B', name: 'MARIN ARANGO EZEQUIEL DE JESUS' },
    { id: 19, area: 'A&B', name: 'LOPEZ SUAREZ MARTA LUCIA' },
    { id: 20, area: 'A&B', name: 'RIOS GARCIA CAROLINA' },
    { id: 21, area: 'A&B', name: 'ARISTIZABAL HENAO LUZ FANNY' },
    { id: 22, area: 'A&B', name: 'LOTERO RAMIREZ ERNESTO DE JESUS' },
    { id: 23, area: 'A&B', name: 'CORTES VALENCIA FERNANDO ALONSO' },
    { id: 24, area: 'A&B', name: 'MARULANDA JARAMILLO DILSA YARLEDY' },
    { id: 25, area: 'A&B', name: 'GARCIA CARMONA SANTIAGO' },
    { id: 26, area: 'A&B', name: 'ARISTIZABAL HENAO BEATRIZ ELENA' },
    { id: 27, area: 'A&B', name: 'GIL GARCIA DEIBY ANDRES' },
    { id: 28, area: 'A&B', name: 'MORALES HENAO RAUL SANTIAGO' },
    { id: 29, area: 'A&B', name: 'ALVAREZ SEPULVEDA WILSON ALEXANDER' },
    { id: 30, area: 'A&B', name: 'GARCIA NAVAS SARAY ISABELLA' },
    { id: 31, area: 'A&B', name: 'LONDOÑO SANCHEZ NATALIA' },
    { id: 32, area: 'A&B', name: 'ALVAREZ TRUJILLO MARIA OLGA' },
    { id: 33, area: 'A&B', name: 'CARRACEDO GUTIERREZ DIEGO ANDRES' },
    { id: 34, area: 'A&B', name: 'VALENCIA ARIAS ANLLY PAOLA' },
    { id: 35, area: 'A&B', name: 'CASTAÑO HOYOS JUAN CARLOS' },
    { id: 36, area: 'A&B', name: 'CUELLAR GLADIS' },
    { id: 37, area: 'A&B', name: 'GAVIRIA BEDOYA JORGE IVAN' },
    { id: 38, area: 'A&B', name: 'PUERTA FERNANDEZ DAIRON' },
    { id: 39, area: 'A&B', name: 'NARANJO LOPEZ ESTEFANIA' },
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
    { id: '2', label: '30 y 31 de diciembre', shortLabel: '30 y 31 Dic', days: 'Mié 30 – Jue 31 Dic 2026', seasonTag: 'Fin de Año', colorIndex: 2 },
    { id: '3', label: '01 y 02 de enero',     shortLabel: '01 y 02 Ene', days: 'Vie 01 – Sáb 02 Ene 2027', seasonTag: 'Año Nuevo',  colorIndex: 3 }
  ];

  const STORAGE_KEY = 'quirama_ruleta_descansos_2026_v2';
  const SYNC_URL_KEY = 'quirama_sync_url_v1';
  const THEME_KEY = 'quirama_theme_v1';
  const TWO_PI = Math.PI * 2;
  const POINTER_SCREEN_ANGLE = -Math.PI / 2;

  // =========================================================================
  // 2. OPTION HELPERS (Dynamic Dates)
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
    return {
      id: String(raw.id !== undefined && raw.id !== null ? raw.id : idx),
      label,
      shortLabel: String(raw.shortLabel || '').trim() || deriveShortLabel(label),
      days: String(raw.days || '').trim() || '—',
      seasonTag: String(raw.seasonTag || '').trim() || 'Descanso',
      colorIndex,
      wheelTop: parts.wheelTop,
      wheelBottom: parts.wheelBottom,
      colorMain: pal.colorMain,
      colorLight: pal.colorLight,
      colorDark: pal.colorDark,
      pillBg: pal.pillBg,
      pillText: pal.pillText,
      xlsxStyleIndex: pal.xlsxStyleIndex
    };
  }

  function getOptionById(optionId) {
    const key = String(optionId);
    return state.options.find(o => o.id === key) || null;
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

  let isSpinning = false;
  let wheelAngle = 0;
  let pointerDeflection = 0;
  let pointerVelocity = 0;
  let audioCtx = null;

  function defaultState() {
    const options = DEFAULT_OPTIONS_RAW.map((o, i) => normalizeOption(o, i));
    return {
      employees: INITIAL_EMPLOYEES.map(e => ({ ...e })),
      options,
      assignments: {},
      history: [],
      mode: 'equal',
      quotas: normalizeQuotas(null, options, INITIAL_EMPLOYEES.length),
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
      const normalizedAssignments = {};
      for (const [k, v] of Object.entries(parsed.assignments || {})) {
        if (v && v.optionId !== undefined && v.optionId !== null) {
          normalizedAssignments[k] = {
            ...v,
            optionId: String(v.optionId),
            isManual: Boolean(v.isManual || v.mode === 'manual'),
            manualReason: String(v.manualReason || '')
          };
        }
      }
      return {
        ...defaultState(),
        ...parsed,
        options: opts,
        assignments: normalizedAssignments,
        quotas: normalizeQuotas(parsed.quotas, opts, parsed.employees.length)
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
  // 4. GOOGLE DRIVE LIVE SYNC ENGINE (Apps Script JSON API)
  // =========================================================================
  function applyRemoteState(remote) {
    if (!remote || !remote.ok || !Array.isArray(remote.employees)) return;
    const remoteVer = Number(remote.scriptVersion || 1);
    remoteScriptVersion = remoteVer;
    if (remote.employees.length > 0) state.employees = remote.employees;

    if (Array.isArray(remote.options) && remote.options.length >= 2) {
      state.options = remote.options.map((o, i) => normalizeOption(o, i));
    }

    const prevAssignments = state.assignments || {};
    const nextAssignments = {};
    for (const [empId, rec] of Object.entries(remote.assignments || {})) {
      if (!rec || rec.optionId === undefined || rec.optionId === null) continue;
      const prev = prevAssignments[empId];
      const keepLocalManual = remoteVer < 2 && prev && prev.isManual && String(prev.optionId) === String(rec.optionId);
      const isManual = Boolean(rec.isManual || rec.mode === 'manual' || keepLocalManual);
      nextAssignments[empId] = {
        optionId: String(rec.optionId),
        timestamp: rec.timestamp || '',
        mode: isManual ? 'manual' : (rec.mode || 'equal'),
        isManual,
        manualReason: String(rec.manualReason || (keepLocalManual ? prev.manualReason : '') || '')
      };
    }
    // If remote is still v1, preserve local assignments made on newly added custom dates that v1 doesn't know yet
    if (remoteVer < 2) {
      const defaultIds = new Set(['0', '1', '2', '3']);
      for (const [empId, prev] of Object.entries(prevAssignments)) {
        if (!nextAssignments[empId] && prev && !defaultIds.has(String(prev.optionId))) {
          nextAssignments[empId] = prev;
        }
      }
    }
    state.assignments = nextAssignments;

    const prevManualByEmpOpt = new Map();
    if (remoteVer < 2) {
      for (const [empId, rec] of Object.entries(nextAssignments)) {
        if (rec && rec.isManual) prevManualByEmpOpt.set(`${empId}|${rec.optionId}`, rec.manualReason || '');
      }
    }

    state.history = Array.isArray(remote.history)
      ? remote.history.map(h => {
          const optIdStr = h.optionId !== undefined && h.optionId !== null ? String(h.optionId) : null;
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
          return {
            ...h,
            optionId: optIdStr,
            mode: hManual ? 'manual' : (h.mode || 'equal'),
            isManual: hManual,
            manualReason: hReason
          };
        })
      : [];

    if (remote.mode === 'equal' || remote.mode === 'balanced') state.mode = remote.mode;
    if (remote.quotas) {
      state.quotas = normalizeQuotas(remote.quotas, state.options, state.employees.length);
    }
    if (remote.nextEmpId) state.nextEmpId = Number(remote.nextEmpId);
    saveState();

    if (selectedPersonId && !state.employees.some(e => e.id === selectedPersonId)) {
      const firstPending = state.employees.find(e => !state.assignments[e.id]);
      selectedPersonId = firstPending ? firstPending.id : null;
    }
  }

  async function syncFromDrive({ silent = true } = {}) {
    if (!syncUrl || isSyncInFlight) return false;
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

  async function postToDrive(payload) {
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
      if (data && data.state) {
        applyRemoteState(data.state);
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

  function startPolling() {
    stopPolling();
    if (!syncUrl) return;
    pollTimer = setInterval(() => {
      if (!isSpinning && !document.hidden) {
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

    const dotClass = syncStatus === 'connected' ? 'sync-dot connected'
      : syncStatus === 'syncing' ? 'sync-dot syncing'
      : syncStatus === 'error' ? 'sync-dot error'
      : 'sync-dot';

    dot.className = dotClass;
    modalDot.className = dotClass;

    if (syncStatus === 'connected') {
      btn.className = 'btn btn-sync-ok';
      label.textContent = 'Drive en vivo';
      noticeBar.classList.add('hidden');
      btnSyncNow.classList.remove('hidden');
      const timeTxt = lastSyncAt ? lastSyncAt.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '';
      excelStatus.textContent = `Sincronizado en vivo con Google Drive${timeTxt ? ' · última actualización ' + timeTxt : ''}. Todos los dispositivos ven los cambios automáticamente.`;
      modalText.textContent = `Conectado a Google Drive (${timeTxt || 'en vivo'})`;
      modalDetail.textContent = 'Cada giro, asignación manual o cambio de fechas se guarda en "Descansos Quirama Fin de Año 2026" y se actualiza en todos los dispositivos cada 5 segundos.';
      btnShare.classList.remove('hidden');
      btnPushLocal.classList.remove('hidden');
      btnDisconnect.classList.remove('hidden');
    } else if (syncStatus === 'syncing') {
      btn.className = 'btn';
      label.textContent = 'Sincronizando...';
      noticeBar.classList.add('hidden');
      btnSyncNow.classList.remove('hidden');
      modalText.textContent = 'Conectando con Google Drive...';
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

  function getAssignedCountsMap(excludeEmpId = null) {
    const counts = {};
    state.options.forEach(o => { counts[o.id] = 0; });
    for (const [empIdStr, rec] of Object.entries(state.assignments)) {
      if (excludeEmpId !== null && Number(empIdStr) === Number(excludeEmpId)) continue;
      if (rec && counts[String(rec.optionId)] !== undefined) {
        counts[String(rec.optionId)]++;
      }
    }
    return counts;
  }

  function hasSpunRoulette(empId) {
    const numId = Number(empId);
    const emp = state.employees.find(e => e.id === numId);
    const rec = state.assignments[numId];
    if (rec && !rec.isManual && rec.mode !== 'manual') return true;
    const activeIds = new Set(state.options.map(o => String(o.id)));
    const activeLabels = new Set(state.options.map(o => o.label.toLowerCase()));
    return state.history.some(h => {
      if (!h || h.isManual || h.mode === 'manual') return false;
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

  function getWheelSectors(excludeEmpId = null) {
    const opts = state.options;
    const repeatEqual = opts.length <= 5 ? 2 : 1;

    if (state.mode === 'equal') {
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

    const counts = getAssignedCountsMap(excludeEmpId);
    const remaining = {};
    let totalRem = 0;
    opts.forEach(o => {
      const q = Math.max(1, Number(state.quotas[o.id]) || 1);
      const rem = Math.max(0, q - (counts[o.id] || 0));
      remaining[o.id] = rem;
      totalRem += rem;
    });

    if (totalRem <= 0) {
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

    const activeOpts = opts.filter(o => remaining[o.id] > 0);
    const repeat = activeOpts.length >= 2 && activeOpts.length <= 5 ? 2 : 1;
    const raw = [];
    for (let r = 0; r < repeat; r++) {
      for (const opt of activeOpts) {
        raw.push({ option: opt, weight: (remaining[opt.id] / totalRem) / repeat });
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
        endAngle: cursor + span,
        weight: item.weight
      };
      cursor += span;
      return sec;
    });
  }

  function getOptionProbabilitiesMap(excludeEmpId = null) {
    const sectors = getWheelSectors(excludeEmpId);
    const probs = {};
    state.options.forEach(o => { probs[o.id] = 0; });
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

  function pickWinningSector(sectors) {
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
    return 'Asignado';
  }

  function generateXlsxBytes() {
    const emps = state.employees;
    const opts = state.options;
    const totalEmps = emps.length;
    const assignedCount = Object.keys(state.assignments).length;
    const generatedAt = formatDateTimeEs(new Date().toISOString());
    const eqPct = formatPct(1 / Math.max(1, opts.length));
    const modeDesc = state.mode === 'equal'
      ? `Probabilidad igual (${eqPct} cada fecha)`
      : `Cupos equilibrados (${opts.map(o => state.quotas[o.id] || 0).join(' / ')})`;

    // Stylesheet indices:
    // 0: default | 1: title | 2: body left | 3: body center
    // 4..11: 8 curated date pill styles
    // 12: pending pill | 13: subtitle | 14: table header | 15: total center | 16: total left | 17: percent
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
  <fills count="14">
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
  <cellXfs count="18">
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
      const opt = rec ? getOptionById(rec.optionId) : null;
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
    <col min="4" max="4" width="24" customWidth="1"/>
    <col min="5" max="5" width="26" customWidth="1"/>
    <col min="6" max="6" width="24" customWidth="1"/>
    <col min="7" max="7" width="23" customWidth="1"/>
  </cols>
  <sheetData>${s1Rows.join('')}</sheetData>
  <autoFilter ref="A3:G${lastDataRow}"/>
  <mergeCells count="2"><mergeCell ref="A1:G1"/><mergeCell ref="A2:G2"/></mergeCells>
</worksheet>`;

    // ---- SHEET 2: Dynamic Summary by Area ----
    const areas = getUniqueAreas();
    const s2Headers = ['Área', ...opts.map(o => o.label), 'Pendiente', 'Total'];
    const totalCols = s2Headers.length;
    const lastColL = colLetter(totalCols - 1);
    const lastSumColL = colLetter(totalCols - 2);

    const s2Rows = [
      `<row r="1" ht="28" customHeight="1">${cellStr('A1', 'RESUMEN DE DESCANSOS POR ÁREA Y FECHA — QUIRAMA 2026', 1)}</row>`,
      `<row r="2" ht="20" customHeight="1">${cellStr('A2', 'Fórmulas vinculadas automáticamente a la hoja "Descansos Quirama"', 13)}</row>`,
      `<row r="3" ht="26" customHeight="1">${s2Headers.map((h, i) => cellStr(colLetter(i) + '3', h, 14)).join('')}</row>`
    ];

    const areaStartRow = 4;
    const areaEndRow = areaStartRow + areas.length - 1;
    const colTotals = Array(totalCols - 1).fill(0);
    const rangeArea = `'Descansos Quirama'!$B$${firstDataRow}:$B$${formulaEndRow}`;
    const rangeDate = `'Descansos Quirama'!$D$${firstDataRow}:$D$${formulaEndRow}`;

    areas.forEach((area, idx) => {
      const r = areaStartRow + idx;
      const areaEmps = emps.filter(e => e.area === area);
      const vals = opts.map(o => areaEmps.filter(e => state.assignments[e.id]?.optionId === o.id).length);
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
      const opt = item.optionId !== null ? getOptionById(item.optionId) : null;
      const label = opt ? opt.label : (item.optionLabel || '—');
      const isMan = Boolean(item.isManual || item.mode === 'manual');
      const modeText = item.modeText || (isMan
        ? (item.manualReason ? `Manual (sin ruleta) — ${item.manualReason}` : 'Manual (sin ruleta)')
        : (item.mode === 'balanced' ? 'Cupos equilibrados' : `Probabilidad igual (${eqPct})`));
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
    <col min="5" max="5" width="24" customWidth="1"/>
    <col min="6" max="6" width="30" customWidth="1"/>
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
      const opt = rec ? getOptionById(rec.optionId) : null;
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
      const opt = rec ? getOptionById(rec.optionId) : null;
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
    drawWheel();
  }

  function drawWheel() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = wheelCanvas.width / dpr;
    const cx = size / 2;
    const cy = size / 2 + 6;
    const outerR = size * 0.455;
    const wheelR = outerR - 12;
    const dark = isDarkTheme();

    wCtx.clearRect(0, 0, size, size);

    wCtx.save();
    wCtx.beginPath();
    wCtx.arc(cx, cy + 4, outerR, 0, TWO_PI);
    wCtx.fillStyle = dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(16, 24, 20, 0.14)';
    wCtx.filter = 'blur(8px)';
    wCtx.fill();
    wCtx.restore();

    const rimGrad = wCtx.createLinearGradient(cx - outerR, cy - outerR, cx + outerR, cy + outerR);
    if (dark) {
      rimGrad.addColorStop(0, '#e8ce89');
      rimGrad.addColorStop(0.5, '#a98130');
      rimGrad.addColorStop(1, '#5e4312');
    } else {
      rimGrad.addColorStop(0, '#f3e1b0');
      rimGrad.addColorStop(0.45, '#c99e44');
      rimGrad.addColorStop(1, '#8c651d');
    }
    wCtx.beginPath();
    wCtx.arc(cx, cy, outerR, 0, TWO_PI);
    wCtx.fillStyle = rimGrad;
    wCtx.fill();

    wCtx.beginPath();
    wCtx.arc(cx, cy, wheelR + 2.5, 0, TWO_PI);
    wCtx.fillStyle = '#181c1a';
    wCtx.fill();

    const sectors = getWheelSectors(selectedPersonId);

    wCtx.save();
    wCtx.translate(cx, cy);
    wCtx.rotate(wheelAngle);

    for (const sec of sectors) {
      const opt = sec.option;
      const midAngle = (sec.startAngle + sec.endAngle) / 2;
      const span = sec.endAngle - sec.startAngle;

      const sliceGrad = wCtx.createRadialGradient(0, 0, 26, 0, 0, wheelR);
      sliceGrad.addColorStop(0, opt.colorDark);
      sliceGrad.addColorStop(0.58, opt.colorMain);
      sliceGrad.addColorStop(1, opt.colorLight);

      wCtx.beginPath();
      wCtx.moveTo(0, 0);
      wCtx.arc(0, 0, wheelR, sec.startAngle, sec.endAngle);
      wCtx.closePath();
      wCtx.fillStyle = sliceGrad;
      wCtx.fill();

      wCtx.strokeStyle = 'rgba(255, 248, 225, 0.42)';
      wCtx.lineWidth = 1.6;
      wCtx.stroke();

      if (span > 0.22) {
        wCtx.save();
        wCtx.rotate(midAngle);
        wCtx.textAlign = 'right';
        wCtx.textBaseline = 'middle';
        wCtx.fillStyle = '#ffffff';
        wCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        wCtx.shadowBlur = 3;

        const textR = wheelR - 17;
        const scale = size / 390;
        const fTop = Math.round((span < 0.5 ? 11.5 : 13.5) * scale);
        const fBot = Math.round((span < 0.5 ? 9 : 10) * scale);

        if (opt.wheelBottom) {
          wCtx.font = `700 ${fTop}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          wCtx.fillText(opt.wheelTop, textR, -6.5 * scale);
          wCtx.font = `600 ${fBot}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          wCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          wCtx.fillText(opt.wheelBottom, textR, 7.5 * scale);
        } else {
          wCtx.font = `700 ${fTop}px 'Plus Jakarta Sans', system-ui, sans-serif`;
          wCtx.fillText(opt.wheelTop, textR, 0);
        }
        wCtx.restore();
      }
    }

    wCtx.beginPath();
    wCtx.arc(0, 0, 44 * (size / 390), 0, TWO_PI);
    wCtx.strokeStyle = 'rgba(243, 225, 176, 0.65)';
    wCtx.lineWidth = 2;
    wCtx.stroke();

    for (const sec of sectors) {
      const px = Math.cos(sec.startAngle) * (wheelR + 5.5);
      const py = Math.sin(sec.startAngle) * (wheelR + 5.5);
      wCtx.beginPath();
      wCtx.arc(px, py, 3.5, 0, TWO_PI);
      wCtx.fillStyle = '#fff3cf';
      wCtx.fill();
      wCtx.strokeStyle = '#6c4d14';
      wCtx.lineWidth = 1.1;
      wCtx.stroke();
    }

    wCtx.restore();

    wCtx.save();
    wCtx.translate(cx, cy - outerR - 4);
    wCtx.rotate(pointerDeflection);

    wCtx.save();
    wCtx.shadowColor = 'rgba(0,0,0,0.35)';
    wCtx.shadowBlur = 5;
    wCtx.shadowOffsetY = 2;
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
    wCtx.restore();

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

    confettiParticles = Array.from({ length: 68 }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.9;
      const speed = 4 + Math.random() * 7.5;
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
        p.vy += 0.22;
        p.vx *= 0.988;
        p.rot += p.vrot;
        p.life -= 0.014;
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
  // 9. SPIN & MANUAL ASSIGNMENT ORCHESTRATION
  // =========================================================================
  async function spinWheel() {
    if (isSpinning) return;
    let emp = state.employees.find(e => e.id === selectedPersonId);
    if (!emp) {
      showToast('Primero selecciona a la persona que va a girar', '!');
      return;
    }

    if (!canSpinRoulette(emp.id)) {
      showToast(
        hasSpunRoulette(emp.id)
          ? `🔒 ${emp.name} ya tiró la ruleta. Solo se permite 1 giro por persona.`
          : `🔒 ${emp.name} ya tiene fecha de descanso asignada. Solo se permite 1 turno por persona.`,
        '🔒'
      );
      return;
    }

    if (syncUrl) {
      isSpinning = true;
      updateSpinButtons();
      document.getElementById('btnSpinText').textContent = 'Verificando...';
      await syncFromDrive({ silent: true });
      isSpinning = false;
      emp = state.employees.find(e => e.id === selectedPersonId);
      updateSpinButtons();
      if (!emp) return;
      if (!canSpinRoulette(emp.id)) {
        const existingOpt = state.assignments[emp.id] ? getOptionById(state.assignments[emp.id].optionId) : null;
        showToast(
          `🔒 ${emp.name} ya tiró la ruleta desde otro dispositivo${existingOpt ? ' (' + existingOpt.shortLabel + ')' : ''}. Solo se permite 1 giro por persona.`,
          '🔒'
        );
        return;
      }
    }

    executeSpin(emp);
  }

  function executeSpin(emp) {
    ensureAudio();
    isSpinning = true;
    document.getElementById('resultBanner').classList.add('hidden');
    updateSpinButtons();

    const sectors = getWheelSectors(emp.id);
    const winningSector = pickWinningSector(sectors);

    const u = 0.18 + cryptoRandomFloat() * 0.64;
    const targetLocalAngle = winningSector.startAngle + u * (winningSector.endAngle - winningSector.startAngle);
    const desiredMod = normalizeAngle(POINTER_SCREEN_ANGLE - targetLocalAngle);
    const currentMod = normalizeAngle(wheelAngle);
    const deltaMod = normalizeAngle(desiredMod - currentMod);
    const extraTurns = 6 + cryptoRandomInt(4);

    const startAngle = wheelAngle;
    const totalDelta = extraTurns * TWO_PI + deltaMod;
    const duration = 5000 + cryptoRandomInt(700);
    const startTime = performance.now();

    let lastSectorIdx = getSectorAtWheelAngle(wheelAngle, sectors).index;
    const liveTicker = document.getElementById('liveTicker');

    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 4.3);
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

      drawWheel();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        wheelAngle = normalizeAngle(startAngle + totalDelta);
        pointerDeflection = 0;
        drawWheel();
        commitAssignment(emp, winningSector.option, { forceOverwrite: false, isManual: false, manualReason: '' });
      }
    }

    requestAnimationFrame(animate);
  }

  async function commitAssignment(emp, option, { forceOverwrite = false, isManual = false, manualReason = '' } = {}) {
    isSpinning = false;
    const nowIso = new Date().toISOString();
    const prevAssignment = state.assignments[emp.id] ? { ...state.assignments[emp.id] } : null;

    // Hard safeguard: never overwrite an existing spin unless explicitly manual
    if (!isManual && !canSpinRoulette(emp.id)) {
      renderAll();
      showToast(`🔒 ${emp.name} ya tiró la ruleta. Solo se permite 1 giro por persona.`, '🔒');
      return;
    }

    state.assignments[emp.id] = {
      optionId: option.id,
      timestamp: nowIso,
      mode: isManual ? 'manual' : state.mode,
      isManual: Boolean(isManual),
      manualReason: String(manualReason || '').trim()
    };
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
      manualReason: String(manualReason || '').trim()
    };
    state.history.push(histItem);
    saveState();

    const canUndoManual = Boolean(isManual && (!prevAssignment || prevAssignment.isManual));
    lastFlashedId = emp.id;
    lastSpinRecord = canUndoManual ? { empId: emp.id, prevAssignment, histOrder: histItem.order, isManual: true } : null;

    if (isManual) {
      playManualAlertTone();
    } else {
      playWinChime();
      launchConfetti(option.colorMain);
    }

    let finalOption = option;
    let savedMsg = isManual
      ? '⚠️ ASIGNACIÓN MANUAL — No se giró la ruleta (guardado en el registro)'
      : 'Guardado automáticamente en el registro Excel (giro único registrado)';

    const banner = document.getElementById('resultBanner');
    banner.classList.toggle('manual', Boolean(isManual));
    document.getElementById('btnResultUndo').classList.toggle('hidden', !canUndoManual);

    if (syncUrl) {
      document.getElementById('resultSavedNote').textContent = isManual
        ? '⚠️ Guardando asignación manual (sin ruleta) en Google Drive...'
        : 'Guardando en Google Drive...';
      banner.classList.remove('hidden');

      const res = await postToDrive({
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
        forceOverwrite: Boolean(isManual && forceOverwrite)
      });

      if (res && res.conflict) {
        const remoteRec = state.assignments[emp.id];
        finalOption = getOptionById(res.existingOptionId)
          || (remoteRec && getOptionById(remoteRec.optionId))
          || (res.existingOptionLabel && state.options.find(o => o.label.toLowerCase() === String(res.existingOptionLabel).toLowerCase()))
          || option;
        savedMsg = '🔒 Esta persona ya había girado la ruleta (máx. 1 giro) — se conservó su resultado original en Drive';
        showToast(`🔒 ${emp.name} ya había tirado la ruleta (${finalOption.shortLabel}). Solo 1 giro por persona.`, '🔒');
      } else if (res && res.ok) {
        savedMsg = isManual
          ? '⚠️ ASIGNACIÓN MANUAL (sin girar la ruleta) — Guardado en Google Drive'
          : 'Guardado y sincronizado en vivo en Google Drive (giro único bloqueado)';
      } else if (res && res.error && String(res.error).includes('inválida')) {
        savedMsg = isManual
          ? '⚠️ ASIGNACIÓN MANUAL (sin ruleta) — Guardado localmente (actualiza Code.gs para sincronizar nuevas fechas)'
          : 'Guardado localmente (actualiza Code.gs en Drive para sincronizar nuevas fechas)';
        showToast('Actualiza Code.gs en Apps Script para guardar fechas nuevas en Drive.', 'ℹ');
      } else {
        savedMsg = isManual
          ? '⚠️ ASIGNACIÓN MANUAL (sin girar la ruleta) — Guardado localmente'
          : 'Guardado localmente (pendiente sincronizar con Drive)';
        showToast('Sin conexión con Drive. Guardado localmente.', '!');
      }
    }

    if (state.autoDownload) {
      downloadXlsx(true);
      savedMsg += ' · Excel descargado';
    }

    if (isManual) {
      showToast(`⚠️ Asignación manual a ${emp.name} (NO se tiró la ruleta)`, '⚠️');
    }

    document.getElementById('resultSavedNote').textContent = savedMsg;
    document.getElementById('resultWinnerName').textContent = `${emp.name} · ${emp.area}`;
    const pill = document.getElementById('resultDatePill');
    pill.textContent = isManual ? `Manual: ${finalOption.label}` : `Descanso: ${finalOption.label}`;
    pill.style.background = finalOption.pillBg;
    pill.style.color = finalOption.pillText;
    const reasonSuffix = isManual && manualReason ? ` · Motivo: ${manualReason}` : '';
    document.getElementById('resultDaysText').textContent = `${finalOption.days}${reasonSuffix}`;
    banner.classList.remove('hidden');

    document.getElementById('liveTicker').innerHTML = isManual
      ? `<span class="manual-badge">⚠️ Manual (sin ruleta)</span><strong style="color:var(--text);">${xmlEscape(finalOption.label)}</strong>`
      : `<span class="date-dot" style="background:${finalOption.colorMain};"></span><strong style="color:var(--text);">Resultado: ${xmlEscape(finalOption.label)}</strong>`;

    renderAll();
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
    const currentOptId = currentRec ? currentRec.optionId : state.options[0].id;
    document.getElementById('manualReasonInput').value = currentRec && currentRec.manualReason ? currentRec.manualReason : '';

    const listEl = document.getElementById('manualOptionsList');
    listEl.innerHTML = state.options.map((opt) => `
      <label class="manual-option-item">
        <div style="display:flex;align-items:center;gap:10px;min-width:0;">
          <input type="radio" name="manualDateOption" value="${xmlEscape(opt.id)}" ${opt.id === currentOptId ? 'checked' : ''} />
          <span class="date-dot" style="background:${opt.colorMain};"></span>
          <div style="min-width:0;">
            <strong style="font-size:13px;display:block;">${xmlEscape(opt.label)}</strong>
            <span style="font-size:11.5px;color:var(--text-muted);">${xmlEscape(opt.days)}</span>
          </div>
        </div>
        <span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(opt.shortLabel)}</span>
      </label>`).join('');

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

    const eqPct = formatPct(1 / Math.max(1, draftDates.length));
    previewEl.textContent = `${draftDates.length} fechas activas · Probabilidad igual: ${eqPct} cada una`;

    // Check if any originally assigned option was deleted in draft
    const draftIds = new Set(draftDates.map(d => d.id));
    const affectedCount = state.options
      .filter(o => !draftIds.has(o.id))
      .reduce((sum, o) => sum + (counts[o.id] || 0), 0);

    if (affectedCount > 0) {
      warnEl.textContent = `⚠️ Eliminaste una fecha que ya tenía ${affectedCount} colaborador(es) asignado(s). Al guardar, esas personas volverán a estado Pendiente.`;
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

    // Apply locally
    state.options = cleaned;
    for (const [empId, rec] of Object.entries(state.assignments)) {
      if (!nextIds.has(String(rec.optionId))) {
        delete state.assignments[empId];
      }
    }
    state.quotas = normalizeQuotas(state.quotas, state.options, state.employees.length);
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

    const dateSel = document.getElementById('tableDateFilter');
    const validIds = new Set(['ALL', 'ASSIGNED', 'PENDING', 'MANUAL', ...state.options.map(o => o.id)]);
    if (!validIds.has(tableDateFilter)) tableDateFilter = 'ALL';
    dateSel.innerHTML = `
      <option value="ALL">Todas las fechas y pendientes</option>
      <option value="ASSIGNED">Solo asignados</option>
      <option value="PENDING">Solo pendientes</option>
      <option value="MANUAL">Solo asignados manualmente (sin ruleta)</option>
      ${state.options.map(o => `<option value="${xmlEscape(o.id)}">${xmlEscape(o.label)}</option>`).join('')}`;
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
    document.getElementById('headerModeLabel').textContent = state.mode === 'equal'
      ? `Probabilidad igual (${eqPct} por fecha)`
      : `Cupos equilibrados (${state.options.length} fechas)`;
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
      const opt = rec ? getOptionById(rec.optionId) : null;
      const isSelected = emp.id === selectedPersonId;
      return `
        <button type="button" data-emp-id="${emp.id}" class="emp-row ${isSelected ? 'selected' : ''}">
          <div class="emp-info">
            <p class="emp-name truncate">${xmlEscape(emp.name)}</p>
            <p class="emp-area truncate">${xmlEscape(emp.area)}</p>
          </div>
          <div style="display:flex;align-items:center;gap:5px;">
            ${opt && rec.isManual ? '<span class="manual-badge" title="Asignado manualmente sin girar la ruleta">Manual</span>' : ''}
            ${opt
              ? `<span class="pill" style="background:${opt.pillBg};color:${opt.pillText};">${xmlEscape(opt.shortLabel)}</span>`
              : `<span class="pill ${isSelected ? 'pill-selected' : 'pill-pending'}">${isSelected ? 'Seleccionado' : 'Pendiente'}</span>`
            }
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

    if (!emp) {
      nameEl.textContent = 'Selecciona una persona de la lista para comenzar';
      areaEl.classList.add('hidden');
      limitChip.textContent = '1 giro por persona';
      limitChip.classList.remove('locked');
      metaEl.textContent = 'Haz clic en cualquier nombre o pulsa "Siguiente" para elegir al participante.';
      badgeWrap.classList.add('hidden');
    } else {
      nameEl.textContent = emp.name;
      areaEl.textContent = emp.area;
      areaEl.classList.remove('hidden');

      const rec = state.assignments[emp.id];
      const opt = rec ? getOptionById(rec.optionId) : null;
      const spunAlready = hasSpunRoulette(emp.id);

      if (rec && opt) {
        if (rec.isManual) {
          limitChip.textContent = spunAlready ? '🔒 Ya giró (1/1)' : '⚠️ Fecha manual';
          limitChip.classList.add('locked');
          metaEl.textContent = `⚠️ Asignado manualmente (sin girar la ruleta)${rec.manualReason ? ' · ' + rec.manualReason : ''}. La ruleta queda bloqueada para esta persona.`;
        } else {
          limitChip.textContent = '🔒 Ya giró (1/1)';
          limitChip.classList.add('locked');
          metaEl.textContent = `🔒 Ya realizó su único giro de ruleta${rec.timestamp ? ' (' + formatDateTimeEs(rec.timestamp) + ')' : ''}. Solo se permite 1 tiro por persona.`;
        }
        badgeEl.textContent = rec.isManual ? `⚠️ ${opt.shortLabel}` : opt.shortLabel;
        badgeEl.style.background = opt.pillBg;
        badgeEl.style.color = opt.pillText;
        badgeWrap.classList.remove('hidden');
      } else if (spunAlready) {
        limitChip.textContent = '🔒 Ya giró (1/1)';
        limitChip.classList.add('locked');
        metaEl.textContent = '🔒 Esta persona ya utilizó su único giro de ruleta. Solo se permite 1 tiro por persona.';
        badgeWrap.classList.add('hidden');
      } else {
        const eqPct = formatPct(1 / Math.max(1, state.options.length));
        const probs = getOptionProbabilitiesMap(emp.id);
        limitChip.textContent = '1 giro disponible';
        limitChip.classList.remove('locked');
        metaEl.textContent = state.mode === 'equal'
          ? `1 único giro permitido · Probabilidad idéntica: ${eqPct} para cada una de las ${state.options.length} fechas.`
          : `1 único giro permitido · Probabilidades activas: ${state.options.map(o => formatPct(probs[o.id] || 0)).join(' · ')}.`;
        badgeWrap.classList.add('hidden');
      }
    }
    updateSpinButtons();
  }

  function updateSpinButtons() {
    const emp = state.employees.find(e => e.id === selectedPersonId);
    const canSpin = Boolean(emp) && !isSpinning && canSpinRoulette(emp.id);
    const canManual = Boolean(emp) && !isSpinning;
    const btnMain = document.getElementById('btnSpinMain');
    const btnHub = document.getElementById('btnHubSpin');
    const btnManual = document.getElementById('btnManualAssign');
    const btnText = document.getElementById('btnSpinText');
    const hubTitle = document.getElementById('hubTitle');
    const hubSub = document.getElementById('hubSubtext');
    const eqPct = formatPct(1 / Math.max(1, state.options.length));

    btnMain.disabled = !canSpin;
    btnHub.disabled = !canSpin;
    btnManual.disabled = !canManual;

    if (isSpinning) {
      btnText.textContent = 'Girando...';
      hubTitle.textContent = '...';
      hubSub.textContent = 'Suerte';
    } else if (emp && hasSpunRoulette(emp.id)) {
      btnText.textContent = '🔒 Ya giró (1/1)';
      hubTitle.textContent = '🔒';
      hubSub.textContent = '1/1';
    } else if (emp && state.assignments[emp.id]) {
      btnText.textContent = '🔒 Ya tiene fecha';
      hubTitle.textContent = '🔒';
      hubSub.textContent = 'Manual';
    } else {
      btnText.textContent = 'Girar Ruleta';
      hubTitle.textContent = 'GIRAR';
      hubSub.textContent = state.mode === 'equal' ? eqPct : 'Urna';
    }
  }

  function renderDateCards() {
    const counts = getAssignedCountsMap();
    const probs = getOptionProbabilitiesMap(selectedPersonId);
    const grid = document.getElementById('dateCardsGrid');
    const eqPct = formatPct(1 / Math.max(1, state.options.length));

    document.getElementById('dateGridSummaryLabel').textContent = state.mode === 'equal'
      ? `${state.options.length} fechas en la ruleta · ${eqPct} cada una`
      : `${state.options.length} fechas en la ruleta · Cupos equilibrados`;

    grid.innerHTML = state.options.map((opt) => {
      const pct = formatPct(probs[opt.id] || 0);
      const count = counts[opt.id] || 0;
      const quotaInfo = state.mode === 'balanced' ? ` / ${state.quotas[opt.id] || 1}` : '';
      return `
        <div class="date-stat-card">
          <div class="date-stat-top">
            <span class="date-dot" style="background:${opt.colorMain};"></span>
            <span class="date-pct tabular">${pct}</span>
          </div>
          <div>
            <p class="date-label">${xmlEscape(opt.shortLabel)}</p>
            <p class="date-sub">${xmlEscape(opt.seasonTag)}</p>
          </div>
          <div class="date-footer">
            <span style="color:var(--text-muted);">Asignados</span>
            <strong class="tabular">${count}${quotaInfo}</strong>
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
        if (!rec || String(rec.optionId) !== String(tableDateFilter)) return false;
      }
      return true;
    });

    if (rows.length === 0) {
      regBody.innerHTML = `<tr><td colspan="7" class="center" style="padding:28px;color:var(--text-muted);">No hay registros para este filtro.</td></tr>`;
    } else {
      regBody.innerHTML = rows.map((emp, idx) => {
        const rec = state.assignments[emp.id];
        const opt = rec ? getOptionById(rec.optionId) : null;
        const spunAlready = hasSpunRoulette(emp.id);
        const flashClass = emp.id === lastFlashedId ? 'row-flash' : '';
        let actionHtml = '';
        if (rec) {
          if (rec.isManual && !spunAlready) {
            actionHtml = `<button type="button" data-action="manual" data-emp-id="${emp.id}" class="link-btn" style="margin-right:8px;">Manual</button>` +
              `<button type="button" data-action="clear" data-emp-id="${emp.id}" class="link-btn danger">Quitar</button>`;
          } else {
            actionHtml = `<span class="locked-tag" title="Ya realizó su único giro de ruleta">🔒 1/1</span>` +
              `<button type="button" data-action="manual" data-emp-id="${emp.id}" class="link-btn">Manual</button>`;
          }
        } else if (spunAlready) {
          actionHtml = `<span class="locked-tag" title="Ya realizó su único giro de ruleta">🔒 1/1</span>` +
            `<button type="button" data-action="manual" data-emp-id="${emp.id}" class="link-btn">Manual</button>`;
        } else {
          actionHtml = `<button type="button" data-action="select" data-emp-id="${emp.id}" class="link-btn" style="margin-right:8px;">Seleccionar</button>` +
            `<button type="button" data-action="manual" data-emp-id="${emp.id}" class="link-btn">Manual</button>`;
        }
        return `
          <tr class="${flashClass}">
            <td class="center tabular" style="color:var(--text-muted);">${idx + 1}</td>
            <td class="nowrap" style="color:var(--text-muted);">${xmlEscape(emp.area)}</td>
            <td style="font-weight:600;">${xmlEscape(emp.name)}</td>
            <td class="nowrap">
              ${opt
                ? `<span class="pill" style="background:${opt.pillBg};color:${opt.pillText};"><span class="date-dot" style="background:${opt.colorMain};width:7px;height:7px;"></span>${xmlEscape(opt.label)}</span>` +
                  (rec.isManual ? ` <span class="manual-badge" title="${xmlEscape(rec.manualReason || 'Asignación manual sin ruleta')}">⚠️ Manual</span>` : '')
                : `<span style="color:var(--text-muted);font-style:italic;">Pendiente</span>`
              }
            </td>
            <td class="nowrap" style="color:var(--text-muted);">${opt ? xmlEscape(opt.days) : '—'}</td>
            <td class="nowrap tabular" style="color:var(--text-muted);">${rec ? formatDateTimeEs(rec.timestamp) : '—'}</td>
            <td class="right nowrap">${actionHtml}</td>
          </tr>`;
      }).join('');
    }
    lastFlashedId = null;

    // ---- Tab 2: Dynamic Summary by Area ----
    const sumHead = document.getElementById('summaryThead');
    sumHead.innerHTML = `<tr>
      <th>Área</th>
      ${state.options.map(o => `<th class="center">${xmlEscape(o.shortLabel)}</th>`).join('')}
      <th class="center">Pendientes</th>
      <th class="center">Total</th>
    </tr>`;

    const sumBody = document.getElementById('summaryTbody');
    const areas = getUniqueAreas();
    const totals = Array(state.options.length + 2).fill(0);
    const areaHtml = areas.map(area => {
      const aEmps = state.employees.filter(e => e.area === area);
      const c = state.options.map(o => aEmps.filter(e => state.assignments[e.id]?.optionId === o.id).length);
      const pend = aEmps.filter(e => !state.assignments[e.id]).length;
      const tot = aEmps.length;
      c.forEach((v, i) => totals[i] += v);
      totals[state.options.length] += pend;
      totals[state.options.length + 1] += tot;
      return `
        <tr>
          <td style="font-weight:600;">${xmlEscape(area)}</td>
          ${c.map(v => `<td class="center tabular">${v}</td>`).join('')}
          <td class="center tabular" style="color:var(--text-muted);">${pend}</td>
          <td class="center tabular" style="font-weight:700;">${tot}</td>
        </tr>`;
    }).join('');

    sumBody.innerHTML = areaHtml + `
      <tr class="total-row">
        <td>TOTAL QUIRAMA</td>
        ${totals.slice(0, state.options.length).map(v => `<td class="center tabular">${v}</td>`).join('')}
        <td class="center tabular" style="color:var(--text-muted);">${totals[state.options.length]}</td>
        <td class="center tabular">${totals[state.options.length + 1]}</td>
      </tr>`;

    // ---- Tab 3: Chronological History ----
    const histBody = document.getElementById('historyTbody');
    if (state.history.length === 0) {
      histBody.innerHTML = `<tr><td colspan="6" class="center" style="padding:28px;color:var(--text-muted);">Aún no se ha realizado ningún registro.</td></tr>`;
    } else {
      histBody.innerHTML = [...state.history].reverse().map(item => {
        const opt = item.optionId !== null ? getOptionById(item.optionId) : null;
        const label = opt ? opt.label : (item.optionLabel || '—');
        const isMan = Boolean(item.isManual || item.mode === 'manual');
        const modeBadge = isMan
          ? `<span class="manual-badge">⚠️ Manual (sin ruleta)${item.manualReason ? ' · ' + xmlEscape(item.manualReason) : ''}</span>`
          : `<span style="color:var(--text-muted);">${item.mode === 'balanced' ? 'Cupos' : 'Ruleta equitativa'}</span>`;
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

  function syncSettingsModal() {
    const eqPct = formatPct(1 / Math.max(1, state.options.length));
    document.getElementById('settingsEqualTitle').textContent = `Probabilidad idéntica en cada giro — ${eqPct} por fecha (Recomendado)`;
    document.getElementById('settingsEqualDesc').textContent = `Cada persona tiene exactamente un ${eqPct} de probabilidad para cada una de las ${state.options.length} fechas activas sin importar el orden en que pase.`;

    document.querySelectorAll('input[name="probMode"]').forEach(r => {
      r.checked = r.value === state.mode;
    });
    renderQuotaInputs(state.quotas);
    document.getElementById('quotaInputsWrap').classList.toggle('hidden', state.mode !== 'balanced');
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
    } else if (btn.dataset.action === 'manual') {
      openManualAssignModal(empId);
    } else if (btn.dataset.action === 'clear') {
      if (hasSpunRoulette(empId)) {
        showToast(`🔒 ${emp.name} ya giró la ruleta. No se puede borrar su único giro.`, '🔒');
        return;
      }
      openConfirm(
        'Quitar asignación manual',
        `¿Deseas quitar la fecha manual de ${emp.name} y dejarlo como pendiente?`,
        async () => {
          delete state.assignments[empId];
          saveState();
          if (syncUrl) await postToDrive({ action: 'clearAssignment', empId });
          renderAll();
          showToast(`${emp.name} volvió a estado pendiente`, '↺');
        }
      );
    }
  });

  document.getElementById('btnPickNext').addEventListener('click', pickNextPending);
  document.getElementById('btnPickRandom').addEventListener('click', pickRandomPending);
  document.getElementById('btnSpinMain').addEventListener('click', spinWheel);
  document.getElementById('btnHubSpin').addEventListener('click', spinWheel);
  document.getElementById('btnManualAssign').addEventListener('click', () => openManualAssignModal(selectedPersonId));

  // Manual assign submit
  document.getElementById('formManualAssign').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emp = state.employees.find(x => x.id === selectedPersonId);
    const checked = document.querySelector('input[name="manualDateOption"]:checked');
    if (!emp || !checked) return;
    const opt = getOptionById(checked.value);
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
      const prevOpt = getOptionById(prevAssignment.optionId);
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
      if (canSpinRoulette(selectedPersonId)) {
        spinWheel();
      } else {
        const emp = state.employees.find(x => x.id === selectedPersonId);
        showToast(`🔒 ${emp ? emp.name : 'Esta persona'} ya tiene su turno asignado. Solo se permite 1 giro por persona.`, '🔒');
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

  // Reset all
  document.getElementById('btnResetAll').addEventListener('click', () => {
    openConfirm(
      '¿Reiniciar todo el sorteo?',
      syncUrl
        ? 'Se borrarán todas las fechas asignadas y el historial tanto aquí como en la hoja de Google Drive. Los colaboradores y las fechas configuradas se conservarán.'
        : 'Se borrarán todas las fechas asignadas y el historial de giros para empezar desde cero.',
      async () => {
        state.assignments = {};
        state.history = [];
        lastSpinRecord = null;
        saveState();
        if (syncUrl) await postToDrive({ action: 'resetAll' });
        document.getElementById('resultBanner').classList.add('hidden');
        document.getElementById('liveTicker').textContent = 'Listo para sortear';
        renderAll();
        showToast('Sorteo reiniciado desde cero', '↺');
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
    const even = normalizeQuotas(null, state.options, state.employees.length);
    renderQuotaInputs(even);
  });

  document.getElementById('btnSaveSettings').addEventListener('click', async () => {
    const checked = document.querySelector('input[name="probMode"]:checked');
    state.mode = checked ? checked.value : 'equal';
    const nextQuotas = {};
    document.querySelectorAll('.quota-input').forEach(inp => {
      nextQuotas[inp.dataset.optId] = Math.max(1, parseInt(inp.value, 10) || 1);
    });
    state.quotas = normalizeQuotas(nextQuotas, state.options, state.employees.length);
    saveState();
    closeModal('modalSettings');
    if (syncUrl) await postToDrive({ action: 'updateSettings', mode: state.mode, quotas: state.quotas });
    renderAll();
    const eqPct = formatPct(1 / Math.max(1, state.options.length));
    showToast(state.mode === 'equal' ? `Modo activo: Probabilidad igual (${eqPct} c/u)` : 'Modo activo: Cupos equilibrados', '✓');
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
        state = {
          ...defaultState(),
          ...parsed,
          options: opts,
          quotas: normalizeQuotas(parsed.quotas, opts, parsed.employees.length)
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
      if (e.target === backdrop) backdrop.classList.add('hidden');
    });
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && syncUrl && !isSpinning) {
      syncFromDrive({ silent: true });
    }
  });
  window.addEventListener('resize', setupWheelCanvas);

  // =========================================================================
  // 14. BOOT
  // =========================================================================
  initTheme();
  const firstPending = state.employees.find(e => !state.assignments[e.id]);
  if (firstPending) selectedPersonId = firstPending.id;
  setupWheelCanvas();
  renderAll();

  if (syncUrl) {
    syncFromDrive({ silent: true }).then(() => startPolling());
  }
})();
