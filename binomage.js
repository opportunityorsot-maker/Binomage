/* ============================================================
   BINOMAGE — Logique applicative v9 (production-ready)
   AEFC-INPHB · Cérémonie de parrainage 2026

   CORRECTIONS v9 :
   - Audio : warm-up unlock fiable (play/pause à volume 0)
   - Audio : scanAudio.loop = true (évite le silence si le MP3 est court)
   - Audio : fadeVolume() protégé contre les appels concurrents
   - Audio : gestion correcte des écrans liaison (toScan = scan, toCountdown = scan continue)
   - Audio : stopScan + stopAmbient appelés dans resetAndRestart
   - Audio : startScan direct sans setTimeout dans applyAudioForScreen
   - Nav : devNav masqué en stage-mode (production)
   - Fake : runFakeToRealSequence sécurisé contre la double navigation
   ============================================================ */

/* -----------------------------------------------------------
   1. DONNÉES
   ----------------------------------------------------------- */
const DB = {
  "AK47": { nom: "YASSI CHRISLAURE",                    filiere: "CCA", photo: "marraine/yassi.jpg" },
  "BN82": { nom: "TIOKARI AMADOU",                      filiere: "BFA", photo: "parrains/tiok.jpg" },
  "BJ15": { nom: "KOTOUDJE YANN-EVRARD",                filiere: "BFA", photo: "parrains/Yann-k.jpg" },
  "CM63": { nom: "DJIGUEMDE FATIMA ZARA",               filiere: "CCA", photo: "marraine/zara.jpg" },
  "CF29": { nom: "SANOGO ABOUBACAR SIDIK",              filiere: "CCA", photo: "parrains/sanogo.jpg" },
  "DE74": { nom: "WOUEDJE KASSI VIANNEY",               filiere: "CCA", photo: "parrains/marvin.jpg" },
  "DB31": { nom: "KONE KADIDJA KENZA IHSANE",           filiere: "BFA", photo: "marraine/ihsane.jpg" },
  "DI58": { nom: "DJOMANDE OUMAR AZIZ",                 filiere: "CCA", photo: "parrains/oumar.jpg" },
  "DJ06": { nom: "KOUO PIERRE-MARIE DANIEL",            filiere: "CCA", photo: "parrains/Daniel.jpg" },
  "DO93": { nom: "YOUGOUMA WENDYAM GRACE",              filiere: "BFA", photo: "marraine/wendy.jpg" },
  "EO42": { nom: "OUATTARA CHIENTCHON MOUMINE",         filiere: "BFA", photo: "parrains/moumine.jpg" },
  "EH17": { nom: "COULIBALY ABDOUL AZIZ",               filiere: "CCA", photo: "parrains/Aziz.jpg" },
  "HW85": { nom: "N'DRI ATTALIEL MOAYE",                filiere: "CCA", photo: "parrains/n'dri.jpg" },
  "KA39": { nom: "LEZOU EBA RENEE NANCY",               filiere: "CCA", photo: "marraine/lezou.jpg" },
  "KK71": { nom: "ODEHOURI-KOUDOU PAUL-ALEX",           filiere: "BFA", photo: "parrains/odk.jpg" },
  "KS24": { nom: "TOUAN LOU IRIE RUTH MARIE DANIELLE",  filiere: "CCA", photo: "marraine/LOU.jpg"  },
  "KE56": { nom: "KOUO PIERRE-MARIE DANIEL",            filiere: "CCA", photo: "parrains/Daniel.jpg" },
  "KA03": { nom: "LEZOU EBA RENEE NANCY",               filiere: "CCA", photo: "marraine/lezou.jpg" },
  "KC88": { nom: "DJIBO FAOUZIATOU",                    filiere: "BFA", photo: "marraine/faouzi.jpg" },
  "KD45": { nom: "BROU KOUAME EFFRIES",                 filiere: "CCA", photo: "parrains/effries.jpg" },
  "KP62": { nom: "OUATTARA HABIB TEYA SAVALGI",         filiere: "BFA", photo: "parrains/habib.jpg" },
  "KP19": { nom: "BODO ARMEL CHRIS YVAN",               filiere: "BFA", photo: "parrains/bodo.jpg" },
  "KJ37": { nom: "YALCOUYE AWA",                        filiere: "CCA", photo: "marraine/awa.jpg" },
  "KE91": { nom: "COULIBALY TCHEMON DIEUDONNE",         filiere: "CCA", photo: "parrains/dieudonné.jpg" },
  "KX54": { nom: "MARE ASMAOU",                         filiere: "CCA", photo: "marraine/mare.jpg" },
  "KM28": { nom: "ORSOT DAVID EMMANUEL",                filiere: "BFA", photo: "parrains/DAVID.jpg" },
  "MA76": { nom: "LOBE AKANETO RUTH ALEXANDRA",         filiere: "BFA", photo: "marraine/lobe.jpg" },
  "ML04": { nom: "TOUAN LOU IRIE RUTH MARIE DANIELLE",  filiere: "CCA", photo: "marraine/LOU.jpg"  },
  "MO67": { nom: "MARE ASMAOU",                         filiere: "CCA", photo: "marraine/mare.jpg" },
  "OD13": { nom: "DJOMANDE OUMAR AZIZ",                 filiere: "CCA", photo: "parrains/oumar.jpg" },
  "OF49": { nom: "ADJITIN PIERRE MARIE VINCENT",        filiere: "BFA", photo: "parrains/le P.jpg" },
  "SA86": { nom: "YALCOUYE AWA",                        filiere: "CCA", photo: "marraine/awa.jpg" },
  "SJ22": { nom: "KOKRA LYNE KEREN",                    filiere: "CCA", photo: "marraine/kokra.jpg" },
  "SK70": { nom: "YEO DELPHINE",                        filiere: "CCA", photo: "marraine/yeo.jpg" },
  "SW35": { nom: "OUATTARA ISMAËL",                     filiere: "CCA", photo: "parrains/ismo.jpg" },
  "SR08": { nom: "DOUMUN GUYMELA ARIEL MARC'ONEAL",     filiere: "BFA", photo: "parrains/doumun.jpg" },
  "SI64": { nom: "OUATTARA CHIENTCHON MOUMINE",         filiere: "BFA", photo: "parrains/moumine.jpg" },
  "SA51": { nom: "TRAORE BAKARY",                       filiere: "BFA", photo: "parrains/bakary.jpg" },
  "TD97": { nom: "SIDIBE DJAKARIDJA BABA",              filiere: "CCA", photo: "parrains/Djakis.jpg" },
  "YN33": { nom: "TOH KOUASSI ROXANE",                  filiere: "CCA", photo: "marraine/toh.jpg" },
  "YJ80": { nom: "ATANDA RIDWAN MATHIAS",               filiere: "CCA", photo: "parrains/atanda.jpg" },
  "YD16": { nom: "SANOGO ABOUBACAR SIDIK",              filiere: "CCA", photo: "parrains/sanogo.jpg" }
};

const FAKES = {
  "KC88": { nom: "LOBE AKANETO RUTH ALEXANDRA",        filiere: "BFA", photo: "marraine/lobe.jpg" },
  "BJ15": { nom: "OUATTARA HABIB TEYA SAVALGI",        filiere: "BFA", photo: "parrains/habib.jpg" },
  "EH17": { nom: "KOUO PIERRE-MARIE DANIEL",           filiere: "CCA", photo: "parrains/Daniel.jpg" },
  "ML04": { nom: "DJIGUEMDE FATIMA ZARA",              filiere: "CCA", photo: "marraine/zara.jpg" },
  "KE56": { nom: "COULIBALY TCHEMON DIEUDONNE",        filiere: "CCA", photo: "parrains/dieudonné.jpg" }
};

const QUOTES = {
  "BFA": "« Là où l'argent circule, l'intelligence guide. »",
  "CCA": "« La rigueur des chiffres au service de la décision. »"
};

const LOGOS = {
  "BFA": "logo_bfa.png",
  "CCA": "logo_cca.png"
};

const CONFETTI_COLORS = [
  '#C9A961', '#E0C788', '#F5E3B5',
  '#1E3A8A', '#2547AD', '#fff', '#0EA5E9'
];

const LIAISONS = {
  toSuspense:  "Un code. Un parcours. <em>Un binôme.</em>",
  toFiliere:   "Serez-vous un <em>Pur</em> ou un <em>Dur</em> ?",
  toScan:      "Maintenant, identifions <em>la personne.</em>",
  toCountdown: "Le moment est <em>venu.</em>"
};

