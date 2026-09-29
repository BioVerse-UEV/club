export function agruparEnFilas<T>(elementos: T[], tamano: number): T[][] {
  const filas: T[][] = [];
  for (let i = 0; i < elementos.length; i += tamano) {
    filas.push(elementos.slice(i, i + tamano));
  }
  return filas;
}
