import P5 from 'p5';
import { crearHerramientasAcuarela } from './acuarela';
import { crearAgentesColor } from './agentes-color';
import { calcularAvance, limitarProgreso, RAFAGA_FINAL } from './avance';
import { calcularDisposicion, expandirMarca } from './marcas';
import type { BocetoAcuarela, DisposicionImagen, MarcaExpandida, SesionAcuarela } from './tipos';

const RIQUEZA = 0.98;
const UMBRAL = 0.000001;
const SUAVIZADO_MS = 350;
const MAX_PASOS_POR_FRAME = 4;
const PLUMAS_BASE = 34;
const RANGO_AGENTE = 14;
const RADIO_PINCEL = 4.2;
const ALFA_PINCEL = 8.5;

export function crearBocetoAcuarela(contenedor: HTMLElement): BocetoAcuarela {
  const instancia = new P5((p: P5) => {
    const herramientas = crearHerramientasAcuarela(p);
    const agentes = crearAgentesColor(p, herramientas);

    let sesion: SesionAcuarela | null = null;
    let lavado: P5.Graphics | null = null;
    let marcasSesion: MarcaExpandida[] = [];
    let listo = false;
    let completado = false;
    let pintadas = 0;
    let pasosAgentes = 0;
    let progresoObjetivo = 0;
    let progresoVisual = 0;

    function crearLavado(): void {
      lavado?.remove();
      lavado = p.createGraphics(p.width, p.height);
      lavado.noStroke();
      lavado.clear();
    }

    function ordenarCentroAfuera(
      marcas: MarcaExpandida[],
      disposicion: DisposicionImagen,
    ): MarcaExpandida[] {
      const cx = disposicion.desplazamientoX + disposicion.anchoDibujo * 0.5;
      const cy = disposicion.desplazamientoY + disposicion.altoDibujo * 0.5;
      return marcas
        .map((marca) => ({ marca, clave: p.dist(marca.x, marca.y, cx, cy) + p.random(-10, 10) }))
        .sort((a, b) => a.clave - b.clave)
        .map((elemento) => elemento.marca);
    }

    function prepararLienzo(): void {
      if (!sesion || !listo) {
        return;
      }

      progresoVisual = 0;
      pintadas = 0;
      pasosAgentes = 0;
      completado = false;
      crearLavado();

      const disposicion = calcularDisposicion(
        sesion.marcas.anchoMuestra,
        sesion.marcas.altoMuestra,
        p.width,
        p.height,
      );
      const expandidas = sesion.marcas.marcas.map((compacta) =>
        expandirMarca(compacta, disposicion),
      );
      marcasSesion = ordenarCentroAfuera(expandidas, disposicion);

      agentes.reiniciar();
      const escala = Math.max(1, Math.sqrt((p.width * p.height) / (900 * 700)));
      agentes.iniciarDesdePixeles(sesion.pixeles, sesion.marcas, disposicion, {
        cantidadPlumas: Math.floor(PLUMAS_BASE * Math.min(escala, 1.35)),
        rangoAgente: RANGO_AGENTE,
        radioPincel: RADIO_PINCEL,
        alfaPincel: ALFA_PINCEL,
      });
    }

    function pintarMarca(marca: MarcaExpandida, opacidadSesion: number): void {
      if (lavado) {
        herramientas.depositarMancha(lavado, marca, RIQUEZA, opacidadSesion);
      }
    }

    function avanzarVisual(): void {
      const diferencia = progresoObjetivo - progresoVisual;
      if (Math.abs(diferencia) < UMBRAL) {
        progresoVisual = progresoObjetivo;
        return;
      }
      const factor = 1 - Math.exp(-p.deltaTime / SUAVIZADO_MS);
      progresoVisual += diferencia * factor;
    }

    function pintarAvance(): void {
      const avance = calcularAvance(progresoVisual, marcasSesion.length);
      const pendientes = avance.marcasObjetivo - pintadas;

      if (pendientes > 0) {
        const peso = agentes.estaListo() ? 0.42 : 1;
        const lote = Math.max(
          6,
          Math.floor(Math.min(pendientes, Math.ceil(pendientes * 0.45) + 8) * peso),
        );
        for (let i = 0; i < lote && pintadas < avance.marcasObjetivo; i += 1) {
          pintarMarca(marcasSesion[pintadas], avance.opacidadSesion);
          pintadas += 1;
        }
      }

      if (lavado && agentes.estaListo()) {
        const pasos = Math.min(avance.pasosObjetivo - pasosAgentes, MAX_PASOS_POR_FRAME);
        if (pasos > 0) {
          agentes.paso(lavado, pasos, avance.opacidadAgentes);
          pasosAgentes += pasos;
        }
      }
    }

    function estaAlDia(): boolean {
      const avance = calcularAvance(progresoVisual, marcasSesion.length);
      return (
        Math.abs(progresoObjetivo - progresoVisual) < UMBRAL &&
        pintadas >= avance.marcasObjetivo &&
        (!agentes.estaListo() || pasosAgentes >= avance.pasosObjetivo)
      );
    }

    function finalizar(): void {
      if (completado || !lavado) {
        return;
      }
      completado = true;

      const opacidad = p.random(0.88, 0.98);
      while (pintadas < marcasSesion.length) {
        pintarMarca(marcasSesion[pintadas], opacidad);
        pintadas += 1;
      }

      if (agentes.estaListo()) {
        agentes.rafaga(lavado, RAFAGA_FINAL, 0.95);
      }
      progresoVisual = 1;
    }

    function componer(): void {
      const avance = calcularAvance(progresoVisual, marcasSesion.length);
      p.clear();

      if (avance.opacidadPapel > 0) {
        p.noStroke();
        p.fill(255, 255, 255, avance.opacidadPapel * 255);
        p.rect(0, 0, p.width, p.height);
      }

      if (lavado) {
        p.image(lavado, 0, 0);
      }
    }

    p.setup = () => {
      const ancho = Math.max(1, contenedor.clientWidth);
      const alto = Math.max(1, contenedor.clientHeight);
      const lienzo = p.createCanvas(ancho, alto);
      (lienzo as unknown as { elt: HTMLElement }).elt.style.display = 'block';
      p.pixelDensity(1);
      p.noStroke();
      p.noLoop();
      listo = true;
      prepararLienzo();
    };

    p.draw = () => {
      if (!sesion || !lavado) {
        p.clear();
        p.noLoop();
        return;
      }

      avanzarVisual();

      if (progresoObjetivo >= 1 && progresoVisual >= 1) {
        finalizar();
        componer();
        p.noLoop();
        return;
      }

      pintarAvance();
      componer();

      if (estaAlDia()) {
        p.noLoop();
      }
    };

    (p as unknown as { api: BocetoAcuarela }).api = {
      iniciar(nuevaSesion) {
        sesion = nuevaSesion;
        if (listo) {
          prepararLienzo();
          p.loop();
        }
      },

      establecerProgreso(valor) {
        const limitado = limitarProgreso(valor);
        const retrocede = limitado < progresoObjetivo;
        progresoObjetivo = limitado;
        if (retrocede) {
          prepararLienzo();
        }
        if (sesion && listo) {
          p.loop();
        }
      },

      redimensionar(ancho, alto) {
        if (!listo || ancho < 1 || alto < 1 || (ancho === p.width && alto === p.height)) {
          return;
        }
        p.resizeCanvas(ancho, alto);
        prepararLienzo();
        p.loop();
      },

      destruir() {
        p.remove();
      },
    };
  }, contenedor);

  return (instancia as unknown as { api: BocetoAcuarela }).api;
}