const BFA_TICKER = [
  { sym: 'BNCI',       val: '+1.24%', up: true },
  { sym: 'SIB',        val: '+0.87%', up: true },
  { sym: 'SGBCI',      val: '-0.32%', up: false },
  { sym: 'BOA',        val: '+2.10%', up: true },
  { sym: 'CORIS',      val: '-0.05%', up: false },
  { sym: 'BICICI',     val: '+1.55%', up: true },
  { sym: 'NSIA',       val: '+0.73%', up: true },
  { sym: 'ATLANTIQUE', val: '-0.18%', up: false },
  { sym: 'ECOBANK',    val: '+0.94%', up: true },
  { sym: 'BFA·INPHB',  val: '+BINOMAGE', up: true },
  { sym: 'EUR/XOF',    val: '655.957', up: true },
  { sym: 'USD/XOF',    val: '+0.42%', up: true }
];

/* -----------------------------------------------------------
   2. UTILITAIRES
   ----------------------------------------------------------- */
const $  = (q, r = document) => r.querySelector(q);
const $$ = (q, r = document) => [...r.querySelectorAll(q)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const initials = name =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();

const resolvePhotoPath = photo => {
  if (!photo) return null;
  const match = photo.match(/^(parrains|marraine)\/(.+)$/);
  const path = match ? `Parrains et marraines/${match[2]}` : photo;
  return encodeURI(path);
};

const isMarraine = photo => photo && photo.startsWith('marraine/');

/* -----------------------------------------------------------
   3. ÉTAT GLOBAL
   ----------------------------------------------------------- */
const state = {
  current: '0',
  code: null,
  parrain: null,
  fake: null,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  stageRestartTimer: null,
  countdownTimers: [],
  liaisonTimers: [],
  genreTimers: [],
  introTimers: [],
  filieresOrbitId: null,
  fromOps: false,
  countdownActive: false,
  soundEnabled: false,
  fakeRevealActive: false,
  scanRunning: false,
  audioUnlocked: false  /* garde en mémoire si le contexte audio est débloqué */
};

function clearTimers(list) {
  list.forEach(t => { clearTimeout(t); clearInterval(t); });
  list.length = 0;
}

/* -----------------------------------------------------------
   4. SYSTÈME AUDIO MP3
   -----------------------------------------------------------
   Règles :
   - Écran 1          → silence total
   - Écrans 2-7, 99   → ambient en boucle (nastelbom)
   - liaison-toScan   → ambient continue (on est encore dans la zone "avant scan")
   - Écran 8          → coupe ambient, lance scan (solarflex) en boucle
   - liaison-toCountdown, genre, countdown, 10 → scan continue (ne pas y toucher)
   - Reset / retour   → tout couper, puis relancer selon l'écran cible
   ----------------------------------------------------------- */

const ambientAudio = new Audio('nastelbom-suspense-501709.mp3');
ambientAudio.loop   = true;
ambientAudio.volume = 0.55;

const scanAudio   = new Audio('solarflex-suspense-tension-515504.mp3');
scanAudio.loop    = true;   /* BOUCLE : évite le silence si le MP3 est court */
scanAudio.volume  = 0.75;

/* Intervals de fade en cours — un par piste pour éviter les conflits */
let ambientFadeId = null;
let scanFadeId    = null;

function loadSoundPref() {
  try { state.soundEnabled = localStorage.getItem('binomage_sound') !== '0'; }
  catch (e) { state.soundEnabled = true; }
  updateSoundButton();
}
function saveSoundPref() {
  try { localStorage.setItem('binomage_sound', state.soundEnabled ? '1' : '0'); } catch (e) {}
}
function updateSoundButton() {
  const btn = $('#soundToggle');
  if (!btn) return;
  btn.classList.toggle('muted', !state.soundEnabled);
  btn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
}
function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  saveSoundPref();
  updateSoundButton();
  if (!state.soundEnabled) {
    _hardStop(ambientAudio, 'ambient');
    _hardStop(scanAudio, 'scan');
  } else {
    applyAudioForScreen(state.current);
  }
}

/* Arrêt immédiat sans fondu (pour mute / reset) */
function _hardStop(audio, type) {
  if (type === 'ambient' && ambientFadeId) { clearInterval(ambientFadeId); ambientFadeId = null; }
  if (type === 'scan'    && scanFadeId)    { clearInterval(scanFadeId);    scanFadeId    = null; }
  audio.pause();
  audio.currentTime = 0;
  audio.volume = type === 'ambient' ? 0.55 : 0.75;
}

/* Fondu de volume — protégé contre les appels concurrents */
function _fade(audio, fadeKey, targetVol, duration, onComplete) {
  /* Annuler le fade précédent sur cette piste */
  if (fadeKey === 'ambient' && ambientFadeId) { clearInterval(ambientFadeId); ambientFadeId = null; }
  if (fadeKey === 'scan'    && scanFadeId)    { clearInterval(scanFadeId);    scanFadeId    = null; }

  const steps   = 25;
  const stepTime = Math.max(16, duration / steps);
  const startVol = audio.volume;
  const delta    = (targetVol - startVol) / steps;
  let step = 0;

  const id = setInterval(() => {
    step++;
    audio.volume = Math.max(0, Math.min(1, startVol + delta * step));
    if (step >= steps) {
      clearInterval(id);
      if (fadeKey === 'ambient') ambientFadeId = null;
      if (fadeKey === 'scan')    scanFadeId    = null;
      audio.volume = targetVol;
      onComplete?.();
    }
  }, stepTime);

  if (fadeKey === 'ambient') ambientFadeId = id;
  if (fadeKey === 'scan')    scanFadeId    = id;
}

function startAmbient() {
  if (!state.soundEnabled || !state.audioUnlocked) return;
  if (!ambientAudio.paused) return;
  ambientAudio.volume = 0;
  ambientAudio.play().catch(() => {});
  _fade(ambientAudio, 'ambient', 0.55, 1200);
}

function stopAmbient() {
  if (ambientAudio.paused) return;
  _fade(ambientAudio, 'ambient', 0, 700, () => {
    ambientAudio.pause();
    ambientAudio.currentTime = 0;
    ambientAudio.volume = 0.55;
  });
}

function startScan() {
  if (!state.soundEnabled || !state.audioUnlocked) return;
  if (!scanAudio.paused) return;
  scanAudio.currentTime = 0;
  scanAudio.volume = 0.75;
  scanAudio.play().catch(() => {});
}

function stopScan() {
  if (scanAudio.paused) return;
  _fade(scanAudio, 'scan', 0, 700, () => {
    scanAudio.pause();
    scanAudio.currentTime = 0;
    scanAudio.volume = 0.75;
  });
}

/*
  Logique audio par écran.

  Zones :
  ┌─ SILENCE   : écran 1
  ├─ AMBIENT   : écrans 2 3 liaison-* 4 5 6 7 99
  │              (liaison-toScan inclus : ambient jusqu'à l'écran 8)
  └─ SCAN      : écran 8, liaison-toCountdown, genre, countdown, 10
*/
function applyAudioForScreen(screenId) {
  const s = String(screenId);

  /* Silence : intro */
  if (s === '1') {
    stopAmbient();
    stopScan();
    return;
  }

  /* Zone SCAN : commence à l'écran 8 et continue jusqu'à l'écran 10 inclus */
  const SCAN_ZONE = new Set(['8', 'liaison-toCountdown', 'genre', 'countdown', '10']);
  if (SCAN_ZONE.has(s)) {
    stopAmbient();
    if (s === '8') {
      /* Point d'entrée : lancer le scan */
      startScan();
    }
    /* Pour les autres écrans de la zone : le scan est déjà lancé, ne pas y toucher */
    return;
  }

  /* Zone AMBIENT : tous les autres écrans */
  stopScan();
  startAmbient();
}

/* -----------------------------------------------------------
   5. STOCKAGE PERSISTANT
   ----------------------------------------------------------- */
const HISTORY_KEY = 'binomage_session_v1';
function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { return []; }
}
function saveHistory(h) {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); } catch (e) {}
}
function addHistory(code, nom) {
  const h = loadHistory(); h.unshift({ code, nom, ts: Date.now() }); saveHistory(h.slice(0, 50));
}
function clearHistory() { saveHistory([]); }
function isUsed(code) { return loadHistory().some(e => e.code === code); }

