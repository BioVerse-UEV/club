import { agruparEnFilas } from './agrupar-en-filas';

describe('agruparEnFilas', () => {
  it('agrupa los elementos en filas del tamaño indicado', () => {
    expect(agruparEnFilas([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('deja la última fila incompleta si sobran elementos', () => {
    expect(agruparEnFilas([1, 2, 3, 4], 3)).toEqual([[1, 2, 3], [4]]);
  });

  it('devuelve un array vacío si no hay elementos', () => {
    expect(agruparEnFilas([], 3)).toEqual([]);
  });

  it('devuelve una única fila si caben todos', () => {
    expect(agruparEnFilas([1, 2], 5)).toEqual([[1, 2]]);
  });
});
