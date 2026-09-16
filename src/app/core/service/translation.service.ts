import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Idioma = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private http = inject(HttpClient);
  private idiomaActual = signal<Idioma>('es');
  private traducciones = signal<Record<string, unknown>>({});

  readonly idioma = computed(() => this.idiomaActual());

  cargarIdioma(idioma: Idioma): Promise<void> {
    return firstValueFrom(this.http.get<Record<string, unknown>>(`i18n/${idioma}.json`)).then(
      (datos) => {
        this.traducciones.set(datos);
        this.idiomaActual.set(idioma);
      },
    );
  }

  cambiarIdioma(idioma: Idioma): Promise<void> {
    return this.cargarIdioma(idioma);
  }

  traducir(clave: string): string {
    const partes = clave.split('.');
    let valor: unknown = this.traducciones();
    for (const parte of partes) {
      if (typeof valor !== 'object' || valor === null || !(parte in valor)) {
        return clave;
      }
      valor = (valor as Record<string, unknown>)[parte];
    }
    return typeof valor === 'string' ? valor : clave;
  }
}
