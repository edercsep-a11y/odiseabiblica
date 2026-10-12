import React from 'react';
import { Shield, ShieldAlert, Swords, Heart, Zap, Crosshair, Scale, Eye, Scroll, Target, Flame } from 'lucide-react';

export const clansData = [
  { id: 'c1', name: 'Leones de Judá', attribute: 'Autoridad y Liderazgo', color: 'text-amber-500', border: 'border-amber-500/50', bg: 'bg-amber-950/30', hero: 'David y Judá', symbol: 'El Cetro Real y el León', lema: '"De nosotros viene el cetro."', icon: <Shield className="w-8 h-8 text-amber-500"/> },
  { id: 'c2', name: 'Águilas de Isaías', attribute: 'Visión y Profecía', color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-950/30', hero: 'Isaías y el Remanente', symbol: 'El Carbón y las Alas', lema: '"Vemos lo que está por venir."', icon: <Eye className="w-8 h-8 text-blue-400"/> },
  { id: 'c3', name: 'Guerreros de Josué', attribute: 'Valor y Conquista', color: 'text-red-500', border: 'border-red-500/50', bg: 'bg-red-950/30', hero: 'Josué y Caleb', symbol: 'Trompetas y Espada', lema: '"Ni un paso atrás."', icon: <Swords className="w-8 h-8 text-red-500"/> },
  { id: 'c4', name: 'Sabios de Salomón', attribute: 'Sabiduría y Discernimiento', color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/30', hero: 'Salomón', symbol: 'El Manuscrito', lema: '"La mente sobre la espada."', icon: <Scroll className="w-8 h-8 text-purple-400"/> },
  { id: 'c5', name: 'Centinelas de Nehemías', attribute: 'Restauración y Vigilancia', color: 'text-orange-500', border: 'border-orange-500/50', bg: 'bg-orange-950/30', hero: 'Nehemías', symbol: 'La Lanza y la Cuchara', lema: '"Reconstruimos las ruinas."', icon: <ShieldAlert className="w-8 h-8 text-orange-500"/> },
  { id: 'c6', name: 'Valientes de David', attribute: 'Lealtad y Sacrificio', color: 'text-green-500', border: 'border-green-500/50', bg: 'bg-green-950/30', hero: 'Los Tres Valientes', symbol: 'Honda y Vasija', lema: '"Hasta la última gota."', icon: <Target className="w-8 h-8 text-green-500"/> },
  { id: 'c7', name: 'Llamas de Elías', attribute: 'Celo y Fuego Divino', color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/30', hero: 'Elías el Tesbita', symbol: 'El Altar en Fuego', lema: '"Que el fuego responda."', icon: <Flame className="w-8 h-8 text-cyan-400"/> }
];

export const unassignedStudentsDB = {
  '1A': [
    "ABAD VERGARA, Mateo Thiago",
    "ALFARO CASANI, Ian Salvador",
    "BENDEZÚ ALARCÓN, Katherine Antonella",
    "CASELLA TOYOSATO, Valentina",
    "DIAZ FERNANDEZ, Marcelo Francisco",
    "DIAZ GONZALES, Brissa",
    "FUTURE GONZALES, Ana Victoria",
    "GUEVARA JIMENEZ, Zoe Valentina",
    "IGNACIO TORREJÓN, Camila Irene",
    "JARA ROCA, Santiago Amadeus",
    "MARTELL RUIZ, Mia Christiane",
    "MATZUNAGA ARIAS, Belen Macarena",
    "MEJIA REYNOSO, Fabian Alessandro",
    "MELGAREJO VALDERRAMA, Mathias Mart...",
    "MERCADO CÁRDENAS, Diego Alejandro",
    "NAVARRO NUNURA, Emilio",
    "NUÑEZ BERNAOLA, Alessandra Cielo",
    "PALMA PEÑA, Rafaela",
    "POMA FIESTAS, Domenica Sofia",
    "RAMIREZ HUARCAYA, Andrea Celeste",
    "ROBERTO COBIÁN, Rafael Enrique",
    "RODRIGO SOTO, Andrea Nicolle",
    "ROMAN CONDEZO, Astrit",
    "SALINAS MÁLAGA, Alejandro",
    "VARGAS VELASCO, Alexia Lorena",
    "VIDAL AMEGHINO, Lizette Valentina",
    "XIE URBINA, Xiao En Matias"
  ],
  '1B': [
    "ALCOSER CANALES, Miranda Catalina",
    "ALOR ALCAZAR, Kevin",
    "ASMAT IZQUIERDO, Valentina",
    "BENAVIDES RIVAS, Rafaella Patricia",
    "BOULANGGER MERCADO, Maria Alejandra",
    "CHAPARRO RUIZ, Mauricio Gustavo",
    "CÓRDOVA FIGUEROA, Macarena",
    "DIAZ BAÑEZ, Hannah Rafaela Hilda",
    "ESPINOZA CHAVEZ, FACUNDO GAEL",
    "GOMEZ QUIJAYTE, Luis Adrian",
    "LEVANO MEDINA, Rodrigo Gonzalo",
    "MESCCO HINOSTROZA, Briana Valery",
    "NAVARRO DOMINGUEZ, Adriana Valeria",
    "NERVI CALERO, Joaquín Andre",
    "PEÑA CUENCA, Angelica Fernanda",
    "QUINTANILLA TEJADA, Luisiana",
    "RAMOS ARAOZ, Marcelo Gael",
    "RODRIGUEZ TREJO, Macarena del Rocío",
    "SANCHEZ GONZÁLES, Matías Andres",
    "SILVA OROPEZA, Mariana",
    "TATAJE UTOR, Rafaela",
    "VÁSQUEZ BURGA, Astrid Valentina",
    "VILLEGAS ARENAS, Fátima Narumi"
  ],
  '1C': [
    "AGUAYO TEJADA, Lucia",
    "ALVA CAMINO, Micaela Luciana",
    "ALZA CHAVEZ, Alejandra Michelle",
    "BRAVO LÓPEZ, Antonella",
    "CABREJOS ROBLES, Joaquin Raúl",
    "CASIANO GUERRERO, Alejandra Zoanette",
    "DIAZ MAYORGA, Flavia",
    "FILINICH FIGUERAS, Paz",
    "GONZÁLES CABANILLAS, Gaela Lucía",
    "HERNANDEZ LOPEZ, Leandra",
    "IGLESIAS MACEDO, Gustavo Alonso",
    "LARRIEGA ROJAS, Alejandra Paz",
    "LOAIZA SEGOVIA, Gonzalo Sebastian",
    "MEDINA CONDORI, Anette Fernanda",
    "MONTES URETA, Camila Alexandra",
    "MORALES ESPINOZA, Tiago Marcelo",
    "ORTEGA CIENFUEGOS, Brianna Valentina",
    "PRETTO DÁVILA, Rafael Santino",
    "ROMAN ORTIZ, Thiago Gabriel",
    "SALAS GUEVARA, Julián Ignacio",
    "VALDIVIA ROJAS, Ian Armando",
    "VEGA SÁNCHEZ, Stacy Mariana",
    "VIAÑA URTEAGA, Jorge Guillermo Agustín",
    "YUCRA HUAITAYA, Zoe Killari"
  ]
};

export const defaultRoster = {
  '1A': { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] },
  '1B': { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] },
  '1C': { c1: [], c2: [], c3: [], c4: [], c5: [], c6: [], c7: [] }
};

export const defaultScores = {
  '1A': { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 },
  '1B': { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 },
  '1C': { c1: 0, c2: 0, c3: 0, c4: 0, c5: 0, c6: 0, c7: 0 }
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