/* -----------------------------------------------------------
   6. UNIVERS BFA / CCA
   ----------------------------------------------------------- */
let bfaUniverse = null;
let ccaUniverse = null;

function createBFAUniverse() {
  if (bfaUniverse) return bfaUniverse;
  bfaUniverse = document.createElement('div');
  bfaUniverse.className = 'universe-bfa';
  bfaUniverse.innerHTML = `
    <div class="bfa-grid-lines"></div>
    <div class="bfa-stamp">BFA · BOURSE RÉGIONALE · INPHB 2026</div>
    <div class="bfa-corner tl"></div>
    <div class="bfa-corner tr"></div>
    <div class="bfa-corner bl"></div>
    <div class="bfa-corner br"></div>
    <div class="bfa-curve">
      <svg viewBox="0 0 1200 400" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bfaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(201,169,97,0.4)"/>
            <stop offset="100%" stop-color="rgba(201,169,97,0)"/>
          </linearGradient>
        </defs>
        <path class="fill" d="M0,260 C100,220 180,280 280,200 C380,140 460,260 560,180 C660,120 740,220 840,160 C940,100 1020,200 1120,140 L1200,140 L1200,400 L0,400 Z"/>
        <path class="line" d="M0,260 C100,220 180,280 280,200 C380,140 460,260 560,180 C660,120 740,220 840,160 C940,100 1020,200 1120,140 L1200,140"/>
        <path class="line secondary" d="M0,320 C120,300 200,330 320,290 C440,250 520,310 640,270 C760,230 840,290 960,250 C1080,210 1140,260 1200,240"/>
      </svg>
    </div>
    <div class="bfa-ticker">
      <div class="bfa-ticker-inner" id="bfaTickerInner"></div>
    </div>
  `;
  document.body.appendChild(bfaUniverse);
  const inner = bfaUniverse.querySelector('#bfaTickerInner');
  const html = BFA_TICKER.map(i =>
    `<div class="bfa-ticker-item ${i.up ? 'up' : 'down'}">
      <span class="sym">${i.sym}</span><span class="val">${i.val}</span>
    </div>`
  ).join('');
  inner.innerHTML = html + html;
  return bfaUniverse;
}

function createCCAUniverse() {
  if (ccaUniverse) return ccaUniverse;
  ccaUniverse = document.createElement('div');
  ccaUniverse.className = 'universe-cca';
  ccaUniverse.innerHTML = `
    <div class="cca-paper"></div>
    <div class="cca-watermark"></div>
    <div class="cca-margin left"></div>
    <div class="cca-margin right"></div>
    <div class="cca-stamp-bg s1">AUDIT</div>
    <div class="cca-stamp-bg s2">CONTRÔLE</div>
    <div class="cca-stamp-bg s3">CCA</div>
    <div class="cca-header-strip">
      <span>Exercice 2025—2026</span>
      <span>AEFC · INPHB</span>
      <span>Confidentiel</span>
    </div>
    <div class="cca-footer-strip">
      <span>Réf. CCA-2026</span>
      <span>Folio · Binomage</span>
      <span>${new Date().toLocaleDateString('fr-FR')}</span>
    </div>
  `;
  document.body.appendChild(ccaUniverse);
  return ccaUniverse;
}

function showUniverse(filiere) {
  if (bfaUniverse) bfaUniverse.classList.remove('visible');
  if (ccaUniverse) ccaUniverse.classList.remove('visible');
  document.body.classList.remove('in-universe-bfa', 'in-universe-cca');
  if (filiere === 'BFA') {
    const u = createBFAUniverse();
    requestAnimationFrame(() => setTimeout(() => {
      u.classList.add('visible');
      document.body.classList.add('in-universe-bfa');
    }, 50));
  } else if (filiere === 'CCA') {
    const u = createCCAUniverse();
    requestAnimationFrame(() => setTimeout(() => {
      u.classList.add('visible');
      document.body.classList.add('in-universe-cca');
    }, 50));
  }
}

function hideUniverse() {
  if (bfaUniverse) bfaUniverse.classList.remove('visible');
  if (ccaUniverse) ccaUniverse.classList.remove('visible');
  document.body.classList.remove('in-universe-bfa', 'in-universe-cca');
}

/* -----------------------------------------------------------
   7. AIGUILLAGE DES ÉCRANS
   ----------------------------------------------------------- */
const screens = $$('.screen');

function showScreen(n) {
  state.current = String(n);
  screens.forEach(s => s.classList.remove('active'));

  const targetId = (typeof n === 'string' && n.startsWith('liaison-'))
    ? 'screen-liaison'
    : 'screen-' + n;
  const el = $('#' + targetId);
  if (!el) return;
  el.classList.add('active');

  applyAudioForScreen(state.current);

  const stage = $('#stage');
  stage.classList.remove('dark', 'intro-dark', 'reveal-dark');
  document.body.classList.remove('dark');

  const darkScreens = ['4', 'countdown', 'genre'];
  if (darkScreens.includes(state.current) || state.current.startsWith('liaison-')) {
    stage.classList.add('dark');
    document.body.classList.add('dark');
  }
  if (state.current === '10') {
    stage.classList.add('reveal-dark');
    document.body.classList.add('dark');
  }

  const universeScreens = ['7', '8', 'liaison-toScan'];
  if (!universeScreens.includes(state.current)) {
    hideUniverse();
  }

  if (state.stageRestartTimer && state.current !== '10') {
    clearInterval(state.stageRestartTimer);
    state.stageRestartTimer = null;
    const sr = $('#stageRestart');
    if (sr) { sr.classList.remove('in'); sr.style.display = 'none'; }
  }

  $$('.fade-up', el).forEach((node, i) => {
    node.classList.remove('in');
    setTimeout(() => node.classList.add('in'), 80 * i + 60);
  });

  if (state.current === '1')         runIntro();
  if (state.current === '4')         runSuspense();
  if (state.current === '5')         runSphere();
  if (state.current === '6')         runFilieres();
  if (state.current === '7')         runSpecialty();
  if (state.current === '8')         runScan();
  if (state.current === 'countdown') runCountdown();
  if (state.current === 'genre')     runGenreReveal();
  if (state.current === '10')        runReveal();
  if (state.current === '99')        runOps();
  if (state.current.startsWith('liaison-')) {
    const key = state.current.replace('liaison-', '');
    if (key === 'toScan' && state.parrain) showUniverse(state.parrain.filiere);
    runLiaison(LIAISONS[key], () => {
      if (key === 'toSuspense')       showScreen(4);
      else if (key === 'toFiliere')   showScreen(6);
      else if (key === 'toScan')      showScreen(8);
      else if (key === 'toCountdown') showScreen('genre');
    });
  }

  $$('#devNav button').forEach(b => {
    b.classList.toggle('active', b.dataset.go === state.current);
  });
}

/* -----------------------------------------------------------
   8. ÉCRANS LIAISON
   ----------------------------------------------------------- */
function runLiaison(html, onDone) {
  if (!html) { onDone?.(); return; }
  clearTimers(state.liaisonTimers);

  const textEl = $('#liaisonText');
  const lineEl = $('#liaisonLine');

  const tokenized = html.split(/(<em>.*?<\/em>|\s+)/).filter(s => s && s.trim());
  textEl.innerHTML = tokenized.map(tok => {
    if (tok.startsWith('<em>')) {
      const inner = tok.replace(/<\/?em>/g, '');
      const words = inner.split(/\s+/);
      return '<em>' + words.map(w => `<span class="lw">${w}</span>`).join(' ') + '</em>';
    }
    return tok.split(/\s+/).map(w => `<span class="lw">${w}</span>`).join(' ');
  }).join(' ');

  lineEl.classList.remove('in', 'out');

  const words = $$('.lw', textEl);
  words.forEach((w, i) => {
    state.liaisonTimers.push(setTimeout(() => w.classList.add('in'), 90 * i + 120));
  });
  state.liaisonTimers.push(setTimeout(() => lineEl.classList.add('in'), 400));

  const readDuration = state.reducedMotion ? 800 : Math.max(1800, words.length * 90 + 1400);

  state.liaisonTimers.push(setTimeout(() => {
    words.forEach((w, i) => setTimeout(() => {
      w.classList.remove('in'); w.classList.add('out');
    }, 30 * i));
    lineEl.classList.remove('in'); lineEl.classList.add('out');
  }, readDuration));

  state.liaisonTimers.push(setTimeout(() => onDone?.(), readDuration + 700));
}

