import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SITE_CONFIG } from '../data/site-config.data';

export interface MensajeContacto {
  nombre: string;
  email: string;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class ContactoService {
  private http = inject(HttpClient);

  async enviarMensaje(datos: MensajeContacto): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${SITE_CONFIG.apiUrl}/contacto`, datos));
  }

  async enviarSugerencia(mensaje: string): Promise<void> {
    await firstValueFrom(this.http.post<void>(`${SITE_CONFIG.apiUrl}/sugerencias`, { mensaje }));
  }
}
