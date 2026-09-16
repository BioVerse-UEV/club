import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TranslationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('carga y devuelve traducciones en español', async () => {
    const promesa = service.cargarIdioma('es');
    httpMock.expectOne('assets/i18n/es.json').flush({ nav: { inicio: 'Inicio' } });
    await promesa;
    expect(service.traducir('nav.inicio')).toBe('Inicio');
  });

  it('carga y devuelve traducciones en inglés', async () => {
    const promesa = service.cambiarIdioma('en');
    httpMock.expectOne('assets/i18n/en.json').flush({ nav: { inicio: 'Home' } });
    await promesa;
    expect(service.traducir('nav.inicio')).toBe('Home');
  });

  it('devuelve la propia clave si no existe traducción', () => {
    expect(service.traducir('clave.inexistente')).toBe('clave.inexistente');
  });
});