/* -----------------------------------------------------------
   9. ÉCRAN 1 — INTRO
   ----------------------------------------------------------- */
function runIntro() {
  clearTimers(state.introTimers);

  const wrapper       = $('#introRollingWrapper');
  const logoArea      = $('#introLogoArea');
  const logoContainer = $('#introLogoContainer');
  const shine         = $('#introMetalShine');
  const impact        = $('#introImpactPoint');
  const contentSide   = $('#introContentSide');
  const textAefc      = $('#introTextAefc');
  const textBinomage  = $('#introTextBinomage');
  const tagline       = $('#introTaglineBottom');

  wrapper.style.cssText = '';
  logoArea.classList.remove('shifted');
  logoArea.style.cssText = '';
  logoContainer.classList.remove('drop');
  logoContainer.style.cssText = '';
  shine.classList.remove('sweep'); shine.style.left = '';
  impact.classList.remove('flash');
  contentSide.classList.remove('visible', 'in');
  contentSide.style.display = 'none'; contentSide.style.opacity = '';
  textAefc.classList.remove('in'); textAefc.style.opacity = '0';
  textBinomage.classList.remove('in'); textBinomage.style.opacity = '0';
  tagline.classList.remove('in'); tagline.style.opacity = '0';

  if (state.reducedMotion) {
    logoContainer.style.cssText = 'transform:translateY(0) scale(1); opacity:1;';
    contentSide.style.display = 'flex';
    contentSide.style.opacity = '1';
    textBinomage.style.opacity = '1';
    tagline.style.opacity = '1';
    state.introTimers.push(setTimeout(() => {
      if (state.current === '1') showScreen(2);
    }, 1500));
    return;
  }

  state.introTimers.push(setTimeout(() => {
    void logoContainer.offsetWidth;
    logoContainer.classList.add('drop');
    impact.classList.add('flash');
  }, 300));

  state.introTimers.push(setTimeout(() => {
    shine.classList.add('sweep');
  }, 2900));

  state.introTimers.push(setTimeout(() => {
    logoArea.classList.add('shifted');
  }, 5200));

  state.introTimers.push(setTimeout(() => {
    contentSide.style.display = 'flex';
    contentSide.style.opacity = '';
    requestAnimationFrame(() => requestAnimationFrame(() => contentSide.classList.add('in')));
  }, 6100));

  state.introTimers.push(setTimeout(() => {
    textAefc.style.opacity = '';
    textAefc.classList.add('in');
  }, 6500));

  state.introTimers.push(setTimeout(() => {
    textBinomage.style.opacity = '';
    textBinomage.classList.add('in');
  }, 9500));

  state.introTimers.push(setTimeout(() => {
    tagline.style.opacity = '';
    tagline.classList.add('in');
  }, 10600));

  state.introTimers.push(setTimeout(() => {
    if (state.current === '1') showScreen(2);
  }, 13000));
}

/* -----------------------------------------------------------
   10. ÉCRAN 3 — SAISIE DU CODE
   ----------------------------------------------------------- */
function setupCodeInputs() {
  const inputs = $$('.code-input');
  inputs.forEach((inp, i) => {
    inp.addEventListener('input', e => {
      const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      e.target.value = v;
      if (v && i < 3) inputs[i + 1].focus();
      inp.classList.toggle('filled', !!v);
      tryValidateCode();
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && i > 0) {
        inputs[i - 1].focus(); inputs[i - 1].value = '';
        inputs[i - 1].classList.remove('filled');
      }
      if (e.key === 'ArrowLeft'  && i > 0) inputs[i - 1].focus();
      if (e.key === 'ArrowRight' && i < 3) inputs[i + 1].focus();
    });
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const txt = (e.clipboardData.getData('text') || '')
        .toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
      [...txt].forEach((c, k) => {
        if (inputs[k]) { inputs[k].value = c; inputs[k].classList.add('filled'); }
      });
      if (inputs[Math.min(txt.length, 3)]) inputs[Math.min(txt.length, 3)].focus();
      tryValidateCode();
    });
  });
}

function tryValidateCode() {
  const code = $$('.code-input').map(i => i.value).join('');
  if (code.length < 4) return;
  const msg = $('#codeMsg');
  if (DB[code]) {
    state.code = code;
    state.parrain = DB[code];
    state.fake = FAKES[code] || null;
    msg.textContent = 'Accès accordé.';
    msg.classList.remove('err'); msg.classList.add('ok');
    setTimeout(() => showScreen('liaison-toSuspense'), 700);
  } else {
    msg.textContent = 'Code invalide. Vérifiez votre invitation.';
    msg.classList.add('err'); msg.classList.remove('ok');
    $('#codeInputs').classList.add('code-error');
    setTimeout(() => $('#codeInputs').classList.remove('code-error'), 500);
    setTimeout(() => {
      $$('.code-input').forEach(i => { i.value = ''; i.classList.remove('filled'); });
      $$('.code-input')[0].focus();
      msg.textContent = '\u00A0'; msg.classList.remove('err');
    }, 1400);
  }
}

/* -----------------------------------------------------------
   11. ÉCRAN 4 — SUSPENSE
   ----------------------------------------------------------- */
function runSuspense() {
  const words = $$('.suspense-text .word');
  words.forEach(w => w.classList.remove('in'));
  words.forEach((w, i) => setTimeout(() => w.classList.add('in'), 120 * i + 200));
  const dur = state.reducedMotion ? 1200 : (words.length * 120 + 1800);
  setTimeout(() => { if (state.current === '4') showScreen(5); }, dur);
}

/* -----------------------------------------------------------
   12. ÉCRAN 5 — SPHÈRE
   ----------------------------------------------------------- */
let sphereAnimId = null;

