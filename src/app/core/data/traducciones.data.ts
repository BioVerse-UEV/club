export type Idioma = 'es' | 'en';

export const TRADUCCIONES: Record<string, Record<Idioma, string>> = {
  'nav.inicio': { es: 'Inicio', en: 'Home' },
  'nav.conocenos': { es: 'Conócenos', en: 'About Us' },
  'nav.eventos': { es: 'Eventos y Media', en: 'Events & Media' },
  'nav.estudio': { es: 'Estudio', en: 'Study Room' },
  'nav.contacto': { es: 'Contacto', en: 'Contact' },

  'home.hero.titulo': { es: 'Bienvenidos a BioVerse', en: 'Welcome to BioVerse' },
  'home.hero.subtitulo': {
    es: 'El club de biotecnología de la Universidad Europea de Valencia',
    en: 'The biotechnology club of Universidad Europea de Valencia',
  },
  'home.ultimo.titulo': { es: 'Lo último', en: 'Latest' },

  'conocenos.timeline.titulo': { es: 'Nuestra Historia', en: 'Our History' },
  'conocenos.equipo.titulo': { es: 'El Equipo', en: 'The Team' },

  'eventos.titulo': { es: 'Eventos y Media', en: 'Events & Media' },
  'eventos.verVideo': { es: 'Ver vídeo', en: 'Watch video' },
  'eventos.verLive': { es: 'Ver en directo', en: 'Watch live' },

  'estudio.titulo': { es: 'Sala de Estudio', en: 'Study Room' },
  'estudio.lofi.titulo': { es: 'Música Lofi', en: 'Lofi Music' },
  'estudio.pomodoro.titulo': { es: 'Pomodoro', en: 'Pomodoro' },
  'estudio.pomodoro.iniciar': { es: 'Iniciar', en: 'Start' },
  'estudio.pomodoro.pausar': { es: 'Pausar', en: 'Pause' },
  'estudio.pomodoro.reiniciar': { es: 'Reiniciar', en: 'Reset' },
  'estudio.pinturas.titulo': { es: 'Galería de Pinturas', en: 'Painting Gallery' },

  'contacto.titulo': { es: 'Contacto', en: 'Contact' },
  'contacto.redes.titulo': { es: 'Síguenos', en: 'Follow Us' },
  'contacto.sugerencias.titulo': { es: 'Buzón de Sugerencias', en: 'Suggestion Box' },
  'contacto.sugerencias.nombre': { es: 'Nombre', en: 'Name' },
  'contacto.sugerencias.mensaje': { es: 'Mensaje', en: 'Message' },
  'contacto.sugerencias.enviar': { es: 'Enviar', en: 'Send' },
  'contacto.sugerencias.exito': {
    es: '¡Gracias por tu sugerencia!',
    en: 'Thanks for your suggestion!',
  },
};
