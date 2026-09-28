import type P5 from 'p5';
import type { HerramientasAcuarela } from './acuarela';
import type { DatosMarcas, DisposicionImagen, Pigmento } from './tipos';

export interface OpcionesAgentes {
  cantidadPlumas: number;
  rangoAgente: number;
  radioPincel: number;
  alfaPincel: number;
}

export interface AgentesColor {
  iniciarDesdePixeles(
    pixeles: ArrayLike<number>,
    datos: DatosMarcas,
    disposicion: DisposicionImagen,
    opciones: OpcionesAgentes,
  ): void;
  paso(lavado: P5.Graphics, pasosPluma: number, escalaAlfa: number): void;
  rafaga(lavado: P5.Graphics, ciclos: number, escalaAlfa: number): void;
  reiniciar(): void;
  estaListo(): boolean;
}

interface Punto {
  x: number;
  y: number;
}

interface Pluma {
  origenX: number;
  origenY: number;
  previoX: number;
  previoY: number;
  destinoX: number;
  destinoY: number;
  atasco: number;
  pigmento: Pigmento;
  buscarDestino(): void;
  dibujar(lavado: P5.Graphics, escalaAlfa: number): void;
}

export function crearAgentesColor(p: P5, herramientas: HerramientasAcuarela): AgentesColor {
  let anchoMuestra = 0;
  let altoMuestra = 0;
  let pixeles: ArrayLike<number> = [];
  let matriz = new Uint8Array(0);
  let mascara = new Uint8Array(0);
  let disposicion: DisposicionImagen | null = null;
  let plumas: Pluma[] = [];
  let rangoAgente = 12;

  function indice(x: number, y: number): number {
    return y * anchoMuestra + x;
  }

  function obtenerColor(x: number, y: number): number[] {
    const desplazamiento = indice(x, y) * 4;
    return [
      pixeles[desplazamiento],
      pixeles[desplazamiento + 1],
      pixeles[desplazamiento + 2],
      pixeles[desplazamiento + 3],
    ];
  }

  function muestraAPantalla(sx: number, sy: number): Punto {
    const d = disposicion as DisposicionImagen;
    return {
      x: d.desplazamientoX + (sx / anchoMuestra) * d.anchoDibujo,
      y: d.desplazamientoY + (sy / altoMuestra) * d.altoDibujo,
    };
  }

  function distanciaColor(pigmento: Pigmento, rgb: number[]): number {
    return (pigmento.r - rgb[0]) ** 2 + (pigmento.g - rgb[1]) ** 2 + (pigmento.b - rgb[2]) ** 2;
  }

  function construirMascara(datos: DatosMarcas): void {
    mascara = new Uint8Array(anchoMuestra * altoMuestra);
    const celda = datos.tamanoCelda;

    for (const compacta of datos.marcas) {
      const cx = Math.floor((compacta[0] / 1000) * anchoMuestra);
      const cy = Math.floor((compacta[1] / 1000) * altoMuestra);

      for (let dy = 0; dy < celda; dy += 1) {
        for (let dx = 0; dx < celda; dx += 1) {
          const x = Math.min(anchoMuestra - 1, cx + dx);
          const y = Math.min(altoMuestra - 1, cy + dy);
          mascara[indice(x, y)] = 1;
        }
      }
    }
  }

  function pixelAleatorioEnMascara(intentosMaximos = 80): Punto {
    for (let intento = 0; intento < intentosMaximos; intento += 1) {
      const x = p.floor(p.random(anchoMuestra * 0.2, anchoMuestra * 0.8));
      const y = p.floor(p.random(altoMuestra * 0.2, altoMuestra * 0.8));
      if (mascara[indice(x, y)] && matriz[indice(x, y)] === 0) {
        return { x, y };
      }
    }

    for (let y = 0; y < altoMuestra; y += 1) {
      for (let x = 0; x < anchoMuestra; x += 1) {
        if (mascara[indice(x, y)] && matriz[indice(x, y)] === 0) {
          return { x, y };
        }
      }
    }

    return { x: p.floor(anchoMuestra * 0.5), y: p.floor(altoMuestra * 0.5) };
  }

  function crearPluma(inicioX: number, inicioY: number, opciones: OpcionesAgentes): Pluma {
    const colorInicial = obtenerColor(inicioX, inicioY);

    const pluma: Pluma = {
      origenX: inicioX,
      origenY: inicioY,
      previoX: inicioX,
      previoY: inicioY,
      destinoX: inicioX,
      destinoY: inicioY,
      atasco: 0,
      pigmento: { r: colorInicial[0], g: colorInicial[1], b: colorInicial[2] },

      buscarDestino() {
        let distanciaMinima = Number.MAX_SAFE_INTEGER;
        const candidatos: Punto[] = [];
        pluma.destinoX = pluma.origenX;
        pluma.destinoY = pluma.origenY;

        const yMin = Math.max(pluma.origenY - rangoAgente, 0);
        const yMax = Math.min(pluma.origenY + rangoAgente, altoMuestra - 1);
        const xMin = Math.max(pluma.origenX - rangoAgente, 0);
        const xMax = Math.min(pluma.origenX + rangoAgente, anchoMuestra - 1);

        for (let y = yMin; y <= yMax; y += 1) {
          for (let x = xMin; x <= xMax; x += 1) {
            const id = indice(x, y);
            if (matriz[id] !== 0 || mascara[id] === 0) {
              continue;
            }

            const distancia = distanciaColor(pluma.pigmento, obtenerColor(x, y));
            if (distancia === 0) {
              continue;
            }

            if (distancia < distanciaMinima) {
              candidatos.length = 0;
              candidatos.push({ x, y });
              distanciaMinima = distancia;
            } else if (distancia === distanciaMinima) {
              candidatos.push({ x, y });
            }
          }
        }

        if (candidatos.length === 0) {
          pluma.atasco += 1;
          if (pluma.atasco > 6) {
            const reaparicion = pixelAleatorioEnMascara();
            pluma.origenX = reaparicion.x;
            pluma.origenY = reaparicion.y;
            pluma.previoX = reaparicion.x;
            pluma.previoY = reaparicion.y;
            pluma.destinoX = reaparicion.x;
            pluma.destinoY = reaparicion.y;
            const siguienteColor = obtenerColor(reaparicion.x, reaparicion.y);
            pluma.pigmento = { r: siguienteColor[0], g: siguienteColor[1], b: siguienteColor[2] };
            matriz[indice(reaparicion.x, reaparicion.y)] = 1;
            pluma.atasco = 0;
          }
          return;
        }

        pluma.atasco = 0;
        const eleccion: Punto = p.random(candidatos);
        pluma.destinoX = eleccion.x;
        pluma.destinoY = eleccion.y;
        matriz[indice(eleccion.x, eleccion.y)] = 1;
      },

      dibujar(lavado, escalaAlfa) {
        if (pluma.origenX === pluma.destinoX && pluma.origenY === pluma.destinoY) {
          return;
        }

        const control2X = pluma.destinoX - (pluma.origenX - pluma.previoX);
        const control2Y = pluma.destinoY - (pluma.origenY - pluma.previoY);

        const previo = muestraAPantalla(pluma.previoX, pluma.previoY);
        const origen = muestraAPantalla(pluma.origenX, pluma.origenY);
        const destino = muestraAPantalla(pluma.destinoX, pluma.destinoY);
        const control2 = muestraAPantalla(control2X, control2Y);

        const cantidadPuntos = 4;
        for (let i = 0; i <= cantidadPuntos; i += 1) {
          const t = i / cantidadPuntos;
          const x = p.curvePoint(previo.x, origen.x, destino.x, control2.x, t);
          const y = p.curvePoint(previo.y, origen.y, destino.y, control2.y, t);
          herramientas.depositarPincelada(
            lavado,
            x,
            y,
            opciones.radioPincel * p.random(0.75, 1.25),
            pluma.pigmento,
            opciones.alfaPincel * escalaAlfa * p.random(0.8, 1.15),
          );
        }

        pluma.previoX = pluma.origenX;
        pluma.previoY = pluma.origenY;
        pluma.origenX = pluma.destinoX;
        pluma.origenY = pluma.destinoY;
      },
    };

    return pluma;
  }

  function iniciarDesdePixeles(
    pixelesEntrada: ArrayLike<number>,
    datos: DatosMarcas,
    disposicionEntrada: DisposicionImagen,
    opciones: OpcionesAgentes,
  ): void {
    anchoMuestra = datos.anchoMuestra;
    altoMuestra = datos.altoMuestra;
    disposicion = disposicionEntrada;
    rangoAgente = opciones.rangoAgente;
    pixeles = pixelesEntrada;
    matriz = new Uint8Array(anchoMuestra * altoMuestra);
    construirMascara(datos);

    plumas = [];
    for (let i = 0; i < opciones.cantidadPlumas; i += 1) {
      const aparicion = pixelAleatorioEnMascara();
      matriz[indice(aparicion.x, aparicion.y)] = 1;
      plumas.push(crearPluma(aparicion.x, aparicion.y, opciones));
    }
  }

  function paso(lavado: P5.Graphics, pasosPluma: number, escalaAlfa: number): void {
    if (plumas.length === 0) {
      return;
    }

    for (let s = 0; s < pasosPluma; s += 1) {
      for (const pluma of plumas) {
        pluma.buscarDestino();
        pluma.dibujar(lavado, escalaAlfa);
      }
    }
  }

  function rafaga(lavado: P5.Graphics, ciclos: number, escalaAlfa: number): void {
    for (let i = 0; i < ciclos; i += 1) {
      paso(lavado, 1, escalaAlfa);
    }
  }

  function reiniciar(): void {
    matriz = new Uint8Array(0);
    mascara = new Uint8Array(0);
    pixeles = [];
    plumas = [];
    disposicion = null;
  }

  function estaListo(): boolean {
    return plumas.length > 0 && pixeles.length > 0;
  }

  return { iniciarDesdePixeles, paso, rafaga, reiniciar, estaListo };
}
