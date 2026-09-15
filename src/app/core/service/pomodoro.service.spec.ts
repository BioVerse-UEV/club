import { TestBed } from '@angular/core/testing';
import { PomodoroService } from './pomodoro.service';
import { vi } from 'vitest';

describe('PomodoroService', () => {
  let service: PomodoroService;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('empieza en 25:00 y sin estar activo', () => {
    expect(service.tiempoFormateado()).toBe('25:00');
    expect(service.activo()).toBe(false);
  });

  it('cuenta hacia atrás un segundo por cada tick tras iniciar', () => {
    service.iniciar();

    vi.advanceTimersByTime(1000);

    expect(service.tiempoFormateado()).toBe('24:59');
    expect(service.activo()).toBe(true);
  });

  it('no avanza el contador si no se ha iniciado', () => {
    vi.advanceTimersByTime(5000);

    expect(service.tiempoFormateado()).toBe('25:00');
  });

  it('pausar detiene el contador', () => {
    service.iniciar();
    vi.advanceTimersByTime(1000);

    service.pausar();

    vi.advanceTimersByTime(3000);

    expect(service.tiempoFormateado()).toBe('24:59');
    expect(service.activo()).toBe(false);
  });

  it('reiniciar vuelve a 25:00 y detiene el contador', () => {
    service.iniciar();
    vi.advanceTimersByTime(2000);

    service.reiniciar();

    expect(service.tiempoFormateado()).toBe('25:00');
    expect(service.activo()).toBe(false);
  });
});