function runSphere() {
  const canvas = $('#sphereCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const N = state.reducedMotion ? 80 : 300;
  const particles = [];

  for (let i = 0; i < N; i++) {
    const angle = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 320 + Math.random() * 80;
    particles.push({
      angle, phi, r0: r, r: r,
      target: 200 + Math.random() * 30,
      speed: 0.3 + Math.random() * 0.4,
      size: 1 + Math.random() * 1.6,
      twinkle: Math.random()
    });
  }

  let t0 = performance.now();
  const DURATION = state.reducedMotion ? 400 : 2200;

  if (sphereAnimId) cancelAnimationFrame(sphereAnimId);
  $('#sphereCore').classList.remove('in');
  $('#sphereCode').textContent = '— — — —';

  function frame(t) {
    const elapsed = t - t0;
    const p = Math.min(elapsed / DURATION, 1);
    const e = 1 - Math.pow(1 - p, 3);

    ctx.clearRect(0, 0, W, H);
    const haloR = 40 + e * 120;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
    grad.addColorStop(0, `rgba(14,165,233,${0.22 * e})`);
    grad.addColorStop(1, 'rgba(14,165,233,0)');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, haloR, 0, Math.PI * 2); ctx.fill();

    particles.forEach(pt => {
      pt.r = pt.r0 + (pt.target - pt.r0) * e;
      pt.angle += 0.003 * pt.speed * (state.reducedMotion ? 0 : 1);
      const x = cx + Math.cos(pt.angle) * Math.sin(pt.phi) * pt.r;
      const y = cy + Math.sin(pt.angle) * Math.sin(pt.phi) * pt.r;
      const depth = Math.cos(pt.phi);
      const alpha = (0.35 + 0.65 * (depth + 1) / 2) * (0.4 + 0.6 * e);
      ctx.fillStyle = `rgba(30,58,138,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, pt.size * (0.8 + 0.4 * (depth + 1) / 2), 0, Math.PI * 2);
      ctx.fill();
    });

    if (p > 0.6) {
      const ringP = (p - 0.6) / 0.4;
      ctx.strokeStyle = `rgba(30,58,138,${0.4 * ringP})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, 220 + ringP * 20, 0, Math.PI * 2); ctx.stroke();
    }
    if (p < 1) sphereAnimId = requestAnimationFrame(frame);
    else       sphereAnimId = requestAnimationFrame(idle);
  }

  function idle(t) {
    const elapsed = t - t0;
    ctx.clearRect(0, 0, W, H);
    particles.forEach(pt => {
      pt.angle += 0.0015 * pt.speed * (state.reducedMotion ? 0 : 1);
      const breathe = Math.sin((elapsed + pt.twinkle * 1000) / 1200) * 8;
      const x = cx + Math.cos(pt.angle) * Math.sin(pt.phi) * (pt.target + breathe);
      const y = cy + Math.sin(pt.angle) * Math.sin(pt.phi) * (pt.target + breathe);
      const depth = Math.cos(pt.phi);
      const alpha = 0.3 + 0.5 * (depth + 1) / 2;
      ctx.fillStyle = `rgba(30,58,138,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, pt.size, 0, Math.PI * 2); ctx.fill();
    });
    sphereAnimId = requestAnimationFrame(idle);
  }

  sphereAnimId = requestAnimationFrame(frame);

  setTimeout(() => {
    $('#sphereCode').textContent = state.code || 'XXXX';
    $('#sphereCore').classList.add('in');
  }, DURATION - 400);

  setTimeout(() => { if (state.current === '5') showScreen('liaison-toFiliere'); }, DURATION + 1600);
}

/* -----------------------------------------------------------
   13. ÉCRAN 6 — ORBITE + DUEL DES FILIÈRES
   ----------------------------------------------------------- */
function runFilieres() {
  const winner   = state.parrain ? state.parrain.filiere : 'CCA';
  const loserKey = winner === 'BFA' ? 'CCA' : 'BFA';
  const cardWin  = $('#card' + winner);
  const cardLose = $('#card' + loserKey);
  const wrap     = $('#filieresWrap');

  hideUniverse();

  if (state.filieresOrbitId) {
    cancelAnimationFrame(state.filieresOrbitId);
    state.filieresOrbitId = null;
  }

  wrap.classList.remove('orbiting');
  cardWin.classList.remove('loser', 'winner');
  cardLose.classList.remove('loser', 'winner');
  cardWin.style.cssText  = '';
  cardLose.style.cssText = '';

  if (state.reducedMotion) {
    cardWin.classList.add('winner');
    cardLose.classList.add('loser');
    setTimeout(() => { if (state.current === '6') showScreen(7); }, 1800);
    return;
  }

  wrap.classList.add('orbiting');

  const ORBIT_RX = Math.min(220, window.innerWidth * 0.28);
  const ORBIT_RY = 90;
  const TOTAL_DURATION = 3600;
  let startTime = null;
  let orbitRunning = true;

  function frame(ts) {
    if (!orbitRunning) return;
    if (!startTime) startTime = ts;
    const elapsed  = ts - startTime;
    const progress = Math.min(elapsed / TOTAL_DURATION, 1);

    const speed = 2.2 + progress * 0.8;
    const angle = (elapsed / 1000) * speed * Math.PI * 2 * 0.3;
    const a1 = angle, a2 = angle + Math.PI;

    const x1 = Math.cos(a1) * ORBIT_RX, y1 = Math.sin(a1) * ORBIT_RY;
    const x2 = Math.cos(a2) * ORBIT_RX, y2 = Math.sin(a2) * ORBIT_RY;
    const z1 = Math.sin(a1), z2 = Math.sin(a2);
    const scale1   = 0.82 + 0.18 * ((z1 + 1) / 2);
    const scale2   = 0.82 + 0.18 * ((z2 + 1) / 2);
    const opacity1 = 0.45 + 0.55 * ((z1 + 1) / 2);
    const opacity2 = 0.45 + 0.55 * ((z2 + 1) / 2);

    cardWin.style.transform = `translate(calc(${x1}px - 50%), calc(${y1}px - 50%)) scale(${scale1})`;
    cardWin.style.opacity   = String(opacity1);
    cardWin.style.zIndex    = z1 > 0 ? '10' : '2';

    cardLose.style.transform = `translate(calc(${x2}px - 50%), calc(${y2}px - 50%)) scale(${scale2})`;
    cardLose.style.opacity   = String(opacity2);
    cardLose.style.zIndex    = z2 > 0 ? '10' : '2';

    if (progress < 1) {
      state.filieresOrbitId = requestAnimationFrame(frame);
    } else {
      orbitRunning = false;
      finalizeFiliere(cardWin, cardLose, wrap);
    }
  }

  state.filieresOrbitId = requestAnimationFrame(frame);
}

function finalizeFiliere(cardWin, cardLose, wrap) {
  if (state.filieresOrbitId) {
    cancelAnimationFrame(state.filieresOrbitId);
    state.filieresOrbitId = null;
  }

  wrap.classList.remove('orbiting');
  cardWin.style.cssText  = 'opacity:0; transform: scale(0.9);';
  cardLose.style.cssText = 'opacity:0; transform: scale(0.9);';

  setTimeout(() => {
    const tr = 'opacity 600ms var(--ease-expo), transform 600ms var(--ease-expo)';
    cardWin.style.transition  = tr;
    cardLose.style.transition = tr;
    cardWin.style.opacity  = '1'; cardLose.style.opacity  = '1';
    cardWin.style.transform  = ''; cardLose.style.transform = '';
  }, 60);

  setTimeout(() => {
    cardWin.style.transform  = 'scale(1.03)';
    cardLose.style.transform = 'scale(1.03)';
  }, 780);

  setTimeout(() => {
    cardWin.style.cssText  = '';
    cardLose.style.cssText = '';
    cardWin.classList.add('winner');
    cardLose.classList.add('loser');
  }, 1380);

  setTimeout(() => {
    if (state.current === '6') showScreen(7);
  }, 4200);
}

/* -----------------------------------------------------------
   14. ÉCRAN 7 — SPÉCIALITÉ
   ----------------------------------------------------------- */
function runSpecialty() {
  const f = state.parrain ? state.parrain.filiere : 'CCA';

  showUniverse(f);

  const logoEl    = $('#specialtyLogo');
  const targetSrc = LOGOS[f];

  logoEl.classList.remove('loaded');
  logoEl.style.removeProperty('opacity');
  logoEl.alt = f;
  logoEl.src = '';

  const img = new Image();
  img.onload = () => {
    logoEl.style.removeProperty('opacity');
    logoEl.src = img.src;
    setTimeout(() => logoEl.classList.add('loaded'), 200);
  };
  img.onerror = () => { logoEl.src = targetSrc; logoEl.classList.add('loaded'); };
  img.src = targetSrc;
  if (img.complete) img.onload();

  $('#specialtyName').textContent  = (f === 'BFA') ? 'Banque Finance Assurance' : 'Comptabilité Contrôle Audit';
  $('#specialtyQuote').textContent = QUOTES[f];

  setTimeout(() => {
    if (state.current === '7') showScreen('liaison-toScan');
  }, state.reducedMotion ? 1400 : 3600);
}

/* -----------------------------------------------------------
   15. ÉCRAN 8 — SCAN DES PARRAINS
   ----------------------------------------------------------- */
function runScan() {
  if (state.parrain) showUniverse(state.parrain.filiere);

  state.scanRunning = false;

  const track = $('#scanTrack');
  track.innerHTML = '';
  track.style.transform  = '';
  track.style.transition = 'none';

  const real = state.parrain;

  const allInFiliere = Object.values(DB).filter(p => p.filiere === real.filiere);
  const unique = [];
  const seen   = new Set();
  allInFiliere.forEach(p => {
    if (!seen.has(p.nom)) { seen.add(p.nom); unique.push(p); }
  });

  const MIN_ITEMS = 10;
  let shuffled = [...unique].sort(() => Math.random() - 0.5);
  while (shuffled.length < MIN_ITEMS) {
    shuffled = [...shuffled, ...unique.sort(() => Math.random() - 0.5)];
  }

  const minReal = Math.max(3, Math.floor(shuffled.length * 0.25));
  const maxReal = Math.floor(shuffled.length * 0.65);
  const realIdx = minReal + Math.floor(Math.random() * (maxReal - minReal + 1));
  shuffled.splice(realIdx, 0, { ...real, _real: true });

  const afterReal      = shuffled.slice(realIdx + 1);
  const stopCandidates = afterReal.filter(p => !p._fake);
  let stopPerson = stopCandidates[Math.floor(Math.random() * stopCandidates.length)];
  if (!stopPerson) {
    const fallback = shuffled.slice(realIdx + 1).find(p => !p._fake && !p._real);
    if (fallback) {
      stopPerson = fallback;
    } else {
      const neutral = { ...Object.values(DB).find(p => p.filiere === real.filiere), _stop: true };
      shuffled.push(neutral);
      stopPerson = shuffled[shuffled.length - 1];
    }
  }
  stopPerson._stop = true;

  const sequence    = shuffled;
  const realPosition = sequence.findIndex(p => p._real);

  sequence.forEach((p, idx) => {
    const row    = document.createElement('div');
    row.className = 'scan-item'; row.dataset.idx = idx;
    const avatar = document.createElement('div');
    avatar.className = 'scan-avatar placeholder';
    avatar.textContent = initials(p.nom);
    if (p.photo) {
      const img = document.createElement('img');
      img.src = resolvePhotoPath(p.photo); img.alt = p.nom;
      img.onload = () => {
        avatar.textContent = '';
        avatar.classList.remove('placeholder');
        avatar.appendChild(img);
      };
    }
    const info = document.createElement('div');
    info.className = 'scan-info';
    info.innerHTML = `<div class="scan-name">${p.nom}</div><div class="scan-filiere">${p.filiere}</div>`;
    row.appendChild(avatar); row.appendChild(info); track.appendChild(row);
  });

  const items  = $$('.scan-item', track);
  const ITEM_H = window.matchMedia('(max-width:760px)').matches ? 100 : 120;

  track.style.transition = 'none';
  track.style.transform  = `translateY(0px)`;
  items.forEach((el, k) => el.classList.toggle('center', k === 0));

  const status   = $('#scanStatusText');
  const statusEl = $('#scanStatus');
  statusEl.classList.remove('warn');
  status.textContent = 'Scan des parrains';

  let i = 0;
  state.scanRunning = true;
  const screenAtLaunch = state.current;

  function isStillActive() {
    return state.scanRunning && state.current === screenAtLaunch;
  }
  function guardedTimeout(fn, delay) {
    return setTimeout(() => { if (isStillActive()) fn(); }, delay);
  }

  function getDelay(idx) {
    if (state.reducedMotion) return 200;
    const d = realPosition - idx;
    if (d > 6)       return 38 + Math.random() * 22;
    if (d > 3)       { const t = (6 - d) / 3; return 60 + t * 180; }
    if (d > 1)       { const t = (3 - d) / 2; return 240 + t * 380; }
    if (d === 1)     return 700;
    if (d === 0)     return 1800;
    return 400;
  }

  function moveTo(targetIdx, animated) {
    const d     = realPosition - targetIdx;
    const delay = getDelay(targetIdx);
    const dur   = animated ? Math.min(delay * 0.7, 300) : 0;
    track.style.transition = dur > 0
      ? `transform ${dur}ms ${d < 3 ? 'cubic-bezier(0.33, 1, 0.68, 1)' : 'linear'}`
      : 'none';
    track.style.transform = `translateY(${-targetIdx * ITEM_H}px)`;
    items.forEach((el, k) => el.classList.toggle('center', k === targetIdx));
    return delay;
  }

  function next() {
    if (!isStillActive()) return;
    if (i >= items.length - 1) {
      statusEl.classList.remove('warn');
      status.textContent = 'Binôme identifié';
      guardedTimeout(() => {
        if (isStillActive()) showScreen('liaison-toCountdown');
      }, 2200);
      return;
    }

    i++;
    const cur   = sequence[i];
    const delay = moveTo(i, true);

    if (cur._fake) {
      statusEl.classList.add('warn');
      status.textContent = 'Vérification…';
      guardedTimeout(() => {
        statusEl.classList.remove('warn');
        status.textContent = 'Scan des parrains';
        guardedTimeout(next, 80);
      }, 1400);
      return;
    }

    if (cur._real) {
      guardedTimeout(next, 45 + Math.random() * 20);
      return;
    }

    if (cur._stop) {
      guardedTimeout(() => {
        if (!isStillActive()) return;
        status.textContent = 'Binôme identifié';
        guardedTimeout(() => {
          if (isStillActive()) showScreen('liaison-toCountdown');
        }, 2200);
      }, 1800);
      return;
    }

    guardedTimeout(next, delay);
  }

  guardedTimeout(next, 900);
}

/* -----------------------------------------------------------
   16. ÉCRAN GENRE — Parrain ou Marraine ?
   ----------------------------------------------------------- */
function runGenreReveal() {
  clearTimers(state.genreTimers);
  const p     = state.parrain;
  const genre = p ? (isMarraine(p.photo) ? 'marraine' : 'parrain') : 'parrain';

  const label       = $('#genreLabel');
  const question    = $('#genreQuestion');
  const silhouettes = $('#genreSilhouettes');
  const badge       = $('#genreBadge');
  const figHomme    = $('#genreFigHomme');
  const figFemme    = $('#genreFigFemme');

  [label, question, silhouettes, badge].forEach(el => {
    if (el) { el.classList.remove('in', 'pulse-badge'); el.style.opacity = '0'; }
  });
  if (figHomme) figHomme.classList.remove('lit', 'dim');
  if (figFemme) figFemme.classList.remove('lit', 'dim');

  state.genreTimers.push(setTimeout(() => {
    label.style.opacity = ''; label.classList.add('in');
  }, 300));
  state.genreTimers.push(setTimeout(() => {
    question.style.opacity = ''; question.classList.add('in');
  }, 600));
  state.genreTimers.push(setTimeout(() => {
    silhouettes.style.opacity = ''; silhouettes.classList.add('in');
  }, 1000));

  let flashCount = 0;
  const flashInterval = setInterval(() => {
    flashCount++;
    if (flashCount % 2 === 0) {
      figHomme.classList.add('lit'); figHomme.classList.remove('dim');
      figFemme.classList.add('dim'); figFemme.classList.remove('lit');
    } else {
      figFemme.classList.add('lit'); figFemme.classList.remove('dim');
      figHomme.classList.add('dim'); figHomme.classList.remove('lit');
    }
  }, 340);
  state.genreTimers.push(setTimeout(() => clearInterval(flashInterval), 2600));

  state.genreTimers.push(setTimeout(() => {
    clearInterval(flashInterval);
    if (genre === 'marraine') {
      figFemme.classList.add('lit'); figFemme.classList.remove('dim');
      figHomme.classList.add('dim'); figHomme.classList.remove('lit');
    } else {
      figHomme.classList.add('lit'); figHomme.classList.remove('dim');
      figFemme.classList.add('dim'); figFemme.classList.remove('lit');
    }
    badge.textContent = genre === 'marraine' ? "C'est une marraine ✦" : "C'est un parrain ✦";
    badge.style.opacity = '';
    badge.classList.add('pulse-badge');
  }, 4200));

  state.genreTimers.push(setTimeout(() => {
    if (state.current === 'genre') showScreen('countdown');
  }, state.reducedMotion ? 1500 : 6600));
}

/* -----------------------------------------------------------
   17. ÉCRAN COUNTDOWN
   ----------------------------------------------------------- */
function runCountdown() {
  state.countdownActive = true;
  clearTimers(state.countdownTimers);

  const numEl   = $('#cdNumber');
  const lineEl  = $('#cdLine');
  const labelEl = $('#cdLabel');
  const introEl = $('#cdIntro');

  numEl.classList.remove('in', 'out'); numEl.textContent = '';
  lineEl.classList.remove('in'); labelEl.classList.remove('in');
  introEl.classList.remove('in'); introEl.style.display = 'none';

  state.countdownTimers.push(setTimeout(() => {
    labelEl.classList.add('in'); lineEl.classList.add('in');
  }, 400));

  const counts = [3, 2, 1];
  let idx = 0;

  function showCount() {
    if (!state.countdownActive) return;
    const n = counts[idx];
    if (idx > 0) {
      numEl.classList.remove('in'); numEl.classList.add('out');
      setTimeout(() => { numEl.classList.remove('out'); displayCount(n); }, 400);
    } else {
      displayCount(n);
    }
    idx++;
  }
  function displayCount(n) {
    numEl.textContent = n; numEl.classList.add('in');
    spawnParticles(n);
  }

  [800, 2100, 3300].forEach(d => {
    state.countdownTimers.push(setTimeout(() => {
      if (state.countdownActive) showCount();
    }, d));
  });

  state.countdownTimers.push(setTimeout(() => {
    if (!state.countdownActive) return;
    const flash = $('#flashOverlay');
    flash.classList.add('flash');
    state.countdownTimers.push(setTimeout(() => {
      flash.classList.remove('flash');
      state.countdownActive = false;
      showScreen(10);
    }, 500));
  }, 5200));
}

function spawnParticles(num) {
  const container = $('#cdParticles');
  if (!container) return;
  const count = state.reducedMotion ? 0 : (num === 1 ? 20 : 10);
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div'); p.className = 'cd-particle';
    const x     = 30 + Math.random() * 40;
    const size  = 2  + Math.random() * 3;
    const dur   = 1.5 + Math.random() * 2;
    const delay = Math.random() * 0.5;
    p.style.cssText = `left:${x}%; top:${20 + Math.random() * 60}%; width:${size}px; height:${size * (2 + Math.random() * 2)}px; background:${CONFETTI_COLORS[Math.floor(Math.random() * 3)]}; animation:confettiFall ${dur}s ${delay}s linear forwards; transform:rotate(${Math.random() * 360}deg);`;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000 + 200);
  }
}

/* -----------------------------------------------------------
   18. ÉCRAN 10 — RÉVÉLATION
   ----------------------------------------------------------- */
function runReveal() {
  const p = state.parrain;
  if (!p) return;

  const isFakeReveal = state.fake && !state.fakeRevealActive && !state._fakeAlreadyShown;

  if (isFakeReveal) {
    state.fakeRevealActive = true;
    const fakeData = { nom: state.fake.nom, filiere: p.filiere, photo: state.fake.photo };
    buildRevealScreen(fakeData, () => {
      setTimeout(() => {
        const overlay = $('#revealFakeOverlay');
        const fakeSub = $('#revealFakeSub');
        if (fakeSub) {
          const g = isMarraine(fakeData.photo) ? 'Cette marraine' : 'Ce parrain';
          fakeSub.textContent = `${g} n'est pas votre binôme… Le destin nous a joué un tour.`;
        }
        overlay.classList.add('in');
        setTimeout(() => {
          overlay.classList.remove('in');
          state.fakeRevealActive  = false;
          state._fakeAlreadyShown = true;
          runFakeToRealSequence();
        }, 2800);
      }, 2400);
    });
  } else {
    state._fakeAlreadyShown = false;
    buildRevealScreen(p, () => {
      if (state.code) addHistory(state.code, p.nom);
      startAutoRestart();
    });
  }
}

