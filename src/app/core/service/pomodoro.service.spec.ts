import { TestBed } from '@angular/core/testing';
import { PomodoroService } from './pomodoro.service';

describe('PomodoroService', () => {
  let service: PomodoroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PomodoroService);
  });

  it('empieza en 25:00 y sin estar activo', () => {
    expect(service.tiempoFormateado()).toBe('25:00');
    expect(service.activo()).toBe(false);
  });

  it('permite establecer una duración personalizada cuando está parado', () => {
    service.establecerDuracionMinutos(10);
    expect(service.tiempoFormateado()).toBe('10:00');
  });

  it('no permite cambiar la duración mientras está en marcha', () => {
    service.establecerDuracionMinutos(10);
    service.iniciar();
    service.establecerDuracionMinutos(20);
    expect(service.tiempoFormateado()).toBe('10:00');
  });

  it('avanzarSegundo solo resta si está activo', () => {
    service.establecerDuracionMinutos(1);
    service.avanzarSegundo();
    expect(service.tiempoFormateado()).toBe('01:00');
    service.iniciar();
    service.avanzarSegundo();
    expect(service.tiempoFormateado()).toBe('00:59');
  });

  it('se detiene sola al llegar a 0 y progreso llega a 1', () => {
    service.establecerDuracionMinutos(1);
    service.iniciar();
    for (let i = 0; i < 60; i++) {
      service.avanzarSegundo();
    }
    expect(service.tiempoFormateado()).toBe('00:00');
    expect(service.activo()).toBe(false);
    expect(service.progreso()).toBe(1);
  });

  it('reiniciar vuelve a la duración establecida y para', () => {
    service.establecerDuracionMinutos(5);
    service.iniciar();
    service.avanzarSegundo();
    service.reiniciar();
    expect(service.tiempoFormateado()).toBe('05:00');
    expect(service.activo()).toBe(false);
  });
});
