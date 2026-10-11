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
  { id: 'rubi', name: 'Rubí (Sardio)', tribe: 'Rubén', clan: 'León de Judá', color: 'bg-red-600', meaning: 'Sacrificio y pasión por proteger al débil.' },
  { id: 'topacio', name: 'Topacio', tribe: 'Simeón', clan: 'Águilas de Dan', color: 'bg-amber-400', meaning: 'Claridad mental en momentos de caos.' },
  { id: 'esmeralda', name: 'Esmeralda', tribe: 'Leví', clan: 'Osos de Isacar', color: 'bg-emerald-500', meaning: 'Vida, sanidad y servicio a los demás.' },
  { id: 'zafiro', name: 'Zafiro', tribe: 'Judá', clan: 'Lobos de Benjamín', color: 'bg-blue-600', meaning: 'Lealtad inquebrantable y justicia divina.' },
  { id: 'diamante', name: 'Diamante', tribe: 'Zabulón', clan: 'Toros de Efraín', color: 'bg-slate-200', meaning: 'Fuerza indestructible ante la presión.' },
  { id: 'amatista', name: 'Amatista', tribe: 'Isacar', clan: 'Ciervos de Neftalí', color: 'bg-purple-500', meaning: 'Paz interior y control de los impulsos.' },
  { id: 'agata', name: 'Ágata', tribe: 'Dan', clan: 'Carpas de Zabulón', color: 'bg-orange-500', meaning: 'Equilibrio y discernimiento espiritual.' }
];

export const casosTribunal = [
  {
    id: 1,
    titulo: "EL DILEMA DE GEDEÓN",
    descripcion: "Un estudiante muy talentoso decide hacer todo el trabajo del grupo solo, ignorando a los demás porque 'son muy lentos'.",
    juez_asociado: "Gedeón (Jueces 7) - Aprendió que no se trata de fuerza numérica, sino de la estrategia de Dios.",
    pregunta: "¿Debe el talentoso hacer el trabajo solo para asegurar la buena nota del grupo, o arriesgarse a una nota menor enseñando a los demás?"
  },
  {
    id: 2,
    titulo: "EL ERROR DE SANSÓN",
    descripcion: "El líder del clan es muy carismático pero usa su influencia para burlarse de un alumno de otro salón. Su clan le aplaude.",
    juez_asociado: "Sansón (Jueces 16) - Gran fuerza, pero su falta de dominio propio destruyó su propósito.",
    pregunta: "¿Debe el clan apoyar a su líder por lealtad, o confrontarlo aunque eso les reste popularidad?"
  },
  {
    id: 3,
    titulo: "EL VALOR DE DÉBORA",
    descripcion: "Nadie en el salón se atreve a defender a un estudiante nuevo que está siendo excluido, por miedo a las burlas de los más 'populares'.",
    juez_asociado: "Débora (Jueces 4) - Se levantó como madre en Israel cuando los hombres tenían miedo de liderar.",
    pregunta: "¿Qué estudiante debe dar el primer paso? ¿El más fuerte, el delegado, o cualquiera? ¿Qué dice la historia de Débora?"
  }
];