/*
  runFakeToRealSequence : relance le scan pour révéler le vrai parrain.
  On reset scanRunning AVANT d'appeler showScreen pour éviter toute
  double navigation. Le showScreen(7) lancera runSpecialty() qui
  lui-même appellera showScreen('liaison-toScan') → showScreen(8).
  Le setTimeout de garde est supprimé : plus de risque de conflit.
*/
function runFakeToRealSequence() {
  state.scanRunning = false;
  showUniverse(state.parrain.filiere);
  showScreen(7);
}

function buildRevealScreen(person, onReady) {
  const portrait = $('#revealPortrait');
  const portWrap = $('#revealPortraitWrap');
  const eyebrow  = $('#revealEyebrow');
  const nameEl   = $('#revealName');
  const lineEl   = $('.reveal-line', $('#screen-10'));
  const badgeEl  = $('#revealBadge');
  const actEl    = $('#revealActions');
  const overlay  = $('#revealFakeOverlay');

  overlay.classList.remove('in');
  [eyebrow, portWrap, nameEl, lineEl, badgeEl, actEl].forEach(el => {
    if (el) el.classList.remove('in');
  });

  portrait.innerHTML = ''; portrait.classList.remove('placeholder');

  const genre = isMarraine(person.photo) ? 'Votre marraine est' : 'Votre parrain est';
  eyebrow.textContent = genre;

  if (person.photo) {
    const img = document.createElement('img'); img.alt = person.nom;
    img.src = resolvePhotoPath(person.photo);
    img.onload  = () => { portrait.appendChild(img); setTimeout(() => img.classList.add('loaded'), 100); };
    img.onerror = () => {
      portrait.classList.add('placeholder');
      const span = document.createElement('span'); span.textContent = initials(person.nom);
      portrait.appendChild(span);
    };
  } else {
    portrait.classList.add('placeholder');
    const span = document.createElement('span'); span.textContent = initials(person.nom);
    portrait.appendChild(span);
  }

  const badge = document.createElement('div');
  badge.className = 'reveal-filiere-badge';
  badge.textContent = person.filiere + ' · AEFC-INPHB';
  portrait.appendChild(badge);

  nameEl.textContent  = person.nom;
  badgeEl.textContent = person.filiere + ' · AEFC-INPHB';

  requestAnimationFrame(() => {
    setTimeout(() => eyebrow.classList.add('in'),  150);
    setTimeout(() => portWrap.classList.add('in'), 400);
    setTimeout(() => nameEl.classList.add('in'),  1200);
    setTimeout(() => lineEl.classList.add('in'),  1500);
    setTimeout(() => badgeEl.classList.add('in'), 1700);
    setTimeout(() => actEl.classList.add('in'),   2000);
    setTimeout(() => { if (!state.reducedMotion && state.current === '10') spawnConfetti(); }, 1000);
    setTimeout(() => onReady?.(), 2100);
  });
}

