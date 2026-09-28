import { calcularDisposicion, expandirMarca, generarMarcas, rgbAHsb, TAMANO_CELDA } from './marcas';

function imagenUniforme(
  ancho: number,
  alto: number,
  r: number,
  g: number,
  b: number,
  a = 255,
): Uint8ClampedArray {
  const datos = new Uint8ClampedArray(ancho * alto * 4);
  for (let i = 0; i < ancho * alto; i += 1) {
    datos[i * 4] = r;
    datos[i * 4 + 1] = g;
    datos[i * 4 + 2] = b;
    datos[i * 4 + 3] = a;
  }
  return datos;
}

describe('rgbAHsb', () => {
  it('convierte rojo puro', () => {
    expect(rgbAHsb(255, 0, 0)).toEqual({ h: 0, s: 1, v: 1 });
  });

  it('convierte verde puro', () => {
    const { h, s, v } = rgbAHsb(0, 255, 0);
    expect(h).toBeCloseTo(1 / 3, 5);
    expect(s).toBe(1);
    expect(v).toBe(1);
  });

  it('convierte blanco sin saturación', () => {
    expect(rgbAHsb(255, 255, 255)).toEqual({ h: 0, s: 0, v: 1 });
  });

  it('convierte negro sin brillo', () => {
    expect(rgbAHsb(0, 0, 0)).toEqual({ h: 0, s: 0, v: 0 });
  });
});

describe('generarMarcas', () => {
  it('genera una marca por celda en una imagen opaca', () => {
    const datos = generarMarcas(imagenUniforme(14, 14, 255, 0, 0), 14, 14);
    expect(datos.marcas.length).toBe(4);
    expect(datos.anchoMuestra).toBe(14);
    expect(datos.altoMuestra).toBe(14);
    expect(datos.tamanoCelda).toBe(TAMANO_CELDA);
  });

  it('guarda el color medio de cada celda', () => {
    const datos = generarMarcas(imagenUniforme(7, 7, 10, 20, 30), 7, 7);
    expect(datos.marcas[0].slice(2, 5)).toEqual([10, 20, 30]);
  });

  it('cuenta también las celdas parciales del borde', () => {
    const datos = generarMarcas(imagenUniforme(15, 15, 0, 0, 255), 15, 15);
    expect(datos.marcas.length).toBe(9);
  });

  it('no genera marcas en una imagen transparente', () => {
    const datos = generarMarcas(imagenUniforme(14, 14, 255, 0, 0, 0), 14, 14);
    expect(datos.marcas.length).toBe(0);
  });

  it('ordena las marcas del centro hacia fuera', () => {
    const datos = generarMarcas(imagenUniforme(28, 28, 200, 100, 50), 28, 28);
    const distancia = (marca: number[]) => Math.hypot(marca[0] / 1000 - 0.5, marca[1] / 1000 - 0.5);
    const primera = datos.marcas[0];
    const ultima = datos.marcas[datos.marcas.length - 1];
    expect(distancia(primera)).toBeLessThanOrEqual(distancia(ultima));
  });
});

describe('calcularDisposicion', () => {
  it('ajusta la imagen al ancho y centra en vertical', () => {
    const disposicion = calcularDisposicion(100, 50, 200, 200);
    expect(disposicion.escala).toBe(2);
    expect(disposicion.anchoDibujo).toBe(200);
    expect(disposicion.altoDibujo).toBe(100);
    expect(disposicion.desplazamientoX).toBe(0);
    expect(disposicion.desplazamientoY).toBe(50);
  });

  it('ajusta la imagen al alto y centra en horizontal', () => {
    const disposicion = calcularDisposicion(100, 100, 300, 100);
    expect(disposicion.escala).toBe(1);
    expect(disposicion.desplazamientoX).toBe(100);
    expect(disposicion.desplazamientoY).toBe(0);
  });
});

describe('expandirMarca', () => {
  const disposicion = calcularDisposicion(100, 100, 100, 100);

  it('conserva el pigmento de la marca', () => {
    const marca = expandirMarca([500, 500, 10, 20, 30, 0, 100, 100], disposicion);
    expect(marca.pigmento).toEqual({ r: 10, g: 20, b: 30 });
  });

  it('coloca la marca cerca de su celda', () => {
    const marca = expandirMarca([500, 500, 10, 20, 30, 0, 100, 100], disposicion);
    const margen = 0.08 * 7 + 1e-9;
    expect(Math.abs(marca.x - 50)).toBeLessThanOrEqual(margen);
    expect(Math.abs(marca.y - 50)).toBeLessThanOrEqual(margen);
  });

  it('es determinista para la misma marca', () => {
    const compacta: [number, number, number, number, number, number, number, number] = [
      300, 700, 1, 2, 3, 40, 90, 110,
    ];
    expect(expandirMarca(compacta, disposicion)).toEqual(expandirMarca(compacta, disposicion));
  });

  it('nunca genera manchas más pequeñas que dos celdas', () => {
    const marca = expandirMarca([500, 500, 10, 20, 30, 0, 10, 10], disposicion);
    expect(marca.ancho).toBeGreaterThanOrEqual(marca.tamanoCelda * 2);
  });
});
