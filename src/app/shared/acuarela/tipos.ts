export interface Pigmento {
  r: number;
  g: number;
  b: number;
}

export type MarcaCompacta = [number, number, number, number, number, number, number, number];

export interface DatosMarcas {
  anchoMuestra: number;
  altoMuestra: number;
  tamanoCelda: number;
  marcas: MarcaCompacta[];
}

export interface DisposicionImagen {
  escala: number;
  anchoDibujo: number;
  altoDibujo: number;
  desplazamientoX: number;
  desplazamientoY: number;
  tamanoCelda: number;
  anchoMuestra: number;
  altoMuestra: number;
}

export interface MarcaExpandida {
  x: number;
  y: number;
  pigmento: Pigmento;
  rotacion: number;
  tamanoCelda: number;
  ancho: number;
  alto: number;
}

export interface SesionAcuarela {
  pixeles: ArrayLike<number>;
  marcas: DatosMarcas;
}

export interface BocetoAcuarela {
  iniciar(sesion: SesionAcuarela): void;
  establecerProgreso(progreso: number): void;
  redimensionar(ancho: number, alto: number): void;
  destruir(): void;
}