function startAutoRestart() {
  const sr = $('#stageRestart');
  sr.style.display = '';
  let remaining = 14;
  sr.textContent = `Nouvelle révélation dans ${remaining}s`;
  setTimeout(() => sr.classList.add('in'), 2800);

  const tick = setInterval(() => {
    remaining--;
    if (remaining <= 0) { clearInterval(tick); resetAndRestart(); }
    else sr.textContent = `Nouvelle révélation dans ${remaining}s`;
  }, 1000);
  state.stageRestartTimer = tick;
}

function spawnConfetti() {
  const container = $('#revealConfetti');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < 55; i++) {
    const p     = document.createElement('div'); p.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const x     = 5 + Math.random() * 90;
    const dur   = 2.5 + Math.random() * 3;
    const delay = 0.1 + Math.random() * 2;
    const w = 3 + Math.random() * 5, h = 8 + Math.random() * 14;
    p.style.cssText = `left:${x}%; top:-20px; width:${w}px; height:${h}px; background:${color}; animation-duration:${dur}s; animation-delay:${delay}s; border-radius:${Math.random() > 0.5 ? '50%' : '2px'};`;
    container.appendChild(p);
    setTimeout(() => p.remove(), (dur + delay) * 1000 + 500);
  }
}

/* -----------------------------------------------------------
   19. RESET
   ----------------------------------------------------------- */
function resetAndRestart() {
  /* Stopper l'audio immédiatement */
  _hardStop(ambientAudio, 'ambient');
  _hardStop(scanAudio,    'scan');

  state.code              = null;
  state.parrain           = null;
  state.fake              = null;
  state.countdownActive   = false;
  state.fakeRevealActive  = false;
  state._fakeAlreadyShown = false;
  state.scanRunning       = false;

  clearTimers(state.countdownTimers);
  clearTimers(state.liaisonTimers);
  clearTimers(state.genreTimers);
  clearTimers(state.introTimers);

  if (state.filieresOrbitId) {
    cancelAnimationFrame(state.filieresOrbitId);
    state.filieresOrbitId = null;
  }
  if (sphereAnimId) { cancelAnimationFrame(sphereAnimId); sphereAnimId = null; }

  $$('.code-input').forEach(i => { i.value = ''; i.classList.remove('filled'); });
  $('#codeMsg').textContent = '\u00A0';
  $('#codeMsg').classList.remove('err', 'ok');

  if (state.stageRestartTimer) {
    clearInterval(state.stageRestartTimer);
    state.stageRestartTimer = null;
  }
  const sr = $('#stageRestart');
  if (sr) { sr.classList.remove('in'); sr.style.display = 'none'; }

  const overlay = $('#revealFakeOverlay');
  if (overlay) overlay.classList.remove('in');

  hideUniverse();

  if (state.fromOps) {
    state.fromOps = false;
    document.body.classList.remove('from-ops');
    showScreen(99);
  } else {
    showScreen(2);
  }
}

/* -----------------------------------------------------------
   20. RÉGIE
   ----------------------------------------------------------- */
