import type {
  DatosMarcas,
  DisposicionImagen,
  MarcaCompacta,
  MarcaExpandida,
  Pigmento,
} from './tipos';

export const TAMANO_CELDA = 7;
export const MUESTRA_MAXIMA = 900;

interface MarcaBruta {
  nx: number;
  ny: number;
  r: number;
  g: number;
  b: number;
  rot: number;
  mw: number;
  mh: number;
  claveOrden: number;
}

export function rgbAHsb(r: number, g: number, b: number): { h: number; s: number; v: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) {
      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / d + 2) / 6;
    } else {
      h = ((rn - gn) / d + 4) / 6;
    }
  }

  return { h, s: max === 0 ? 0 : d / max, v: max };
}

function hashMarca(nx1k: number, ny1k: number, sal: number): number {
  const s = Math.sin(nx1k * 127.1 + ny1k * 311.7 + sal * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function distanciaAlCentro(nx: number, ny: number): number {
  const dx = nx - 0.5;
  const dy = ny - 0.5;
  return Math.sqrt(dx * dx + dy * dy);
}

function oscilacionCentro(nx: number, ny: number): number {
  return (hashMarca(Math.round(nx * 1000), Math.round(ny * 1000), 99) - 0.5) * 0.06;
}

function interpolarHash(hash: number, minimo: number, maximo: number): number {
  return minimo + hash * (maximo - minimo);
}

function muestrearColorCelda(
  pixeles: ArrayLike<number>,
  ancho: number,
  alto: number,
  celdaX: number,
  celdaY: number,
): Pigmento | null {
  let sumaR = 0;
  let sumaG = 0;
  let sumaB = 0;
  let sumaA = 0;
  let cuenta = 0;

  for (let dy = 0; dy < TAMANO_CELDA; dy += 1) {
    for (let dx = 0; dx < TAMANO_CELDA; dx += 1) {
      const px = Math.min(ancho - 1, celdaX + dx);
      const py = Math.min(alto - 1, celdaY + dy);
      const i = (py * ancho + px) * 4;
      const a = pixeles[i + 3];
      if (a < 40) {
        continue;
      }
      sumaR += pixeles[i];
      sumaG += pixeles[i + 1];
      sumaB += pixeles[i + 2];
      sumaA += a;
      cuenta += 1;
    }
  }

  if (cuenta === 0 || sumaA / cuenta < 40) {
    return null;
  }

  return {
    r: Math.round(sumaR / cuenta),
    g: Math.round(sumaG / cuenta),
    b: Math.round(sumaB / cuenta),
  };
}

export function generarMarcas(
  pixeles: ArrayLike<number>,
  ancho: number,
  alto: number,
): DatosMarcas {
  const brutas: MarcaBruta[] = [];

  for (let y = 0; y < alto; y += TAMANO_CELDA) {
    for (let x = 0; x < ancho; x += TAMANO_CELDA) {
      const color = muestrearColorCelda(pixeles, ancho, alto, x, y);
      if (!color) {
        continue;
      }

      const nx = (x + TAMANO_CELDA / 2) / ancho;
      const ny = (y + TAMANO_CELDA / 2) / alto;
      const hsb = rgbAHsb(color.r, color.g, color.b);
      const escalaSaturacion = Math.max(hsb.s, 0.12);

      brutas.push({
        nx,
        ny,
        r: color.r,
        g: color.g,
        b: color.b,
        rot: hsb.h,
        mw: Math.min(1.4, hsb.v * 2),
        mh: Math.min(1.6, (1 / escalaSaturacion) * 0.55),
        claveOrden: distanciaAlCentro(nx, ny) + oscilacionCentro(nx, ny),
      });
    }
  }

  brutas.sort((a, b) => a.claveOrden - b.claveOrden);

  const marcas = brutas.map((marca): MarcaCompacta => [
    Math.round(marca.nx * 1000),
    Math.round(marca.ny * 1000),
    marca.r,
    marca.g,
    marca.b,
    Math.round(marca.rot * 255),
    Math.round(marca.mw * 100),
    Math.round(marca.mh * 100),
  ]);

  return { anchoMuestra: ancho, altoMuestra: alto, tamanoCelda: TAMANO_CELDA, marcas };
}

export function calcularDisposicion(
  anchoMuestra: number,
  altoMuestra: number,
  anchoPantalla: number,
  altoPantalla: number,
): DisposicionImagen {
  const escala = Math.min(anchoPantalla / anchoMuestra, altoPantalla / altoMuestra);
  const anchoDibujo = anchoMuestra * escala;
  const altoDibujo = altoMuestra * escala;

  return {
    escala,
    anchoDibujo,
    altoDibujo,
    desplazamientoX: (anchoPantalla - anchoDibujo) / 2,
    desplazamientoY: (altoPantalla - altoDibujo) / 2,
    tamanoCelda: TAMANO_CELDA,
    anchoMuestra,
    altoMuestra,
  };
}

export function expandirMarca(
  compacta: MarcaCompacta,
  disposicion: DisposicionImagen,
): MarcaExpandida {
  const [nx1k, ny1k, r, g, b, rot255, mw100, mh100] = compacta;
  const tamanoCelda = disposicion.tamanoCelda * disposicion.escala;
  const escalaForma = Math.max(mw100 / 100, mh100 / 100, 0.85);

  const h1 = hashMarca(nx1k, ny1k, 1);
  const h2 = hashMarca(nx1k, ny1k, 2);
  const h6 = hashMarca(nx1k, ny1k, 6);

  const baseX = disposicion.desplazamientoX + (nx1k / 1000) * disposicion.anchoDibujo;
  const baseY = disposicion.desplazamientoY + (ny1k / 1000) * disposicion.altoDibujo;
  const tamano = tamanoCelda * Math.max(2.0, escalaForma * 2.75);

  return {
    x: baseX + (h1 - 0.5) * tamanoCelda * 0.16,
    y: baseY + (h2 - 0.5) * tamanoCelda * 0.16,
    pigmento: { r, g, b },
    rotacion: (rot255 / 255) * Math.PI * 2 + (h6 - 0.5) * 0.5,
    tamanoCelda,
    ancho: tamano,
    alto: tamano * interpolarHash(h1, 0.82, 1.18),
  };
}
