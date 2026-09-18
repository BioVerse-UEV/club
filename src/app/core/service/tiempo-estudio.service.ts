import { Injectable, computed, signal } from '@angular/core';

const CLAVE_ALMACENAMIENTO = 'bioverse-tiempo-estudio';

interface EstadoTiempoEstudio {
  totalSegundos: number;
  porAsignatura: Record<string, number>;
}

function estadoInicial(): EstadoTiempoEstudio {
  try {
    const guardado = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    if (guardado) {
      return JSON.parse(guardado) as EstadoTiempoEstudio;
    }
  } catch {
    // localStorage no disponible o dato corrupto: se empieza de cero
  }
  return { totalSegundos: 0, porAsignatura: {} };
}

@Injectable({ providedIn: 'root' })
export class TiempoEstudioService {
  private estado = signal<EstadoTiempoEstudio>(estadoInicial());
  private asignaturaActual = signal('');

  readonly totalSegundos = computed(() => this.estado().totalSegundos);
  readonly porAsignatura = computed(() => this.estado().porAsignatura);
  readonly asignatura = computed(() => this.asignaturaActual());

  establecerAsignatura(nombre: string): void {
    this.asignaturaActual.set(nombre.trim());
  }

  registrarSegundo(): void {
    const asignatura = this.asignaturaActual();
    this.estado.update((actual) => {
      const porAsignatura = { ...actual.porAsignatura };
      if (asignatura) {
        porAsignatura[asignatura] = (porAsignatura[asignatura] ?? 0) + 1;
      }
      const nuevo: EstadoTiempoEstudio = {
        totalSegundos: actual.totalSegundos + 1,
        porAsignatura,
      };
      // PENDIENTE: cuando exista backend, este guardado en localStorage se sustituye por una llamada a la API
      try {
        localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(nuevo));
      } catch {
        // localStorage no disponible: se sigue contando solo en memoria de esta sesión
      }
      return nuevo;
    });
  }
}
