export interface ItemNavegacion {
  etiqueta: string;
  ruta: string;
}

export const NAVEGACION: ItemNavegacion[] = [
  { etiqueta: 'nav.inicio', ruta: '/' },
  { etiqueta: 'nav.eventos', ruta: '/eventos' },
  { etiqueta: 'nav.estudio', ruta: '/estudio' },
  { etiqueta: 'nav.conocenos', ruta: '/conocenos' },
  { etiqueta: 'nav.contacto', ruta: '/contacto' },
];
