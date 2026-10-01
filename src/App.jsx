import React, { useState, useEffect, useCallback, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  ChevronRight, Play, Trophy, AlertTriangle, Map, Key, Skull, Target, Crosshair,
  Crown, MonitorPlay, ShieldAlert, Scroll, Shield, Flame,
  Wand2, Compass, CheckCircle2, Users, Settings, Plus, X, Sparkles, UserPlus, BookOpen, Globe,
  Music, Volume2, Eye, Zap, RefreshCw, Scale, Hourglass, Loader2, Gamepad2, GraduationCap, Hexagon, Layers,
  Swords, Heart, Timer, Pause, RotateCcw
} from 'lucide-react';
import { clansData, unassignedStudentsDB, defaultRoster, defaultScores, pectoralStones, casosTribunal } from './data.js';


// ─── STORAGE HELPERS ────────────────────────────────────────────
const STORAGE_KEY_USERS = 'odiseaUsersDB_V1';
const LEGACY_KEY_SCORES = 'odiseaScoresV30';
const LEGACY_KEY_ROSTER = 'odiseaRosterV30';

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────

  const desafiosM3 = {
    saul: {
      title: "EL SÍNDROME DE SAÚL",
      text: "El talento te lleva a la cima, pero el orgullo te destruye. ¿Cuándo fue la última vez que tu ego dañó a tu clan?",
      glow: "rgba(239, 68, 68, 0.8)"
    },
    david: {
      title: "EL CORAZÓN DEL PASTOR",
      text: "El verdadero rey no es el más fuerte, sino el que sabe pedir perdón. ¿Qué error debes confesar hoy para sanar a tu equipo?",
      glow: "rgba(16, 185, 129, 0.8)"
    },
    salomon: {
      title: "LA TRAMPA DE LA CORONA",
      text: "Tener los recursos no basta si pierdes el propósito. ¿Están usando su inteligencia para unir al salón o para presumir?",
      glow: "rgba(59, 130, 246, 0.8)"
    },
    israel: {
      title: "EL VENENO DE LA DIVISIÓN",
      text: "El Reino del Norte se separó por orgullo y terminó destruido. ¿Qué actitudes están separando a nuestro salón hoy?",
      glow: "rgba(168, 85, 247, 0.8)"
    },
    juda: {
      title: "LA SEMILLA DE LA PROMESA",
      text: "A pesar de todo, Judá guardó la promesa. ¿Qué acción heroica estás dispuesto a hacer para salvar a tu clan de la derrota?",
      glow: "rgba(245, 158, 11, 0.8)"
    }
  };

