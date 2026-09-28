import { generarMarcas, MUESTRA_MAXIMA } from './marcas';
import type { SesionAcuarela } from './tipos';

export function cargarImagen(url: string): Promise<HTMLImageElement> {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.crossOrigin = 'anonymous';
    imagen.onload = () => resolver(imagen);
    imagen.onerror = () => rechazar(new Error(`No se pudo cargar la imagen ${url}`));
    imagen.src = url;
  });
}

export function extraerPixeles(imagen: HTMLImageElement): {
  pixeles: Uint8ClampedArray;
  ancho: number;
  alto: number;
} {
  if (imagen.naturalWidth === 0 || imagen.naturalHeight === 0) {
    throw new Error('La imagen no tiene dimensiones');
  }

  const escala = Math.min(1, MUESTRA_MAXIMA / Math.max(imagen.naturalWidth, imagen.naturalHeight));
  const ancho = Math.max(1, Math.round(imagen.naturalWidth * escala));
  const alto = Math.max(1, Math.round(imagen.naturalHeight * escala));

  const lienzo = document.createElement('canvas');
  lienzo.width = ancho;
  lienzo.height = alto;
  const contexto = lienzo.getContext('2d', { willReadFrequently: true });
  if (!contexto) {
    throw new Error('No se pudo obtener el contexto 2D');
  }

  contexto.drawImage(imagen, 0, 0, ancho, alto);
  return { pixeles: contexto.getImageData(0, 0, ancho, alto).data, ancho, alto };
}

export async function prepararSesionAcuarela(url: string): Promise<SesionAcuarela> {
  const imagen = await cargarImagen(url);
  const { pixeles, ancho, alto } = extraerPixeles(imagen);
  return { pixeles, marcas: generarMarcas(pixeles, ancho, alto) };
}
