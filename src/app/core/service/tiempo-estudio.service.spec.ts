import { TestBed } from '@angular/core/testing';
import { TiempoEstudioService } from './tiempo-estudio.service';

describe('TiempoEstudioService', () => {
  let service: TiempoEstudioService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiempoEstudioService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('empieza en 0 y sin asignatura', () => {
    expect(service.totalSegundos()).toBe(0);
    expect(service.porAsignatura()).toEqual({});
  });

  it('registrarSegundo suma al total aunque no haya asignatura', () => {
    service.registrarSegundo();
    expect(service.totalSegundos()).toBe(1);
    expect(service.porAsignatura()).toEqual({});
  });

  it('registrarSegundo suma también a la asignatura activa', () => {
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.registrarSegundo();
    expect(service.totalSegundos()).toBe(2);
    expect(service.porAsignatura()['Biotecnología']).toBe(2);
  });

  it('cambiar de asignatura deja de sumar a la anterior', () => {
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.establecerAsignatura('Química');
    service.registrarSegundo();
    expect(service.porAsignatura()['Biotecnología']).toBe(1);
    expect(service.porAsignatura()['Química']).toBe(1);
    expect(service.totalSegundos()).toBe(2);
  });

  it('persiste en localStorage: una nueva instancia recupera el estado', () => {
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();

    const otraInstancia = new TiempoEstudioService();
    expect(otraInstancia.totalSegundos()).toBe(1);
    expect(otraInstancia.porAsignatura()['Biotecnología']).toBe(1);
  });
});
