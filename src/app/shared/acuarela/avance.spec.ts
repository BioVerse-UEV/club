import { calcularAvance, limitarProgreso, PASOS_AGENTES_TOTALES, PROGRESO_PAPEL } from './avance';

describe('limitarProgreso', () => {
  it('deja pasar valores válidos', () => {
    expect(limitarProgreso(0.4)).toBe(0.4);
  });

  it('recorta valores fuera de rango', () => {
    expect(limitarProgreso(-3)).toBe(0);
    expect(limitarProgreso(7)).toBe(1);
  });

  it('trata NaN como cero', () => {
    expect(limitarProgreso(NaN)).toBe(0);
  });
});

describe('calcularAvance', () => {
  it('no pinta nada al empezar', () => {
    const avance = calcularAvance(0, 100);
    expect(avance.marcasObjetivo).toBe(0);
    expect(avance.pasosObjetivo).toBe(0);
    expect(avance.opacidadPapel).toBe(0);
  });

  it('lo pinta todo al terminar', () => {
    const avance = calcularAvance(1, 100);
    expect(avance.marcasObjetivo).toBe(100);
    expect(avance.pasosObjetivo).toBe(PASOS_AGENTES_TOTALES);
    expect(avance.opacidadPapel).toBe(1);
  });

  it('el papel es opaco al llegar al progreso indicado', () => {
    expect(calcularAvance(PROGRESO_PAPEL, 10).opacidadPapel).toBeCloseTo(1, 5);
  });

  it('trata un progreso fuera de rango como el extremo más cercano', () => {
    expect(calcularAvance(-1, 50)).toEqual(calcularAvance(0, 50));
    expect(calcularAvance(5, 50)).toEqual(calcularAvance(1, 50));
  });

  it('nunca retrocede al aumentar el progreso', () => {
    let anterior = calcularAvance(0, 500);
    for (let progreso = 0.1; progreso <= 1; progreso += 0.1) {
      const actual = calcularAvance(progreso, 500);
      expect(actual.marcasObjetivo).toBeGreaterThanOrEqual(anterior.marcasObjetivo);
      expect(actual.pasosObjetivo).toBeGreaterThanOrEqual(anterior.pasosObjetivo);
      expect(actual.opacidadPapel).toBeGreaterThanOrEqual(anterior.opacidadPapel);
      anterior = actual;
    }
  });
});
