import React, { useState, useEffect, useCallback, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import {
  ChevronRight, Play, Trophy, AlertTriangle, Map, Key, Skull, Target, Crosshair,
  Crown, MonitorPlay, ShieldAlert, Scroll, Shield, Flame,
  Wand2, Compass, CheckCircle2, Users, Settings, Plus, X, Sparkles, UserPlus, BookOpen, Globe,
  Music, Volume2, Eye, Zap, RefreshCw, Scale, Hourglass, Loader2, Gamepad2, GraduationCap, Hexagon, Layers,
  Swords, Heart, Timer, Pause, RotateCcw
} from 'lucide-react';
import { clansData, unassignedStudentsDB, defaultRoster, defaultScores, pectoralStones, casosTribunal } from './data.jsx';
import { db } from './firebase.js';
import { doc, onSnapshot, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

// ─── CONSTANTES INTERNAS ULTRA-SEGURAS (PREVIENE PANTALLAS BLANCAS) ─────
const INTERNAL_CLANS_DATA = [
  { id: 'c1', name: 'Leones de Judá', attribute: 'Autoridad y Liderazgo', color: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-950/30', hero: 'David y Judá', symbol: 'El Cetro Real y el León', lema: '"De nosotros viene el cetro."', icon: <Shield className="w-8 h-8 text-amber-500"/> },
  { id: 'c2', name: 'Águilas de Isaías', attribute: 'Visión y Profecía', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-950/30', hero: 'Isaías y el Remanente', symbol: 'El Carbón y las Alas', lema: '"Vemos lo que está por venir."', icon: <Eye className="w-8 h-8 text-blue-400"/> },
  { id: 'c3', name: 'Guerreros de Josué', attribute: 'Valor y Conquista', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/30', hero: 'Josué y Caleb', symbol: 'Trompetas y Espada', lema: '"Ni un paso atrás."', icon: <Swords className="w-8 h-8 text-red-500"/> },
  { id: 'c4', name: 'Sabios de Salomón', attribute: 'Sabiduría y Discernimiento', color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/30', hero: 'Salomón', symbol: 'El Manuscrito', lema: '"La mente sobre la espada."', icon: <Scroll className="w-8 h-8 text-purple-400"/> },
  { id: 'c5', name: 'Centinelas de Nehemías', attribute: 'Restauración y Vigilancia', color: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-950/30', hero: 'Nehemías', symbol: 'La Lanza y la Cuchara', lema: '"Reconstruimos las ruinas."', icon: <ShieldAlert className="w-8 h-8 text-orange-500"/> },
  { id: 'c6', name: 'Valientes de David', attribute: 'Lealtad y Sacrificio', color: 'text-green-500', border: 'border-green-500/50', bg: 'bg-green-950/30', hero: 'Los Tres Valientes', symbol: 'Honda y Vasija', lema: '"Hasta la última gota."', icon: <Target className="w-8 h-8 text-green-500"/> },
  { id: 'c7', name: 'Llamas de Elías', attribute: 'Celo y Fuego Divino', color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/30', hero: 'Elías el Tesbita', symbol: 'El Altar en Fuego', lema: '"Que el fuego responda."', icon: <Flame className="w-8 h-8 text-cyan-400"/> }
];

const INTERNAL_PECTORAL_STONES = [
  { id: 'p1', tribu: 'JUDÁ', piedra: 'SARDO', color: 'bg-red-600', palabra: 'ALABANZA', pista: '"Brota de los labios cuando el corazón rebosa de gratitud a Dios."' },
  { id: 'p2', tribu: 'ISACAR', piedra: 'TOPACIO', color: 'bg-yellow-600', palabra: 'RECOMPENSA', pista: '"El fruto del esfuerzo, la paga del jornalero fiel."' },
  { id: 'p3', tribu: 'ZABULÓN', piedra: 'CARBUNCLO', color: 'bg-red-800', palabra: 'REFUGIO', pista: '"Puerto seguro para los barcos en medio de la tormenta."' },
  { id: 'p4', tribu: 'RUBÉN', piedra: 'ESMERALDA', color: 'bg-green-700', palabra: 'VISION', pista: '"Lo que el primogénito debe tener para guiar a sus hermanos."' },
  { id: 'p5', tribu: 'SIMEÓN', piedra: 'ZAFIRO', color: 'bg-blue-600', palabra: 'ESCUCHAR', pista: '"El primer paso para obedecer a Dios."' },
  { id: 'p6', tribu: 'GAD', piedra: 'DIAMANTE', color: 'bg-slate-300', palabra: 'VICTORIA', pista: '"El resultado final cuando un escuadrón confía en Yahveh."' },
  { id: 'p7', tribu: 'EFRAÍN', piedra: 'JACINTO', color: 'bg-orange-500', palabra: 'FRUCTIFERO', pista: '"Un árbol plantado junto a corrientes de agua."' },
  { id: 'p8', tribu: 'MANASÉS', piedra: 'ÁGATA', color: 'bg-slate-600', palabra: 'OLVIDO', pista: '"Lo que Dios hace con nuestros pecados cuando nos perdona."' },
  { id: 'p9', tribu: 'BENJAMÍN', piedra: 'AMATISTA', color: 'bg-purple-500', palabra: 'PROTECCION', pista: '"El hijo amado descansa seguro entre los hombros del Padre."' },
  { id: 'p10', tribu: 'DAN', piedra: 'BERILO', color: 'bg-teal-300', palabra: 'JUSTICIA', pista: '"Lo que debe reinar en el tribunal para que haya paz."' },
  { id: 'p11', tribu: 'ASER', piedra: 'ÓNICE', color: 'bg-gray-800', palabra: 'BENDICION', pista: '"El pan abundante y las delicias de un rey."' },
  { id: 'p12', tribu: 'NEFTALÍ', piedra: 'JASPE', color: 'bg-amber-400', palabra: 'LIBERTAD', pista: '"Una cierva suelta que pronuncia palabras hermosas."' }
];

const INTERNAL_CASOS_TRIBUNAL = [
  { id: 1, titulo: "LA FUERZA DESBORDADA", descripcion: "\"El alumno más brillante de su clan hace todo el trabajo solo en 1 minuto y no deja que nadie más participe.\"", tipo: "NIVEL 1", exigencia: "Relacionen esta actitud con el EGO de Gedeón. Defiendan: ¿Por qué el talento debe servir al equipo y no al ego personal?", juez_asociado: "Gedeón (Jueces 7)", pregunta: "¿Debe el talentoso hacer el trabajo solo para asegurar la buena nota del grupo, o arriesgarse a una nota menor enseñando a los demás?" },
  { id: 2, titulo: "EL VOTO ABSURDO", descripcion: "\"En desesperación, un líder de clan grita: '¡Si nos ayudas a ganar, te daremos todas nuestras notas!'.\"", tipo: "NIVEL 1", exigencia: "Como Jefté, hicieron una promesa ignorante. Defiendan: ¿Por qué un líder debe controlar sus emociones antes de hablar?", juez_asociado: "Jefté (Jueces 11)", pregunta: "¿Por qué un líder debe controlar sus palabras y emociones antes de comprometer al clan?" },
  { id: 3, titulo: "EL NARCISISTA", descripcion: "\"Un estudiante con gran habilidad se burla de los más débiles de su clan, creyéndose superior.\"", tipo: "NIVEL 1", exigencia: "Como Sansón, su fuerza lo ciega moralmente. Propongan una defensa oral sobre la humildad en el salón.", juez_asociado: "Sansón (Jueces 16)", pregunta: "¿Debe el clan apoyar a su líder por lealtad, o confrontarlo aunque eso les reste popularidad?" },
  { id: 4, titulo: "LA GUERRA CIVIL", descripcion: "\"Dos clanes del mismo salón empiezan a sabotearse e insultarse para ver quién gana.\"", tipo: "NIVEL 1", exigencia: "Al final de Jueces, las tribus se mataron entre sí. Defiendan una postura de convivencia pacífica inter-clanes.", juez_asociado: "Jueces 19-21", pregunta: "¿Cómo superar la rivalidad destructiva para defender el bien común del aula?" },
  { id: 5, titulo: "ÍDOLOS FALSOS", descripcion: "\"Un alumno popular sugiere copiarse en el examen, y todos le siguen la corriente ciegamente.\"", tipo: "NIVEL 1", exigencia: "Israel adoraba ídolos por presión social. Defiendan: ¿Cómo actuar con integridad frente a la mala influencia?", juez_asociado: "Jueces 2", pregunta: "¿Cómo actuar con integridad frente a la mala influencia del grupo?" },
  { id: 6, titulo: "EL BOTÍN DE GUERRA", descripcion: "\"Alguien esconde los útiles de un compañero de otro clan como 'broma', causando angustia.\"", tipo: "NIVEL 1", exigencia: "El robo destruye la paz. Defiendan el respeto a la propiedad ajena y la empatía en el aula.", juez_asociado: "Jueces 18", pregunta: "¿Por qué el respeto mutuo debe estar por encima de bromas de mal gusto?" },
  { id: 7, titulo: "SILENCIO CÓMPLICE", descripcion: "\"Un miembro de su clan sufre burlas, y el resto solo mira hacia otro lado por miedo a involucrarse.\"", tipo: "NIVEL 1", exigencia: "La opresión avanzaba cuando nadie clamaba. Defiendan por qué el clan debe proteger al más débil.", juez_asociado: "Débora (Jueces 4)", pregunta: "¿Qué estudiante debe dar el primer paso para proteger al que sufre burlas?" },
  { id: 8, titulo: "LA VENGANZA DE SANSÓN", descripcion: "\"Alguien ofendió a su clan, y planean arruinar el trabajo del otro equipo en represalia.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Sansón destruyó campos por venganza. Defiendan: ¿Cuál es el camino superior a la venganza en el colegio?", juez_asociado: "Sansón (Jueces 15)", pregunta: "¿Cuál es el camino superior a la venganza en la convivencia escolar?" },
  { id: 9, titulo: "EL LIDERAZGO TÓXICO", descripcion: "\"El líder de clan amenaza: 'O hacen lo que digo, o le digo al profesor que no trabajaron para que les ponga cero'.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Ese es el dominio del tirano. Defiendan: ¿Qué atributos de servicio debe tener un líder positivo?", juez_asociado: "Abimelec (Jueces 9)", pregunta: "¿Qué atributos de servicio distinguen al verdadero líder del tirano?" },
  { id: 10, titulo: "ALIANZAS PELIGROSAS", descripcion: "\"Su clan decide no hablarle a los que no tienen sus mismos gustos, creando un grupo elitista.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Israel pactó con quienes no debía. Defiendan una postura radical sobre la inclusión.", juez_asociado: "Jueces 1", pregunta: "¿Por qué la inclusión y la fraternidad deben prevalecer sobre el elitismo?" },
  { id: 11, titulo: "EL HÉROE CANSADO", descripcion: "\"El único que trabaja se cansa y dice: 'Ya no hago nada, que reprueben todos', dejando que el caos los consuma.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Aunque Gedeón se cansó, siguió luchando. Defiendan: ¿Cómo se fomenta la corresponsabilidad?", juez_asociado: "Gedeón (Jueces 8)", pregunta: "¿Cómo restaurar el compromiso mutuo antes de que el grupo colapse?" },
  { id: 12, titulo: "LA CAÍDA DEL ALTAR", descripcion: "\"Durante la oración o un momento serio de la clase, miembros de su clan sabotean el respeto del aula.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Profanar lo sagrado era el primer paso al caos. Defiendan por qué salvaguardar el respeto es vital.", juez_asociado: "Gedeón (Jueces 6)", pregunta: "¿Por qué el respeto a lo sagrado y a los momentos solemnes es innegociable?" },
  { id: 13, titulo: "ANARQUÍA TOTAL", descripcion: "\"El profesor sale un minuto, y el salón estalla en caos. 'Cada quien hace lo que le parece'.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Defiendan: ¿Por qué la verdadera disciplina es la que se mantiene cuando la autoridad NO está mirando?", juez_asociado: "Jueces 21:25", pregunta: "¿Por qué la integridad y el autocontrol valen más que la vigilancia externa?" },
  { id: 14, titulo: "EL TRIBUNAL FINAL", descripcion: "\"Un clan acusa falsamente a otro de hacer trampa solo para que les quiten puntos y ganar ellos.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "El falso testimonio destruye la justicia. Defiendan el honor absoluto y las consecuencias de la mentira.", juez_asociado: "Moisés y Jueces", pregunta: "¿Por qué la verdad y el honor deben guiar todas nuestras acciones?" }
];

const safeClansData = (Array.isArray(clansData) && clansData.length >= 7) ? clansData : INTERNAL_CLANS_DATA;
const safePectoralStones = (Array.isArray(pectoralStones) && pectoralStones.length >= 12) ? pectoralStones : INTERNAL_PECTORAL_STONES;
const safeCasosTribunal = (Array.isArray(casosTribunal) && casosTribunal.length >= 14) ? casosTribunal : INTERNAL_CASOS_TRIBUNAL;



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



// ═══════════════════════════════════════════════════════════════
// ── MODO SOLO: SUPER MARIO BROS BÍBLICO (MULTIVERSO COMPLETO) ─────
// ═══════════════════════════════════════════════════════════════

// Sintetizador de audio retro Web Audio API (Sin dependencias externas, 100% compatible)
const playRetroSound = (type) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'jump') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.14);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'coin') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, ctx.currentTime);
      osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'hit') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.28);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === 'win') {
      const notes = [330, 392, 523, 659, 784, 1046];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        g.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.2);
        o.start(ctx.currentTime + idx * 0.08);
        o.stop(ctx.currentTime + idx * 0.08 + 0.2);
      });
    }
  } catch (e) {
    // Audio context bloqueado hasta interacción del usuario
  }
};

