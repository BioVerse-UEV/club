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
    this.asignaturaActual.set(nombre);
  }

  crearAsignatura(nombre: string): boolean {
    const limpio = nombre.trim();
    if (!limpio) {
      return false;
    }
    const yaExiste = Object.keys(this.estado().porAsignatura).some(
      (existente) => existente.toLowerCase() === limpio.toLowerCase(),
    );
    if (yaExiste) {
      return false;
    }
    this.estado.update((actual) => {
      const nuevo: EstadoTiempoEstudio = {
        totalSegundos: actual.totalSegundos,
        porAsignatura: { ...actual.porAsignatura, [limpio]: 0 },
      };
      this.guardar(nuevo);
      return nuevo;
    });
    return true;
  }

  eliminarAsignatura(nombre: string): void {
    this.estado.update((actual) => {
      const porAsignatura = { ...actual.porAsignatura };
      delete porAsignatura[nombre];
      const nuevo: EstadoTiempoEstudio = { totalSegundos: actual.totalSegundos, porAsignatura };
      this.guardar(nuevo);
      return nuevo;
    });
    if (this.asignaturaActual() === nombre) {
      this.asignaturaActual.set('');
    }
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
      this.guardar(nuevo);
      return nuevo;
    });
  }

  private guardar(estado: EstadoTiempoEstudio): void {
    // PENDIENTE: cuando exista backend, este guardado en localStorage se sustituye por una llamada a la API
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(estado));
    } catch {
      // localStorage no disponible: se sigue contando solo en memoria de esta sesión
    }
  }

  reiniciarTodo(): void {
    const nuevo: EstadoTiempoEstudio = { totalSegundos: 0, porAsignatura: {} };
    this.estado.set(nuevo);
    this.guardar(nuevo);
    this.asignaturaActual.set('');
  }

}
