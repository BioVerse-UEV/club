import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../core/service/translation.service';
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
  segundosSeleccionados = signal(0);
  nuevaAsignaturaTexto = signal('');
  avisoDuplicado = signal(false);
  pistaSeleccionada = signal(this.pistas[0]?.archivo ?? '');

  readonly tiempoTotalFormateado = computed(() =>
    this.formatearMinutos(this.tiempoEstudio.totalSegundos()),
  );
  readonly listaAsignaturas = computed(() => {
    const registro = this.tiempoEstudio.porAsignatura();
    return Object.keys(registro).map((nombre) => ({
      nombre,
      tiempo: this.formatearMinutos(registro[nombre]),
    }));
  });

  constructor(
    public pomodoro: PomodoroService,
    public tiempoEstudio: TiempoEstudioService,
    private translationService: TranslationService,
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

  cambiarMinutos(minutos: number): void {
    this.minutosSeleccionados.set(minutos);
    this.pomodoro.establecerDuracion(minutos, this.segundosSeleccionados());
  }

  cambiarSegundos(segundos: number): void {
    this.segundosSeleccionados.set(segundos);
    this.pomodoro.establecerDuracion(this.minutosSeleccionados(), segundos);
  }

  actualizarNuevaAsignatura(valor: string): void {
    this.nuevaAsignaturaTexto.set(valor);
    this.avisoDuplicado.set(false);
  }

  agregarAsignatura(): void {
    const nombre = this.nuevaAsignaturaTexto().trim();
    if (!nombre) {
      return;
    }
    const creada = this.tiempoEstudio.crearAsignatura(nombre);
    if (!creada) {
      this.avisoDuplicado.set(true);
      return;
    }
    this.tiempoEstudio.establecerAsignatura(nombre);
    this.nuevaAsignaturaTexto.set('');
    this.avisoDuplicado.set(false);
  }

  seleccionarAsignatura(nombre: string): void {
    this.tiempoEstudio.establecerAsignatura(nombre);
  }

  eliminarAsignatura(nombre: string, evento: Event): void {
    evento.stopPropagation();
    const mensaje = this.translationService
      .traducir('herramientas.pomodoro.confirmarEliminar')
      .replace('{nombre}', nombre);
    if (window.confirm(mensaje)) {
      this.tiempoEstudio.eliminarAsignatura(nombre);
    }
  }

  eliminarTodo(): void {
    const mensaje = this.translationService.traducir('herramientas.pomodoro.confirmarEliminarTodo');
    if (window.confirm(mensaje)) {
      this.tiempoEstudio.reiniciarTodo();
    }
  }

  private formatearMinutos(segundosTotales: number): string {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    return `${minutos}m ${segundos.toString().padStart(2, '0')}s`;
  }
}
