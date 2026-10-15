// Edita este archivo para personalizar el panel. Todos los valores son ficticios.
// Fechas: AAAA-MM-DD. Importes: números sin separadores. Avances: de 0 a 100.
window.PROYECTO = {
  nombre: "Residencial Los Olivos",
  ubicacion: "Bogotá, Colombia · Edificio residencial · 8 pisos",
  responsable: "Laura Martínez",
  moneda: "COP",
  inicio: "2026-06-01",
  fin: "2027-02-28",
  actualizado: "2026-10-13",
  avancePlanificado: 65,
  avanceReal: 58,
  historial: [
    { periodo: "Jun", planificado: 8, real: 6 },
    { periodo: "Jul", planificado: 20, real: 18 },
    { periodo: "Ago", planificado: 35, real: 30 },
    { periodo: "Sep", planificado: 50, real: 44 },
    { periodo: "Oct", planificado: 65, real: 58 }
  ],
  etapas: [
    { nombre: "Preliminares", avance: 100 },
    { nombre: "Cimentación", avance: 100 },
    { nombre: "Estructura", avance: 72 },
    { nombre: "Instalaciones", avance: 38 },
    { nombre: "Acabados", avance: 12 }
  ],
  presupuesto: [
    { partida: "Preliminares", previsto: 180000000, ejecutado: 172000000 },
    { partida: "Cimentación", previsto: 420000000, ejecutado: 415000000 },
    { partida: "Estructura", previsto: 980000000, ejecutado: 710000000 },
    { partida: "Instalaciones", previsto: 460000000, ejecutado: 165000000 },
    { partida: "Acabados", previsto: 560000000, ejecutado: 68000000 }
  ],
  actividades: [
    { nombre: "Excavación y movimiento de tierras", responsable: "Equipo civil", inicio: "2026-06-01", fin: "2026-06-30", avance: 100, estado: "Completada" },
    { nombre: "Cimentación y losa de arranque", responsable: "Equipo civil", inicio: "2026-07-01", fin: "2026-08-15", avance: 100, estado: "Completada" },
    { nombre: "Estructura de pisos 4 a 8", responsable: "Equipo estructural", inicio: "2026-09-01", fin: "2026-11-15", avance: 72, estado: "En curso" },
    { nombre: "Instalación de redes hidráulicas", responsable: "Equipo hidrosanitario", inicio: "2026-09-15", fin: "2026-10-10", avance: 38, estado: "Retrasada" },
    { nombre: "Mampostería y divisiones", responsable: "Equipo de acabados", inicio: "2026-10-01", fin: "2026-12-01", avance: 12, estado: "En curso" },
    { nombre: "Entrega y revisión final", responsable: "Dirección de obra", inicio: "2027-02-01", fin: "2027-02-28", avance: 0, estado: "Pendiente" }
  ]
};
