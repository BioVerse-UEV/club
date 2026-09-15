import { TestBed } from '@angular/core/testing';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationService);
  });

  it('devuelve la traducción en español por defecto', () => {
    expect(service.traducir('nav.inicio')).toBe('Inicio');
  });

  it('devuelve la traducción en inglés tras cambiar de idioma', () => {
    service.cambiarIdioma('en');
    expect(service.traducir('nav.inicio')).toBe('Home');
  });

  it('devuelve la propia clave si no existe traducción', () => {
    expect(service.traducir('clave.inexistente')).toBe('clave.inexistente');
  });
});
