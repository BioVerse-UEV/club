import { Injectable } from '@angular/core';
import { prepararSesionAcuarela } from './sesion-acuarela';
import type { BocetoAcuarela, SesionAcuarela } from './tipos';

@Injectable({ providedIn: 'root' })
export class AcuarelaService {
  crearBoceto(contenedor: HTMLElement): Promise<BocetoAcuarela> {
    return import('./boceto-acuarela').then((modulo) => modulo.crearBocetoAcuarela(contenedor));
  }

  prepararSesion(url: string): Promise<SesionAcuarela> {
    return prepararSesionAcuarela(url);
  }
}
