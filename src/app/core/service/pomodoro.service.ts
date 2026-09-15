import { Injectable, signal, computed } from '@angular/core';

const MINUTOS_TRABAJO = 25;
const MINUTOS_DESCANSO = 5;

@Injectable({ providedIn: 'root' })
export class PomodoroService {
  private segundosRestantes = signal(MINUTOS_TRABAJO * 60);
  private enMarcha = signal(false);
  private enDescanso = signal(false);
  private intervaloId: ReturnType<typeof setInterval> | undefined;

  readonly activo = computed(() => this.enMarcha());
  readonly descanso = computed(() => this.enDescanso());
  readonly tiempoFormateado = computed(() => {
    const total = this.segundosRestantes();
    const minutos = Math.floor(total / 60);
    const segundos = total % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  });

  iniciar(): void {
    if (this.enMarcha()) {
      return;
    }
    this.enMarcha.set(true);
    this.intervaloId = setInterval(() => this.tick(), 1000);
  }

  pausar(): void {
    this.enMarcha.set(false);
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  reiniciar(): void {
    this.pausar();
    this.enDescanso.set(false);
    this.segundosRestantes.set(MINUTOS_TRABAJO * 60);
  }

  private tick(): void {
    const restante = this.segundosRestantes();
    if (restante <= 0) {
      const pasandoADescanso = !this.enDescanso();
      this.enDescanso.set(pasandoADescanso);
      this.segundosRestantes.set((pasandoADescanso ? MINUTOS_DESCANSO : MINUTOS_TRABAJO) * 60);
      return;
    }
    this.segundosRestantes.set(restante - 1);
  }
}