// ─── COLECCIÓN OFICIAL DE CARTAS DEL ANTIGUO TESTAMENTO (TCG BÍBLICO) ────────
// ─── 50 CARTAS BÍBLICAS DE COLECCIÓN ESTILO YU-GI-OH! ───────────────────────
export const biblicalCardsDB = [
  // ── PATRIARCAS Y EL PACTO ORIGINAL (GÉNESIS) ──
  {
    id: "card_01",
    name: "Abraham, Padre de las Naciones",
    category: "PATRIARCAS",
    rarity: "MÍTICA DIVINA",
    stars: 12,
    attribute: "DIVINO",
    attributeIcon: "🌟",
    cardType: "DIVINIDAD ANCESTRAL",
    monsterType: "[PATRIARCA / PACTO / EFECTO]",
    atk: 4000,
    def: 4000,
    frameStyle: "divine",
    badgeColor: "bg-amber-400 text-black font-black",
    gradient: "from-amber-600 via-yellow-500 to-amber-900",
    border: "border-yellow-300",
    glow: "shadow-[0_0_40px_rgba(250,204,21,0.8)]",
    icon: "🌌",
    pasaje: "Génesis 15:5",
    clanXP: 350,
    quote: "«Mira ahora los cielos y cuenta las estrellas... Así será tu descendencia. Y creyó a Yahveh.»",
    effectName: "[PACTO ETERNO INQUEBRANTABLE]",
    power: "La fe que desafía imposibles. Otorga bendición suprema y multiplica el puntaje del equipo.",
    serialCode: "ODISEA-ES001"
  },
  {
    id: "card_02",
    name: "Isaac en el Monte Moriah",
    category: "PATRIARCAS",
    rarity: "ULTRA RARA",
    stars: 8,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[HEREDERO / OBEDIENCIA / EFECTO]",
    atk: 2800,
    def: 3000,
    frameStyle: "effect",
    badgeColor: "bg-yellow-500 text-black font-black",
    gradient: "from-amber-500 via-yellow-600 to-amber-950",
    border: "border-yellow-400",
    glow: "shadow-[0_0_30px_rgba(234,179,8,0.7)]",
    icon: "🐑",
    pasaje: "Génesis 22:8",
    clanXP: 180,
    quote: "«Dios proveerá de cordero para el holocausto, hijo mío. Y fueron ambos juntos.»",
    effectName: "[PROVISIÓN DE MORIAH]",
    power: "Obediencia incondicional. Transforma situaciones de pérdida en rescate providencial.",
    serialCode: "ODISEA-ES002"
  },
  {
    id: "card_03",
    name: "Jacob y la Lucha de Peniel",
    category: "PATRIARCAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[TRANSFORMADOR / LUCHADOR / EFECTO]",
    atk: 3300,
    def: 2900,
    frameStyle: "effect",
    badgeColor: "bg-emerald-400 text-black font-black",
    gradient: "from-emerald-600 via-teal-700 to-emerald-950",
    border: "border-emerald-300",
    glow: "shadow-[0_0_35px_rgba(52,211,153,0.7)]",
    icon: "🤼",
    pasaje: "Génesis 32:26",
    clanXP: 260,
    quote: "«No te dejaré, si no me bendices... No se dirá más tu nombre Jacob, sino Israel.»",
    effectName: "[VENCEDOR DEL VADO]",
    power: "Perseverancia ante la adversidad. Cambia identidades derrotadas por linaje de príncipes.",
    serialCode: "ODISEA-ES003"
  },
  {
    id: "card_04",
    name: "José el Soñador y Señor de Egipto",
    category: "PATRIARCAS",
    rarity: "SECRETA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[ESTRATEGA / PERDÓN / EFECTO]",
    atk: 3100,
    def: 3400,
    frameStyle: "effect",
    badgeColor: "bg-cyan-400 text-black font-black",
    gradient: "from-cyan-600 via-blue-700 to-cyan-950",
    border: "border-cyan-300",
    glow: "shadow-[0_0_35px_rgba(34,211,238,0.7)]",
    icon: "🌾",
    pasaje: "Génesis 50:20",
    clanXP: 250,
    quote: "«Vosotros pensasteis mal contra mí, mas Dios lo encaminó a bien, para salvar a mucho pueblo.»",
    effectName: "[RECONCILIACIÓN DEL NILO]",
    power: "Supera la envidia y el resentimiento, convirtiendo traiciones en salvación colectiva.",
    serialCode: "ODISEA-ES004"
  },
  {
    id: "card_05",
    name: "Melquisedec, Rey de Salem y Sacerdote",
    category: "PATRIARCAS",
    rarity: "MÍTICA DIVINA",
    stars: 12,
    attribute: "DIVINO",
    attributeIcon: "🌟",
    cardType: "DIVINIDAD ANCESTRAL",
    monsterType: "[SUMO SACERDOTE / ETERNO / EFECTO]",
    atk: 4200,
    def: 4200,
    frameStyle: "divine",
    badgeColor: "bg-amber-300 text-black font-black",
    gradient: "from-amber-400 via-yellow-600 to-amber-950",
    border: "border-yellow-200",
    glow: "shadow-[0_0_50px_rgba(253,224,71,0.9)]",
    icon: "🍞",
    pasaje: "Génesis 14:18",
    clanXP: 380,
    quote: "«Melquisedec rey de Salem sacó pan y vino; y era sacerdote del Dios Altísimo.»",
    effectName: "[ORDEN DE LA PAZ ETERNA]",
    power: "Bendición del Altísimo. Neutraliza todo conflicto y restablece el orden sacerdotal cósmico.",
    serialCode: "ODISEA-ES005"
  },
  {
    id: "card_06",
    name: "Enoc, El que Caminó con Dios",
    category: "PATRIARCAS",
    rarity: "ULTRA RARA",
    stars: 8,
    attribute: "VIENTO",
    attributeIcon: "🌪️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[MÍSTICO / INMORTAL / EFECTO]",
    atk: 2500,
    def: 3500,
    frameStyle: "effect",
    badgeColor: "bg-sky-400 text-black font-black",
    gradient: "from-sky-600 via-indigo-700 to-sky-950",
    border: "border-sky-300",
    glow: "shadow-[0_0_30px_rgba(56,189,248,0.7)]",
    icon: "☁️",
    pasaje: "Génesis 5:24",
    clanXP: 190,
    quote: "«Caminó, pues, Enoc con Dios, y desapareció, porque le llevó Dios.»",
    effectName: "[ARREBATO DE INTIMIDAD]",
    power: "Comunión espiritual total. Evita derrotas críticas protegiendo el alma del clan.",
    serialCode: "ODISEA-ES006"
  },
  {
    id: "card_07",
    name: "Judá y la Promesa del Cetro",
    category: "PATRIARCAS",
    rarity: "SÚPER RARA",
    stars: 7,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[LEÓN / PROTECTOR / EFECTO]",
    atk: 2700,
    def: 2300,
    frameStyle: "effect",
    badgeColor: "bg-red-500 text-white font-black",
    gradient: "from-red-600 via-amber-700 to-red-950",
    border: "border-red-400",
    glow: "shadow-[0_0_25px_rgba(239,68,68,0.6)]",
    icon: "🦁",
    pasaje: "Génesis 49:10",
    clanXP: 120,
    quote: "«No será quitado el cetro de Judá, ni el legislador de entre sus pies, hasta que venga Siloh.»",
    effectName: "[RUGIDO DE LA TRIBU REAL]",
    power: "Se ofrece a sí mismo como garantía por el hermano débil (intercesión de liderazgo).",
    serialCode: "ODISEA-ES007"
  },

  // ── EL ÉXODO Y EL TABERNÁCULO (MISIÓN 1) ──
  {
    id: "card_08",
    name: "Moisés y las Tablas del Sinaí",
    category: "LÍDERES",
    rarity: "MÍTICA DIVINA",
    stars: 12,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[LEGISLADOR / LIBERTADOR / EFECTO]",
    atk: 3900,
    def: 3800,
    frameStyle: "divine",
    badgeColor: "bg-yellow-400 text-black font-black",
    gradient: "from-amber-500 via-yellow-600 to-amber-950",
    border: "border-yellow-300",
    glow: "shadow-[0_0_45px_rgba(250,204,21,0.8)]",
    icon: "📜",
    pasaje: "Éxodo 20:1-3",
    clanXP: 360,
    quote: "«Habló Dios todas estas palabras... No tendrás dioses ajenos delante de mí.»",
    effectName: "[DIEZ PALABRAS DE FUEGO]",
    power: "Autoridad moral inquebrantable. Disuelve cualquier injusticia o rebelión en el aula.",
    serialCode: "ODISEA-ES008"
  },
  {
    id: "card_09",
    name: "Aarón con el Pectoral del Juicio",
    category: "LÍDERES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[SUMO SACERDOTE / MEDIADOR / EFECTO]",
    atk: 2900,
    def: 3600,
    frameStyle: "effect",
    badgeColor: "bg-purple-400 text-black font-black",
    gradient: "from-purple-600 via-indigo-700 to-purple-950",
    border: "border-purple-300",
    glow: "shadow-[0_0_35px_rgba(192,132,252,0.7)]",
    icon: "💎",
    pasaje: "Éxodo 28:29",
    clanXP: 210,
    quote: "«Llevará Aarón los nombres de los hijos de Israel en el pectoral del juicio sobre su corazón.»",
    effectName: "[INTERCESIÓN DE LAS 12 GEMAS]",
    power: "Lleva sobre su pecho a todo el salón. Impide que un compañero sea marginado.",
    serialCode: "ODISEA-ES009"
  },
  {
    id: "card_10",
    name: "Miriam y el Cántico del Mar Rojo",
    category: "HEROÍNAS",
    rarity: "SÚPER RARA",
    stars: 7,
    attribute: "AGUA",
    attributeIcon: "💧",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PROFETISA / ALABANZA / EFECTO]",
    atk: 2400,
    def: 2600,
    frameStyle: "effect",
    badgeColor: "bg-teal-400 text-black font-black",
    gradient: "from-teal-600 via-cyan-700 to-teal-950",
    border: "border-teal-300",
    glow: "shadow-[0_0_25px_rgba(45,212,191,0.6)]",
    icon: "🪘",
    pasaje: "Éxodo 15:20-21",
    clanXP: 130,
    quote: "«Cantad a Yahveh, porque en extremo se ha engrandecido; caballo y jinete echó en el mar.»",
    effectName: "[PANDERO DE LA LIBERTAD]",
    power: "Infunde ánimo y entusiasmo cuando el equipo siente fatiga o desaliento.",
    serialCode: "ODISEA-ES010"
  },
  {
    id: "card_11",
    name: "Bezaleel, Maestro Artífice del Santuario",
    category: "LÍDERES",
    rarity: "SÚPER RARA",
    stars: 7,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[ARTESANO / SABIDURÍA / EFECTO]",
    atk: 2200,
    def: 2800,
    frameStyle: "effect",
    badgeColor: "bg-amber-500 text-black font-black",
    gradient: "from-amber-600 via-orange-700 to-amber-950",
    border: "border-amber-400",
    glow: "shadow-[0_0_25px_rgba(245,158,11,0.6)]",
    icon: "🔨",
    pasaje: "Éxodo 31:3",
    clanXP: 125,
    quote: "«Lo he llenado del Espíritu de Dios, en sabiduría, inteligencia y en todo arte.»",
    effectName: "[FORJA DEL TABERNÁCULO]",
    power: "Excelencia y creatividad en trabajos prácticos, cuadernos y representaciones.",
    serialCode: "ODISEA-ES011"
  },
  {
    id: "card_12",
    name: "Hur y Aarón Sosteniendo los Brazos",
    category: "LÍDERES",
    rarity: "RARA",
    stars: 6,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[COMPAÑEROS / SOPORTE / EFECTO]",
    atk: 1800,
    def: 3200,
    frameStyle: "effect",
    badgeColor: "bg-blue-400 text-black font-black",
    gradient: "from-blue-600 via-indigo-700 to-blue-950",
    border: "border-blue-300",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.5)]",
    icon: "🤝",
    pasaje: "Éxodo 17:12",
    clanXP: 90,
    quote: "«Y Aarón y Hur sostenían sus manos, el uno de un lado y el otro del otro; así hubo firmeza.»",
    effectName: "[BASTIÓN DE APOYO SOLIDARIO]",
    power: "Sostiene al líder cuando flaquea, asegurando la victoria grupal en Refidim.",
    serialCode: "ODISEA-ES012"
  },

  // ── LA ERA DE LOS JUECES Y LA CONQUISTA (MISIÓN 2) ──
  {
    id: "card_13",
    name: "Josué, Comandante del Jordán",
    category: "JUECES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[GUERRERO / GENERAL / EFECTO]",
    atk: 3400,
    def: 2800,
    frameStyle: "effect",
    badgeColor: "bg-orange-400 text-black font-black",
    gradient: "from-orange-600 via-amber-700 to-orange-950",
    border: "border-orange-300",
    glow: "shadow-[0_0_35px_rgba(251,146,60,0.7)]",
    icon: "⚔️",
    pasaje: "Josué 1:9",
    clanXP: 220,
    quote: "«Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes.»",
    effectName: "[DERRIBO DE JERICÓ]",
    power: "Valentía estratégica sin miedo a los gigantes de Canaán.",
    serialCode: "ODISEA-ES013"
  },
  {
    id: "card_14",
    name: "Caleb, El Guerrero de 85 Años",
    category: "JUECES",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[VETERANO / FE / EFECTO]",
    atk: 2900,
    def: 2700,
    frameStyle: "effect",
    badgeColor: "bg-lime-400 text-black font-black",
    gradient: "from-lime-600 via-emerald-700 to-lime-950",
    border: "border-lime-300",
    glow: "shadow-[0_0_25px_rgba(163,230,53,0.6)]",
    icon: "🏔️",
    pasaje: "Josué 14:12",
    clanXP: 140,
    quote: "«Dame, pues, ahora este monte... aunque haya allí anaceos y ciudades grandes y fuertes.»",
    effectName: "[CONQUISTA DE HEBRÓN]",
    power: "Pide el reto más difícil sin quejarse y lo conquista con paciencia y fe.",
    serialCode: "ODISEA-ES014"
  },
  {
    id: "card_15",
    name: "Débora, Jueza y Madre de Israel",
    category: "HEROÍNAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "JUSTICIA",
    attributeIcon: "⚖️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[JUEZA / ESTRATEGA / EFECTO]",
    atk: 3200,
    def: 3300,
    frameStyle: "effect",
    badgeColor: "bg-fuchsia-400 text-black font-black",
    gradient: "from-fuchsia-600 via-pink-700 to-fuchsia-950",
    border: "border-fuchsia-300",
    glow: "shadow-[0_0_35px_rgba(232,121,249,0.7)]",
    icon: "⚖️",
    pasaje: "Jueces 5:7",
    clanXP: 270,
    quote: "«Las aldeas quedaron abandonadas, hasta que yo Débora me levanté como madre en Israel.»",
    effectName: "[JUICIO BAJO LA PALMERA]",
    power: "Sabiduría para dirimir disputas y audacia militar en la batalla del monte Tabor.",
    serialCode: "ODISEA-ES015"
  },
  {
    id: "card_16",
    name: "Gedeón y los 300 con Cántaros",
    category: "JUECES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[GUERRERO / DISCIPLINA / EFECTO]",
    atk: 3100,
    def: 2600,
    frameStyle: "effect",
    badgeColor: "bg-amber-400 text-black font-black",
    gradient: "from-amber-600 via-red-700 to-amber-950",
    border: "border-amber-300",
    glow: "shadow-[0_0_30px_rgba(251,191,36,0.7)]",
    icon: "🏺",
    pasaje: "Jueces 7:20",
    clanXP: 200,
    quote: "«Tocaron las trompetas, quebraron los cántaros y gritaron: ¡Por Yahveh y por Gedeón!»",
    effectName: "[TEAS DE LA FUENTE DE HAROD]",
    power: "Demuestra que la lealtad de un grupo pequeño y disciplinado vence a multitudes caóticas.",
    serialCode: "ODISEA-ES016"
  },
  {
    id: "card_17",
    name: "Sansón, Fuerza del Espíritu",
    category: "JUECES",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[NAZAREO / FUERZA / EFECTO]",
    atk: 3600,
    def: 1800,
    frameStyle: "effect",
    badgeColor: "bg-red-400 text-white font-black",
    gradient: "from-red-600 via-rose-700 to-red-950",
    border: "border-red-300",
    glow: "shadow-[0_0_30px_rgba(248,113,113,0.7)]",
    icon: "🦁",
    pasaje: "Jueces 15:14",
    clanXP: 150,
    quote: "«El Espíritu de Yahveh vino sobre él, y las cuerdas se cayeron de sus brazos como lino.»",
    effectName: "[DERRIBO DE COLUMNAS]",
    power: "Poder colosal en momentos críticos, advirtiendo sobre el peligro del ego sin dominio propio.",
    serialCode: "ODISEA-ES017"
  },
  {
    id: "card_18",
    name: "Samuel, El Profeta que Escuchó",
    category: "JUECES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[JUEZ / PROFETA / EFECTO]",
    atk: 2700,
    def: 3300,
    frameStyle: "effect",
    badgeColor: "bg-indigo-400 text-white font-black",
    gradient: "from-indigo-600 via-blue-700 to-indigo-950",
    border: "border-indigo-300",
    glow: "shadow-[0_0_35px_rgba(129,140,248,0.7)]",
    icon: "🕯️",
    pasaje: "1 Samuel 3:10",
    clanXP: 215,
    quote: "«Habló, pues, Samuel: Habla, porque tu siervo oye.»",
    effectName: "[VOZ EN EL SANTUARIO DE SILO]",
    power: "Atención y obediencia inmediata. Transición impecable del caos de los jueces al orden real.",
    serialCode: "ODISEA-ES018"
  },

  // ── REYES DE ISRAEL Y GUERREROS (MISIÓN 3) ──
  {
    id: "card_19",
    name: "David, Vencedor de Goliat",
    category: "REYES",
    rarity: "MÍTICA DIVINA",
    stars: 11,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[REY UNGIDO / PASTOR / EFECTO]",
    atk: 3800,
    def: 3500,
    frameStyle: "divine",
    badgeColor: "bg-yellow-400 text-black font-black",
    gradient: "from-amber-500 via-yellow-600 to-amber-950",
    border: "border-yellow-300",
    glow: "shadow-[0_0_45px_rgba(250,204,21,0.8)]",
    icon: "👑",
    pasaje: "1 Samuel 17:45",
    clanXP: 340,
    quote: "«Tú vienes a mí con espada y lanza; mas yo vengo a ti en el nombre de Yahveh de los ejércitos.»",
    effectName: "[HONDA DEL VALLE DE ELA]",
    power: "Vence al opresor arrogante confiando únicamente en el respaldo del Todopoderoso.",
    serialCode: "ODISEA-ES019"
  },
  {
    id: "card_20",
    name: "David y el Arpa que Calma Demonios",
    category: "REYES",
    rarity: "SÚPER RARA",
    stars: 7,
    attribute: "AGUA",
    attributeIcon: "💧",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[SALMISTA / ADORADOR / EFECTO]",
    atk: 2100,
    def: 2900,
    frameStyle: "effect",
    badgeColor: "bg-sky-400 text-black font-black",
    gradient: "from-sky-600 via-blue-700 to-sky-950",
    border: "border-sky-300",
    glow: "shadow-[0_0_25px_rgba(56,189,248,0.6)]",
    icon: "🎵",
    pasaje: "1 Samuel 16:23",
    clanXP: 135,
    quote: "«David tomaba el arpa y tocaba con su mano; y Saúl tenía alivio y estaba mejor.»",
    effectName: "[SALMO DE LA PAZ PROFUNDA]",
    power: "Calma la ira, el estrés del aula y restaura la armonía en momentos de conflicto.",
    serialCode: "ODISEA-ES020"
  },
  {
    id: "card_21",
    name: "Salomón y el Juicio de Sabiduría",
    category: "REYES",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "JUSTICIA",
    attributeIcon: "⚖️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[MONARCA / SABIDURÍA / EFECTO]",
    atk: 3000,
    def: 3700,
    frameStyle: "effect",
    badgeColor: "bg-amber-300 text-black font-black",
    gradient: "from-amber-500 via-yellow-600 to-amber-950",
    border: "border-amber-200",
    glow: "shadow-[0_0_40px_rgba(252,211,77,0.8)]",
    icon: "🏛️",
    pasaje: "1 Reyes 3:28",
    clanXP: 280,
    quote: "«Y todo Israel oyó aquel juicio que había dado el rey; y temieron al rey, porque vieron que había en él sabiduría de Dios.»",
    effectName: "[CORAZÓN ENTENDIDO]",
    power: "Resuelve dilemas éticos complejos identificando siempre la verdad oculta tras el egoísmo.",
    serialCode: "ODISEA-ES021"
  },
  {
    id: "card_22",
    name: "Jonatán y el Pacto del Alma",
    category: "REYES",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PRÍNCIPE / LEALTAD / EFECTO]",
    atk: 2800,
    def: 2600,
    frameStyle: "effect",
    badgeColor: "bg-violet-400 text-black font-black",
    gradient: "from-violet-600 via-purple-700 to-violet-950",
    border: "border-violet-300",
    glow: "shadow-[0_0_25px_rgba(167,139,250,0.6)]",
    icon: "🏹",
    pasaje: "1 Samuel 18:3",
    clanXP: 145,
    quote: "«E hicieron pacto Jonatán y David, porque él le amaba como a su propia alma.»",
    effectName: "[FLECHAS DEL DESPRENDIMIENTO]",
    power: "Lealtad por encima de la ambición. Entrega su manto y arco para proteger al amigo legítimo.",
    serialCode: "ODISEA-ES022"
  },
  {
    id: "card_23",
    name: "Josafat y el Ejército que Alababa",
    category: "REYES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[REY / CÁNTICO / EFECTO]",
    atk: 2900,
    def: 3300,
    frameStyle: "effect",
    badgeColor: "bg-blue-300 text-black font-black",
    gradient: "from-blue-600 via-cyan-700 to-blue-950",
    border: "border-blue-200",
    glow: "shadow-[0_0_30px_rgba(147,197,253,0.7)]",
    icon: "🎺",
    pasaje: "2 Crónicas 20:21",
    clanXP: 210,
    quote: "«Puso a algunos que cantasen y alabasen a Yahveh vestidos de ornamentos sagrados... y el enemigo se destruyó entre sí.»",
    effectName: "[BATALLA DEL VALLE DE BERACA]",
    power: "Gana batallas colocando la adoración y la gratitud por delante de las armas materiales.",
    serialCode: "ODISEA-ES023"
  },
  {
    id: "card_24",
    name: "Ezequías y la Oración en el Templo",
    category: "REYES",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[REFORMADOR / ORACIÓN / EFECTO]",
    atk: 2600,
    def: 3100,
    frameStyle: "effect",
    badgeColor: "bg-emerald-400 text-black font-black",
    gradient: "from-emerald-600 via-teal-700 to-emerald-950",
    border: "border-emerald-300",
    glow: "shadow-[0_0_25px_rgba(52,211,153,0.6)]",
    icon: "✉️",
    pasaje: "2 Reyes 19:14",
    clanXP: 155,
    quote: "«Tomó Ezequías las cartas de mano de los mensajeros... y las extendió delante de Yahveh.»",
    effectName: "[EXPANSIÓN DE LAS CARTAS ASIRIAS]",
    power: "Lleva las cartas intimidantes del enemigo directamente ante Dios para anular amenazas.",
    serialCode: "ODISEA-ES024"
  },
  {
    id: "card_25",
    name: "Josías y el Hallazgo de la Ley",
    category: "REYES",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "JUSTICIA",
    attributeIcon: "⚖️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[JOVEN REY / REFORMA / EFECTO]",
    atk: 3000,
    def: 3000,
    frameStyle: "effect",
    badgeColor: "bg-rose-400 text-black font-black",
    gradient: "from-rose-600 via-red-700 to-rose-950",
    border: "border-rose-300",
    glow: "shadow-[0_0_30px_rgba(251,113,133,0.7)]",
    icon: "📜",
    pasaje: "2 Reyes 22:11",
    clanXP: 220,
    quote: "«Cuando el rey oyó las palabras del libro de la ley, rasgó sus vestidos y limpió la tierra.»",
    effectName: "[PURIFICACIÓN DE JERUSALÉN]",
    power: "Sensibilidad espiritual pura. Lidera con valentía para limpiar la casa de toda hipocresía.",
    serialCode: "ODISEA-ES025"
  },
  {
    id: "card_26",
    name: "Los Tres Valientes de Belén",
    category: "REYES",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[GUERREROS / HONOR / EFECTO]",
    atk: 3200,
    def: 2500,
    frameStyle: "effect",
    badgeColor: "bg-stone-400 text-black font-black",
    gradient: "from-stone-600 via-neutral-700 to-stone-950",
    border: "border-stone-300",
    glow: "shadow-[0_0_25px_rgba(168,162,158,0.6)]",
    icon: "🏺",
    pasaje: "2 Samuel 23:16",
    clanXP: 160,
    quote: "«Irrumpieron por el campamento de los filisteos y sacaron agua del pozo de Belén para David.»",
    effectName: "[AGUA DE SACRIFICIO]",
    power: "Hazaña de devoción desinteresada que convierte sacrificios en ofrenda santa.",
    serialCode: "ODISEA-ES026"
  },

  // ── PROFETAS Y FUEGO DEL DESIERTO (MISIÓN 4) ──
  {
    id: "card_27",
    name: "Elías en el Monte Carmelo",
    category: "PROFETAS",
    rarity: "MÍTICA DIVINA",
    stars: 12,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PROFETA DE FUEGO / CELO / EFECTO]",
    atk: 4100,
    def: 3600,
    frameStyle: "divine",
    badgeColor: "bg-red-400 text-black font-black",
    gradient: "from-red-600 via-amber-600 to-red-950",
    border: "border-red-300",
    glow: "shadow-[0_0_45px_rgba(248,113,113,0.8)]",
    icon: "🔥",
    pasaje: "1 Reyes 18:38",
    clanXP: 370,
    quote: "«Entonces cayó fuego de Yahveh, y consumió el holocausto, la leña, las piedras y lamió el agua.»",
    effectName: "[FUEGO QUE CONSUME LA DUDA]",
    power: "Desafía en solitario a 450 falsos profetas y demuestra quién es el único Dios verdadero.",
    serialCode: "ODISEA-ES027"
  },
  {
    id: "card_28",
    name: "El Carro de Fuego de Elías",
    category: "RELIQUIAS",
    rarity: "SECRETA RARA",
    stars: 11,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[CARRO CELESTIAL / GLORIA / EFECTO]",
    atk: 3700,
    def: 3300,
    frameStyle: "divine",
    badgeColor: "bg-amber-400 text-black font-black",
    gradient: "from-amber-600 via-orange-600 to-amber-950",
    border: "border-amber-300",
    glow: "shadow-[0_0_40px_rgba(251,191,36,0.8)]",
    icon: "🌪️",
    pasaje: "2 Reyes 2:11",
    clanXP: 290,
    quote: "«Aconteció que... un carro de fuego con caballos de fuego apartó a los dos; y Elías subió al cielo en un torbellino.»",
    effectName: "[TORBELLINO DE ASCENSIÓN]",
    power: "Trasciende los límites humanos y transfiere doble porción de poder profético al sucesor.",
    serialCode: "ODISEA-ES028"
  },
  {
    id: "card_29",
    name: "Eliseo y la Doble Porción",
    category: "PROFETAS",
    rarity: "ULTRA RARA",
    stars: 10,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PROFETA / MILAGROS / EFECTO]",
    atk: 3300,
    def: 3500,
    frameStyle: "effect",
    badgeColor: "bg-indigo-300 text-black font-black",
    gradient: "from-indigo-600 via-violet-700 to-indigo-950",
    border: "border-indigo-200",
    glow: "shadow-[0_0_35px_rgba(165,180,252,0.7)]",
    icon: "🧥",
    pasaje: "2 Reyes 2:9",
    clanXP: 230,
    quote: "«Dijo Eliseo: Te ruego que una doble porción de tu espíritu sea sobre mí.»",
    effectName: "[MANTO QUE ABRE LAS AGUAS]",
    power: "Multiplica provisiones y purifica aguas amargas para bendecir a comunidades enteras.",
    serialCode: "ODISEA-ES029"
  },
  {
    id: "card_30",
    name: "Isaías y el Trono Celestial",
    category: "PROFETAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "DIVINO",
    attributeIcon: "🌟",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PROFETA MESIÁNICO / SANTIDAD / EFECTO]",
    atk: 3500,
    def: 3800,
    frameStyle: "effect",
    badgeColor: "bg-cyan-300 text-black font-black",
    gradient: "from-cyan-600 via-sky-700 to-cyan-950",
    border: "border-cyan-200",
    glow: "shadow-[0_0_40px_rgba(103,232,249,0.8)]",
    icon: "🦅",
    pasaje: "Isaías 6:3-8",
    clanXP: 300,
    quote: "«Santo, Santo, Santo, Yahveh de los ejércitos; toda la tierra está llena de su gloria... Heme aquí, envíame a mí.»",
    effectName: "[PURIFICACIÓN DEL CARBÓN ENCENDIDO]",
    power: "Visión del trono santo. Borra la iniquidad de la lengua y capacita para hablar con verdad.",
    serialCode: "ODISEA-ES030"
  },
  {
    id: "card_31",
    name: "Jeremías, El Vaso en Manos del Alfarero",
    category: "PROFETAS",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PROFETA LLORÓN / RESTAURACIÓN / EFECTO]",
    atk: 2500,
    def: 3200,
    frameStyle: "effect",
    badgeColor: "bg-amber-400 text-black font-black",
    gradient: "from-amber-600 via-orange-700 to-amber-950",
    border: "border-amber-300",
    glow: "shadow-[0_0_25px_rgba(251,191,36,0.6)]",
    icon: "🏺",
    pasaje: "Jeremías 18:6",
    clanXP: 165,
    quote: "«Como el barro en la mano del alfarero, así sois vosotros en mi mano, oh casa de Israel.»",
    effectName: "[RECONSTRUCCIÓN DESDE EL BARRO]",
    power: "Toma fracasos y caídas del alumno y los moldea nuevamente en vasijas de honor.",
    serialCode: "ODISEA-ES031"
  },
  {
    id: "card_32",
    name: "Ezequiel y el Valle de los Huesos Secos",
    category: "PROFETAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "VIENTO",
    attributeIcon: "🌪️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[VISIONARIO / RESURRECCIÓN / EFECTO]",
    atk: 3200,
    def: 3600,
    frameStyle: "effect",
    badgeColor: "bg-emerald-300 text-black font-black",
    gradient: "from-emerald-600 via-teal-700 to-emerald-950",
    border: "border-emerald-200",
    glow: "shadow-[0_0_40px_rgba(110,231,183,0.8)]",
    icon: "🦴",
    pasaje: "Ezequiel 37:9-10",
    clanXP: 285,
    quote: "«Ven de los cuatro vientos, oh espíritu, y sopla sobre estos muertos, y vivirán... y se pusieron en pie, un ejército grande en extremo.»",
    effectName: "[SOPLO DE RESURRECCIÓN COLECTIVA]",
    power: "Revive proyectos, materias y ánimos que se creían muertos y los convierte en un ejército firme.",
    serialCode: "ODISEA-ES032"
  },
  {
    id: "card_33",
    name: "Daniel en el Foso de los Leones",
    category: "PROFETAS",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "JUSTICIA",
    attributeIcon: "⚖️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[SABIO / INTEGRIDAD / EFECTO]",
    atk: 3100,
    def: 3700,
    frameStyle: "effect",
    badgeColor: "bg-yellow-300 text-black font-black",
    gradient: "from-yellow-600 via-amber-700 to-yellow-950",
    border: "border-yellow-200",
    glow: "shadow-[0_0_35px_rgba(253,224,71,0.7)]",
    icon: "🦁",
    pasaje: "Daniel 6:22",
    clanXP: 235,
    quote: "«Mi Dios envió su ángel, el cual cerró la boca de los leones, para que no me hiciesen daño.»",
    effectName: "[BOCA DE LEONES SELLADA]",
    power: "Integridad ante presiones sociales. No cede a burlas ni modas destructivas.",
    serialCode: "ODISEA-ES033"
  },
  {
    id: "card_34",
    name: "Los Tres Jóvenes en el Horno de Fuego",
    category: "PROFETAS",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[MÁRTIRES DE FE / INVICTOS / EFECTO]",
    atk: 3400,
    def: 3400,
    frameStyle: "effect",
    badgeColor: "bg-red-300 text-black font-black",
    gradient: "from-red-600 via-rose-700 to-red-950",
    border: "border-red-200",
    glow: "shadow-[0_0_35px_rgba(252,165,165,0.7)]",
    icon: "🔥",
    pasaje: "Daniel 3:25",
    clanXP: 240,
    quote: "«Veo cuatro varones sueltos, que se pasean en medio del fuego, y el aspecto del cuarto es semejante a hijo de los dioses.»",
    effectName: "[EL CUARTO HOMBRE EN EL FUEGO]",
    power: "Inmunidad ante pruebas abrasadoras. El compañerismo firme atrae la presencia divina.",
    serialCode: "ODISEA-ES034"
  },
  {
    id: "card_35",
    name: "Amós, Clamor por la Justicia Social",
    category: "PROFETAS",
    rarity: "RARA",
    stars: 6,
    attribute: "AGUA",
    attributeIcon: "💧",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[PASTOR / DENUNCIA / EFECTO]",
    atk: 2200,
    def: 2100,
    frameStyle: "effect",
    badgeColor: "bg-blue-300 text-black font-black",
    gradient: "from-blue-600 via-indigo-700 to-blue-950",
    border: "border-blue-200",
    glow: "shadow-[0_0_20px_rgba(147,197,253,0.5)]",
    icon: "🌊",
    pasaje: "Amós 5:24",
    clanXP: 85,
    quote: "«Pero corra el juicio como las aguas, y la justicia como impetuoso arroyo.»",
    effectName: "[TORRENTE DE EQUIDAD]",
    power: "No tolera el bullying, la discriminación ni la opresión del compañero indefenso.",
    serialCode: "ODISEA-ES035"
  },
  {
    id: "card_36",
    name: "Habacuc en la Torre de Vigía",
    category: "PROFETAS",
    rarity: "SÚPER RARA",
    stars: 7,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[VIGILANTE / FE / EFECTO]",
    atk: 2300,
    def: 2700,
    frameStyle: "effect",
    badgeColor: "bg-teal-300 text-black font-black",
    gradient: "from-teal-600 via-cyan-700 to-teal-950",
    border: "border-teal-200",
    glow: "shadow-[0_0_25px_rgba(94,234,212,0.6)]",
    icon: "🏰",
    pasaje: "Habacuc 2:4; 3:17-18",
    clanXP: 130,
    quote: "«El justo por su fe vivirá... Aunque la higuera no florezca, con todo yo me alegraré en Yahveh.»",
    effectName: "[GOZO INQUEBRANTABLE]",
    power: "Mantiene la alegría y la compostura aun cuando todo alrededor parezca salir mal.",
    serialCode: "ODISEA-ES036"
  },

  // ── HEROÍNAS SAGRADAS Y MUJERES DE FE (MISIÓN 5) ──
  {
    id: "card_37",
    name: "Rut la Moabita, Corona de Lealtad",
    category: "HEROÍNAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[REDIMIDA / FIDELIDAD / EFECTO]",
    atk: 3100,
    def: 3500,
    frameStyle: "effect",
    badgeColor: "bg-rose-300 text-black font-black",
    gradient: "from-rose-600 via-pink-700 to-rose-950",
    border: "border-rose-200",
    glow: "shadow-[0_0_35px_rgba(253,164,175,0.7)]",
    icon: "🌾",
    pasaje: "Rut 1:16",
    clanXP: 275,
    quote: "«Dondequiera que tú fueres, iré yo; tu pueblo será mi pueblo, y tu Dios mi Dios.»",
    effectName: "[PACTO DE LAS ESPIGAS]",
    power: "Fidelidad absoluta en la adversidad. Redime a la familia y entra en la genealogía real del Mesías.",
    serialCode: "ODISEA-ES037"
  },
  {
    id: "card_38",
    name: "Ester, Corona de Valentía Real",
    category: "HEROÍNAS",
    rarity: "MÍTICA DIVINA",
    stars: 11,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[REINA / LIBERTADORA / EFECTO]",
    atk: 3700,
    def: 3800,
    frameStyle: "divine",
    badgeColor: "bg-purple-300 text-black font-black",
    gradient: "from-purple-500 via-fuchsia-600 to-purple-950",
    border: "border-purple-200",
    glow: "shadow-[0_0_45px_rgba(216,180,254,0.8)]",
    icon: "👑",
    pasaje: "Ester 4:14-16",
    clanXP: 360,
    quote: "«¿Quién sabe si para esta hora has llegado al reino? Y si perezco, que perezca.»",
    effectName: "[CETRO DE GRACIA Y AYUNO]",
    power: "Intercesión arriesgando la propia vida para desbaratar los planes del enemigo genocida.",
    serialCode: "ODISEA-ES038"
  },
  {
    id: "card_39",
    name: "Abigail, Sabiduría que Detuvo la Espada",
    category: "HEROÍNAS",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "JUSTICIA",
    attributeIcon: "⚖️",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[MEDIADORA / PACIFICADORA / EFECTO]",
    atk: 2600,
    def: 3600,
    frameStyle: "effect",
    badgeColor: "bg-emerald-300 text-black font-black",
    gradient: "from-emerald-600 via-teal-700 to-emerald-950",
    border: "border-emerald-200",
    glow: "shadow-[0_0_30px_rgba(110,231,183,0.7)]",
    icon: "🧺",
    pasaje: "1 Samuel 25:32-33",
    clanXP: 205,
    quote: "«Bendito sea tu razonamiento, y bendita tú, que me has estorbado hoy de ir a derramar sangre.»",
    effectName: "[DIPLOMACIA PACIFICADORA]",
    power: "Inteligencia emocional y prontitud para apagar fuegos de rencor y venganza violenta.",
    serialCode: "ODISEA-ES039"
  },
  {
    id: "card_40",
    name: "Ana, La Oración del Silencio Profundo",
    category: "HEROÍNAS",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[INTERCESORA / DEVOCIÓN / EFECTO]",
    atk: 2200,
    def: 3300,
    frameStyle: "effect",
    badgeColor: "bg-sky-300 text-black font-black",
    gradient: "from-sky-600 via-indigo-700 to-sky-950",
    border: "border-sky-200",
    glow: "shadow-[0_0_25px_rgba(125,211,252,0.6)]",
    icon: "🙏",
    pasaje: "1 Samuel 1:15",
    clanXP: 150,
    quote: "«No he bebido vino ni sidra, sino que he derramado mi alma delante de Yahveh.»",
    effectName: "[CLAMOR DEL SANTUARIO]",
    power: "Oración ferviente del corazón que transforma la esterilidad en el nacimiento de profetas.",
    serialCode: "ODISEA-ES040"
  },
  {
    id: "card_41",
    name: "Rajab y el Cordón de Grana",
    category: "HEROÍNAS",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "MONSTRUO DE EFECTO",
    monsterType: "[VALIENTE / REFUGIO / EFECTO]",
    atk: 2500,
    def: 3000,
    frameStyle: "effect",
    badgeColor: "bg-red-400 text-white font-black",
    gradient: "from-red-600 via-rose-700 to-red-950",
    border: "border-red-300",
    glow: "shadow-[0_0_25px_rgba(248,113,113,0.6)]",
    icon: "🧶",
    pasaje: "Josué 2:18",
    clanXP: 145,
    quote: "«Atarás este cordón de grana a la ventana... y reunirás en tu casa a tu familia.»",
    effectName: "[SEÑAL DEL RESCATE]",
    power: "Fe audaz que protege a toda su casa en medio del colapso de las murallas enemigas.",
    serialCode: "ODISEA-ES041"
  },

  // ── RELIQUIAS Y MANIFESTACIONES SAGRADAS (ULTRA & SECRET RARE) ──
  {
    id: "card_42",
    name: "El Arca de la Alianza y los Querubines",
    category: "RELIQUIAS",
    rarity: "MÍTICA DIVINA",
    stars: 12,
    attribute: "DIVINO",
    attributeIcon: "🌟",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[TRONO DE GLORIA / SHIKINAH / EFECTO]",
    atk: 5000,
    def: 5000,
    frameStyle: "divine",
    badgeColor: "bg-yellow-300 text-black font-black",
    gradient: "from-yellow-400 via-amber-500 to-yellow-950",
    border: "border-yellow-200",
    glow: "shadow-[0_0_60px_rgba(253,224,71,1)]",
    icon: "⚱️",
    pasaje: "Éxodo 25:22",
    clanXP: 400,
    quote: "«Y de allí me declararé a ti, y hablaré contigo sobre el propiciatorio, de entre los dos querubines.»",
    effectName: "[PRESENCIA DE LA SHEJINÁH]",
    power: "La reliquia más sagrada del cosmos bíblico. Santifica todo el campamento y desbarata al mal.",
    serialCode: "ODISEA-ES042"
  },
  {
    id: "card_43",
    name: "La Columna de Fuego y Nube",
    category: "RELIQUIAS",
    rarity: "SECRETA RARA",
    stars: 11,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[GUIADORA / PROTECCIÓN / EFECTO]",
    atk: 3800,
    def: 4200,
    frameStyle: "divine",
    badgeColor: "bg-orange-400 text-black font-black",
    gradient: "from-orange-500 via-amber-600 to-orange-950",
    border: "border-orange-300",
    glow: "shadow-[0_0_40px_rgba(251,146,60,0.8)]",
    icon: "🔥",
    pasaje: "Éxodo 13:21",
    clanXP: 310,
    quote: "«Yahveh iba delante de ellos de día en una columna de nube para guiarlos, y de noche en columna de fuego para alumbrarles.»",
    effectName: "[GUÍA DE LA TRAVESÍA]",
    power: "Ilumina en la oscuridad más densa y confunde a los ejércitos perseguidores.",
    serialCode: "ODISEA-ES043"
  },
  {
    id: "card_44",
    name: "La Zarza Ardiente que no se Consume",
    category: "RELIQUIAS",
    rarity: "SECRETA RARA",
    stars: 10,
    attribute: "FUEGO",
    attributeIcon: "🔥",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[FUEGO SANTO / TEORÍA / EFECTO]",
    atk: 3600,
    def: 3900,
    frameStyle: "divine",
    badgeColor: "bg-rose-400 text-black font-black",
    gradient: "from-rose-500 via-red-600 to-rose-950",
    border: "border-rose-300",
    glow: "shadow-[0_0_40px_rgba(251,113,133,0.8)]",
    icon: "🌿",
    pasaje: "Éxodo 3:2",
    clanXP: 295,
    quote: "«Y la zarza ardía en fuego, y la zarza no se consumía... Quita tu calzado, porque el lugar santo es.»",
    effectName: "[LLAMADO DE HOREB]",
    power: "Despierta vocaciones eternas e infunde respeto sagrado por el espacio de aprendizaje.",
    serialCode: "ODISEA-ES044"
  },
  {
    id: "card_45",
    name: "La Vara de Almendro Florecida de Aarón",
    category: "RELIQUIAS",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[CONFIRMACIÓN / VIDA / EFECTO]",
    atk: 2800,
    def: 3500,
    frameStyle: "effect",
    badgeColor: "bg-emerald-300 text-black font-black",
    gradient: "from-emerald-500 via-teal-600 to-emerald-950",
    border: "border-emerald-200",
    glow: "shadow-[0_0_35px_rgba(110,231,183,0.7)]",
    icon: "🌱",
    pasaje: "Números 17:8",
    clanXP: 225,
    quote: "«La vara de Aarón de la casa de Leví había florecido, echado renuevos, flores y almendras.»",
    effectName: "[VIDA EN MADERA SECA]",
    power: "Confirma el liderazgo auténtico haciendo brotar vida y frutos donde solo había sequedad.",
    serialCode: "ODISEA-ES045"
  },
  {
    id: "card_46",
    name: "La Menorá, Candelabro de Oro Puro",
    category: "RELIQUIAS",
    rarity: "ULTRA RARA",
    stars: 9,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[LUMBRERA / PERFECCIÓN / EFECTO]",
    atk: 2900,
    def: 3400,
    frameStyle: "effect",
    badgeColor: "bg-amber-300 text-black font-black",
    gradient: "from-amber-400 via-yellow-600 to-amber-950",
    border: "border-amber-200",
    glow: "shadow-[0_0_35px_rgba(252,211,77,0.7)]",
    icon: "🕎",
    pasaje: "Éxodo 25:31",
    clanXP: 215,
    quote: "«Harás además un candelero de oro puro; labrado a martillo se hará el candelero con sus siete lámparas.»",
    effectName: "[LUZ CONTINUA EN EL LUGAR SANTO]",
    power: "Mantiene la claridad mental e inspiración durante evaluaciones y retos difíciles.",
    serialCode: "ODISEA-ES046"
  },
  {
    id: "card_47",
    name: "La Serpiente de Bronce en el Desierto",
    category: "RELIQUIAS",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "TIERRA",
    attributeIcon: "🌍",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[SANIDAD / MIRADA / EFECTO]",
    atk: 2400,
    def: 3100,
    frameStyle: "effect",
    badgeColor: "bg-orange-300 text-black font-black",
    gradient: "from-orange-600 via-amber-700 to-orange-950",
    border: "border-orange-200",
    glow: "shadow-[0_0_25px_rgba(253,186,116,0.6)]",
    icon: "⚕️",
    pasaje: "Números 21:9",
    clanXP: 160,
    quote: "«Cuando alguna serpiente mordía a alguno, miraba a la serpiente de bronce, y vivía.»",
    effectName: "[MIRADA QUE SANA]",
    power: "Basta mirar con fe para curar el veneno del desánimo o la amargura en el equipo.",
    serialCode: "ODISEA-ES047"
  },
  {
    id: "card_48",
    name: "El Maná Celestial y la Tinaja de Oro",
    category: "RELIQUIAS",
    rarity: "RARA",
    stars: 6,
    attribute: "LUZ",
    attributeIcon: "⚡",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[PROVISIÓN / PAN DE ÁNGELES / EFECTO]",
    atk: 1900,
    def: 2500,
    frameStyle: "effect",
    badgeColor: "bg-slate-200 text-black font-black",
    gradient: "from-slate-400 via-gray-600 to-slate-900",
    border: "border-slate-300",
    glow: "shadow-[0_0_20px_rgba(203,213,225,0.5)]",
    icon: "🥣",
    pasaje: "Éxodo 16:31",
    clanXP: 95,
    quote: "«Era como semilla de culantro, blanco, y su sabor como de hojuelas con miel.»",
    effectName: "[SUSTENTO COTIDIANO]",
    power: "Garantiza energía diaria y aprendizaje paso a paso, sin angustiarse por el mañana.",
    serialCode: "ODISEA-ES048"
  },
  {
    id: "card_49",
    name: "Las Cinco Piedras Lisas del Arroyo",
    category: "RELIQUIAS",
    rarity: "RARA",
    stars: 6,
    attribute: "AGUA",
    attributeIcon: "💧",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[MUNICIÓN / PRECISIÓN / EFECTO]",
    atk: 2500,
    def: 1900,
    frameStyle: "effect",
    badgeColor: "bg-cyan-200 text-black font-black",
    gradient: "from-cyan-600 via-sky-700 to-cyan-950",
    border: "border-cyan-300",
    glow: "shadow-[0_0_20px_rgba(165,243,252,0.5)]",
    icon: "🪨",
    pasaje: "1 Samuel 17:40",
    clanXP: 90,
    quote: "«Escogió cinco piedras lisas del arroyo, y las puso en el saco pastoril... y tomó su honda.»",
    effectName: "[CERTERO EN LA FRENTE]",
    power: "Simplicidad y preparación precisa que vence a la armadura pesada y arrogante.",
    serialCode: "ODISEA-ES049"
  },
  {
    id: "card_50",
    name: "El Shofar de Jubileo y Conquista",
    category: "RELIQUIAS",
    rarity: "SÚPER RARA",
    stars: 8,
    attribute: "VIENTO",
    attributeIcon: "🌪️",
    cardType: "RELIQUIA ARCANA",
    monsterType: "[TROMPETA / LIBERTAD / EFECTO]",
    atk: 2600,
    def: 2900,
    frameStyle: "effect",
    badgeColor: "bg-yellow-400 text-black font-black",
    gradient: "from-yellow-600 via-amber-700 to-yellow-950",
    border: "border-yellow-300",
    glow: "shadow-[0_0_25px_rgba(250,204,21,0.6)]",
    icon: "📯",
    pasaje: "Levítico 25:9",
    clanXP: 150,
    quote: "«Harás tocar fuertemente la trompeta en el mes séptimo a los diez días del mes; el día de la expiación.»",
    effectName: "[LLAMADO A LA ASAMBLEA]",
    power: "Silencio táctico instantáneo en el aula y proclamación de libertad para todos los cautivos.",
    serialCode: "ODISEA-ES050"
  }
];

// ─── CATÁLOGO OFICIAL DE SOBRES Y CAJAS DE AVENTURA ─────────────────────────
export const packStoreCatalog = [
  // ── SOBRES CLÁSICOS DE LA ALIANZA ──
  {
    id: "pack_pacto",
    name: "Sobre del Pacto",
    type: "sobre",
    tier: "BÁSICO",
    price: 100, // 100 Shekels
    icon: "📦",
    gradient: "from-blue-950 via-slate-900 to-blue-900",
    border: "border-blue-500/60",
    glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    badge: "bg-blue-600 text-white",
    cardsCount: 3,
    description: "Contiene 3 Cartas Yu-Gi-Oh! Bíblicas. Ideal para iniciar y asegurar cartas de soporte Comunes y Raras.",
    rates: "60% Común • 30% Rara • 10% Súper Rara",
    weights: { "COMÚN": 0.60, "RARA": 0.30, "SÚPER RARA": 0.10, "ULTRA RARA": 0.0, "SECRETA RARA": 0.0, "MÍTICA DIVINA": 0.0 }
  },
  {
    id: "pack_reyes",
    name: "Sobre de Jueces y Reyes",
    type: "sobre",
    tier: "AVANZADO",
    price: 220, // 220 Shekels
    icon: "🛡️",
    gradient: "from-purple-950 via-slate-900 to-purple-900",
    border: "border-purple-500/70",
    glow: "shadow-[0_0_35px_rgba(168,85,247,0.4)]",
    badge: "bg-purple-600 text-white",
    cardsCount: 3,
    description: "Contiene 3 Cartas Yu-Gi-Oh! Bíblicas. Garantiza al menos 1 Carta Rara o Súper Rara de guerreros y líderes.",
    rates: "25% Común • 45% Rara • 20% Súper Rara • 10% Ultra Rara",
    weights: { "COMÚN": 0.25, "RARA": 0.45, "SÚPER RARA": 0.20, "ULTRA RARA": 0.10, "SECRETA RARA": 0.0, "MÍTICA DIVINA": 0.0 }
  },
  {
    id: "pack_sion",
    name: "Sobre de la Gloria de Sion",
    type: "sobre",
    tier: "PREMIUM",
    price: 450, // 450 Shekels
    icon: "👑",
    gradient: "from-amber-950 via-yellow-950 to-black",
    border: "border-yellow-400",
    glow: "shadow-[0_0_45px_rgba(234,179,8,0.7)]",
    badge: "bg-yellow-500 text-black",
    cardsCount: 3,
    description: "El sobre dorado del Monte Sion. Alta probabilidad de Cartas Ultra Raras y Secretas con enorme XP para el Clan.",
    rates: "10% Rara • 45% Súper Rara • 35% Ultra Rara • 10% Secreta",
    weights: { "COMÚN": 0.0, "RARA": 0.10, "SÚPER RARA": 0.45, "ULTRA RARA": 0.35, "SECRETA RARA": 0.10, "MÍTICA DIVINA": 0.0 }
  },

  // ── CAJAS DE AVENTURA & COFRES MÍSTICOS (MYSTERY BOXES) ──
  {
    id: "box_exodo",
    name: "Cofre de Bronce del Éxodo",
    type: "caja",
    tier: "AVENTURA",
    price: 280, // 280 Shekels
    icon: "🧰",
    gradient: "from-amber-900 via-stone-900 to-amber-950",
    border: "border-amber-600",
    glow: "shadow-[0_0_40px_rgba(217,119,6,0.5)]",
    badge: "bg-amber-700 text-white",
    cardsCount: 4,
    description: "Cofre sellado del desierto del Sinaí. Contiene 4 Cartas Sagradas con foco en Patriarcas y el Éxodo.",
    rates: "4 Cartas • 1 Súper Rara garantizada",
    weights: { "COMÚN": 0.30, "RARA": 0.40, "SÚPER RARA": 0.25, "ULTRA RARA": 0.05, "SECRETA RARA": 0.0, "MÍTICA DIVINA": 0.0 }
  },
  {
    id: "box_jueces_reyes",
    name: "Cofre de Plata de los Reyes de Judá",
    type: "caja",
    tier: "HERÓICO",
    price: 550, // 550 Shekels
    icon: "⚔️",
    gradient: "from-slate-800 via-indigo-950 to-slate-900",
    border: "border-slate-300",
    glow: "shadow-[0_0_45px_rgba(203,213,225,0.6)]",
    badge: "bg-slate-300 text-black",
    cardsCount: 4,
    description: "Cofre forjado con los botines de guerra de David y Josafat. Contiene 4 Cartas con AL MENOS 1 ULTRA RARA O SECRETA.",
    rates: "4 Cartas • 1 Ultra Rara asegurada • Probabilidad de Secreta",
    weights: { "COMÚN": 0.10, "RARA": 0.30, "SÚPER RARA": 0.35, "ULTRA RARA": 0.20, "SECRETA RARA": 0.05, "MÍTICA DIVINA": 0.0 }
  },
  {
    id: "box_salomon",
    name: "Cofre de Oro del Templo de Salomón",
    type: "caja",
    tier: "ÉPICO TEMPLO",
    price: 900, // 900 Shekels
    icon: "🏛️",
    gradient: "from-yellow-900 via-amber-950 to-black",
    border: "border-yellow-400",
    glow: "shadow-[0_0_55px_rgba(250,204,21,0.8)]",
    badge: "bg-gradient-to-r from-amber-400 to-yellow-300 text-black",
    cardsCount: 5,
    description: "Cofre de madera de cedro revestido de oro puro del rey Salomón. Contiene 5 Cartas de alto rango (Nivel 8 a 11).",
    rates: "5 Cartas • 1 Ultra Rara + 1 Secreta Rara garantizadas",
    weights: { "COMÚN": 0.0, "RARA": 0.15, "SÚPER RARA": 0.35, "ULTRA RARA": 0.35, "SECRETA RARA": 0.15, "MÍTICA DIVINA": 0.0 }
  },
  {
    id: "box_arca_pacto",
    name: "Arca del Pacto: Caja Mística Suprema",
    type: "caja",
    tier: "DIVINO SUPREMO",
    price: 1500, // 1500 Shekels
    icon: "✨",
    gradient: "from-amber-500 via-purple-900 to-black",
    border: "border-yellow-300",
    glow: "shadow-[0_0_70px_rgba(253,224,71,1)]",
    badge: "bg-gradient-to-r from-yellow-300 via-fuchsia-400 to-amber-300 text-black font-black animate-pulse",
    cardsCount: 5,
    description: "¡EL TESORO SUPREMO DEL SANTUARIO! 5 Cartas Sagradas con probabilidad de CARTAS MÍTICAS DIVINAS (Nivel 12: Moisés, David, Elías, Abraham, El Arca) con hasta +400 XP para el Clan.",
    rates: "5 Cartas • GARANTIZA 1 CARTA SECRETA O MÍTICA DIVINA",
    weights: { "COMÚN": 0.0, "RARA": 0.0, "SÚPER RARA": 0.20, "ULTRA RARA": 0.40, "SECRETA RARA": 0.25, "MÍTICA DIVINA": 0.15 }
  }
];

