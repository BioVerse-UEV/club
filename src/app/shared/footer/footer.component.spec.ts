import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { REDES_SOCIALES } from '../../core/data/redes.data';

describe('FooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FooterComponent] });
  });

  function crear(): HTMLElement {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('muestra un enlace por cada red social', () => {
    expect(crear().querySelectorAll('.footer__red').length).toBe(REDES_SOCIALES.length);
  });

  it('cada enlace tiene nombre accesible y se abre en una pestaña nueva', () => {
    crear()
      .querySelectorAll('.footer__red')
      .forEach((enlace, i) => {
        expect(enlace.getAttribute('aria-label')).toBe(REDES_SOCIALES[i].nombre);
        expect(enlace.getAttribute('target')).toBe('_blank');
      });
  });

  it('cada icono apunta a su archivo svg', () => {
    crear()
      .querySelectorAll('.footer__red img')
      .forEach((imagen, i) => {
        expect(imagen.getAttribute('src')).toBe(`img/iconos/${REDES_SOCIALES[i].icono}.svg`);
      });
  });

  it('muestra el año actual y el nombre del club', () => {
    const texto = crear().textContent ?? '';
    expect(texto).toContain(String(new Date().getFullYear()));
    expect(texto).toContain('BioVerse');
  });

  it('no incluye redes que no se usan en el club', () => {
    expect(REDES_SOCIALES.some((red) => red.nombre === 'X')).toBe(false);
  });
});
