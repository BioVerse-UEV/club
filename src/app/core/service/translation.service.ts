import { Injectable, signal, computed } from '@angular/core';
import { Idioma, TRADUCCIONES } from '../data/traducciones.data';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private idiomaActual = signal<Idioma>('es');

  readonly idioma = computed(() => this.idiomaActual());

  cambiarIdioma(idioma: Idioma): void {
    this.idiomaActual.set(idioma);
  }

  traducir(clave: string): string {
    const entrada = TRADUCCIONES[clave];
    if (!entrada) {
      return clave;
    }
    return entrada[this.idiomaActual()];
  }
}
