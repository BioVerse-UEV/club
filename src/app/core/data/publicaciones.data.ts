export interface Publicacion {
  id: string;
  red: 'tiktok' | 'instagram' | 'youtube';
  url: string;
  enVivo: boolean;
  descripcion: string;
}

export const PUBLICACIONES: Publicacion[] = [
  {
    id: 'publicacion-1',
    red: 'tiktok',
    url: 'PENDIENTE DE PONER URL DEL VIDEO',
    enVivo: true,
    descripcion: 'PENDIENTE DE PONER DESCRIPCION DEL VIDEO',
  },
  {
    id: 'publicacion-2',
    red: 'instagram',
    url: 'PENDIENTE DE PONER URL DEL VIDEO',
    enVivo: false,
    descripcion: 'PENDIENTE DE PONER DESCRIPCION DEL VIDEO',
  },
];
