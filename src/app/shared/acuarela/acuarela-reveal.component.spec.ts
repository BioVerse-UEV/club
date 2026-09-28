import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AcuarelaRevealComponent } from './acuarela-reveal.component';
import { AcuarelaService } from './acuarela.service';
import type { SesionAcuarela } from './tipos';

const sesion: SesionAcuarela = {
  pixeles: new Uint8ClampedArray(4),
  marcas: { anchoMuestra: 1, altoMuestra: 1, tamanoCelda: 7, marcas: [] },
};

function crearBocetoFalso() {
  return {
    iniciar: vi.fn(),
    establecerProgreso: vi.fn(),
    redimensionar: vi.fn(),
    destruir: vi.fn(),
  };
}

describe('AcuarelaRevealComponent', () => {
  let boceto: ReturnType<typeof crearBocetoFalso>;
  let servicio: { crearBoceto: ReturnType<typeof vi.fn>; prepararSesion: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    boceto = crearBocetoFalso();
    servicio = {
      crearBoceto: vi.fn().mockResolvedValue(boceto),
      prepararSesion: vi.fn().mockResolvedValue(sesion),
    };
    TestBed.configureTestingModule({
      imports: [AcuarelaRevealComponent],
      providers: [{ provide: AcuarelaService, useValue: servicio }],
    });
  });

  function crear(progreso = 0) {
    const fixture = TestBed.createComponent(AcuarelaRevealComponent);
    fixture.componentRef.setInput('imagenUrl', 'img/prueba.jpg');
    fixture.componentRef.setInput('progreso', progreso);
    fixture.detectChanges();
    return fixture;
  }

  it('crea el boceto en el contenedor y carga la sesión de la imagen', async () => {
    crear();
    await vi.waitFor(() => expect(boceto.iniciar).toHaveBeenCalledWith(sesion));
    expect(servicio.crearBoceto).toHaveBeenCalledWith(expect.any(HTMLElement));
    expect(servicio.prepararSesion).toHaveBeenCalledWith('img/prueba.jpg');
  });

  it('envía el progreso inicial y los cambios posteriores', async () => {
    const fixture = crear(0.25);
    await vi.waitFor(() => expect(boceto.iniciar).toHaveBeenCalled());
    expect(boceto.establecerProgreso).toHaveBeenLastCalledWith(0.25);

    fixture.componentRef.setInput('progreso', 0.5);
    fixture.detectChanges();
    expect(boceto.establecerProgreso).toHaveBeenLastCalledWith(0.5);
  });

  it('destruye el boceto al destruir el componente', async () => {
    const fixture = crear();
    await vi.waitFor(() => expect(boceto.iniciar).toHaveBeenCalled());
    fixture.destroy();
    expect(boceto.destruir).toHaveBeenCalled();
  });

  it('marca error y no inicia el efecto si la imagen no se puede cargar', async () => {
    const consola = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    servicio.prepararSesion.mockRejectedValue(new Error('fallo'));

    const fixture = crear();
    await vi.waitFor(() => expect(fixture.componentInstance.error()).toBe(true));
    expect(boceto.iniciar).not.toHaveBeenCalled();
    consola.mockRestore();
  });

  it('destruye el boceto si el componente se destruye antes de que esté listo', async () => {
    let resolver: (valor: ReturnType<typeof crearBocetoFalso>) => void = () => undefined;
    servicio.crearBoceto.mockReturnValue(new Promise((resolve) => (resolver = resolve)));

    const fixture = crear();
    fixture.destroy();
    resolver(boceto);

    await vi.waitFor(() => expect(boceto.destruir).toHaveBeenCalled());
    expect(boceto.iniciar).not.toHaveBeenCalled();
  });
});
