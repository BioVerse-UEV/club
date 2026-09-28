import type P5 from 'p5';
import type { MarcaExpandida, Pigmento } from './tipos';

export interface HerramientasAcuarela {
  depositarPincelada(
    g: P5.Graphics,
    x: number,
    y: number,
    radio: number,
    pigmento: Pigmento,
    alfa: number,
  ): void;
  depositarMancha(
    g: P5.Graphics,
    marca: MarcaExpandida,
    riqueza: number,
    opacidadSesion: number,
  ): void;
}

export function crearHerramientasAcuarela(p: P5): HerramientasAcuarela {
  function depositarPincelada(
    g: P5.Graphics,
    x: number,
    y: number,
    radio: number,
    pigmento: Pigmento,
    alfa: number,
  ): void {
    const capas = p.floor(p.random(3, 6));
    for (let capa = 0; capa < capas; capa += 1) {
      const t = capa / capas;
      const r = radio * (1 - t * 0.68) * p.random(0.85, 1.18);
      const a = alfa * (1 - t * 0.48) * p.random(0.72, 1.2);

      g.fill(pigmento.r, pigmento.g, pigmento.b, a);
      g.beginShape();
      const vertices = p.floor(p.random(7, 12));
      for (let v = 0; v < vertices; v += 1) {
        const ang = (p.TWO_PI / vertices) * v + p.random(-0.35, 0.35);
        const n = p.noise(
          x * 0.011 + p.cos(ang) * 0.35,
          y * 0.011 + p.sin(ang) * 0.35,
          capa + v * 0.06,
        );
        const ondulacion = 0.28 + n * 0.9;
        const rx = r * ondulacion * p.random(0.85, 1.22);
        const ry = r * ondulacion * p.random(0.7, 1.32);
        g.vertex(x + p.cos(ang) * rx, y + p.sin(ang) * ry);
      }
      g.endShape(p.CLOSE);
    }
  }

  function depositarMancha(
    g: P5.Graphics,
    marca: MarcaExpandida,
    riqueza: number,
    opacidadSesion: number,
  ): void {
    const { x, y, ancho, alto, rotacion, pigmento } = marca;
    const variacion = p.random(0.55, 1.05);
    const fuerza = p.constrain(riqueza * opacidadSesion * variacion, 0.38, 0.82);
    const extension = Math.max(ancho, alto);

    g.push();
    g.translate(x, y);
    g.rotate(rotacion + p.random(-0.2, 0.2));

    depositarPincelada(g, 0, 0, extension * 0.52, pigmento, p.random(14, 24) * fuerza);
    depositarPincelada(
      g,
      p.random(-4, 4),
      p.random(-4, 4),
      extension * p.random(0.32, 0.44),
      pigmento,
      p.random(18, 30) * fuerza * p.random(0.8, 1.15),
    );
    depositarPincelada(
      g,
      p.random(-3, 3),
      p.random(-3, 3),
      extension * p.random(0.22, 0.34),
      pigmento,
      p.random(14, 24) * fuerza * p.random(0.75, 1.2),
    );

    g.scale(ancho / extension, alto / extension);
    depositarPincelada(
      g,
      0,
      0,
      extension * p.random(0.3, 0.42),
      pigmento,
      p.random(16, 26) * fuerza * p.random(0.85, 1.1),
    );
    depositarPincelada(
      g,
      p.random(-4, 4),
      p.random(-4, 4),
      extension * p.random(0.18, 0.32),
      pigmento,
      p.random(10, 20) * fuerza * p.random(0.7, 1.15),
    );

    g.pop();
  }

  return { depositarPincelada, depositarMancha };
}
