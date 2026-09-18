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

  it('crea una asignatura nueva con 0 segundos', () => {
    const creada = service.crearAsignatura('Biotecnología');
    expect(creada).toBe(true);
    expect(service.porAsignatura()['Biotecnología']).toBe(0);
  });

  it('no crea una asignatura duplicada (sin importar mayúsculas)', () => {
    service.crearAsignatura('Biotecnología');
    const creada = service.crearAsignatura('biotecnología');
    expect(creada).toBe(false);
    expect(Object.keys(service.porAsignatura()).length).toBe(1);
  });

  it('registrarSegundo suma también a la asignatura activa', () => {
    service.crearAsignatura('Biotecnología');
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.registrarSegundo();
    expect(service.totalSegundos()).toBe(2);
    expect(service.porAsignatura()['Biotecnología']).toBe(2);
  });

  it('cambiar de asignatura no borra el tiempo de la anterior', () => {
    service.crearAsignatura('Biotecnología');
    service.crearAsignatura('Química');
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.establecerAsignatura('Química');
    service.registrarSegundo();
    expect(service.porAsignatura()['Biotecnología']).toBe(1);
    expect(service.porAsignatura()['Química']).toBe(1);
    expect(service.totalSegundos()).toBe(2);
  });

  it('elimina una asignatura y su tiempo', () => {
    service.crearAsignatura('Biotecnología');
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.eliminarAsignatura('Biotecnología');
    expect(service.porAsignatura()['Biotecnología']).toBeUndefined();
  });

  it('si se elimina la asignatura activa, deja de haber asignatura seleccionada', () => {
    service.crearAsignatura('Biotecnología');
    service.establecerAsignatura('Biotecnología');
    service.eliminarAsignatura('Biotecnología');
    expect(service.asignatura()).toBe('');
  });

  it('persiste en localStorage: una nueva instancia recupera el estado', () => {
    service.crearAsignatura('Biotecnología');
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();

    const otraInstancia = new TiempoEstudioService();
    expect(otraInstancia.totalSegundos()).toBe(1);
    expect(otraInstancia.porAsignatura()['Biotecnología']).toBe(1);
  });

  it('reiniciarTodo borra el total y todas las asignaturas', () => {
    service.crearAsignatura('Biotecnología');
    service.establecerAsignatura('Biotecnología');
    service.registrarSegundo();
    service.registrarSegundo();

    service.reiniciarTodo();

    expect(service.totalSegundos()).toBe(0);
    expect(service.porAsignatura()).toEqual({});
    expect(service.asignatura()).toBe('');
  });


});