export default function OdiseaBiblica() {
  // ── Auth & Profiles ──
  const [authView, setAuthView] = useState('login'); // login, register, dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSave, setCurrentSave] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [authError, setAuthError] = useState('');
  const [newSaveName, setNewSaveName] = useState('');
  const [usersDB, setUsersDB] = useState(() => loadFromStorage(STORAGE_KEY_USERS, {}));

  // ── Navigation ──
  const [view, setView] = useState('auth'); // Starts at auth
  const [selectedClass, setSelectedClass] = useState(null);

  // ── Core Data (Loaded dynamically per save) ──
  const [roster, setRoster] = useState(defaultRoster);
  const [scores, setScores] = useState(defaultScores);
  const [newClassName, setNewClassName] = useState('');

  // ── Campamento Base ──
  const [activeTab, setActiveTab] = useState(1);
  const [showClans, setShowClans] = useState(false);
  const [clanSubTab, setClanSubTab] = useState(0);

  // ── Sorteo ──
  const [sorteoGrupos, setSorteoGrupos] = useState(7);
  const [sorteoMiembros, setSorteoMiembros] = useState(3);
  const [studentsList, setStudentsList] = useState('');
  const [sorteoPaso, setSorteoPaso] = useState('config');
  const [startGlobalCinematic, setStartGlobalCinematic] = useState(false);

  // ── Instructions ──
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructionTab, setInstructionTab] = useState(1);

  // ── Misión 1 ──
  const [startMision1Cinematic, setStartMision1Cinematic] = useState(false);
  const [m1Fase, setM1Fase] = useState(0);
  const [m1SubTab, setM1SubTab] = useState('proposito');
  const [activeStone, setActiveStone] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [activeAhorcadoClan, setActiveAhorcadoClan] = useState(null);
  const [stoneProgress, setStoneProgress] = useState({});
  const [ruletaM1Girando, setRuletaM1Girando] = useState(false);
  const [ruletaM1Orden, setRuletaM1Orden] = useState([]);

  // ── Misión 2 ──
  const [startMision2Cinematic, setStartMision2Cinematic] = useState(false);
  const [m2Fase, setM2Fase] = useState(0);
  const [tribunalPaso, setTribunalPaso] = useState('inicio');
  const [kaganClan, setKaganClan] = useState('ESPERANDO...');
  const [kaganNum, setKaganNum] = useState('?');
  const [casoIndice, setCasoIndice] = useState(0);
  const [casoActivo, setCasoActivo] = useState(null);
  const [evaluandoTribunal, setEvaluandoTribunal] = useState(false);
  const [resultadoJuicio, setResultadoJuicio] = useState(null);
  const [razonFallo, setRazonFallo] = useState('');
  const [poolTribunal, setPoolTribunal] = useState([]);
  const [votoPopularEmitido, setVotoPopularEmitido] = useState(false);

  // ── Misión 3 ──
  const [startMision3Cinematic, setStartMision3Cinematic] = useState(false);
  const [m3Fase, setM3Fase] = useState(0);
  const [startMision4Cinematic, setStartMision4Cinematic] = useState(false);
  const [m4Fase, setM4Fase] = useState(0);
  const [m4SubTab, setM4SubTab] = useState('archivo');
  const [m3SubTab, setM3SubTab] = useState('archivo');
  const [activeDesafio, setActiveDesafio] = useState(null);
  const [desafioPaso, setDesafioPaso] = useState('invitacion');
  
  const [reyesInsights, setReyesInsights] = useState([]);
  const [insightInput, setInsightInput] = useState('');
  const [showMasterReference, setShowMasterReference] = useState(false);

  // ── Timer & Shofar ──
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showShofarPlayer, setShowShofarPlayer] = useState(false);
  const [shofarLlamadas, setShofarLlamadas] = useState(0);
  const [shofarBlast, setShofarBlast] = useState(false);
  const [activeDossier, setActiveDossier] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const toggleNode = (nodeId) => setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));

  // ── MASTER MIGRATION & USER DB PERSISTENCE ──
  useEffect(() => {
    let db = { ...usersDB };
    // Si la cuenta maestra de Eder no existe, la creamos y migramos los datos legacy
    if (!db['EderInovadorPro']) {
      db['EderInovadorPro'] = {
        pass: 'Eder2026YugiJD',
        saves: [{ id: 'master_base', name: 'Base de Datos Histórica (No Borrar)' }]
      };
      
      // Rescatar datos legacy si existen
      const legacyScores = loadFromStorage(LEGACY_KEY_SCORES, defaultScores);
      const legacyRoster = loadFromStorage(LEGACY_KEY_ROSTER, defaultRoster);
      localStorage.setItem('odiseaData_EderInovadorPro_master_base', JSON.stringify({ scores: legacyScores, roster: legacyRoster }));
      
      setUsersDB(db);
    }
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(db));
  }, [usersDB]);

  // ── Persist scores & roster to specific Save ──
  useEffect(() => {
    if (!currentUser || !currentSave) return;
    try {
      const saveData = { scores, roster };
      localStorage.setItem(`odiseaData_${currentUser}_${currentSave}`, JSON.stringify(saveData));
    } catch (e) { console.error('Error guardando datos', e); }
  }, [scores, roster, currentUser, currentSave]);

  
    // ── FIREBASE REST REALTIME SYNC ──
  const PROJECT_ID = "odisea-biblica";
  const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/gamestate`;

  useEffect(() => {
    let isSubscribed = true;
    
    const fetchDoc = async (docName) => {
      // Use standard names unless a specific user/save is loaded
      const userPrefix = currentUser ? `${currentUser}_${currentSave || 'master_base'}_` : '';
      try {
        const res = await fetch(`${FIRESTORE_URL}/${userPrefix}${docName}`);
        if (!res.ok) return null;
        const json = await res.json();
        if (json.fields && json.fields.data) {
          return JSON.parse(json.fields.data.stringValue);
        }
      } catch (e) {
        console.error("Firebase Read Error:", e);
      }
      return null;
    };

    const syncFirebase = async () => {
      const serverScores = await fetchDoc('scores');
      if (serverScores && isSubscribed) setScores(serverScores);
      
      const serverRoster = await fetchDoc('roster');
      if (serverRoster && isSubscribed) setRoster(serverRoster);
    };

    syncFirebase();
    const interval = setInterval(syncFirebase, 3000); // Poll every 3 seconds
    return () => { isSubscribed = false; clearInterval(interval); };
  }, [currentUser, currentSave]);

  const updateFirebase = async (docName, dataObj) => {
    const userPrefix = currentUser ? `${currentUser}_${currentSave || 'master_base'}_` : '';
    try {
      await fetch(`${FIRESTORE_URL}/${userPrefix}${docName}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            data: { stringValue: JSON.stringify(dataObj) }
          }
        })
      });
    } catch (e) {
      console.error("Firebase Write Error:", e);
    }
  };
  // ── Countdown timer ──
  useEffect(() => {
    if (!timerRunning || timerSeconds <= 0) return;
    const id = setInterval(() => setTimerSeconds(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timerSeconds]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  };

  const downloadPDF = () => {
    const element = document.getElementById('dossier-pdf');
    if (!element) return;
    
    // Matriz exacta A4: 210mm x 297mm. El contenido interno ya tiene padding.
    const opt = {
      margin:       0,
      filename:     `Mision_${activeDossier}_Dossier_Confidencial.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: ['css', 'legacy'] }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // ── Helpers ──
  const updateScore = (clanId, points, aulaTarget = selectedClass) => {
    if (!aulaTarget || !clanId) return;
    setScores(prev => {
      const newScores = {
        ...prev,
        [aulaTarget]: { ...prev[aulaTarget], [clanId]: (prev[aulaTarget][clanId] || 0) + points }
      };
      updateFirebase('scores', newScores);
      return newScores;
    });
  };

  const resetToHome = () => {
    setView('selector');
    setStartMision1Cinematic(false); setStartMision2Cinematic(false); setStartMision3Cinematic(false); setStartMision4Cinematic(false);
    setStartGlobalCinematic(false); setShowInstructions(false);
    setM1Fase(0); setM2Fase(0); setM3Fase(0); setM4Fase(0);
  };

  const sortearClanes = () => {
    if (!selectedClass) return;
    setSorteoPaso('cine');
    setTimeout(() => {
      let pool = studentsList.split('\n').map(s => s.trim().toUpperCase()).filter(s => s.length > 0);
      
      // Si la lista está vacía, genera reclutas genéricos automáticamente
      if (pool.length === 0) {
        for(let i=1; i <= (sorteoGrupos * sorteoMiembros); i++) {
          pool.push(`RECLUTA ${i}`);
        }
      }
      
      let shuffled = pool.sort(() => 0.5 - Math.random());
      let newRoster = { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] };
      let clanIds = clansData.slice(0, Number(sorteoGrupos)).map(c => c.id);
      
      clanIds.forEach(cId => {
        for (let i = 0; i < Number(sorteoMiembros); i++) {
          if (shuffled.length > 0) newRoster[cId].push(shuffled.pop());
        }
      });
      setRoster(prev => {
        const nextRoster = { ...prev, [selectedClass]: newRoster };
        updateFirebase('roster', nextRoster);
        return nextRoster;
      });
      setSorteoPaso('result');
    }, 12000);
  };

  const procesarVeredicto = (esAprobado) => {
    setEvaluandoTribunal(true);
    setTimeout(() => {
      setEvaluandoTribunal(false);
      const clanId = clansData.find(c => c.name.toUpperCase() === kaganClan)?.id;
      if (esAprobado) {
        setResultadoJuicio('aprobado');
        if (clanId) updateScore(clanId, 50);
      } else {
        setResultadoJuicio('rechazado');
        setRazonFallo("La Providencia detecta una defensa que carece de fundamento bíblico, empatía o valores de liderazgo. Un verdadero juez busca el bien común, no excusar el egoísmo. Veredicto Denegado.");
        if (clanId) updateScore(clanId, -30);
      }
    }, 4000);
  };

  const isMissionActive = (view === 'mision1' && m1Fase > 0) || (view === 'mision2' && m2Fase > 0) || (view === 'mision3' && m3Fase > 0) || (view === 'mision4' && m4Fase > 0);

  // ── Helper Component for A4 Pages ──
  const A4Page = ({ children }) => (
    <>
      <div className="bg-white text-slate-800 relative mx-auto overflow-hidden shadow-2xl border border-slate-300" style={{ width: '210mm', height: '297mm', padding: '15mm', boxSizing: 'border-box' }}>
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-900"></div>
      <div className="absolute bottom-0 left-0 w-full h-3 bg-gradient-to-r from-indigo-900 via-indigo-600 to-indigo-900"></div>
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-slate-300 rounded-tl-xl pointer-events-none"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-slate-300 rounded-br-xl pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <Globe className="w-[500px] h-[500px] text-indigo-900"/>
      </div>
      <div className="relative z-10 h-full flex flex-col">
        <div className="border-b-2 border-slate-200 pb-4 mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-indigo-600 font-black text-[10px] tracking-widest md:tracking-[0.4em] uppercase mb-1">PROGRAMA DE ENTRENAMIENTO MULTIVERSAL</h2>
            <h1 className="text-2xl font-black text-slate-900 tracking-widest uppercase">LA ODISEA BÍBLICA</h1>
          </div>
          <div className="text-right">
            <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest md:tracking-[0.2em] mb-1">FECHA ESTELAR: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] text-amber-700 font-bold uppercase tracking-widest border border-amber-300 bg-amber-50 px-3 py-1 rounded inline-block">DOC. CONFIDENCIAL</p>
          </div>
        </div>
        {children}
      </div>
    </div>
    <div className="w-full h-8" data-html2canvas-ignore="true"></div>
  </>
);

  // ── Auth Handlers ──
  const handleLogin = (e) => {
    e.preventDefault();
    if (!usersDB[loginForm.user] || usersDB[loginForm.user].pass !== loginForm.pass) {
      setAuthError('Usuario o contraseña incorrectos.');
      return;
    }
    setCurrentUser(loginForm.user);
    setAuthError('');
    setAuthView('dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!loginForm.user || !loginForm.pass) {
      setAuthError('Completa todos los campos.');
      return;
    }
    if (usersDB[loginForm.user]) {
      setAuthError('El usuario ya existe.');
      return;
    }
    const newDb = { ...usersDB, [loginForm.user]: { pass: loginForm.pass, saves: [] } };
    setUsersDB(newDb);
    setCurrentUser(loginForm.user);
    setAuthError('');
    setAuthView('dashboard');
  };

  const handleCreateSave = (e) => {
    e.preventDefault();
    if (!newSaveName) return;
    const saveId = `save_${Date.now()}`;
    const newDb = { ...usersDB };
    newDb[currentUser].saves.push({ id: saveId, name: newSaveName });
    setUsersDB(newDb);
    
    // Initialize fresh save
    localStorage.setItem(`odiseaData_${currentUser}_${saveId}`, JSON.stringify({ scores: defaultScores, roster: defaultRoster }));
    setNewSaveName('');
  };

  const loadSaveGame = (saveId) => {
    const data = loadFromStorage(`odiseaData_${currentUser}_${saveId}`, { scores: defaultScores, roster: defaultRoster });
    setScores(data.scores);
    setRoster(data.roster);
    setCurrentSave(saveId);
    setView('intro_master'); // Restaurado: Va a la intro épica
  };

  // ═══════════════════════════════════════════════════════════════
  // ── RENDER ─────────────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#030408] text-slate-200 font-sans overflow-x-hidden flex flex-col">

      {/* ── GM Skip Button ── */}
      <button onClick={resetToHome} className="fixed top-2 left-2 z-[99999] opacity-10 hover:opacity-100 text-[10px] bg-black border border-slate-700 text-slate-500 px-2 py-1 rounded cursor-pointer transition-opacity">GM SKIP</button>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── AUTHENTICATION & PROFILES ────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'auth' && (
        <div className="flex-grow flex flex-col items-center justify-center p-8 relative overflow-hidden bg-[#070913] min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-md bg-[#0a0c16]/90 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)]">
            <div className="text-center mb-8">
              <Globe className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"/>
              <h1 className="text-3xl font-black text-white uppercase tracking-widest drop-shadow-lg">LA ODISEA BÍBLICA</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest md:tracking-[0.3em] mt-2">SISTEMA DE GESTIÓN DOCENTE</p>
            </div>

            {authView === 'login' || authView === 'register' ? (
              <form onSubmit={authView === 'login' ? handleLogin : handleRegister} className="space-y-4 animate-in fade-in duration-300">
                {authError && <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center font-bold">{authError}</div>}
                
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Usuario Docente</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" required value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})} className="w-full bg-[#111424] border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors" placeholder="Ej. ProfMarcos" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Contraseña Mestra</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="password" required value={loginForm.pass} onChange={e => setLoginForm({...loginForm, pass: e.target.value})} className="w-full bg-[#111424] border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors" placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-[1.02]">
                  {authView === 'login' ? 'INICIAR SESIÓN TÁCTICA' : 'REGISTRAR NUEVO DOCENTE'}
                </button>

                <div className="text-center mt-4">
                  <button type="button" onClick={() => { setAuthView(authView === 'login' ? 'register' : 'login'); setAuthError(''); }} className="text-slate-400 hover:text-white text-xs underline cursor-pointer transition-colors">
                    {authView === 'login' ? '¿Eres nuevo? Registra tu cuenta docente aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Docente Activo</p>
                    <p className="text-white font-black">{currentUser}</p>
                  </div>
                  <button onClick={() => { setCurrentUser(null); setAuthView('login'); setLoginForm({user:'', pass:''}); }} className="text-slate-400 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer transition-colors">Cerrar <X className="w-3 h-3"/></button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-3 border-b border-slate-800 pb-2">TUS CARPETAS (AÑOS / SALONES)</h3>
                  <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                    {usersDB[currentUser]?.saves.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No tienes carpetas de juego aún.</p>
                    ) : (
                      usersDB[currentUser]?.saves.map(save => (
                        <button key={save.id} onClick={() => loadSaveGame(save.id)} className="w-full bg-[#111424] hover:bg-[#1a1e36] border border-slate-700/50 hover:border-amber-500/50 p-4 rounded-lg flex items-center justify-between group cursor-pointer transition-all">
                          <span className="font-bold text-slate-300 group-hover:text-amber-400">{save.name}</span>
                          <Play className="w-4 h-4 text-slate-600 group-hover:text-amber-400" />
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <form onSubmit={handleCreateSave} className="bg-black/40 border border-slate-800 p-4 rounded-xl">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">CREAR NUEVA CARPETA DE JUEGO</h4>
                  <div className="flex gap-2">
                    <input type="text" required value={newSaveName} onChange={e => setNewSaveName(e.target.value)} placeholder="Ej. Promoción 2027" className="flex-grow bg-[#111424] border border-slate-700 rounded py-2 px-3 text-xs text-white outline-none focus:border-emerald-500" />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"><Plus className="w-4 h-4"/> CREAR</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── INSTRUCTIONS MODAL ──────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showInstructions && (
        <div className="fixed inset-0 z-[99999] bg-[#020308]/95 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-6 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500/20 animate-[scanline_8s_linear_infinite] shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
            <div className="absolute top-4 left-6 text-cyan-500/40 font-mono text-[10px] uppercase tracking-widest md:tracking-[0.4em] hidden md:block">SYS.INIT // ODISEA_PROTOCOL_V8.0<br/><span className="text-indigo-500/50">CONEXIÓN: ESTABLE</span></div>
            <div className="absolute bottom-4 right-6 text-cyan-500/40 font-mono text-[10px] uppercase tracking-widest md:tracking-[0.4em] hidden md:block text-right">USER: RECLUTA_01 // ACCESS: GRANTED<br/><span className="animate-pulse text-emerald-500/50">CÓDICE DE MISIÓN ACTIVO</span></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[150px]"></div>
          </div>

          <div className="w-full max-w-[1400px] h-full max-h-[92vh] bg-[#0a0c16]/80 backdrop-blur-xl border border-cyan-900/40 rounded-3xl shadow-[0_0_80px_rgba(14,165,233,0.15)] flex flex-col md:flex-row relative z-10 overflow-hidden ring-1 ring-white/10 animate-[hologram-flicker_3s_infinite]">
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-cyan-500/50 rounded-tl-3xl z-20 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-cyan-500/50 rounded-br-3xl z-20 pointer-events-none"></div>

            <button onClick={() => setShowInstructions(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white bg-black/50 hover:bg-red-600/80 p-3 rounded-full transition-all cursor-pointer z-50 border border-slate-700 hover:border-red-400 shadow-[0_0_15px_rgba(0,0,0,0.5)] group flex items-center justify-center">
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"/>
            </button>

            {/* SIDE NAV */}
              <div className="w-full md:w-80 bg-gradient-to-b from-[#05060f] to-[#0a0c16] md:border-r border-b md:border-b-0 border-cyan-900/30 flex flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.4)] pt-8 shrink-0">
              <div className="px-4 md:px-8 pb-4 md:pb-8 border-b border-cyan-900/30 text-center relative">
                <div className="w-12 h-12 md:w-20 md:h-20 mx-auto bg-cyan-950/40 rounded-2xl border border-cyan-500/30 flex items-center justify-center mb-2 md:mb-4 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  <Hexagon className="w-6 h-6 md:w-12 md:h-12 text-cyan-400 animate-pulse"/>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest md:tracking-[0.2em]">CÓDICE</h2>
                <p className="text-[8px] md:text-[10px] text-cyan-400 font-mono font-black uppercase tracking-widest md:tracking-[0.4em] mt-1 bg-cyan-900/30 py-1 rounded inline-block px-2 md:px-3 border border-cyan-500/20">MANUAL TÁCTICO</p>
              </div>
              <div className="overflow-x-auto md:overflow-y-auto p-2 md:p-4 flex flex-row md:flex-col gap-2 custom-scrollbar mt-2 md:mt-4">
                {[
                  {id: 1, title: 'EL SIMULADOR', desc: 'Concepto de Juego', icon: MonitorPlay, activeClass: 'bg-cyan-900/30 border-cyan-500/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]', indicatorClass: 'bg-cyan-400 shadow-[0_0_10px_currentColor]', iconActiveClass: 'text-cyan-400 drop-shadow-[0_0_8px_currentColor]', descActiveClass: 'text-cyan-400/80'},
                  {id: 2, title: 'FACCIONES', desc: 'Los 7 Clanes', icon: Users, activeClass: 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]', indicatorClass: 'bg-blue-400 shadow-[0_0_10px_currentColor]', iconActiveClass: 'text-blue-400 drop-shadow-[0_0_8px_currentColor]', descActiveClass: 'text-blue-400/80'},
                  {id: 3, title: 'RANGOS Y XP', desc: 'Sistema de Puntos', icon: Target, activeClass: 'bg-amber-900/30 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]', indicatorClass: 'bg-amber-400 shadow-[0_0_10px_currentColor]', iconActiveClass: 'text-amber-400 drop-shadow-[0_0_8px_currentColor]', descActiveClass: 'text-amber-400/80'},
                  {id: 4, title: 'MISIONES', desc: 'Impacto Real', icon: Flame, activeClass: 'bg-emerald-900/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]', indicatorClass: 'bg-emerald-400 shadow-[0_0_10px_currentColor]', iconActiveClass: 'text-emerald-400 drop-shadow-[0_0_8px_currentColor]', descActiveClass: 'text-emerald-400/80'},
                ].map(tab => (
                  <button key={tab.id} onClick={() => setInstructionTab(tab.id)} className={`relative flex items-center p-3 md:p-4 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group text-left min-w-[160px] md:min-w-0 ${instructionTab === tab.id ? `${tab.activeClass} md:scale-[1.02] md:translate-x-2` : 'bg-transparent border border-transparent hover:border-slate-700/50 hover:bg-white/5'}`}>
                    <div className={`absolute left-0 top-0 w-1.5 h-full transition-all duration-300 ${instructionTab === tab.id ? tab.indicatorClass : 'bg-transparent group-hover:bg-slate-600'}`}></div>
                    <tab.icon className={`w-5 h-5 md:w-6 md:h-6 ml-2 mr-3 md:mr-4 shrink-0 transition-colors ${instructionTab === tab.id ? tab.iconActiveClass : 'text-slate-500 group-hover:text-slate-300'}`}/>
                    <div>
                      <p className={`text-xs md:text-sm font-black uppercase tracking-widest ${instructionTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{tab.title}</p>
                      <p className={`text-[8px] md:text-[9px] font-mono tracking-widest uppercase mt-0.5 ${instructionTab === tab.id ? tab.descActiveClass : 'text-slate-600'}`}>{tab.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* INSTRUCTION CONTENT */}
            <div className="flex-grow p-6 md:p-14 overflow-y-auto custom-scrollbar relative z-10 perspective-1000">
              {instructionTab === 1 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 h-full flex flex-col justify-center max-w-5xl mx-auto">
                  <div className="text-center mb-12">
                    <MonitorPlay className="w-20 h-20 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] animate-[float-3d_4s_ease-in-out_infinite]"/>
                    <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-300 uppercase tracking-tighter drop-shadow-lg mb-4">INMERSIÓN TOTAL</h3>
                    <p className="text-cyan-400 text-sm md:text-lg font-mono tracking-widest md:tracking-[0.4em] uppercase bg-cyan-950/40 inline-block px-6 py-2 rounded-full border border-cyan-500/30">NO ES UNA CLASE. ES UN SIMULADOR.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 preserve-3d">
                    <div className="group bg-[#0a0c16]/90 backdrop-blur border border-cyan-900/50 p-8 rounded-3xl hover:border-cyan-400 transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.05)] hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                      <div className="w-14 h-14 bg-cyan-950 rounded-2xl flex items-center justify-center border border-cyan-500/50 mb-6 shadow-[0_0_15px_rgba(34,211,238,0.4)]"><Crosshair className="w-7 h-7 text-cyan-400"/></div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest mb-4">EL OBJETIVO</h4>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed">No buscamos memorizar versículos. El propósito es <strong className="text-cyan-300">extraer la sabiduría milenaria</strong> de los Sacerdotes, Jueces y Reyes, y usarla como herramienta táctica para resolver dilemas morales reales en nuestro propio salón.</p>
                    </div>
                    <div className="group bg-[#0a0c16]/90 backdrop-blur border border-indigo-900/50 p-8 rounded-3xl hover:border-indigo-400 transition-all duration-500 shadow-[0_0_30px_rgba(79,70,229,0.05)] hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                      <div className="w-14 h-14 bg-indigo-950 rounded-2xl flex items-center justify-center border border-indigo-500/50 mb-6 shadow-[0_0_15px_rgba(79,70,229,0.4)]"><Gamepad2 className="w-7 h-7 text-indigo-400"/></div>
                      <h4 className="text-xl font-black text-white uppercase tracking-widest mb-4">LA EXPERIENCIA</h4>
                      <p className="text-slate-400 text-sm md:text-base leading-relaxed">Dejas de ser un estudiante para convertirte en <strong className="text-indigo-300">Recluta de una Facción Sagrada</strong>. Música épica, cronómetros de tensión, toma de decisiones y sonido de Shofar. Aprenderás sintiendo la historia en carne propia.</p>
                    </div>
                  </div>
                </div>
              )}

              {instructionTab === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-blue-900/40 pb-6 gap-6 text-center md:text-left">
                    <div>
                      <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400 uppercase tracking-tighter drop-shadow-lg mb-2">FACCIONES SAGRADAS</h3>
                      <p className="text-blue-400 text-xs font-mono tracking-widest md:tracking-[0.4em] uppercase">Mecánica Core: Interdependencia Positiva</p>
                    </div>
                    <div className="bg-blue-950/40 border border-blue-500/40 px-6 py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                      <p className="text-white font-black text-sm uppercase tracking-widest">"SI UNO CAE, EL CLAN CAE."</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 preserve-3d pb-10">
                    {clansData.map((clan) => (
                      <div key={clan.id} className={`group bg-[#0a0c16]/80 backdrop-blur border ${clan.border.replace('/50','/30')} p-6 rounded-2xl flex flex-col items-center text-center transition-all duration-500 cursor-default hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}>
                        <div className={`w-16 h-16 rounded-2xl bg-black border ${clan.border} flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>{clan.icon}</div>
                        <h4 className={`font-black uppercase tracking-widest text-sm md:text-base mb-2 ${clan.color}`}>{clan.name}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest border-t border-slate-800 pt-3 w-full">Virtud: <br/><span className="text-white text-[10px]">{clan.attribute}</span></p>
                      </div>
                    ))}
                    <div className="group bg-gradient-to-br from-indigo-900/40 to-[#0a0c16] backdrop-blur border border-indigo-500/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 shadow-[0_0_30px_rgba(79,70,229,0.2)] col-span-2 md:col-span-1">
                      <Users className="w-12 h-12 text-indigo-400 mb-4 animate-pulse"/>
                      <p className="text-xs text-indigo-100 font-bold tracking-widest uppercase leading-relaxed">El más fuerte <br/><strong className="text-white">NO PUEDE GANAR SOLO</strong>. Debe ayudar al más débil.</p>
                    </div>
                  </div>
                </div>
              )}

              {instructionTab === 3 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto h-full flex flex-col justify-center">
                  <div className="text-center mb-14">
                    <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 uppercase tracking-tighter drop-shadow-lg mb-4">ECONOMÍA DE XP</h3>
                    <p className="text-amber-500 text-sm font-mono tracking-widest md:tracking-[0.4em] uppercase bg-amber-950/30 inline-block px-6 py-2 rounded-full border border-amber-500/30">COMPETENCIA MULTIVERSAL</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-4 preserve-3d">
                      <div className="bg-[#0a0c16]/90 border border-emerald-900/50 p-6 rounded-2xl flex items-center gap-6 hover:translate-x-2 transition-transform shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
                        <div className="w-20 h-20 bg-emerald-950/50 rounded-xl flex flex-col items-center justify-center border border-emerald-500/50 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                          <span className="text-emerald-400 font-black text-2xl">+50</span><span className="text-[8px] text-emerald-200 font-black tracking-widest uppercase">XP</span>
                        </div>
                        <div><h4 className="text-white font-black uppercase tracking-widest text-lg mb-1">Respuesta Magistral</h4><p className="text-slate-400 text-xs">Por resolver dilemas orales en el Tribunal aplicando principios bíblicos y trabajo en equipo.</p></div>
                      </div>
                      <div className="bg-[#0a0c16]/90 border border-blue-900/50 p-6 rounded-2xl flex items-center gap-6 hover:translate-x-2 transition-transform shadow-[inset_0_0_20px_rgba(59,130,246,0.05)]">
                        <div className="w-20 h-20 bg-blue-950/50 rounded-xl flex flex-col items-center justify-center border border-blue-500/50 shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                          <span className="text-blue-400 font-black text-2xl">+150</span><span className="text-[8px] text-blue-200 font-black tracking-widest uppercase">XP</span>
                        </div>
                        <div><h4 className="text-white font-black uppercase tracking-widest text-lg mb-1">Misión Cumplida</h4><p className="text-slate-400 text-xs">Por completar tareas (ej. El Pectoral). Solo se otorga si TODOS en el clan lo tienen.</p></div>
                      </div>
                    </div>
                    <div className="space-y-4 preserve-3d">
                      <div className="bg-[#0a0c16]/90 border border-orange-900/50 p-6 rounded-2xl flex items-center gap-6 hover:-translate-x-2 transition-transform shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]">
                        <div className="w-20 h-20 bg-orange-950/50 rounded-xl flex flex-col items-center justify-center border border-orange-500/50 shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                          <span className="text-orange-500 font-black text-2xl">-30</span><span className="text-[8px] text-orange-200 font-black tracking-widest uppercase">XP</span>
                        </div>
                        <div><h4 className="text-white font-black uppercase tracking-widest text-lg mb-1">Defensa Egoísta</h4><p className="text-slate-400 text-xs">Por dar respuestas individualistas o carentes de fundamento en el Tribunal de Jueces.</p></div>
                      </div>
                      <div className="bg-[#1a0505]/90 border border-red-800 p-6 rounded-2xl flex items-center gap-6 hover:-translate-x-2 transition-transform shadow-[inset_0_0_20px_rgba(220,38,38,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-2 h-full bg-red-600 animate-pulse"></div>
                        <div className="w-20 h-20 bg-red-950/80 rounded-xl flex flex-col items-center justify-center border border-red-500 shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                          <span className="text-red-500 font-black text-2xl">-100</span><span className="text-[8px] text-red-200 font-black tracking-widest uppercase">XP</span>
                        </div>
                        <div><h4 className="text-red-400 font-black uppercase tracking-widest text-lg mb-1 flex items-center gap-2">INDISCIPLINA <AlertTriangle className="w-4 h-4"/></h4><p className="text-red-200/70 text-xs">Gritar, romper el "Silencio Táctico" o faltar al respeto. Destruye los puntos de todo tu clan.</p></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {instructionTab === 4 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto">
                  <div className="flex flex-col items-center text-center mb-12">
                    <GraduationCap className="w-20 h-20 text-emerald-400 mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]"/>
                    <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400 uppercase tracking-tighter drop-shadow-lg mb-4">IMPACTO EN LA VIDA REAL</h3>
                    <p className="text-slate-300 text-base md:text-lg italic font-serif max-w-2xl">"Saber quién fue el Rey David no sirve de nada si no aplicamos sus lecciones para ser mejores compañeros hoy."</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 preserve-3d">
                    <div className="group bg-[#0a0c16]/90 backdrop-blur border-2 border-[#1e293b] hover:border-emerald-500/80 p-8 rounded-3xl transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 bg-emerald-950/50 rounded-xl flex items-center justify-center border border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"><Map className="w-6 h-6"/></div>
                        <span className="bg-emerald-900/40 text-emerald-300 text-[9px] font-black tracking-widest md:tracking-[0.2em] uppercase px-3 py-1 rounded border border-emerald-700">Misión Primaria</span>
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Misiones de Vida</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Ejemplo: Al estudiar a los sacerdotes, no copiamos teoría aburrida. Cada estudiante dibuja su propio "Pectoral" y se compromete a <strong className="text-emerald-300">interceder y proteger a un compañero</strong> específico del salón.</p>
                    </div>
                    <div className="group bg-[#0a0c16]/90 backdrop-blur border-2 border-[#1e293b] hover:border-indigo-500/80 p-8 rounded-3xl transition-all duration-500 shadow-lg hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-12 h-12 bg-indigo-950/50 rounded-xl flex items-center justify-center border border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.4)]"><Scale className="w-6 h-6"/></div>
                        <span className="bg-indigo-900/40 text-indigo-300 text-[9px] font-black tracking-widest md:tracking-[0.2em] uppercase px-3 py-1 rounded border border-indigo-700">Misión Core</span>
                      </div>
                      <h4 className="text-2xl font-black text-white uppercase tracking-widest mb-3">El Tribunal Oral</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">Usamos los errores bíblicos (el ego de Gedeón, la ira de Sansón) para <strong className="text-indigo-300">juzgar casos reales de bullying o egoísmo</strong> en el aula. Debatimos oralmente y el salón entero vota con sus paletas.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── INTRO MASTER ───────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'intro_master' && (
        <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden bg-black">
          <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-amber-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] group hover:scale-105 transition-transform">
            <div className="absolute top-0 left-0 w-full bg-amber-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> DALE PLAY AQUÍ</div>
            <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHRVWYddvQ/QXO9us7EGIsOpJtL_MmRsA/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
          </div>

          {!startGlobalCinematic ? (
            <div className="relative z-10 text-center flex flex-col items-center animate-in fade-in duration-1000">
              <Globe className="w-16 h-16 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"/>
              <p className="text-amber-500 text-xs md:text-sm tracking-widest md:tracking-[0.2em] font-bold uppercase text-center leading-relaxed mb-8">INSTRUCCIÓN GM: 1) ACTIVA EL AUDIO EN LA ESQUINA SUPERIOR. <br/>2) LUEGO INICIA LA SECUENCIA.</p>
              <button onClick={() => setStartGlobalCinematic(true)} className="bg-transparent border border-slate-600 text-white hover:bg-slate-900 px-8 py-3 rounded-full font-bold uppercase tracking-widest md:tracking-[0.2em] transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">INICIAR SECUENCIA ÉPICA</button>
            </div>
          ) : (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover bg-center opacity-40 animate-[slowZoom_35s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-screen animate-[slowZoom_20s_linear_infinite_alternate]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-10"></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 1s' }}><p className="text-2xl md:text-4xl text-slate-300 uppercase tracking-widest md:tracking-[0.4em] font-light drop-shadow-lg">El tiempo y el espacio...</p><p className="text-xl md:text-2xl text-amber-500/70 uppercase tracking-widest md:tracking-[0.6em] font-light mt-6">se han fracturado.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 8s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-amber-500 uppercase tracking-widest md:tracking-[0.2em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)]">EL AULA HA DESAPARECIDO.</p><p className="text-xl md:text-2xl text-amber-200 uppercase tracking-widest md:tracking-[0.4em] font-light mt-6">Olviden quiénes creían ser.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 15s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-indigo-400 uppercase tracking-widest md:tracking-[0.3em] font-bold drop-shadow-[0_0_30px_rgba(129,140,248,0.8)]">DESDE LAS SOMBRAS DEL PASADO...</p><p className="text-lg md:text-2xl text-indigo-200 uppercase tracking-widest md:tracking-[0.4em] font-light mt-6 leading-relaxed">Su verdadero destino los reclama.<br/>La sangre de reyes y profetas despierta.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 23s' }}><p className="text-2xl md:text-4xl text-slate-100 uppercase tracking-widest md:tracking-[0.5em] font-light drop-shadow-2xl">Siete linajes se levantarán del polvo.</p><p className="text-2xl md:text-4xl lg:text-5xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)] mt-6">HOY, EL DESIERTO EXIGE SU PODER.</p></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 4s ease-out forwards 31s' }}>
                <Globe className="w-24 h-24 text-amber-500 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse" />
                <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-amber-600 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(245,158,11,1)]">LA ODISEA BÍBLICA</h1>
                <p className="text-amber-500 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase drop-shadow-md">FORJANDO LÍDERES EN EL DESIERTO</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 35s' }}>
                <button onClick={() => { setStartGlobalCinematic(false); setView('selector'); }} className="bg-[#0f0a06]/80 border-2 border-amber-500 text-amber-300 px-12 py-6 font-black uppercase tracking-widest md:tracking-[0.5em] text-xl transition-all shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-110 hover:shadow-[0_0_80px_rgba(245,158,11,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">ENTRAR AL CAMPAMENTO <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── SELECTOR ────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'selector' && (
        <div className="flex-grow flex flex-col items-center justify-center p-8 relative bg-[#070913]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"><div className="w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div></div>
          <div className="relative z-10 text-center w-full max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-2 tracking-tighter uppercase drop-shadow-xl">EL CAMPAMENTO BASE</h1>
            <p className="text-indigo-400 text-xs md:text-sm tracking-widest md:tracking-[0.4em] font-black uppercase mb-12 drop-shadow">GESTOR DE BASE DE DATOS COOPERATIVA</p>
            <div className="bg-[#0f111a]/80 backdrop-blur-md rounded-[2rem] p-8 md:p-12 mb-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-[#2a2e45] relative mx-auto w-full max-w-4xl">
              <p className="text-amber-500 font-black uppercase tracking-widest md:tracking-[0.2em] text-xs md:text-sm mb-10 flex justify-center items-center gap-2"><Users className="w-4 h-4"/> SELECCIONA TU SALÓN</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Object.keys(scores).map(aula => (
                  <button key={aula} onClick={() => { 
                    setSelectedClass(aula); 
                    setView('campamento_base'); 
                    const hasStudents = roster[aula] && Object.values(roster[aula]).some(clan => clan.length > 0);
                    if (hasStudents) {
                      setActiveTab(2); // Jump straight to Misiones
                    } else {
                      setActiveTab(1); // Go to Sorteo
                      setSorteoPaso('config');
                    }
                  }}
                    className="group px-4 py-12 bg-[#343082] hover:bg-[#433eb3] rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] cursor-pointer flex flex-col items-center justify-center border-2 border-transparent hover:border-indigo-400 relative overflow-hidden">
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-indigo-300/50"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-indigo-300/50"></div>
                    <span className="text-2xl md:text-4xl font-black text-white tracking-widest mb-4 drop-shadow-md">{aula}</span>
                    <span className="bg-transparent border-2 border-indigo-300/50 text-[10px] text-indigo-200 font-bold tracking-widest md:tracking-[0.3em] uppercase px-4 py-2 rounded-full group-hover:bg-indigo-400 group-hover:text-black group-hover:border-indigo-400 transition-colors">PROYECTAR CLASE</span>
                  </button>
                ))}
              </div>

              <div className="bg-black/50 border border-indigo-900/50 p-6 rounded-2xl max-w-xl mx-auto text-center">
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-4">AÑADIR NUEVO SALÓN A ESTA CARPETA</p>
                <div className="flex gap-2">
                  <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} placeholder="Ej. 3ro A, Confirmación, etc." className="flex-grow bg-[#111424] border border-slate-700 rounded py-3 px-4 text-sm text-white outline-none focus:border-indigo-500" />
                  <button onClick={() => {
                    if(!newClassName.trim() || scores[newClassName.trim().toUpperCase()]) return;
                    const c = newClassName.trim().toUpperCase();
                    setScores(prev => ({...prev, [c]: { c1:0, c2:0, c3:0, c4:0, c5:0, c6:0, c7:0 }}));
                    setRoster(prev => ({...prev, [c]: { c1:[], c2:[], c3:[], c4:[], c5:[], c6:[], c7:[] }}));
                    setNewClassName('');
                  }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 rounded text-sm font-bold cursor-pointer transition-colors flex items-center justify-center"><Plus className="w-5 h-5"/></button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-center justify-center mt-4">
              <button onClick={() => setView('global_ranking')} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-12 py-5 font-black uppercase tracking-widest md:tracking-[0.2em] text-sm md:text-base transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] hover:scale-105 flex items-center justify-center gap-3 rounded-full cursor-pointer border-2 border-amber-300"><Globe className="w-6 h-6"/> VER CLASIFICACIÓN GLOBAL MULTIVERSO</button>
              <button onClick={() => setView('archivos_misiones')} className="bg-[#05060b] border border-indigo-500/50 text-indigo-400 hover:text-white hover:bg-indigo-900/50 px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 rounded-full cursor-pointer shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"><Scroll className="w-5 h-5"/> CENTRO DE DESCARGAS (DOSSIERS DE MISIONES)</button>
              <button onClick={() => setShowInstructions(true)} className="bg-[#05060b] border border-cyan-500/50 text-cyan-400 hover:text-white hover:bg-cyan-900/50 px-10 py-4 font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 rounded-full cursor-pointer mt-2 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"><Hexagon className="w-5 h-5"/> MANUAL TÁCTICO DEL JUEGO (INSTRUCCIONES)</button>
            </div>
            
            <div className="mt-16 border-t border-[#2a2e45] pt-6 flex flex-col items-center justify-center">
              <p className="text-slate-500 text-[10px] uppercase tracking-widest md:tracking-[0.2em] font-mono">Desarrollado y Diseñado Originalmente por:</p>
              <p className="text-indigo-400 font-black text-sm uppercase tracking-widest mt-1">Prof. Eder Carrasco</p>
              <p className="text-amber-500 text-[10px] font-bold mt-1 bg-amber-900/20 px-3 py-1 rounded-full border border-amber-500/20">De profe a profe Oficial</p>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── GLOBAL RANKING ─────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'global_ranking' && (
        <div className="flex-grow flex flex-col items-center p-8 relative overflow-hidden bg-[#06080e] dot-grid min-h-screen">
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 mt-10">
            <button onClick={() => setView('selector')} className="absolute top-0 left-0 text-slate-500 hover:text-amber-500 bg-[#161827] border border-[#2a2e45] px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> VOLVER</button>
            <Globe className="w-16 h-16 text-amber-500 mb-4 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]"/>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-2xl">SALÓN DE LA FAMA</h1>
            <span className="border border-amber-900/50 text-amber-500 px-6 py-2 rounded-full text-[10px] font-bold tracking-widest md:tracking-[0.4em] uppercase mb-12 shadow-sm bg-[#18110b]">TORNEO UNIVERSAL • TODO 1RO DE SECUNDARIA</span>
            <div className="w-full space-y-4 pb-20">
              {(() => {
                const globalTotals = clansData.map(clan => {
                  const total = ['1A', '1B', '1C'].reduce((sum, aula) => sum + (scores[aula]?.[clan.id] || 0), 0);
                  return { ...clan, total };
                }).sort((a, b) => b.total - a.total);
                return globalTotals.map((clan, idx) => (
                  <div key={clan.id} className={`flex justify-between items-center px-8 py-5 rounded-2xl border-2 transition-all ${idx === 0 ? 'border-amber-400 bg-[#241e3a] shadow-[0_0_30px_rgba(245,158,11,0.2)]' : idx === 1 ? 'border-slate-400 bg-[#15192b]' : idx === 2 ? 'border-amber-700 bg-[#1e1710]' : 'border-[#1e293b] bg-[#0f111a]'}`}>
                    <div className="flex items-center gap-6">
                      <span className={`text-4xl font-black italic ${idx === 0 ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'}`}>#{idx + 1}</span>
                      <span className="text-white font-black text-xl md:text-2xl uppercase tracking-widest">{clan.name.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-4xl font-black ${idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-indigo-300' : idx === 2 ? 'text-indigo-400' : 'text-indigo-500'}`}>{clan.total}</span>
                      <span className="text-amber-500 font-bold text-lg">XP</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── CLANS SIDEBAR ──────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showClans && selectedClass && (
        <div className="fixed top-0 right-0 w-[85vw] sm:w-80 h-full bg-[#111424] border-l border-[#1e293b] flex flex-col shadow-2xl z-[99999] animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-[#1e293b] bg-[#0a0b12] flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Trophy className="w-5 h-5"/> AUDITORÍA GENERAL</h2>
              <p className="text-indigo-400 text-xs font-bold tracking-widest mt-1">Base de Datos: Salón {selectedClass}</p>
            </div>
            <button onClick={() => setShowClans(false)} className="text-red-400 bg-red-950/40 hover:bg-red-900/80 p-2 rounded-lg transition-colors border border-red-900/50 cursor-pointer"><X className="w-4 h-4"/></button>
          </div>
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {[...clansData].sort((a,b) => (scores[selectedClass]?.[b.id] || 0) - (scores[selectedClass]?.[a.id] || 0)).map((clan) => (
              <div key={clan.id} className="p-4 rounded-xl border border-[#1e293b] bg-[#181c31] flex flex-col gap-3 relative overflow-hidden group hover:border-[#2d3748] transition-colors shadow-lg">
                <div className="flex justify-between items-center mb-1 px-1">
                  <span className="font-black text-white text-sm uppercase tracking-widest truncate max-w-[170px]">{clan.name.toUpperCase()}</span>
                  <span className="text-xl font-black text-indigo-300">{scores[selectedClass]?.[clan.id] || 0}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => updateScore(clan.id, 50)} className="bg-emerald-900/30 hover:bg-emerald-800/60 text-emerald-400 border border-emerald-500/50 py-2 rounded text-[11px] font-bold cursor-pointer transition-colors">+50 Magistral</button>
                  <button onClick={() => updateScore(clan.id, 10)} className="bg-blue-900/30 hover:bg-blue-800/60 text-blue-400 border border-blue-500/50 py-2 rounded text-[11px] font-bold cursor-pointer transition-colors">+10 Aporte</button>
                  <button onClick={() => updateScore(clan.id, -20)} className="bg-amber-900/30 hover:bg-amber-800/60 text-amber-500 border border-amber-500/50 py-2 rounded text-[11px] font-bold cursor-pointer transition-colors">-20 Falla</button>
                  <button onClick={() => updateScore(clan.id, -50)} className="bg-red-900/30 hover:bg-red-800/60 text-red-400 border border-red-500/50 py-2 rounded text-[11px] font-bold cursor-pointer transition-colors">-50 Indisciplina</button>
                </div>
                <div className="flex items-center gap-2 mt-1 border-t border-slate-700/50 pt-3">
                  <input type="number" id={`manualScore_${clan.id}`} placeholder="PUNTOS LIBRES (EJ. 5 O -5)" className="flex-grow bg-[#0a0b12] border border-[#2a2e45] rounded p-2 text-[10px] text-white outline-none focus:border-indigo-500 font-bold uppercase tracking-widest" />
                  <button 
                    onClick={() => {
                      const input = document.getElementById(`manualScore_${clan.id}`);
                      const val = parseInt(input.value);
                      if (!isNaN(val)) {
                        updateScore(clan.id, val);
                        input.value = '';
                      }
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded cursor-pointer transition-colors shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                  >
                    <CheckCircle2 className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── CAMPAMENTO BASE ─────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'campamento_base' && selectedClass && (
        <div className="flex-grow flex flex-col relative dot-grid bg-[#06080e]">
          <header className="bg-[#0a0b12]/90 backdrop-blur-md border-b border-[#1e293b] p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('selector')} className="text-slate-500 hover:text-white bg-[#161827] border border-[#2a2e45] px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> SALIR</button>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase flex items-center gap-3"><Flame className="w-5 h-5 text-amber-500 hidden md:block"/> ODISEA BÍBLICA <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded tracking-widest">{selectedClass}</span></h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowInstructions(true)} className="hidden md:flex text-cyan-400 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/30 px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase items-center gap-2 transition-colors cursor-pointer"><Hexagon className="w-4 h-4"/> MANUAL</button>
              <button onClick={() => setShowClans(!showClans)} className="bg-amber-500/10 border border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-black px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer"><Trophy className="w-4 h-4"/> AUDITORÍA</button>
            </div>
          </header>

          <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest md:tracking-[0.2em] uppercase mb-2 drop-shadow-lg">CAMPAMENTO BASE</h2>
              <span className="border border-indigo-900/50 text-indigo-400 px-4 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest md:tracking-[0.4em] uppercase bg-[#0f111a]">TERCER BIMESTRE - CÓDICE DEL RECLUTA</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { id: 1, title: '1. SESIÓN DE HOY', desc: 'EL DESPERTAR (MODO AULA)', icon: Wand2, tag: 'CLASE 1' },
                { id: 2, title: '2. LAS MISIONES', desc: 'CÓDICE TEMÁTICO DEL BIMESTRE', icon: Scroll },
                { id: 3, title: '3. LOS CLANES', desc: 'ESTANDARTES Y TROPAS REALES', icon: Shield },
                { id: 4, title: '4. TU PRIMERA TAREA', desc: 'DIRECTIVA DE FORJA (CLASSROOM)', icon: Flame, tagColor: 'text-emerald-500' }
              ].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`cursor-pointer relative flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all group overflow-hidden ${activeTab === tab.id ? 'bg-[#151226] border-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.2)]' : 'bg-[#0f111a] border-[#1e293b] hover:border-indigo-900 hover:bg-[#131524]'}`}>
                  {tab.tag && <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest px-2 py-1 rounded bg-indigo-900/50 text-indigo-300">{tab.tag}</span>}
                  <tab.icon className={`w-12 h-12 mb-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-600 group-hover:text-indigo-500'} transition-colors`} />
                  <h3 className="font-black text-white text-sm tracking-widest uppercase">{tab.title}</h3>
                  <p className={`text-[9px] font-bold tracking-widest uppercase mt-2 ${tab.tagColor || 'text-slate-500'}`}>{tab.desc}</p>
                </button>
              ))}
            </div>

            {/* TAB 1: SORTEO */}
            {activeTab === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center mb-10">
                  <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"/>
                  <h2 className="text-4xl font-black text-slate-300 tracking-widest md:tracking-[0.2em] uppercase mb-2">LA GRAN ASAMBLEA</h2>
                  <p className="text-slate-500 text-xs tracking-widest md:tracking-[0.3em] font-bold uppercase">CIRCUITO PEDAGÓGICO DE INICIO</p>
                </div>
                {sorteoPaso === 'config' && (
                  <div className="bg-[#0f111a] border border-[#1e293b] p-8 rounded-2xl max-w-2xl mx-auto text-center shadow-xl">
                    <p className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-6 flex justify-center items-center gap-2"><Sparkles className="w-4 h-4"/> SORTEO DE LA PROVIDENCIA ({selectedClass})</p>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="bg-[#15182b] p-4 rounded-xl border border-[#2a2e45]">
                        <label className="block text-slate-400 text-[10px] tracking-widest uppercase font-bold mb-2">CANTIDAD DE CLANES</label>
                        <input type="number" value={sorteoGrupos} onChange={e => setSorteoGrupos(e.target.value)} className="w-full bg-black border border-indigo-900 rounded p-3 text-center text-2xl font-black text-white outline-none focus:border-amber-500" min="1" max="7" />
                      </div>
                      <div className="bg-[#15182b] p-4 rounded-xl border border-[#2a2e45]">
                        <label className="block text-slate-400 text-[10px] tracking-widest uppercase font-bold mb-2">MIEMBROS POR CLAN</label>
                        <input type="number" value={sorteoMiembros} onChange={e => setSorteoMiembros(e.target.value)} className="w-full bg-black border border-indigo-900 rounded p-3 text-center text-2xl font-black text-white outline-none focus:border-amber-500" min="1" max="10" />
                      </div>
                    </div>
                    
                    <div className="mb-8 text-left bg-[#15182b] p-4 rounded-xl border border-[#2a2e45]">
                      <label className="block text-slate-400 text-[10px] tracking-widest uppercase font-bold mb-2 flex items-center justify-between">
                        <span>LISTA DE ESTUDIANTES (OPCIONAL)</span>
                        <span className="text-indigo-400 font-mono text-[9px] lowercase">uno por línea</span>
                      </label>
                      <textarea 
                        value={studentsList} 
                        onChange={e => setStudentsList(e.target.value)} 
                        placeholder={`Pega aquí los nombres de tus estudiantes. Ej:\nJuan Perez\nMaria Gomez\n... \n\nSi dejas esto vacío, el simulador asignará "RECLUTA 1", "RECLUTA 2", etc.`}
                        className="w-full h-32 bg-black border border-indigo-900/50 rounded p-3 text-xs text-white outline-none focus:border-amber-500 custom-scrollbar font-mono leading-relaxed resize-none"
                      />
                    </div>

                    <button onClick={sortearClanes} className="w-full bg-[#18110a] hover:bg-[#24170c] border-2 border-amber-600 text-amber-500 hover:text-amber-400 px-8 py-5 rounded-xl font-black uppercase tracking-widest md:tracking-[0.2em] transition-all hover:scale-[1.02] flex justify-center items-center gap-3 cursor-pointer"><Play className="w-5 h-5"/> INICIAR INMERSIÓN</button>
                  </div>
                )}
                {sorteoPaso === 'cine' && (
                  <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-overlay animate-[slowZoom_12s_linear_forwards]"></div>
                    <div className="absolute text-center" style={{ opacity: 0, animation: 'cinematicText 3s ease-out forwards 1s' }}><p className="text-3xl text-slate-300 uppercase tracking-widest md:tracking-[0.5em] font-light">La suerte está echada...</p></div>
                    <div className="absolute text-center" style={{ opacity: 0, animation: 'cinematicText 3s ease-out forwards 4s' }}><p className="text-4xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black">El destino los llama...</p></div>
                    <div className="absolute text-center" style={{ opacity: 0, animation: 'cinematicTextStay 4s ease-out forwards 7s' }}><p className="text-5xl text-white uppercase tracking-widest md:tracking-[0.3em] font-bold drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">QUE SURJAN LOS LINAJES.</p></div>
                  </div>
                )}
                {sorteoPaso === 'result' && (
                  <div className="animate-in zoom-in duration-500">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-amber-500 tracking-widest uppercase">RESULTADOS OFICIALES ({selectedClass})</h3>
                      <div className="flex gap-4">
                        <button onClick={() => { setActiveTab(3); setClanSubTab('estandartes'); }} className="text-indigo-400 hover:text-white bg-indigo-900/30 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-indigo-500/30 cursor-pointer">Ir a Los Clanes</button>
                        <button onClick={() => setSorteoPaso('config')} className="text-slate-400 hover:text-white bg-slate-900/30 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border border-slate-500/30 cursor-pointer">Nuevo Sorteo</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {clansData.slice(0, Number(sorteoGrupos)).map(clan => (
                        <div key={clan.id} className="bg-[#0f111a] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden group shadow-lg">
                          <div className={`absolute top-0 left-0 w-1 h-full ${clan.bg.replace('/30','')}`}></div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-black border ${clan.border} flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>{clan.icon}</div>
                            <div><h4 className={`font-black uppercase tracking-widest text-lg ${clan.color}`}>{clan.name}</h4><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Reclutas: {roster[selectedClass]?.[clan.id]?.length || 0}</p></div>
                          </div>
                          <div className="space-y-2">
                            {roster[selectedClass]?.[clan.id]?.map((recluta, idx) => (
                              <div key={idx} className="bg-[#15182b] border border-[#2a2e45] px-3 py-2 rounded text-[11px] font-bold text-slate-300 tracking-wider truncate uppercase">{recluta}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MISIONES */}
            {activeTab === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-lg">ARCHIVOS CLASIFICADOS</h2>
                  <p className="text-slate-500 text-xs tracking-widest md:tracking-[0.3em] font-bold uppercase">LO QUE ENFRENTAREMOS ESTE BIMESTRE</p>
                </div>
                <div className="space-y-6 max-w-5xl mx-auto">
                  {[
                    { id: 1, title: 'SANTIDAD Y SACRIFICIO', etiqueta: 'MISIÓN 01', tema: 'LOS SACERDOTES', desc: '"El fuego del Sinaí arde. La santidad absoluta de Yahveh amenaza con consumir la impureza humana. ¿Cómo puede el hombre acercarse sin morir?"', icon: Scroll, bgClass: 'from-blue-950/40 to-[#0a0c16]', borderClass: 'border-blue-500/30 hover:border-blue-400', textClass: 'text-blue-400', iconBg: 'bg-blue-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]', action: () => { setView('mision1'); setStartMision1Cinematic(false); setM1Fase(0); } },
                    { id: 2, title: 'LA ERA DEL CAOS', etiqueta: 'MISIÓN 02', tema: 'LOS JUECES', desc: '"Anarquía total. Tribus dispersas, enemigos saqueando. Israel clama en la oscuridad, y de la nada, guerreros improbables se levantan."', icon: Crosshair, bgClass: 'from-red-950/40 to-[#0a0c16]', borderClass: 'border-red-500/30 hover:border-red-400', textClass: 'text-red-400', iconBg: 'bg-red-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(220,38,38,0.2)]', action: () => { setView('mision2'); setStartMision2Cinematic(false); setM2Fase(0); } },
                    { id: 3, title: 'EL ASCENSO DE LA CORONA', etiqueta: 'MISIÓN 03', tema: 'LOS REYES', desc: '"Israel rechaza a Yahveh como rey directo y exige un monarca humano. Comienza una era de coronas de oro y espadas manchadas de sangre."', icon: Crown, bgClass: 'from-amber-950/40 to-[#0a0c16]', borderClass: 'border-amber-500/30 hover:border-amber-400', textClass: 'text-amber-400', iconBg: 'bg-amber-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]', action: () => { setView('mision3'); setStartMision3Cinematic(false); setM3Fase(0); setM3SubTab('archivo'); } },
                    { id: 4, title: 'VOCES DEL DESIERTO', etiqueta: 'MISIÓN 04', tema: 'LOS PROFETAS', desc: '"Los reyes han fallado. Yahveh levanta hombres que gritan verdades incómodas frente al poder de los imperios."', icon: Flame, bgClass: 'from-fuchsia-950/40 to-[#0a0c16]', borderClass: 'border-fuchsia-500/30 hover:border-fuchsia-400', textClass: 'text-fuchsia-400', iconBg: 'bg-fuchsia-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(217,70,239,0.2)]', action: () => { setView('mision4'); setStartMision4Cinematic(false); setM4Fase(0); } },
                    { id: 5, title: 'HEROÍNAS DE LA FE', etiqueta: 'MISIÓN 05', tema: 'MUJERES DE ISRAEL', desc: '"Donde los hombres retrocedieron, la Providencia levantó mujeres. Estrategas militares y extranjeras leales."', icon: Shield, bgClass: 'from-emerald-950/40 to-[#0a0c16]', borderClass: 'border-emerald-500/30', textClass: 'text-emerald-400', iconBg: 'bg-emerald-900/50', shadowClass: '' }
                  ].map(mission => (
                    <div key={mission.id} onClick={mission.action} className={`relative bg-gradient-to-br ${mission.bgClass} backdrop-blur-xl border-2 ${mission.borderClass} rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center md:items-start transition-all duration-500 group ${mission.shadowClass} ${mission.action ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-2' : 'cursor-not-allowed opacity-60 grayscale hover:grayscale-0'} overflow-hidden`}>
                      
                      {/* Brillo de fondo animado */}
                      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full ${mission.iconBg} opacity-20 blur-[80px] group-hover:scale-150 group-hover:opacity-40 transition-all duration-1000`}></div>

                      {/* Contenedor del Icono */}
                      <div className={`relative ${mission.iconBg} border border-white/20 w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shrink-0 shadow-inner group-hover:rotate-6 transition-transform duration-500 z-10`}>
                        <mission.icon className={`w-12 h-12 md:w-16 md:h-16 ${mission.textClass}`} />
                      </div>
                      
                      {/* Contenido */}
                      <div className="flex-grow text-center md:text-left z-10 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-md">{mission.title}</h3>
                          <div className="flex items-center justify-center md:justify-end gap-3 flex-wrap">
                            <span className={`${mission.iconBg} ${mission.textClass} border border-white/20 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase shadow-lg backdrop-blur-sm`}>{mission.etiqueta}</span>
                            {!mission.action && <span className="bg-red-950/80 text-red-400 border border-red-500/50 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase shadow-lg flex items-center gap-2 backdrop-blur-sm"><Key className="w-3 h-3"/> ENCRIPTADO</span>}
                          </div>
                        </div>
                        <div className="w-full h-px bg-white/10 mb-6 relative">
                          <div className={`absolute left-0 top-0 h-full w-12 ${mission.iconBg} group-hover:w-full transition-all duration-1000`}></div>
                        </div>
                        <p className={`${mission.textClass} font-black text-xs md:text-sm tracking-widest md:tracking-[0.3em] uppercase mb-4`}>TEMA: {mission.tema}</p>
                        <p className="text-slate-300 text-lg md:text-xl italic leading-relaxed font-serif drop-shadow-sm">{mission.desc}</p>
                        
                        {mission.action && (
                          <div className={`mt-8 inline-flex items-center gap-3 ${mission.textClass} text-xs font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity`}>
                            <span className="w-12 h-px bg-current group-hover:w-24 transition-all duration-500"></span> INICIAR SECUENCIA <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform"/>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CLANES */}
            {activeTab === 3 && (
              <div className="animate-in fade-in duration-500">
                <div className="mb-10 text-center">
                  <h2 className="text-4xl md:text-5xl font-black text-indigo-400 tracking-tighter uppercase mb-2 drop-shadow-[0_0_20px_rgba(129,140,248,0.5)]">ASAMBLEA SAGRADA DE LOS 7 CLANES</h2>
                  <p className="text-slate-500 text-xs tracking-widest md:tracking-[0.3em] font-bold uppercase">CONOCIENDO NUESTRA HERENCIA Y DESTINO</p>
                </div>
                <div className="flex justify-center gap-2 flex-wrap mb-10 max-w-6xl mx-auto">
                  {clansData.map((c, i) => (
                    <button key={c.id} onClick={() => setClanSubTab(i)} className={`cursor-pointer px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 ${clanSubTab === i ? 'bg-transparent border-amber-500 text-amber-500' : 'bg-transparent border-[#1e293b] text-slate-500 hover:border-slate-600 hover:text-slate-300'}`}><Shield className="w-3 h-3 opacity-50"/> {c.name}</button>
                  ))}
                  <button onClick={() => setClanSubTab('sintesis')} className={`cursor-pointer px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all ml-4 ${clanSubTab === 'sintesis' ? 'bg-amber-950/40 border-amber-500 text-amber-500' : 'bg-transparent border-[#1e293b] text-slate-500 hover:border-amber-900 hover:text-amber-500'}`}>SÍNTESIS GLOBAL</button>
                  <button onClick={() => setClanSubTab('estandartes')} className={`cursor-pointer px-4 py-2 rounded-full border text-[10px] md:text-xs font-bold tracking-widest uppercase transition-all ${clanSubTab === 'estandartes' ? 'bg-indigo-950/40 border-indigo-500 text-indigo-400' : 'bg-transparent border-[#1e293b] text-slate-500 hover:border-indigo-900 hover:text-indigo-400'}`}>SALÓN DE ESTANDARTES</button>
                </div>

                {typeof clanSubTab === 'number' && (
                  <div className="bg-[#0b0c16] border border-[#1e293b] rounded-3xl p-6 md:p-10 max-w-6xl mx-auto flex flex-col md:flex-row gap-10 shadow-2xl relative overflow-hidden">
                    <div className="md:w-1/3 flex flex-col items-center text-center border-r border-[#1e293b] pr-10">
                      <div className={`w-32 h-32 rounded-3xl bg-[#0a0b12] border-2 ${clansData[clanSubTab].border} flex items-center justify-center text-6xl shadow-xl mb-6`}>{clansData[clanSubTab].icon}</div>
                      <h3 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter ${clansData[clanSubTab].color} mb-1 leading-tight`}>{clansData[clanSubTab].name}</h3>
                      <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase mb-6">VIRTUD: <span className="text-white">{clansData[clanSubTab].attribute}</span></p>
                      <div className="bg-[#05060b] border border-[#1e293b] w-full p-6 rounded-xl mb-6">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">LEMA OFICIAL</p>
                        <p className={`font-black uppercase text-lg ${clansData[clanSubTab].color}`}>{clansData[clanSubTab].lema}</p>
                      </div>
                      <div className="w-full text-left">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2"><UserPlus className="w-3 h-3"/> RECLUTAS ASIGNADOS ({roster[selectedClass]?.[clansData[clanSubTab].id]?.length || 0})</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {roster[selectedClass]?.[clansData[clanSubTab].id]?.length > 0 ? (
                            roster[selectedClass][clansData[clanSubTab].id].map((r, idx) => (
                              <span key={idx} className={`bg-[#111424] border ${clansData[clanSubTab].border.replace('/50', '/30')} ${clansData[clanSubTab].color} px-3 py-2 rounded text-[10px] font-bold tracking-wider uppercase`}>{r}</span>
                            ))
                          ) : (
                            <p className="text-xs text-slate-600 italic bg-[#0f111a] border border-[#1e293b] p-3 rounded">Esperando la elección divina.</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 flex flex-col gap-6 pt-4">
                      <div className={`bg-transparent border ${clansData[clanSubTab].border} p-8 rounded-2xl`}>
                        <p className={`text-[11px] font-black uppercase tracking-widest mb-4 flex items-center gap-2 ${clansData[clanSubTab].color}`}><Sparkles className="w-4 h-4"/> LA LLAMADA DIVINA</p>
                        <p className="text-white font-medium italic text-lg leading-relaxed">{clansData[clanSubTab].llamada}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-2 mt-4">1. ORIGEN BÍBLICO</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{clansData[clanSubTab].origen}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                        <div className="bg-[#0f111a] border border-[#1e293b] p-6 rounded-xl">
                          <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> HÉROE BÍBLICO</p>
                          <p className="text-white font-black text-base">{clansData[clanSubTab].hero}</p>
                        </div>
                        <div className="bg-[#0f111a] border border-[#1e293b] p-6 rounded-xl">
                          <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Eye className="w-4 h-4"/> SÍMBOLO</p>
                          <p className="text-slate-300 text-sm font-bold">{clansData[clanSubTab].symbol}</p>
                        </div>
                      </div>
                    </div>

                    {/* Boton para desbloquear Códice Maestro (Solo para el GM/Profesor) */}
                    <div className="mt-8 text-center">
                      <button onClick={() => setShowMasterReference(!showMasterReference)} className="bg-[#111424] border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-400 hover:text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] cursor-pointer">
                        {showMasterReference ? 'OCULTAR CÓDICE MAESTRO' : 'DESBLOQUEAR CÓDICE MAESTRO (REFERENCIA DEL PROFESOR)'}
                      </button>
                    </div>

                    {showMasterReference && (
                      <div className="mt-8 bg-[#0a0b12] border border-indigo-500/30 rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(79,70,229,0.2)] animate-in slide-in-from-top-4">
                        <div className="text-center mb-8">
                           <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse"/>
                           <h3 className="text-2xl font-black text-white uppercase tracking-widest">EL CÓDICE MAESTRO: RESUMEN HISTÓRICO</h3>
                           <p className="text-slate-400 text-sm max-w-3xl mx-auto mt-2 leading-relaxed">El video desglosa los libros bíblicos de Primera y Segunda de Reyes, mostrando cómo los reyes fallaron sistemáticamente, llevando a Israel a la ruina y alejándose de la promesa mesiánica.</p>
                        </div>
                        <div className="relative max-w-5xl mx-auto pl-4 md:pl-8">
                           {/* Línea vertical conectora */}
                           <div className="absolute left-[27px] md:left-[43px] top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500 via-indigo-500 to-emerald-500 rounded-full opacity-50"></div>
                           
                           {[
                              { 
                                title: "1. EL REINADO DE SALOMÓN", 
                                bg: "bg-amber-950/20", border: "border-amber-500/50", textTitle: "text-amber-400",
                                icon: "👑", iconBg: "bg-amber-900 text-amber-300",
                                contexto: "Inició brillante. Pide sabiduría y construye el majestuoso Templo, símbolo de la presencia divina.",
                                error: "Alianzas políticas (matrimonios), idolatría, acumulación excesiva de riqueza y esclavitud de su pueblo.",
                                leccion: "Un buen inicio o tener gran talento no sirve si el poder corrompe tus principios y terminas dañando a otros."
                              },
                              {
                                title: "2. LA DIVISIÓN DEL REINO",
                                bg: "bg-red-950/20", border: "border-red-500/50", textTitle: "text-red-400",
                                icon: "⚔️", iconBg: "bg-red-900 text-red-300",
                                contexto: "Roboam (hijo de Salomón) sube los impuestos con soberbia. El norte se rebela formando un nuevo país.",
                                error: "Jeroboam (Rey del Norte) construye becerros de oro por miedo a perder el control, repitiendo el peor pecado de Israel.",
                                leccion: "La soberbia destruye equipos (Roboam), y el miedo a perder liderazgo te lleva a tomar pésimas decisiones éticas (Jeroboam)."
                              },
                              {
                                title: "3. LOS REYES Y PROFETAS",
                                bg: "bg-indigo-950/20", border: "border-indigo-500/50", textTitle: "text-indigo-400",
                                icon: "📜", iconBg: "bg-indigo-900 text-indigo-300",
                                contexto: "De ±40 reyes en total, hubo 0 buenos en el Norte y solo 8 en el Sur. Dios levanta Profetas como 'perros guardianes'.",
                                error: "Los reyes abusaron de su autoridad, oprimiendo al pueblo y adorando ídolos egoístas.",
                                leccion: "Un líder necesita voces valientes a su alrededor (como Elías o Eliseo) que le digan la verdad cuando está equivocándose."
                              },
                              {
                                title: "4. LA CAÍDA DE ISRAEL (NORTE)",
                                bg: "bg-slate-900/40", border: "border-slate-500/50", textTitle: "text-slate-300",
                                icon: "📉", iconBg: "bg-slate-800 text-slate-300",
                                contexto: "Una espiral de violencia y asesinatos políticos (iniciada por Jehú). Todo vale por tener el trono.",
                                error: "Cero fidelidad al pacto de empatía y justicia. Asiria aprovecha la debilidad y los destruye.",
                                leccion: "Un grupo dividido, violento y sin reglas compartidas siempre será aplastado por los problemas externos."
                              },
                              {
                                title: "5. EL COLAPSO Y EXILIO (SUR)",
                                bg: "bg-purple-950/20", border: "border-purple-500/50", textTitle: "text-purple-400",
                                icon: "🔥", iconBg: "bg-purple-900 text-purple-300",
                                contexto: "Sobrevivió más gracias a líderes heroicos como Ezequías (fe) y Josías (reforma de lectura).",
                                error: "Los reyes perversos (Manasés) causaron daño irreversible. Babilonia arrasa Jerusalén.",
                                leccion: "Nuestras malas acciones de hoy (egoísmo, bullying) dejan cicatrices profundas que pueden hundir al grupo entero mañana."
                              },
                              {
                                title: "UN DESTELLO FINAL",
                                bg: "bg-emerald-950/20", border: "border-emerald-500/50", textTitle: "text-emerald-400",
                                icon: "🌱", iconBg: "bg-emerald-900 text-emerald-300",
                                content: "La historia concluye narrando un evento 40 años después de iniciado el exilio. Joaquín, un descendiente directo de David que estaba en prisión, es liberado por el rey de Babilonia e invitado a comer en la mesa real por el resto de su vida. \n\nEste inusual evento final deja al lector con un rayo de esperanza: Dios no ha abandonado al linaje de David, sentando las bases para el cumplimiento de sus promesas que se explorarán en los libros proféticos."
                              }
                           ].map((bloque, idx) => (
                              <div key={idx} className="relative mb-8 last:mb-0 pl-10 md:pl-16 animate-in slide-in-from-left-4">
                                <div className={`absolute left-0 top-4 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-lg md:text-xl z-10 border-2 ${bloque.border} ${bloque.iconBg} shadow-lg ring-4 ring-[#0a0b12]`}>{bloque.icon}</div>
                                <div className={`p-5 md:p-6 rounded-2xl border ${bloque.bg} ${bloque.border} shadow-lg hover:scale-[1.01] transition-transform`}>
                                  <h4 className={`text-lg md:text-xl font-black uppercase tracking-widest mb-4 border-b border-white/10 pb-3 ${bloque.textTitle}`}>{bloque.title}</h4>
                                  
                                  {bloque.contexto ? (
                                    <div className="space-y-4">
                                      <div>
                                        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">LO QUE PASÓ (CONTEXTO):</h5>
                                        <p className="text-slate-300 text-sm leading-relaxed">{bloque.contexto}</p>
                                      </div>
                                      <div className="bg-black/40 border-l-2 border-red-500 p-3 rounded-r-lg">
                                        <h5 className="text-[10px] font-black uppercase text-red-400 tracking-widest mb-1">EL FRACASO:</h5>
                                        <p className="text-red-200/90 text-sm leading-relaxed">{bloque.error}</p>
                                      </div>
                                      <div className="bg-amber-950/20 border-l-2 border-amber-500 p-3 rounded-r-lg">
                                        <h5 className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-1 flex items-center gap-1"><Crosshair className="w-3 h-3"/> LECCIÓN PARA EL AULA:</h5>
                                        <p className="text-amber-100/90 text-sm italic font-serif leading-relaxed">{bloque.leccion}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-sm md:text-base leading-relaxed space-y-4 text-emerald-100/90 font-serif">
                                      {bloque.content.split('\n\n').map((parrafo, i) => <p key={i}>{parrafo}</p>)}
                                    </div>
                                  )}
                                </div>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {clanSubTab === 'sintesis' && (
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-5xl font-black text-white uppercase tracking-tighter">SÍNTESIS DE CLANES</h3>
                      <p className="text-amber-500 text-xs font-bold tracking-widest uppercase mt-4 border border-amber-900/50 bg-amber-950/20 inline-block px-6 py-2 rounded-full"><BookOpen className="w-4 h-4 inline mr-2 -mt-1"/>COPIAR EN EL CUADERNO DE EDUCACIÓN RELIGIOSA</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {clansData.map(c => (
                        <div key={c.id} className="bg-[#0f111a] border border-[#1e293b] rounded-xl p-6 flex flex-col justify-between hover:border-slate-600 transition-colors">
                          <div>
                            <h4 className={`text-xl font-black uppercase tracking-widest mb-6 ${c.color}`}>{c.name}</h4>
                            <div className="space-y-4">
                              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">VIRTUD PRINCIPAL</p><p className="text-white font-bold text-sm">{c.attribute}</p></div>
                              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">LEMA OFICIAL</p><p className="text-slate-400 italic text-sm border-l-2 border-slate-700 pl-2">{c.lema}</p></div>
                              <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">SÍMBOLO (DIBUJO)</p><p className="text-slate-400 text-xs">{c.symbol}</p></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clanSubTab === 'estandartes' && (
                  <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8">
                      <h3 className="text-5xl font-black text-white uppercase tracking-tighter">SALÓN DE LOS ESTANDARTES</h3>
                      <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">CONOCE A LAS FACCIONES SAGRADAS</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {clansData.map((c, i) => (
                        <div key={c.id} className="bg-[#0b0c16] border border-[#1e293b] rounded-2xl p-6 relative overflow-hidden shadow-lg">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-4 items-center">
                              <div className={`w-12 h-12 rounded-xl bg-[#0a0b12] border ${c.border} flex items-center justify-center font-black text-2xl ${c.color}`}>{i+1}</div>
                              <div><h4 className={`text-2xl font-black uppercase tracking-widest ${c.color}`}>{c.name}</h4><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">VIRTUD: {c.attribute}</p></div>
                            </div>
                            <div className="text-right"><p className="text-2xl font-black text-white">{scores[selectedClass]?.[c.id] || 0}</p><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">PUNTOS XP</p></div>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-3"><Users className="w-3 h-3"/> RECLUTAS CONFIRMADOS ({roster[selectedClass]?.[c.id]?.length || 0})</p>
                            <div className="flex flex-wrap gap-2">
                              {roster[selectedClass]?.[c.id]?.length > 0 ? (
                                roster[selectedClass][c.id].map((r, idx) => (<span key={idx} className="bg-transparent border border-indigo-900/50 text-indigo-300 px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase">{r}</span>))
                              ) : (
                                <div className="w-full bg-[#05060b] border border-dashed border-[#1e293b] p-4 text-center rounded"><p className="text-xs text-slate-600 font-bold tracking-widest uppercase">ESPERANDO LA ELECCIÓN DIVINA EN EL AULA.</p></div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: TAREA */}
            {activeTab === 4 && (
              <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                  <Flame className="w-16 h-16 text-emerald-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"/>
                  <h2 className="text-5xl font-black text-white tracking-tighter uppercase mb-4">MISIÓN 1: LOS SACERDOTES</h2>
                  <p className="text-emerald-500 text-[10px] tracking-widest md:tracking-[0.4em] font-bold uppercase border border-emerald-900/50 bg-emerald-950/20 inline-block px-4 py-1 rounded-full">PRIMERA ASIGNACIÓN OFICIAL</p>
                </div>
                <div className="bg-[#0f111a] border border-[#1e293b] rounded-2xl p-8 space-y-8 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                  
                  <div>
                    <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-emerald-600 pl-4 mb-6">"Para poder sobrevivir en el desierto y acercarnos a la presencia de Dios, necesitamos conocer a los mediadores oficiales: Los Sacerdotes."</p>
                    <p className="text-amber-400 text-sm font-bold tracking-widest uppercase mb-4 flex items-center gap-2"><Target className="w-5 h-5"/> ESTA ES UNA MISIÓN DE INVESTIGACIÓN INDIVIDUAL QUE DEBEN DESARROLLAR A MANO EN SUS CUADERNOS (EL CÓDICE).</p>
                  </div>

                  <div className="bg-[#131722] border border-emerald-900/30 p-6 rounded-xl">
                    <h3 className="text-lg font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3 mb-6"><Scroll className="w-5 h-5"/> 📝 RETO DE INVESTIGACIÓN</h3>
                    <div className="space-y-6 text-sm text-slate-300">
                      <div className="flex flex-col gap-1">
                        <strong className="text-emerald-300 uppercase tracking-wider">EL LINAJE ELEGIDO:</strong>
                        <p>¿De qué tribu de Israel provenían exclusivamente los sacerdotes?</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong className="text-emerald-300 uppercase tracking-wider">LOS PIONEROS:</strong>
                        <p>¿Cuáles son los nombres del primer Sumo Sacerdote de Israel y de sus hijos?</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong className="text-emerald-300 uppercase tracking-wider">PERFIL DEL CARGO:</strong>
                        <p>¿Cuáles eran las características principales que debía tener un sacerdote y qué funciones exactas cumplían dentro del templo?</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <strong className="text-emerald-300 uppercase tracking-wider">EL MAPA TÁCTICO (EL TABERNÁCULO):</strong>
                        <p>Los sacerdotes eran los custodios de la morada de Dios. Dibuja o pega en tu cuaderno una imagen clara del "Tabernáculo de Reunión" y señala sus partes principales (Atrio, Lugar Santo, Lugar Santísimo y los objetos que hay en ellos).</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest flex items-center gap-3 mb-3"><Users className="w-5 h-5"/> ⚠️ REGLA DE ALIANZA COOPERATIVA</h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-4">LEER ATENTAMENTE: Aunque la tarea es individual y cada uno debe tenerla en su propio cuaderno, las recompensas se ganan en equipo.</p>
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start gap-3 bg-[#111827] p-4 rounded-lg border border-slate-700">
                        <Trophy className="w-6 h-6 text-emerald-400 shrink-0"/>
                        <div>
                          <strong className="text-emerald-400 block uppercase tracking-wider mb-1">💎 RECOMPENSA ÉPICA</strong>
                          <p className="text-slate-300 text-sm">Si el día de la revisión TODOS y cada uno de los integrantes de tu Clan tienen la misión completa en su cuaderno... <strong className="text-white">¡TODO EL CLAN RECIBIRÁ UN BONO AUTOMÁTICO DE +150 XP!</strong></p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-[#1f0a0a] p-4 rounded-lg border border-red-900/50">
                        <AlertTriangle className="w-6 h-6 text-red-500 shrink-0"/>
                        <div>
                          <strong className="text-red-500 block uppercase tracking-wider mb-1">❌ LA CONDICIÓN</strong>
                          <p className="text-red-200 text-sm">Si a un solo integrante de tu clan le falta la tarea o no la hizo completa, el clan entero pierde el bono de los 150 puntos.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 bg-blue-950/20 p-4 rounded-lg border border-blue-900/50">
                        <Compass className="w-6 h-6 text-blue-400 shrink-0"/>
                        <div>
                          <strong className="text-blue-400 block uppercase tracking-wider mb-1">🤝 CONSEJO DE GAME MASTER</strong>
                          <p className="text-blue-200 text-sm">Como verdaderos líderes, comuníquense por TODOS LOS MEDIOS DIGITALES QUE TENGAN. Recuérdense mutuamente hacer la tarea. ¡Un clan no abandona a ninguno de sus miembros!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MISIÓN 1: SACERDOTES ────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision1' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#050300] min-h-screen">
          {m1Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-amber-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-amber-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> AUDIO MISIÓN 1</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHUxOYFoR4/YfVzZqhCBllExJdCAr972g/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {!startMision1Cinematic ? (
            <div className="z-10 flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 px-4">
              <Shield className="w-24 h-24 text-amber-500 mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-pulse"/>
              <p className="text-amber-600 text-xs tracking-widest md:tracking-[0.3em] uppercase mb-4 font-bold">INSTRUCCIÓN GM: 1) ACTIVA EL AUDIO EN LA ESQUINA. 2) INICIA LA SECUENCIA.</p>
              <button onClick={() => setStartMision1Cinematic(true)} className="bg-gradient-to-b from-amber-700 to-amber-900 border-2 border-amber-500 text-amber-100 px-8 py-4 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] rounded-full cursor-pointer">Iniciar Secuencia Misión 1</button>
              <button onClick={() => setView('campamento_base')} className="mt-6 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer">Volver al Campamento</button>
            </div>
          ) : m1Fase === 0 ? (
            <div key="cinematica-m1" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-black">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541845157-a6d2d100c931?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-color-dodge animate-[slowZoom_25s_linear_forwards]"></div>
              <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 2s' }}><p className="text-2xl text-amber-500 uppercase tracking-widest md:tracking-[0.4em] font-light">El Sinaí arde en llamas...</p></div>
              <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 7s' }}><p className="text-3xl text-orange-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]">DIOS ES PERFECTO. NOSOTROS NO.</p></div>
              <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 12s' }}><p className="text-xl text-amber-200 uppercase tracking-widest md:tracking-[0.4em] font-light">Quien se acerque sin pureza, perecerá.</p></div>
              <div className="absolute inset-0 bg-white z-[100]" style={{ opacity: 0, animation: 'cinematicText 2s ease-out forwards 19s' }}></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 4s ease-out forwards 20s' }}>
                <h1 className="text-6xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(245,158,11,1)]">EL TABERNÁCULO</h1>
                <p className="text-amber-500 mt-4 text-lg md:text-2xl tracking-widest md:tracking-[0.5em] font-bold uppercase">SANTIDAD Y SACRIFICIO</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 1s ease-out forwards 23s' }}>
                <button onClick={() => setM1Fase(1)} className="bg-amber-900/80 border-2 border-amber-400 text-amber-200 px-10 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-xl transition-all shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-110 flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-sm">CRUZAR EL VELO <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          ) : (
            <>
              <header className="bg-[#0a0b12] border-b border-[#1e293b] p-3 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                  <button onClick={() => {setM1Fase(0); setStartMision1Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> BASE {selectedClass}</button>
                  <h2 className="text-white font-black tracking-widest uppercase text-sm md:text-base">
                    {m1SubTab === 'proposito' ? 'PROPÓSITO Y MISIÓN' : m1SubTab === 'fase1' ? 'FASE 1: EL DESIERTO Y EL TRUENO' : m1SubTab === 'fase2' ? 'FASE 2: LA SOLUCIÓN DIVINA' : m1SubTab === 'decodificador' ? 'DECODIFICADOR DEL PECTORAL' : m1SubTab === 'fase3' ? 'FASE 3: REFLEXIÓN DEL CLAN' : 'FASE 4: LA MISIÓN DE CAMPO'}
                  </h2>
                </div>
                <button onClick={() => setShowClans(!showClans)} className="text-amber-400 bg-amber-900/30 p-2 rounded-full hover:bg-amber-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
              </header>

              <div className="bg-[#05060b] border-b border-[#1e293b] p-2 flex justify-center gap-2 overflow-x-auto z-40 shadow-md">
                {[
                  {id: 'proposito', label: 'PROPÓSITO'}, {id: 'fase1', label: '1. DESIERTO'}, {id: 'fase2', label: '2. SANTUARIO'},
                  {id: 'decodificador', label: 'DECODIFICADOR'}, {id: 'fase3', label: '3. REFLEXIÓN'}, {id: 'fase4', label: '4. TAREA'}
                ].map(tab => (
                  <button key={tab.id} onClick={() => setM1SubTab(tab.id)} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m1SubTab === tab.id ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(217,119,6,0.5)]' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}>{tab.label}</button>
                ))}
              </div>

              <div className="flex-grow overflow-y-auto p-4 md:p-8 relative custom-scrollbar pb-24 z-10">
                {m1SubTab === 'proposito' && (
                  <div className="max-w-4xl mx-auto mt-10 md:mt-20 animate-in zoom-in duration-500">
                    <div className="bg-[#0a0b16] border border-slate-800 rounded-3xl p-8 md:p-14 flex flex-col items-center text-center shadow-[0_0_50px_rgba(245,158,11,0.05)]">
                      <Shield className="w-16 h-16 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                      <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-amber-500 uppercase tracking-widest mb-8">MISIÓN CENTRAL</h3>
                      <p className="text-slate-300 italic text-lg md:text-xl leading-relaxed max-w-3xl font-serif">"Descifraremos los planos del Tabernáculo y el rol vital del sacerdote como el puente definitivo entre un Dios Santo y un pueblo imperfecto."</p>
                    </div>
                  </div>
                )}

                {m1SubTab === 'fase1' && (
                  <div className="max-w-4xl mx-auto mt-10 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#110505] border border-red-900/50 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.1)]">
                      <div className="flex items-center gap-4 mb-10 border-b border-red-900/30 pb-6"><AlertTriangle className="w-8 h-8 text-red-500"/><h3 className="text-2xl md:text-3xl font-black text-red-500 uppercase tracking-widest">CONTEXTO DE SUPERVIVENCIA</h3></div>
                      <div className="space-y-8 mb-10">
                        <div className="flex items-start gap-6"><div className="bg-red-900 text-red-200 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 shadow-inner">1</div><p className="text-slate-300 text-base md:text-lg leading-relaxed pt-1">Israel ha escapado de Egipto pero están atrapados en el desierto frente al imponente Monte Sinaí.</p></div>
                        <div className="flex items-start gap-6"><div className="bg-red-900 text-red-200 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 shadow-inner">2</div><p className="text-slate-300 text-base md:text-lg leading-relaxed pt-1">La presencia directa de Dios es un fuego consumidor; si el pueblo se acerca con su pecado, <strong className="text-white">morirán instantáneamente</strong>.</p></div>
                      </div>
                      <div className="bg-[#1a0505] border border-red-800 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left shadow-lg">
                        <div className="bg-red-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.5)]">?</div>
                        <p className="text-red-200 italic font-bold text-lg md:text-xl leading-relaxed">Pregunta para los Clanes: ¿Cómo puede un pueblo impuro sobrevivir y relacionarse con un Dios perfectamente santo?</p>
                      </div>
                    </div>
                  </div>
                )}

                {m1SubTab === 'fase2' && (
                  <div className="max-w-5xl mx-auto mt-6 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#0b0c16] border border-indigo-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                      <button onClick={() => setM1SubTab('decodificador')} className="absolute top-6 right-6 md:top-10 md:right-10 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all hover:scale-105 cursor-pointer z-10"><Key className="w-5 h-5"/> DECODIFICADOR</button>
                      <div className="text-center mb-12 relative z-0">
                        <h3 className="text-3xl md:text-4xl font-black text-indigo-400 uppercase tracking-widest mb-3">ESQUEMA GENERAL DEL SANTUARIO</h3>
                        <p className="text-slate-400 text-[10px] md:text-xs tracking-widest md:tracking-[0.3em] uppercase font-bold">TRANSCRIPCIÓN OBLIGATORIA EN CUADERNO</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="border border-amber-900/50 bg-[#120a05] rounded-2xl p-8 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
                          <h4 className="text-amber-500 font-black uppercase tracking-widest text-sm md:text-base mb-8 border-b border-amber-900/30 pb-4">A. LA MÁQUINA DE SALVACIÓN</h4>
                          <div className="space-y-8">
                            <div className="flex items-start gap-5"><Shield className="w-6 h-6 text-amber-600 shrink-0 mt-1"/><div><p className="text-white font-black text-sm mb-2 uppercase tracking-wider">EL TABERNÁCULO</p><p className="text-slate-300 text-sm leading-relaxed">La "tienda de reunión". Único lugar donde la santidad pura de Dios convive con humanos sin destruirlos.</p></div></div>
                            <div className="flex items-start gap-5"><BookOpen className="w-6 h-6 text-amber-600 shrink-0 mt-1"/><div><p className="text-white font-black text-sm mb-2 uppercase tracking-wider">EL SISTEMA</p><p className="text-slate-300 text-sm leading-relaxed">Requiere un sacrificio (para limpiar pecado) y un mediador puro autorizado para entrar.</p></div></div>
                          </div>
                        </div>
                        <div className="border border-indigo-900/50 bg-[#0a0b12] rounded-2xl p-8 shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm md:text-base mb-8 border-b border-indigo-900/30 pb-4">B. LOS SACERDOTES</h4>
                          <div className="space-y-8">
                            <div className="flex items-start gap-5"><Users className="w-6 h-6 text-indigo-500 shrink-0 mt-1"/><div><p className="text-white font-black text-sm mb-2 uppercase tracking-wider">EL LLAMADO (TRIBU DE LEVÍ)</p><p className="text-slate-300 text-sm leading-relaxed">Los únicos separados y autorizados para acercarse al fuego de Dios y operar el tabernáculo.</p></div></div>
                            <div className="flex items-start gap-5"><CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0 mt-1"/><div><p className="text-white font-black text-sm mb-2 uppercase tracking-wider">LA VESTIDURA SAGRADA</p><p className="text-slate-300 text-sm leading-relaxed">Usan el <strong className="text-indigo-300">Pectoral del Juicio</strong>: 12 piedras preciosas donde cada una lleva grabado el nombre de una tribu.</p></div></div>
                          </div>
                        </div>
                      </div>
                      <div className="border border-purple-900/50 bg-[#120a1a] rounded-2xl p-8 text-center mb-8 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                        <h4 className="text-purple-400 font-black uppercase tracking-widest text-sm md:text-base mb-4">C. EL PROPÓSITO FINAL</h4>
                        <p className="text-slate-200 text-base md:text-lg leading-relaxed max-w-4xl mx-auto font-serif italic">Entrar a la presencia de Dios llevando <strong className="text-white not-italic border-b border-purple-500">sobre su corazón</strong> a todo el pueblo. Esto es la verdadera <strong className="text-purple-300 not-italic">Intercesión</strong>: ser el puente vital entre Dios y la humanidad.</p>
                      </div>
                      <div className="bg-red-950/40 border border-red-800 p-5 rounded-xl text-center shadow-inner">
                        <p className="text-red-400 font-black text-xs md:text-sm uppercase tracking-widest flex items-center justify-center gap-3"><AlertTriangle className="w-5 h-5 animate-pulse"/> AUDITORÍA EXTREMA: EL CLAN NO PARTICIPA SI FALTA 1 APUNTE.</p>
                      </div>
                    </div>
                  </div>
                )}

                {m1SubTab === 'decodificador' && (
                  <div className="w-full h-full flex flex-col items-center mt-6 animate-in zoom-in duration-500">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-widest md:tracking-[0.2em] md:tracking-widest md:tracking-[0.3em] mb-4 text-center drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">DECODIFICADOR DEL PECTORAL</h3>
                    <p className="text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center mb-8 max-w-3xl border border-amber-900/50 bg-[#18110a] p-4 rounded-xl shadow-inner">
                      ⚠️ NORMAS DEL DECODIFICADOR: La ruleta decidirá el orden de participación. Cuando sea el turno de un Clan, deberá intentar adivinar una letra de la tribu correspondiente. <strong className="text-amber-300">Si acierta, sigue jugando. Si se equivoca, pierde automáticamente -10 XP y su turno termina.</strong>
                    </p>
                    
                    {!ruletaM1Girando && ruletaM1Orden.length === 0 && (
                      <button onClick={() => {
                        setRuletaM1Girando(true);
                        setTimeout(() => {
                          let shuffled = [...clansData].sort(() => 0.5 - Math.random());
                          setRuletaM1Orden(shuffled);
                          setRuletaM1Girando(false);
                        }, 3000);
                      }} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest mb-12 shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-105 transition-all cursor-pointer">
                        <RefreshCw className="w-5 h-5 inline-block mr-2" /> GIRAR RULETA DIVINA
                      </button>
                    )}

                    {ruletaM1Girando && (
                      <div className="mb-12 bg-[#05060b] border border-blue-900/50 p-8 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.2)] animate-pulse flex items-center justify-center">
                        <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                      </div>
                    )}

                    {ruletaM1Orden.length > 0 && !ruletaM1Girando && (
                      <div className="mb-12 w-full max-w-5xl bg-[#111424] border border-indigo-900/50 p-6 rounded-2xl shadow-xl animate-in slide-in-from-top-4">
                        <p className="text-center text-indigo-400 font-black text-xs uppercase tracking-widest md:tracking-[0.3em] mb-4">ORDEN ESTABLECIDO POR LA PROVIDENCIA</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          {ruletaM1Orden.map((c, i) => (
                            <div key={c.id} className="bg-black border border-indigo-500/30 px-4 py-2 rounded-lg flex items-center gap-2">
                              <span className="bg-indigo-900 text-indigo-200 w-5 h-5 rounded flex items-center justify-center font-black text-[10px]">{i+1}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-widest ${c.color}`}>{c.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-6 max-w-5xl mx-auto px-4">
                      {pectoralStones.map(stone => {
                        const isSolved = stoneProgress[stone.id];
                        return (
                          <button key={stone.id} onClick={() => {setActiveStone(stone.id); setGuessedLetters([]); setActiveAhorcadoClan(null);}} className={`relative w-20 h-20 md:w-28 md:h-28 rounded-2xl flex flex-col items-center justify-center border-2 transition-all cursor-pointer ${isSolved ? 'border-slate-700 bg-[#0a0b12] opacity-50' : 'border-[#1e293b] bg-[#111424] hover:border-indigo-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:-translate-y-2'}`}>
                            <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full mb-2 md:mb-3 shadow-inner ${stone.color} ${isSolved ? 'grayscale' : ''}`}></div>
                            <span className={`text-[9px] md:text-xs font-black uppercase tracking-widest ${isSolved ? 'text-slate-500' : 'text-slate-300'}`}>{stone.tribu}</span>
                            {isSolved && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-[2px]"><CheckCircle2 className="w-10 h-10 md:w-14 md:h-14 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]"/></div>}
                          </button>
                        );
                      })}
                    </div>

                    {activeStone && (() => {
                      const stone = pectoralStones.find(s => s.id === activeStone);
                      const wordArr = stone.palabra.split('');
                      const isSolved = wordArr.every(char => guessedLetters.includes(char) || char === ' ');
                      return (
                        <div className="fixed inset-0 z-[99999] bg-[#050303]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in">
                          <div className="bg-[#110505] border-2 border-red-900/80 rounded-3xl p-6 md:p-10 w-full max-w-4xl relative shadow-[0_0_80px_rgba(220,38,38,0.3)] flex flex-col overflow-y-auto max-h-full custom-scrollbar">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                              <div>
                                <h3 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-3 drop-shadow-lg">{stone.tribu}</h3>
                                <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-black uppercase tracking-widest shadow-md">PIEDRA {stone.piedra}</span>
                              </div>
                              <div className="flex gap-4">
                                <button onClick={() => { if(activeAhorcadoClan) updateScore(activeAhorcadoClan, 100); }} className="bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400 border-2 border-emerald-500/50 px-5 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"><BookOpen className="w-5 h-5"/> +100 CUADERNOS</button>
                                <button onClick={() => { if(activeAhorcadoClan) updateScore(activeAhorcadoClan, -100); }} className="bg-red-900/40 hover:bg-red-800 text-red-400 border-2 border-red-500/50 px-5 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-colors shadow-lg hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"><AlertTriangle className="w-5 h-5"/> -100 GRITÓ</button>
                              </div>
                            </div>
                            <p className="text-center text-slate-300 italic text-xl md:text-2xl mb-10 font-serif leading-relaxed px-4 border-l-4 border-red-900/30">"{stone.pista}"</p>
                            <div className="bg-[#1a0a0a] border border-red-900/30 p-6 rounded-2xl mb-12 shadow-inner">
                              <p className="text-amber-500 font-black text-xs md:text-sm uppercase tracking-widest text-center mb-6">AUDITORÍA APROBADA. SELECCIONA CLAN EN TURNO:</p>
                              <div className="flex flex-wrap justify-center gap-3">
                                {clansData.map(c => (
                                  <button key={c.id} onClick={() => setActiveAhorcadoClan(c.id)} className={`px-4 py-3 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all cursor-pointer border ${activeAhorcadoClan === c.id ? 'bg-amber-600 border-amber-400 text-white shadow-[0_0_15px_rgba(217,119,6,0.8)] scale-105' : 'bg-[#2a1313] border-red-900/50 text-slate-400 hover:bg-[#3a1a1a] hover:text-slate-200'}`}>{c.name}</button>
                                ))}
                              </div>
                            </div>
                            <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                              {wordArr.map((char, i) => (
                                <div key={i} className="w-12 h-16 md:w-16 md:h-20 border-b-4 border-slate-500 flex items-center justify-center text-4xl md:text-5xl font-black text-white uppercase drop-shadow-md bg-[#0a0505]/50 rounded-t-lg">
                                  {(guessedLetters.includes(char) || isSolved || stoneProgress[activeStone]) ? char : ''}
                                </div>
                              ))}
                            </div>
                            {!activeAhorcadoClan && !isSolved && !stoneProgress[activeStone] && (
                              <p className="text-center text-slate-600 font-bold uppercase tracking-widest md:tracking-[0.3em] mb-8 animate-pulse text-xs md:text-sm">ESPERANDO SELECCIÓN...</p>
                            )}
                            <div className="flex flex-col items-center gap-3 mb-10">
                              {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, i) => (
                                <div key={i} className="flex gap-1 sm:gap-2 md:gap-3 justify-center w-full">
                                  {row.split('').map(char => {
                                    const isGuessed = guessedLetters.includes(char);
                                    return (
                                      <button key={char} onClick={() => {
                                        if(!activeAhorcadoClan) return;
                                        if(!isGuessed && !isSolved && !stoneProgress[activeStone]) {
                                          setGuessedLetters([...guessedLetters, char]);
                                          
                                          if(!wordArr.includes(char)) {
                                            // Error: Restar 10 puntos y perder turno
                                            updateScore(activeAhorcadoClan, -10);
                                            setActiveAhorcadoClan(null);
                                          } else if(wordArr.every(l => [...guessedLetters, char].includes(l) || l === ' ')) {
                                            // Acierto y completó la palabra
                                            setStoneProgress({...stoneProgress, [activeStone]: true});
                                          }
                                        }
                                      }} className={`w-[8.5vw] sm:w-10 md:w-14 h-10 sm:h-12 md:h-16 rounded-xl font-black text-sm sm:text-xl md:text-2xl transition-all shadow-md flex items-center justify-center ${isGuessed || isSolved || stoneProgress[activeStone] ? 'bg-slate-800 border border-slate-700 text-slate-600 cursor-not-allowed opacity-40' : 'bg-[#2a1313] text-slate-300 hover:bg-red-700 hover:text-white border-b-4 border-red-900 cursor-pointer active:translate-y-1 active:border-b-0'}`}>{char}</button>
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                            <button onClick={() => {setActiveStone(null); setGuessedLetters([]); setActiveAhorcadoClan(null);}} className="w-full bg-[#1a202c] hover:bg-[#2d3748] text-white py-5 rounded-xl font-black text-sm md:text-base uppercase tracking-widest md:tracking-[0.2em] transition-colors cursor-pointer border-2 border-[#4a5568] shadow-lg">CERRAR Y CAMBIAR DE PIEDRA</button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {m1SubTab === 'fase3' && (
                  <div className="max-w-4xl mx-auto mt-10 md:mt-16 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#05110a] border border-emerald-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_60px_rgba(16,185,129,0.1)]">
                      <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600 rounded-t-3xl"></div>
                      <h3 className="text-3xl md:text-4xl font-black text-emerald-500 uppercase tracking-widest text-center mb-6">METACOGNICIÓN</h3>
                      <p className="text-slate-300 italic text-center mb-12 font-serif text-lg md:text-xl px-4">"El Sumo Sacerdote llevaba los nombres de las tribus en su pecho, justo encima de su corazón."</p>
                      <div className="space-y-8">
                        <div className="bg-[#0a1a12] border border-emerald-900/30 p-8 rounded-2xl flex flex-col md:flex-row items-start gap-6 shadow-inner transition-transform hover:-translate-y-1">
                          <div className="bg-emerald-900 text-emerald-300 w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-md">Q1</div>
                          <p className="text-white text-lg md:text-xl leading-relaxed pt-2">¿Qué significaba espiritualmente que el sacerdote llevara a Israel sobre su corazón al entrar ante el fuego de Dios?</p>
                        </div>
                        <div className="w-full h-[1px] bg-emerald-900/30"></div>
                        <div className="bg-[#0a1a12] border border-emerald-900/30 p-8 rounded-2xl flex flex-col md:flex-row items-start gap-6 shadow-inner transition-transform hover:-translate-y-1">
                          <div className="bg-emerald-900 text-emerald-300 w-12 h-12 rounded-xl flex items-center justify-center font-black text-base shrink-0 shadow-md">Q2</div>
                          <p className="text-white text-lg md:text-xl leading-relaxed pt-2">Si Jesús es nuestro "Gran Sumo Sacerdote" hoy en día, ¿qué nombres crees que lleva en su pectoral celestial?</p>
                        </div>
                      </div>
                    </div>

                    {/* Boton para desbloquear Códice Maestro (Solo para el GM/Profesor) */}
                    <div className="mt-8 text-center pb-8">
                      <button onClick={() => setShowMasterReference(!showMasterReference)} className="bg-[#111424] border border-indigo-900/50 hover:bg-indigo-900/40 text-indigo-400 hover:text-white px-6 py-3 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)] cursor-pointer">
                        {showMasterReference ? 'OCULTAR CÓDICE MAESTRO' : 'DESBLOQUEAR CÓDICE MAESTRO (REFERENCIA DEL PROFESOR)'}
                      </button>
                    </div>

                    {showMasterReference && (
                      <div className="mt-2 mb-10 bg-[#0a0b12] border border-indigo-500/30 rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(79,70,229,0.2)] animate-in slide-in-from-top-4">
                        <div className="text-center mb-10">
                           <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-4 animate-pulse"/>
                           <h3 className="text-2xl font-black text-white uppercase tracking-widest">EL CÓDICE MAESTRO: RESUMEN HISTÓRICO</h3>
                           <p className="text-slate-400 text-sm max-w-3xl mx-auto mt-2 leading-relaxed">El video desglosa los libros bíblicos de Primera y Segunda de Reyes, mostrando cómo los reyes fallaron sistemáticamente, llevando a Israel a la ruina y alejándose de la promesa mesiánica.</p>
                        </div>
                        <div className="space-y-6 text-left max-w-5xl mx-auto">
                           {[
                              { 
                                title: "1. El reinado de Salomón y el Templo", 
                                bg: "bg-amber-950/30", border: "border-amber-500/50", textTitle: "text-amber-400", textBody: "text-amber-100/80",
                                content: "Auge: El momento más brillante de Salomón es cuando pide sabiduría a Dios. Él logra completar el sueño de su padre al construir un gran templo en Jerusalén, cuyo diseño lleno de oro, joyas y árboles simboliza el Jardín del Edén. \n\nCaída: Inmediatamente después, el reinado se desmorona. Salomón se casa con cientos de mujeres extranjeras por alianzas políticas, adopta a sus dioses, acumula riquezas desmedidas e instituye el trabajo esclavo, rompiendo por completo las reglas para los reyes dictadas en Deuteronomio."
                              },
                              {
                                title: "2. La división del Reino",
                                bg: "bg-red-950/30", border: "border-red-500/50", textTitle: "text-red-400", textBody: "text-red-100/80",
                                content: "Tras la muerte de Salomón, su hijo Roboam asume el poder y actúa con la misma ambición de su padre, intentando subir los impuestos y mantener la esclavitud. Como respuesta, las tribus del norte se rebelan bajo el liderazgo de Jeroboam. \n\nEl territorio se fragmenta en dos: Judá en el sur (con capital en Jerusalén y linaje de David) e Israel en el norte (con capital eventualmente en Samaria). Para competir con Jerusalén, Jeroboam construye dos templos rivales y coloca un becerro de oro en cada uno, repitiendo el pecado del Éxodo."
                              },
                              {
                                title: "3. Los Reyes y los Profetas",
                                bg: "bg-indigo-950/30", border: "border-indigo-500/50", textTitle: "text-indigo-400", textBody: "text-indigo-100/80",
                                content: "Ambos reinos tuvieron aproximadamente 20 reyes consecutivos. El autor los evalúa basándose en un criterio principal: su fidelidad al pacto con el Dios de Israel. El resultado es trágico: en el reino del norte hubo 0 reyes buenos, y en el reino del sur, solo 8 de 20 obtuvieron una calificación positiva.\n\nAnte la idolatría y la injusticia de la monarquía, Dios levanta profetas que actúan como 'guardianes del pacto'. Elías y Eliseo son las figuras proféticas centrales. Elías confronta al rey del norte Acab y a su esposa Jezabel, desafiando y derrotando a 450 profetas de Baal en una contienda de fuego. Posteriormente, Elías pasa su liderazgo a su joven discípulo Eliseo, quien realiza catorce milagros documentados, duplicando la autoridad de su maestro."
                              },
                              {
                                title: "4. La caída del Reino del Norte",
                                bg: "bg-slate-900/50", border: "border-slate-500/50", textTitle: "text-slate-300", textBody: "text-slate-300/80",
                                content: "El norte se hunde en una espiral de asesinatos políticos, iniciados por una sangrienta revolución de un hombre llamado Jehú. De aquí en adelante, cada rey promueve injusticias horribles. \n\nFinalmente, el gran imperio de Asiria desciende, conquista la capital de Samaria y envía a todos los israelitas al exilio. El autor aclara que esta tragedia es la consecuencia directa de la idolatría y la infidelidad del pueblo."
                              },
                              {
                                title: "5. La caída del Reino del Sur y el Exilio",
                                bg: "bg-purple-950/30", border: "border-purple-500/50", textTitle: "text-purple-400", textBody: "text-purple-100/80",
                                content: "El reino de Judá sobrevive un poco más gracias a reyes heroicos como Ezequías (quien confió en Dios ante el asedio asirio) y Josías (quien encontró el rollo de la Torá e instituyó reformas). Sin embargo, el daño dejado por gobernantes como Manasés —quien introdujo ídolos en el templo e instauró el sacrificio de niños— fue irreversible. \n\nEl imperio Babilónico termina invadiendo Jerusalén, destruyendo por completo el templo y llevando a los ciudadanos y al linaje de David al exilio."
                              },
                              {
                                title: "Un destello de esperanza",
                                bg: "bg-emerald-950/30", border: "border-emerald-500/50", textTitle: "text-emerald-400", textBody: "text-emerald-100/80",
                                content: "La historia concluye narrando un evento 40 años después de iniciado el exilio. Joaquín, un descendiente directo de David que estaba en prisión, es liberado por el rey de Babilonia e invitado a comer en la mesa real por el resto de su vida. \n\nEste inusual evento final deja al lector con un rayo de esperanza: Dios no ha abandonado al linaje de David, sentando las bases para el cumplimiento de sus promesas que se explorarán en los libros proféticos."
                              }
                           ].map((bloque, idx) => (
                              <div key={idx} className={`p-5 md:p-6 rounded-xl border ${bloque.bg} ${bloque.border} shadow-lg hover:scale-[1.01] transition-transform`}>
                                <h4 className={`text-lg md:text-xl font-black uppercase tracking-widest mb-3 ${bloque.textTitle}`}>{bloque.title}</h4>
                                <div className={`text-sm leading-relaxed space-y-3 ${bloque.textBody}`}>
                                  {bloque.content.split('\n\n').map((parrafo, i) => (
                                    <p key={i}>{parrafo}</p>
                                  ))}
                                </div>
                              </div>
                           ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {m1SubTab === 'fase4' && (
                  <div className="max-w-5xl mx-auto mt-8 md:mt-12 animate-in slide-in-from-bottom-8 duration-500">
                    <div className="bg-[#0b0c16] border border-indigo-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(79,70,229,0.15)]">
                      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-5 mb-8 border-b border-indigo-900/30 pb-6 text-center md:text-left">
                        <Shield className="w-10 h-10 text-indigo-500 shrink-0"/>
                        <h3 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest">EL RETO DE INVESTIGACIÓN (TAREA)</h3>
                      </div>
                      
                      <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-emerald-600 pl-4 mb-8">"Para poder sobrevivir en el desierto y acercarnos a la presencia de Dios, necesitamos conocer a los mediadores oficiales: Los Sacerdotes."</p>
                      
                      <div className="bg-[#111424] border border-[#1e293b] p-8 rounded-2xl mb-10 shadow-lg">
                        <p className="text-amber-400 font-black uppercase tracking-widest text-sm md:text-base mb-6 flex items-center gap-3 border-b border-slate-800 pb-3"><BookOpen className="w-6 h-6"/> MISIÓN INDIVIDUAL (RESPONDER EN EL CÓDICE)</p>
                        <div className="space-y-6 text-slate-300 text-sm md:text-base">
                          <div className="flex flex-col gap-1">
                            <strong className="text-indigo-400 uppercase tracking-wider">EL LINAJE ELEGIDO:</strong>
                            <p>¿De qué tribu de Israel provenían exclusivamente los sacerdotes?</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <strong className="text-indigo-400 uppercase tracking-wider">LOS PIONEROS:</strong>
                            <p>¿Cuáles son los nombres del primer Sumo Sacerdote de Israel y de sus hijos?</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <strong className="text-indigo-400 uppercase tracking-wider">PERFIL DEL CARGO:</strong>
                            <p>¿Cuáles eran las características principales que debía tener un sacerdote y qué funciones exactas cumplían dentro del templo?</p>
                          </div>
                          <div className="flex flex-col gap-1">
                            <strong className="text-indigo-400 uppercase tracking-wider">EL MAPA TÁCTICO (EL TABERNÁCULO):</strong>
                            <p>Los sacerdotes eran los custodios de la morada de Dios. Dibuja o pega en tu cuaderno una imagen clara del "Tabernáculo de Reunión" y señala sus partes principales (Atrio, Lugar Santo, Lugar Santísimo y los objetos que hay en ellos).</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-950/20 border border-amber-900/50 p-6 rounded-2xl shadow-inner">
                        <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest flex items-center gap-3 mb-4"><Users className="w-6 h-6"/> ⚠️ REGLA DE ALIANZA COOPERATIVA</h3>
                        <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 border-b border-amber-900/30 pb-4">LEER ATENTAMENTE: Aunque la tarea es individual y cada uno debe tenerla en su propio cuaderno, las recompensas se ganan en equipo.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="bg-[#111827] p-6 rounded-xl border border-emerald-900/50 flex flex-col gap-3">
                            <div className="flex items-center gap-3"><Trophy className="w-8 h-8 text-emerald-400 shrink-0"/><strong className="text-emerald-400 text-lg uppercase tracking-wider">💎 RECOMPENSA ÉPICA</strong></div>
                            <p className="text-slate-300 text-sm leading-relaxed">Si el día de la revisión TODOS y cada uno de los integrantes de tu Clan tienen la misión completa en su cuaderno... <strong className="text-emerald-300">¡TODO EL CLAN RECIBIRÁ UN BONO AUTOMÁTICO DE +150 XP!</strong></p>
                          </div>
                          <div className="bg-[#1f0a0a] p-6 rounded-xl border border-red-900/50 flex flex-col gap-3">
                            <div className="flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-red-500 shrink-0"/><strong className="text-red-500 text-lg uppercase tracking-wider">❌ LA CONDICIÓN</strong></div>
                            <p className="text-red-200 text-sm leading-relaxed">Si a un solo integrante de tu clan le falta la tarea o no la hizo completa, el clan entero pierde el bono de los 150 puntos.</p>
                          </div>
                        </div>

                        <div className="bg-blue-950/30 p-6 rounded-xl border border-blue-900/50 flex items-start gap-4">
                          <Compass className="w-8 h-8 text-blue-400 shrink-0 mt-1"/>
                          <div>
                            <strong className="text-blue-400 text-base uppercase tracking-wider block mb-2">🤝 CONSEJO DE GAME MASTER</strong>
                            <p className="text-blue-200 text-sm leading-relaxed">Como verdaderos líderes, comuníquense por TODOS LOS MEDIOS DIGITALES QUE TENGAN. Recuérdense mutuamente hacer la tarea. ¡Un clan no abandona a ninguno de sus miembros!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MISIÓN 2: JUECES ────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision2' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#06080e] min-h-screen">
          {m2Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-red-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-red-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> AUDIO MISIÓN 2</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHUpFG0HGw/LtS7S0nuTMhG6sedKbanpw/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {m2Fase > 0 && (
            <header className="bg-[#0a0b12] border-b border-[#1e293b] p-3 flex justify-between items-center z-50">
              <div className="flex items-center gap-3">
                <button onClick={() => {setM2Fase(0); setStartMision2Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> Cambiar Salón</button>
                <h2 className="text-white font-black tracking-widest uppercase text-sm md:text-base">{m2Fase === 1 ? 'PROPÓSITO: LA ERA DEL CAOS' : m2Fase === 2 ? 'FASE 1: EL CÓDICE' : 'FASE 2: SIMULADOR DE TRIBUNAL'}</h2>
              </div>
              <button onClick={() => setShowClans(!showClans)} className="text-blue-400 bg-blue-900/30 p-2 rounded-full hover:bg-blue-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
            </header>
          )}

          <div className="flex-grow overflow-y-auto pb-24 p-4 md:p-8 relative custom-scrollbar z-10">
            {!startMision2Cinematic && m2Fase === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 max-w-2xl mx-auto px-4">
                <ShieldAlert className="w-24 h-24 text-red-600 mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)] animate-pulse"/>
                <p className="text-red-500 text-xs tracking-widest md:tracking-[0.3em] uppercase mb-4 font-bold">INSTRUCCIÓN GM: 1) ACTIVA EL AUDIO EN LA ESQUINA. 2) INICIA LA SECUENCIA.</p>
                <button onClick={() => setStartMision2Cinematic(true)} className="bg-gradient-to-b from-red-700 to-red-900 border-2 border-red-500 text-red-100 px-8 py-4 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] rounded-full cursor-pointer">Iniciar Intro Cómic</button>
                <button onClick={() => setView('campamento_base')} className="mt-6 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer">Volver al Campamento</button>
              </div>
            ) : m2Fase === 0 ? (
              <div key="cinematica-m2" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-black">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-color-dodge animate-[slowZoom_45s_linear_forwards]"></div>
                <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 2s' }}><p className="text-lg md:text-2xl text-white border-y-2 border-red-600 py-2 uppercase tracking-widest md:tracking-[0.5em] font-bold shadow-[0_0_20px_rgba(220,38,38,0.5)]">ESTUDIOS BÍBLICOS PRESENTA</p></div>
                <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 7s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]">UNA NACIÓN SIN RUMBO...</p></div>
                <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 13s' }}><div className="bg-white text-black px-6 py-3 border-4 border-black shadow-[8px_8px_0_rgba(220,38,38,1)] transform -rotate-2"><p className="text-2xl md:text-3xl uppercase tracking-widest font-black">"En esos días no había rey en Israel..."</p></div></div>
                <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 4s ease-out forwards 19s' }}><div className="bg-red-600 text-white px-6 py-3 border-4 border-black shadow-[8px_8px_0_rgba(255,255,255,1)] transform rotate-2"><p className="text-3xl md:text-4xl uppercase tracking-widest font-black">"...y cada uno hacía lo que bien le parecía."</p></div></div>
                <div className="absolute text-center px-4" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 25s' }}><p className="text-4xl md:text-6xl text-white uppercase tracking-widest md:tracking-[0.2em] font-black drop-shadow-[0_0_40px_rgba(220,38,38,1)]">Y LA OSCURIDAD LO CONSUMIÓ TODO.</p></div>
                <div className="absolute inset-0 bg-red-600 z-[100]" style={{ opacity: 0, animation: 'cinematicText 1.5s ease-out forwards 31s' }}></div>
                <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 10s ease-out forwards 32s' }}>
                  <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-red-500 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(220,38,38,1)]" style={{ WebkitTextStroke: '2px black' }}>LA ERA DEL CAOS</h1>
                  <p className="text-red-500 mt-4 text-lg md:text-2xl tracking-widest md:tracking-[0.5em] font-bold uppercase bg-black/80 inline-block px-6 py-3 border border-red-900/50 shadow-2xl">EL TRIBUNAL DE LOS JUECES</p>
                </div>
                <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 38s' }}>
                  <button onClick={() => setM2Fase(1)} className="bg-red-900/80 border-2 border-red-500 text-white px-10 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-xl transition-all shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:scale-110 flex items-center gap-4 cursor-pointer rounded-xl backdrop-blur-sm transform hover:-rotate-1">VER PROPÓSITO <ChevronRight className="w-8 h-8"/></button>
                </div>
              </div>
            ) : null}

            {m2Fase === 1 && (
              <div className="max-w-4xl mx-auto mt-10 md:mt-20 animate-in zoom-in duration-500">
                <div className="bg-[#0b0404] border border-red-900/50 rounded-2xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(220,38,38,0.15)] flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-red-950 border border-red-800 flex items-center justify-center text-red-500 mb-8 shadow-inner"><AlertTriangle className="w-8 h-8"/></div>
                  <h2 className="text-4xl md:text-5xl font-black text-red-500 tracking-widest uppercase mb-8 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">MISIÓN: RESTAURAR EL ORDEN</h2>
                  <div className="bg-[#150a0a] border border-red-900/30 p-6 md:p-8 rounded-xl w-full max-w-2xl">
                    <p className="text-slate-300 text-sm md:text-base italic leading-relaxed font-serif">"Analizaremos la espiral de caos en Israel tras la muerte de Josué y descubriremos cómo Dios levanta libertadores para restaurar la paz. En esta misión, ustedes serán los jueces de su propia conducta."</p>
                  </div>
                  <button onClick={() => setM2Fase(2)} className="mt-10 bg-red-900/50 hover:bg-red-800 text-white border border-red-500/50 px-8 py-4 rounded uppercase font-bold tracking-widest text-xs transition-colors cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:scale-105">Ingresar al Códice <ChevronRight className="inline w-4 h-4 -mt-1"/></button>
                </div>
              </div>
            )}

            {m2Fase === 2 && (
              <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                <div className="bg-[#0f111a] border border-[#1e293b] rounded-xl overflow-hidden shadow-2xl">
                  <div className="bg-[#15182b] border-b border-[#1e293b] p-3 flex items-center gap-2"><Play className="w-4 h-4 text-red-500"/> <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Archivo Histórico: Los Jueces</span></div>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }} src="https://www.canva.com/design/DAHUqu9i4XE/UQyvnmdGtkut8rZ41kbCsQ/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
                  </div>
                </div>

                <div className="bg-[#0b0c16] border border-amber-900/30 rounded-2xl p-8 text-center mt-10 shadow-lg">
                  <h3 className="text-4xl font-black text-amber-500 uppercase tracking-widest mb-4">EL CÓDICE DEL CAOS</h3>
                  <p className="text-slate-400 italic text-xs border border-slate-800 bg-[#15182b] inline-block px-8 py-3 rounded-full">Analicen y copien los apuntes clave. Los necesitarán como argumentos en el Tribunal.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0f111a] border border-blue-900 rounded-xl p-8 shadow-lg">
                    <h4 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3"><Target className="w-5 h-5"/> 1. EL MANDATO IDEAL</h4>
                    <ul className="space-y-4 text-slate-300 text-xs md:text-sm leading-relaxed">
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0"/> Obedecer la Torá para ser ejemplo a las naciones.</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0"/> Aislarse de la corrupción moral cananea (evitar el sacrificio de niños).</li>
                    </ul>
                  </div>
                  <div className="bg-[#1a0f14] border border-red-900 rounded-xl p-8 shadow-lg">
                    <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-3"><AlertTriangle className="w-5 h-5"/> 2. EL FRACASO REAL</h4>
                    <ul className="space-y-4 text-slate-300 text-xs md:text-sm leading-relaxed">
                      <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-500 shrink-0"/> <div><strong className="text-white block mb-1">Fracaso militar:</strong> (Jueces Cap. 1). No expulsaron la corrupción.</div></li>
                      <li className="flex items-start gap-3"><X className="w-5 h-5 text-red-500 shrink-0"/> <div><strong className="text-white block mb-1">Asimilación Cultural:</strong> Adoptaron prácticas aberrantes e idolatría.</div></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#0f111a] border border-slate-700 rounded-2xl p-8 text-center relative shadow-lg">
                  <h4 className="text-indigo-400 font-bold uppercase tracking-widest text-base mb-2 flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5"/> 3. LA ESPIRAL DESCENDENTE</h4>
                  <p className="text-slate-500 text-[10px] tracking-widest uppercase mb-8">NO ES UN CÍRCULO, LA SITUACIÓN EMPEORA EN CADA VUELTA.</p>
                  <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs font-bold uppercase w-full">
                    <div className="bg-[#1e151e] border border-red-900/50 text-red-300 px-6 py-3 rounded-lg flex flex-col w-full md:w-auto"><span className="text-red-500 mb-1">1. CORRUPCIÓN</span> PECADO E ÍDOLOS</div>
                    <ChevronRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0"/>
                    <div className="bg-[#151c2b] border border-blue-900/50 text-blue-300 px-6 py-3 rounded-lg flex flex-col w-full md:w-auto"><span className="text-blue-500 mb-1">2. OPRESIÓN</span> CONQUISTA ENEMIGA</div>
                    <ChevronRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0"/>
                    <div className="bg-[#151c2b] border border-blue-900/50 text-blue-300 px-6 py-3 rounded-lg flex flex-col w-full md:w-auto"><span className="text-blue-500 mb-1">3. CLAMOR</span> PIDEN AYUDA A DIOS</div>
                    <ChevronRight className="w-5 h-5 text-slate-600 rotate-90 md:rotate-0"/>
                    <div className="bg-[#152b22] border border-emerald-900/50 text-emerald-300 px-6 py-3 rounded-lg flex flex-col w-full md:w-auto"><span className="text-emerald-500 mb-1">4. LIBERACIÓN</span> DIOS ENVÍA UN JUEZ</div>
                  </div>
                  <div className="mt-8 mx-auto inline-block bg-[#2b1515] border-2 border-red-600 text-red-400 px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.2)] relative">
                    5. REINCIDENCIA<br/><span className="text-[10px] text-red-300 mt-1 block">PEOR QUE ANTES</span>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white"><AlertTriangle className="w-3 h-3"/></div>
                  </div>
                </div>

                <div className="bg-[#0b0c16] border border-[#1e293b] rounded-2xl p-8 shadow-xl">
                  <h4 className="text-white font-black uppercase tracking-widest text-center text-xl mb-8">4. EXPEDIENTES DE LOS JUECES</h4>
                  <p className="text-xs text-emerald-500 font-bold uppercase tracking-widest mb-4">A. LÍDERES FUNCIONALES (FASE DE AVENTURA)</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-[#05060b] border-l-4 border-l-emerald-500 border border-[#1e293b] p-6 rounded-r-xl shadow-md">
                      <h5 className="text-white font-black text-base mb-1">Otoniel & Aod</h5>
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">LOS ÍNTEGROS Y TÁCTICOS</p>
                      <ul className="text-slate-400 text-xs space-y-2 list-disc pl-4"><li>Héroes de aventuras épicas.</li><li>Cumplieron su misión con valentía y estrategia.</li></ul>
                    </div>
                    <div className="bg-[#05060b] border-l-4 border-l-blue-500 border border-[#1e293b] p-6 rounded-r-xl shadow-md">
                      <h5 className="text-white font-black text-base mb-1">Débora</h5>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4">SINERGIA Y SABIDURÍA</p>
                      <ul className="text-slate-400 text-xs space-y-2 list-disc pl-4"><li>Líder estratega y profetisa.</li><li>Demostró el poder del <strong className="text-slate-200">trabajo en equipo</strong> (con Barac).</li></ul>
                    </div>
                  </div>
                  <p className="text-xs text-red-500 font-bold uppercase tracking-widest mb-4 border-t border-[#1e293b] pt-8">B. EL COLAPSO MORAL (FASE DE DEGRADACIÓN)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#1a0f14] border-l-4 border-l-orange-500 border border-red-900/30 p-6 rounded-r-xl shadow-md">
                      <h5 className="text-white font-black text-base mb-1">Gedeón</h5>
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">EL EGO CORRUPTOR</p>
                      <p className="text-emerald-400 text-xs mb-3 leading-relaxed"><strong className="text-emerald-500 block mb-1">Logro:</strong> Vence a madianitas con solo 300 hombres (Fe).</p>
                      <p className="text-red-400 text-xs leading-relaxed"><strong className="text-red-500 block mb-1">Falla:</strong> Su ego lo corrompe. Asesina por venganza y fabrica un ídolo de oro.</p>
                    </div>
                    <div className="bg-[#1a0f14] border-l-4 border-l-orange-500 border border-red-900/30 p-6 rounded-r-xl shadow-md">
                      <h5 className="text-white font-black text-base mb-1">Jefté</h5>
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">EL IGNORANTE</p>
                      <p className="text-emerald-400 text-xs mb-3 leading-relaxed"><strong className="text-emerald-500 block mb-1">Logro:</strong> Estratega militar, protege al pueblo.</p>
                      <p className="text-red-400 text-xs leading-relaxed"><strong className="text-red-500 block mb-1">Falla:</strong> Ignorancia de Dios. Hace un voto absurdo y sacrifica a su propia hija.</p>
                    </div>
                    <div className="bg-[#1a0f14] border-l-4 border-l-red-600 border border-red-900/30 p-6 rounded-r-xl shadow-md">
                      <h5 className="text-white font-black text-base mb-1">Sansón</h5>
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-4">EL NARCISISTA</p>
                      <p className="text-emerald-400 text-xs mb-3 leading-relaxed"><strong className="text-emerald-500 block mb-1">Logro:</strong> Fuerza sobrenatural, victorias contra filisteos.</p>
                      <p className="text-red-400 text-xs leading-relaxed"><strong className="text-red-500 block mb-1">Falla:</strong> Promiscuo, violento, vengativo. Su vida termina en un asesinato/suicidio masivo.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#150a0a] border border-red-700 rounded-2xl p-10 text-center relative overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                  <h4 className="text-red-500 font-black uppercase tracking-widest text-xl mb-6 flex items-center justify-center gap-3"><Skull className="w-6 h-6"/> 5. EL COLAPSO SOCIAL TOTAL</h4>
                  <p className="text-slate-300 text-sm mb-6">La anarquía llega cuando los líderes fallan:</p>
                  <ul className="text-slate-400 text-sm space-y-4 max-w-lg mx-auto text-left list-disc pl-6 mb-10 font-bold">
                    <li><strong className="text-white">Robo y Asesinato:</strong> Destrucción de la ciudad inocente de Lais.</li>
                    <li><strong className="text-white">Guerra Civil:</strong> Tribus masacrándose entre sí por violencia desmedida.</li>
                  </ul>
                  <div className="bg-[#050202] border border-red-900/50 py-6 px-8 rounded-xl inline-block text-center w-full max-w-3xl shadow-inner">
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2"><Scroll className="w-4 h-4"/> CONCLUSIÓN DEL LIBRO:</p>
                    <p className="text-white font-serif italic text-2xl md:text-3xl leading-snug">"En esos días no había rey en Israel y cada uno hacía lo que bien le parecía."</p>
                  </div>
                </div>

                <div className="text-center mt-12 mb-20 animate-in fade-in duration-700">
                  <button onClick={() => setM2Fase(3)} className="bg-gradient-to-b from-red-800 to-red-950 hover:from-red-700 hover:to-red-900 text-white border-2 border-red-500 px-10 py-6 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 hover:shadow-[0_0_50px_rgba(220,38,38,0.8)] text-lg md:text-2xl flex items-center justify-center gap-4 mx-auto cursor-pointer"><AlertTriangle className="w-8 h-8"/> ENTRAR AL TRIBUNAL (FASE 2)</button>
                </div>
              </div>
            )}

            {m2Fase === 3 && (
              <div className="max-w-4xl mx-auto mt-6 space-y-6 animate-in zoom-in duration-500 pb-20">
                <div className="bg-[#0b0c16] border border-orange-900/50 rounded-2xl p-6 md:p-10 shadow-[0_0_40px_rgba(245,158,11,0.1)] relative">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-amber-500 uppercase tracking-widest mb-4">EL TRIBUNAL DE LOS JUECES</h3>
                    <p className="text-slate-300 text-sm bg-black/50 p-4 rounded border border-slate-800 inline-block">Se presentará un Caos Escolar. <strong className="text-white">TODOS</strong> los clanes tienen 2 minutos para debatir en susurros y preparar su DEFENSA ORAL.</p>
                  </div>
                  <div className="bg-red-950/20 border border-red-600/50 p-4 rounded-xl text-center max-w-xl mx-auto mb-8 shadow-inner">
                    <p className="text-red-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mb-1"><BookOpen className="w-4 h-4"/> REGLAS DEL JUZGAMIENTO</p>
                    <p className="text-slate-300 text-xs italic">Respuesta Correcta: <strong className="text-emerald-400">+50 XP</strong>. Veredicto egoísta: <strong className="text-red-400">-30 XP</strong>. <br/> Si aprueban, el salón vota con paletas; si hay MAYORÍA, el clan gana <strong className="text-indigo-300">+20 XP EXTRA</strong>.</p>
                  </div>
                  {tribunalPaso === 'inicio' && (
                    <div className="flex justify-center mt-8">
                      <button onClick={() => {
                        setCasoActivo(casosTribunal[casoIndice]);
                        setCasoIndice(prev => (prev + 1) % casosTribunal.length);
                        setTribunalPaso('caos');
                        setResultadoJuicio(null);
                        setVotoPopularEmitido(false);
                        if(poolTribunal.length === 0) {
                          let nuevoPool = [...clansData, ...clansData].sort(() => 0.5 - Math.random());
                          setPoolTribunal(nuevoPool);
                        }
                      }} className="bg-red-900/80 hover:bg-red-800 text-white border-2 border-red-500/80 px-10 py-5 rounded-xl uppercase font-black tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.7)] hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"><Zap className="w-6 h-6"/> GENERAR CAOS (CASO {casoIndice + 1}/14)</button>
                    </div>
                  )}
                </div>

                {(tribunalPaso === 'caos' || tribunalPaso === 'ruleta') && (
                  <div className="bg-[#050303] border border-red-700/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-8">
                    <div className="bg-gradient-to-br from-[#1a0a0a] to-[#0a0505] p-6 md:p-8 flex flex-col md:flex-row gap-6 border-b border-red-900/50">
                      <div className="flex-grow">
                        <div className="flex items-center gap-4 mb-4">
                          <AlertTriangle className="w-8 h-8 text-red-500"/>
                          <div>
                            <h4 className="text-red-500 font-black uppercase tracking-widest text-xl">{casoActivo?.titulo || 'CARGANDO...'}</h4>
                            <span className={`text-[10px] px-3 py-1 rounded font-black uppercase tracking-widest ${casoActivo?.tipo.includes('COMPLEJO') ? 'bg-orange-950 text-orange-500 border border-orange-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>{casoActivo?.tipo}</span>
                          </div>
                        </div>
                        <p className="text-white italic text-lg md:text-xl leading-relaxed mb-6 font-serif border-l-4 border-red-600 pl-4 bg-red-950/20 py-3 pr-3">{casoActivo?.descripcion}</p>
                        <div className="bg-[#15110a] border border-amber-600/50 p-5 rounded-xl flex items-start gap-4 shadow-inner">
                          <div>
                            <p className="text-amber-500 font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-2"><Target className="w-4 h-4"/> EXIGENCIA BÍBLICA Y DEFENSA ORAL:</p>
                            <p className="text-amber-100 text-sm leading-relaxed">{casoActivo?.exigencia}</p>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 w-full md:w-48 bg-black border border-red-900/50 rounded-xl p-3 shadow-lg flex flex-col items-center justify-center">
                        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2 text-center animate-pulse"><Volume2 className="w-5 h-5 mx-auto mb-1"/> MODO TENSIÓN<br/>(DAR PLAY)</p>
                        <div className="w-full aspect-square relative rounded overflow-hidden shadow-[0_0_15px_rgba(220,38,38,0.3)]">
                          <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }} src="https://www.canva.com/design/DAHUrJcAyCo/iH1wZ60oFd56K9f2Ouhyyw/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 bg-[#0b0c16]">
                      <h4 className="text-indigo-400 font-black text-sm uppercase tracking-widest text-center flex items-center justify-center gap-2 mb-6"><Crosshair className="w-5 h-5"/> SELECCIÓN (2 TURNOS POR CLAN)</h4>
                      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8">
                        <div className="bg-[#111424] border border-indigo-900 p-4 rounded-xl w-64 text-center shadow-inner">
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">1. CLAN AL BANQUILLO</p>
                          <p className={`text-2xl font-black uppercase tracking-widest ${tribunalPaso === 'ruleta' ? 'text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-slate-400'}`}>{kaganClan}</p>
                        </div>
                        <div className="bg-[#111424] border border-indigo-900 p-4 rounded-xl w-48 text-center shadow-inner">
                          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3">2. INTEGRANTE N°</p>
                          <div className="flex items-center justify-center gap-2">
                            <Users className={`w-6 h-6 ${tribunalPaso === 'ruleta' ? 'text-indigo-400' : 'text-slate-600'}`}/>
                            <span className={`text-4xl font-black ${tribunalPaso === 'ruleta' ? 'text-indigo-400' : 'text-slate-600'}`}>{kaganNum}</span>
                          </div>
                        </div>
                      </div>

                      {tribunalPaso === 'caos' && (
                        <div className="text-center">
                          <button onClick={() => {
                            let currentPool = poolTribunal.length > 0 ? [...poolTribunal] : [...clansData, ...clansData].sort(() => 0.5 - Math.random());
                            let clanGanadorObj = currentPool[0];
                            let clanesNombres = clansData.map(c => c.name);
                            let ticks = 0;
                            let interval = setInterval(() => {
                              setKaganClan(clanesNombres[Math.floor(Math.random() * clanesNombres.length)].toUpperCase());
                              setKaganNum(Math.floor(Math.random() * 5) + 1);
                              ticks++;
                              if (ticks > 25) {
                                clearInterval(interval);
                                setKaganClan(clanGanadorObj.name.toUpperCase());
                                setKaganNum(Math.floor(Math.random() * 5) + 1);
                                setPoolTribunal(currentPool.slice(1));
                                setTribunalPaso('ruleta');
                              }
                            }, 80);
                          }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all cursor-pointer">AL ACABAR LA MÚSICA: GIRAR RULETA</button>
                        </div>
                      )}

                      {tribunalPaso === 'ruleta' && (
                        <div className="mt-8 border-t border-[#1e293b] pt-8 animate-in fade-in">
                          <h4 className="text-indigo-300 font-bold text-center text-xs md:text-sm uppercase tracking-widest mb-8 flex items-center justify-center gap-2"><Trophy className="w-5 h-5"/> DEFENSA ORAL DEL CLAN: {kaganClan}</h4>
                          {!evaluandoTribunal && !resultadoJuicio && (
                            <div className="animate-in fade-in duration-300">
                              <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
                                <button onClick={() => procesarVeredicto(true)} className="bg-emerald-700 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:scale-105 transition-all w-full md:w-auto"><CheckCircle2 className="w-6 h-6"/> RESPUESTA CORRECTA (+50)</button>
                                <button onClick={() => procesarVeredicto(false)} className="bg-red-800 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] hover:scale-105 transition-all w-full md:w-auto"><X className="w-6 h-6"/> INSUFICIENTE / EGOÍSTA (-30)</button>
                              </div>
                              <p className="text-slate-500 font-bold text-[10px] text-center uppercase tracking-widest mb-4">O USAR CARTAS TÁCTICAS:</p>
                              <div className="flex justify-center flex-wrap gap-4">
                                {[
                                  {id: 'C1', title: 'RELEVO INTERNO', cost: '-5 PTS USO', effect: '(+45 XP)', icon: Shield, points: 45},
                                  {id: 'C2', title: 'VER CÓDICE', cost: '-5 PTS USO', effect: '(+45 XP)', icon: BookOpen, points: 45},
                                  {id: 'C3', title: 'ALIANZA', cost: '(50/50)', effect: '+25 AL CLAN', icon: Users, points: 25},
                                  {id: 'C4', title: 'REBOTE LIBRE', cost: 'OTRO GANA', effect: '+10 CONSUELO', icon: RefreshCw, points: 10},
                                  {id: 'C5', title: 'EL CAMPEÓN', cost: '-10 PTS', effect: '(+40 XP)', icon: Trophy, special: true, points: 40}
                                ].map(card => (
                                  <div key={card.id} onClick={() => {
                                    const clanId = clansData.find(c => c.name.toUpperCase() === kaganClan)?.id;
                                    if(clanId) { updateScore(clanId, card.points); setTribunalPaso('inicio'); setResultadoJuicio(null); }
                                  }} className={`w-28 p-3 rounded-lg border flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:-translate-y-1 shadow-lg group ${card.special ? 'bg-[#1a1205] border-amber-500 hover:bg-[#2b1e0a] text-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-[#0f111a] border-[#2a2e45] hover:border-indigo-500 hover:bg-[#15182b] text-slate-400 hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]'}`}>
                                    <card.icon className={`w-5 h-5 mb-2 opacity-80 ${card.special ? 'group-hover:text-amber-300 animate-pulse' : 'group-hover:text-indigo-200'}`}/>
                                    <p className="text-[9px] font-black uppercase mb-1">{card.id}: {card.title}</p>
                                    <p className="text-[8px] font-bold text-slate-500">{card.cost}</p>
                                    <p className={`text-[9px] font-bold mt-1 ${card.special ? 'text-amber-400' : 'text-indigo-400'}`}>{card.effect}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {evaluandoTribunal && (
                            <div className="text-center py-16 animate-in zoom-in duration-500">
                              <Scale className="w-24 h-24 text-amber-500 mx-auto mb-8 animate-[pulse_1.5s_ease-in-out_infinite] drop-shadow-[0_0_40px_rgba(245,158,11,0.8)]"/>
                              <h3 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest md:tracking-[0.3em] mb-4">LA PROVIDENCIA ESTÁ JUZGANDO</h3>
                              <p className="text-amber-500 text-xs md:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-3"><Loader2 className="w-5 h-5 animate-spin"/> Evaluando los principios del clan...</p>
                            </div>
                          )}

                          {resultadoJuicio === 'aprobado' && (
                            <div className="bg-emerald-950/20 border-2 border-emerald-500 p-8 md:p-12 rounded-2xl text-center shadow-[0_0_60px_rgba(16,185,129,0.2)] animate-in slide-in-from-bottom-8">
                              <CheckCircle2 className="w-20 h-20 text-emerald-400 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]"/>
                              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-emerald-400 uppercase tracking-widest mb-4">VEREDICTO APROBADO</h3>
                              <p className="text-emerald-100 text-xs font-black tracking-widest md:tracking-[0.4em] uppercase mb-10 bg-emerald-900/60 inline-block px-6 py-3 rounded-full shadow-lg border border-emerald-500/50">+50 XP OTORGADOS A {kaganClan}</p>
                              <div className="bg-[#050a07] border-2 border-emerald-800 p-8 rounded-2xl mb-10 shadow-inner relative">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#050a07] border border-emerald-800 px-4 py-1 rounded-full"><p className="text-emerald-500 font-black text-[10px] uppercase tracking-widest"><Scroll className="w-4 h-4 inline mr-2 -mt-1"/>FALLO DEL GAME MASTER</p></div>
                                <p className="text-white font-serif italic text-2xl md:text-3xl leading-relaxed mt-4 drop-shadow-md">"La defensa oral ha sido contundente. El clan ha demostrado actuar bajo los principios de la Providencia, priorizando el bien común sobre el ego."</p>
                              </div>
                              {!votoPopularEmitido ? (
                                <div className="bg-[#0b0c16] border-2 border-indigo-500/50 p-8 rounded-2xl mb-8 shadow-[0_0_30px_rgba(79,70,229,0.2)] animate-in zoom-in">
                                  <h4 className="text-indigo-400 font-black uppercase tracking-widest text-2xl mb-4 flex items-center justify-center gap-3"><Users className="w-8 h-8"/> VOTO POPULAR (PALETAS)</h4>
                                  <p className="text-slate-300 text-sm mb-8 leading-relaxed max-w-2xl mx-auto">El salón entero levanta sus paletas ahora. ¿Es esta una decisión justa? <strong className="text-white">Si hay MAYORÍA afirmativa, el clan gana puntos extra.</strong></p>
                                  <div className="flex flex-col md:flex-row justify-center gap-4">
                                    <button onClick={() => { const clanId = clansData.find(c => c.name.toUpperCase() === kaganClan)?.id; if(clanId) updateScore(clanId, 20); setVotoPopularEmitido(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer"><CheckCircle2 className="w-6 h-6"/> MAYORÍA CONFIRMA (+20 XP)</button>
                                    <button onClick={() => setVotoPopularEmitido(true)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-3 cursor-pointer"><X className="w-6 h-6"/> NO HAY MAYORÍA (0 XP)</button>
                                  </div>
                                </div>
                              ) : (
                                <button onClick={() => {setTribunalPaso('inicio'); setResultadoJuicio(null); setVotoPopularEmitido(false);}} className="bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-400 px-10 py-4 rounded-xl uppercase font-black tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 cursor-pointer">CERRAR CASO Y VOLVER AL TRIBUNAL</button>
                              )}
                            </div>
                          )}

                          {resultadoJuicio === 'rechazado' && (
                            <div className="bg-red-950/20 border-2 border-red-600 p-8 md:p-12 rounded-2xl text-center shadow-[0_0_60px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-8">
                              <X className="w-20 h-20 text-red-500 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(220,38,38,0.8)]"/>
                              <h3 className="text-2xl md:text-4xl lg:text-5xl font-black text-red-500 uppercase tracking-widest mb-4">EL CIELO RECHAZA ESTA DEFENSA</h3>
                              <p className="text-red-200 text-xs font-black tracking-widest md:tracking-[0.4em] uppercase mb-10 bg-red-900/60 inline-block px-6 py-3 rounded-full shadow-lg border border-red-500/50">-30 XP RESTADOS A {kaganClan}</p>
                              <div className="bg-[#110505] border border-red-800 p-8 rounded-2xl mb-10 shadow-inner">
                                <p className="text-red-500 font-black text-[10px] uppercase tracking-widest mb-4 border-b border-red-900/50 pb-2"><AlertTriangle className="w-4 h-4 inline mr-2 -mt-1"/>MOTIVO BÍBLICO DEL RECHAZO:</p>
                                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">{razonFallo}</p>
                              </div>
                              <button onClick={() => {setTribunalPaso('caos'); setResultadoJuicio(null); setVotoPopularEmitido(false);}} className="bg-red-800 hover:bg-red-700 text-white border border-red-500 px-10 py-4 rounded-xl uppercase font-black tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-105 cursor-pointer flex items-center justify-center gap-3 mx-auto"><RefreshCw className="w-5 h-5"/> CEDER LA PALABRA A OTRO CLAN</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MISIÓN 3: REYES ─────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision3' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#0a0510] min-h-screen">
          {m3Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-purple-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(147,51,234,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-purple-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> AUDIO MISIÓN 3</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHWXrz91FE/9ABxgJgEagZQmW6C8GPHjA/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {!startMision3Cinematic ? (
            <div className="z-10 flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 max-w-2xl mx-auto px-4 w-full h-full">
              <Crown className="w-24 h-24 text-purple-500 mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] animate-pulse"/>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">MISIÓN 3: LOS REYES</h1>
              <p className="text-purple-400 text-xs md:text-sm tracking-widest md:tracking-[0.3em] uppercase mb-10 font-bold border border-purple-900/50 bg-purple-950/30 px-6 py-4 rounded-xl">INSTRUCCIÓN GM: <br/><br/>1) ACTIVA EL AUDIO EN LA ESQUINA.<br/>2) INICIA LA CINEMÁTICA ÉPICA.</p>
              <button onClick={() => setStartMision3Cinematic(true)} className="bg-gradient-to-b from-purple-700 to-purple-950 border-2 border-purple-400 text-purple-100 px-10 py-5 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] rounded-full cursor-pointer flex items-center justify-center gap-3"><Swords className="w-6 h-6"/> Iniciar Cinemática Épica</button>
              <button onClick={() => { setView('campamento_base'); setStartMision3Cinematic(false); setM3Fase(0); }} className="mt-8 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Volver al Campamento Base</button>
            </div>
          ) : m3Fase === 0 ? (
            <div key="cinematica-m3" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-[#05020a] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604095593719-74d3e8e19c35?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-luminosity animate-[slowZoom_40s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#05020a] via-[#05020a]/80 to-transparent z-10"></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 1s' }}><p className="text-2xl md:text-4xl text-slate-300 uppercase tracking-widest md:tracking-[0.5em] font-light drop-shadow-lg">La anarquía destrozó a la nación...</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 6s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-purple-400 uppercase tracking-widest md:tracking-[0.4em] font-bold drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]">El pueblo se cansó de lo invisible.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 11s' }}><p className="text-5xl md:text-7xl text-red-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(239,68,68,1)]">«¡DANOS UN REY!»</p><p className="text-xl md:text-3xl text-red-300 uppercase tracking-widest md:tracking-[0.5em] font-bold mt-4">«Para ser como las demás naciones»</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 17s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-slate-400 uppercase tracking-widest md:tracking-[0.4em] font-light">Rechazaron a la Providencia...</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 23s' }}><p className="text-4xl md:text-6xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,0.8)]">POR CORONAS DE ORO QUE CIEGAN...</p><p className="text-2xl md:text-4xl text-slate-200 uppercase tracking-widest md:tracking-[0.4em] font-bold mt-4">Y espadas que traicionan.</p></div>
              <div className="absolute inset-0 bg-purple-950 z-[100]" style={{ opacity: 0, animation: 'cinematicText 1.5s ease-out forwards 29s' }}></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 3s ease-out forwards 30s' }}>
                <Crown className="w-24 h-24 text-amber-400 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(251,191,36,1)] animate-[pulse_2s_ease-in-out_infinite]" />
                <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-600 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(245,158,11,0.8)]" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)' }}>EL ASCENSO DE LA CORONA</h1>
                <p className="text-purple-400 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase bg-black/80 inline-block px-8 py-3 border border-purple-900/50 shadow-2xl rounded-full">MISIÓN 3: LOS REYES DE ISRAEL</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 32s' }}>
                <button onClick={() => { setM3Fase(1); setM3SubTab('archivo'); }} className="bg-gradient-to-r from-purple-900 to-[#1a0b2e] border-2 border-amber-500 text-amber-300 px-12 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-xl transition-all shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-110 hover:shadow-[0_0_70px_rgba(245,158,11,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">ENTRAR AL SALÓN DEL TRONO <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full relative z-10">
              <header className="bg-[#0b0612] border-b border-[#2d1b4e] p-3 flex justify-between items-center z-50 shadow-lg shadow-purple-900/20">
                <div className="flex items-center gap-3">
                  <button onClick={() => {setM3Fase(0); setStartMision3Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> Base {selectedClass}</button>
                  <h2 className="text-purple-300 font-black tracking-widest uppercase text-sm md:text-base">{m3SubTab === 'archivo' ? 'FASE 1: ARCHIVO VISUAL' : m3SubTab === 'codice' ? 'FASE 2: EL CÓDICE REAL' : m3SubTab === 'simulador' ? 'FASE 3: EL RETO' : 'FASE 4: CIERRE Y METACOGNICIÓN'}</h2>
                </div>
                <button onClick={() => setShowClans(!showClans)} className="text-amber-400 bg-amber-900/30 p-2 rounded-full hover:bg-amber-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
              </header>
              <div className="bg-[#05020a] border-b border-[#2d1b4e] p-2 flex justify-center gap-2 z-40 shadow-md">
                <button onClick={() => setM3SubTab('archivo')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m3SubTab === 'archivo' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-[#150a29] text-purple-400/50 hover:bg-[#1a0b36]'}`}>1. ARCHIVO VISUAL</button>
                <button onClick={() => setM3SubTab('codice')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m3SubTab === 'codice' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-[#150a29] text-purple-400/50 hover:bg-[#1a0b36]'}`}>2. EL CÓDICE REAL</button>
                <button onClick={() => setM3SubTab('simulador')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m3SubTab === 'simulador' ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#150a29] text-purple-400/50 hover:bg-[#1a0b36]'}`}>3. EL RETO</button>
                <button onClick={() => setM3SubTab('cierre')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m3SubTab === 'cierre' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#150a29] text-purple-400/50 hover:bg-[#1a0b36]'}`}>4. CIERRE Y METACOGNICIÓN</button>
              </div>

              <div className="flex-grow overflow-y-auto pb-24 p-4 md:p-8 relative custom-scrollbar z-10">
                {m3SubTab === 'archivo' && (
                  <div className="max-w-7xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                      <MonitorPlay className="w-16 h-16 text-indigo-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(79,70,229,0.6)] animate-pulse"/>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-300 tracking-widest uppercase mb-2 drop-shadow-lg">ARCHIVO AUDIOVISUAL DE LA CORONA</h2>
                      <p className="text-indigo-400 text-xs font-bold tracking-widest uppercase">REGISTRO HISTÓRICO DE LOS REYES DE ISRAEL</p>
                    </div>
                    
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                      {/* Video Player */}
                      <div className="w-full bg-[#0a0b12] border border-indigo-900/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(79,70,229,0.15)] flex flex-col">
                        <div className="bg-[#111424] p-3 border-b border-indigo-900/50 flex items-center justify-between">
                          <div className="flex items-center gap-2"><Play className="w-4 h-4 text-indigo-400"/><span className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest">TRANSMISIÓN EN VIVO</span></div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }} src="https://www.canva.com/design/DAHWHQ6Tcnw/51zOo9S2VlPP2lY6o_bDdQ/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
                        </div>
                        <div className="p-4 bg-[#0a0b12] border-t border-indigo-900/30 text-center">
                          <p className="text-xs text-slate-400 italic font-serif">"Analicen detalladamente el ascenso y la caída de cada monarca. El conocimiento es poder."</p>
                        </div>
                      </div>

                      {/* Interactive Rubric Tool */}
                      <div className="w-full bg-[#05060b] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
                        <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2 border-b border-slate-800 pb-3"><Zap className="w-5 h-5"/> EVALUACIÓN DE APUNTES</h3>
                        <p className="text-slate-400 text-[11px] mb-4 leading-relaxed">Evalúa los apuntes físicos tomados por cada clan en sus cuadernos. Todos los miembros deben tener la información para validar el puntaje.</p>
                        
                        <div className="space-y-4 mb-6 flex-grow custom-scrollbar overflow-y-auto pr-2">
                          <div className="bg-[#111424] border border-slate-700/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
                            <div className="flex-grow">
                              <h4 className="text-white text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: RECLUTA (+10 XP)</h4>
                              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">Apuntes superficiales o incompletos. Se nota esfuerzo inicial, pero falta sustancia histórica, organización y conexión de ideas.</p>
                              <div className="bg-black/30 p-3 rounded border-l-2 border-slate-600 mt-2">
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> AUTOEVALUACIÓN DEL CLAN:</p>
                                <ul className="list-disc list-outside ml-4 text-[10px] text-slate-400 space-y-1">
                                  <li>¿Solo copiamos frases sueltas de la pantalla sin procesar la información?</li>
                                  <li>¿Nos faltan los nombres de los reyes más importantes o el orden temporal?</li>
                                  <li>¿Nuestros apuntes nos servirían para un examen o son solo palabras al azar?</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-[#111424] border border-indigo-900/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-indigo-900 text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
                            <div className="flex-grow">
                              <h4 className="text-indigo-300 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: ESTRATEGA (+25 XP)</h4>
                              <p className="text-[10px] text-indigo-200/70 mb-2 leading-relaxed">Apuntes bien organizados que logran capturar la estructura del conflicto, la división del reino y la verdadera causa de la caída (idolatría).</p>
                              <div className="bg-indigo-950/30 p-3 rounded border-l-2 border-indigo-600 mt-2">
                                <p className="text-[9px] text-indigo-400/80 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> AUTOEVALUACIÓN DEL CLAN:</p>
                                <ul className="list-disc list-outside ml-4 text-[10px] text-indigo-300/80 space-y-1">
                                  <li>¿Tenemos totalmente claro por qué el reino se dividió en Norte y Sur?</li>
                                  <li>¿Mencionamos el papel crucial de los profetas como contrapeso a los reyes corruptos?</li>
                                  <li>¿Explicamos qué fue exactamente lo que llevó a Israel a la ruina y al exilio?</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-[#111424] border border-amber-900/50 p-4 rounded-lg flex items-start gap-3 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors"></div>
                            <div className="w-6 h-6 rounded-full bg-amber-900 text-amber-400 flex items-center justify-center font-black text-xs shrink-0 mt-1 shadow-[0_0_15px_rgba(245,158,11,0.4)]">3</div>
                            <div className="flex-grow relative z-10">
                              <h4 className="text-amber-400 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1 drop-shadow-md">NIVEL: MAESTRO DEL CÓDICE (+50 XP)</h4>
                              <p className="text-[10px] text-amber-200/70 mb-2 leading-relaxed">Apuntes magistrales, altamente visuales y estructurados, que no solo resumen la historia antigua, sino que extraen una lección táctica de vida moderna.</p>
                              <div className="bg-amber-950/30 p-3 rounded border-l-2 border-amber-500 mt-2">
                                <p className="text-[9px] text-amber-500/80 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Target className="w-3 h-3"/> AUTOEVALUACIÓN DEL CLAN:</p>
                                <ul className="list-disc list-outside ml-4 text-[10px] text-amber-300/80 space-y-1">
                                  <li>¿Usamos colores, esquemas o mapas mentales para conectar visualmente a los reyes con sus profetas?</li>
                                  <li>¿Nuestros apuntes incluyen una conclusión personal de cómo el ego destruye el liderazgo hoy?</li>
                                  <li>¿Si un compañero lee nuestro cuaderno, entendería los Libros de Reyes sin haber visto el video?</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0a0b12] p-4 rounded-xl border border-[#1e293b]">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select id="rubricClan" className="w-full bg-[#111424] text-xs text-white border border-slate-700 rounded p-4 outline-none focus:border-amber-500 font-bold uppercase tracking-widest cursor-pointer hover:bg-[#1a1e36] transition-colors">
                              <option value="">-- SELECCIONA EL CLAN --</option>
                              {clansData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <select id="rubricScore" className="w-full bg-[#111424] text-xs text-amber-500 border border-slate-700 rounded p-4 outline-none focus:border-amber-500 font-bold uppercase tracking-widest cursor-pointer hover:bg-[#1a1e36] transition-colors">
                              <option value="">-- SELECCIONA EL NIVEL --</option>
                              <option value="10">NIVEL 1: RECLUTA (+10 XP)</option>
                              <option value="25">NIVEL 2: ESTRATEGA (+25 XP)</option>
                              <option value="50">NIVEL 3: MAESTRO (+50 XP)</option>
                            </select>
                            <button 
                              onClick={() => {
                                const clanId = document.getElementById('rubricClan').value;
                                const pts = parseInt(document.getElementById('rubricScore').value);
                                if(clanId && pts) {
                                  updateScore(clanId, pts);
                                  document.getElementById('rubricClan').value = "";
                                  document.getElementById('rubricScore').value = "";
                                  alert('¡Puntos asignados al clan con éxito!');
                                }
                              }}
                              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-black uppercase tracking-widest text-xs py-4 rounded transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-[1.02]"
                            >ASIGNAR PUNTAJE</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {m3SubTab === 'codice' && (
                  <div className="max-w-7xl mx-auto mt-4 animate-in zoom-in duration-1000 pb-20 relative font-sans">
                    {/* ENTORNO CINEMATOGRÁFICO DE FONDO */}
                    <div className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2000')] bg-cover bg-fixed bg-center opacity-5 pointer-events-none z-0"></div>

                    {/* TÍTULO PRINCIPAL */}
                    <div className="text-center mb-32 relative z-20">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-900/30 blur-[120px] pointer-events-none"></div>
                      <h2 className="text-6xl md:text-[110px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-300 to-purple-600 tracking-tighter uppercase mb-6 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] leading-none">CRÓNICAS DEL TRONO</h2>
                      <p className="text-amber-500 text-lg md:text-2xl tracking-widest md:tracking-[1em] uppercase font-black drop-shadow-md">LINAJES DE SANGRE Y FUEGO</p>
                      <p className="text-slate-400 mt-6 font-serif italic text-xl animate-pulse">Da un clic sobre las imágenes para revelar sus secretos...</p>
                    </div>

                    {/* ========================================= */}
                    {/* PARTE 1: LA MONARQUÍA UNIDA (LÍNEA DE TIEMPO CENTRAL) */}
                    {/* ========================================= */}
                    <div className="relative w-full max-w-6xl mx-auto flex flex-col items-center">
                      {/* Línea brillante central */}
                      <div className="absolute top-0 bottom-0 w-2 md:w-4 bg-gradient-to-b from-amber-500 via-amber-700 to-red-600 shadow-[0_0_30px_rgba(245,158,11,1)] z-0 rounded-full opacity-80"></div>

                      {/* NODO 1: SAÚL */}
                      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between mb-40 group">
                        <div className="md:w-1/3 flex justify-center md:justify-end md:pr-16 mb-10 md:mb-0">
                          <div onClick={() => toggleNode('saul')} className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-4 md:border-8 border-red-900/80 shadow-[0_0_80px_rgba(220,38,38,0.5)] overflow-hidden cursor-pointer group-hover:shadow-[0_0_120px_rgba(220,38,38,0.8)] transition-all duration-700">
                            <div className={`absolute inset-0 bg-red-900/60 mix-blend-multiply z-10 transition-opacity duration-1000 ${expandedNodes['saul'] ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'}`}></div>
                            <img src="/images/saul.jpg" alt="Saúl" className={`w-full h-full object-cover transition-transform duration-[2s] ${expandedNodes['saul'] ? 'scale-100' : 'scale-125'}`}/>
                            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['saul'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-red-500/50 shadow-2xl backdrop-blur-md text-lg">REVELAR MISTERIO</span>
                            </div>
                          </div>
                        </div>
                        {/* Conector Central */}
                        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 md:w-20 md:h-20 rounded-full bg-red-600 border-4 md:border-8 border-black shadow-[0_0_40px_rgba(220,38,38,1)] hidden md:flex items-center justify-center z-20"><span className="text-black font-black text-4xl">1</span></div>
                        <div className="md:w-2/3 md:pl-16 text-center md:text-left z-30">
                          <h3 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">SAÚL</h3>
                          <p className="text-red-500 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-red-900/50 pb-4 inline-block">EL GUERRERO INSEGURO</p>
                          <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['saul'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#0f071a]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] relative mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
                                <div className="bg-black/50 p-6 rounded-3xl border border-red-900/50">
                                  <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Contexto</span>
                                  <p className="text-slate-200 text-lg md:text-2xl leading-relaxed font-serif">Elegido por su imponente estatura física. El pueblo quería un líder militar que luciera fuerte como los reyes paganos.</p>
                                </div>
                                <div className="bg-red-950/40 p-6 rounded-3xl border border-red-900/50 relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                                  <span className="inline-block bg-red-900 text-red-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Falla Crítica</span>
                                  <p className="text-red-100 text-lg md:text-2xl leading-relaxed font-serif">Su terror al "qué dirán" lo volvió paranoico. Desobedeció y se obsesionó con David por pura envidia.</p>
                                </div>
                                <div className="bg-emerald-950/30 p-6 rounded-3xl border border-emerald-900/50">
                                  <span className="inline-block bg-emerald-900 text-emerald-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2 w-max"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                  <p className="text-emerald-100 text-lg md:text-2xl leading-relaxed font-serif">La inseguridad y la envidia te destruyen desde adentro, haciéndote atacar a tu propio equipo.</p>
                                </div>
                                
                                {/* PREGUNTA REFLEXIVA Y PUNTAJE */}
                                <div className="mt-10 xl:col-span-3 relative group">
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-red-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                  <div className="relative bg-[#05010a]/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-purple-500/30 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)] text-left overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                      <div className="w-16 h-16 shrink-0 bg-purple-950/50 rounded-2xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <Trophy className="w-8 h-8 text-purple-400 animate-pulse"/>
                                      </div>
                                      <div className="flex-grow">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                          <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 font-black uppercase tracking-widest md:tracking-[0.3em] text-xl md:text-2xl drop-shadow-lg">EL DESAFÍO DEL REY</h5>
                                          <span className="bg-purple-900/40 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-bounce">+ 150 XP</span>
                                        </div>
                                        
                                        <div className="bg-black/40 p-6 rounded-2xl border border-purple-900/40 mb-6">
                                          <p className="text-white text-xl md:text-2xl leading-relaxed font-serif italic">"¿Si el miedo a lo que piensen los demás te paraliza, de qué sirve estar en una posición de liderazgo? ¿Cómo aplicamos esto en el salón cuando hay presión de grupo para hacer algo incorrecto?"</p>
                                        </div>
                                        
                                        <div className="bg-[#0a0514] p-5 rounded-2xl border border-[#1a112c]">
                                          <p className="text-purple-400/70 text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE:</p>
                                          <div className="flex flex-wrap gap-3">
                                            {clansData.map(c => (
                                              <button key={c.id} onClick={(e) => { e.stopPropagation(); updateScore(c.id, 150); }} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1`}>
                                                <span className="text-lg">{c.icon}</span> {c.name}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NODO 2: DAVID */}
                      <div className="relative z-10 w-full flex flex-col md:flex-row-reverse items-center justify-between mb-40 group">
                        <div className="md:w-1/3 flex justify-center md:justify-start md:pl-16 mb-10 md:mb-0">
                          <div onClick={() => toggleNode('david')} className="relative w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border-4 md:border-8 border-emerald-600/80 shadow-[0_0_100px_rgba(16,185,129,0.5)] overflow-hidden cursor-pointer group-hover:shadow-[0_0_150px_rgba(16,185,129,0.8)] transition-all duration-700">
                            <div className={`absolute inset-0 bg-emerald-900/50 mix-blend-multiply z-10 transition-opacity duration-1000 ${expandedNodes['david'] ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'}`}></div>
                            <img src="/images/david.jpg" alt="David" className={`w-full h-full object-cover transition-transform duration-[2s] ${expandedNodes['david'] ? 'scale-100' : 'scale-125'}`}/>
                            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['david'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-emerald-500/50 shadow-2xl backdrop-blur-md text-lg">REVELAR MISTERIO</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 md:w-20 md:h-20 rounded-full bg-emerald-500 border-4 md:border-8 border-black shadow-[0_0_50px_rgba(16,185,129,1)] hidden md:flex items-center justify-center z-20"><span className="text-black font-black text-4xl">2</span></div>
                        <div className="md:w-2/3 md:pr-16 text-center md:text-right z-30">
                          <h3 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">DAVID</h3>
                          <p className="text-emerald-400 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-emerald-900/50 pb-4 inline-block">EL CORAZÓN DE LEÓN</p>
                          <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['david'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#051a0f]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6 w-full text-left">
                                <div className="bg-black/50 p-6 rounded-3xl border border-emerald-900/50">
                                  <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Contexto</span>
                                  <p className="text-slate-200 text-lg md:text-2xl leading-relaxed font-serif">Un pastor invisible y arpista que unificó a las 12 tribus en un imperio invencible, recibiendo el pacto del "Linaje Eterno".</p>
                                </div>
                                <div className="bg-red-950/40 p-6 rounded-3xl border border-red-900/50 relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                                  <span className="inline-block bg-red-900 text-red-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Falla Crítica</span>
                                  <p className="text-red-100 text-lg md:text-2xl leading-relaxed font-serif">Abusó de su poder. Cayó en adulterio y orquestó un asesinato cobarde para ocultarlo.</p>
                                </div>
                                <div className="bg-emerald-950/30 p-6 rounded-3xl border border-emerald-900/50">
                                  <span className="inline-block bg-emerald-900 text-emerald-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2 w-max"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                  <p className="text-emerald-100 text-lg md:text-2xl leading-relaxed font-serif">A diferencia de Saúl, cuando fue confrontado, se humilló sin excusas. Un líder que reconoce su error puede ser restaurado.</p>
                                </div>

                                {/* PREGUNTA REFLEXIVA Y PUNTAJE */}
                                <div className="mt-10 xl:col-span-3 relative group">
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                  <div className="relative bg-[#05010a]/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-purple-500/30 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)] text-left overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                      <div className="w-16 h-16 shrink-0 bg-purple-950/50 rounded-2xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <Trophy className="w-8 h-8 text-purple-400 animate-pulse"/>
                                      </div>
                                      <div className="flex-grow">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                          <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 font-black uppercase tracking-widest md:tracking-[0.3em] text-xl md:text-2xl drop-shadow-lg">EL DESAFÍO DEL REY</h5>
                                          <span className="bg-purple-900/40 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-bounce">+ 150 XP</span>
                                        </div>
                                        
                                        <div className="bg-black/40 p-6 rounded-2xl border border-purple-900/40 mb-6">
                                          <p className="text-white text-xl md:text-2xl leading-relaxed font-serif italic">"David intentó ocultar su error gravísimo hasta que el profeta Natán lo confrontó. Cuando te equivocas y lastimas a un compañero, ¿tratas de ocultarlo o te humillas y aceptas la consecuencia?"</p>
                                        </div>
                                        
                                        <div className="bg-[#0a0514] p-5 rounded-2xl border border-[#1a112c]">
                                          <p className="text-purple-400/70 text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE:</p>
                                          <div className="flex flex-wrap gap-3">
                                            {clansData.map(c => (
                                              <button key={c.id} onClick={(e) => { e.stopPropagation(); updateScore(c.id, 150); }} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1`}>
                                                <span className="text-lg">{c.icon}</span> {c.name}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* NODO 3: SALOMÓN */}
                      <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between mb-48 group">
                        <div className="md:w-1/3 flex justify-center md:justify-end md:pr-16 mb-10 md:mb-0">
                          <div onClick={() => toggleNode('salomon')} className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-full border-4 md:border-8 border-blue-600/80 shadow-[0_0_120px_rgba(59,130,246,0.6)] overflow-hidden cursor-pointer group-hover:shadow-[0_0_180px_rgba(59,130,246,0.8)] transition-all duration-700">
                            <div className={`absolute inset-0 bg-blue-900/50 mix-blend-multiply z-10 transition-opacity duration-1000 ${expandedNodes['salomon'] ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'}`}></div>
                            <img src="/images/salomon.jpg" alt="Salomón" className={`w-full h-full object-cover transition-transform duration-[2s] ${expandedNodes['salomon'] ? 'scale-100' : 'scale-125'}`}/>
                            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['salomon'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-blue-500/50 shadow-2xl backdrop-blur-md text-lg">REVELAR MISTERIO</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-500 border-4 md:border-8 border-black shadow-[0_0_60px_rgba(59,130,246,1)] hidden md:flex items-center justify-center z-20"><Crown className="w-8 h-8 md:w-12 md:h-12 text-black"/></div>
                        <div className="md:w-2/3 md:pl-16 text-center md:text-left z-30">
                          <h3 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">SALOMÓN</h3>
                          <p className="text-blue-400 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-blue-900/50 pb-4 inline-block">EL ARQUITECTO CORRUPTO</p>
                          <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['salomon'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#07101a]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
                                <div className="bg-black/50 p-6 rounded-3xl border border-blue-900/50">
                                  <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Contexto</span>
                                  <p className="text-slate-200 text-lg md:text-2xl leading-relaxed font-serif">Inició brillante. Pide sabiduría y construye el majestuoso Primer Templo, llevando a Israel a la cúspide de su poder.</p>
                                </div>
                                <div className="bg-red-950/40 p-6 rounded-3xl border border-red-900/50 relative overflow-hidden">
                                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-red-500"></div>
                                  <span className="inline-block bg-red-900 text-red-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Falla Crítica</span>
                                  <p className="text-red-100 text-lg md:text-2xl leading-relaxed font-serif">Alianzas políticas egoístas, idolatría, acumulación excesiva de riqueza y, al final, esclavizó a su propio pueblo.</p>
                                </div>
                                <div className="bg-blue-950/30 p-6 rounded-3xl border border-blue-900/50">
                                  <span className="inline-block bg-blue-900 text-blue-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2 w-max"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                  <p className="text-blue-100 text-lg md:text-2xl leading-relaxed font-serif">Un buen inicio o tener gran talento no sirve si el poder corrompe tus principios y terminas dañando a otros.</p>
                                </div>

                                {/* PREGUNTA REFLEXIVA Y PUNTAJE */}
                                <div className="mt-10 xl:col-span-3 relative group">
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                  <div className="relative bg-[#05010a]/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-purple-500/30 shadow-[inset_0_0_40px_rgba(168,85,247,0.1)] text-left overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                      <div className="w-16 h-16 shrink-0 bg-purple-950/50 rounded-2xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                                        <Trophy className="w-8 h-8 text-purple-400 animate-pulse"/>
                                      </div>
                                      <div className="flex-grow">
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                          <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 font-black uppercase tracking-widest md:tracking-[0.3em] text-xl md:text-2xl drop-shadow-lg">EL DESAFÍO DEL REY</h5>
                                          <span className="bg-purple-900/40 text-purple-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] animate-bounce">+ 150 XP</span>
                                        </div>
                                        
                                        <div className="bg-black/40 p-6 rounded-2xl border border-purple-900/40 mb-6">
                                          <p className="text-white text-xl md:text-2xl leading-relaxed font-serif italic">"Salomón empezó con sabiduría y brillantez, pero terminó pervirtiéndose por el lujo y corrompiéndose. ¿De qué te sirve sacar las mejores notas o ser el más talentoso del salón si terminas usando ese conocimiento solo para tu propio egoísmo y pisar a los demás?"</p>
                                        </div>
                                        
                                        <div className="bg-[#0a0514] p-5 rounded-2xl border border-[#1a112c]">
                                          <p className="text-purple-400/70 text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE:</p>
                                          <div className="flex flex-wrap gap-3">
                                            {clansData.map(c => (
                                              <button key={c.id} onClick={(e) => { e.stopPropagation(); updateScore(c.id, 150); }} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1`}>
                                                <span className="text-lg">{c.icon}</span> {c.name}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ========================================= */}
                    {/* PARTE 2: EL GRAN CISMA (DIVISIÓN VISUAL) */}
                    {/* ========================================= */}
                    <div className="relative w-full mb-48">
                      <div className="flex flex-col items-center relative z-20">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-red-950 border-8 md:border-[12px] border-red-600 rounded-full flex items-center justify-center animate-[pulse_2s_infinite] shadow-[0_0_200px_rgba(220,38,38,1)] z-20">
                          <Flame className="w-16 h-16 md:w-24 md:h-24 text-red-500 animate-bounce"/>
                        </div>
                        <h3 className="text-7xl md:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-800 uppercase tracking-tighter mt-12 mb-6 drop-shadow-[0_0_50px_rgba(220,38,38,0.8)] leading-none">930 a.C.</h3>
                        <p className="text-white text-2xl md:text-4xl font-black uppercase tracking-widest md:tracking-[0.4em] bg-red-950/80 px-16 py-6 rounded-full border-4 border-red-500/50 shadow-[0_0_60px_rgba(220,38,38,0.5)] backdrop-blur-xl mb-12">LA NACIÓN SE FRACTURA</p>
                        
                        <div className="max-w-4xl w-full bg-[#110505]/95 backdrop-blur-md p-8 md:p-10 rounded-[3rem] border border-red-900/50 shadow-2xl relative z-30">
                           <div className="flex flex-col gap-6">
                              <p className="text-slate-300 text-lg md:text-2xl leading-relaxed font-serif text-center"><strong className="text-white font-sans font-black uppercase">Detonante:</strong> Roboam (hijo de Salomón) sube los impuestos con total soberbia en vez de escuchar al pueblo. Las 10 tribus del norte se rebelan y forman su propio país bajo el mando de Jeroboam.</p>
                              <div className="bg-red-950/40 p-6 rounded-3xl border border-red-900/50 text-center">
                                <span className="inline-flex bg-red-900 text-red-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 items-center gap-2"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                <p className="text-red-200 text-lg md:text-2xl leading-relaxed font-serif">La soberbia absoluta destruye equipos (Roboam). Un líder que no escucha a los suyos, se queda solo.</p>
                              </div>
                           </div>
                        </div>
                      </div>
                      
                      {/* Bifurcación SVG para Desktop */}
                      <svg className="absolute top-40 left-0 w-full h-[700px] hidden md:block pointer-events-none z-0" preserveAspectRatio="none">
                         <path d="M 50% 0 Q 50% 350 25% 700" fill="none" stroke="url(#cyanGlow)" strokeWidth="20" strokeDasharray="40 20" className="opacity-80"/>
                         <path d="M 50% 0 Q 50% 350 75% 700" fill="none" stroke="url(#amberGlow)" strokeWidth="20" strokeDasharray="40 20" className="opacity-80"/>
                         <defs>
                           <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626"/><stop offset="100%" stopColor="#06b6d4"/></linearGradient>
                           <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#dc2626"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient>
                         </defs>
                      </svg>
                    </div>

                    {/* ========================================= */}
                    {/* PARTE 3: REINOS DIVIDIDOS (COLUMNAS) */}
                    {/* ========================================= */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 w-full relative z-10 px-4 md:px-8 mt-10 md:mt-64">
                      
                      {/* COLUMNA IZQUIERDA: ISRAEL (NORTE) */}
                      <div className="flex flex-col items-center">
                         <div className="w-2 h-40 bg-gradient-to-b from-transparent to-cyan-500 hidden md:block mb-[-3rem] z-10 rounded-full"></div>
                         <div onClick={() => toggleNode('israel')} className="w-full bg-[#050b14]/95 backdrop-blur-3xl border-4 border-cyan-500/50 rounded-[4rem] p-8 md:p-14 shadow-[0_0_100px_rgba(6,182,212,0.2)] relative overflow-hidden group cursor-pointer hover:border-cyan-400 transition-all duration-700">
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/90 pointer-events-none"></div>
                           <div className="relative z-10 text-center">
                              <h3 className="text-6xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-600 uppercase tracking-widest mb-6 drop-shadow-xl">ISRAEL</h3>
                              <p className="text-cyan-400 text-sm md:text-lg font-black uppercase tracking-widest md:tracking-[0.4em] mb-12 bg-cyan-950/80 inline-block px-8 py-3 rounded-full border-2 border-cyan-800 shadow-xl">REINO DEL NORTE (10 TRIBUS)</p>
                              
                              <div className="w-full aspect-video rounded-[3rem] overflow-hidden mb-12 border-8 border-cyan-900 shadow-[0_0_60px_rgba(6,182,212,0.4)] relative">
                                <img src="https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=1000&auto=format&fit=crop" alt="Profetas de Fuego" className={`w-full h-full object-cover transition-transform duration-[3s] ${expandedNodes['israel'] ? 'scale-100' : 'scale-125'}`}/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 w-full p-8 text-left">
                                  <h4 className="text-white font-black uppercase tracking-widest text-3xl md:text-4xl mb-2 drop-shadow-2xl">PROFETAS DE FUEGO</h4>
                                  <p className="text-cyan-300 text-sm md:text-lg uppercase font-black tracking-widest md:tracking-[0.3em] drop-shadow-lg">ELÍAS • ELISEO • AMÓS • OSEAS</p>
                                </div>
                                <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['israel'] ? 'opacity-0' : 'opacity-100'}`}>
                                  <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-cyan-500/50 shadow-2xl backdrop-blur-md text-xl">VER MÁS</span>
                                </div>
                              </div>

                              <div className={`grid transition-all duration-1000 ease-in-out text-left ${expandedNodes['israel'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                                <div className="overflow-hidden space-y-6">
                                  <div className="bg-[#0a1120]/90 p-6 md:p-8 rounded-[2rem] border border-cyan-900/50">
                                    <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Contexto</span>
                                    <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-serif">De ±40 reyes, hubo 0 buenos. Dios levantó a los Profetas como "perros guardianes" ante la espiral de violencia política.</p>
                                  </div>
                                  <div className="bg-red-950/40 border border-red-900/50 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
                                    <span className="inline-block bg-red-900 text-red-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Falla Crítica</span>
                                    <p className="text-red-200 text-lg md:text-xl leading-relaxed font-serif">El rey Jeroboam instaló Dos Becerros de Oro por miedo a perder el control. Cero fidelidad al pacto. Asiria los aniquiló en 722 a.C.</p>
                                  </div>
                                  <div className="bg-cyan-950/30 p-6 md:p-8 rounded-[2rem] border border-cyan-900/50">
                                    <span className="inline-block bg-cyan-900 text-cyan-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2 w-max"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                    <p className="text-cyan-100 text-lg md:text-xl leading-relaxed font-serif">El miedo a perder liderazgo te hace tomar decisiones corruptas. Y un grupo dividido siempre será aplastado por los problemas externos.</p>
                                  </div>

                                  {/* PREGUNTA REFLEXIVA Y PUNTAJE */}
                                  <div className="mt-10 xl:col-span-3 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-indigo-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                    <div className="relative bg-[#05010a]/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-cyan-500/30 shadow-[inset_0_0_40px_rgba(6,182,212,0.1)] text-left overflow-hidden">
                                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
                                      
                                      <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                        <div className="w-16 h-16 shrink-0 bg-cyan-950/50 rounded-2xl flex items-center justify-center border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                          <Trophy className="w-8 h-8 text-cyan-400 animate-pulse"/>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 font-black uppercase tracking-widest md:tracking-[0.3em] text-xl md:text-2xl drop-shadow-lg">EL DESAFÍO DEL REY</h5>
                                            <span className="bg-cyan-900/40 text-cyan-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-bounce">+ 150 XP</span>
                                          </div>
                                          
                                          <div className="bg-black/40 p-6 rounded-2xl border border-cyan-900/40 mb-6">
                                            <p className="text-white text-xl md:text-2xl leading-relaxed font-serif italic">"El rey Jeroboam instaló ídolos (Becerros de Oro) solo por miedo a que su pueblo lo abandonara. En el salón, ¿te ha pasado que creas una 'versión falsa de ti' o haces cosas indebidas solo para encajar en un grupo y no quedarte solo?"</p>
                                          </div>
                                          
                                          <div className="bg-[#0a0514] p-5 rounded-2xl border border-[#1a112c]">
                                            <p className="text-cyan-400/70 text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE:</p>
                                            <div className="flex flex-wrap gap-3">
                                              {clansData.map(c => (
                                                <button key={c.id} onClick={(e) => { e.stopPropagation(); updateScore(c.id, 150); }} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1`}>
                                                  <span className="text-lg">{c.icon}</span> {c.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                           </div>
                         </div>
                      </div>

                      {/* COLUMNA DERECHA: JUDÁ (SUR) */}
                      <div className="flex flex-col items-center">
                         <div className="w-2 h-40 bg-gradient-to-b from-transparent to-amber-500 hidden md:block mb-[-3rem] z-10 rounded-full"></div>
                         <div onClick={() => toggleNode('juda')} className="w-full bg-[#140b05]/95 backdrop-blur-3xl border-4 border-amber-500/50 rounded-[4rem] p-8 md:p-14 shadow-[0_0_100px_rgba(245,158,11,0.2)] relative overflow-hidden group cursor-pointer hover:border-amber-400 transition-all duration-700">
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-950/90 pointer-events-none"></div>
                           <div className="relative z-10 text-center">
                              <h3 className="text-6xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 uppercase tracking-widest mb-6 drop-shadow-xl">JUDÁ</h3>
                              <p className="text-amber-500 text-sm md:text-lg font-black uppercase tracking-widest md:tracking-[0.4em] mb-12 bg-amber-950/80 inline-block px-8 py-3 rounded-full border-2 border-amber-800 shadow-xl">REINO DEL SUR (2 TRIBUS)</p>
                              
                              <div className="w-full aspect-video rounded-[3rem] overflow-hidden mb-12 border-8 border-amber-900 shadow-[0_0_60px_rgba(245,158,11,0.4)] relative">
                                <img src="https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1000&auto=format&fit=crop" alt="Profetas Mesiánicos" className={`w-full h-full object-cover transition-transform duration-[3s] ${expandedNodes['juda'] ? 'scale-100' : 'scale-125'}`}/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 w-full p-8 text-left">
                                  <h4 className="text-white font-black uppercase tracking-widest text-3xl md:text-4xl mb-2 drop-shadow-2xl">PROFETAS MESIÁNICOS</h4>
                                  <p className="text-amber-300 text-sm md:text-lg uppercase font-black tracking-widest md:tracking-[0.3em] drop-shadow-lg">ISAÍAS • JEREMÍAS • MIQUEAS</p>
                                </div>
                                <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['juda'] ? 'opacity-0' : 'opacity-100'}`}>
                                  <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-4 rounded-full border-2 border-amber-500/50 shadow-2xl backdrop-blur-md text-xl">VER MÁS</span>
                                </div>
                              </div>

                              <div className={`grid transition-all duration-1000 ease-in-out text-left ${expandedNodes['juda'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                                <div className="overflow-hidden space-y-6">
                                  <div className="bg-[#20110a]/90 p-6 md:p-8 rounded-[2rem] border border-amber-900/50">
                                    <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Contexto</span>
                                    <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-serif">Sobrevivió mucho más tiempo gracias a líderes heroicos como Ezequías (fe inquebrantable) y Josías (reforma al redescubrir las Escrituras).</p>
                                  </div>
                                  <div className="bg-orange-950/40 border border-orange-900/50 p-6 md:p-8 rounded-[2rem] relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                                    <span className="inline-block bg-orange-900 text-orange-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3">Falla Crítica</span>
                                    <p className="text-orange-200 text-lg md:text-xl leading-relaxed font-serif">Los reyes perversos (Manasés) causaron daño irreversible, llevando al Exilio. En 586 a.C. Babilonia arrasa Jerusalén y quema el Templo.</p>
                                  </div>
                                  <div className="bg-amber-950/30 p-6 md:p-8 rounded-[2rem] border border-amber-900/50">
                                    <span className="inline-block bg-amber-900 text-amber-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2 w-max"><Target className="w-4 h-4"/> LECCIÓN MAESTRA</span>
                                    <p className="text-amber-100 text-lg md:text-xl leading-relaxed font-serif">Nuestras malas acciones de hoy (egoísmo, injusticia) dejan cicatrices profundas que pueden hundir al grupo entero el día de mañana.</p>
                                  </div>

                                  {/* PREGUNTA REFLEXIVA Y PUNTAJE */}
                                  <div className="mt-10 xl:col-span-3 relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-red-600 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
                                    <div className="relative bg-[#05010a]/95 backdrop-blur-3xl p-8 md:p-10 rounded-[2.5rem] border border-amber-500/30 shadow-[inset_0_0_40px_rgba(245,158,11,0.1)] text-left overflow-hidden">
                                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                                      
                                      <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                        <div className="w-16 h-16 shrink-0 bg-amber-950/50 rounded-2xl flex items-center justify-center border border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                          <Trophy className="w-8 h-8 text-amber-400 animate-pulse"/>
                                        </div>
                                        <div className="flex-grow">
                                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                            <h5 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 font-black uppercase tracking-widest md:tracking-[0.3em] text-xl md:text-2xl drop-shadow-lg">EL DESAFÍO DEL REY</h5>
                                            <span className="bg-amber-900/40 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black tracking-widest border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-bounce">+ 150 XP</span>
                                          </div>
                                          
                                          <div className="bg-black/40 p-6 rounded-2xl border border-amber-900/40 mb-6">
                                            <p className="text-white text-xl md:text-2xl leading-relaxed font-serif italic">"Judá logró sobrevivir más tiempo porque sus mejores reyes redescubrieron el 'Libro de la Ley'. En los momentos donde nuestro salón es un desastre, ¿cuál es ese 'libro de instrucciones' o valor central al que debemos volver para salvarnos?"</p>
                                          </div>
                                          
                                          <div className="bg-[#0a0514] p-5 rounded-2xl border border-[#1a112c]">
                                            <p className="text-amber-400/70 text-[10px] font-black uppercase tracking-widest md:tracking-[0.2em] mb-4 flex items-center gap-2"><Crosshair className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE:</p>
                                            <div className="flex flex-wrap gap-3">
                                              {clansData.map(c => (
                                                <button key={c.id} onClick={(e) => { e.stopPropagation(); updateScore(c.id, 150); }} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:-translate-y-1`}>
                                                  <span className="text-lg">{c.icon}</span> {c.name}
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                           </div>
                         </div>
                      </div>

                    </div>

                    {/* ========================================= */}
                    {/* PARTE 4: LA CONVERGENCIA Y LA PROMESA */}
                    {/* ========================================= */}
                    <div className="mt-48 relative flex flex-col items-center">
                      <div className="w-2 md:w-4 h-48 bg-gradient-to-b from-amber-500 via-yellow-400 to-white shadow-[0_0_50px_rgba(250,204,21,1)] z-10 mb-[-4rem] lg:ml-[50%] rounded-full opacity-90"></div>
                      
                      <div onClick={() => toggleNode('promesa')} className="w-full max-w-7xl bg-gradient-to-br from-[#1a0a00] via-[#331100] to-black border-4 md:border-8 border-yellow-500 rounded-[4rem] md:rounded-[6rem] p-12 md:p-32 relative overflow-hidden shadow-[0_0_200px_rgba(234,179,8,0.6)] cursor-pointer group hover:border-yellow-400 transition-colors duration-700">
                        <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501651493037-128dce28d6bd?q=80&w=2000')] bg-cover bg-center mix-blend-screen transition-all duration-[3s] ${expandedNodes['promesa'] ? 'opacity-20 scale-100' : 'opacity-40 scale-110'}`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        
                        <div className="relative z-10 text-center flex flex-col items-center">
                          <div className={`relative w-64 h-64 md:w-96 md:h-96 mb-16 flex items-center justify-center transition-transform duration-1000 ${expandedNodes['promesa'] ? 'scale-75' : 'scale-100'}`}>
                             <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-80 rounded-full animate-pulse"></div>
                             <img src="/images/jesus.jpg" alt="Jesús de Nazaret" className="w-full h-full object-cover rounded-full border-8 border-yellow-500 shadow-[0_0_80px_rgba(250,204,21,1)] relative z-10" />
                          </div>
                          
                          <p className="text-yellow-500 font-black uppercase tracking-widest md:tracking-[1em] text-lg md:text-2xl mb-8"><Key className="w-8 h-8 inline-block mr-4"/> EL HILO CONDUCTOR DIVINO</p>
                          <h3 className="text-5xl md:text-7xl lg:text-9xl lg:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-600 uppercase tracking-tighter mb-16 drop-shadow-[0_0_40px_rgba(250,204,21,0.5)] leading-none">JESÚS DE NAZARET</h3>
                          
                          <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['promesa'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/90 text-yellow-400 font-black uppercase tracking-widest md:tracking-[0.5em] px-12 py-6 rounded-full border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.8)] backdrop-blur-xl text-2xl md:text-4xl animate-bounce mt-[200px]">DESCUBRIR EL PACTO FINAL</span>
                          </div>

                          <div className={`grid transition-all duration-1000 ease-in-out w-full ${expandedNodes['promesa'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-20'}`}>
                            <div className="overflow-hidden">
                              <div className="pt-8 w-full max-w-5xl mx-auto flex flex-col gap-8">
                                
                                <div className="bg-[#1f0b00]/90 backdrop-blur-xl border border-yellow-900/50 p-8 md:p-12 rounded-[3rem] text-left">
                                  <span className="inline-flex bg-yellow-900 text-yellow-300 px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 items-center gap-2"><Sparkles className="w-4 h-4"/> UN DESTELLO DE ESPERANZA</span>
                                  <p className="text-yellow-100 text-xl md:text-3xl leading-relaxed font-serif">El libro de los Reyes cierra 40 años después del exilio. El rey de Babilonia libera de prisión a Joaquín, <strong className="text-white font-sans font-black">el último descendiente del rey David</strong>, y lo invita a comer a la mesa real por el resto de su vida.</p>
                                </div>

                                <div className="bg-gradient-to-br from-[#0a0500] to-black border-2 border-yellow-500/30 p-8 md:p-12 rounded-[3rem] text-left relative overflow-hidden">
                                  <div className="absolute inset-0 bg-yellow-900/10 mix-blend-screen pointer-events-none"></div>
                                  <span className="inline-flex bg-white text-black px-4 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-4 items-center gap-2"><Target className="w-4 h-4"/> EL PACTO CUMPLIDO</span>
                                  <p className="text-slate-300 text-xl md:text-3xl leading-relaxed font-serif italic mb-6">
                                    "Ese inusual evento nos dice que Dios no había abandonado el linaje. A pesar del caos y los errores de los reyes terrenales, la semilla mesiánica viajó oculta durante mil años hasta el nacimiento del verdadero y eterno Rey."
                                  </p>
                                  <div className="inline-flex items-center justify-center gap-6 md:gap-10 bg-gradient-to-r from-yellow-950 to-black border-4 border-yellow-500/80 px-8 md:px-16 py-6 md:py-8 rounded-full shadow-[0_0_80px_rgba(234,179,8,0.3)] mt-6">
                                    <Crown className="w-12 h-12 md:w-16 md:h-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)]"/>
                                    <span className="text-yellow-200 font-black uppercase tracking-widest md:tracking-[0.2em] md:tracking-widest md:tracking-[0.4em] text-2xl md:text-4xl">EL LEÓN DE LA TRIBU DE JUDÁ</span>
                                  </div>
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {m3SubTab === 'simulador' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#120703] border border-amber-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(245,158,11,0.15)] flex flex-col items-center text-center">
                      <Scroll className="w-20 h-20 text-amber-500 mb-6 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]"/>
                      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 uppercase tracking-widest mb-4">EL RETO DE INVESTIGACIÓN</h2>
                      <p className="text-amber-500 text-xs md:text-sm font-bold tracking-widest md:tracking-[0.3em] uppercase bg-amber-950/40 inline-block px-6 py-2 rounded border border-amber-900/50 mb-8">ANÁLISIS DEL REINO DIVIDIDO</p>
                      
                      <div className="bg-[#0a0502] border border-amber-900/30 p-6 md:p-8 rounded-2xl w-full text-left mb-10 shadow-inner">
                        <p className="text-white italic text-lg md:text-xl leading-relaxed font-serif border-l-4 border-amber-600 pl-4">"Investiguen a los Reyes de Israel. <strong className="text-amber-300 font-sans font-black not-italic uppercase">Pero no a los principales (Saúl, David y Salomón)</strong>, sino al resto de los monarcas que gobernaron el Norte y el Sur hasta el exilio."</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-10 text-left">
                        <div className="bg-[#120c1a] border border-indigo-900/50 p-6 md:p-8 rounded-2xl hover:border-indigo-500 transition-colors shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600"></div>
                          <h4 className="text-indigo-400 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Layers className="w-5 h-5"/> 1. IDEAS ESENCIALES</h4>
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed">De los reyes que investiguen, extraigan sus sucesos más críticos: sus grandes aciertos, sus reformas espirituales, o sus errores fatales e idolatrías que condenaron al pueblo.</p>
                        </div>
                        <div className="bg-[#1a0f07] border border-orange-900/50 p-6 md:p-8 rounded-2xl hover:border-orange-500 transition-colors shadow-lg relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-2 h-full bg-orange-600"></div>
                          <h4 className="text-orange-400 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><Crosshair className="w-5 h-5"/> 2. EL MENSAJE TÁCTICO</h4>
                          <p className="text-slate-300 text-sm md:text-base leading-relaxed">Basados en esos reinados, ¿Qué enseñanza de vida, mensaje o advertencia directa nos podrían dejar el día de hoy para nuestro salón de clases y nuestras vidas?</p>
                        </div>
                      </div>
                      
                      <div className="bg-amber-950/20 border border-amber-800/50 p-6 md:p-8 rounded-2xl w-full">
                        <h4 className="text-amber-400 font-black text-sm uppercase tracking-widest mb-4 flex items-center justify-center gap-2"><Target className="w-5 h-5"/> MISIÓN DE CAMPO (PARA LA CASA)</h4>
                        <p className="text-slate-300 text-sm md:text-base mb-2">Esta investigación debe realizarse de forma individual en sus cuadernos (Códices) para la próxima sesión.</p>
                        <p className="text-amber-500/70 text-xs uppercase tracking-widest font-black">La revisión se hará de forma estricta. Clan incompleto, clan que pierde puntos.</p>
                      </div>
                    </div>
                  </div>
                )}

                {m3SubTab === 'cierre' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#02050a] border border-emerald-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center overflow-hidden">
                      {/* background elements */}
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/30"></div>
                      
                      <div className="w-20 h-20 bg-emerald-950/50 rounded-3xl flex items-center justify-center border-2 border-emerald-500/50 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"/>
                      </div>
                      
                      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-600 uppercase tracking-widest mb-4 relative z-10">METACOGNICIÓN FINAL</h2>
                      <p className="text-emerald-500 text-xs md:text-sm font-bold tracking-widest md:tracking-[0.3em] uppercase bg-emerald-950/40 inline-block px-6 py-2 rounded-full border border-emerald-900/50 mb-10 relative z-10">CIERRE DE LA MISIÓN 3</p>
                      
                      <div className="w-full space-y-6 relative z-10 text-left">
                        
                        <div className="bg-[#0a120e] border border-emerald-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/50 transition-colors shadow-lg">
                          <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 shrink-0">
                            <Target className="w-6 h-6 text-emerald-400"/>
                          </div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">1. REFLEXIÓN PERSONAL</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">De todos los reyes y sus caídas que hemos analizado hoy, ¿cuál sientes que es el "síndrome" o error que más se repite en ti como estudiante o compañero?</p>
                          </div>
                        </div>

                        <div className="bg-[#0a120e] border border-emerald-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/50 transition-colors shadow-lg">
                          <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 shrink-0">
                            <Users className="w-6 h-6 text-emerald-400"/>
                          </div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">2. VISIÓN DE CLAN</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">¿Cómo podemos asegurarnos de no dividir nuestro clan (como el Reino del Norte y del Sur), cuando hay conflictos de opiniones o peleas?</p>
                          </div>
                        </div>

                        <div className="bg-[#0a120e] border border-emerald-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/50 transition-colors shadow-lg">
                          <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 shrink-0">
                            <Flame className="w-6 h-6 text-emerald-400"/>
                          </div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">3. PROMESA DE LA CORONA</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">Un verdadero líder (como el Mesías prometido) sirve a los demás y no busca el egoísmo. Escribe en tu Códice una acción concreta de servicio que harás por alguien que NO sea de tu clan esta semana.</p>
                          </div>
                        </div>

                      </div>

                      <div className="mt-12 pt-8 border-t border-emerald-900/40 w-full relative z-10 flex flex-col items-center">
                        <button onClick={() => { setM3SubTab('archivo'); setM3Fase(0); setStartMision3Cinematic(false); setView('campamento_base'); }} className="group relative px-10 py-5 rounded-full overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300 border border-emerald-500/50 cursor-pointer">
                          <div className="absolute inset-0 bg-emerald-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <span className="relative z-10 flex items-center gap-3 text-emerald-400 group-hover:text-white font-black uppercase tracking-widest md:tracking-[0.2em] transition-colors">
                            MISIÓN COMPLETADA: RETORNAR A BASE <ChevronRight className="w-5 h-5"/>
                          </span>
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── BOTTOM MISSION BAR ──────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {isMissionActive && (
        <div className="fixed bottom-0 left-0 w-full bg-[#030408]/95 backdrop-blur-md border-t border-[#1e293b] p-4 flex justify-between items-center z-[100] shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <button onClick={() => setTimerRunning(!timerRunning)} className="cursor-pointer">
              <span className={`font-black text-3xl md:text-4xl tracking-widest font-mono drop-shadow-[0_0_10px_rgba(129,140,248,0.5)] ${timerSeconds <= 60 ? 'text-red-500 animate-pulse' : timerSeconds <= 180 ? 'text-amber-400' : 'text-indigo-400'}`}>{formatTime(timerSeconds)}</span>
            </button>
            <div className="flex gap-2">
              <button onClick={() => setTimerRunning(!timerRunning)} className={`p-2 md:p-3 rounded-lg shadow-inner cursor-pointer transition-colors border ${timerRunning ? 'bg-amber-950/50 border-amber-900 text-amber-500 hover:bg-amber-900/60' : 'bg-emerald-950/50 border-emerald-900 text-emerald-500 hover:bg-emerald-900/60'}`}>
                {timerRunning ? <Pause className="w-5 h-5 md:w-6 md:h-6"/> : <Play className="w-5 h-5 md:w-6 md:h-6"/>}
              </button>
              <button onClick={() => { setTimerSeconds(25 * 60); setTimerRunning(false); }} className="bg-slate-900/50 border border-slate-700 p-2 md:p-3 rounded-lg text-slate-400 shadow-inner hover:bg-slate-800 cursor-pointer transition-colors">
                <RotateCcw className="w-5 h-5 md:w-6 md:h-6"/>
              </button>
            </div>
          </div>
          <button onClick={() => { setShowShofarPlayer(true); setShofarBlast(true); setShofarLlamadas(prev => prev + 1); setTimeout(() => setShofarBlast(false), 3000); }} className="bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-3 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all hover:scale-105">
            <Volume2 className="w-5 h-5"/> SHOFAR ({shofarLlamadas})
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── SHOFAR MODAL ───────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showShofarPlayer && (
        <div className="fixed inset-0 z-[999999] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center animate-in zoom-in duration-300 overflow-hidden">
          {/* Shockwave effect */}
          {shofarBlast && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-40 rounded-full border-4 border-amber-500/60 animate-[shockwave_2s_ease-out_forwards]" />
              <div className="absolute w-40 h-40 rounded-full border-4 border-amber-500/40 animate-[shockwave_2s_ease-out_forwards_0.3s]" />
              <div className="absolute w-40 h-40 rounded-full border-4 border-amber-500/20 animate-[shockwave_2s_ease-out_forwards_0.6s]" />
            </div>
          )}
          <div className="absolute top-4 right-4 z-[999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-amber-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] group hover:scale-105 transition-transform">
            <div className="absolute top-0 left-0 w-full bg-amber-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> PLAY SHOFAR</div>
            <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHSo8JuilM/ngnUwoIAOCwgZw1qMHdEtA/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
          </div>

          <div className="relative z-10 text-center">
            <div className="text-8xl md:text-[10rem] mb-6 animate-[shofar-pulse_1.5s_ease-in-out_infinite]">📯</div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-300 to-amber-600 uppercase tracking-widest md:tracking-[0.3em] mb-4 drop-shadow-[0_0_40px_rgba(245,158,11,0.8)]">¡SHOFAR!</h2>
            <div className="bg-red-600 text-white px-8 py-4 rounded-xl inline-block mb-8 shadow-[0_0_40px_rgba(220,38,38,0.6)] animate-pulse">
              <p className="text-2xl md:text-4xl font-black uppercase tracking-widest md:tracking-[0.4em]">SILENCIO TÁCTICO ABSOLUTO</p>
            </div>
            <p className="text-amber-500/60 text-sm mb-12 font-mono tracking-widest uppercase">Llamadas de Shofar hoy: <span className="text-white font-black text-lg">{shofarLlamadas}</span></p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => { setShofarBlast(true); setShofarLlamadas(prev => prev + 1); setTimeout(() => setShofarBlast(false), 3000); }} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] transition-all hover:scale-105 flex items-center gap-3">
                <Volume2 className="w-6 h-6"/> SONAR DE NUEVO
              </button>
              <button onClick={() => setShowShofarPlayer(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest cursor-pointer border border-slate-600 transition-colors flex items-center gap-3">
                <X className="w-6 h-6"/> CERRAR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── CENTRO DE DESCARGAS (DOSSIERS) ──────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'archivos_misiones' && (
        <div className={`flex-grow flex flex-col items-center bg-[#06080e] relative min-h-screen ${activeDossier ? 'p-0 bg-black' : 'p-8'}`}>
          
          {/* MENU SELECCIÓN DE DOSSIER */}
          {!activeDossier && (
            <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 mt-10">
              <button onClick={() => setView('selector')} className="absolute top-4 left-4 text-slate-500 hover:text-white bg-[#161827] border border-[#2a2e45] px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> VOLVER</button>
              
              <Scroll className="w-16 h-16 text-indigo-500 mb-4 drop-shadow-[0_0_30px_rgba(99,102,241,0.6)]"/>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-2xl text-center">ARCHIVOS DE LA CORONA</h1>
              <p className="text-indigo-400 text-xs md:text-sm tracking-widest md:tracking-[0.4em] font-bold uppercase mb-12 text-center bg-indigo-950/30 px-6 py-2 rounded-full border border-indigo-900/50">MATERIAL CONFIDENCIAL DESCARGABLE (PDF)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4">
                {/* Mision 1 Card */}
                <div onClick={() => setActiveDossier(1)} className="group bg-[#0a0c16] border border-amber-900/50 hover:border-amber-500/80 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.05)] hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:-translate-y-2 flex flex-col items-center text-center">
                  <Shield className="w-12 h-12 text-amber-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"/>
                  <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2">MISIÓN 1: SACERDOTES</h3>
                  <p className="text-slate-400 text-xs mb-6">El Pectoral del Juicio y la Intercesión.</p>
                  <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest md:tracking-[0.2em] border border-amber-500/50 px-4 py-2 rounded-full bg-amber-950/30">ABRIR DOSSIER</span>
                </div>

                {/* Mision 2 Card */}
                <div onClick={() => setActiveDossier(2)} className="group bg-[#0a0c16] border border-red-900/50 hover:border-red-500/80 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.05)] hover:shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:-translate-y-2 flex flex-col items-center text-center">
                  <ShieldAlert className="w-12 h-12 text-red-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]"/>
                  <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2">MISIÓN 2: JUECES</h3>
                  <p className="text-slate-400 text-xs mb-6">El Tribunal, el Caos y la Responsabilidad.</p>
                  <span className="text-[9px] text-red-400 font-bold uppercase tracking-widest md:tracking-[0.2em] border border-red-500/50 px-4 py-2 rounded-full bg-red-950/30">ABRIR DOSSIER</span>
                </div>

                {/* Mision 3 Card */}
                <div onClick={() => setActiveDossier(3)} className="group bg-[#0a0c16] border border-purple-900/50 hover:border-purple-500/80 p-8 rounded-3xl cursor-pointer transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.05)] hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:-translate-y-2 flex flex-col items-center text-center">
                  <Crown className="w-12 h-12 text-purple-500 mb-6 group-hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"/>
                  <h3 className="text-white font-black text-xl uppercase tracking-widest mb-2">MISIÓN 3: REYES</h3>
                  <p className="text-slate-400 text-xs mb-6">El Archivo de la Corona y el Liderazgo.</p>
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest md:tracking-[0.2em] border border-purple-500/50 px-4 py-2 rounded-full bg-purple-950/30">ABRIR DOSSIER</span>
                </div>
              </div>
            </div>
          )}

          {/* VISTA DOSSIER (A4 PRINTABLE) LIGHT THEME */}
          {activeDossier && (
            <div className="w-full h-full bg-slate-900 flex justify-center overflow-y-auto py-10 relative">
              <div className="fixed top-4 left-4 z-50 flex gap-4 no-print">
                <button onClick={() => setActiveDossier(null)} className="text-slate-400 hover:text-white bg-black border border-slate-700 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer shadow-lg"><ChevronRight className="rotate-180 w-4 h-4"/> VOLVER</button>
              </div>
              
              <div className="fixed top-4 right-4 z-50 no-print animate-bounce">
                <button onClick={downloadPDF} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 font-black uppercase tracking-widest text-sm transition-all shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:shadow-[0_0_50px_rgba(79,70,229,0.8)] flex items-center justify-center gap-3 rounded-xl cursor-pointer border border-indigo-400"><Scroll className="w-5 h-5"/> DESCARGAR DOSSIER (PDF)</button>
              </div>

              {/* CONTENEDOR MULTI-PÁGINA */}
              <div id="dossier-pdf" className="flex flex-col items-center pdf-safe-font">
                {/* CONTENIDO DINÁMICO POR MISIÓN */}
                {activeDossier === 1 && (
                  <A4Page>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-amber-50 rounded-xl flex items-center justify-center border-2 border-amber-500 text-amber-600 shadow-sm"><Shield className="w-8 h-8"/></div>
                      <div>
                        <h2 className="text-3xl font-black text-amber-600 uppercase tracking-widest">MISIÓN 1: SACERDOTES</h2>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Tema: El Pectoral del Juicio y la Intercesión.</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
                      <h3 className="text-slate-800 font-black uppercase tracking-widest text-sm mb-1 border-b border-slate-200 pb-1 flex items-center gap-2"><Scroll className="w-4 h-4 text-slate-400"/> CONCEPTO TÁCTICO</h3>
                      <p className="text-slate-600 text-[11px] leading-relaxed mb-2 font-medium">El sacerdote no se representa a sí mismo; carga con el peso de su pueblo en el corazón frente a la Presencia Divina. Su santidad no es aislamiento, es responsabilidad.</p>
                      <p className="text-amber-700 font-serif italic text-[10px] border-l-2 border-amber-400 pl-3">"Llevará Aarón los nombres de los hijos de Israel en el pectoral del juicio sobre su corazón... continuamente delante de Jehová." (Éxodo 28:29)</p>
                    </div>

                    <div className="bg-white border-2 border-amber-200 rounded-xl p-4 flex-grow shadow-sm flex flex-col">
                      <h3 className="text-amber-600 font-black uppercase tracking-widest text-base mb-4 text-center">ACTIVIDAD DE CAMPO: FORJANDO LAS PIEDRAS</h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 flex-grow">
                        <div className="flex flex-col justify-center">
                          <p className="text-slate-700 text-[10px] leading-relaxed mb-4"><strong>INSTRUCCIONES:</strong> Dibuja en el recuadro de la derecha tu propio diseño del Pectoral. Luego, elige a <strong>UN COMPAÑERO</strong> de tu clase (que no sea tu amigo más cercano) por el cual te comprometes a interceder, defender y ayudar durante toda la semana.</p>
                          <div className="mt-4 border-b border-dashed border-slate-300 pb-1 mb-3">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">NOMBRE DE TU CLAN:</p>
                            <div className="h-4"></div>
                          </div>
                          <div className="border-b border-dashed border-slate-300 pb-1">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">COMPAÑERO A PROTEGER (LA PIEDRA PRECIOSA):</p>
                            <div className="h-4"></div>
                          </div>
                        </div>
                        <div className="border-2 border-slate-300 border-dashed rounded-xl flex items-center justify-center p-4 bg-slate-50 relative min-h-[250px]">
                          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest absolute text-center px-4">DIBUJA EL PECTORAL AQUÍ</span>
                        </div>
                      </div>
                      
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mt-auto">
                        <p className="text-[9px] text-amber-700 font-bold uppercase tracking-widest mb-1">REPORTE FINAL DEL LÍDER:</p>
                        <p className="text-slate-500 text-[9px] italic mb-2">Escribe brevemente cómo cumpliste esta misión de protección durante la semana.</p>
                        <div className="h-6 border-b border-slate-300"></div>
                        <div className="h-6 border-b border-slate-300"></div>
                      </div>
                    </div>
                  </A4Page>
                )}

                {activeDossier === 2 && (
                  <>
                    {[
                      casosTribunal.slice(0, 4),
                      casosTribunal.slice(4, 10),
                      casosTribunal.slice(10, 14)
                    ].filter(arr => arr.length > 0).map((pageCases, pageIndex, arr) => (
                      <div key={pageIndex}>
                        <A4Page>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center border-2 border-red-500 text-red-600 shadow-sm"><ShieldAlert className="w-8 h-8"/></div>
                            <div>
                              <h2 className="text-3xl font-black text-red-600 uppercase tracking-widest">MISIÓN 2: JUECES {pageIndex > 0 ? `(PÁG ${pageIndex + 1})` : ''}</h2>
                              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Tema: El Tribunal y la Era del Caos.</p>
                            </div>
                          </div>
                          
                          {pageIndex === 0 && (
                            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
                              <h3 className="text-slate-800 font-black uppercase tracking-widest text-sm mb-1 border-b border-slate-200 pb-1 flex items-center gap-2"><Scroll className="w-4 h-4 text-slate-400"/> CONCEPTO TÁCTICO</h3>
                              <p className="text-slate-600 text-[11px] leading-relaxed mb-2 font-medium">El liderazgo sin carácter sólido destruye. Un verdadero juez no busca excusas para el egoísmo, busca justicia y el bien común, incluso por encima de su propio beneficio.</p>
                              <p className="text-red-700 font-serif italic text-[10px] border-l-2 border-red-400 pl-3">"En aquellos días no había rey en Israel; cada uno hacía lo que bien le parecía." (Jueces 17:6)</p>
                            </div>
                          )}

                          <div className="bg-white border-2 border-red-200 rounded-xl p-4 flex-grow shadow-sm flex flex-col">
                            <h3 className="text-red-600 font-black uppercase tracking-widest text-base mb-4 text-center">ACTIVIDAD DE CAMPO: ESTUDIO DE CASO (TRIBUNAL)</h3>
                            
                            <div className="grid grid-cols-2 gap-3 flex-grow">
                              {pageCases.map((caso) => (
                                <div key={caso.id} className="bg-red-50 p-3 rounded-lg border border-red-200 shadow-sm flex flex-col justify-between">
                                  <div>
                                    <h4 className="text-slate-800 font-black text-[9px] uppercase tracking-widest mb-1 border-b border-red-200 pb-1">CASO {caso.id}: {caso.titulo}</h4>
                                    <p className="text-slate-600 text-[8px] leading-snug mb-1 italic">"{caso.descripcion}"</p>
                                    <p className="text-red-700 text-[8px] font-bold leading-tight mb-2">{caso.exigencia}</p>
                                  </div>
                                  <div className="mt-auto">
                                    <div className="h-4 border-b border-dashed border-slate-300"></div>
                                    <div className="h-4 border-b border-dashed border-slate-300"></div>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {pageIndex === arr.length - 1 && (
                              <div className="mt-4 pt-4 border-t-2 border-red-200 flex justify-between items-end">
                                <div className="w-1/2">
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-6">FIRMA DEL JUEZ (ESTUDIANTE):</p>
                                  <div className="border-b-2 border-slate-400 w-3/4"></div>
                                </div>
                                <div className="w-1/3 bg-white p-2 rounded-lg border-2 border-red-300 text-center shadow-sm">
                                  <p className="text-[9px] font-black text-red-600 uppercase tracking-widest">SELLO DEL TRIBUNAL</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </A4Page>
                        {pageIndex < arr.length - 1 && <div className="html2pdf__page-break"></div>}
                      </div>
                    ))}
                  </>
                )}

                {activeDossier === 3 && (
                  <A4Page>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center border-2 border-purple-500 text-purple-600 shadow-sm"><Crown className="w-8 h-8"/></div>
                      <div>
                        <h2 className="text-3xl font-black text-purple-600 uppercase tracking-widest">MISIÓN 3: REYES</h2>
                        <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Tema: El Archivo de la Corona y el Liderazgo.</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 shadow-sm">
                      <h3 className="text-slate-800 font-black uppercase tracking-widest text-sm mb-1 border-b border-slate-200 pb-1 flex items-center gap-2"><Scroll className="w-4 h-4 text-slate-400"/> CONCEPTO TÁCTICO</h3>
                      <p className="text-slate-600 text-[11px] leading-relaxed mb-2 font-medium">El poder verdadero no es dominar a los demás; es dominarse a sí mismo para servir a los demás. Saúl perdió la corona por su necesidad patológica de agradar a la gente. David la mantuvo porque su corazón buscaba a Dios.</p>
                      <p className="text-purple-700 font-serif italic text-[10px] border-l-2 border-purple-400 pl-3">"Pero Jehová respondió a Samuel: No mires a su parecer, ni a lo grande de su estatura... porque Jehová no mira lo que mira el hombre, sino el corazón." (1 Samuel 16:7)</p>
                    </div>

                    <div className="bg-white border-2 border-purple-200 rounded-xl p-4 flex-grow shadow-sm flex flex-col">
                      <h3 className="text-purple-600 font-black uppercase tracking-widest text-base mb-4 text-center">ACTIVIDAD DE CAMPO: EXTRACCIÓN DE DATOS DE LA CORONA</h3>
                      
                      <p className="text-slate-700 text-[10px] leading-relaxed mb-6"><strong>INSTRUCCIONES:</strong> Mientras observas el <strong>Archivo Audiovisual (Video)</strong> en el Simulador, identifica los <strong className="text-purple-600">3 errores más grandes</strong> que cometieron los reyes de Israel y cómo podemos evitar cometerlos hoy en nuestra vida escolar y social.</p>
                      
                      <div className="space-y-6 flex-grow">
                        {[1, 2, 3].map(num => (
                          <div key={num} className="flex gap-4">
                            <div className="w-10 h-10 bg-purple-50 border-2 border-purple-300 rounded-xl flex items-center justify-center font-black text-xl text-purple-500 shrink-0 shadow-sm">{num}</div>
                            <div className="flex-grow">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">ERROR DETECTADO EN EL VIDEO:</p>
                              <div className="h-5 border-b-2 border-dashed border-slate-300 mb-2"></div>
                              <p className="text-[9px] text-purple-600 uppercase tracking-widest font-bold mb-1">¿CÓMO LO EVITAMOS EN EL SALÓN?</p>
                              <div className="h-5 border-b-2 border-dashed border-slate-300"></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-2 text-center border-t border-slate-200">
                        <p className="text-[9px] text-slate-400 font-mono">FIN DEL REPORTE. ARCHIVO CIFRADO.</p>
                      </div>
                    </div>
                  </A4Page>
                )}
              </div>
            </div>
          )}
        </div>
      )}

    
      
      {/* ── EPIC FULL SCREEN QUESTION MODAL ── */}
      {activeDesafio && (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-[1.5s] overflow-hidden bg-[#030105] backdrop-blur-3xl">
          {/* BACKGROUND CINEMATIC LAYERS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-screen animate-[slowZoom_30s_linear_infinite_alternate]"></div>
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 50% 50%, ${desafiosM3[activeDesafio].glow.replace('0.8', '0.4')}, transparent 80%)` }}></div>
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            
            {/* Cinematic Letterbox (Top & Bottom black bars) */}
            <div className="absolute top-0 left-0 w-full h-24 bg-black z-10 animate-in slide-in-from-top duration-[2s]"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 bg-black z-10 animate-in slide-in-from-bottom duration-[2s]"></div>
            
            {/* Ambient Scanline & Particles */}
            <div className="absolute top-0 left-0 w-full h-1 animate-[scanline_8s_linear_infinite] z-10" style={{ backgroundColor: desafiosM3[activeDesafio].glow, boxShadow: `0 0 40px ${desafiosM3[activeDesafio].glow}` }}></div>
            <div className="absolute w-[200%] h-[200%] -top-[50%] -left-[50%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] animate-[spin_120s_linear_infinite] opacity-50 z-0 pointer-events-none"></div>
          </div>
          
          <button onClick={() => setActiveDesafio(null)} className="absolute top-6 right-6 text-white/30 hover:text-white bg-black/50 hover:bg-red-600/80 p-4 rounded-full transition-all cursor-pointer z-50 border border-white/10 shadow-lg group"><X className="w-8 h-8 group-hover:rotate-90 transition-transform"/></button>
          
          <div className="relative z-20 text-center max-w-6xl w-full flex flex-col items-center perspective-1000">
            {/* BADGE: CRÓNICAS DEL TRONO */}
            <div className="animate-in slide-in-from-top-12 fade-in duration-[1s] fill-mode-both">
              <span className="text-white/60 text-[10px] md:text-xs font-black uppercase tracking-widest md:tracking-[0.5em] mb-2 block drop-shadow-md">CRÓNICAS DEL TRONO</span>
              <div className="w-1 h-12 mx-auto mb-6" style={{ background: `linear-gradient(to bottom, transparent, ${desafiosM3[activeDesafio].glow}, transparent)` }}></div>
            </div>

            {/* TITLE */}
            <h2 className="text-5xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-500 uppercase tracking-widest md:tracking-[0.3em] mb-4 drop-shadow-2xl animate-in zoom-in-90 fade-in duration-[1.5s] delay-300 fill-mode-both" style={{ textShadow: `0 0 50px ${desafiosM3[activeDesafio].glow}` }}>{desafiosM3[activeDesafio].title}</h2>
            
            {/* 150 PUNTOS BADGE */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-[1s] delay-500 fill-mode-both mb-8">
               <div className="inline-flex items-center gap-3 bg-black/80 border border-white/20 px-8 py-2 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-20 animate-[pulse_2s_ease-in-out_infinite]" style={{ backgroundColor: desafiosM3[activeDesafio].glow }}></div>
                  <Target className="w-6 h-6 text-white animate-[spin_10s_linear_infinite]"/>
                  <span className="text-white font-black tracking-widest md:tracking-[0.4em] uppercase text-sm md:text-xl relative z-10 drop-shadow-md">150 PUNTOS EN JUEGO</span>
               </div>
            </div>
            
            {/* FASE 1: INVITACIÓN */}
            {desafioPaso === 'invitacion' && (
              <div className="mt-16 animate-in zoom-in fade-in duration-[1s] delay-700 fill-mode-both flex flex-col items-center">
                <p className="text-white/80 text-xl md:text-3xl font-black uppercase tracking-widest md:tracking-[0.4em] mb-12 animate-[pulse_3s_ease-in-out_infinite] drop-shadow-lg text-center">
                  ¿QUÉ CLAN ESTÁ LISTO <br/>PARA EL DESAFÍO?
                </p>
                <button onClick={() => setDesafioPaso('pregunta')} 
                        className="group relative px-16 py-6 rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.2)] hover:shadow-[0_0_100px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-500 border border-white/40 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: desafiosM3[activeDesafio].glow }}></div>
                  <span className="relative z-10 flex items-center gap-4 text-white font-black uppercase tracking-widest md:tracking-[0.4em] text-xl md:text-2xl drop-shadow-2xl">
                    <AlertTriangle className="w-8 h-8 animate-pulse text-amber-300"/> 
                    REVELAR LA PREGUNTA
                  </span>
                </button>
              </div>
            )}

            {/* FASE 2: PREGUNTA */}
            {desafioPaso === 'pregunta' && (
              <>
                {/* QUESTION BOX */}
                <div className="bg-black/50 border-y-2 py-10 md:py-16 px-6 md:px-12 w-full my-6 relative overflow-hidden backdrop-blur-sm animate-in zoom-in-95 fade-in duration-[0.8s] fill-mode-both" style={{ borderColor: desafiosM3[activeDesafio].glow }}>
                  <div className="absolute left-0 top-0 w-3 h-full" style={{ backgroundColor: desafiosM3[activeDesafio].glow, boxShadow: `0 0 30px ${desafiosM3[activeDesafio].glow}` }}></div>
                  <div className="absolute right-0 top-0 w-3 h-full" style={{ backgroundColor: desafiosM3[activeDesafio].glow, boxShadow: `0 0 30px ${desafiosM3[activeDesafio].glow}` }}></div>
                  
                  <p className="text-white text-2xl md:text-4xl lg:text-5xl leading-[1.4] font-serif italic max-w-4xl mx-auto drop-shadow-2xl relative z-10">
                    "{desafiosM3[activeDesafio].text}"
                  </p>
                </div>
                
                <p className="text-white/60 text-xs md:text-sm font-black uppercase tracking-widest md:tracking-[0.4em] mt-8 mb-6 animate-[pulse_2s_ease-in-out_infinite] animate-in fade-in duration-1000 delay-[500ms] fill-mode-both">
                  PREPAREN SUS PALETAS. ¿QUÉ CLAN DESEA RESPONDER?
                </p>
                
                {/* CLAN BUTTONS STAGGERED */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl z-30">
                  {clansData.map((c, idx) => (
                    <button key={c.id} onClick={() => { updateScore(c.id, 150); setActiveDesafio(null); }} 
                            className={`animate-in slide-in-from-bottom-8 fade-in duration-500 fill-mode-both px-6 py-4 rounded-xl text-sm md:text-base font-black uppercase tracking-widest transition-all ${c.border.replace("border-", "bg-").replace("/50", "/30")} border-2 border-white/20 hover:border-white text-white flex items-center justify-center gap-3 cursor-pointer shadow-2xl hover:scale-110 hover:-translate-y-2`} 
                            style={{ animationDelay: `${1000 + (idx * 200)}ms`, boxShadow: `0 10px 30px ${desafiosM3[activeDesafio].glow.replace('0.8', '0.2')}` }}>
                      <span className="text-3xl drop-shadow-md">{c.icon}</span> 
                      <span className="drop-shadow-md">{c.name}</span> 
                      <span className="bg-white/20 px-2 py-1 rounded text-xs ml-2">+150</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            
          </div>
        </div>
      )}



    
      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MISIÓN 4: PROFETAS ────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision4' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#030105] min-h-screen">
          {m4Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-fuchsia-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(217,70,239,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-fuchsia-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> BSO ÉPICA M4</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHWuc7vUjQ/GuDDB_i57xEdbBLFkBUkjQ/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {!startMision4Cinematic ? (
            <div className="z-10 flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 max-w-2xl mx-auto px-4 w-full h-full">
              <Flame className="w-24 h-24 text-fuchsia-500 mb-6 drop-shadow-[0_0_30px_rgba(217,70,239,0.5)] animate-pulse"/>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">MISIÓN 4: LOS PROFETAS</h1>
              <p className="text-fuchsia-400 text-xs md:text-sm tracking-widest md:tracking-[0.3em] uppercase mb-10 font-bold border border-fuchsia-900/50 bg-fuchsia-950/30 px-6 py-4 rounded-xl">INSTRUCCIÓN GM: <br/><br/>1) ACTIVA LA BSO EN LA ESQUINA.<br/>2) INICIA LA POESÍA CINEMÁTICA.</p>
              <button onClick={() => setStartMision4Cinematic(true)} className="bg-gradient-to-b from-fuchsia-700 to-fuchsia-950 border-2 border-fuchsia-400 text-fuchsia-100 px-10 py-5 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] rounded-full cursor-pointer flex items-center justify-center gap-3"><Wand2 className="w-6 h-6"/> Iniciar Cinemática</button>
              <button onClick={() => { setView('campamento_base'); setStartMision4Cinematic(false); setM4Fase(0); }} className="mt-8 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Volver al Campamento Base</button>
            </div>
          ) : m4Fase === 0 ? (
            <div key="cinematica-m4" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-[#030105] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487147264018-f9d7f52479e0?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-luminosity animate-[slowZoom_50s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#030105] via-[#030105]/70 to-transparent z-10"></div>
              
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 2s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-slate-300 uppercase tracking-widest md:tracking-[0.4em] font-light drop-shadow-lg">Los reyes se corrompieron.</p></div>
              
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 10s' }}><p className="text-4xl md:text-6xl text-fuchsia-400 uppercase tracking-widest md:tracking-[0.4em] font-bold drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]">La corona de Israel se oxidó.</p></div>
              
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 18s' }}><p className="text-2xl md:text-4xl text-slate-400 uppercase tracking-widest md:tracking-[0.5em] font-light leading-relaxed">Y el pueblo...<br/>El pueblo olvidó quién era.</p></div>
              
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 28s' }}><p className="text-4xl md:text-6xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,0.8)]">Pero la voz del Cielo no guarda silencio.</p></div>
              
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 9s ease-out forwards 38s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-fuchsia-300 uppercase tracking-widest md:tracking-[0.4em] font-light drop-shadow-lg">Del polvo y la oscuridad,<br/>se levantaron llamas humanas.</p></div>

              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 6s ease-out forwards 49s' }}>
                <Flame className="w-24 h-24 text-fuchsia-500 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(217,70,239,1)] animate-[pulse_2s_ease-in-out_infinite]" />
                <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-600 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(217,70,239,1)]">LOS PROFETAS</h1>
                <p className="text-fuchsia-400 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase drop-shadow-md">VOCES CONTRA EL IMPERIO</p>
              </div>

              <div className="absolute bottom-16 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 3s ease-out forwards 55s' }}>
                <button onClick={() => setM4Fase(1)} className="bg-[#120516]/90 border-2 border-fuchsia-500 text-fuchsia-300 px-10 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-lg transition-all shadow-[0_0_40px_rgba(217,70,239,0.6)] hover:scale-110 hover:shadow-[0_0_60px_rgba(217,70,239,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">ENTRAR AL FUEGO <ChevronRight className="w-6 h-6"/></button>
              </div>
            </div>
          ) : (
            
            <div className="relative z-10 w-full h-full flex flex-col animate-in fade-in duration-1000 bg-[#05020a]">
              {/* HEADER */}
              <header className="bg-[#0a0514] border-b border-[#2d1b4e] p-4 flex justify-between items-center z-50 shadow-[0_10px_30px_rgba(217,70,239,0.1)]">
                <div className="flex items-center gap-3">
                  <button onClick={() => {setM4Fase(0); setStartMision4Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> Base {selectedClass}</button>
                  <h2 className="text-fuchsia-300 font-black tracking-widest uppercase text-sm md:text-base">{m4SubTab === 'archivo' ? 'FASE 1: ARCHIVO VISUAL' : m4SubTab === 'codice' ? 'FASE 2: EL CÓDICE PROFÉTICO' : m4SubTab === 'simulador' ? 'FASE 3: EL RETO' : 'FASE 4: CIERRE Y METACOGNICIÓN'}</h2>
                </div>
                <button onClick={() => setShowClans(!showClans)} className="text-amber-400 bg-amber-900/30 p-2 rounded-full hover:bg-amber-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
              </header>

              {/* TABS NAV */}
              <div className="bg-[#05020a] border-b border-[#2d1b4e] p-2 flex justify-center gap-2 z-40 shadow-md overflow-x-auto custom-scrollbar">
                <button onClick={() => setM4SubTab('archivo')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'archivo' ? 'bg-fuchsia-700 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'bg-[#150a29] text-fuchsia-400/50 hover:bg-[#1a0b36]'}`}>1. ARCHIVO VISUAL</button>
                <button onClick={() => setM4SubTab('codice')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'codice' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-[#150a29] text-fuchsia-400/50 hover:bg-[#1a0b36]'}`}>2. CÓDICE PROFÉTICO</button>
                <button onClick={() => setM4SubTab('simulador')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'simulador' ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#150a29] text-fuchsia-400/50 hover:bg-[#1a0b36]'}`}>3. EL RETO</button>
                <button onClick={() => setM4SubTab('cierre')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'cierre' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#150a29] text-fuchsia-400/50 hover:bg-[#1a0b36]'}`}>4. CIERRE Y METACOGNICIÓN</button>
              </div>

              {/* CONTENT AREA */}
              <div className="flex-grow overflow-y-auto pb-24 p-4 md:p-8 relative custom-scrollbar z-10">
                {m4SubTab === 'archivo' && (
                  <div className="max-w-7xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                      <Flame className="w-16 h-16 text-fuchsia-500 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-[pulse_2s_ease-in-out_infinite]"/>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-300 tracking-widest uppercase mb-2 drop-shadow-lg">ARCHIVO AUDIOVISUAL DE YAHVEH</h2>
                      <p className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase">REGISTRO HISTÓRICO: ¿QUIÉNES SON LOS PROFETAS?</p>
                    </div>
                    
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                      {/* Video Player */}
                      <div className="w-full bg-[#0a0b12] border border-fuchsia-900/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col">
                        <div className="bg-fuchsia-950/40 border-b border-fuchsia-900/50 px-4 py-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          <span className="text-[10px] text-fuchsia-300 font-mono tracking-widest">TRANSMISIÓN CRIPTOGRÁFICA ESTABLECIDA</span>
                        </div>
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                          <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0 }} src="https://www.canva.com/design/DAHWugF3r_Y/CGzIAO7oBeFfkhz_SVDLvQ/view?embed" allow="fullscreen"></iframe>
                        </div>
                      </div>
                      
                      <div className="bg-[#120516] border border-fuchsia-900/30 rounded-2xl p-6 md:p-8 flex items-start gap-4 shadow-lg">
                        <div className="bg-fuchsia-950/50 p-3 rounded-lg border border-fuchsia-800/50 shrink-0"><AlertTriangle className="w-6 h-6 text-fuchsia-400"/></div>
                        <div>
                          <h3 className="text-fuchsia-300 font-black uppercase tracking-widest text-lg mb-2">INSTRUCCIÓN TÁCTICA</h3>
                          <p className="text-slate-300 leading-relaxed text-sm md:text-base mb-4">Los Clanes deben mantener "Silencio Táctico" absoluto durante la transmisión. La información revelada en este archivo es clasificada y será vital para superar el Códice Profético y el Reto Final.</p>
                          <div className="bg-black/50 border border-fuchsia-900/50 p-4 rounded text-xs text-fuchsia-400 font-mono uppercase tracking-widest">
                            [!] Atentos a las señales: ¿Qué los motivaba a hablar? ¿A quiénes se enfrentaban?
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {m4SubTab === 'codice' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 text-center text-slate-400 py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-2">CÓDICE PROFÉTICO</h2>
                    <p>Contenido en desarrollo...</p>
                  </div>
                )}
                
                {m4SubTab === 'simulador' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 text-center text-slate-400 py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-2">EL RETO</h2>
                    <p>Contenido en desarrollo...</p>
                  </div>
                )}
                
                {m4SubTab === 'cierre' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 text-center text-slate-400 py-20 border-2 border-dashed border-slate-800 rounded-2xl">
                    <h2 className="text-2xl font-black uppercase tracking-widest mb-2">CIERRE Y METACOGNICIÓN</h2>
                    <p>Contenido en desarrollo...</p>
                  </div>
                )}
              </div>
            </div>

          )}
        </div>
      )}

    </div>
  );
}