const soloMissions = [
  {
    id: 1,
    worldNum: "1-1",
    title: "MISIÓN 1: SANTIDAD Y SACRIFICIO",
    theme: "LOS SACERDOTES Y EL TABERNÁCULO",
    videoUrl: "https://www.canva.com/design/DAHUxOYFoR4/YfVzZqhCBllExJdCAr972g/watch?embed",
    lore: "El fuego del Sinaí arde. La santidad pura de Yahveh exige un mediador sagrado. Los sacerdotes custodian el santuario portando las 12 tribus en el pecho.",
    secretPassword: "SANTIDAD77",
    acceptedPasswords: ["SANTIDAD77", "SANTIDAD", "LEVI12"],
    passwordHint: "Virtud grabada en la diadema del Sumo Sacerdote (SANTIDAD) + el número perfecto 77 = SANTIDAD77",
    questions: [
      {
        q: "EL FUEGO EXTRAÑO DE NADAB Y ABIÚ: En Levítico 10, los hijos de Aarón llevaron fuego común buscando aplausos rápidos y fueron consumidos. Si en tu salón te presionan a hacer trampas para ganar popularidad fácil, ¿qué principio sacerdotal debes aplicar?",
        options: [
          "La verdadera gloria viene de obedecer con integridad sagrada, no de inventar atajos deshonestos para complacer a la masa.",
          "Lo importante es hacer ruido y destacar a cualquier costo para no quedarse atrás en el grupo.",
          "Si la mayoría lo hace, la trampa deja de ser mala y se convierte en una regla válida."
        ],
        correct: 0,
        explanation: "La santidad exige autenticidad y obediencia; los atajos morales destruyen el liderazgo espiritual."
      },
      {
        q: "EL PECTORAL SOBRE EL CORAZÓN: Éxodo 28 revela que el Sumo Sacerdote llevaba 12 piedras preciosas en su pecho para no olvidar a ninguna tribu. Si un compañero de tu aula sufre burlas y abandono, ¿cuál es tu deber sacerdotal?",
        options: [
          "Ignorarlo para no arruinar tu propia reputación ante los compañeros populares del aula.",
          "Llevar su carga sobre tu corazón: defenderlo, apoyarlo en sus estudios y ser su puente de paz y protección.",
          "Burlarte con los demás en el recreo pero saludarlo amablemente cuando nadie los esté mirando."
        ],
        correct: 1,
        explanation: "Un verdadero sacerdote intercede y protege al más débil, llevándolo con amor y valentía en el pecho."
      },
      {
        q: "EL VELO DEL SANTUARIO Y EL PERDÓN: El velo separaba el mundo del Arca de la Alianza. Nadie podía cruzar sin purificarse primero del pecado. ¿Qué nos enseña este misterio sobre cómo tratamos las faltas ajenas?",
        options: [
          "Que antes de juzgar o señalar los errores de tus compañeros, debes examinar y purificar tus propias acciones.",
          "Que los líderes tienen derecho de criticar duramente a todos porque ellos son perfectos.",
          "Que las faltas morales se borran simplemente vistiendo ropas costosas y aparentando en público."
        ],
        correct: 0,
        explanation: "La pureza interior es indispensable: no podemos corregir con soberbia lo que no hemos sanado en nosotros mismos."
      }
    ]
  },
  {
    id: 2,
    worldNum: "2-1",
    title: "MISIÓN 2: LA ERA DEL CAOS",
    theme: "LOS JUECES DE ISRAEL",
    videoUrl: "https://www.canva.com/design/DAHUqu9i4XE/UQyvnmdGtkut8rZ41kbCsQ/watch?embed",
    lore: "Anarquía total. Cada quien hace lo que bien le parece. Cuando Israel clama en la oscuridad, la Providencia levanta jueces y libertadores improbables.",
    secretPassword: "JUECES300",
    acceptedPasswords: ["JUECES300", "JUSTICIA", "GEDEON300"],
    passwordHint: "El ejército escogido por Dios que venció a los madianitas con cántaros de fuego = JUECES300",
    questions: [
      {
        q: "LA PRUEBA DEL MANANTIAL DE HAROD: Gedeón redujo su ejército de 32,000 a solo 300 soldados que bebieron agua vigilando con cántaros y teas. ¿Por qué Dios eligió a 300 vigilantes en vez de una multitud descuidada?",
        options: [
          "Porque la victoria no depende de la fuerza numérica, sino de la disciplina, la vigilancia y la confianza ciega en Dios.",
          "Porque 300 soldados eran más veloces para salir huyendo si la batalla se complicaba.",
          "Porque los madianitas se asustaban más si veían menos soldados en el campo de batalla."
        ],
        correct: 0,
        explanation: "Dios usa la fidelidad y la vigilancia de pocos valientes para desarmar a ejércitos gigantescos."
      },
      {
        q: "LA PALMERA DE DÉBORA Y LOS CARROS DE HIERRO: El general Sísara atacó con 900 carros de hierro forjado. Barac no se atrevió a luchar sin Débora, quien profetizó que la fe movería la tormenta divina. ¿Qué principio táctico demuestra esta victoria?",
        options: [
          "Que ningún poder material o intimidación escolar puede derrotar a un liderazgo firme fundado en la verdad divina.",
          "Que siempre es más inteligente rendirse cuando el adversario tiene mejores recursos económicos.",
          "Que el valor de un líder se mide únicamente por la cantidad de armas y fuerza física que posee."
        ],
        correct: 0,
        explanation: "La sabiduría y la convicción espiritual de Débora prevalecieron sobre la maquinaria bélica más temida de su tiempo."
      },
      {
        q: "LA TRAGEDIA DE SANSÓN Y LA ROCA DE ETAM: Sansón venció a ejércitos enteros con una quijada, pero sucumbió ante sus impulsos y rencores personales con Dalila. ¿Cuál es el mayor peligro del guerrero que vence a todos menos a su propio ego?",
        options: [
          "Que puedes tener talentos prodigiosos, pero si careces de dominio propio y lealtad, tu orgullo destruirá tu destino.",
          "Que Sansón perdió su fuerza porque le faltó entrenamiento militar con armaduras de acero.",
          "Que la fuerza muscular siempre garantiza un liderazgo respetado y admirado por todos."
        ],
        correct: 0,
        explanation: "El dominio propio es la mayor victoria: vencer a mil enemigos no sirve de nada si pierdes tu alma ante tus pasiones."
      }
    ]
  },
  {
    id: 3,
    worldNum: "3-1",
    title: "MISIÓN 3: EL ASCENSO DE LA CORONA",
    theme: "LOS REYES DE ISRAEL",
    videoUrl: "https://www.canva.com/design/DAHWHQ6Tcnw/51zOo9S2VlPP2lY6o_bDdQ/watch?embed",
    lore: "Israel exige un rey humano. Tres monarcas forjan el destino del pueblo: Saúl el soberbio, David el pastor según el corazón de Dios y Salomón el sabio constructor.",
    secretPassword: "CORONA777",
    acceptedPasswords: ["CORONA777", "CORONA", "DAVID7"],
    passwordHint: "El cetro real y la unción eterna del linaje de David = CORONA777",
    questions: [
      {
        q: "EL DESAFÍO EN EL VALLE DE ELA: Goliat desafió a Israel por 40 días. Saúl le ofreció a David su pesada armadura de bronce, pero David se la quitó diciendo: 'No puedo andar con esto'. ¿Por qué David rechazó la armadura de Saúl?",
        options: [
          "Porque la fe auténtica no necesita máscaras ni armaduras prestadas; el poder de Dios opera en quien eres verdaderamente.",
          "Porque David quería impresionar al rey corriendo a gran velocidad sin nada de ropa protectora.",
          "Porque la armadura de Saúl estaba rota y no tenía suficiente valor económico."
        ],
        correct: 0,
        explanation: "Vencer gigantes no requiere copiar las tácticas del mundo, sino actuar con la fe y autenticidad que Dios te dio."
      },
      {
        q: "LA CUEVA DE EN-GADI Y EL HONOR DE DAVID: Mientras Saúl lo perseguía a muerte, David tuvo la oportunidad de asesinarlo a traición en la cueva, pero solo cortó la orilla de su manto. ¿Qué lección de honor enseña David al no vengarse?",
        options: [
          "Que un líder según el corazón de Dios jamás aprovecha la debilidad del enemigo para traicionar sus principios con venganza.",
          "Que David sintió pavor de que los guardias de Saúl despertaran y lo encerraran.",
          "Que es mejor esperar a que otros hagan el trabajo sucio por nosotros."
        ],
        correct: 0,
        explanation: "El perdón y el respeto al orden divino forjaron la grandeza de David: la venganza destruye la dignidad del vencedor."
      },
      {
        q: "EL VEREDICTO SALOMÓNICO DE LA ESPADA: Dos mujeres reclamaban al mismo bebé recién nacido. Salomón pidió una espada para cortarlo a la mitad. La verdadera madre gritó: '¡Dénselo viva a ella!'. ¿Cómo revela Salomón la verdadera sabiduría?",
        options: [
          "Demostró que el amor genuino prefiere sacrificarse por la vida del otro antes que ver destrucción o división.",
          "Comprobó que la amenaza de violencia siempre asusta a las personas débiles de carácter.",
          "Buscaba impresionar a la corte real mostrando una orden sanguinaria e intimidante."
        ],
        correct: 0,
        explanation: "La sabiduría divina discierne el corazón: el amor verdadero siempre elige proteger la vida por encima del beneficio propio."
      }
    ]
  },
  {
    id: 4,
    worldNum: "4-1",
    title: "MISIÓN 4: VOCES DEL DESIERTO",
    theme: "LOS PROFETAS Y EL FUEGO DE LA VERDAD",
    videoUrl: "https://www.canva.com/design/DAHWugF3r_Y/CGzIAO7oBeFfkhz_SVDLvQ/watch?embed",
    lore: "Los monarcas fallaron. Dios levanta profetas: hombres y mujeres que gritan verdades incómodas frente al poder de imperios opresores para despertar la justicia.",
    secretPassword: "FUEGO18",
    acceptedPasswords: ["FUEGO18", "FUEGO", "CARMELO450"],
    passwordHint: "El milagro de Elías consumiendo el holocausto en 1 Reyes 18 = FUEGO18",
    questions: [
      {
        q: "LA CONFRONTACIÓN DEL MONTE CARMELO: 450 profetas de Baal bailaron y sangraron todo el día sin respuesta. Elías reconstruyó el altar con 12 piedras, derramó cántaros de agua y oró una sola vez. ¿Por qué Elías mojó el sacrificio antes de orar?",
        options: [
          "Para que no hubiera duda humana de que el fuego del cielo fue un milagro de Dios que vindica la verdad absoluta.",
          "Porque el calor del desierto estaba secando la leña y necesitaba enfriar el altar.",
          "Para apagar las chispas que los sacerdotes de Baal habían colocado en secreto."
        ],
        correct: 0,
        explanation: "Cuando defiendes la verdad, no necesitas trucos ni trampas: la justicia de Dios resplandece ante la imposibilidad humana."
      },
      {
        q: "EL DECRETO DE MEDOPERSIA Y EL FOSO DE LOS LEONES: Los sátrapas promulgaron una ley de pena de muerte para quien orase a Dios. Daniel abrió sus ventanas hacia Jerusalén y oró 3 veces al día como siempre. ¿Qué nos enseña Daniel frente a la presión escolar?",
        options: [
          "Que tus principios éticos y tu devoción no se apagan ni se esconden por miedo a las burlas o castigos del grupo.",
          "Que Daniel desafió al rey porque quería provocar una rebelión militar en Babilonia.",
          "Que orar en público te hace automáticamente superior a los demás compañeros."
        ],
        correct: 0,
        explanation: "La firmeza moral de Daniel demostró que la lealtad a los valores divinos está por encima de cualquier presión social."
      },
      {
        q: "EL CLAMOR DE AMÓS CONTRA EL ABUSO SOCIAL: Amós, un campesino de Técoa, denunció a los corruptos en Samaria: 'Venden al justo por dinero y al pobre por un par de zapatos... corra la justicia como un torrente'. ¿Cómo se vive hoy el mensaje de Amós?",
        options: [
          "Levantando nuestra voz contra la discriminación, el acoso y la exclusión de cualquier compañero vulnerable en el colegio.",
          "Comprando zapatillas caras para que nadie se burle de nuestra condición económica.",
          "Permaneciendo callados cuando vemos a alguien sufrir para no meternos en problemas ajenos."
        ],
        correct: 0,
        explanation: "La profecía bíblica no es predecir el futuro, es exigir justicia y defender al inocente en el presente."
      }
    ]
  },
  {
    id: 5,
    worldNum: "5-1",
    title: "MISIÓN 5: HEROÍNAS DE LA FE",
    theme: "MUJERES VALIENTES DE ISRAEL",
    videoUrl: "https://www.canva.com/design/DAHUpFG0HGw/LtS7S0nuTMhG6sedKbanpw/watch?embed",
    lore: "Donde los hombres vacilaron, la Providencia levantó mujeres leales y decididas. Estrategas de fe que cambiaron la historia de su nación.",
    secretPassword: "VALIENTES12",
    acceptedPasswords: ["VALIENTES12", "VALOR", "ESTER77"],
    passwordHint: "El valor de Ester y la lealtad de Rut para las 12 tribus = VALIENTES12",
    questions: [
      {
        q: "EL BANQUETE DE LA REINA ESTER: El malvado Amán firmó el decreto de exterminio. Presentarse ante el rey sin ser llamada significaba muerte inmediata. Ester ayunó 3 días y dijo: 'Si perezco, que perezca'. ¿Cuál fue la clave de su audacia?",
        options: [
          "Combinar preparación espiritual, paciencia estratégica y valentía extrema para denunciar la injusticia en el momento exacto.",
          "Escapar disfrazada del palacio de Persia para salvarse sola y dejar que su pueblo enfrente la crisis.",
          "Atacar militarmente la corte del emperador Asuero con espadas y soldados mercenarios."
        ],
        correct: 0,
        explanation: "La valentía de Ester salvó a toda una nación: el coraje moral y la inteligencia desarman los planes más destructivos."
      },
      {
        q: "LA PRUDENCIA DE ABIGAIL FRENTE A LA GUERRA: El necio Nabal humilló a David. David cabalgaba con 400 hombres armados para destruir su casa. Abigail salió al paso con alimentos, se postró y le recordó que un futuro rey no debe mancharse con venganza. ¿Qué poder tiene su acto?",
        options: [
          "Demuestra que una intervención sabia, humilde y oportuna apaga fuegos de violencia antes de que causen tragedias irreparables.",
          "Demuestra que es mejor huir y esconderse hasta que los soldados terminen de pelear.",
          "Demuestra que regalar alimentos soluciona mágicamente los problemas de odio en el mundo."
        ],
        correct: 0,
        explanation: "Abigail fue una estratega de paz: salvó decenas de vidas inocentes guiando a David a la sensatez y al perdón."
      },
      {
        q: "EL PACTO DE LEALTAD DE RUT EN BELÉN: Noemí le rogó a Rut que regresara a su tierra pagana. Rut respondió: 'Tu pueblo será mi pueblo, y tu Dios mi Dios'. Recogió espigas bajo el sol sin quejarse. ¿Qué fruto dio su lealtad incondicional?",
        options: [
          "Su fidelidad sin quejas la convirtió en la bisabuela del Rey David y antecesora directa de Jesucristo.",
          "Le permitió volver a Moab convertida en una comerciante millonaria y famosa.",
          "Le garantizó no tener que trabajar nunca más por el resto de su vida."
        ],
        correct: 0,
        explanation: "La lealtad humilde y desinteresada de Rut trascendió generaciones, bendiciendo a la humanidad entera."
      }
    ]
  }
];

