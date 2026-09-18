import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private duracionSegundos = signal(25 * 60);
  private segundosRestantes = signal(25 * 60);
  private enMarcha = signal(false);

  readonly activo = computed(() => this.enMarcha());
  readonly duracion = computed(() => this.duracionSegundos());
  readonly progreso = computed(() => {
    const total = this.duracionSegundos();
    if (total === 0) {
      return 1;
    }
    return 1 - this.segundosRestantes() / total;
  });
  readonly tiempoFormateado = computed(() => {
    const total = this.segundosRestantes();
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  });

  establecerDuracion(minutos: number, segundos: number): void {
    if (this.enMarcha()) {
      return;
    }
    const minutosValidos = Math.max(0, Math.floor(minutos));
    const segundosValidos = Math.min(59, Math.max(0, Math.floor(segundos)));
    const totalSegundos = Math.max(1, minutosValidos * 60 + segundosValidos);
    this.duracionSegundos.set(totalSegundos);
    this.segundosRestantes.set(totalSegundos);
  }

  iniciar(): void {
    if (this.segundosRestantes() > 0) {
      this.enMarcha.set(true);
    }
  }

  pausar(): void {
    this.enMarcha.set(false);
  }

  reiniciar(): void {
    this.enMarcha.set(false);
    this.segundosRestantes.set(this.duracionSegundos());
  }

  avanzarSegundo(): void {
    if (!this.enMarcha()) {
      return;
    }
    const restante = this.segundosRestantes();
    if (restante <= 1) {
      this.segundosRestantes.set(0);
      this.enMarcha.set(false);
      return;
    }
    this.segundosRestantes.set(restante - 1);
  }
}
