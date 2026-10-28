import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContactoService } from './contacto.service';
import { SITE_CONFIG } from '../data/site-config.data';

describe('ContactoService', () => {
  let servicio: ContactoService;
  let http: HttpTestingController;

  const datos = {
    nombre: 'Test User',
    email: 'test@example.com',
    mensaje: 'Un mensaje de prueba válido',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    servicio = TestBed.inject(ContactoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('envía el mensaje de contacto por POST con los datos del formulario', async () => {
    const promesa = servicio.enviarMensaje(datos);
    const peticion = http.expectOne(`${SITE_CONFIG.apiUrl}/contacto`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual(datos);
    peticion.flush(null);
    await expect(promesa).resolves.toBeUndefined();
  });

  it('rechaza el mensaje si el servidor responde con error', async () => {
    const promesa = servicio.enviarMensaje(datos);
    http
      .expectOne(`${SITE_CONFIG.apiUrl}/contacto`)
      .flush('fallo', { status: 500, statusText: 'Server Error' });
    await expect(promesa).rejects.toBeTruthy();
  });

  it('envía la sugerencia por POST solo con el mensaje', async () => {
    const promesa = servicio.enviarSugerencia('Una sugerencia de prueba');
    const peticion = http.expectOne(`${SITE_CONFIG.apiUrl}/sugerencias`);
    expect(peticion.request.method).toBe('POST');
    expect(peticion.request.body).toEqual({ mensaje: 'Una sugerencia de prueba' });
    peticion.flush(null);
    await expect(promesa).resolves.toBeUndefined();
  });

  it('rechaza la sugerencia si el servidor responde con error', async () => {
    const promesa = servicio.enviarSugerencia('Una sugerencia de prueba');
    http
      .expectOne(`${SITE_CONFIG.apiUrl}/sugerencias`)
      .flush('fallo', { status: 500, statusText: 'Server Error' });
    await expect(promesa).rejects.toBeTruthy();
  });
});