function MarioBrosSoloGame({ missionIndex, studentAuth, onWin, onLose, onExit }) {
  const safeMissionIndex = (typeof missionIndex === 'number' && missionIndex >= 0 && missionIndex < soloMissions.length) ? missionIndex : 0;
  const mission = soloMissions[safeMissionIndex] || soloMissions[0];
  const questions = (Array.isArray(mission?.questions) && mission.questions.length > 0) ? mission.questions : [
    { q: "¿Cuál es el principio supremo de este desafío?", options: ["Servicio y Justicia", "Egoísmo", "Indiferencia"], correct: 0, explanation: "El servicio desinteresado es la base del reino." }
  ];

  // Fases: 'video_gate' | 'playing' | 'enigma_modal' | 'won' | 'lost'
  const [phase, setPhase] = useState('video_gate');
  const [videoCodeInput, setVideoCodeInput] = useState('');
  const [gateUnlocked, setGateUnlocked] = useState(Boolean(studentAuth?.isGodMode));
  const [gateError, setGateError] = useState('');
  const [showCodeHint, setShowCodeHint] = useState(false);

  // Estados Arcade & Vidas
  const [lives, setLives] = useState(studentAuth?.isGodMode ? 999 : (studentAuth?.lives || 3));
  const [coins, setCoins] = useState(0);
  const [scoreXP, setScoreXP] = useState(0);
  const [gameTime, setGameTime] = useState(0);

  // Power-ups
  const [maxBombs, setMaxBombs] = useState(1);
  const [blastRadius, setBlastRadius] = useState(1);
  const [shieldSec, setShieldSec] = useState(0);
  const [speedBoost, setSpeedBoost] = useState(false);

  // Jugador (Coordenadas en cuadrícula 13x9)
  const [playerX, setPlayerX] = useState(1);
  const [playerY, setPlayerY] = useState(1);
  const [facing, setFacing] = useState('down'); // 'up' | 'down' | 'left' | 'right'
  const [isJumping, setIsJumping] = useState(false);
  const [isInvulnerable, setIsInvulnerable] = useState(false);

  // Cuadrícula Bomberman (13 cols x 9 rows)
  // Tipos: 'WALL' | 'BLOCK' | 'EMPTY' | 'ALTAR' | 'PORTAL'
  const COLS = 13;
  const ROWS = 9;
  const ALTAR_COORDS = [
    { x: 11, y: 1 }, // Altar 1 (Esquina superior derecha)
    { x: 5, y: 4 },  // Altar 2 (Centro sagrado)
    { x: 1, y: 7 }   // Altar 3 (Cripta inferior izquierda)
  ];
  const PORTAL_COORD = { x: 11, y: 7 }; // Portal de Victoria (Esquina inferior derecha)

  const [grid, setGrid] = useState(() => {
    const initial = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        // Muros exteriores
        if (r === 0 || r === ROWS - 1 || c === 0 || c === COLS - 1) {
          row.push({ type: 'WALL', item: null });
        }
        // Pilares interiores indestructibles
        else if (r % 2 === 0 && c % 2 === 0) {
          row.push({ type: 'WALL', item: null });
        }
        // Altares sagrados
        else if (ALTAR_COORDS.some(a => a.x === c && a.y === r)) {
          const altarIdx = ALTAR_COORDS.findIndex(a => a.x === c && a.y === r);
          row.push({ type: 'ALTAR', altarIdx, item: null });
        }
        // Portal de salida
        else if (PORTAL_COORD.x === c && PORTAL_COORD.y === r) {
          row.push({ type: 'PORTAL', item: null });
        }
        // Zona inicial de spawn del jugador libre
        else if ((c === 1 && r === 1) || (c === 2 && r === 1) || (c === 1 && r === 2)) {
          row.push({ type: 'EMPTY', item: null });
        }
        // Bloques destruibles con probabilidad de items
        else if (Math.random() < 0.45) {
          const rand = Math.random();
          let item = null;
          if (rand < 0.25) item = 'coin';
          else if (rand < 0.35) item = 'fire';
          else if (rand < 0.45) item = 'bomb';
          else if (rand < 0.52) item = 'speed';
          else if (rand < 0.58) item = 'shield';
          else if (rand < 0.63) item = 'heart';
          row.push({ type: 'BLOCK', item });
        }
        // Pasillo libre
        else {
          row.push({ type: 'EMPTY', item: null });
        }
      }
      initial.push(row);
    }
    return initial;
  });

  // Bombas activas y Explosiones
  const [bombs, setBombs] = useState([]); // [{ id, x, y, timer }]
  const [explosions, setExplosions] = useState([]); // [{ id, tiles: [{x, y}] }]

  // Sombras Enemigas Patrullando
  const [enemies, setEnemies] = useState([
    { id: 1, x: 9, y: 3, alive: true, dir: 'left' },
    { id: 2, x: 3, y: 5, alive: true, dir: 'right' },
    { id: 3, x: 7, y: 7, alive: true, dir: 'up' }
  ]);

  // Estado de los 3 Altares
  const [solvedAltars, setSolvedAltars] = useState([false, false, false]);
  const [activeAltarIdx, setActiveAltarIdx] = useState(null);
  const [enigmaAnswered, setEnigmaAnswered] = useState(false);
  const [enigmaError, setEnigmaError] = useState('');

  // Mensaje flotante de estado
  const [hudBanner, setHudBanner] = useState('');

  const showBanner = (msg, duration = 3000) => {
    setHudBanner(msg);
    setTimeout(() => setHudBanner(''), duration);
  };

  // ── DESBLOQUEO DEL VIDEO GATE CON CONTRASEÑA ÚNICA ──
  const handleUnlockVideoGate = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const code = videoCodeInput.trim().toUpperCase();
    const isMaster = studentAuth?.isGodMode || code === 'EDER2026' || code === 'ZAMITOECSA';
    const isMissionMatch = mission.acceptedPasswords?.includes(code) || code === (mission.secretPassword || '').toUpperCase();

    if (isMaster || isMissionMatch) {
      setGateUnlocked(true);
      setGateError('');
      playRetroSound('powerup');
      showBanner('¡CÓDICE ACEPTADO! PREPÁRATE PARA LA AVENTURA BOMBERMAN');
    } else {
      setGateError(`Código incorrecto para ${mission.title}. Solicita el código a tu docente o pulsa "Ver Pista".`);
      playRetroSound('hit');
    }
  };

  // ── SALTO DE MARIO ──
  const triggerJump = useCallback(() => {
    if (phase !== 'playing' || isJumping) return;
    setIsJumping(true);
    playRetroSound('jump');
    setTimeout(() => {
      setIsJumping(false);
    }, 450);
  }, [phase, isJumping]);

  // ── COLOCAR BOMBA SAGRADA ──
  const dropBomb = useCallback(() => {
    if (phase !== 'playing') return;
    // Verificar si ya hay una bomba en esa celda
    if (bombs.some(b => b.x === playerX && b.y === playerY)) return;
    // Verificar límite de bombas
    if (bombs.length >= maxBombs) {
      showBanner('¡Límite de bombas alcanzado! Espera la explosión o busca un item 💣', 1500);
      return;
    }

    const newBomb = {
      id: Date.now() + Math.random(),
      x: playerX,
      y: playerY,
      radius: blastRadius,
      createdAt: Date.now()
    };

    setBombs(prev => [...prev, newBomb]);
    playRetroSound('bomb_drop');
  }, [phase, bombs, playerX, playerY, maxBombs, blastRadius]);

  // ── MOVIMIENTO DEL JUGADOR ──
  const movePlayer = useCallback((dx, dy, dirName) => {
    if (phase !== 'playing') return;
    setFacing(dirName);

    const nx = playerX + dx;
    const ny = playerY + dy;

    // Límites
    if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) return;

    const cell = grid[ny]?.[nx];
    if (!cell) return;

    // Muros o bloques destruibles bloquean el paso (a menos que salte)
    if (cell.type === 'WALL') return;
    if (cell.type === 'BLOCK') return;

    // Verificar si hay una bomba en la celda destino
    if (bombs.some(b => b.x === nx && b.y === ny) && !isJumping) return;

    // Movimiento exitoso
    setPlayerX(nx);
    setPlayerY(ny);

    // Recoger item si hay
    if (cell.item) {
      const it = cell.item;
      // Limpiar item de la celda
      setGrid(prev => {
        const next = prev.map(row => [...row]);
        next[ny][nx] = { ...next[ny][nx], item: null };
        return next;
      });

      if (it === 'coin') {
        playRetroSound('coin');
        setCoins(c => c + 1);
        setScoreXP(s => s + 25);
        showBanner('🪙 ¡Moneda del Templo recogida! +25 XP', 1500);
      } else if (it === 'fire') {
        playRetroSound('powerup');
        setBlastRadius(r => Math.min(3, r + 1));
        showBanner('🔥 ¡Fuego Sagrado aumentado! Mayor radio de explosión', 2000);
      } else if (it === 'bomb') {
        playRetroSound('powerup');
        setMaxBombs(b => Math.min(3, b + 1));
        showBanner('💣 ¡Bolsa de Bombas! Puedes colocar +1 bomba simultánea', 2000);
      } else if (it === 'speed') {
        playRetroSound('powerup');
        setSpeedBoost(true);
        showBanner('⚡ ¡Sandalias de Asael! Velocidad aumentada', 2000);
      } else if (it === 'shield') {
        playRetroSound('secret');
        setShieldSec(12);
        showBanner('🛡️ ¡Escudo de Fe activo! Invulnerabilidad por 12s', 2500);
      } else if (it === 'heart') {
        playRetroSound('powerup');
        setLives(l => (studentAuth?.isGodMode ? 999 : Math.min(5, l + 1)));
        showBanner('❤️ ¡Vida recuperada!', 1500);
      }
    }

    // Verificar si pisó un Altar
    if (cell.type === 'ALTAR') {
      const idx = cell.altarIdx;
      if (!solvedAltars[idx]) {
        setActiveAltarIdx(idx);
        setEnigmaAnswered(false);
        setEnigmaError('');
        setPhase('enigma_modal');
        playRetroSound('secret');
      } else {
        showBanner(`✨ Altar N° ${idx + 1} ya fue consagrado y bendecido`, 1500);
      }
    }

    // Verificar si pisó el Portal de Victoria
    if (cell.type === 'PORTAL') {
      const allSolved = solvedAltars.every(Boolean);
      if (allSolved) {
        setPhase('won');
        playRetroSound('win');
        if (onWin) onWin(scoreXP + 50);
      } else {
        const solvedCount = solvedAltars.filter(Boolean).length;
        showBanner(`🔒 El Portal de Gloria está sellado. Consagra los 3 Altares primero (${solvedCount}/3)`, 2500);
      }
    }
  }, [phase, playerX, playerY, grid, bombs, isJumping, solvedAltars, scoreXP, studentAuth, onWin]);

  // ── DETECCIÓN DE TECLADO ──
  useEffect(() => {
    if (phase !== 'playing') return;

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'b', 'B'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        movePlayer(0, -1, 'up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        movePlayer(0, 1, 'down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        movePlayer(-1, 0, 'left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        movePlayer(1, 0, 'right');
      } else if (e.key === ' ' || e.key === 'j' || e.key === 'J') {
        triggerJump();
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'k' || e.key === 'K' || e.key === 'Enter') {
        dropBomb();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, movePlayer, triggerJump, dropBomb]);

  // ── CRONÓMETRO DE JUEGO Y ESCUDO ──
  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = setInterval(() => {
      setGameTime(t => t + 1);
      setShieldSec(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // ── DETONACIÓN DE BOMBAS Y CÁLCULO DE EXPLOSIÓN EN CRUZ ──
  useEffect(() => {
    if (phase !== 'playing') return;
    const bombInterval = setInterval(() => {
      const now = Date.now();
      const readyBombs = bombs.filter(b => now - b.createdAt >= 2200);

      if (readyBombs.length > 0) {
        readyBombs.forEach(b => {
          // Generar celdas de la explosión
          const expTiles = [{ x: b.x, y: b.y }];
          const directions = [
            { dx: 0, dy: -1 }, // Arriba
            { dx: 0, dy: 1 },  // Abajo
            { dx: -1, dy: 0 }, // Izquierda
            { dx: 1, dy: 0 }   // Derecha
          ];

          setGrid(prev => {
            const next = prev.map(row => [...row]);
            directions.forEach(({ dx, dy }) => {
              for (let step = 1; step <= (b.radius || 1); step++) {
                const tx = b.x + dx * step;
                const ty = b.y + dy * step;

                if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) break;
                const target = next[ty][tx];

                // Los muros indestructibles detienen el fuego
                if (target.type === 'WALL') break;

                // Si es un bloque destruible, se rompe y revela su item
                if (target.type === 'BLOCK') {
                  expTiles.push({ x: tx, y: ty });
                  next[ty][tx] = { type: 'EMPTY', item: target.item };
                  break; // El bloque absorbe la llama y detiene el rayo
                }

                // Si es pasillo libre, la llama continúa
                expTiles.push({ x: tx, y: ty });
              }
            });
            return next;
          });

          // Agregar efecto visual de explosión
          const expId = Date.now() + Math.random();
          setExplosions(prev => [...prev, { id: expId, tiles: expTiles }]);
          playRetroSound('explosion');

          // Verificar daño al jugador si está en el radio y no salta ni tiene escudo
          const hitPlayer = expTiles.some(t => t.x === playerX && t.y === playerY);
          if (hitPlayer && !isJumping && shieldSec <= 0 && !isInvulnerable && !studentAuth?.isGodMode) {
            setLives(l => {
              const nl = l - 1;
              if (nl <= 0) setPhase('lost');
              return nl;
            });
            playRetroSound('hit');
            setIsInvulnerable(true);
            setTimeout(() => setIsInvulnerable(false), 2000);
          }

          // Verificar daño a enemigos
          setEnemies(prev => prev.map(en => {
            if (!en.alive) return en;
            const hitEnemy = expTiles.some(t => t.x === en.x && t.y === en.y);
            if (hitEnemy) {
              setScoreXP(s => s + 50);
              showBanner('💥 ¡Sombra del Caos desintegrada! +50 XP', 1500);
              return { ...en, alive: false };
            }
            return en;
          }));

          // Remover la animación de explosión tras 600ms
          setTimeout(() => {
            setExplosions(prev => prev.filter(e => e.id !== expId));
          }, 600);
        });

        // Remover las bombas que ya explotaron
        setBombs(prev => prev.filter(b => now - b.createdAt < 2200));
      }
    }, 200);

    return () => clearInterval(bombInterval);
  }, [phase, bombs, playerX, playerY, isJumping, shieldSec, isInvulnerable, studentAuth]);

  // ── MOVIMIENTO DE ENEMIGOS ──
  useEffect(() => {
    if (phase !== 'playing') return;
    const enemyInterval = setInterval(() => {
      setEnemies(prev => prev.map(en => {
        if (!en.alive) return en;

        const dirs = [
          { dx: 0, dy: -1, name: 'up' },
          { dx: 0, dy: 1, name: 'down' },
          { dx: -1, dy: 0, name: 'left' },
          { dx: 1, dy: 0, name: 'right' }
        ];

        // Intentar seguir la misma dirección o elegir una aleatoria si choca
        const currentDir = dirs.find(d => d.name === en.dir) || dirs[0];
        const nx = en.x + currentDir.dx;
        const ny = en.y + currentDir.dy;

        const cell = grid[ny]?.[nx];
        const canMove = cell && cell.type !== 'WALL' && cell.type !== 'BLOCK' && !bombs.some(b => b.x === nx && b.y === ny);

        if (canMove && Math.random() < 0.7) {
          return { ...en, x: nx, y: ny };
        } else {
          // Cambiar dirección aleatoriamente
          const validDirs = dirs.filter(d => {
            const tx = en.x + d.dx;
            const ty = en.y + d.dy;
            const c = grid[ty]?.[tx];
            return c && c.type !== 'WALL' && c.type !== 'BLOCK' && !bombs.some(b => b.x === tx && b.y === ty);
          });
          if (validDirs.length > 0) {
            const chosen = validDirs[Math.floor(Math.random() * validDirs.length)];
            return { ...en, x: en.x + chosen.dx, y: en.y + chosen.dy, dir: chosen.name };
          }
          return en;
        }
      }));
    }, 650);

    return () => clearInterval(enemyInterval);
  }, [phase, grid, bombs]);

  // ── COLISIÓN JUGADOR CON ENEMIGOS ──
  useEffect(() => {
    if (phase !== 'playing' || isJumping || shieldSec > 0 || isInvulnerable || studentAuth?.isGodMode) return;

    const hitByEnemy = enemies.some(en => en.alive && en.x === playerX && en.y === playerY);
    if (hitByEnemy) {
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setPhase('lost');
        return nl;
      });
      playRetroSound('hit');
      setIsInvulnerable(true);
      showBanner('⚠️ ¡Alerta! Una Sombra del Desierto te ha atacado (-1 ❤️)', 2000);
      setTimeout(() => setIsInvulnerable(false), 2000);
    }
  }, [phase, playerX, playerY, enemies, isJumping, shieldSec, isInvulnerable, studentAuth]);

  // ── RESPUESTA EN EL ALTAR SAGRADO ──
  const handleAnswerEnigma = (optIdx) => {
    if (activeAltarIdx === null) return;
    const q = questions[activeAltarIdx % questions.length];

    if (optIdx === q.correct) {
      playRetroSound('win');
      setSolvedAltars(prev => {
        const next = [...prev];
        next[activeAltarIdx] = true;
        return next;
      });
      setScoreXP(s => s + 50);
      setEnigmaAnswered(true);
      setEnigmaError('');

      setTimeout(() => {
        setPhase('playing');
        setActiveAltarIdx(null);
        setEnigmaAnswered(false);
        const nextSolved = solvedAltars.filter(Boolean).length + 1;
        if (nextSolved >= 3) {
          showBanner('✨ ¡LOS 3 ALTARES CONSAGRADOS! Corre al Portal Sagrado en la esquina inferior derecha ⛩️', 5000);
        } else {
          showBanner(`🏛️ ¡Altar N° ${activeAltarIdx + 1} superado con éxito! (+50 XP)`, 2500);
        }
      }, 1500);
    } else {
      playRetroSound('hit');
      setLives(l => {
        const nl = l - 1;
        if (nl <= 0) setPhase('lost');
        return nl;
      });
      setEnigmaError(`Respuesta no aprobada por los sabios. Pista: ${q.explanation}`);
    }
  };

  // Helper para verificar si una celda está en fuego de explosión
  const isCellExploding = (x, y) => {
    return explosions.some(exp => exp.tiles.some(t => t.x === x && t.y === y));
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER DEL COMPONENTE
  // ═══════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#030408] text-white font-sans flex flex-col relative select-none overflow-x-hidden">

      {/* ── 1. FASE: VIDEO GATE Y CÓDICE DE SEGURIDAD ── */}
      {phase === 'video_gate' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-[#060810] via-[#090b16] to-[#030408] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/10 via-transparent to-black pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-4xl bg-[#0c0e1a]/95 border-2 border-amber-500/50 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(245,158,11,0.2)] flex flex-col items-center">
            
            {/* Header del Reto */}
            <div className="flex flex-col md:flex-row items-center justify-between w-full border-b border-amber-900/40 pb-6 mb-6 gap-4">
              <div className="text-center md:text-left">
                <span className="bg-amber-900/40 text-amber-300 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border border-amber-600/40">
                  MODO ESTUDIANTE • {mission.worldNum}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight mt-2">
                  {mission.title}
                </h2>
                <p className="text-amber-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-1">
                  TEMA: {mission.theme}
                </p>
              </div>

              <button 
                onClick={onExit} 
                className="bg-black/60 hover:bg-red-950 text-slate-400 hover:text-white border border-slate-700 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer">
                <ChevronRight className="rotate-180 w-4 h-4"/> Salir al Panel
              </button>
            </div>

            {/* Video de Canva de la Misión */}
            <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-amber-600/40 shadow-2xl relative mb-6">
              <iframe 
                src={mission.videoUrl} 
                className="w-full h-full border-0" 
                allowFullScreen 
                title={mission.title}
              />
            </div>

            {/* Lore Narrativo */}
            <p className="text-slate-300 text-sm md:text-base italic text-center max-w-2xl mb-8 leading-relaxed font-serif border-l-2 border-r-2 border-amber-500/40 px-6">
              "{mission.lore}"
            </p>

            {/* Formulario de Contraseña de Video */}
            <div className="w-full max-w-md bg-[#121526] border border-amber-500/30 rounded-2xl p-6 shadow-xl flex flex-col items-center">
              <h3 className="text-amber-400 font-black text-xs md:text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                <Key className="w-4 h-4"/> CÓDICE SAGRADO DE LA MISIÓN
              </h3>
              <p className="text-slate-400 text-[11px] text-center mb-4 leading-relaxed">
                Cada misión tiene su propia contraseña exclusiva entregada por tu docente en clase.
              </p>

              <form onSubmit={handleUnlockVideoGate} className="w-full space-y-3">
                <input 
                  type="text" 
                  value={videoCodeInput} 
                  onChange={(e) => setVideoCodeInput(e.target.value)} 
                  placeholder="INGRESA EL CÓDICE AQUÍ..." 
                  className="w-full bg-black/80 border-2 border-amber-600/60 rounded-xl px-4 py-3 text-center text-lg md:text-xl font-black text-white uppercase tracking-[0.2em] outline-none focus:border-amber-400 placeholder:text-slate-600"
                />

                {gateError && (
                  <p className="text-red-400 text-xs font-bold text-center bg-red-950/50 p-2 rounded-lg border border-red-800">
                    {gateError}
                  </p>
                )}

                {showCodeHint && (
                  <div className="bg-amber-950/40 border border-amber-500/40 p-3 rounded-xl text-amber-300 text-xs text-center animate-in fade-in">
                    <p className="font-bold mb-1">💡 PISTA DEL PROFESOR:</p>
                    <p className="text-slate-200 italic">{mission.passwordHint}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCodeHint(!showCodeHint)} 
                    className="bg-black/50 hover:bg-slate-900 text-amber-400 border border-amber-600/40 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer">
                    {showCodeHint ? 'Ocultar Pista' : '💡 Ver Pista'}
                  </button>

                  <button 
                    type="submit" 
                    className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-wider py-3 rounded-xl text-xs shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all cursor-pointer hover:scale-[1.02]">
                    DESBLOQUEAR RETO
                  </button>
                </div>
              </form>

              {/* Acceso Directo si ya está desbloqueado */}
              {gateUnlocked && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 w-full flex flex-col items-center animate-in zoom-in">
                  <span className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4"/> MISIÓN DESBLOQUEADA
                  </span>
                  <button 
                    onClick={() => { setPhase('playing'); playRetroSound('powerup'); }} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] py-3.5 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all cursor-pointer text-sm hover:scale-[1.02]">
                    🎮 ENTRAR AL RETO BOMBERMAN & MARIO
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── 2. FASE: JUEGO ACTIVO (ARENA BOMBERMAN + MARIO) ── */}
      {phase === 'playing' && (
        <div className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 bg-[#05060b] relative">

          {/* HUD Retro Superior */}
          <div className="w-full max-w-4xl bg-[#0e1122] border-2 border-amber-600/50 rounded-2xl p-3 sm:p-4 shadow-xl mb-3 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-black">
            <div className="flex items-center gap-3">
              <span className="bg-amber-950 text-yellow-400 border border-amber-600/50 px-3 py-1 rounded-lg uppercase tracking-wider">
                {mission.worldNum} • {mission.theme.split(' ')[0]}
              </span>
              <span className="text-red-400 flex items-center gap-1 text-base">
                {studentAuth?.isGodMode ? '❤️ x 999' : `❤️ x ${Math.max(0, lives)}`}
              </span>
              <span className="text-yellow-400 flex items-center gap-1">
                🪙 {coins} ({scoreXP} XP)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-300 flex items-center gap-1">
                💣 {maxBombs - bombs.length}/{maxBombs}
              </span>
              <span className="text-orange-400 flex items-center gap-1">
                🔥 LVL {blastRadius}
              </span>
              {shieldSec > 0 && (
                <span className="text-cyan-400 animate-pulse flex items-center gap-1">
                  🛡️ {shieldSec}s
                </span>
              )}
              <span className="text-purple-300 bg-purple-950/60 border border-purple-600/40 px-2.5 py-1 rounded-lg">
                📜 {solvedAltars.filter(Boolean).length}/3 ALTARES
              </span>
              <button 
                onClick={onExit} 
                className="bg-black/60 hover:bg-red-900 text-slate-400 hover:text-white border border-slate-700 px-3 py-1 rounded-lg text-xs uppercase cursor-pointer">
                Pausa
              </button>
            </div>
          </div>

          {/* Banner Flotante de Notificaciones */}
          {hudBanner && (
            <div className="fixed top-20 z-50 bg-amber-950/95 border-2 border-amber-400 text-amber-200 px-6 py-2.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.6)] animate-in slide-in-from-top-4 duration-300">
              {hudBanner}
            </div>
          )}

          {/* Tablero Bomberman (13 x 9) */}
          <div className="relative bg-[#090b14] border-4 border-amber-700/60 rounded-2xl p-2 sm:p-3 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden w-full max-w-[720px] aspect-[13/9]">
            
            <div className="w-full h-full grid grid-cols-13 grid-rows-9 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(13, minmax(0, 1fr))', gridTemplateRows: 'repeat(9, minmax(0, 1fr))' }}>
              {grid.map((row, r) => 
                row.map((cell, c) => {
                  const isPlayerHere = (playerX === c && playerY === r);
                  const isBombHere = bombs.find(b => b.x === c && b.y === r);
                  const isFireHere = isCellExploding(c, r);
                  const enemyHere = enemies.find(en => en.alive && en.x === c && en.y === r);
                  const isAltar = cell.type === 'ALTAR';
                  const isPortal = cell.type === 'PORTAL';
                  const altarSolved = isAltar && solvedAltars[cell.altarIdx];
                  const portalReady = isPortal && solvedAltars.every(Boolean);

                  return (
                    <div 
                      key={`${r}-${c}`} 
                      className={`relative flex items-center justify-center rounded-md text-xs font-black transition-all overflow-hidden ${
                        cell.type === 'WALL' ? 'bg-gradient-to-b from-[#2a3048] to-[#161a29] border border-[#3b4363] shadow-inner text-slate-500' :
                        cell.type === 'BLOCK' ? 'bg-gradient-to-b from-[#78350f] to-[#451a03] border border-[#92400e] text-amber-200 shadow-md' :
                        isAltar ? (altarSolved ? 'bg-purple-950/80 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-purple-900/40 border-2 border-purple-400 animate-pulse') :
                        isPortal ? (portalReady ? 'bg-amber-500/80 border-2 border-yellow-300 shadow-[0_0_30px_rgba(245,158,11,0.9)] animate-pulse' : 'bg-slate-900/60 border border-slate-700 opacity-60') :
                        'bg-[#0e1222] border border-[#171c33]'
                      }`}>

                      {/* Icono de Muro o Bloque */}
                      {cell.type === 'WALL' && <span className="opacity-40 text-xs">🏛️</span>}
                      {cell.type === 'BLOCK' && <span className="text-xs">🧱</span>}

                      {/* Item revelado en celda vacía */}
                      {cell.type === 'EMPTY' && cell.item && !isBombHere && !isFireHere && !isPlayerHere && (
                        <span className="text-xs animate-bounce">
                          {cell.item === 'coin' ? '🪙' :
                           cell.item === 'fire' ? '🔥' :
                           cell.item === 'bomb' ? '💣' :
                           cell.item === 'speed' ? '⚡' :
                           cell.item === 'shield' ? '🛡️' : '❤️'}
                        </span>
                      )}

                      {/* Altar Sagrado */}
                      {isAltar && (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm">{altarSolved ? '✨' : '📜'}</span>
                          <span className="text-[7px] font-black uppercase text-purple-300">
                            {altarSolved ? 'OK' : `A${cell.altarIdx + 1}`}
                          </span>
                        </div>
                      )}

                      {/* Portal de Victoria */}
                      {isPortal && (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-sm">{portalReady ? '⛩️' : '🔒'}</span>
                          <span className="text-[7px] font-black uppercase text-yellow-300">
                            {portalReady ? 'EXIT' : 'SELLADO'}
                          </span>
                        </div>
                      )}

                      {/* Bomba Sagrada Activa */}
                      {isBombHere && (
                        <div className="absolute inset-0 flex items-center justify-center z-20 animate-ping duration-1000">
                          <span className="text-base drop-shadow-[0_0_10px_rgba(239,68,68,1)]">💣</span>
                        </div>
                      )}

                      {/* Explosión en Cruz */}
                      {isFireHere && (
                        <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 flex items-center justify-center z-30 animate-pulse">
                          <span className="text-sm">💥</span>
                        </div>
                      )}

                      {/* Enemigo Sombrío */}
                      {enemyHere && !isFireHere && (
                        <div className="absolute inset-0 flex items-center justify-center z-25 animate-pulse">
                          <span className="text-sm drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]">😈</span>
                        </div>
                      )}

                      {/* Jugador (Mario Recluta Bíblico) */}
                      {isPlayerHere && (
                        <div className={`absolute inset-0 flex items-center justify-center z-40 transition-transform ${
                          isJumping ? 'scale-125 -translate-y-2' : ''
                        } ${
                          isInvulnerable ? 'opacity-50 animate-pulse' : ''
                        }`}>
                          <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg ${
                            studentAuth?.isGodMode ? 'bg-yellow-500 border-2 border-white' :
                            shieldSec > 0 ? 'bg-cyan-500 border-2 border-white shadow-[0_0_15px_rgba(6,182,212,1)]' :
                            'bg-red-600 border border-yellow-300'
                          }`}>
                            <span className="text-xs sm:text-sm">
                              {studentAuth?.isGodMode ? '👑' : isJumping ? '🦘' : '🧔'}
                            </span>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })
              )}
            </div>

          </div>

          {/* Controles Táctiles para Móviles / Arcade */}
          <div className="w-full max-w-4xl mt-3 flex flex-wrap items-center justify-between gap-4 p-2 bg-[#0a0c16]/80 rounded-2xl border border-slate-800">
            
            {/* D-Pad Direccional */}
            <div className="grid grid-cols-3 gap-1.5 w-36 h-28 sm:w-44 sm:h-32 mx-auto sm:mx-0">
              <div></div>
              <button 
                onClick={() => movePlayer(0, -1, 'up')} 
                className="bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white font-black rounded-xl border border-slate-600 flex items-center justify-center text-lg active:scale-95 shadow cursor-pointer">
                ▲
              </button>
              <div></div>

              <button 
                onClick={() => movePlayer(-1, 0, 'left')} 
                className="bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white font-black rounded-xl border border-slate-600 flex items-center justify-center text-lg active:scale-95 shadow cursor-pointer">
                ◄
              </button>
              <div className="flex items-center justify-center text-[10px] text-slate-500 font-bold uppercase">
                D-PAD
              </div>
              <button 
                onClick={() => movePlayer(1, 0, 'right')} 
                className="bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white font-black rounded-xl border border-slate-600 flex items-center justify-center text-lg active:scale-95 shadow cursor-pointer">
                ►
              </button>

              <div></div>
              <button 
                onClick={() => movePlayer(0, 1, 'down')} 
                className="bg-slate-800 hover:bg-slate-700 active:bg-amber-600 text-white font-black rounded-xl border border-slate-600 flex items-center justify-center text-lg active:scale-95 shadow cursor-pointer">
                ▼
              </button>
              <div></div>
            </div>

            {/* Teclas explicativas */}
            <div className="hidden md:flex flex-col text-slate-400 text-xs gap-1 border-x border-slate-800 px-6">
              <p>🎮 <strong>Teclado:</strong> Flechas o W,A,S,D para moverte</p>
              <p>🦘 <strong>Espacio o J:</strong> Salto de Mario (Esquiva bombas y sombras)</p>
              <p>💣 <strong>B o K:</strong> Colocar Bomba Sagrada</p>
              <p>📜 <strong>Misión:</strong> Destruye bloques, consagra los 3 Altares y huye por el Portal</p>
            </div>

            {/* Botones de Acción de Arcade */}
            <div className="flex gap-3 mx-auto sm:mx-0">
              <button 
                onClick={dropBomb} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(239,68,68,0.5)] border-2 border-amber-300 flex flex-col items-center justify-center gap-1 cursor-pointer">
                <span className="text-2xl sm:text-3xl">💣</span>
                <span>BOMBA</span>
              </button>

              <button 
                onClick={triggerJump} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-b from-blue-500 to-indigo-700 hover:from-blue-400 hover:to-indigo-600 active:scale-95 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-cyan-300 flex flex-col items-center justify-center gap-1 cursor-pointer">
                <span className="text-2xl sm:text-3xl">🦘</span>
                <span>SALTAR</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ── 3. FASE: MODAL DE ENIGMA EN EL ALTAR SAGRADO ── */}
      {phase === 'enigma_modal' && activeAltarIdx !== null && (() => {
        const q = questions[activeAltarIdx % questions.length];
        return (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-gradient-to-b from-[#121528] to-[#0a0c16] border-2 border-purple-500/80 rounded-3xl p-6 md:p-10 max-w-3xl w-full shadow-[0_0_80px_rgba(168,85,247,0.3)] relative flex flex-col">
              
              <div className="flex justify-between items-center border-b border-purple-900/50 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-400 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    📜
                  </div>
                  <div>
                    <span className="text-purple-400 text-xs font-black uppercase tracking-widest">
                      ALTAR SAGRADO • ENIGMA {activeAltarIdx + 1} DE 3
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                      DESAFÍO ÉPICO DEL CLAN
                    </h3>
                  </div>
                </div>

                <span className="bg-purple-900/60 text-purple-300 text-xs font-black px-3 py-1.5 rounded-full border border-purple-500/40">
                  +50 XP AL RESPONDER
                </span>
              </div>

              {/* Pregunta Épica Narrativa */}
              <div className="bg-black/60 border border-purple-900/40 p-5 rounded-2xl mb-6 shadow-inner">
                <p className="text-slate-200 text-base md:text-lg font-medium leading-relaxed font-serif">
                  {q.q}
                </p>
              </div>

              {/* Opciones Interactivas */}
              <div className="space-y-3 mb-6">
                {q.options.map((opt, oIdx) => (
                  <button 
                    key={oIdx} 
                    disabled={enigmaAnswered} 
                    onClick={() => handleAnswerEnigma(oIdx)} 
                    className="w-full text-left bg-[#161a33] hover:bg-purple-900/50 border-2 border-purple-800/60 hover:border-purple-400 p-4 rounded-2xl text-sm md:text-base font-bold transition-all cursor-pointer flex items-center gap-4 group shadow-md hover:scale-[1.01]">
                    <span className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500 flex items-center justify-center font-black text-purple-300 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-slate-200 group-hover:text-white leading-relaxed">
                      {opt}
                    </span>
                  </button>
                ))}
              </div>

              {/* Feedback de error */}
              {enigmaError && (
                <div className="bg-red-950/80 border border-red-800 p-4 rounded-xl text-red-200 text-xs mb-4 text-center animate-in shake">
                  {enigmaError}
                </div>
              )}

              {/* Feedback de victoria */}
              {enigmaAnswered && (
                <div className="bg-emerald-950/80 border border-emerald-500 p-4 rounded-xl text-emerald-300 text-sm font-black text-center animate-in zoom-in">
                  ✨ ¡ALTAR SAGRADO CONSAGRADO! Has obtenido +50 XP y bendición de clan.
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* ── 4. FASE: VICTORIA ÉPICA Y BANDERÍN ── */}
      {phase === 'won' && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 animate-in zoom-in duration-500">
          <div className="max-w-2xl w-full bg-[#0d1020] border-4 border-yellow-400 rounded-3xl p-8 text-center relative overflow-hidden shadow-[0_0_100px_rgba(245,158,11,0.6)]">
            
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 animate-pulse"></div>

            <div className="w-24 h-24 mx-auto bg-gradient-to-b from-yellow-400 to-amber-600 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-bounce">
              🏆
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400 uppercase tracking-tight mb-2">
              ¡MISIÓN CUMPLIDA!
            </h2>
            <p className="text-amber-400 text-sm md:text-base font-black tracking-[0.3em] uppercase mb-6">
              HAS CONQUISTADO EL RETO BOMBERMAN & MARIO DE {mission.worldNum}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/60 p-4 rounded-2xl border border-amber-600/40 mb-8">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Tiempo</p>
                <p className="text-white text-lg font-black">{Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Monedas</p>
                <p className="text-yellow-400 text-lg font-black">🪙 {coins}</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Altares</p>
                <p className="text-purple-400 text-lg font-black">📜 3 / 3</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold">Total XP Ganado</p>
                <p className="text-emerald-400 text-lg font-black">+{scoreXP + 50} XP</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm italic mb-8 max-w-lg mx-auto font-serif">
              "El estandarte sagrado de tu clan ha sido alzado en lo alto de la fortaleza. Tu fidelidad ha honrado al salón {studentAuth?.aula}."
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setPhase('playing');
                  setLives(studentAuth?.isGodMode ? 999 : 3);
                  setSolvedAltars([false, false, false]);
                  setPlayerX(1);
                  setPlayerY(1);
                  setBombs([]);
                  setExplosions([]);
                }} 
                className="bg-purple-700 hover:bg-purple-600 text-white font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-all cursor-pointer hover:scale-105">
                🔄 REPETIR MISIÓN (MEJORAR PUNTUACIÓN)
              </button>

              <button 
                onClick={onExit} 
                className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all cursor-pointer hover:scale-105">
                ⬅️ REGRESAR AL PANEL DE MISIONES
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 5. FASE: DERROTA Y REINTENTO ── */}
      {phase === 'lost' && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in">
          <div className="max-w-md w-full bg-[#180a0a] border-2 border-red-700 rounded-3xl p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.5)]">
            <div className="w-20 h-20 mx-auto bg-red-950 rounded-2xl flex items-center justify-center text-4xl mb-4 border border-red-600 shadow-lg">
              💀
            </div>
            <h3 className="text-3xl font-black text-red-500 uppercase tracking-tight mb-2">
              CAÍDO EN COMBATE
            </h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Te quedaste sin vidas en el laberinto. Un verdadero líder se levanta del polvo y vuelve a intentar con mayor sabiduría.
            </p>

            <div className="space-y-3">
              <button 
                onClick={() => {
                  setPhase('playing');
                  setLives(studentAuth?.isGodMode ? 999 : 3);
                  setPlayerX(1);
                  setPlayerY(1);
                  setBombs([]);
                  setExplosions([]);
                }} 
                className="w-full bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all cursor-pointer">
                ❤️ REINTENTAR MISIÓN DESDE EL INICIO
              </button>

              <button 
                onClick={onExit} 
                className="w-full bg-black/60 hover:bg-slate-900 text-slate-400 hover:text-white border border-slate-700 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer">
                ⬅️ Salir al Panel de Misiones
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const classCodes = { 'EDER1A': '1A', 'EDER1B': '1B', 'EDER1C': '1C' };

export default function OdiseaBiblica() {

  // ── SISTEMA DE SEGURIDAD ANTICOPIA Y PROTECCIÓN INTELECTUAL ──
  useEffect(() => {
    // Deshabilitar clic derecho
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Bloquear atajos de teclado de inspección de código (F12, Ctrl+Shift+I, etc.)
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I, J, C
        ((e.metaKey || e.ctrlKey) && (e.keyCode === 85 || e.keyCode === 83)) // Ctrl+U (Ver código), Ctrl+S (Guardar)
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Advertencia legal en consola
    console.log(
      "%c🛡️ LA ODISEA BÍBLICA © 2026 - SISTEMA EDUCATIVO GAMIFICADO\nPropiedad Intelectual Protegida. Prohibida la copia, clonación o redistribución no autorizada.",
      "font-size: 16px; color: #f59e0b; font-weight: 900; background: #070913; padding: 12px 20px; border: 2px solid #f59e0b; border-radius: 8px;"
    );

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ── Auth & Profiles ──
  const [authView, setAuthView] = useState('login'); // login, register, dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSave, setCurrentSave] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [authError, setAuthError] = useState('');
  const [newSaveName, setNewSaveName] = useState('');
  const [usersDB, setUsersDB] = useState(() => loadFromStorage(STORAGE_KEY_USERS, {}));

  // ── Navigation ──
  const [view, setView] = useState('intro_master'); // Starts at auth
  const [selectedClass, setSelectedClass] = useState(null);


  // ── Student Auth & Solo Mode ──
  const [studentAuth, setStudentAuth] = useState(() => loadFromStorage('odisea_student_auth_session', null));
  const [activeSoloMission, setActiveSoloMission] = useState(0);
  const [studentLoginStep, setStudentLoginStep] = useState(1);
  const [teacherConnectedName, setTeacherConnectedName] = useState('Prof. Eder Carrasco');
  const [studentForm, setStudentForm] = useState({ name: '', aula: '1A', clanId: 'c1', password: '' });
  
  // ── Student Dashboard & TCG States ──
  const [studentTab, setStudentTab] = useState('misiones');
  const [openingPack, setOpeningPack] = useState(null);
  const [packStage, setPackStage] = useState('sealed');
  const [revealedPackCards, setRevealedPackCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [cardFilterCategory, setCardFilterCategory] = useState('all');
  const [inspectingCard, setInspectingCard] = useState(null);
  const [fullScreenCaptureMode, setFullScreenCaptureMode] = useState(false);
  const [activeCinematicModal, setActiveCinematicModal] = useState(null);

  const [studentProgress, setStudentProgress] = useState({
    shekels: 100,
    unlockedCards: [],
    completedMissions: {},
    packsOpened: 0
  });
  // ── Core Data (Loaded dynamically per save) ──
  const [roster, setRoster] = useState(defaultRoster);
  const [scores, setScores] = useState(defaultScores);
  const [newClassName, setNewClassName] = useState('');
  const [showTeacherKeysModal, setShowTeacherKeysModal] = useState(false);
  const [newClassroomGrade, setNewClassroomGrade] = useState('1ro de Secundaria');
  const [newClassroomSection, setNewClassroomSection] = useState('');

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

  // ── Misión 3, 4 y 5 ──
  const [startMision3Cinematic, setStartMision3Cinematic] = useState(false);
  const [m3Fase, setM3Fase] = useState(0);
  const [startMision4Cinematic, setStartMision4Cinematic] = useState(false);
  const [m4Fase, setM4Fase] = useState(0);
  const [m4SubTab, setM4SubTab] = useState('archivo');
  const [startMision5Cinematic, setStartMision5Cinematic] = useState(false);
  const [m5Fase, setM5Fase] = useState(0);
  const [m5SubTab, setM5SubTab] = useState('archivo');
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
    if (!clanId) return;
    setScores(prev => {
      const isMasterUser = Boolean(studentAuth?.isGodMode || studentAuth?.clanId === 'all' || clanId === 'all');
      
      // Si el que suma puntos es el Maestro o clanId es 'all', aplicar a TODOS los salones del docente
      let targetAulas = [];
      if (isMasterUser || aulaTarget === 'all' || !aulaTarget) {
        let customAulas = [];
        try {
          if (typeof getCurrentClassrooms === 'function') {
            customAulas = getCurrentClassrooms().map(c => c.id);
          }
        } catch (e) {}
        targetAulas = ['1A', '1B', '1C', ...customAulas];
      } else {
        targetAulas = [aulaTarget];
      }

      const uniqueAulas = [...new Set(targetAulas.filter(Boolean))];
      const newScores = { ...prev };

      uniqueAulas.forEach(aula => {
        const targetAulaScores = { ...(newScores[aula] || {}) };
        if (isMasterUser || clanId === 'all') {
          // Aplica a los 7 clanes sagrados por igual
          clansData.forEach(c => {
            targetAulaScores[c.id] = (targetAulaScores[c.id] || 0) + points;
          });
        } else {
          targetAulaScores[clanId] = (targetAulaScores[clanId] || 0) + points;
        }
        newScores[aula] = targetAulaScores;
      });

      updateFirebase('scores', newScores);
      return newScores;
    });
  };

  const resetToHome = () => {
    setView('selector');
    setStartMision1Cinematic(false); setStartMision2Cinematic(false); setStartMision3Cinematic(false); setStartMision4Cinematic(false); setStartMision5Cinematic(false);
    setStartGlobalCinematic(false); setShowInstructions(false);
    setM1Fase(0); setM2Fase(0); setM3Fase(0); setM4Fase(0); setM5Fase(0);
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

  
  const handleStudentAuth = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const { name, aula, clanId, password } = studentForm;
    if (!name) {
      alert("Por favor selecciona tu nombre de la lista.");
      return;
    }
    if (!clanId && name !== "EDER CARRASCO (MAESTRO)") {
      alert("Por favor selecciona tu clan.");
      return;
    }

    if (name === "EDER CARRASCO (MAESTRO)") {
      const enteredPass = (studentForm.masterPassword || password || '').trim();
      const validMaster = ['zamitoecsa', 'eder2026', 'eder2026yugijd', '1234', 'eder'];
      if (!validMaster.includes(enteredPass.toLowerCase())) {
        alert("❌ Contraseña de Maestro incorrecta. Por favor ingresa tu contraseña en el campo de maestro.");
        return;
      }
      setStudentAuth({
        name: "EDER CARRASCO (MAESTRO)",
        aula: aula || '1A',
        clanId: 'all',
        isGodMode: true,
        lives: 999
      });
      setView('student_dashboard');
      return;
    }

    const validCodes = ['ODISEA2026', 'EDER2026', 'EDER1A', 'EDER1B', 'EDER1C', '1A', '1B', '1C'];
    if (!validCodes.includes((password || '').trim().toUpperCase()) && (password || '').length < 3) {
      alert("❌ Clave de salón incorrecta. Pídesela a tu docente.");
      return;
    }

    const storageKey = `student_lives_${aula}_${name}`;
    const studentData = loadFromStorage(storageKey, { lives: 3, lockedUntil: 0 });
    
    if (studentData.lockedUntil && Date.now() < studentData.lockedUntil) {
      const remainingMs = studentData.lockedUntil - Date.now();
      const remainingHrs = Math.ceil(remainingMs / (1000 * 60 * 60));
      alert(`⛔ Has perdido todas tus vidas. Debes esperar ${remainingHrs} hora(s) para volver a jugar.`);
      return;
    }

    setStudentAuth({
      name,
      aula: aula || '1A',
      clanId,
      isGodMode: false,
      lives: studentData.lives || 3
    });
    setView('student_dashboard');
  };

  // ── PERSISTENCIA Y SINCRONIZACIÓN DEL ESTUDIANTE ──
  useEffect(() => {
    if (studentAuth) {
      try {
        localStorage.setItem('odisea_student_auth_session', JSON.stringify(studentAuth));
      } catch (e) {}
      const key = `odisea_progress_v3_${studentAuth.aula || '1A'}_${studentAuth.name || 'default'}`;
      const saved = loadFromStorage(key, {
        shekels: 100,
        unlockedCards: [],
        completedMissions: {},
        packsOpened: 0
      });
      setStudentProgress(saved);
    } else {
      try {
        localStorage.removeItem('odisea_student_auth_session');
      } catch (e) {}
    }
  }, [studentAuth]);

  const updateStudentProgress = useCallback((updater) => {
    setStudentProgress(prev => {
      const current = prev || { shekels: 100, unlockedCards: [], completedMissions: {}, packsOpened: 0 };
      const next = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
      if (studentAuth) {
        try {
          const key = `odisea_progress_v3_${studentAuth.aula || '1A'}_${studentAuth.name || 'default'}`;
          localStorage.setItem(key, JSON.stringify(next));
        } catch (e) {
          console.error('Error guardando progreso:', e);
        }
      }
      return next;
    });
  }, [studentAuth]);

  const downloadCardImage = useCallback((card) => {
    if (!card) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 1160; // Proporción áurea clásica Yu-Gi-Oh! (59x86 mm)
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // ── MARCO YU-GI-OH! SEGÚN ATRIBUTO Y TIPO ──
      let frameColor = '#8c4a1e'; // Naranja/Cobre Efecto
      let innerFrameColor = '#c27638';

      if (card.rarity === 'MÍTICA DIVINA' || card.frameStyle === 'divine') {
        frameColor = '#946c0d'; // Oro Dios Celestial
        innerFrameColor = '#f5c038';
      } else if (card.category === 'RELIQUIAS' || card.cardType === 'RELIQUIA ARCANA') {
        frameColor = '#134e4a'; // Mágica / Reliquia Verde
        innerFrameColor = '#14b8a6';
      } else if (card.rarity === 'SECRETA RARA') {
        frameColor = '#4c1d95'; // Violeta Secreto / Fusión
        innerFrameColor = '#8b5cf6';
      }

      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, 800, 1160);

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 14;
      ctx.strokeRect(10, 10, 780, 1140);

      ctx.strokeStyle = innerFrameColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 760, 1120);

      // Barra de Título
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(36, 36, 728, 80);
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 728, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px serif';
      ctx.textAlign = 'left';
      ctx.fillText(card.name?.toUpperCase() || 'HÉROE SAGRADO', 52, 90, 560);

      // Orbe de Atributo
      const orbX = 716;
      const orbY = 76;
      ctx.beginPath();
      ctx.arc(orbX, orbY, 32, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.attributeIcon || '🌟', orbX, orbY + 10);

      // Estrellas de Nivel (Level Stars)
      const starsCount = Math.min(12, Math.max(1, card.stars || 8));
      const starSpacing = 42;
      const startStarX = 720;
      const starY = 145;

      for (let s = 0; s < starsCount; s++) {
        const sx = startStarX - (s * starSpacing);
        ctx.beginPath();
        ctx.arc(sx, starY, 17, 0, 2 * Math.PI);
        ctx.fillStyle = '#ea580c';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = '22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⭐', sx, starY + 7);
      }

      // Cuadro de Arte Central Metálico
      ctx.fillStyle = '#030712';
      ctx.fillRect(56, 180, 688, 480);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 8;
      ctx.strokeRect(56, 180, 688, 480);

      const radialGrad = ctx.createRadialGradient(400, 420, 20, 400, 420, 320);
      radialGrad.addColorStop(0, card.rarity === 'MÍTICA DIVINA' ? '#f59e0b' : '#38bdf8');
      radialGrad.addColorStop(0.5, '#1e1b4b');
      radialGrad.addColorStop(1, '#050314');
      ctx.fillStyle = radialGrad;
      ctx.fillRect(60, 184, 680, 472);

      ctx.font = '160px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(card.icon || '⚔️', 400, 470);

      // Caja de Texto y Efecto (Pergamino Yu-Gi-Oh!)
      ctx.fillStyle = 'rgba(254, 243, 199, 0.95)';
      ctx.fillRect(48, 680, 704, 390);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeRect(48, 680, 704, 390);

      ctx.fillStyle = '#0f172a';
      ctx.font = '900 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(card.monsterType || '[GUERRERO / PROFETA / EFECTO]', 64, 715);

      ctx.fillStyle = '#78350f';
      ctx.font = 'italic bold 21px serif';
      const quoteWords = (card.quote || '').split(' ');
      let qLine = '';
      let curY = 750;
      for (let w of quoteWords) {
        const testLine = qLine + w + ' ';
        if (ctx.measureText(testLine).width > 660 && qLine) {
          ctx.fillText(qLine.trim(), 64, curY);
          qLine = w + ' ';
          curY += 28;
        } else {
          qLine = testLine;
        }
      }
      if (qLine) {
        ctx.fillText(qLine.trim(), 64, curY);
        curY += 30;
      }

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`« ${card.pasaje || ''} »`, 64, curY);
      curY += 34;

      ctx.fillStyle = '#1e1b4b';
      ctx.font = 'bold 20px sans-serif';
      const effWords = (`${card.effectName || '[EFECTO DEL PACTO]'} ${card.power || ''}`).split(' ');
      let effLine = '';
      for (let ew of effWords) {
        const testEff = effLine + ew + ' ';
        if (ctx.measureText(testEff).width > 660 && effLine) {
          ctx.fillText(effLine.trim(), 64, curY);
          effLine = ew + ' ';
          curY += 26;
        } else {
          effLine = testEff;
        }
      }
      if (effLine) {
        ctx.fillText(effLine.trim(), 64, curY);
      }

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(56, 1025);
      ctx.lineTo(744, 1025);
      ctx.stroke();

      ctx.fillStyle = '#059669';
      ctx.font = '900 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`VALOR CLAN: +${card.clanXP || 50} XP`, 64, 1055);

      ctx.fillStyle = '#000000';
      ctx.font = '900 28px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`ATK / ${card.atk || 2800}   DEF / ${card.def || 2400}`, 736, 1055);

      ctx.fillStyle = '#ffffff';
      ctx.font = '16px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${card.serialCode || 'ODISEA-ES001'} • 1ra Edición`, 48, 1100);

      const rName = studentAuth?.name ? studentAuth.name.toUpperCase() : 'RECLUTA SAGRADO';
      const rAula = studentAuth?.aula || '1A';
      const rClan = studentAuth?.isGodMode ? 'TODOS LOS CLANES (MODO MAESTRO)' : (clansData.find(c => c.id === studentAuth?.clanId)?.name || 'CLAN SAGRADO');
      
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(`CERTIFICADO: ${rName} • ${rClan} (${rAula}) • PROF. EDER CARRASCO © 2026`, 48, 1130);

      // Holograma Dorado Yu-Gi-Oh!
      const holoX = 720;
      const holoY = 1088;
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(holoX, holoY, 36, 36);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.strokeRect(holoX, holoY, 36, 36);

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SEAL', holoX + 18, holoY + 22);

      const a = document.createElement('a');
      a.download = `YUGIOH_${(card.name || 'CARTA').replace(/\s+/g, '_')}_${rName.replace(/\s+/g, '_')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch (err) {
      console.error('Error al generar tarjeta Yu-Gi-Oh!:', err);
      alert('Descarga no compatible directamente en este navegador. Usa el botón "Pantalla Completa" para tomar captura.');
    }
  }, [studentAuth]);

    const isEderUser = (user) => {
    if (!user) return false;
    const clean = user.toLowerCase().trim();
    return ['edercarrasco', 'eder carrasco', 'eder', 'ederinovadorpro', 'maestro', 'profesor', 'prof. eder'].includes(clean);
  };

  // ── GESTIÓN DINÁMICA DE SALONES DEL DOCENTE (NUEVOS DOCENTES EMPIEZAN DESDE 0) ──
  const getCurrentClassrooms = () => {
    if (!currentUser) return [];
    const isEder = isEderUser(currentUser);
    const saveObj = usersDB[currentUser]?.saves?.find(s => s.id === currentSave);
    if (saveObj?.classrooms && saveObj.classrooms.length > 0) {
      return saveObj.classrooms;
    }
    if (isEder) {
      return [
        { id: '1A', name: 'Salón 1A', grade: '1ro de Secundaria' },
        { id: '1B', name: 'Salón 1B', grade: '1ro de Secundaria' },
        { id: '1C', name: 'Salón 1C', grade: '1ro de Secundaria' }
      ];
    }
    return []; // Nuevos profesores empiezan con 0 salones para crear desde cero
  };

  const currentClassrooms = getCurrentClassrooms();

  const handleAddClassroom = (e) => {
    e.preventDefault();
    if (!newClassroomSection.trim()) return;
    const cleanId = newClassroomSection.trim().toUpperCase().replace(/\s+/g, '');
    const cleanName = `Salón ${newClassroomSection.trim().toUpperCase()}`;
    const newClassroom = {
      id: cleanId,
      name: cleanName,
      grade: newClassroomGrade
    };

    const newDb = { ...usersDB };
    if (newDb[currentUser]) {
      const saveIdx = newDb[currentUser].saves.findIndex(s => s.id === currentSave);
      if (saveIdx !== -1) {
        if (!newDb[currentUser].saves[saveIdx].classrooms) {
          newDb[currentUser].saves[saveIdx].classrooms = [
            { id: '1A', name: 'Salón 1A', grade: '1ro de Secundaria' },
            { id: '1B', name: 'Salón 1B', grade: '1ro de Secundaria' },
            { id: '1C', name: 'Salón 1C', grade: '1ro de Secundaria' }
          ];
        }
        if (!newDb[currentUser].saves[saveIdx].classrooms.some(c => c.id === cleanId)) {
          newDb[currentUser].saves[saveIdx].classrooms.push(newClassroom);
        }
      }
    }
    setUsersDB(newDb);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newDb));

    setScores(prev => ({
      ...prev,
      [cleanId]: { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 }
    }));
    setRoster(prev => ({
      ...prev,
      [cleanId]: { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] }
    }));

    setNewClassroomSection('');
    alert(`✅ ${cleanName} (${newClassroomGrade}) agregado con éxito.`);
  };

  const handleRemoveClassroom = (classId) => {
    if (currentClassrooms.length <= 1) {
      alert("Debes mantener al menos un salón activo.");
      return;
    }
    if (!confirm(`¿Estás seguro de eliminar el Salón ${classId}?`)) return;

    const newDb = { ...usersDB };
    if (newDb[currentUser]) {
      const saveIdx = newDb[currentUser].saves.findIndex(s => s.id === currentSave);
      if (saveIdx !== -1 && newDb[currentUser].saves[saveIdx].classrooms) {
        newDb[currentUser].saves[saveIdx].classrooms = newDb[currentUser].saves[saveIdx].classrooms.filter(c => c.id !== classId);
      }
    }
    setUsersDB(newDb);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newDb));
  };

  // ── Protección de Navegación: Evitar pantallas negras en Campamento Base ──
  useEffect(() => {
    if (view === 'campamento_base' && !selectedClass) {
      const defaultRoom = currentClassrooms[0]?.id || '1A';
      setSelectedClass(defaultRoom);
    }
  }, [view, selectedClass, currentClassrooms]);

  const isMissionActive = (view === 'mision1' && m1Fase > 0) || (view === 'mision2' && m2Fase > 0) || (view === 'mision3' && m3Fase > 0) || (view === 'mision4' && m4Fase > 0) || (view === 'mision5' && m5Fase > 0);

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] font-serif">LA ODISEA BÍBLICA</h1>
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
    const userClean = (loginForm.user || '').trim();
    const passClean = (loginForm.pass || '').trim();

    // Compatibilidad automática para el maestro Eder Carrasco
    const isEderUser = ['edercarrasco', 'eder carrasco', 'eder', 'ederinovadorpro', 'maestro', 'profesor', 'prof. eder'].includes(userClean.toLowerCase());
    const isEderPass = ['zamitoecsa', 'eder2026yugijd', 'eder2026', '1234', 'admin'].includes(passClean.toLowerCase());

    if (isEderUser && isEderPass) {
      const activeUser = usersDB['EderInovadorPro'] ? 'EderInovadorPro' : userClean;
      setCurrentUser(activeUser);
      setAuthError('');
      setAuthView('dashboard');
      return;
    }

    if (!usersDB[userClean] || usersDB[userClean].pass !== passClean) {
      setAuthError('Usuario o contraseña incorrectos.');
      return;
    }
    setCurrentUser(userClean);
    setAuthError('');
    setAuthView('dashboard');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const userClean = (loginForm.user || '').trim();
    const passClean = (loginForm.pass || '').trim();
    if (!userClean || !passClean) {
      setAuthError('Completa todos los campos.');
      return;
    }
    if (usersDB[userClean]) {
      setAuthError('El usuario ya existe. Inicia sesión con tus credenciales.');
      return;
    }
    const newSaveId = `save_${Date.now()}`;
    const newDb = {
      ...usersDB,
      [userClean]: {
        pass: passClean,
        name: userClean,
        saves: [
          {
            id: newSaveId,
            name: 'Mis Salones (Principal)',
            classrooms: [] // Empieza desde 0 salones
          }
        ]
      }
    };
    setUsersDB(newDb);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(newDb));
    setCurrentUser(userClean);
    setCurrentSave(newSaveId);
    setScores({});
    setRoster({});
    try {
      localStorage.setItem(`odiseaData_${userClean}_${newSaveId}`, JSON.stringify({ scores: {}, roster: {} }));
    } catch (err) {}
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
    setView('class_selector');
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
          
          <div className="relative z-10 w-full max-w-md bg-[#0a0c16]/90 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] relative">
            <button onClick={() => setView('selector')} className="absolute top-5 left-5 text-slate-500 hover:text-white flex items-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors">
              <ChevronRight className="rotate-180 w-4 h-4"/> VOLVER
            </button>

            <div className="text-center mb-8 mt-2">
              <Globe className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"/>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] font-serif">LA ODISEA BÍBLICA</h1>
              <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest md:tracking-[0.3em] mt-2">SISTEMA DE GESTIÓN DOCENTE</p>
            </div>

            {authView === 'login' || authView === 'register' ? (
              <form onSubmit={authView === 'login' ? handleLogin : handleRegister} className="space-y-4 animate-in fade-in duration-300">
                {authError && <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs p-3 rounded text-center font-bold">{authError}</div>}
                
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Usuario Docente</label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" required value={loginForm.user} onChange={e => setLoginForm({...loginForm, user: e.target.value})} className="w-full bg-[#111424] border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white text-sm outline-none focus:border-indigo-500 transition-colors" placeholder="Ej. Eder Carrasco o tu usuario" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Contraseña Maestra</label>
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
            {/* ════════════════════════════════════════════════════════════ */}
      {/* ── MODAL DE GESTIÓN DE CLAVES PARA EL DOCENTE ──────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {showTeacherKeysModal && (
        <div className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-300 select-none">
          <div className="bg-[#0a0c16] border-2 border-amber-500/50 rounded-3xl p-6 md:p-10 w-full max-w-3xl shadow-[0_0_80px_rgba(245,158,11,0.25)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            
            <button 
              onClick={() => setShowTeacherKeysModal(false)} 
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-black/60 hover:bg-red-600/80 p-2.5 rounded-full border border-slate-700 cursor-pointer transition-colors">
              <X className="w-5 h-5"/>
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-amber-500/20 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                <Key className="w-6 h-6"/>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">CONSOLA DE CLAVES TÁCTICAS</h3>
                <p className="text-amber-400 text-xs font-bold uppercase">Códigos para que tus estudiantes jueguen en Modo Solo</p>
              </div>
            </div>

            {/* Aviso para el Maestro */}
            <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl mb-6">
              <p className="text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-1">
                📢 RECORDATORIO PEDAGÓGICO PARA EL DOCENTE:
              </p>
              <p className="text-slate-300 text-xs leading-relaxed">
                Para que tus estudiantes jueguen en su celular o computadora en el <strong>Modo Estudiante</strong>, debes compartirles tu <strong>Clave de Acceso</strong> y las <strong>Contraseñas de cada Video</strong>. Los estudiantes verán el video obligatorio en Canva y luego escribirán la palabra clave para habilitar el nivel de Super Mario Bros.
              </p>
            </div>

            {/* 1. Clave de Conexión del Docente */}
            <div className="bg-[#111424] border border-slate-700 rounded-2xl p-5 mb-6">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest block mb-1">1. CLAVE DE CONEXIÓN DEL DOCENTE (PASO 1 DEL ALUMNO)</span>
              <p className="text-slate-400 text-xs mb-3">Es la clave que los alumnos colocan para conectarse a tu sala:</p>
              
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="bg-black border border-amber-500/50 rounded-xl px-6 py-3 font-mono font-black text-amber-400 text-xl tracking-[0.3em] text-center w-full sm:w-auto">
                  {currentUser === 'EderInovadorPro' ? 'EDER2026' : (currentUser || 'DOCENTE2026')}
                </div>
                <button 
                  onClick={() => {
                    const code = currentUser === 'EderInovadorPro' ? 'EDER2026' : (currentUser || 'DOCENTE2026');
                    navigator.clipboard.writeText(code);
                    alert(`✅ Clave "${code}" copiada al portapapeles.`);
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-black font-black uppercase px-4 py-3 rounded-xl text-xs tracking-wider cursor-pointer transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center">
                  📋 Copiar Clave
                </button>
              </div>
            </div>

            {/* 2. Contraseñas de Desbloqueo de Video */}
            <div className="bg-[#111424] border border-slate-700 rounded-2xl p-5 mb-6">
              <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest block mb-1">2. CONTRASEÑAS DE MISIONES (VIDEOS DE CANVA)</span>
              <p className="text-slate-400 text-xs mb-4">El estudiante mira el video obligatorio y luego ingresa esta palabra para jugar el reto Mario Bros:</p>
              
              <div className="space-y-2.5">
                {[
                  { m: 'Misión 1: Sacerdotes & Tabernáculo', pass: 'SANTIDAD', icon: '🏛️' },
                  { m: 'Misión 2: Los Jueces de Israel', pass: 'JUSTICIA', icon: '⚖️' },
                  { m: 'Misión 3: Los Reyes de Israel', pass: 'CORONA', icon: '👑' },
                  { m: 'Misión 4: Los Profetas y el Fuego', pass: 'FUEGO', icon: '🔥' },
                  { m: 'Misión 5: Heroínas de la Fe', pass: 'VALOR', icon: '🌸' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-black/60 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-white text-xs font-bold flex items-center gap-2">
                      <span>{item.icon}</span> {item.m}
                    </span>
                    <span className="bg-amber-950 border border-amber-600/50 text-amber-300 font-mono font-black text-xs px-3 py-1 rounded tracking-widest">
                      {item.pass}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botón para Copiar Todo Formateado */}
            <button 
              onClick={() => {
                const docCode = currentUser === 'EderInovadorPro' ? 'EDER2026' : (currentUser || 'DOCENTE2026');
                const text = `🎮 *LA ODISEA BÍBLICA - CLAVES PARA ESTUDIANTES* 🎮\n\n🔑 *Paso 1: Clave de Docente:* ${docCode}\n\n⚔️ *Contraseñas de Video para jugar Mario Bros:*\n• Misión 1 (Sacerdotes): SANTIDAD\n• Misión 2 (Jueces): JUSTICIA\n• Misión 3 (Reyes): CORONA\n• Misión 4 (Profetas): FUEGO\n• Misión 5 (Heroínas): VALOR\n\n¡Miren los videos en Canva y jueguen para sumar XP a sus clanes! 🦁🦅`;
                navigator.clipboard.writeText(text);
                alert("✅ Mensaje con todas las claves copiado al portapapeles. ¡Listo para pegar en Classroom o WhatsApp!");
              }}
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-wider py-4 rounded-xl text-xs md:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer transition-all flex items-center justify-center gap-2">
              📋 COPIAR TODAS LAS CLAVES PARA CLASSROOM / WHATSAPP
            </button>

          </div>
        </div>
      )}

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
                  {id: 5, title: 'GUÍA DOCENTE & MARIO', desc: 'Salones, Claves y Modo Solo', icon: GraduationCap, activeClass: 'bg-fuchsia-900/30 border-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.3)]', indicatorClass: 'bg-fuchsia-400 shadow-[0_0_10px_currentColor]', iconActiveClass: 'text-fuchsia-400 drop-shadow-[0_0_8px_currentColor]', descActiveClass: 'text-fuchsia-400/80'},
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

                            {instructionTab === 5 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-5xl mx-auto pb-10">
                  <div className="flex flex-col items-center text-center mb-10">
                    <GraduationCap className="w-16 h-16 text-fuchsia-400 mb-4 drop-shadow-[0_0_25px_rgba(217,70,239,0.8)]"/>
                    <h3 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-fuchsia-400 uppercase tracking-tighter drop-shadow-lg mb-2">
                      SISTEMA MULTIDOCENTE & MODO SOLO
                    </h3>
                    <p className="text-fuchsia-300 text-xs md:text-sm font-mono tracking-widest uppercase bg-fuchsia-950/40 px-4 py-1.5 rounded-full border border-fuchsia-500/30">
                      GUÍA OFICIAL DE GESTIÓN Y GAMIFICACIÓN
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0a0c16]/90 border border-indigo-900/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-indigo-950/60 rounded-xl flex items-center justify-center border border-indigo-500/40 text-indigo-400 mb-4">
                          <Users className="w-6 h-6"/>
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">1. CREACIÓN DE SALONES</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                          Cualquier nuevo docente puede crear carpetas por año escolar y <strong>agregar salones ilimitados</strong> seleccionando su grado (1ro a 5to de Secundaria o Primaria) y nombrando sus secciones personalizadas.
                        </p>
                      </div>
                      <span className="text-[10px] text-indigo-400 font-bold uppercase bg-indigo-950/50 p-2 rounded border border-indigo-800">
                        Totalmente personalizable
                      </span>
                    </div>

                    <div className="bg-[#0a0c16]/90 border border-amber-900/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-amber-950/60 rounded-xl flex items-center justify-center border border-amber-500/40 text-amber-400 mb-4">
                          <Key className="w-6 h-6"/>
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">2. CLAVES Y CANDADOS</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                          Para que los alumnos jueguen, el docente les da su <strong>Clave de Acceso</strong>. En cada misión, los alumnos miran el video obligatorio en Canva y colocan la <strong>palabra clave</strong> (ej. <em>SANTIDAD, JUSTICIA</em>) para desbloquear el nivel.
                        </p>
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold uppercase bg-amber-950/50 p-2 rounded border border-amber-800">
                        Atención pedagógica asegurada
                      </span>
                    </div>

                    <div className="bg-[#0a0c16]/90 border border-emerald-900/60 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 bg-emerald-950/60 rounded-xl flex items-center justify-center border border-emerald-500/40 text-emerald-400 mb-4">
                          <Gamepad2 className="w-6 h-6"/>
                        </div>
                        <h4 className="text-lg font-black text-white uppercase tracking-wider mb-2">3. RETO MARIO BROS</h4>
                        <p className="text-slate-400 text-xs leading-relaxed mb-4">
                          El alumno salta y golpea con la cabeza los bloques <strong>[ ? ]</strong> para acertar la pregunta bíblica. Cada acierto suma <strong>+50 XP</strong> directo a su Clan. Cuentan con 3 vidas; si caen, deben esperar 3 horas de descanso.
                        </p>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase bg-emerald-950/50 p-2 rounded border border-emerald-800">
                        Sincronización en tiempo real
                      </span>
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
      
      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── SELECCIÓN DE AULA (DESPUÉS DE LOGIN MAESTRO) ────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
            {view === 'class_selector' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#070913] min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[140px]"></div>
          </div>
          
          <div className="relative z-10 w-full max-w-4xl bg-[#0a0c16]/95 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 md:p-10 shadow-[0_0_60px_rgba(79,70,229,0.2)]">
            
            <div className="flex flex-col md:flex-row justify-between items-center border-b border-indigo-900/40 pb-6 mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-900/60 text-indigo-300 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-indigo-500/30">
                    PANEL DE GESTIÓN DOCENTE
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mt-1">
                  SELECCIONA TU SALÓN
                </h2>
                <p className="text-slate-400 text-xs md:text-sm">
                  Docente: <strong className="text-amber-400">{currentUser || 'Maestro'}</strong> • Carpeta: <strong className="text-white">{usersDB[currentUser]?.saves.find(s=>s.id===currentSave)?.name || 'Partida Activa'}</strong>
                </p>
              </div>

              <button 
                onClick={() => setView('auth')} 
                className="text-slate-400 hover:text-white bg-[#111424] border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors">
                <ChevronRight className="rotate-180 w-4 h-4"/> Volver a Carpetas
              </button>
            </div>

            {/* Grid de Salones del Docente */}
            <div className="mb-10">
              <h3 className="text-amber-400 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users className="w-4 h-4"/> TUS SALONES ACTIVOS ({currentClassrooms.length})
              </h3>
              
              {currentClassrooms.length === 0 ? (
                <div className="bg-[#111424] border-2 border-dashed border-indigo-500/40 rounded-2xl p-8 text-center my-4 shadow-inner animate-in fade-in">
                  <Users className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
                  <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider mb-2">
                    ¡Bienvenido Profesor {currentUser}!
                  </h4>
                  <p className="text-slate-300 text-xs md:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                    Tu sistema está listo desde cero (0 salones y 0 estudiantes precargados). Crea tu primer salón a continuación seleccionando el grado y la sección.
                  </p>
                  <div className="inline-block bg-indigo-950/80 border border-indigo-400/50 px-5 py-2.5 rounded-xl text-amber-300 text-xs font-black uppercase tracking-wider">
                    👇 Completa el formulario de abajo para agregar tu primer salón
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {currentClassrooms.map(aula => (
                    <div 
                      key={aula.id} 
                      className="group bg-[#111424] hover:bg-[#1a1e36] border-2 border-indigo-900/40 hover:border-indigo-400 rounded-2xl p-5 flex flex-col justify-between transition-all shadow-lg hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] relative overflow-hidden">
                      
                      <div className="flex justify-between items-start mb-4">
                        <span className="bg-indigo-950 text-indigo-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-indigo-700/50">
                          {aula.grade || '1ro de Secundaria'}
                        </span>
                        {currentClassrooms.length > 1 && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRemoveClassroom(aula.id); }} 
                            className="text-slate-600 hover:text-red-400 p-1 rounded transition-colors"
                            title="Eliminar salón">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="mb-6">
                        <h4 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider group-hover:text-amber-400 transition-colors">
                          {aula.name || `SALÓN ${aula.id}`}
                        </h4>
                        <p className="text-slate-400 text-xs mt-1">
                          {isEderUser(currentUser) 
                            ? (unassignedStudentsDB[aula.id]?.length || 0) 
                            : (roster[aula.id] ? Object.values(roster[aula.id]).flat().length : 0)
                          } estudiantes en base de datos
                        </p>
                      </div>

                      <button 
                        onClick={() => { 
                          setSelectedClass(aula.id); 
                          setView('campamento_base'); 
                          setActiveTab(1); 
                          setSorteoPaso('config');
                        }} 
                        className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white py-3 rounded-xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer">
                        ENTRAR AL AULA <Play className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Formulario para Agregar Nuevo Salón y Grado */}
            <form onSubmit={handleAddClassroom} className="bg-black/40 border border-slate-800 rounded-2xl p-6">
              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> CREAR / AGREGAR NUEVO SALÓN A TU CARPETA
              </h4>
              <p className="text-slate-400 text-xs mb-4">
                Puedes añadir salones de cualquier grado (1ro a 5to de Secundaria o Primaria) para gestionar sus clanes y notas.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">GRADO ACADÉMICO</label>
                  <select 
                    value={newClassroomGrade} 
                    onChange={e => setNewClassroomGrade(e.target.value)} 
                    className="w-full bg-[#111424] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-emerald-500">
                    <option value="1ro de Secundaria">1ro de Secundaria</option>
                    <option value="2do de Secundaria">2do de Secundaria</option>
                    <option value="3ro de Secundaria">3ro de Secundaria</option>
                    <option value="4to de Secundaria">4to de Secundaria</option>
                    <option value="5to de Secundaria">5to de Secundaria</option>
                    <option value="6to de Primaria">6to de Primaria</option>
                    <option value="5to de Primaria">5to de Primaria</option>
                    <option value="Educación Religiosa">Educación Religiosa</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">NOMBRE O SECCIÓN DEL SALÓN</label>
                  <input 
                    type="text" 
                    required 
                    value={newClassroomSection} 
                    onChange={e => setNewClassroomSection(e.target.value)} 
                    placeholder="Ej. 2A, 3B, San Juan, etc." 
                    className="w-full bg-[#111424] border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-end">
                  <button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4"/> AGREGAR SALÓN
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}
{view === 'intro_master' && (
        <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden bg-black">
          <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-amber-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.2)] group hover:scale-105 transition-transform">
            <div className="absolute top-0 left-0 w-full bg-amber-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> DALE PLAY AQUÍ</div>
            <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHRVWYddvQ/QXO9us7EGIsOpJtL_MmRsA/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
          </div>

          {!startGlobalCinematic ? (
            <div className="relative z-10 text-center flex flex-col items-center animate-in fade-in duration-1000 px-4">
              <Globe className="w-16 h-16 text-amber-500 mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"/>
              <p className="text-amber-500 text-xs md:text-sm tracking-widest md:tracking-[0.2em] font-bold uppercase text-center leading-relaxed mb-8">
                INSTRUCCIÓN GM: 1) ACTIVA EL AUDIO EN LA ESQUINA SUPERIOR. <br/>2) LUEGO INICIA LA SECUENCIA O ENTRA DIRECTAMENTE AL PORTAL.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                <button 
                  onClick={() => setStartGlobalCinematic(true)} 
                  className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest md:tracking-[0.2em] text-sm md:text-base transition-all cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 flex items-center gap-2">
                  <Play className="w-5 h-5 fill-black"/> INICIAR SECUENCIA ÉPICA
                </button>
                <button 
                  onClick={() => { setStartGlobalCinematic(false); setView('selector'); }} 
                  className="bg-black/60 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-900 hover:border-amber-500 px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs md:text-sm transition-all cursor-pointer flex items-center gap-2">
                  ENTRAR DIRECTAMENTE AL PORTAL <ChevronRight className="w-5 h-5"/>
                </button>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none bg-black overflow-hidden">
              {/* Botón para saltar intro en cualquier momento */}
              <button 
                onClick={() => { setStartGlobalCinematic(false); setView('selector'); }} 
                className="absolute top-4 left-4 z-[300] pointer-events-auto bg-black/80 hover:bg-amber-950/80 border border-amber-600/50 text-amber-300 hover:text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all backdrop-blur-md">
                OMITIR INTRODUCCIÓN ⏭️
              </button>

              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2000')] bg-cover bg-center opacity-40 animate-[slowZoom_35s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-screen animate-[slowZoom_20s_linear_infinite_alternate]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80 z-10"></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 1s' }}><p className="text-2xl md:text-4xl text-slate-300 uppercase tracking-widest md:tracking-[0.4em] font-light drop-shadow-lg">El tiempo y el espacio...</p><p className="text-xl md:text-2xl text-amber-500/70 uppercase tracking-widest md:tracking-[0.6em] font-light mt-6">se han fracturado.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 7s ease-out forwards 8s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-amber-500 uppercase tracking-widest md:tracking-[0.2em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)]">EL AULA HA DESAPARECIDO.</p><p className="text-xl md:text-2xl text-amber-200 uppercase tracking-widest md:tracking-[0.4em] font-light mt-6">Olviden quiénes creían ser.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 15s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-indigo-400 uppercase tracking-widest md:tracking-[0.3em] font-bold drop-shadow-[0_0_30px_rgba(129,140,248,0.8)]">DESDE LAS SOMBRAS DEL PASADO...</p><p className="text-lg md:text-2xl text-indigo-200 uppercase tracking-widest md:tracking-[0.4em] font-light mt-6 leading-relaxed">Su verdadero destino los reclama.<br/>La sangre de reyes y profetas despierta.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 8s ease-out forwards 23s' }}><p className="text-2xl md:text-4xl text-slate-100 uppercase tracking-widest md:tracking-[0.5em] font-light drop-shadow-2xl">Siete linajes se levantarán del polvo.</p><p className="text-2xl md:text-4xl lg:text-5xl text-amber-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)] mt-6">HOY, EL DESIERTO EXIGE SU PODER.</p></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 4s ease-out forwards 31s' }}>
                <Globe className="w-24 h-24 text-amber-500 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(245,158,11,0.8)] animate-pulse" />
                <h1 className="text-3xl md:text-6xl lg:text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-400 to-amber-900 tracking-widest md:tracking-[0.15em] uppercase drop-shadow-[0_0_80px_rgba(245,158,11,1)] font-serif" style={{ WebkitTextStroke: "3px rgba(0,0,0,0.9)" }}>LA ODISEA BÍBLICA</h1>
                <p className="text-amber-500 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase drop-shadow-md">FORJANDO LÍDERES EN EL DESIERTO</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 35s' }}>
                <button onClick={() => { setStartGlobalCinematic(false); setView('selector'); }} className="bg-[#0f0a06]/80 border-2 border-amber-500 text-amber-300 px-12 py-6 font-black uppercase tracking-widest md:tracking-[0.5em] text-xl transition-all shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-110 hover:shadow-[0_0_80px_rgba(245,158,11,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">ENTRAR AL PORTAL <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── SELECTOR ────────────────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'selector' && (
        <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#070913] min-h-screen">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"><div className="w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div></div>
          
          <div className="relative z-10 w-full max-w-6xl flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl lg:text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-4 tracking-tighter uppercase drop-shadow-xl text-center leading-none">LA ODISEA BÍBLICA</h1>
            <p className="text-indigo-400 text-xs md:text-lg tracking-[0.4em] font-black uppercase mb-12 drop-shadow text-center">SELECCIONA TU PORTAL DE ACCESO</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* PORTAL MAESTRO */}
              <div className="bg-[#0f111a]/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border-2 border-indigo-900/50 shadow-[0_0_50px_rgba(79,70,229,0.2)] hover:shadow-[0_0_80px_rgba(79,70,229,0.4)] transition-all duration-500 group flex flex-col items-center text-center">
                <Crown className="w-20 h-20 text-indigo-500 mb-6 drop-shadow-[0_0_20px_rgba(79,70,229,0.8)] group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">ACCESO MAESTRO</h2>
                <p className="text-slate-400 text-sm mb-10 h-10">Control del proyector principal, gestión de XP y dirección de misiones en vivo.</p>
                <button onClick={() => setView('auth')} className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-lg shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all cursor-pointer border border-indigo-400 mt-auto">
                  INICIAR SESIÓN DOCENTE
                </button>
              </div>

              {/* PORTAL ESTUDIANTE */}
              <div className="bg-[#1a0505]/90 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 border-2 border-red-900/50 shadow-[0_0_50px_rgba(220,38,38,0.2)] hover:shadow-[0_0_80px_rgba(220,38,38,0.4)] transition-all duration-500 group flex flex-col items-center text-center">
                <Gamepad2 className="w-20 h-20 text-red-500 mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] group-hover:scale-110 transition-transform" />
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">MODO ESTUDIANTE</h2>
                <p className="text-slate-400 text-sm mb-10 h-10">Juega misiones individuales en tu celular. <span className="text-red-400 font-bold">¡Tus victorias y derrotas afectarán el puntaje de tu clan!</span></p>
                <button onClick={() => setView('student_login')} className="w-full bg-gradient-to-r from-red-800 to-red-600 hover:from-red-600 hover:to-red-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-lg shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all cursor-pointer border border-red-400 mt-auto">
                  ENTRAR AL MODO SOLO
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-12 w-full">
              <button onClick={() => setView('global_ranking')} className="bg-gradient-to-r from-orange-900 to-amber-700 text-white px-8 py-4 font-black uppercase tracking-[0.2em] text-xs md:text-sm transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] rounded-full cursor-pointer border border-amber-500 flex items-center gap-2"><Globe className="w-5 h-5"/> CLASIFICACIÓN MULTIVERSO</button>
              <button onClick={() => setShowInstructions(true)} className="bg-[#05060b] border border-cyan-500/50 text-cyan-400 hover:text-white px-8 py-4 font-bold uppercase tracking-widest text-xs transition-all rounded-full cursor-pointer flex items-center gap-2"><Hexagon className="w-5 h-5"/> MANUAL TÁCTICO</button>
            </div>
          </div>
        </div>
      )}
      
      {/* ════════════════════════════════════════════════════════════ */}
      {/* ── STUDENT LOGIN & DASHBOARD ───────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
            {view === 'student_login' && (
        <div className="flex-grow flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2000')] bg-cover bg-center relative min-h-screen">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>
          <div className="relative z-10 bg-[#0a0c16]/95 border border-red-900/50 p-6 md:p-10 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.3)] my-8">
            <button onClick={() => setView('selector')} className="absolute top-4 left-4 text-slate-500 hover:text-white flex items-center text-xs font-bold uppercase tracking-widest cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> VOLVER</button>
            
            <div className="text-center mb-6 mt-2">
              <ShieldAlert className="w-14 h-14 text-red-500 mx-auto mb-2 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest">IDENTIFICACIÓN</h2>
              <p className="text-red-400 text-xs font-mono mt-1 uppercase">SISTEMA DE SINCRONIZACIÓN DE CLANES</p>
            </div>

            {studentLoginStep === 1 ? (
              /* PASO 1: CONECTAR A LA SALA DEL DOCENTE */
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="bg-red-950/30 border border-red-500/30 p-4 rounded-2xl text-center">
                  <Key className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wider mb-1">PASO 1: CONEXIÓN CON TU DOCENTE</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Cada maestro tiene su propia sala y salones. Ingresa la clave o código que te dio tu profesor para conectar a su base de datos.
                  </p>
                </div>

                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2 block">CLAVE O CÓDIGO DEL DOCENTE</label>
                  <input 
                    type="text" 
                    value={studentForm.password || ''} 
                    onChange={e => setStudentForm(prev => ({...prev, password: e.target.value}))} 
                    placeholder="Ej. EDER2026, EDER1A, o ZAMITOECSA" 
                    className="w-full bg-black/70 border border-slate-700 rounded-xl px-4 py-3.5 text-white text-center font-mono text-base tracking-[0.2em] focus:border-red-500 focus:outline-none transition-colors uppercase"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 text-center">Para las clases del Prof. Eder Carrasco: ingresa <strong>EDER2026</strong> o el código de tu salón.</p>
                </div>

                <button 
                  type="button"
                  onClick={() => {
                    const pass = (studentForm.password || '').trim().toUpperCase();
                    if (!pass) {
                      alert("Por favor ingresa la clave de tu docente.");
                      return;
                    }
                    if (pass === 'ZAMITOECSA' || pass === 'EDER2026YUGIJD') {
                      setStudentAuth({
                        name: "EDER CARRASCO (MAESTRO)",
                        aula: '1A',
                        clanId: 'all',
                        isGodMode: true,
                        lives: 999
                      });
                      setView('student_dashboard');
                      return;
                    }
                    if (pass === 'MAESTRO') {
                      setTeacherConnectedName('Prof. Eder Carrasco');
                      setStudentForm(prev => ({...prev, name: "EDER CARRASCO (MAESTRO)", clanId: "all"}));
                      setStudentLoginStep(2);
                      return;
                    }
                    // Validar profesor
                    if (pass.includes('EDER') || pass === '1A' || pass === '1B' || pass === '1C' || pass === 'ODISEA2026') {
                      setTeacherConnectedName('Prof. Eder Carrasco');
                      if (pass === 'EDER1A' || pass === '1A') setStudentForm(prev => ({...prev, aula: '1A'}));
                      if (pass === 'EDER1B' || pass === '1B') setStudentForm(prev => ({...prev, aula: '1B'}));
                      if (pass === 'EDER1C' || pass === '1C') setStudentForm(prev => ({...prev, aula: '1C'}));
                      setStudentLoginStep(2);
                    } else if (usersDB[studentForm.password]) {
                      setTeacherConnectedName(`Prof. ${studentForm.password}`);
                      setStudentLoginStep(2);
                    } else {
                      // Permitir ingresar con confirmación
                      setTeacherConnectedName('Prof. Eder Carrasco');
                      setStudentLoginStep(2);
                    }
                  }}
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-[1.02]">
                  CONECTAR A LA SALA
                </button>
              </div>
            ) : (
              /* PASO 2: SELECCIÓN DE SALÓN, NOMBRE Y CLAN */
              <form onSubmit={handleStudentAuth} className="space-y-4 animate-in slide-in-from-right duration-300">
                <div className="bg-emerald-950/40 border border-emerald-500/40 p-2.5 rounded-xl flex items-center justify-between">
                  <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {teacherConnectedName}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setStudentLoginStep(1)} 
                    className="text-slate-400 hover:text-white text-[10px] uppercase font-bold underline cursor-pointer">
                    Cambiar
                  </button>
                </div>

                {/* 1. SELECCIÓN DE SALÓN (1A, 1B, 1C) */}
                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 block">1. SELECCIONA TU SALÓN</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1A', '1B', '1C'].map(aula => (
                      <button
                        type="button"
                        key={aula}
                        onClick={() => setStudentForm(prev => ({ ...prev, aula, name: '' }))}
                        className={`py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer border ${(studentForm.aula || '1A') === aula ? 'bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.6)] scale-[1.02]' : 'bg-black/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'}`}
                      >
                        SALÓN {aula}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. SELECCIÓN DE NOMBRE DE LA LISTA */}
                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 block">2. TUS APELLIDOS Y NOMBRES</label>
                  <select 
                    value={studentForm.name} 
                    onChange={e => {
                      const val = e.target.value;
                      if (val === "EDER CARRASCO (MAESTRO)") {
                         setStudentForm(prev => ({...prev, name: val, clanId: "all"}));
                      } else {
                         setStudentForm(prev => ({...prev, name: val, clanId: prev.clanId === 'all' ? '' : prev.clanId}));
                      }
                    }} 
                    required
                    className="w-full bg-black/70 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                  >
                    <option value="" disabled>Selecciona tu nombre de la lista...</option>
                    <option value="EDER CARRASCO (MAESTRO)" className="text-amber-400 font-bold bg-[#1a1202]">⭐ EDER CARRASCO (MAESTRO)</option>
                    {(unassignedStudentsDB[studentForm.aula || '1A'] || []).map(name => (
                      <option key={name} value={name} className="bg-[#0a0c16]">{name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Lista oficial de Siaweb cargada para {studentForm.aula || '1A'}.</p>
                </div>

                {/* 3. SELECCIÓN DE CLAN */}
                <div>
                  <label className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 block">3. TU CLAN SAGRADO</label>
                  <select 
                    value={studentForm.clanId} 
                    onChange={e => setStudentForm(prev => ({...prev, clanId: e.target.value}))} 
                    disabled={studentForm.name === "EDER CARRASCO (MAESTRO)"}
                    required
                    className="w-full bg-black/70 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:border-red-500 focus:outline-none transition-colors"
                  >
                    {studentForm.name === "EDER CARRASCO (MAESTRO)" ? (
                      <option value="all">⚡ TODOS LOS CLANES (MODO MAESTRO)</option>
                    ) : (
                      <>
                        <option value="" disabled>Selecciona a qué clan perteneces...</option>
                        <option value="c1" className="bg-[#0a0c16]">🦁 Leones de Judá</option>
                        <option value="c2" className="bg-[#0a0c16]">🦅 Águilas de Isaías</option>
                        <option value="c3" className="bg-[#0a0c16]">⚔️ Guerreros de Josué</option>
                        <option value="c4" className="bg-[#0a0c16]">📜 Sabios de Salomón</option>
                        <option value="c5" className="bg-[#0a0c16]">🛡️ Centinelas de Nehemías</option>
                        <option value="c6" className="bg-[#0a0c16]">💧 Valientes de David</option>
                        <option value="c7" className="bg-[#0a0c16]">🔥 Llamas de Elías</option>
                      </>
                    )}
                  </select>
                </div>

                {/* 4. CAMPO DE CONTRASEÑA DE MAESTRO */}
                {studentForm.name === "EDER CARRASCO (MAESTRO)" && (
                  <div className="bg-amber-950/50 border-2 border-amber-500 rounded-2xl p-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-in zoom-in-95 duration-200">
                    <label className="text-amber-400 text-xs font-black uppercase tracking-widest mb-1.5 flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400 animate-pulse" /> INGRESA TU CONTRASEÑA DE MAESTRO
                    </label>
                    <input 
                      type="password" 
                      required
                      value={studentForm.masterPassword || ''} 
                      onChange={e => setStudentForm(prev => ({...prev, masterPassword: e.target.value}))} 
                      placeholder="Escribe tu contraseña maestra aquí..." 
                      className="w-full bg-black/80 border border-amber-500 rounded-xl px-4 py-3 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors font-mono tracking-wider"
                      autoFocus
                    />
                    <p className="text-[10px] text-amber-300/80 mt-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400 shrink-0" /> Acceso exclusivo con 999 vidas y desbloqueo de todos los clanes.
                    </p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl mt-4 transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:scale-[1.02]">
                  ENTRAR A LAS MISIONES
                </button>
              </form>
            )}
          </div>
        </div>
      )}
{view === 'student_dashboard' && (
        !studentAuth ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 bg-[#050711] min-h-screen text-center">
            <div className="bg-[#0e1224] border-2 border-amber-500/60 rounded-3xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.3)]">
              <ShieldAlert className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-pulse" />
              <h3 className="text-2xl font-black text-white uppercase tracking-wider mb-2">IDENTIFICACIÓN REQUERIDA</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Para acceder a las misiones, tu álbum y la tienda de sobres, debes ingresar con tu nombre y clan.
              </p>
              <button 
                onClick={() => setView('student_login')} 
                className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer">
                ENTRAR CON MI RECLUTA
              </button>
            </div>
          </div>
        ) : (
        <div className="flex-grow flex flex-col p-3 sm:p-6 md:p-8 bg-[#050711] min-h-screen relative overflow-hidden select-none">
          {/* Fondo estético celestial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#070913] to-[#030408] pointer-events-none"></div>

          {/* ── HEADER PRINCIPAL DEL RECLUTA ── */}
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center bg-[#0d1022]/90 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border-2 border-indigo-900/50 shadow-2xl mb-6 gap-4 max-w-6xl mx-auto w-full">
             <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-4xl border-2 border-amber-500/60 bg-black shadow-[0_0_25px_rgba(245,158,11,0.4)] shrink-0">
                  {studentAuth.isGodMode ? '👑' : (clansData.find(c=>c.id===studentAuth.clanId)?.icon || '🛡️')}
                </div>
                <div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="bg-indigo-900/60 text-indigo-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                      RECLUTA OFICIAL
                    </span>
                    <span className="bg-amber-950/60 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      SALÓN {studentAuth.aula}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">{studentAuth.name}</h2>
                  <p className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-400">
                    {studentAuth.isGodMode ? 'MODO MAESTRO MULTIVERSAL' : `CLAN ${clansData.find(c=>c.id===studentAuth.clanId)?.name || 'SAGRADO'}`}
                  </p>
                </div>
             </div>
             
             {/* Indicadores de Economía y Colección */}
             <div className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-center">
                <div className="bg-black/60 border border-red-500/40 px-4 sm:px-6 py-2.5 rounded-2xl text-center shadow-lg">
                   <p className="text-red-400/80 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">VIDAS</p>
                   <p className="text-red-400 text-xl sm:text-2xl font-black">{studentAuth.isGodMode ? '❤️ x 999' : `❤️ x ${Math.max(0, studentAuth.lives || 3)}`}</p>
                </div>
                <div className="bg-black/60 border border-yellow-500/40 px-4 sm:px-6 py-2.5 rounded-2xl text-center shadow-lg">
                   <p className="text-yellow-400/80 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">MONEDAS (SHEKELS)</p>
                   <p className="text-yellow-400 text-xl sm:text-2xl font-black">🪙 {studentProgress.shekels || 0}</p>
                </div>
                <div className="bg-black/60 border border-purple-500/40 px-4 sm:px-6 py-2.5 rounded-2xl text-center shadow-lg">
                   <p className="text-purple-300/80 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">ÁLBUM SAGRADO</p>
                   <p className="text-purple-300 text-xl sm:text-2xl font-black">🃏 {studentProgress.unlockedCards?.length || 0} / 24</p>
                </div>
                <div className="bg-black/60 border border-amber-500/40 px-4 sm:px-6 py-2.5 rounded-2xl text-center shadow-lg">
                   <p className="text-amber-500/80 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">XP CLAN ({studentAuth.aula})</p>
                   <p className="text-amber-400 text-xl sm:text-2xl font-black">
                     {studentAuth.isGodMode ? 'TODOS' : (scores[studentAuth.aula]?.[studentAuth.clanId] || 0)}
                   </p>
                </div>
             </div>
          </div>

          {/* ── BARRA DE PESTAÑAS PRINCIPALES DEL ESTUDIANTE ── */}
          <div className="relative z-10 max-w-6xl mx-auto w-full mb-8 flex justify-center">
            <div className="bg-[#0b0e1e]/90 p-1.5 rounded-2xl border border-indigo-900/60 shadow-xl flex flex-wrap gap-1.5 justify-center">
              {[
                { id: 'misiones', label: '🎮 MISIONES DE AVENTURA', desc: 'Bomberman & Mario' },
                { id: 'tienda', label: '🛍️ TIENDA SAGRADA', desc: 'Sobres de Cartas 📦' },
                { id: 'album', label: '🃏 MI ÁLBUM SAGRADO', desc: 'Colección & Captura 📸' },
                { id: 'cinematicas', label: '🎬 HISTORIA & BSO', desc: 'Cinemáticas Épicas' },
                { id: 'ranking', label: '🏆 SALÓN DE LA FAMA', desc: 'Clasificación Global' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'ranking') setView('global_ranking');
                    else setStudentTab(tab.id);
                  }}
                  className={`px-4 sm:px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center ${
                    studentTab === tab.id
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] scale-105'
                      : 'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}>
                  <span>{tab.label}</span>
                  <span className={`text-[9px] font-bold ${studentTab === tab.id ? 'text-black/80' : 'text-slate-500'}`}>{tab.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── PESTAÑA 1: MISIONES DE AVENTURA (BOMBERMAN & MARIO) ──── */}
          {/* ════════════════════════════════════════════════════════════ */}
          {studentTab === 'misiones' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
              <div className="text-center md:text-left mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-indigo-900/40 pb-4">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Gamepad2 className="w-8 h-8 text-amber-500"/> MISIONES DEL ANTIGUO TESTAMENTO
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Supera los 5 mundos de aventura Bomberman & Mario. Los puntos de clan (+100 XP) solo se otorgan la <strong>primera vez</strong>; pero puedes rejugarlos para conseguir <strong>Monedas del Templo 🪙</strong> para comprar sobres en la Tienda.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-black px-4 py-2 rounded-xl uppercase">
                    5 NIVELES ÉPICOS
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                {soloMissions.map((m, idx) => {
                  const isCleared = studentProgress.completedMissions?.[m.id];
                  return (
                    <div key={m.id} className="bg-gradient-to-br from-[#0c0f1f] to-[#070913] border-2 border-indigo-950 hover:border-amber-500/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl transition-all group">
                       <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl bg-black border-2 border-amber-600/50 flex flex-col items-center justify-center shadow-[inset_0_0_20px_rgba(245,158,11,0.3)] relative">
                          <span className="text-3xl md:text-4xl font-black text-yellow-400">{m.worldNum}</span>
                          <span className="text-[9px] font-black text-amber-400 tracking-wider uppercase mt-1">💣 BOMBERMAN</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">🦘 & MARIO</span>
                          {isCleared && (
                            <div className="absolute top-1 right-1 bg-emerald-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full">
                              ✓ SUPERADO
                            </div>
                          )}
                       </div>

                       <div className="flex-grow text-center md:text-left">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1.5">
                            <span className="bg-amber-900/40 text-amber-300 text-[10px] font-black px-3 py-0.5 rounded uppercase tracking-wider border border-amber-700/50">
                              VIDEO + LABERINTO
                            </span>
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">• {m.theme}</span>
                            {isCleared && (
                              <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded border border-emerald-500/40 uppercase">
                                ⭐ CLAN XP OBTENIDO (1 VEZ)
                              </span>
                            )}
                          </div>
                          <h4 className="text-xl md:text-2xl font-black text-white uppercase group-hover:text-amber-400 transition-colors">{m.title}</h4>
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed my-2 italic">"{m.lore}"</p>
                          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-3">
                            <span className="text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                              <Trophy className="w-4 h-4"/> 1° TRIUNFO: +100 XP CLAN
                            </span>
                            <span className="text-yellow-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                              🪙 REJUGAR: +50 MONEDAS
                            </span>
                            <span className="text-purple-400 text-xs font-black uppercase tracking-widest flex items-center gap-1">
                              📜 3 ALTARES
                            </span>
                          </div>
                       </div>

                       <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full md:w-auto">
                         <button 
                           onClick={() => { setActiveSoloMission(idx); setView('student_mario_game'); }} 
                           className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-wider px-6 py-4 rounded-2xl text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] cursor-pointer hover:scale-105 transition-all flex items-center justify-center gap-2">
                           <Gamepad2 className="w-5 h-5"/> {isCleared ? '🔄 REPETIR POR MONEDAS 🪙' : '🎮 JUGAR AVENTURA'}
                         </button>

                         <button 
                           onClick={() => setActiveCinematicModal(m)} 
                           className="bg-black/70 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2">
                           <Play className="w-4 h-4 text-amber-400"/> VER INTRO CON BSO
                         </button>
                       </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── PESTAÑA 2: TIENDA SAGRADA & SOBRES DE CARTAS (BOOSTERS) ─ */}
          {/* ════════════════════════════════════════════════════════════ */}
          {studentTab === 'tienda' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
              <div className="text-center md:text-left mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-indigo-900/40 pb-6">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 uppercase tracking-tight flex items-center gap-3">
                    🛍️ MERCADO SAGRADO DEL TEMPLO & CAJAS DE AVENTURA
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                    Canjea tus Monedas del Templo 🪙 para abrir <strong>Sobres Bíblicos</strong> y <strong>Cajas Místicas de Aventura</strong> estilo Yu-Gi-Oh!. Cada carta nueva desbloqueada otorga <strong>puntos de XP inmediatos y directos a tu Clan</strong> (¡o a todos los clanes si juegas como Maestro!).
                  </p>
                </div>
                <div className="bg-[#121528] border-2 border-yellow-500/60 p-4 rounded-2xl text-center shadow-lg">
                  <p className="text-yellow-400/80 text-[10px] font-black uppercase tracking-widest">TU SALDO DE SHEKELS</p>
                  <p className="text-2xl sm:text-3xl font-black text-yellow-400">🪙 {studentProgress.shekels || 0} MONEDAS</p>
                  {studentAuth?.isGodMode && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase mt-1 inline-block border border-amber-500/40">
                      👑 MODO MAESTRO: PUNTOS A TODOS LOS CLANES
                    </span>
                  )}
                </div>
              </div>

              {/* ── SECCIÓN 1: SOBRES CLÁSICOS DE LA ALIANZA ── */}
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📦</span>
                  <div>
                    <h4 className="text-xl font-black text-white uppercase tracking-wider">SOBRES DE CARTAS BÍBLICAS (3 CARTAS)</h4>
                    <p className="text-slate-400 text-xs">Aperturas tácticas para expandir la base de tu colección sagrada.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {packStoreCatalog.filter(p => p.type === 'sobre').map((pack) => {
                    const canAfford = (studentProgress.shekels || 0) >= pack.price;
                    return (
                      <div key={pack.id} className={`bg-gradient-to-b ${pack.gradient} border-2 ${pack.border} rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group shadow-2xl transition-all hover:scale-[1.02]`}>
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`${pack.badge} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow`}>
                              {pack.tier}
                            </span>
                            <span className="text-4xl group-hover:scale-110 transition-transform">{pack.icon}</span>
                          </div>

                          <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{pack.name}</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mb-4">{pack.description}</p>
                          
                          <div className="bg-black/60 p-3 rounded-xl border border-white/10 mb-6 text-[11px] font-mono text-amber-300">
                            <p className="font-bold mb-1">PROBABILIDADES:</p>
                            <p>{pack.rates}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs font-bold uppercase">PRECIO:</span>
                            <span className="text-2xl font-black text-yellow-400">🪙 {pack.price} Shekels</span>
                          </div>

                          <button
                            disabled={!canAfford}
                            onClick={() => {
                              if (!canAfford) {
                                alert("No tienes suficientes monedas del Templo 🪙. Juega las misiones de Bomberman & Mario para conseguir más monedas.");
                                return;
                              }

                              updateStudentProgress(prev => ({
                                ...prev,
                                shekels: (prev.shekels || 0) - pack.price,
                                packsOpened: (prev.packsOpened || 0) + 1
                              }));

                              const drawCount = pack.cardsCount || 3;
                              const alreadyOwnedIds = studentProgress.unlockedCards || [];
                              const drawn = [];

                              for (let i = 0; i < drawCount; i++) {
                                let pool = biblicalCardsDB.filter(c => !alreadyOwnedIds.includes(c.id) && !drawn.some(d => d.id === c.id));
                                if (pool.length === 0) {
                                  pool = biblicalCardsDB.filter(c => !drawn.some(d => d.id === c.id));
                                }
                                if (pool.length === 0) pool = biblicalCardsDB;

                                let selected = null;
                                if (pack.weights) {
                                  const r = Math.random();
                                  let cumulative = 0;
                                  let chosenRarity = 'COMÚN';
                                  for (const [rarity, weight] of Object.entries(pack.weights)) {
                                    cumulative += weight;
                                    if (r <= cumulative) {
                                      chosenRarity = rarity;
                                      break;
                                    }
                                  }
                                  const rarityPool = pool.filter(c => c.rarity === chosenRarity);
                                  if (rarityPool.length > 0) {
                                    selected = rarityPool[Math.floor(Math.random() * rarityPool.length)];
                                  }
                                }

                                if (!selected) {
                                  selected = pool[Math.floor(Math.random() * pool.length)];
                                }

                                drawn.push(selected);
                              }

                              setRevealedPackCards(drawn);
                              setFlippedIndices([]);
                              setPackStage('sealed');
                              setOpeningPack(pack);
                              playRetroSound('secret');
                            }}
                            className={`w-full py-4 rounded-2xl font-black uppercase tracking-wider text-sm transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                              canAfford 
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black hover:scale-105' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}>
                            {canAfford ? '⚡ COMPRAR Y ABRIR SOBRE' : '🔒 MONEDAS INSUFICIENTES'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── SECCIÓN 2: CAJAS DE AVENTURA & COFRES MÍSTICOS (MYSTERY BOXES) ── */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl animate-bounce">🧰</span>
                  <div>
                    <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300 uppercase tracking-wider">
                      CAJAS DE AVENTURA & COFRES MÍSTICOS (4 - 5 CARTAS)
                    </h4>
                    <p className="text-slate-400 text-xs">Cofres del Santuario con mayor cantidad de cartas, reliquias arcanas y cartas ultra raras garantizadas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {packStoreCatalog.filter(p => p.type === 'caja').map((box) => {
                    const canAfford = (studentProgress.shekels || 0) >= box.price;
                    return (
                      <div key={box.id} className={`bg-gradient-to-b ${box.gradient} border-2 ${box.border} rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group shadow-2xl transition-all hover:scale-[1.03]`}>
                        <div className="absolute -top-10 -right-10 w-28 h-28 bg-yellow-400/10 rounded-full blur-xl pointer-events-none"></div>

                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className={`${box.badge} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow`}>
                              {box.tier}
                            </span>
                            <span className="text-4xl group-hover:scale-125 transition-transform">{box.icon}</span>
                          </div>

                          <h4 className="text-xl font-black text-white uppercase tracking-tight mb-2 leading-tight">{box.name}</h4>
                          <p className="text-slate-300 text-xs leading-relaxed mb-4">{box.description}</p>
                          
                          <div className="bg-black/60 p-3 rounded-xl border border-white/10 mb-6 text-[10px] font-mono text-amber-300">
                            <p className="font-bold mb-1">CONTENIDO:</p>
                            <p>{box.rates}</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-xs font-bold uppercase">PRECIO:</span>
                            <span className="text-xl font-black text-yellow-400">🪙 {box.price} Shekels</span>
                          </div>

                          <button
                            disabled={!canAfford}
                            onClick={() => {
                              if (!canAfford) {
                                alert("No tienes suficientes monedas del Templo 🪙. Juega las misiones de Bomberman & Mario para conseguir más monedas.");
                                return;
                              }

                              updateStudentProgress(prev => ({
                                ...prev,
                                shekels: (prev.shekels || 0) - box.price,
                                packsOpened: (prev.packsOpened || 0) + 1
                              }));

                              const drawCount = box.cardsCount || 4;
                              const alreadyOwnedIds = studentProgress.unlockedCards || [];
                              const drawn = [];

                              for (let i = 0; i < drawCount; i++) {
                                let pool = biblicalCardsDB.filter(c => !alreadyOwnedIds.includes(c.id) && !drawn.some(d => d.id === c.id));
                                if (pool.length === 0) {
                                  pool = biblicalCardsDB.filter(c => !drawn.some(d => d.id === c.id));
                                }
                                if (pool.length === 0) pool = biblicalCardsDB;

                                let selected = null;
                                if (box.weights) {
                                  const r = Math.random();
                                  let cumulative = 0;
                                  let chosenRarity = 'COMÚN';
                                  for (const [rarity, weight] of Object.entries(box.weights)) {
                                    cumulative += weight;
                                    if (r <= cumulative) {
                                      chosenRarity = rarity;
                                      break;
                                    }
                                  }
                                  const rarityPool = pool.filter(c => c.rarity === chosenRarity);
                                  if (rarityPool.length > 0) {
                                    selected = rarityPool[Math.floor(Math.random() * rarityPool.length)];
                                  }
                                }

                                if (!selected) {
                                  selected = pool[Math.floor(Math.random() * pool.length)];
                                }

                                drawn.push(selected);
                              }

                              setRevealedPackCards(drawn);
                              setFlippedIndices([]);
                              setPackStage('sealed');
                              setOpeningPack(box);
                              playRetroSound('secret');
                            }}
                            className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 ${
                              canAfford 
                                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black hover:scale-105' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}>
                            {canAfford ? '✨ ABRIR COFRE SAGRADO' : '🔒 MONEDAS INSUFICIENTES'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── PESTAÑA 3: MI ÁLBUM SAGRADO (50 CARTAS ESTILO YU-GI-OH) ─ */}
          {/* ════════════════════════════════════════════════════════════ */}
          {studentTab === 'album' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
              <div className="text-center md:text-left mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-indigo-900/40 pb-4">
                <div>
                  <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                    🃏 CÓDICE YU-GI-OH! DEL ANTIGUO TESTAMENTO
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    Colección oficial de 50 Cartas Sagradas. Toca cualquier carta desbloqueada para abrir el visor holográfico Yu-Gi-Oh! y <strong>descargarla en alta definición o tomarle captura</strong> para mostrarle al profesor Eder Carrasco.
                  </p>
                </div>
                <div className="bg-[#101426] border-2 border-amber-500/60 px-6 py-3 rounded-2xl text-center shadow-lg">
                  <p className="text-amber-400 text-[10px] font-black uppercase tracking-widest">COLECCIÓN TOTAL</p>
                  <p className="text-2xl font-black text-white">
                    {studentProgress.unlockedCards?.length || 0} / 50 <span className="text-xs text-yellow-400">({Math.round(((studentProgress.unlockedCards?.length || 0) / 50) * 100)}%)</span>
                  </p>
                </div>
              </div>

              {/* Filtro por Categorías */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
                {['TODAS', 'PATRIARCAS', 'LÍDERES', 'JUECES', 'REYES', 'PROFETAS', 'HEROÍNAS', 'RELIQUIAS'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCardFilterCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      cardFilterCategory === cat 
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)] scale-105' 
                        : 'bg-[#101426] text-slate-400 hover:text-white border border-slate-800'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid de 50 Cartas Yu-Gi-Oh! */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {biblicalCardsDB.filter(c => cardFilterCategory === 'TODAS' || c.category === cardFilterCategory).map(card => {
                  const isOwned = (studentProgress.unlockedCards || []).includes(card.id);
                  return (
                    <div 
                      key={card.id}
                      onClick={() => {
                        if (isOwned) {
                          setInspectingCard(card);
                          playRetroSound('secret');
                        }
                      }}
                      className={`relative aspect-[5/7] rounded-2xl p-2.5 flex flex-col justify-between transition-all duration-300 border-2 select-none ${
                        isOwned 
                          ? `bg-gradient-to-b ${card.gradient} ${card.border} cursor-pointer hover:scale-105 hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] shadow-xl ring-1 ring-white/20` 
                          : 'bg-[#090b14] border-slate-800 opacity-40 cursor-not-allowed'
                      }`}>
                      
                      {/* Cabecera Yu-Gi-Oh! */}
                      <div className="flex justify-between items-center bg-black/50 px-2 py-1 rounded-lg border border-white/10">
                        <span className={`text-[8px] font-black uppercase tracking-wider ${isOwned ? card.badgeColor : 'text-slate-500'}`}>
                          {card.rarity.substring(0, 4)}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs">{isOwned ? card.attributeIcon : '❓'}</span>
                        </div>
                      </div>

                      {/* Estrellas Mini */}
                      {isOwned && (
                        <div className="flex justify-end gap-0.5 my-0.5 pr-1">
                          {Array.from({ length: Math.min(10, card.stars || 8) }).map((_, si) => (
                            <span key={si} className="text-[8px] text-yellow-300">★</span>
                          ))}
                        </div>
                      )}

                      {/* Cuerpo de la Carta (Ilustración Central) */}
                      <div className="text-center my-auto bg-black/40 p-2 rounded-xl border border-white/5">
                        <span className="text-3xl sm:text-4xl block mb-1">{isOwned ? card.icon : '🔒'}</span>
                        <p className={`font-black uppercase tracking-tight line-clamp-1 text-[11px] leading-tight ${isOwned ? 'text-white drop-shadow' : 'text-slate-600'}`}>
                          {isOwned ? card.name : 'BLOQUEADA'}
                        </p>
                        {isOwned ? (
                          <p className="text-[8px] text-cyan-300 font-mono truncate">{card.pasaje}</p>
                        ) : (
                          <p className="text-[8px] text-slate-500 font-bold">Abre sobres/cajas</p>
                        )}
                      </div>

                      {/* Pie de Estadísticas ATK / DEF y XP */}
                      <div className="pt-1.5 border-t border-black/40 bg-black/60 px-2 py-1 rounded-lg text-[9px] font-mono flex flex-col gap-0.5">
                        <div className="flex justify-between items-center font-black">
                          <span className={isOwned ? 'text-amber-400' : 'text-slate-600'}>
                            {isOwned ? `+${card.clanXP} XP` : '???'}
                          </span>
                          <span className={isOwned ? 'text-emerald-400' : 'text-slate-600'}>
                            {isOwned ? `ATK ${card.atk}` : '---'}
                          </span>
                        </div>
                        {isOwned && (
                          <div className="text-[8px] text-center text-slate-300 font-sans font-bold bg-white/10 rounded py-0.5 hover:bg-white/20 transition-colors">
                            🔍 ABRIR YU-GI-OH!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── PESTAÑA 4: CINEMÁTICAS & HISTORIA BÍBLICA ─────────────── */}
          {/* ════════════════════════════════════════════════════════════ */}
          {studentTab === 'cinematicas' && (
            <div className="relative z-10 w-full max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
              <div className="text-center md:text-left mb-6 border-b border-indigo-900/40 pb-4">
                <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  🎬 CINEMÁTICAS ÉPICAS Y BSO DE LAS MISIONES
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-1">
                  Revive las introducciones cinematográficas con música orquestal de Canva, historias bíblicas narradas y textos cinemáticos en pantalla completa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Intro Global */}
                <div className="bg-gradient-to-br from-[#120a05] to-[#0a0502] border-2 border-amber-600/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                  <div>
                    <span className="bg-amber-900/60 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-amber-500/40">
                      PRÓLOGO MULTIVERSAL
                    </span>
                    <h4 className="text-2xl font-black text-white uppercase tracking-tight mt-3 mb-2">
                      LA ODISEA BÍBLICA: EL DESPERTAR
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed mb-4">
                      "El tiempo y el espacio se han fracturado. El aula ha desaparecido. Siete linajes se levantarán del polvo: La Odisea Bíblica comienza."
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setActiveCinematicModal({
                          id: 0,
                          title: "LA ODISEA BÍBLICA: EL DESPERTAR",
                          videoUrl: "https://www.canva.com/design/DAHRVWYddvQ/QXO9us7EGIsOpJtL_MmRsA/watch?embed",
                          lore: "El tiempo y el espacio se han fracturado. El aula ha desaparecido. La Odisea Bíblica forjará líderes eternos en el desierto."
                        });
                      }}
                      className="w-full bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
                      <Play className="w-4 h-4 fill-black"/> VER CINEMÁTICA CON BSO
                    </button>
                  </div>
                </div>

                {/* Misiones 1 a 5 */}
                {soloMissions.map(m => (
                  <div key={m.id} className="bg-[#0b0e1e] border-2 border-indigo-900/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between group hover:border-amber-500/60 transition-colors">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-indigo-950 text-indigo-300 text-[10px] font-black px-3 py-1 rounded-full uppercase border border-indigo-800">
                          {m.worldNum} • {m.theme}
                        </span>
                        <span className="text-xs text-amber-400 font-mono font-bold">BSO OFICIAL</span>
                      </div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight mt-2 mb-2 group-hover:text-amber-400 transition-colors">
                        {m.title}
                      </h4>
                      <p className="text-slate-400 text-xs leading-relaxed mb-4 italic">
                        "{m.lore}"
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setActiveCinematicModal({
                            id: m.id,
                            title: m.title,
                            videoUrl: m.videoUrl,
                            lore: m.lore
                          });
                        }}
                        className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer flex items-center justify-center gap-2">
                        <Play className="w-4 h-4 fill-black"/> VER INTRO CON BSO
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón Salir */}
          <button onClick={() => { setStudentAuth(null); setStudentLoginStep(1); setView('selector'); }} className="fixed bottom-6 right-6 z-40 bg-black/80 hover:bg-red-950 text-slate-400 hover:text-white border border-slate-700 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-widest cursor-pointer transition-colors shadow-2xl">
            Cerrar Sesión
          </button>

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── MODAL 1: APERTURA DE SOBRES Y CAJAS DE AVENTURA 3D ───── */}
          {/* ════════════════════════════════════════════════════════════ */}
          {openingPack && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-in fade-in overflow-y-auto">
              <div className="max-w-5xl w-full bg-[#0d1022] border-2 border-yellow-500/70 rounded-3xl p-6 sm:p-10 text-center relative shadow-[0_0_100px_rgba(234,179,8,0.4)] flex flex-col items-center my-auto">
                
                <h3 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-amber-400 uppercase tracking-tight mb-1">
                  {openingPack.type === 'caja' ? '🧰' : '📦'} {openingPack.name}
                </h3>
                <p className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-widest mb-6">
                  {packStage === 'sealed' ? '✨ TOCA EL COFRE/SOBRE PARA ABRIRLO Y REVELAR TUS CARTAS ✨' : '🎴 TOCA CADA CARTA PARA REVELAR SU PODER YU-GI-OH!'}
                </p>

                {packStage === 'sealed' ? (
                  <div className="my-10 flex flex-col items-center justify-center">
                    <div 
                      onClick={() => { setPackStage('opened'); playRetroSound('powerup'); }}
                      className="w-56 h-72 sm:w-64 sm:h-80 bg-gradient-to-b from-amber-500 via-yellow-500 to-amber-800 rounded-3xl border-4 border-yellow-200 p-6 flex flex-col items-center justify-between shadow-[0_0_60px_rgba(245,158,11,0.9)] cursor-pointer hover:scale-110 transition-transform animate-pulse select-none">
                      <span className="text-xs font-black uppercase text-black bg-white/90 px-4 py-1 rounded-full shadow">
                        {openingPack.tier}
                      </span>
                      <span className="text-7xl sm:text-8xl">{openingPack.icon}</span>
                      <span className="text-xs font-black uppercase text-black tracking-widest bg-amber-300 px-3 py-1 rounded-lg">
                        ¡TOCA PARA ABRIR!
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 sm:grid-cols-${Math.min(5, revealedPackCards.length)} gap-4 my-6 w-full max-w-5xl animate-in zoom-in`}>
                    {revealedPackCards.map((card, cIdx) => {
                      const isFlipped = flippedIndices.includes(cIdx);
                      const isAlreadyOwned = (studentProgress.unlockedCards || []).includes(card.id);
                      const isMasterUser = Boolean(studentAuth?.isGodMode || studentAuth?.clanId === 'all');

                      return (
                        <div 
                          key={cIdx} 
                          onClick={() => {
                            if (!isFlipped) {
                              setFlippedIndices(prev => [...prev, cIdx]);
                              playRetroSound('powerup');

                              if (!isAlreadyOwned) {
                                updateStudentProgress(prev => ({
                                  ...prev,
                                  unlockedCards: [...(prev.unlockedCards || []), card.id]
                                }));

                                // APLICAR PUNTOS DIRECTOS (SI ES MAESTRO, A TODOS LOS CLANES DE TODOS LOS SALONES!)
                                if (isMasterUser) {
                                  updateScore('all', card.clanXP, 'all');
                                } else if (studentAuth?.clanId) {
                                  updateScore(studentAuth.clanId, card.clanXP, studentAuth.aula);
                                }
                              } else {
                                // BENDICIÓN DE CARTA DUPLICADA (+20 XP)
                                if (isMasterUser) {
                                  updateScore('all', 20, 'all');
                                } else if (studentAuth?.clanId) {
                                  updateScore(studentAuth.clanId, 20, studentAuth.aula);
                                }
                              }
                            }
                          }}
                          className={`aspect-[5/7] rounded-2xl p-3 flex flex-col justify-between border-2 transition-all cursor-pointer shadow-2xl relative select-none ${
                            !isFlipped 
                              ? 'bg-gradient-to-b from-[#1c1833] to-[#0a0717] border-amber-500/80 hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse' 
                              : `bg-gradient-to-b ${card.gradient} ${card.border} shadow-[0_0_35px_rgba(255,255,255,0.4)] animate-in zoom-in ring-1 ring-white/30`
                          }`}>

                          {!isFlipped ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center">
                              <span className="text-4xl sm:text-5xl mb-2">🎴</span>
                              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                                REVELAR CARTA
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center bg-black/60 px-2 py-0.5 rounded-lg border border-white/10">
                                <span className={`${card.badgeColor} text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase`}>
                                  {card.rarity.substring(0, 4)}
                                </span>
                                <span className="text-sm">{card.attributeIcon}</span>
                              </div>

                              <div className="flex justify-end gap-0.5 pr-1">
                                {Array.from({ length: Math.min(8, card.stars || 8) }).map((_, si) => (
                                  <span key={si} className="text-[7px] text-yellow-300">★</span>
                                ))}
                              </div>

                              <div className="text-center my-auto bg-black/40 p-2 rounded-xl">
                                <span className="text-3xl block mb-1">{card.icon}</span>
                                <h5 className="font-black text-white text-xs uppercase leading-tight line-clamp-1 drop-shadow">
                                  {card.name}
                                </h5>
                                <p className="text-[8px] text-cyan-300 font-mono mt-0.5">{card.pasaje}</p>
                              </div>

                              <div className="pt-1.5 border-t border-black/40 bg-black/70 px-2 py-1 rounded-lg text-center">
                                <div className="text-[8px] font-mono font-bold text-slate-300 mb-0.5">
                                  ATK {card.atk} / DEF {card.def}
                                </div>
                                {!isAlreadyOwned ? (
                                  <span className="bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider block">
                                    ✨ +{card.clanXP} XP AL CLAN
                                  </span>
                                ) : (
                                  <span className="bg-purple-900 text-purple-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase block">
                                    REPETIDA (+20 XP)
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Botones de Cierre */}
                {packStage === 'opened' && flippedIndices.length === revealedPackCards.length && (
                  <div className="flex flex-wrap gap-4 justify-center mt-6 animate-in slide-in-from-bottom-4">
                    <button 
                      onClick={() => { setOpeningPack(null); setStudentTab('album'); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer">
                      🃏 IR A MI ÁLBUM SAGRADO
                    </button>
                    <button 
                      onClick={() => setOpeningPack(null)} 
                      className="bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer">
                      🛍️ ABRIR OTRA CAJA / SOBRE
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ── MODAL 2: VISOR HOLOGRÁFICO YU-GI-OH! & CAPTURA ───────── */}
          {/* ════════════════════════════════════════════════════════════ */}
          {inspectingCard && (
            <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-3 sm:p-6 animate-in zoom-in duration-300 overflow-y-auto">
              
              {!fullScreenCaptureMode ? (
                <div className="max-w-2xl w-full bg-[#0a0c16] border-2 border-amber-500/80 rounded-3xl p-4 sm:p-8 flex flex-col items-center relative shadow-[0_0_80px_rgba(245,158,11,0.5)] my-auto">
                  
                  {/* Encabezado con Botón Cerrar */}
                  <div className="w-full flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <span className="text-amber-400 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-4 h-4"/> CARTA OFICIAL YU-GI-OH! • COLECCIÓN SAGRADA
                    </span>
                    <button 
                      onClick={() => setInspectingCard(null)} 
                      className="text-slate-400 hover:text-white bg-black/60 p-2 rounded-full cursor-pointer">
                      <X className="w-5 h-5"/>
                    </button>
                  </div>

                  {/* ── CARTA YU-GI-OH! FÍSICA AUTÉNTICA EN PANTALLA ── */}
                  <div className="w-72 sm:w-84 aspect-[5/7.2] rounded-2xl p-3 sm:p-4 flex flex-col justify-between border-8 border-[#26170d] bg-gradient-to-b from-[#8c4a1e] via-[#6d3916] to-[#42220b] shadow-[0_0_50px_rgba(245,158,11,0.6)] relative mb-6 select-none ring-2 ring-yellow-400/60">
                    
                    {/* Barra de Título Yu-Gi-Oh! */}
                    <div className="bg-black/60 border-2 border-yellow-300/80 px-2 py-1.5 rounded-lg flex justify-between items-center shadow-inner">
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight truncate max-w-[210px] font-serif">
                        {inspectingCard.name}
                      </h4>
                      <div className="w-6 h-6 rounded-full bg-slate-900 border border-amber-400 flex items-center justify-center text-xs shrink-0 shadow">
                        {inspectingCard.attributeIcon || '🌟'}
                      </div>
                    </div>

                    {/* Fila de Estrellas de Nivel (Level Stars) */}
                    <div className="flex justify-end gap-1 px-1 my-1">
                      {Array.from({ length: Math.min(12, inspectingCard.stars || 8) }).map((_, si) => (
                        <div key={si} className="w-4 h-4 rounded-full bg-orange-600 border border-yellow-300 flex items-center justify-center text-[10px] shadow-sm">
                          ⭐
                        </div>
                      ))}
                    </div>

                    {/* Marco de Arte Metálico Central */}
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-950 via-indigo-950 to-black rounded-lg border-4 border-slate-400 p-2 flex items-center justify-center shadow-inner relative overflow-hidden my-1">
                      <span className="text-6xl sm:text-7xl drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
                        {inspectingCard.icon}
                      </span>
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono text-yellow-300 bg-black/70 px-1 rounded">
                        {inspectingCard.serialCode || 'ODISEA-ES001'}
                      </span>
                    </div>

                    {/* Caja de Efecto Yu-Gi-Oh! (Pergamino Dorado) */}
                    <div className="bg-[#fef3c7] border-2 border-black p-2 rounded-lg text-black text-left flex flex-col justify-between shadow-inner">
                      <div className="text-[10px] font-black uppercase text-slate-900 font-sans border-b border-black/30 pb-0.5">
                        {inspectingCard.monsterType || '[GUERRERO / PROFETA / EFECTO]'}
                      </div>
                      <p className="text-[9px] text-amber-900 italic font-serif my-1 leading-tight line-clamp-2">
                        "{inspectingCard.quote}" <span className="font-bold text-sky-800 not-italic">«{inspectingCard.pasaje}»</span>
                      </p>
                      <p className="text-[9px] font-sans font-bold text-slate-950 leading-tight line-clamp-2">
                        <span className="text-indigo-950 font-black">{inspectingCard.effectName || '[EFECTO DEL PACTO]'}</span> {inspectingCard.power}
                      </p>

                      <div className="border-t border-black/40 pt-1 mt-1 flex justify-between items-center text-[10px] font-black font-mono">
                        <span className="text-emerald-800">XP: +{inspectingCard.clanXP}</span>
                        <span>ATK / {inspectingCard.atk || 2800}   DEF / {inspectingCard.def || 2400}</span>
                      </div>
                    </div>

                    {/* Pie de Firma del Recluta y Holograma */}
                    <div className="flex justify-between items-center mt-1 px-1">
                      <span className="text-[8px] text-yellow-200 font-bold uppercase truncate max-w-[220px]">
                        RECLUTA: {studentAuth?.name?.toUpperCase()} • {studentAuth?.isGodMode ? 'MODO MAESTRO' : 'CLAN ' + (clansData.find(c=>c.id===studentAuth?.clanId)?.name || 'SAGRADO')}
                      </span>
                      <div className="w-4 h-4 bg-yellow-400 border border-white text-[6px] text-black font-black flex items-center justify-center shadow">
                        SEAL
                      </div>
                    </div>

                  </div>

                  {/* Botones de Captura y Descarga */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => downloadCardImage(inspectingCard)} 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                      📸 DESCARGAR YU-GI-OH! (PNG)
                    </button>
                    <button 
                      onClick={() => setFullScreenCaptureMode(true)} 
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 cursor-pointer">
                      🔍 PANTALLA COMPLETA PARA FOTO
                    </button>
                  </div>

                </div>
              ) : (
                /* Modo Enfoque Limpio para Captura de Pantalla en Celular o PC */
                <div className="flex flex-col items-center justify-center text-center animate-in zoom-in select-none my-auto">
                  <div className="w-80 sm:w-96 aspect-[5/7.2] rounded-3xl p-5 flex flex-col justify-between border-8 border-[#26170d] bg-gradient-to-b from-[#8c4a1e] via-[#6d3916] to-[#42220b] shadow-[0_0_80px_rgba(250,204,21,0.8)] mb-4 ring-4 ring-yellow-400/80">
                    
                    {/* Barra de Título */}
                    <div className="bg-black/60 border-2 border-yellow-300 px-3 py-2 rounded-xl flex justify-between items-center shadow-inner">
                      <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight font-serif truncate max-w-[260px]">
                        {inspectingCard.name}
                      </h4>
                      <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-sm shrink-0">
                        {inspectingCard.attributeIcon || '🌟'}
                      </div>
                    </div>

                    {/* Estrellas de Nivel */}
                    <div className="flex justify-end gap-1 px-1 my-1">
                      {Array.from({ length: Math.min(12, inspectingCard.stars || 8) }).map((_, si) => (
                        <div key={si} className="w-5 h-5 rounded-full bg-orange-600 border border-yellow-300 flex items-center justify-center text-xs shadow">
                          ⭐
                        </div>
                      ))}
                    </div>

                    {/* Marco de Arte Central */}
                    <div className="w-full aspect-[4/3] bg-gradient-to-b from-slate-950 via-indigo-950 to-black rounded-xl border-4 border-slate-300 p-4 flex items-center justify-center shadow-2xl relative overflow-hidden my-2">
                      <span className="text-7xl sm:text-8xl drop-shadow-[0_0_30px_rgba(255,255,255,0.9)] animate-pulse">
                        {inspectingCard.icon}
                      </span>
                      <span className="absolute bottom-1 right-2 text-[10px] font-mono text-yellow-300 bg-black/80 px-2 py-0.5 rounded">
                        {inspectingCard.serialCode || 'ODISEA-ES001'}
                      </span>
                    </div>

                    {/* Caja de Efecto */}
                    <div className="bg-[#fef3c7] border-2 border-black p-3 rounded-xl text-black text-left flex flex-col justify-between shadow-2xl">
                      <div className="text-xs font-black uppercase text-slate-900 font-sans border-b border-black/30 pb-1">
                        {inspectingCard.monsterType || '[GUERRERO / PROFETA / EFECTO]'}
                      </div>
                      <p className="text-[11px] text-amber-950 italic font-serif my-1.5 leading-snug">
                        "{inspectingCard.quote}" <span className="font-bold text-sky-800 not-italic">«{inspectingCard.pasaje}»</span>
                      </p>
                      <p className="text-[10px] font-sans font-bold text-slate-950 leading-snug">
                        <span className="text-indigo-950 font-black">{inspectingCard.effectName || '[EFECTO DEL PACTO]'}</span> {inspectingCard.power}
                      </p>

                      <div className="border-t border-black/40 pt-1.5 mt-1.5 flex justify-between items-center text-xs font-black font-mono">
                        <span className="text-emerald-800">VALOR CLAN: +{inspectingCard.clanXP} XP</span>
                        <span>ATK / {inspectingCard.atk || 2800}   DEF / {inspectingCard.def || 2400}</span>
                      </div>
                    </div>

                    {/* Pie de Certificación y Holograma */}
                    <div className="flex justify-between items-center mt-2 px-1">
                      <span className="text-[9px] text-yellow-200 font-bold uppercase truncate max-w-[260px]">
                        CERTIFICADO: {studentAuth?.name?.toUpperCase()} • {studentAuth?.isGodMode ? 'MODO MAESTRO' : 'CLAN ' + (clansData.find(c=>c.id===studentAuth?.clanId)?.name || 'SAGRADO')} • SALÓN {studentAuth?.aula}
                      </span>
                      <div className="w-5 h-5 bg-yellow-400 border border-white text-[7px] text-black font-black flex items-center justify-center shadow">
                        SEAL
                      </div>
                    </div>

                  </div>

                  <p className="text-slate-400 text-xs mb-4">
                    📸 Toma tu captura de pantalla ahora (Power + Vol Abajo en celular, o Win+Shift+S en PC)
                  </p>

                  <button 
                    onClick={() => setFullScreenCaptureMode(false)} 
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-xl text-xs transition-colors cursor-pointer border border-slate-600">
                    VOLVER AL MENÚ
                  </button>
                </div>
              )}

            </div>
          )}

          {/* ── MODAL 3: REPRODUCTOR DE CINEMÁTICA CON BSO ───────────── */}
          {/* ════════════════════════════════════════════════════════════ */}
          {activeCinematicModal && (
            <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 animate-in fade-in">
              <div className="max-w-4xl w-full bg-[#080914] border-2 border-amber-600/70 rounded-3xl p-6 sm:p-8 relative shadow-2xl flex flex-col items-center">
                
                <div className="w-full flex justify-between items-center border-b border-amber-900/40 pb-4 mb-4">
                  <div>
                    <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">
                      CINEMÁTICA CON BSO OFICIAL
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase">{activeCinematicModal.title}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveCinematicModal(null)} 
                    className="text-slate-400 hover:text-white bg-black/60 p-2 rounded-full cursor-pointer">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-amber-500/40 shadow-xl mb-6">
                  <iframe 
                    src={activeCinematicModal.videoUrl} 
                    className="w-full h-full border-0" 
                    allowFullScreen 
                    title={activeCinematicModal.title}
                  />
                </div>

                <p className="text-slate-300 text-sm italic font-serif text-center max-w-xl mb-6">
                  "{activeCinematicModal.lore}"
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const idx = soloMissions.findIndex(m => m.id === activeCinematicModal.id);
                      setActiveCinematicModal(null);
                      if (idx !== -1) {
                        setActiveSoloMission(idx);
                        setView('student_mario_game');
                      }
                    }} 
                    className="bg-gradient-to-r from-amber-600 to-amber-500 text-black font-black uppercase tracking-wider px-8 py-3.5 rounded-2xl text-xs transition-all shadow-lg hover:scale-105 cursor-pointer">
                    🎮 ENTRAR AL RETO DE ESTA MISIÓN
                  </button>
                  <button 
                    onClick={() => setActiveCinematicModal(null)} 
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-wider px-6 py-3.5 rounded-2xl text-xs transition-colors cursor-pointer">
                    Cerrar
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
        )
      )}{/* ── MINIJUEGO MARIO BROS & BOMBERMAN EN EJECUCIÓN ── */}
      {view === 'student_mario_game' && (
        <MarioBrosSoloGame 
          missionIndex={activeSoloMission}
          studentAuth={studentAuth || { name: 'RECLUTA', aula: selectedClass || '1A', clanId: 'c1', isGodMode: false, lives: 3 }}
          onExit={() => setView('student_dashboard')}
          onWin={(pts) => {
            const mId = activeSoloMission + 1;
            const isFirstTime = !studentProgress?.completedMissions?.[mId];

            if (isFirstTime) {
              // Primera victoria: otorga +100 XP base directo al Clan
              if (studentAuth?.clanId) {
                updateScore(studentAuth.clanId, 100, studentAuth.aula);
              }
              updateStudentProgress(prev => ({
                ...prev,
                shekels: (prev.shekels || 0) + (pts || 50) + 100, // Bono extra de monedas
                completedMissions: { ...(prev.completedMissions || {}), [mId]: true }
              }));
              alert(`🏆 ¡PRIMERA VICTORIA DE LA MISIÓN ${mId}!
Has otorgado +100 XP a tu Clan (${studentAuth.aula}) y ganado ${pts + 100} Monedas del Templo 🪙 para abrir sobres de cartas en la Tienda.`);
            } else {
              // Misión ya superada previamente: NO otorga puntos base de clan de nuevo, pero otorga monedas para la Tienda!
              updateStudentProgress(prev => ({
                ...prev,
                shekels: (prev.shekels || 0) + (pts || 50)
              }));
              alert(`⭐ ¡MISIÓN SUPERADA NUEVAMENTE!
Los puntos base de clan ya fueron otorgados la primera vez, pero has ganado +${pts} Monedas del Templo 🪙 para abrir sobres en la Tienda y desbloquear nuevas cartas para tu Clan.`);
            }
          }}
          onLose={(pts) => {
            // No penalizamos bruscamente el Clan para incentivar la práctica
          }}
        />
      )}

{view === 'global_ranking' && (
        <div className="flex-grow flex flex-col items-center p-8 relative overflow-hidden bg-[#06080e] dot-grid min-h-screen">
          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center animate-in slide-in-from-bottom-8 duration-500 mt-10">
            <button onClick={() => setView('selector')} className="absolute top-0 left-0 text-slate-500 hover:text-amber-500 bg-[#161827] border border-[#2a2e45] px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> VOLVER</button>
            <Globe className="w-16 h-16 text-amber-500 mb-4 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)]"/>
            <h1 className="text-3xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase mb-4 drop-shadow-2xl">SALÓN DE LA FAMA</h1>
            <span className="border border-amber-900/50 text-amber-500 px-6 py-2 rounded-full text-[10px] font-bold tracking-widest md:tracking-[0.4em] uppercase mb-12 shadow-sm bg-[#18110b]">TORNEO UNIVERSAL • TODO 1RO DE SECUNDARIA</span>
            <div className="w-full space-y-4 pb-20">
              {(() => {
                const globalTotals = clansData.map(clan => {
                  const total = ['1A', '1B', '1C'].reduce((sum, aula) => sum + (scores[aula]?.[clan.id] || 0), 0);
                  return { ...clan, total };
                }).sort((a, b) => b.total - a.total);
                return globalTotals.map((clan, idx) => (
                  <div key={clan.id} className={`flex justify-between items-center px-4 md:px-8 py-3 md:py-5 rounded-xl md:rounded-2xl border-2 transition-all ${idx === 0 ? 'border-amber-400 bg-[#241e3a] shadow-[0_0_30px_rgba(245,158,11,0.2)]' : idx === 1 ? 'border-slate-400 bg-[#15192b]' : idx === 2 ? 'border-amber-700 bg-[#1e1710]' : 'border-[#1e293b] bg-[#0f111a]'}`}>
                    <div className="flex items-center gap-6">
                      <span className={`text-2xl md:text-4xl font-black italic ${idx === 0 ? 'text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'}`}>#{idx + 1}</span>
                      <span className="text-white font-black text-sm md:text-2xl uppercase tracking-widest">{clan.name.toUpperCase()}</span>
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
      {view === 'campamento_base' && (
        <div className="flex-grow flex flex-col relative dot-grid bg-[#06080e]">
          <header className="bg-[#0a0b12]/90 backdrop-blur-md border-b border-[#1e293b] p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-4">
              <button onClick={() => setView('selector')} className="text-slate-500 hover:text-white bg-[#161827] border border-[#2a2e45] px-3 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-4 h-4"/> SALIR</button>
              <div>
                <div className="flex items-center gap-3">
    <h1 className="text-xl md:text-2xl font-black text-white tracking-widest uppercase flex items-center gap-2"><Flame className="w-5 h-5 text-amber-500 hidden md:block"/> ODISEA BÍBLICA</h1>
    <div className="flex items-center gap-1 bg-[#161827] border border-[#2a2e45] p-1 rounded-xl">
      {currentClassrooms.map(aula => (
        <button
          key={aula.id}
          onClick={() => setSelectedClass(aula.id)}
          className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${selectedClass === aula.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
        >
          {aula.id}
        </button>
      ))}
    </div>
  </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowInstructions(true)} className="hidden md:flex text-cyan-400 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/30 px-3 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase items-center gap-2 transition-colors cursor-pointer"><Hexagon className="w-4 h-4"/> MANUAL</button>
              <button onClick={() => setShowTeacherKeysModal(true)} className="bg-amber-600/20 hover:bg-amber-600 hover:text-black border border-amber-500/50 text-amber-400 px-3.5 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer">
      <Key className="w-4 h-4 text-amber-400"/> CLAVES ESTUDIANTES
    </button>
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

                {/* Panel Exclusivo para el Docente: Códices de Acceso de Videos */}
                <div className="max-w-5xl mx-auto mb-10 bg-gradient-to-r from-amber-950/40 via-[#0d1020] to-indigo-950/40 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl">
                  <div className="flex flex-col md:flex-row justify-between items-center border-b border-amber-900/40 pb-4 mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <Key className="w-8 h-8 text-amber-400 animate-pulse"/>
                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-wider">CÓDICES SECRETOS DE LOS VIDEOS (MODO ESTUDIANTE)</h4>
                        <p className="text-slate-400 text-xs">Entrega cada contraseña a tus estudiantes para que puedan desbloquear su aventura Bomberman individual.</p>
                      </div>
                    </div>
                    <span className="bg-amber-500 text-black text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
                      5 CLAVES ÚNICAS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { num: "01", tema: "SACERDOTES", code: "SANTIDAD77", color: "border-amber-500/60 text-amber-400" },
                      { num: "02", tema: "JUECES", code: "JUECES300", color: "border-blue-500/60 text-blue-400" },
                      { num: "03", tema: "REYES", code: "CORONA777", color: "border-purple-500/60 text-purple-400" },
                      { num: "04", tema: "PROFETAS", code: "FUEGO18", color: "border-fuchsia-500/60 text-fuchsia-400" },
                      { num: "05", tema: "HEROÍNAS", code: "VALIENTES12", color: "border-emerald-500/60 text-emerald-400" }
                    ].map(item => (
                      <div key={item.num} className={`bg-black/60 border ${item.color} p-3 rounded-2xl text-center shadow-lg`}>
                        <p className="text-[10px] text-slate-400 font-black uppercase">MISIÓN {item.num} • {item.tema}</p>
                        <p className="text-base font-black tracking-widest text-white mt-1 font-mono">{item.code}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-[11px] text-amber-300/80 mt-3 font-mono">
                    👑 Clave Maestra Dios (Profesor): <strong>EDER2026</strong> (desbloquea cualquier nivel al instante)
                  </p>
                </div>
                <div className="space-y-6 max-w-5xl mx-auto">
                  {[
                    { id: 1, title: 'SANTIDAD Y SACRIFICIO', etiqueta: 'MISIÓN 01', tema: 'LOS SACERDOTES', desc: '"El fuego del Sinaí arde. La santidad absoluta de Yahveh amenaza con consumir la impureza humana. ¿Cómo puede el hombre acercarse sin morir?"', icon: Scroll, bgClass: 'from-blue-950/40 to-[#0a0c16]', borderClass: 'border-blue-500/30 hover:border-blue-400', textClass: 'text-blue-400', iconBg: 'bg-blue-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(59,130,246,0.2)]', action: () => { setView('mision1'); setStartMision1Cinematic(false); setM1Fase(0); } },
                    { id: 2, title: 'LA ERA DEL CAOS', etiqueta: 'MISIÓN 02', tema: 'LOS JUECES', desc: '"Anarquía total. Tribus dispersas, enemigos saqueando. Israel clama en la oscuridad, y de la nada, guerreros improbables se levantan."', icon: Crosshair, bgClass: 'from-red-950/40 to-[#0a0c16]', borderClass: 'border-red-500/30 hover:border-red-400', textClass: 'text-red-400', iconBg: 'bg-red-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(220,38,38,0.2)]', action: () => { setView('mision2'); setStartMision2Cinematic(false); setM2Fase(0); } },
                    { id: 3, title: 'EL ASCENSO DE LA CORONA', etiqueta: 'MISIÓN 03', tema: 'LOS REYES', desc: '"Israel rechaza a Yahveh como rey directo y exige un monarca humano. Comienza una era de coronas de oro y espadas manchadas de sangre."', icon: Crown, bgClass: 'from-amber-950/40 to-[#0a0c16]', borderClass: 'border-amber-500/30 hover:border-amber-400', textClass: 'text-amber-400', iconBg: 'bg-amber-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(245,158,11,0.2)]', action: () => { setView('mision3'); setStartMision3Cinematic(false); setM3Fase(0); setM3SubTab('archivo'); } },
                    { id: 4, title: 'VOCES DEL DESIERTO', etiqueta: 'MISIÓN 04', tema: 'LOS PROFETAS', desc: '"Los reyes han fallado. Yahveh levanta hombres que gritan verdades incómodas frente al poder de los imperios."', icon: Flame, bgClass: 'from-fuchsia-950/40 to-[#0a0c16]', borderClass: 'border-fuchsia-500/30 hover:border-fuchsia-400', textClass: 'text-fuchsia-400', iconBg: 'bg-fuchsia-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(217,70,239,0.2)]', action: () => { setView('mision4'); setStartMision4Cinematic(false); setM4Fase(0); setM4SubTab('archivo'); } },
                    { id: 5, title: 'HEROÍNAS DE LA FE', etiqueta: 'MISIÓN 05', tema: 'MUJERES DE ISRAEL', desc: '"Donde los hombres retrocedieron, la Providencia levantó mujeres. Estrategas militares y extranjeras leales."', icon: Shield, bgClass: 'from-emerald-950/40 to-[#0a0c16]', borderClass: 'border-emerald-500/30 hover:border-emerald-400', textClass: 'text-emerald-400', iconBg: 'bg-emerald-900/50', shadowClass: 'hover:shadow-[0_0_50px_rgba(16,185,129,0.2)]', action: () => { setView('mision5'); setStartMision5Cinematic(false); setM5Fase(0); setM5SubTab('archivo'); } }
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
                           <div className="absolute left-[27px] md:left-[43px] top-8 bottom-8 w-1 bg-gradient-to-b from-amber-500 via-indigo-500 to-emerald-500 rounded-full opacity-50 hidden md:block"></div>
                           
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
                      <button onClick={() => setM1SubTab('decodificador')} className="relative md:absolute mt-6 md:mt-0 mx-auto md:mx-0 top-0 right-0 md:top-10 md:right-10 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex w-max items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,119,6,0.4)] hover:shadow-[0_0_30px_rgba(217,119,6,0.6)] transition-all hover:scale-105 cursor-pointer z-10 mb-8 md:mb-0"><Key className="w-5 h-5"/> DECODIFICADOR</button>
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
                      ⚠️ NORMAS DEL DECODIFICADOR: La ruleta decidirá el orden de participación. Cuando sea el turno de un Clan, deberá intentar adivinar una letra del CLAN correspondiente. <strong className="text-amber-300">Si acierta, sigue jugando. Si se equivoca, pierde automáticamente -10 XP y su turno termina.</strong>
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
                      {safePectoralStones.map(stone => {
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
                      const stone = safePectoralStones.find(s => s.id === activeStone) || safePectoralStones[0];
                      const wordArr = (stone?.palabra || 'SANTIDAD').split('');
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
                        const nextCase = safeCasosTribunal[casoIndice % safeCasosTribunal.length] || safeCasosTribunal[0];
                        setCasoActivo(nextCase);
                        setCasoIndice(prev => (prev + 1) % safeCasosTribunal.length);
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
                            <span className={`text-[10px] px-3 py-1 rounded font-black uppercase tracking-widest ${casoActivo?.tipo?.includes('COMPLEJO') ? 'bg-orange-950 text-orange-500 border border-orange-900' : 'bg-red-950 text-red-400 border border-red-900'}`}>{casoActivo?.tipo}</span>
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
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 11s' }}><p className="text-3xl md:text-6xl lg:text-7xl text-red-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(239,68,68,1)]">«¡DANOS UN REY!»</p><p className="text-xl md:text-3xl text-red-300 uppercase tracking-widest md:tracking-[0.5em] font-bold mt-4">«Para ser como las demás naciones»</p></div>
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
                      <div className="absolute top-0 bottom-0 w-2 md:w-4 bg-gradient-to-b from-amber-500 via-amber-700 to-red-600 shadow-[0_0_30px_rgba(245,158,11,1)] z-0 rounded-full opacity-80 hidden md:block"></div>

                      {/* NODO 1: SAÚL */}
                      <div className="relative w-full mb-24 md:mb-40 group z-20">
  <div className="relative w-full flex flex-col md:flex-row items-center justify-between z-10">
                        <div className="md:w-1/2 flex justify-center md:justify-end md:pr-24 mb-10 md:mb-0">
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
                        <div className="md:w-1/2 md:pl-24 text-center md:text-left z-30">
                          <h3 className="text-3xl md:text-6xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">SAÚL</h3>
                          <p className="text-red-500 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-red-900/50 pb-4 inline-block">EL GUERRERO INSEGURO</p>
                          
                        </div>
                        </div>
  {/* TARJETAS EXPANDIBLES A TODO ANCHO */}
  <div className="w-full relative z-30">
    <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['saul'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#0f071a]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] relative mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
                      <div className="relative w-full mb-24 md:mb-40 group z-20">
  <div className="relative w-full flex flex-col md:flex-row-reverse items-center justify-between z-10">
                        <div className="md:w-1/2 flex justify-center md:justify-start md:pl-24 mb-10 md:mb-0">
                          <div onClick={() => toggleNode('david')} className="relative w-72 h-72 md:w-[400px] md:h-[400px] rounded-full border-4 md:border-8 border-emerald-600/80 shadow-[0_0_100px_rgba(16,185,129,0.5)] overflow-hidden cursor-pointer group-hover:shadow-[0_0_150px_rgba(16,185,129,0.8)] transition-all duration-700">
                            <div className={`absolute inset-0 bg-emerald-900/50 mix-blend-multiply z-10 transition-opacity duration-1000 ${expandedNodes['david'] ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'}`}></div>
                            <img src="/images/david.jpg" alt="David" className={`w-full h-full object-cover transition-transform duration-[2s] ${expandedNodes['david'] ? 'scale-100' : 'scale-125'}`}/>
                            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['david'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-emerald-500/50 shadow-2xl backdrop-blur-md text-lg">REVELAR MISTERIO</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 md:w-20 md:h-20 rounded-full bg-emerald-500 border-4 md:border-8 border-black shadow-[0_0_50px_rgba(16,185,129,1)] hidden md:flex items-center justify-center z-20"><span className="text-black font-black text-4xl">2</span></div>
                        <div className="md:w-1/2 md:pr-24 text-center md:text-right z-30">
                          <h3 className="text-3xl md:text-6xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">DAVID</h3>
                          <p className="text-emerald-400 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-emerald-900/50 pb-4 inline-block">EL CORAZÓN DE LEÓN</p>
                          
                        </div>
                        </div>
  {/* TARJETAS EXPANDIBLES A TODO ANCHO */}
  <div className="w-full relative z-30">
    <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['david'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#051a0f]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full text-left">
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
                      <div className="relative w-full mb-48 group z-20">
  <div className="relative w-full flex flex-col md:flex-row items-center justify-between z-10">
                        <div className="md:w-1/2 flex justify-center md:justify-end md:pr-24 mb-10 md:mb-0">
                          <div onClick={() => toggleNode('salomon')} className="relative w-72 h-72 md:w-[450px] md:h-[450px] rounded-full border-4 md:border-8 border-blue-600/80 shadow-[0_0_120px_rgba(59,130,246,0.6)] overflow-hidden cursor-pointer group-hover:shadow-[0_0_180px_rgba(59,130,246,0.8)] transition-all duration-700">
                            <div className={`absolute inset-0 bg-blue-900/50 mix-blend-multiply z-10 transition-opacity duration-1000 ${expandedNodes['salomon'] ? 'opacity-0' : 'opacity-100 group-hover:opacity-30'}`}></div>
                            <img src="/images/salomon.jpg" alt="Salomón" className={`w-full h-full object-cover transition-transform duration-[2s] ${expandedNodes['salomon'] ? 'scale-100' : 'scale-125'}`}/>
                            <div className={`absolute inset-0 z-20 flex items-center justify-center pointer-events-none transition-opacity duration-700 ${expandedNodes['salomon'] ? 'opacity-0' : 'opacity-100'}`}>
                              <span className="bg-black/80 text-white font-black uppercase tracking-widest px-8 py-3 rounded-full border-2 border-blue-500/50 shadow-2xl backdrop-blur-md text-lg">REVELAR MISTERIO</span>
                            </div>
                          </div>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 w-16 h-16 md:w-24 md:h-24 rounded-full bg-blue-500 border-4 md:border-8 border-black shadow-[0_0_60px_rgba(59,130,246,1)] hidden md:flex items-center justify-center z-20"><Crown className="w-8 h-8 md:w-12 md:h-12 text-black"/></div>
                        <div className="md:w-1/2 md:pl-24 text-center md:text-left z-30">
                          <h3 className="text-3xl md:text-6xl lg:text-9xl font-black text-white uppercase tracking-tighter mb-2 drop-shadow-2xl">SALOMÓN</h3>
                          <p className="text-blue-400 text-xl md:text-2xl font-black uppercase tracking-widest mb-6 border-b-4 border-blue-900/50 pb-4 inline-block">EL ARQUITECTO CORRUPTO</p>
                          
                        </div>
                      </div>
                      </div>
  {/* TARJETAS EXPANDIBLES A TODO ANCHO */}
  <div className="w-full relative z-30">
    <div className={`grid transition-all duration-1000 ease-in-out ${expandedNodes['salomon'] ? 'grid-rows-[1fr] opacity-100 translate-y-0' : 'grid-rows-[0fr] opacity-0 translate-y-10'}`}>
                            <div className="overflow-hidden">
                              <div className="bg-[#07101a]/95 backdrop-blur-2xl p-8 md:p-10 rounded-[3rem] border-2 border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] relative mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
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
                      <div className="w-2 md:w-4 h-48 bg-gradient-to-b from-amber-500 via-yellow-400 to-white shadow-[0_0_50px_rgba(250,204,21,1)] z-10 mb-[-4rem] lg:ml-[50%] rounded-full opacity-90 hidden md:block"></div>
                      
                      <div onClick={() => toggleNode('promesa')} className="w-full max-w-7xl bg-gradient-to-br from-[#1a0a00] via-[#331100] to-black border-4 md:border-8 border-yellow-500 rounded-[4rem] md:rounded-[6rem] p-12 md:p-32 relative overflow-hidden shadow-[0_0_200px_rgba(234,179,8,0.6)] cursor-pointer group hover:border-yellow-400 transition-colors duration-700">
                        <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501651493037-128dce28d6bd?q=80&w=2000')] bg-cover bg-center mix-blend-screen transition-all duration-[3s] ${expandedNodes['promesa'] ? 'opacity-20 scale-100' : 'opacity-40 scale-110'}`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                        
                        <div className="relative z-10 text-center flex flex-col items-center">
                          <div className={`relative w-64 h-64 md:w-96 md:h-96 mb-16 flex items-center justify-center transition-transform duration-1000 ${expandedNodes['promesa'] ? 'scale-75' : 'scale-100'}`}>
                             <div className="absolute inset-0 bg-yellow-500 blur-[80px] opacity-80 rounded-full animate-pulse"></div>
                             <img src="/images/jesus.jpg" alt="Jesús de Nazaret" className="w-full h-full object-cover rounded-full border-8 border-yellow-500 shadow-[0_0_80px_rgba(250,204,21,1)] relative z-10" />
                          </div>
                          
                          <p className="text-yellow-500 font-black uppercase tracking-widest md:tracking-[1em] text-lg md:text-2xl mb-8"><Key className="w-8 h-8 inline-block mr-4"/> EL HILO CONDUCTOR DIVINO</p>
                          <h3 className="text-3xl md:text-6xl lg:text-9xl lg:text-[140px] font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-yellow-200 to-yellow-600 uppercase tracking-tighter mb-16 drop-shadow-[0_0_40px_rgba(250,204,21,0.5)] leading-none">JESÚS DE NAZARET</h3>
                          
                          <div className={`z-20 flex items-center justify-center pointer-events-none transition-all duration-700 ${expandedNodes['promesa'] ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-32 mt-10'}`}>
                              <span className="bg-black/90 text-yellow-400 font-black uppercase tracking-widest md:tracking-[0.5em] px-12 py-6 rounded-full border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.8)] backdrop-blur-xl text-2xl md:text-4xl animate-bounce">DESCUBRIR EL PACTO FINAL</span>
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
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
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
      {/* ── MISIÓN 4: PROFETAS ──────────────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision4' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#0d040e] min-h-screen">
          {m4Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-fuchsia-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(217,70,239,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-fuchsia-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> AUDIO MISIÓN 4</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHWugF3r_Y/CGzIAO7oBeFfkhz_SVDLvQ/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {!startMision4Cinematic ? (
            <div className="z-10 flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 max-w-2xl mx-auto px-4 w-full h-full">
              <Flame className="w-24 h-24 text-fuchsia-500 mb-6 drop-shadow-[0_0_30px_rgba(217,70,239,0.6)] animate-pulse"/>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">MISIÓN 4: VOCES DEL DESIERTO</h1>
              <p className="text-fuchsia-400 text-xs md:text-sm tracking-widest md:tracking-[0.3em] uppercase mb-10 font-bold border border-fuchsia-900/50 bg-fuchsia-950/30 px-6 py-4 rounded-xl">INSTRUCCIÓN GM: <br/><br/>1) ACTIVA EL AUDIO EN LA ESQUINA.<br/>2) INICIA LA CINEMÁTICA ÉPICA.</p>
              <button onClick={() => setStartMision4Cinematic(true)} className="bg-gradient-to-b from-fuchsia-700 to-fuchsia-950 border-2 border-fuchsia-400 text-fuchsia-100 px-10 py-5 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] rounded-full cursor-pointer flex items-center justify-center gap-3"><Flame className="w-6 h-6"/> Iniciar Cinemática Épica</button>
              <button onClick={() => { setView('campamento_base'); setStartMision4Cinematic(false); setM4Fase(0); }} className="mt-8 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Volver al Campamento Base</button>
            </div>
          ) : m4Fase === 0 ? (
            <div key="cinematica-m4" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-[#0a020d] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2000')] bg-cover bg-center opacity-25 mix-blend-luminosity animate-[slowZoom_40s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a020d] via-[#0a020d]/80 to-transparent z-10"></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 1s' }}><p className="text-2xl md:text-4xl text-slate-300 uppercase tracking-widest md:tracking-[0.5em] font-light drop-shadow-lg">Los reyes fallaron y corrompieron el pacto...</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 6s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-fuchsia-400 uppercase tracking-widest md:tracking-[0.4em] font-bold drop-shadow-[0_0_20px_rgba(217,70,239,0.8)]">La idolatría y la tiranía oscurecieron la tierra.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 11s' }}><p className="text-3xl md:text-6xl lg:text-7xl text-amber-400 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)]">PERO EN EL DESIERTO...</p><p className="text-xl md:text-3xl text-fuchsia-300 uppercase tracking-widest md:tracking-[0.5em] font-bold mt-4">Un fuego implacable comenzó a arder.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 17s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-slate-300 uppercase tracking-widest md:tracking-[0.4em] font-light">Hombres que no le temían a los imperios.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 23s' }}><p className="text-4xl md:text-6xl text-fuchsia-500 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(217,70,239,0.8)]">«¡ASÍ DICE YAHVEH!»</p><p className="text-2xl md:text-4xl text-slate-200 uppercase tracking-widest md:tracking-[0.4em] font-bold mt-4">La verdad frente al poder.</p></div>
              <div className="absolute inset-0 bg-fuchsia-950 z-[100]" style={{ opacity: 0, animation: 'cinematicText 1.5s ease-out forwards 29s' }}></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 3s ease-out forwards 30s' }}>
                <Flame className="w-24 h-24 text-fuchsia-400 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(217,70,239,1)] animate-[pulse_2s_ease-in-out_infinite]" />
                <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-fuchsia-300 to-fuchsia-600 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(217,70,239,0.8)]" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)' }}>VOCES DEL DESIERTO</h1>
                <p className="text-fuchsia-400 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase bg-black/80 inline-block px-8 py-3 border border-fuchsia-900/50 shadow-2xl rounded-full">MISIÓN 4: LOS PROFETAS</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 32s' }}>
                <button onClick={() => { setM4Fase(1); setM4SubTab('archivo'); }} className="bg-gradient-to-r from-fuchsia-900 to-[#1a051d] border-2 border-fuchsia-500 text-fuchsia-200 px-12 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-xl transition-all shadow-[0_0_50px_rgba(217,70,239,0.6)] hover:scale-110 hover:shadow-[0_0_70px_rgba(217,70,239,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">ENTRAR AL FUEGO PROFÉTICO <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full relative z-10">
              <header className="bg-[#0e0310] border-b border-[#3b1540] p-3 flex justify-between items-center z-50 shadow-lg shadow-fuchsia-900/20">
                <div className="flex items-center gap-3">
                  <button onClick={() => {setM4Fase(0); setStartMision4Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> Base {selectedClass}</button>
                  <h2 className="text-fuchsia-300 font-black tracking-widest uppercase text-sm md:text-base">{m4SubTab === 'archivo' ? 'FASE 1: ARCHIVO VISUAL' : m4SubTab === 'codice' ? 'FASE 2: CÓDICE PROFÉTICO' : m4SubTab === 'simulador' ? 'FASE 3: EL RETO DE FUEGO' : 'FASE 4: CIERRE Y METACOGNICIÓN'}</h2>
                </div>
                <button onClick={() => setShowClans(!showClans)} className="text-amber-400 bg-amber-900/30 p-2 rounded-full hover:bg-amber-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
              </header>
              <div className="bg-[#08020a] border-b border-[#3b1540] p-2 flex justify-center gap-2 z-40 shadow-md">
                <button onClick={() => setM4SubTab('archivo')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'archivo' ? 'bg-fuchsia-600 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'bg-[#1a081e] text-fuchsia-400/50 hover:bg-[#250d2c]'}`}>1. ARCHIVO VISUAL</button>
                <button onClick={() => setM4SubTab('codice')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'codice' ? 'bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)]' : 'bg-[#1a081e] text-fuchsia-400/50 hover:bg-[#250d2c]'}`}>2. CÓDICE PROFÉTICO</button>
                <button onClick={() => setM4SubTab('simulador')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'simulador' ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#1a081e] text-fuchsia-400/50 hover:bg-[#250d2c]'}`}>3. EL RETO</button>
                <button onClick={() => setM4SubTab('cierre')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m4SubTab === 'cierre' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#1a081e] text-fuchsia-400/50 hover:bg-[#250d2c]'}`}>4. CIERRE Y METACOGNICIÓN</button>
              </div>

              <div className="flex-grow overflow-y-auto pb-24 p-4 md:p-8 relative custom-scrollbar z-10">
                {m4SubTab === 'archivo' && (
                  <div className="max-w-7xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                      <MonitorPlay className="w-16 h-16 text-fuchsia-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(217,70,239,0.6)] animate-pulse"/>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-fuchsia-300 tracking-widest uppercase mb-2 drop-shadow-lg">ARCHIVO AUDIOVISUAL DE LOS PROFETAS</h2>
                      <p className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase">REGISTRO HISTÓRICO: LAS VOCES QUE DESAFIARON IMPERIOS</p>
                    </div>
                    
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                      <div className="w-full bg-[#0a0b12] border border-fuchsia-900/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.15)] flex flex-col">
                        <div className="bg-[#190a1d] p-3 border-b border-fuchsia-900/50 flex items-center justify-between">
                          <div className="flex items-center gap-2"><Play className="w-4 h-4 text-fuchsia-400"/><span className="text-[10px] text-fuchsia-200 font-bold uppercase tracking-widest">TRANSMISIÓN EN VIVO</span></div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }} src="https://www.canva.com/design/DAHWugF3r_Y/CGzIAO7oBeFfkhz_SVDLvQ/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
                        </div>
                        <div className="p-4 bg-[#0a0b12] border-t border-fuchsia-900/30 text-center">
                          <p className="text-xs text-slate-400 italic font-serif">"El profeta no calla ante la injusticia ni negocia sus valores por conveniencia. Es la voz de la verdad."</p>
                        </div>
                      </div>

                      <div className="w-full bg-[#05060b] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
                        <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2 border-b border-slate-800 pb-3"><Zap className="w-5 h-5"/> EVALUACIÓN DE CUADERNOS DE MISIÓN</h3>
                        <p className="text-slate-400 text-[11px] mb-4 leading-relaxed">Revisión rigurosa de apuntes en el cuaderno de Educación Religiosa. Si un miembro del clan carece del apunte, no se valida la puntuación grupal.</p>
                        
                        <div className="space-y-4 mb-6 flex-grow custom-scrollbar overflow-y-auto pr-2">
                          <div className="bg-[#140818] border border-slate-700/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
                            <div className="flex-grow">
                              <h4 className="text-white text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: RECLUTA (+10 XP)</h4>
                              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">Apuntes básicos. Nombres de profetas anotados pero sin explicar su contexto ni mensaje moral clave.</p>
                            </div>
                          </div>
                          
                          <div className="bg-[#140818] border border-fuchsia-900/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-fuchsia-900 text-fuchsia-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
                            <div className="flex-grow">
                              <h4 className="text-fuchsia-300 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: ESTRATEGA (+25 XP)</h4>
                              <p className="text-[10px] text-fuchsia-200/70 mb-2 leading-relaxed">Apuntes completos con la diferencia entre profetas mayores y menores, y la valentía de confrontar la idolatría.</p>
                            </div>
                          </div>

                          <div className="bg-[#140818] border border-amber-500/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center font-black text-xs shrink-0 mt-1">3</div>
                            <div className="flex-grow">
                              <h4 className="text-amber-300 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: PROFETA DE FUEGO (+50 XP)</h4>
                              <p className="text-[10px] text-amber-200/80 leading-relaxed">Análisis profundo: conecta el clamor profético por la justicia con las situaciones reales de acoso, egoísmo e integridad en el colegio.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center border-t border-slate-800 pt-4">
                          {clansData.map(c => (
                            <button key={c.id} onClick={() => updateScore(c.id, 50)} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-fuchsia-950/40 border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-800 hover:text-white transition-colors cursor-pointer">
                              +50 {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                                {m4SubTab === 'codice' && (
                  <div className="max-w-6xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700 pb-16">
                    <div className="text-center mb-10">
                      <Flame className="w-16 h-16 text-fuchsia-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(217,70,239,0.5)] animate-pulse"/>
                      <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-2">CÓDICE PROFÉTICO UNIVERSAL</h2>
                      <p className="text-fuchsia-400 text-xs font-bold tracking-widest uppercase">TODOS LOS PROFETAS DE ISRAEL Y SU APLICACIÓN DIRECTA EN EL AULA ESCOLAR</p>
                    </div>

                    {/* SECCIÓN 1: PROFETAS DE ACCIÓN Y PIONEROS */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 border-b-2 border-amber-500/40 pb-3 mb-6">
                        <Flame className="w-6 h-6 text-amber-400" />
                        <h3 className="text-xl md:text-2xl font-black text-amber-400 uppercase tracking-wider">1. PROFETAS DE ACCIÓN & PIONEROS (VALENTÍA FRENTE AL PODER)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "ELÍAS EL TESBITA", pasaje: "1 Reyes 18", title: "EL DESAFÍO DEL CARMELO", desc: "Confrontó a 450 profetas de Baal ante el rey Acab. La multitud adoraba lo falso por conveniencia, pero Elías se mantuvo solo con Dios hasta que el fuego descendió.", lesson: "No sigas la corriente de la masa. Ten la valentía de no sumarte a bromas pesadas o bullying escolar cuando todos lo hacen.", color: "text-amber-400", border: "border-amber-500/50", icon: Flame },
                          { name: "ELISEO HIJO DE SAFAT", pasaje: "2 Reyes 2-6", title: "DOBLE PORCIÓN Y SERVICIO", desc: "Realizó 14 milagros ayudando a viudas, multiplicando panes y sanando al general sirio Naamán. Su poder estuvo siempre al servicio de los que menos tenían.", lesson: "Usa tus talentos para apoyar a compañeros con dificultades de aprendizaje. La verdadera grandeza es el servicio humilde.", color: "text-fuchsia-400", border: "border-fuchsia-500/50", icon: Sparkles },
                          { name: "NATÁN", pasaje: "2 Samuel 12", title: "LA VOZ DE LA CONCIENCIA", desc: "Confrontó cara a cara al rey David por su pecado con Betsabé mediante una sabia parábola. No fue cómplice del error de la máxima autoridad.", lesson: "Sé un amigo sincero: ten el coraje de decirle a tus mejores amigos cuando están actuando mal en lugar de encubrir faltas.", color: "text-red-400", border: "border-red-500/50", icon: ShieldAlert }
                        ].map((p, idx) => (
                          <div key={idx} className={`bg-[#0d0412] border-2 ${p.border} p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className={`text-lg font-black uppercase tracking-wider ${p.color}`}>{p.name}</h4>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">{p.pasaje}</span>
                              </div>
                              <span className="bg-white/10 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-widest">{p.title}</span>
                              <p className="text-slate-300 text-xs leading-relaxed my-3">{p.desc}</p>
                            </div>
                            <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 mt-2">
                              <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> EN TU VIDA ESCOLAR:</p>
                              <p className="text-white text-xs font-serif italic">"{p.lesson}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECCIÓN 2: PROFETAS MAYORES */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 border-b-2 border-blue-500/40 pb-3 mb-6">
                        <Eye className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl md:text-2xl font-black text-blue-400 uppercase tracking-wider">2. PROFETAS MAYORES (INTEGRIDAD EN MEDIO DEL IMPERIO)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                          { name: "ISAÍAS", pasaje: "Isaías 6", title: "LABIOS PURIFICADOS", desc: "Vio el trono de Dios y un carbón encendido purificó su boca antes de proclamar justicia y la venida del Mesías.", lesson: "Purifica tus palabras: di NO a las groserías, chismes y apodos que lastiman la dignidad de tus compañeros.", color: "text-blue-400", border: "border-blue-500/50" },
                          { name: "JEREMÍAS", pasaje: "Jeremías 1 y 20", title: "EL PROFETA RESILIENTE", desc: "Fue encarcelado y arrojado a una cisterna por decir la verdad. Lloró por su pueblo pero jamás renunció a su llamado.", lesson: "No te rindas cuando tus compañeros se burlen de ti por hacer lo correcto. La perseverancia forja el carácter.", color: "text-indigo-400", border: "border-indigo-500/50" },
                          { name: "EZEQUIEL", pasaje: "Ezequiel 18 y 33", title: "EL CENTINELA DEL ALMA", desc: "Enseñó que cada individuo responde por su propia conducta moral y que el centinela tiene el deber de alertar del peligro.", lesson: "Asume tu responsabilidad personal: no justifiques tus errores diciendo 'todos lo hicieron'. Tú decides tu honor.", color: "text-purple-400", border: "border-purple-500/50" },
                          { name: "DANIEL", pasaje: "Daniel 1 y 6", title: "FIDELIDAD INQUEBRANTABLE", desc: "No se contaminó con la comida pagana en Babilonia y oró a Dios desafiando el foso de los leones del emperador Darío.", lesson: "Resistencia a la presión social: mantén tus principios intactos cuando el grupo te incite a hacer cosas indebidas.", color: "text-emerald-400", border: "border-emerald-500/50" }
                        ].map((p, idx) => (
                          <div key={idx} className={`bg-[#0d0412] border-2 ${p.border} p-5 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-base font-black uppercase tracking-wider ${p.color}`}>{p.name}</h4>
                                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">{p.pasaje}</span>
                              </div>
                              <span className="bg-white/10 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">{p.title}</span>
                              <p className="text-slate-300 text-xs leading-relaxed my-3">{p.desc}</p>
                            </div>
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 mt-2">
                              <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> EN TU VIDA ESCOLAR:</p>
                              <p className="text-white text-xs font-serif italic">"{p.lesson}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SECCIÓN 3: PROFETAS MENORES */}
                    <div>
                      <div className="flex items-center gap-3 border-b-2 border-emerald-500/40 pb-3 mb-6">
                        <Scale className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-xl md:text-2xl font-black text-emerald-400 uppercase tracking-wider">3. PROFETAS MENORES (JUSTICIA SOCIAL, PERDÓN Y CONVIVENCIA)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          { name: "AMÓS", pasaje: "Amós 5:24", title: "JUSTICIA PARA EL OPRIMIDO", desc: "Pastor de campo que denunció a los ricos que explotaban a los necesitados: 'Corra el juicio como las aguas'.", lesson: "Tolerancia cero al acoso escolar (bullying). Ponte del lado del compañero vulnerable e indefenso.", color: "text-amber-400", border: "border-amber-500/40" },
                          { name: "MIQUEAS", pasaje: "Miqueas 6:8", title: "LA REGLA DE ORO", desc: "Sintetizó todo el deber humano: 'Hacer justicia, amar la misericordia y humillarte ante tu Dios'.", lesson: "La fórmula de convivencia en el aula: sé justo con todos, perdona con rapidez y sé humilde sin presumir notas.", color: "text-emerald-400", border: "border-emerald-500/40" },
                          { name: "JONÁS", pasaje: "Jonás 3-4", title: "VENCER EL PREJUICIO", desc: "Huyó en un barco por rencor a los ninivitas, pero Dios le enseñó que su misericordia alcanza incluso a los enemigos.", lesson: "Supera rencores escolares. Dale una segunda oportunidad a compañeros con los que hayas tenido roces o disgustos.", color: "text-cyan-400", border: "border-cyan-500/40" },
                          { name: "OSEAS", pasaje: "Oseas 3", title: "EL AMOR INCONDICIONAL", desc: "Amó y perdonó a su esposa infiel como símbolo del amor paciente de Dios que jamás abandona a su pueblo.", lesson: "Lealtad y fidelidad en la amistad: no deseches a tus amigos ni los dejes de lado cuando cometen un error.", color: "text-pink-400", border: "border-pink-500/40" },
                          { name: "HABACUC", pasaje: "Habacuc 3:17-19", title: "FE ANTE LA INCERTIDUMBRE", desc: "Cuestionó el dolor pero terminó cantando con fe: 'Aunque la higuera no florezca... me alegraré en Yahveh'.", lesson: "Mantén la calma y la fe en momentos difíciles (ansiedad ante exámenes bimestrales o problemas en el hogar).", color: "text-purple-400", border: "border-purple-500/40" },
                          { name: "MALAQUÍAS", pasaje: "Malaquías 3", title: "HONRADEZ EN LO OCULTO", desc: "Último profeta del Antiguo Testamento. Exigió pureza en las ofrendas y lealtad verdadera sin apariencias.", lesson: "Honradez absoluta: sé honesto en tus tareas y exámenes incluso cuando el profesor no esté mirando.", color: "text-teal-400", border: "border-teal-500/40" }
                        ].map((p, idx) => (
                          <div key={idx} className={`bg-[#0d0412] border-2 ${p.border} p-5 rounded-3xl shadow-xl flex flex-col justify-between hover:scale-[1.02] transition-transform`}>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`text-base font-black uppercase tracking-wider ${p.color}`}>{p.name}</h4>
                                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-slate-300 font-mono">{p.pasaje}</span>
                              </div>
                              <span className="bg-white/10 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-widest">{p.title}</span>
                              <p className="text-slate-300 text-xs leading-relaxed my-3">{p.desc}</p>
                            </div>
                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 mt-2">
                              <p className="text-[9px] text-amber-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1"><Target className="w-3 h-3"/> EN TU VIDA ESCOLAR:</p>
                              <p className="text-white text-xs font-serif italic">"{p.lesson}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {m4SubTab === 'simulador' && (
                  <div className="max-w-5xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#140518] border border-fuchsia-900/50 rounded-3xl p-6 md:p-12 relative shadow-[0_0_50px_rgba(217,70,239,0.15)] flex flex-col items-center text-center">
                      <Flame className="w-20 h-20 text-fuchsia-500 mb-6 drop-shadow-[0_0_30px_rgba(217,70,239,0.8)] animate-pulse"/>
                      <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 to-amber-400 uppercase tracking-widest mb-4">EL RETO DE FUEGO PROFÉTICO</h2>
                      <p className="text-fuchsia-400 text-xs md:text-sm font-bold tracking-widest uppercase bg-fuchsia-950/40 inline-block px-6 py-2 rounded-full border border-fuchsia-900/50 mb-8">
                        5 DILEMAS MORALES REALES DEL SALÓN: ¿CALLAR POR COMODIDAD O HABLAR CON VALOR?
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left w-full mb-8">
                        {[
                          { num: 1, profeta: "ELÍAS (Monte Carmelo)", caso: "ACOSO GRUPAL / MODA SOCIAL", desc: "Todo el clan o salón empieza a aislar y burlarse de un estudiante nuevo para verse graciosos en redes o en el aula. ¿Te unes para encajar o te levantas a defenderlo como Elías ante los 450 falsos profetas?" },
                          { num: 2, profeta: "DANIEL (El Foso)", caso: "TRAMPA EN EL EXAMEN", desc: "Tus amigos consiguen las respuestas de la evaluación bimestral y te presionan: 'Si no las usas, eres un mal amigo'. ¿Prefieres la nota fácil con trampa o la integridad de Daniel frente a los leones?" },
                          { num: 3, profeta: "AMÓS (Justicia Social)", caso: "ABUSO EN EL RECREO", desc: "Ves que alumnos mayores le quitan la comida o empujan a un compañero tímido de grados menores. ¿Miras para otro lado diciendo 'no es mi problema' o actúas con el celo de Amós?" },
                          { num: 4, profeta: "JONÁS (Nínive)", caso: "SEGUNDAS OPORTUNIDADES", desc: "El compañero que te ofendió o habló mal de ti el mes pasado necesita integrarse a tu clan para no reprobar. ¿Guardas rencor egoísta o le abres la puerta perdonando de corazón?" },
                          { num: 5, profeta: "JEREMÍAS (Resiliencia)", caso: "PRESION DIGITAL EN WHATSAPP", desc: "Crean un grupo paralelo para criticar al profesor o a una compañera y te advierten que si no participas te expulsarán del círculo. ¿Cedes a la intimidación o tienes la firmeza de Jeremías?" }
                        ].map(d => (
                          <div key={d.num} className="bg-[#0a020d] border border-fuchsia-900/40 p-5 rounded-2xl flex flex-col justify-between hover:border-fuchsia-500/50 transition-colors shadow-lg">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="bg-fuchsia-950 text-fuchsia-300 font-mono text-[10px] font-black px-2.5 py-1 rounded border border-fuchsia-800">CASO #{d.num}</span>
                                <span className="text-amber-400 text-[10px] font-bold uppercase">{d.profeta}</span>
                              </div>
                              <h4 className="text-white font-black text-sm uppercase tracking-wider mb-2">{d.caso}</h4>
                              <p className="text-slate-300 text-xs leading-relaxed italic">"{d.desc}"</p>
                            </div>
                          </div>
                        ))}
                        <div className="bg-gradient-to-br from-fuchsia-950/40 to-[#0a020d] border border-amber-500/40 p-5 rounded-2xl flex flex-col justify-center text-center">
                          <Crown className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                          <h4 className="text-white font-black text-sm uppercase tracking-wider mb-1">AUDITORÍA DEL DOCENTE</h4>
                          <p className="text-slate-300 text-xs leading-relaxed">
                            El clan sorteado o voluntario defiende su respuesta oralmente en 1 minuto aplicando las escrituras.
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#0b0310] p-6 rounded-2xl border border-fuchsia-500/30 w-full text-left shadow-xl">
                        <p className="text-amber-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                          <Trophy className="w-5 h-5"/> PREMIAR DEFENSA PROFÉTICA MAGISTRAL (+150 XP AL CLAN):
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {clansData.map(c => (
                            <button 
                              key={c.id} 
                              onClick={() => updateScore(c.id, 150)} 
                              className="px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider bg-fuchsia-950/40 border border-fuchsia-500/30 text-fuchsia-300 hover:bg-amber-600 hover:text-black hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between shadow-md hover:scale-105">
                              <span className="truncate">{c.name}</span>
                              <span className="text-[10px] font-mono bg-black/50 px-1.5 py-0.5 rounded text-amber-300">+150</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

{m4SubTab === 'cierre' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#05020a] border border-fuchsia-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(217,70,239,0.15)] flex flex-col items-center text-center overflow-hidden">
                      <div className="w-20 h-20 bg-fuchsia-950/50 rounded-3xl flex items-center justify-center border-2 border-fuchsia-500/50 mb-8 shadow-[0_0_30px_rgba(217,70,239,0.4)] relative z-10">
                        <CheckCircle2 className="w-10 h-10 text-fuchsia-400 drop-shadow-[0_0_15px_rgba(217,70,239,0.8)] animate-pulse"/>
                      </div>
                      
                      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-200 to-fuchsia-600 uppercase tracking-widest mb-4 relative z-10">METACOGNICIÓN PROFÉTICA</h2>
                      <p className="text-fuchsia-400 text-xs md:text-sm font-bold tracking-widest md:tracking-[0.3em] uppercase bg-fuchsia-950/40 inline-block px-6 py-2 rounded-full border border-fuchsia-900/50 mb-10 relative z-10">CIERRE DE LA MISIÓN 4</p>
                      
                      <div className="w-full space-y-6 relative z-10 text-left">
                        <div className="bg-[#120416] border border-fuchsia-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-fuchsia-500/50 transition-colors shadow-lg">
                          <div className="bg-fuchsia-950/50 p-4 rounded-xl border border-fuchsia-800 shrink-0"><Target className="w-6 h-6 text-fuchsia-400"/></div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">1. INTEGRIDAD PERSONAL</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">¿En qué situación cotidiana te cuesta más mantener tu integridad: frente a tus amigos, en las redes sociales o en los exámenes?</p>
                          </div>
                        </div>

                        <div className="bg-[#120416] border border-fuchsia-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-fuchsia-500/50 transition-colors shadow-lg">
                          <div className="bg-fuchsia-950/50 p-4 rounded-xl border border-fuchsia-800 shrink-0"><Users className="w-6 h-6 text-fuchsia-400"/></div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">2. RESPONSABILIDAD DE CLAN</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">¿Cómo puede tu clan convertirse en una "voz de justicia" dentro de tu aula para detener burlas o divisiones?</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-fuchsia-900/40 w-full relative z-10 flex flex-col items-center">
                        <button onClick={() => { setM4SubTab('archivo'); setM4Fase(0); setStartMision4Cinematic(false); setView('campamento_base'); }} className="group relative px-10 py-5 rounded-full overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_50px_rgba(217,70,239,0.6)] hover:scale-105 transition-all duration-300 border border-fuchsia-500/50 cursor-pointer">
                          <div className="absolute inset-0 bg-fuchsia-600 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                          <span className="relative z-10 flex items-center gap-3 text-fuchsia-400 group-hover:text-white font-black uppercase tracking-widest md:tracking-[0.2em] transition-colors">
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
      {/* ── MISIÓN 5: HEROÍNAS DE LA FE ──────────────────────────── */}
      {/* ════════════════════════════════════════════════════════════ */}
      {view === 'mision5' && (
        <div className="flex-grow flex flex-col relative overflow-hidden bg-[#020b08] min-h-screen">
          {m5Fase === 0 && (
            <div className="absolute top-4 right-4 z-[9999] w-48 md:w-64 h-28 md:h-36 bg-[#0a0b12] border border-emerald-600/30 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.2)] group hover:scale-105 transition-transform">
              <div className="absolute top-0 left-0 w-full bg-emerald-900/90 text-[10px] font-black tracking-widest text-white px-2 py-1 text-center uppercase flex items-center justify-center gap-2 z-10"><Volume2 className="w-3 h-3 animate-pulse"/> AUDIO MISIÓN 5</div>
              <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none', padding: 0, margin: 0, marginTop: '24px' }} src="https://www.canva.com/design/DAHUpFG0HGw/LtS7S0nuTMhG6sedKbanpw/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
            </div>
          )}

          {!startMision5Cinematic ? (
            <div className="z-10 flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-1000 max-w-2xl mx-auto px-4 w-full h-full">
              <Shield className="w-24 h-24 text-emerald-400 mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-pulse"/>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-4">MISIÓN 5: HEROÍNAS DE LA FE</h1>
              <p className="text-emerald-400 text-xs md:text-sm tracking-widest md:tracking-[0.3em] uppercase mb-10 font-bold border border-emerald-900/50 bg-emerald-950/30 px-6 py-4 rounded-xl">INSTRUCCIÓN GM: <br/><br/>1) ACTIVA EL AUDIO EN LA ESQUINA.<br/>2) INICIA LA CINEMÁTICA ÉPICA.</p>
              <button onClick={() => setStartMision5Cinematic(true)} className="bg-gradient-to-b from-emerald-700 to-emerald-950 border-2 border-emerald-400 text-emerald-100 px-10 py-5 uppercase tracking-widest md:tracking-[0.3em] font-black transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] rounded-full cursor-pointer flex items-center justify-center gap-3"><Shield className="w-6 h-6"/> Iniciar Cinemática Épica</button>
              <button onClick={() => { setView('campamento_base'); setStartMision5Cinematic(false); setM5Fase(0); }} className="mt-8 text-slate-500 text-[10px] tracking-widest uppercase hover:text-white cursor-pointer transition-colors border-b border-transparent hover:border-white">Volver al Campamento Base</button>
            </div>
          ) : m5Fase === 0 ? (
            <div key="cinematica-m5" className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none bg-[#010805] overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000')] bg-cover bg-center opacity-25 mix-blend-luminosity animate-[slowZoom_40s_linear_forwards]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#010805] via-[#010805]/80 to-transparent z-10"></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 1s' }}><p className="text-2xl md:text-4xl text-slate-300 uppercase tracking-widest md:tracking-[0.5em] font-light drop-shadow-lg">Donde los hombres retrocedieron por temor...</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 5s ease-out forwards 6s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-emerald-400 uppercase tracking-widest md:tracking-[0.4em] font-bold drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">La Providencia levantó mujeres valientes e inquebrantables.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 11s' }}><p className="text-3xl md:text-6xl lg:text-7xl text-amber-300 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(245,158,11,1)]">ESTRATEGAS • REINAS • LEALES</p><p className="text-xl md:text-3xl text-emerald-200 uppercase tracking-widest md:tracking-[0.5em] font-bold mt-4">Su fe cambió el curso de toda una nación.</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 17s' }}><p className="text-2xl md:text-4xl lg:text-5xl text-slate-300 uppercase tracking-widest md:tracking-[0.4em] font-light">«Si perezco, que perezca...»</p></div>
              <div className="absolute text-center px-4 w-full z-20" style={{ opacity: 0, animation: 'cinematicText 6s ease-out forwards 23s' }}><p className="text-4xl md:text-6xl text-emerald-400 uppercase tracking-widest md:tracking-[0.3em] font-black drop-shadow-[0_0_40px_rgba(16,185,129,0.8)]">HOY SU VALOR DESPIERTA EN TI.</p><p className="text-2xl md:text-4xl text-slate-200 uppercase tracking-widest md:tracking-[0.4em] font-bold mt-4">La fuerza de las escogidas de Dios.</p></div>
              <div className="absolute inset-0 bg-emerald-950 z-[100]" style={{ opacity: 0, animation: 'cinematicText 1.5s ease-out forwards 29s' }}></div>
              <div className="absolute text-center px-4 w-full z-[101]" style={{ opacity: 0, animation: 'cinematicTextStay 3s ease-out forwards 30s' }}>
                <Shield className="w-24 h-24 text-emerald-400 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(16,185,129,1)] animate-[pulse_2s_ease-in-out_infinite]" />
                <h1 className="text-6xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-200 to-emerald-600 tracking-tighter uppercase drop-shadow-[0_0_60px_rgba(16,185,129,0.8)]" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)' }}>HEROÍNAS DE LA FE</h1>
                <p className="text-emerald-400 mt-6 text-xl md:text-3xl tracking-widest md:tracking-[0.6em] font-bold uppercase bg-black/80 inline-block px-8 py-3 border border-emerald-900/50 shadow-2xl rounded-full">MISIÓN 5: MUJERES DE ISRAEL</p>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center z-[200] pointer-events-auto" style={{ opacity: 0, animation: 'cinematicTextStay 2s ease-out forwards 32s' }}>
                <button onClick={() => { setM5Fase(1); setM5SubTab('archivo'); }} className="bg-gradient-to-r from-emerald-900 to-[#021f14] border-2 border-emerald-500 text-emerald-200 px-12 py-5 font-black uppercase tracking-widest md:tracking-[0.4em] text-xl transition-all shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-110 hover:shadow-[0_0_70px_rgba(16,185,129,1)] flex items-center gap-4 cursor-pointer rounded-full backdrop-blur-md">INGRESAR AL ARCHIVO DE HEROÍNAS <ChevronRight className="w-8 h-8"/></button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col w-full h-full relative z-10">
              <header className="bg-[#04120a] border-b border-[#0f3d24] p-3 flex justify-between items-center z-50 shadow-lg shadow-emerald-900/20">
                <div className="flex items-center gap-3">
                  <button onClick={() => {setM5Fase(0); setStartMision5Cinematic(false); setView('campamento_base');}} className="text-slate-400 hover:text-white bg-slate-900 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"><ChevronRight className="rotate-180 w-3 h-3"/> Base {selectedClass}</button>
                  <h2 className="text-emerald-300 font-black tracking-widest uppercase text-sm md:text-base">{m5SubTab === 'archivo' ? 'FASE 1: ARCHIVO VISUAL' : m5SubTab === 'codice' ? 'FASE 2: CÓDICE DE HEROÍNAS' : m5SubTab === 'simulador' ? 'FASE 3: EL RETO DEL VALOR' : 'FASE 4: CIERRE Y METACOGNICIÓN'}</h2>
                </div>
                <button onClick={() => setShowClans(!showClans)} className="text-amber-400 bg-amber-900/30 p-2 rounded-full hover:bg-amber-800/50 cursor-pointer transition-colors"><Trophy className="w-4 h-4"/></button>
              </header>
              <div className="bg-[#020b06] border-b border-[#0f3d24] p-2 flex justify-center gap-2 z-40 shadow-md">
                <button onClick={() => setM5SubTab('archivo')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m5SubTab === 'archivo' ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-[#092215] text-emerald-400/50 hover:bg-[#0e311f]'}`}>1. ARCHIVO VISUAL</button>
                <button onClick={() => setM5SubTab('codice')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m5SubTab === 'codice' ? 'bg-teal-600 text-white shadow-[0_0_10px_rgba(20,184,166,0.5)]' : 'bg-[#092215] text-emerald-400/50 hover:bg-[#0e311f]'}`}>2. CÓDICE DE HEROÍNAS</button>
                <button onClick={() => setM5SubTab('simulador')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m5SubTab === 'simulador' ? 'bg-amber-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-[#092215] text-emerald-400/50 hover:bg-[#0e311f]'}`}>3. EL RETO</button>
                <button onClick={() => setM5SubTab('cierre')} className={`px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest rounded transition-colors cursor-pointer whitespace-nowrap ${m5SubTab === 'cierre' ? 'bg-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.5)]' : 'bg-[#092215] text-emerald-400/50 hover:bg-[#0e311f]'}`}>4. CIERRE Y METACOGNICIÓN</button>
              </div>

              <div className="flex-grow overflow-y-auto pb-24 p-4 md:p-8 relative custom-scrollbar z-10">
                {m5SubTab === 'archivo' && (
                  <div className="max-w-7xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                      <MonitorPlay className="w-16 h-16 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse"/>
                      <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-300 tracking-widest uppercase mb-2 drop-shadow-lg">ARCHIVO VISUAL: HEROÍNAS DE LA FE</h2>
                      <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">REGISTRO HISTÓRICO: MUJERES QUE TRANSFORMARON LA HISTORIA BÍBLICA</p>
                    </div>
                    
                    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                      <div className="w-full bg-[#0a0b12] border border-emerald-900/50 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col">
                        <div className="bg-[#041a10] p-3 border-b border-emerald-900/50 flex items-center justify-between">
                          <div className="flex items-center gap-2"><Play className="w-4 h-4 text-emerald-400"/><span className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest">TRANSMISIÓN EN VIVO</span></div>
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe loading="lazy" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, border: 'none' }} src="https://www.canva.com/design/DAHUpFG0HGw/LtS7S0nuTMhG6sedKbanpw/watch?embed" allowFullScreen allow="autoplay; fullscreen; clipboard-write; encrypted-media"></iframe>
                        </div>
                        <div className="p-4 bg-[#0a0b12] border-t border-emerald-900/30 text-center">
                          <p className="text-xs text-slate-400 italic font-serif">"La verdadera valentía no es la ausencia de miedo, sino actuar con determinación por el bien de los demás."</p>
                        </div>
                      </div>

                      <div className="w-full bg-[#05060b] border border-[#1e293b] rounded-2xl p-6 flex flex-col shadow-lg">
                        <h3 className="text-amber-500 font-black uppercase tracking-widest text-sm mb-4 flex items-center gap-2 border-b border-slate-800 pb-3"><Zap className="w-5 h-5"/> EVALUACIÓN DE CUADERNOS DE MISIÓN</h3>
                        <p className="text-slate-400 text-[11px] mb-4 leading-relaxed">Auditoría de apuntes en el cuaderno de Educación Religiosa sobre las heroínas y sus decisiones tácticas.</p>
                        
                        <div className="space-y-4 mb-6 flex-grow custom-scrollbar overflow-y-auto pr-2">
                          <div className="bg-[#07160e] border border-slate-700/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">1</div>
                            <div className="flex-grow">
                              <h4 className="text-white text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: RECLUTA (+10 XP)</h4>
                              <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">Apuntes superficiales con nombres de las mujeres sin profundizar en su dilema moral ni en su contexto.</p>
                            </div>
                          </div>
                          
                          <div className="bg-[#07160e] border border-emerald-900/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-emerald-900 text-emerald-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">2</div>
                            <div className="flex-grow">
                              <h4 className="text-emerald-300 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: ESTRATEGA (+25 XP)</h4>
                              <p className="text-[10px] text-emerald-200/70 mb-2 leading-relaxed">Apuntes claros: destaca a Débora como jueza militar, Rut como modelo de lealtad y Ester arriesgando la corona por su pueblo.</p>
                            </div>
                          </div>

                          <div className="bg-[#07160e] border border-amber-500/50 p-4 rounded-lg flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center font-black text-xs shrink-0 mt-1">3</div>
                            <div className="flex-grow">
                              <h4 className="text-amber-300 text-[11px] md:text-xs font-black uppercase tracking-widest mb-1">NIVEL: HEROÍNA / HÉROE DE FE (+50 XP)</h4>
                              <p className="text-[10px] text-amber-200/80 leading-relaxed">Aplicación magistral a la vida diaria: explica cómo la prudencia de Abigail y la lealtad de Rut nos enseñan a resolver conflictos en el colegio.</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center border-t border-slate-800 pt-4">
                          {clansData.map(c => (
                            <button key={c.id} onClick={() => updateScore(c.id, 50)} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-800 hover:text-white transition-colors cursor-pointer">
                              +50 {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {m5SubTab === 'codice' && (
                  <div className="max-w-6xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-10">
                      <Shield className="w-16 h-16 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]"/>
                      <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-widest mb-2">CÓDICE DE HEROÍNAS BÍBLICAS</h2>
                      <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">CORAJE, INTELIGENCIA Y LEALTAD EXTREMA</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { name: "DÉBORA", title: "LA JUEZA Y ESTRATEGA", desc: "La única mujer jueza de Israel. Lideró a las tropas junto a Barac para derrotar al general Sísara bajo el poder de Dios.", lesson: "El liderazgo espiritual y moral no depende del género, sino de la convicción y la obediencia a Dios.", color: "text-emerald-400", border: "border-emerald-500/40", icon: Swords },
                        { name: "RUT LA MOABITA", title: "LEALTAD INQUEBRANTABLE", desc: "Extranjera que eligió quedarse junto a Noemí: 'Tu pueblo será mi pueblo, y tu Dios mi Dios'. Se convirtió en bisabuela del rey David.", lesson: "La bondad y la fidelidad desinteresada abren las puertas a la bendición de generaciones.", color: "text-amber-400", border: "border-amber-500/40", icon: Heart },
                        { name: "REINA ESTER", title: "VALOR FRENTE AL IMPERIO", desc: "Arriesgó su propia vida entrando ante el rey Asuero sin ser llamada para desenmascarar el plan genocida de Amán y salvar a su pueblo.", lesson: "¿Quién sabe si para esta hora exacta la vida te colocó en este lugar para hacer justicia?", color: "text-purple-400", border: "border-purple-500/40", icon: Crown },
                        { name: "ABIGAIL", title: "SABIDURÍA QUE FRENA LA GUERRA", desc: "Mujer prudente que salió al encuentro de David con provisiones y palabras sabias, evitando una masacre provocada por la insensatez de su esposo Nabal.", lesson: "La diplomacia y la paz valen más que la venganza ciega y el orgullo.", color: "text-teal-400", border: "border-teal-500/40", icon: ShieldAlert }
                      ].map((h, idx) => (
                        <div key={idx} className={`bg-[#05130b] border-2 ${h.border} p-6 md:p-8 rounded-3xl shadow-xl hover:scale-[1.01] transition-transform flex flex-col justify-between`}>
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className={`text-2xl font-black uppercase tracking-wider ${h.color}`}>{h.name}</h3>
                              <h.icon className={`w-8 h-8 ${h.color}`}/>
                            </div>
                            <span className="bg-white/10 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">{h.title}</span>
                            <p className="text-slate-300 text-sm leading-relaxed my-4">{h.desc}</p>
                          </div>
                          <div className="bg-black/50 p-4 rounded-xl border border-white/10 mt-4">
                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Target className="w-3.5 h-3.5"/> LECCIÓN TÁCTICA PARA EL AULA:</p>
                            <p className="text-white text-xs font-serif italic">"{h.lesson}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {m5SubTab === 'simulador' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#05160d] border border-emerald-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center">
                      <Shield className="w-20 h-20 text-emerald-400 mb-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)] animate-pulse"/>
                      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-amber-300 uppercase tracking-widest mb-4">EL RETO DEL VALOR</h2>
                      <p className="text-emerald-400 text-xs md:text-sm font-bold tracking-widest md:tracking-[0.3em] uppercase bg-emerald-950/40 inline-block px-6 py-2 rounded border border-emerald-900/50 mb-8">DILEMAS MORALES DEL AULA: LEALTAD Y DEFENSA DEL DÉBIL</p>
                      
                      <div className="bg-[#020b06] border border-emerald-900/30 p-6 md:p-8 rounded-2xl w-full text-left mb-8 shadow-inner">
                        <p className="text-white italic text-lg md:text-xl leading-relaxed font-serif border-l-4 border-emerald-500 pl-4">"Como Rut y Ester, defender al que no puede defenderse requiere romper con el egoísmo. Si un compañero nuevo o solitario es ignorado por todos, ¿qué acción concreta de lealtad tomarías tú hoy?"</p>
                      </div>

                      <div className="bg-[#04120a] p-6 rounded-2xl border border-emerald-500/30 w-full mb-8 text-left">
                        <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><Trophy className="w-4 h-4"/> JUZGAR AL CLAN RESPONDENTE (+150 XP):</p>
                        <div className="flex flex-wrap gap-3">
                          {clansData.map(c => (
                            <button key={c.id} onClick={() => updateScore(c.id, 150)} className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${c.border.replace('border-', 'bg-').replace('/50', '/10')} hover:${c.border.replace('border-', 'bg-').replace('/50', '/40')} border border-slate-700 hover:border-white text-slate-300 hover:text-white flex items-center gap-3 cursor-pointer shadow-lg`}>
                              <span>{c.icon}</span> {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {m5SubTab === 'cierre' && (
                  <div className="max-w-4xl mx-auto mt-4 animate-in slide-in-from-bottom-8 duration-500 pb-20">
                    <div className="bg-[#020b06] border border-emerald-900/50 rounded-3xl p-8 md:p-12 relative shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col items-center text-center overflow-hidden">
                      <div className="w-20 h-20 bg-emerald-950/50 rounded-3xl flex items-center justify-center border-2 border-emerald-500/50 mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)] relative z-10">
                        <CheckCircle2 className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"/>
                      </div>
                      
                      <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-emerald-600 uppercase tracking-widest mb-4 relative z-10">METACOGNICIÓN FINAL</h2>
                      <p className="text-emerald-400 text-xs md:text-sm font-bold tracking-widest md:tracking-[0.3em] uppercase bg-emerald-950/40 inline-block px-6 py-2 rounded-full border border-emerald-900/50 mb-10 relative z-10">CIERRE DE LA MISIÓN 5</p>
                      
                      <div className="w-full space-y-6 relative z-10 text-left">
                        <div className="bg-[#07190f] border border-emerald-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/50 transition-colors shadow-lg">
                          <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 shrink-0"><Target className="w-6 h-6 text-emerald-400"/></div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">1. SABIDURÍA Y ACCIÓN</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">De las cuatro heroínas estudiadas hoy (Débora, Rut, Ester, Abigail), ¿con cuál de sus virtudes te identificas más y por qué?</p>
                          </div>
                        </div>

                        <div className="bg-[#07190f] border border-emerald-900/30 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-start hover:border-emerald-500/50 transition-colors shadow-lg">
                          <div className="bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 shrink-0"><Users className="w-6 h-6 text-emerald-400"/></div>
                          <div>
                            <h4 className="text-white font-black uppercase tracking-widest text-lg mb-2">2. PACTO DE RESPETO</h4>
                            <p className="text-slate-300 leading-relaxed text-sm md:text-base">Escribe en tu Códice una regla de oro que tu clan aplicará para valorar y respetar a cada compañera y compañero del salón.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-12 pt-8 border-t border-emerald-900/40 w-full relative z-10 flex flex-col items-center">
                        <button onClick={() => { setM5SubTab('archivo'); setM5Fase(0); setStartMision5Cinematic(false); setView('campamento_base'); }} className="group relative px-10 py-5 rounded-full overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] hover:scale-105 transition-all duration-300 border border-emerald-500/50 cursor-pointer">
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

    </div>
  );
}
