export interface Presidente {
  id: string;
  nombre: string;
  periodo: string;
  foto: string;
  tipo: 'pasado' | 'actual' | 'sucesor';
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: string;
  foto: string;
}

export interface PistaLofi {
  id: string;
  titulo: string;
  archivo: string;
}

export interface Pintura {
  id: string;
  titulo: string;
  autor: string;
  imagen: string;
}

export interface RedSocial {
  nombre: string;
  url: string;
  icono: string;
}
