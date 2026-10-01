export const clansData = [
  { id: 'c1', name: 'Leones de Judá', attribute: 'Autoridad y Liderazgo', icon: '🦁', color: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-950/30', hero: 'David y Judá', symbol: 'El Cetro Real y el León', lema: '"De nosotros viene el cetro."', origen: 'Surgidos de la tribu real. No gobiernan por la fuerza, sino por la autoridad divina y la valentía inquebrantable.', llamada: '"Han sido elegidos porque esta prueba requiere el coraje de quienes jamás retroceden."' },
  { id: 'c2', name: 'Águilas de Isaías', attribute: 'Visión y Profecía', icon: '🦅', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-950/30', hero: 'Isaías y el Remanente', symbol: 'El Carbón y las Alas', lema: '"Vemos lo que está por venir."', origen: 'Elevan sus alas por encima de las tormentas. Tienen la visión de Dios para anunciar la verdad.', llamada: '"La Providencia los llama a descifrar este misterio con los ojos del profeta."' },
  { id: 'c3', name: 'Guerreros de Josué', attribute: 'Valor y Conquista', icon: '⚔️', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/30', hero: 'Josué y Caleb', symbol: 'Trompetas y Espada', lema: '"Ni un paso atrás."', origen: 'Ningún muro de duda ni gigante de miedo puede detenerlos. Su fuerza es la obediencia a Yahveh.', llamada: '"El cielo los ha convocado porque esta misión requiere conquistadores de fe inquebrantable."' },
  { id: 'c4', name: 'Sabios de Salomón', attribute: 'Sabiduría y Discernimiento', icon: '📜', color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/30', hero: 'Salomón', symbol: 'El Manuscrito', lema: '"La mente sobre la espada."', origen: 'No buscan gloria terrenal. Disciernen el bien y el mal, convirtiendo la verdad en su escudo.', llamada: '"Han sido seleccionados para desenredar la confusión con sabiduría de lo Alto."' },
  { id: 'c5', name: 'Centinelas de Nehemías', attribute: 'Restauración y Vigilancia', icon: '🛡️', color: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-950/30', hero: 'Nehemías', symbol: 'La Lanza y la Cuchara', lema: '"Reconstruimos las ruinas."', origen: 'Defensores dedicados a reconstruir lo destruido. Trabajan con una mano en la obra y otra en la espada.', llamada: '"Su llamado es reconstruir la identidad sagrada, manteniendo alerta la guardia."' },
  { id: 'c6', name: 'Valientes de David', attribute: 'Lealtad y Sacrificio', icon: '💧', color: 'text-green-500', border: 'border-green-500/50', bg: 'bg-green-950/30', hero: 'Los Tres Valientes', symbol: 'Honda y Vasija', lema: '"Hasta la última gota."', origen: 'Pocos pero invencibles. Su distintivo supremo es la lealtad absoluta e inquebrantable.', llamada: '"Frente a gigantes que desafían al Dios viviente. Preparad la honda y la piedra lisa."' },
  { id: 'c7', name: 'Llamas de Elías', attribute: 'Celo y Fuego Divino', icon: '🔥', color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/30', hero: 'Elías el Tesbita', symbol: 'El Altar en Fuego', lema: '"Que el fuego responda."', origen: 'Fuego puro devorador de la falsedad. Ellos hacen descender la presencia viviente del Dios Yahveh.', llamada: '"La Providencia exige que ustedes enciendan la chispa en medio de la oscuridad."' }
];

export const unassignedStudentsDB = {};
export const defaultRoster = {};
export const defaultScores = {};

export const ederLegacyScores = {
  '1A': { c7: 820, c2: 700, c6: 670, c4: 530, c1: 400, c3: 320, c5: 270 },
  '1B': { c1: 860, c2: 850, c7: 530, c4: 360, c5: 290, c3: 250, c6: 250 },
  '1C': { c7: 710, c1: 460, c4: 420, c3: 420, c5: 280, c2: 160, c6: 20 }
};

export const ederLegacyRoster = {
  '1A': { c1: ["AGUAYO", "FILINICH"], c2: ["LARRIEGA", "MEDINA"], c3: ["ALVA", "BRAVO"], c4: ["IGLESIAS", "VIAÑA"], c5: ["HERNANDEZ", "SALAS"], c6: ["PRETTO", "YUCRA"], c7: ["ROMAN", "CASIANO"] },
  '1B': { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] },
  '1C': { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] }
};

export const pectoralStones = [
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

export const casosTribunal = [
  { id: 1, titulo: "LA FUERZA DESBORDADA", descripcion: "\"El alumno más brillante de su clan hace todo el trabajo solo en 1 minuto y no deja que nadie más participe.\"", tipo: "NIVEL 1", exigencia: "Relacionen esta actitud con el EGO de Gedeón. Defiendan: ¿Por qué el talento debe servir al equipo y no al ego personal?" },
  { id: 2, titulo: "EL VOTO ABSURDO", descripcion: "\"En desesperación, un líder de clan grita: '¡Si nos ayudas a ganar, te daremos todas nuestras notas!'.\"", tipo: "NIVEL 1", exigencia: "Como Jefté, hicieron una promesa ignorante. Defiendan: ¿Por qué un líder debe controlar sus emociones antes de hablar?" },
  { id: 3, titulo: "EL NARCISISTA", descripcion: "\"Un estudiante con gran habilidad se burla de los más débiles de su clan, creyéndose superior.\"", tipo: "NIVEL 1", exigencia: "Como Sansón, su fuerza lo ciega moralmente. Propongan una defensa oral sobre la humildad en el salón." },
  { id: 4, titulo: "LA GUERRA CIVIL", descripcion: "\"Dos clanes del mismo salón empiezan a sabotearse e insultarse para ver quién gana.\"", tipo: "NIVEL 1", exigencia: "Al final de Jueces, las tribus se mataron entre sí. Defiendan una postura de convivencia pacífica inter-clanes." },
  { id: 5, titulo: "ÍDOLOS FALSOS", descripcion: "\"Un alumno popular sugiere copiarse en el examen, y todos le siguen la corriente ciegamente.\"", tipo: "NIVEL 1", exigencia: "Israel adoraba ídolos por presión social. Defiendan: ¿Cómo actuar con integridad frente a la mala influencia?" },
  { id: 6, titulo: "EL BOTÍN DE GUERRA", descripcion: "\"Alguien esconde los útiles de un compañero de otro clan como 'broma', causando angustia.\"", tipo: "NIVEL 1", exigencia: "El robo destruye la paz. Defiendan el respeto a la propiedad ajena y la empatía en el aula." },
  { id: 7, titulo: "SILENCIO CÓMPLICE", descripcion: "\"Un miembro de su clan sufre burlas, y el resto solo mira hacia otro lado por miedo a involucrarse.\"", tipo: "NIVEL 1", exigencia: "La opresión avanzaba cuando nadie clamaba. Defiendan por qué el clan debe proteger al más débil." },
  { id: 8, titulo: "LA VENGANZA DE SANSÓN", descripcion: "\"Alguien ofendió a su clan, y planean arruinar el trabajo del otro equipo en represalia.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Sansón destruyó campos por venganza. Defiendan: ¿Cuál es el camino superior a la venganza en el colegio?" },
  { id: 9, titulo: "EL LIDERAZGO TÓXICO", descripcion: "\"El líder de clan amenaza: 'O hacen lo que digo, o le digo al profesor que no trabajaron para que les ponga cero'.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Ese es el dominio del tirano. Defiendan: ¿Qué atributos de servicio debe tener un líder positivo?" },
  { id: 10, titulo: "ALIANZAS PELIGROSAS", descripcion: "\"Su clan decide no hablarle a los que no tienen sus mismos gustos, creando un grupo elitista.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Israel pactó con quienes no debía. Defiendan una postura radical sobre la inclusión." },
  { id: 11, titulo: "EL HÉROE CANSADO", descripcion: "\"El único que trabaja se cansa y dice: 'Ya no hago nada, que reprueben todos', dejando que el caos los consuma.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Aunque Gedeón se cansó, siguió luchando. Defiendan: ¿Cómo se fomenta la corresponsabilidad?" },
  { id: 12, titulo: "LA CAÍDA DEL ALTAR", descripcion: "\"Durante la oración o un momento serio de la clase, miembros de su clan sabotean el respeto del aula.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Profanar lo sagrado era el primer paso al caos. Defiendan por qué salvaguardar el respeto es vital." },
  { id: 13, titulo: "ANARQUÍA TOTAL", descripcion: "\"El profesor sale un minuto, y el salón estalla en caos. 'Cada quien hace lo que le parece'.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "Defiendan: ¿Por qué la verdadera disciplina es la que se mantiene cuando la autoridad NO está mirando?" },
  { id: 14, titulo: "EL TRIBUNAL FINAL", descripcion: "\"Un clan acusa falsamente a otro de hacer trampa solo para que les quiten puntos y ganar ellos.\"", tipo: "COMPLEJO (NIVEL 8)", exigencia: "El falso testimonio destruye la justicia. Defiendan el honor absoluto y las consecuencias de la mentira." }
];
