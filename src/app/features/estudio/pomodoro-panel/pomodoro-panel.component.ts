import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { PomodoroService } from '../../../core/service/pomodoro.service';
import { TiempoEstudioService } from '../../../core/service/tiempo-estudio.service';
import { PISTAS_LOFI } from '../../../core/data/lofi-tracks.data';
import { PINTURAS } from '../../../core/data/pinturas.data';

@Component({
  selector: 'app-pomodoro-panel',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './pomodoro-panel.component.html',
  styleUrl: './pomodoro-panel.component.scss',
})
export class PomodoroPanelComponent implements OnInit, OnDestroy {
  private intervaloId: ReturnType<typeof setInterval> | undefined;
  private manejadorVisibilidad = (): void => {
    if (document.hidden) {
      this.pomodoro.pausar();
    }
  };

  pistas = PISTAS_LOFI;
  imagen = PINTURAS[Math.floor(Math.random() * PINTURAS.length)];
  minutosSeleccionados = signal(25);
  asignaturaTexto = signal('');
  pistaSeleccionada = signal(this.pistas[0]?.archivo ?? '');

  readonly minutosDeAsignaturaActual = computed(() =>
    this.formatearMinutos(this.tiempoEstudio.porAsignatura()[this.tiempoEstudio.asignatura()] ?? 0),
  );
  readonly tiempoTotalFormateado = computed(() =>
    this.formatearMinutos(this.tiempoEstudio.totalSegundos()),
  );

  constructor(
    public pomodoro: PomodoroService,
    public tiempoEstudio: TiempoEstudioService,
  ) {}

  ngOnInit(): void {
    document.addEventListener('visibilitychange', this.manejadorVisibilidad);
    this.intervaloId = setInterval(() => {
      if (this.pomodoro.activo()) {
        this.pomodoro.avanzarSegundo();
        this.tiempoEstudio.registrarSegundo();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.manejadorVisibilidad);
    if (this.intervaloId) {
      clearInterval(this.intervaloId);
    }
  }

  cambiarDuracion(minutos: number): void {
    this.minutosSeleccionados.set(minutos);
    this.pomodoro.establecerDuracionMinutos(minutos);
  }

  actualizarAsignatura(valor: string): void {
    this.asignaturaTexto.set(valor);
    this.tiempoEstudio.establecerAsignatura(valor);
  }

  private formatearMinutos(segundosTotales: number): string {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos}m ${segundos.toString().padStart(2, '0')}s`;
  }
}
