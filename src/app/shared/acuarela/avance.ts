export const PASOS_AGENTES_TOTALES = 1800;
export const RAFAGA_FINAL = 140;
export const PROGRESO_PAPEL = 0.05;

export interface Avance {
  marcasObjetivo: number;
  pasosObjetivo: number;
  opacidadPapel: number;
  opacidadSesion: number;
  opacidadAgentes: number;
}

export function limitarProgreso(valor: number): number {
  if (Number.isNaN(valor)) {
    return 0;
  }
  return Math.min(1, Math.max(0, valor));
}

function interpolar(minimo: number, maximo: number, t: number): number {
  return minimo + (maximo - minimo) * t;
}

export function calcularAvance(progreso: number, totalMarcas: number): Avance {
  const limitado = limitarProgreso(progreso);
  const opacidadSesion = interpolar(0.52, 0.94, Math.pow(limitado, 0.38));

  return {
    marcasObjetivo: Math.floor(limitado * totalMarcas),
    pasosObjetivo: Math.floor(limitado * PASOS_AGENTES_TOTALES),
    opacidadPapel: Math.pow(Math.min(1, limitado / PROGRESO_PAPEL), 0.72),
    opacidadSesion,
    opacidadAgentes: opacidadSesion * interpolar(0.55, 1, Math.pow(limitado, 0.5)),
  };
}