function renderHistory() {
  const h    = loadHistory();
  $('#opsCount').textContent = h.length;
  const body = $('#opsHistoryBody');
  if (h.length === 0) {
    body.innerHTML = '<div class="ops-history-empty">Aucun code utilisé pour l\'instant</div>';
    return;
  }
  body.innerHTML = '<ul>' + h.map(e => {
    const d    = new Date(e.ts);
    const time = d.getHours().toString().padStart(2,'0') + ':' + d.getMinutes().toString().padStart(2,'0');
    return `<li><span class="h-code">${e.code}</span><span class="h-name">${e.nom}</span><span class="h-time">${time}</span></li>`;
  }).join('') + '</ul>';
}

function renderOpsPreview(code) {
  const pv = $('#opsPreview');
  if (!code || code.length === 0) {
    pv.className   = 'ops-preview empty';
    pv.textContent = 'Tapez un code pour prévisualiser le parrain attendu';
    $('#opsLaunch').disabled = true; return;
  }
  if (code.length < 4) {
    pv.className   = 'ops-preview empty';
    pv.textContent = `Code partiel (${code.length}/4)…`;
    $('#opsLaunch').disabled = true; return;
  }
  const p = DB[code];
  if (!p) {
    pv.className = 'ops-preview';
    pv.innerHTML = `<div class="pv-avatar">?</div><div class="pv-info"><div class="pv-name" style="color:#DC2626">Code inconnu</div><div class="pv-meta">Le code <strong style="font-family:var(--mono);color:var(--ink)">${code}</strong> n'existe pas.</div></div>`;
    $('#opsLaunch').disabled = true; return;
  }
  const used  = isUsed(code);
  const fake  = FAKES[code];
  const genre = isMarraine(p.photo) ? 'Marraine' : 'Parrain';
  pv.className = 'ops-preview';
  pv.innerHTML = `<div class="pv-avatar" id="pvAvatar">${initials(p.nom)}</div><div class="pv-info"><div class="pv-name">${p.nom}</div><div class="pv-meta"><span class="pv-badge ${p.filiere.toLowerCase()}">${p.filiere} · ${genre}</span>${used ? '<span class="pv-badge used">Déjà révélé</span>' : ''}${fake ? '<span class="pv-badge fake">Faux indice : ' + fake.nom.split(' ').slice(0, 2).join(' ') + '</span>' : ''}</div></div>`;
  if (p.photo) {
    const img = document.createElement('img');
    img.src   = resolvePhotoPath(p.photo); img.alt = p.nom;
    img.onload = () => { const av = $('#pvAvatar'); if (av) { av.textContent = ''; av.appendChild(img); } };
  }
  $('#opsLaunch').disabled = false;
}

function runOps() {
  $('#opsTotal').textContent = Object.keys(DB).length;
  renderHistory();
  renderOpsPreview('');
  setTimeout(() => $('#opsInput').focus(), 300);
}

function launchFromOps() {
  const code = $('#opsInput').value;
  if (!DB[code]) return;
  state.code              = code;
  state.parrain           = DB[code];
  state.fake              = FAKES[code] || null;
  state.fakeRevealActive  = false;
  state._fakeAlreadyShown = false;
  state.scanRunning       = false;
  if (state.stageRestartTimer) {
    clearInterval(state.stageRestartTimer);
    state.stageRestartTimer = null;
    const sr = $('#stageRestart');
    if (sr) { sr.classList.remove('in'); sr.style.display = 'none'; }
  }
  state.fromOps = true;
  document.body.classList.add('from-ops');
  $('#opsInput').value = '';
  showScreen('liaison-toSuspense');
}

/* -----------------------------------------------------------
   21. MODE SCÈNE
   -----------------------------------------------------------
   - Masque la dev-nav en mode production
   - Débloque l'audio dès le premier geste (warm-up play/pause)
   ----------------------------------------------------------- */
function applyMode() {
  document.body.classList.add('stage-mode');

  /* Masquer la navigation de développement en production */
  const devNav = $('#devNav');
  if (devNav) devNav.style.display = 'none';

  const tryFs = () => {
    if (document.fullscreenElement) return;
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  /*
    Warm-up audio : jouer à volume 0 puis mettre en pause immédiatement.
    Cela débloque la politique autoplay du navigateur une fois pour toutes.
    Sans ça, tout play() ultérieur (même 5 min plus tard) peut être refusé.
  */
  const unlockAudio = () => {
    let unlocked = 0;
    [ambientAudio, scanAudio].forEach(audio => {
      const savedVol = audio.volume;
      audio.volume   = 0;
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          audio.pause();
          audio.currentTime = 0;
          audio.volume = savedVol;
          unlocked++;
          if (unlocked === 2) {
            state.audioUnlocked = true;
            /* Appliquer le bon son pour l'écran courant maintenant que l'audio est prêt */
            applyAudioForScreen(state.current);
          }
        }).catch(() => {});
      } else {
        /* API synchrone (rare) : considérer comme débloqué */
        audio.pause();
        audio.currentTime = 0;
        audio.volume = savedVol;
        unlocked++;
        if (unlocked === 2) {
          state.audioUnlocked = true;
          applyAudioForScreen(state.current);
        }
      }
    });
    tryFs();
  };

  document.addEventListener('click',      unlockAudio, { once: true });
  document.addEventListener('keydown',    unlockAudio, { once: true });
  document.addEventListener('touchstart', unlockAudio, { once: true });
}

/* -----------------------------------------------------------
   22. ÉVÉNEMENTS
   ----------------------------------------------------------- */
$('#startBtn').addEventListener('click',   () => showScreen(3));
$('#restartBtn').addEventListener('click', resetAndRestart);
$('#shareBtn').addEventListener('click',   () => {
  if (navigator.share && state.parrain) {
    navigator.share({ title: 'BINOMAGE 2026', text: `Mon binôme : ${state.parrain.nom}` }).catch(() => {});
  } else {
    $('#shareBtn').textContent = 'Lien copié ✓';
    setTimeout(() => $('#shareBtn').textContent = 'Partager le moment', 1800);
  }
});
$('#soundToggle').addEventListener('click', toggleSound);

const opsInput = $('#opsInput');
opsInput.addEventListener('input', e => {
  const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4);
  e.target.value = v; renderOpsPreview(v);
});
opsInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !$('#opsLaunch').disabled) launchFromOps();
});
$('#opsLaunch').addEventListener('click', launchFromOps);
$('#opsClear').addEventListener('click',  () => {
  if (confirm('Réinitialiser l\'historique de la session ?')) { clearHistory(); renderHistory(); }
});
$('#opsBack').addEventListener('click', () => {
  state.countdownActive   = false;
  state.fakeRevealActive  = false;
  state._fakeAlreadyShown = false;
  state.scanRunning       = false;
  clearTimers(state.countdownTimers);
  clearTimers(state.liaisonTimers);
  clearTimers(state.genreTimers);
  clearTimers(state.introTimers);
  if (state.filieresOrbitId) { cancelAnimationFrame(state.filieresOrbitId); state.filieresOrbitId = null; }
  if (state.stageRestartTimer) { clearInterval(state.stageRestartTimer); state.stageRestartTimer = null; }
  if (sphereAnimId) { cancelAnimationFrame(sphereAnimId); sphereAnimId = null; }
  const overlay = $('#revealFakeOverlay');
  if (overlay) overlay.classList.remove('in');
  _hardStop(ambientAudio, 'ambient');
  _hardStop(scanAudio,    'scan');
  hideUniverse();
  document.body.classList.remove('from-ops');
  state.fromOps = false;
  showScreen(99);
});

document.addEventListener('keydown', e => {
  if (e.key === 'r' && e.ctrlKey) {
    e.preventDefault();
    state.countdownActive = false;
    if (state.fromOps) {
      state.fromOps = false;
      document.body.classList.remove('from-ops');
      showScreen(99);
    }
  }
  if (e.key === 'Escape') { state.countdownActive = false; resetAndRestart(); }
  if (e.key === 'm' || e.key === 'M') toggleSound();
});

/* -----------------------------------------------------------
   23. DÉMARRAGE
   ----------------------------------------------------------- */
loadSoundPref();
setupCodeInputs();
applyMode();
showScreen(1);

/* Préchargement progressif des images */
setTimeout(() => {
  Object.values(DB).forEach(p => {
    if (p.photo) { const img = new Image(); img.src = resolvePhotoPath(p.photo); }
  });
  Object.values(LOGOS).forEach(src => { const img = new Image(); img.src = src; });
}, 0);
