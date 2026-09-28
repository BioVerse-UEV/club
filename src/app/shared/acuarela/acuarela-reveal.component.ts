import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { AcuarelaService } from './acuarela.service';
import type { BocetoAcuarela } from './tipos';

@Component({
  selector: 'app-acuarela-reveal',
  standalone: true,
  templateUrl: './acuarela-reveal.component.html',
  styleUrl: './acuarela-reveal.component.scss',
})
export class AcuarelaRevealComponent implements AfterViewInit, OnDestroy {
  readonly imagenUrl = input.required<string>();
  readonly progreso = input(0);
  readonly alt = input('');
  readonly error = signal(false);

  private servicio = inject(AcuarelaService);
  private contenedor = viewChild.required<ElementRef<HTMLDivElement>>('contenedor');
  private boceto: BocetoAcuarela | null = null;
  private observador: ResizeObserver | null = null;
  private destruido = false;

  constructor() {
    effect(() => {
      const progreso = this.progreso();
      this.boceto?.establecerProgreso(progreso);
    });

    effect(() => {
      const url = this.imagenUrl();
      if (this.boceto) {
        void this.cargarSesion(url);
      }
    });
  }

  async ngAfterViewInit(): Promise<void> {
    const elemento = this.contenedor().nativeElement;

    try {
      const boceto = await this.servicio.crearBoceto(elemento);
      if (this.destruido) {
        boceto.destruir();
        return;
      }

      this.boceto = boceto;
      if (typeof ResizeObserver !== 'undefined') {
        this.observador = new ResizeObserver(() => this.ajustarTamano());
        this.observador.observe(elemento);
      }
      await this.cargarSesion(this.imagenUrl());
    } catch (fallo) {
      console.error('Acuarela: no se pudo iniciar el efecto', fallo);
      this.error.set(true);
    }
  }

  ngOnDestroy(): void {
    this.destruido = true;
    this.observador?.disconnect();
    this.boceto?.destruir();
    this.boceto = null;
  }

  private async cargarSesion(url: string): Promise<void> {
    try {
      const sesion = await this.servicio.prepararSesion(url);
      if (this.destruido) {
        return;
      }
      this.error.set(false);
      this.boceto?.iniciar(sesion);
      this.boceto?.establecerProgreso(this.progreso());
    } catch (fallo) {
      console.error('Acuarela: no se pudo cargar la imagen', fallo);
      this.error.set(true);
    }
  }

  private ajustarTamano(): void {
    const { clientWidth, clientHeight } = this.contenedor().nativeElement;
    if (clientWidth > 0 && clientHeight > 0) {
      this.boceto?.redimensionar(clientWidth, clientHeight);
    }
  }
}
