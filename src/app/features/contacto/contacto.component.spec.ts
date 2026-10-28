import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { vi } from 'vitest';
import { ContactoComponent } from './contacto.component';
import { ContactoService} from '../../core/service/contacto.service';
import { REDES_SOCIALES } from '../../core/data/redes.data';

describe('ContactoComponent', () => {
  let servicio: {
    enviarMensaje: ReturnType<typeof vi.fn>;
    enviarSugerencia: ReturnType<typeof vi.fn>;
  };
  let fixture: ComponentFixture<ContactoComponent>;
  let componente: ContactoComponent;

  const datosValidos = {
    nombre: 'Test User',
    email: 'test@example.com',
    mensaje: 'Un mensaje de prueba válido',
  };

  beforeEach(() => {
    servicio = {
      enviarMensaje: vi.fn().mockResolvedValue(undefined),
      enviarSugerencia: vi.fn().mockResolvedValue(undefined),
    };
    TestBed.configureTestingModule({
      imports: [ContactoComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContactoService, useValue: servicio },
      ],
    });
    fixture = TestBed.createComponent(ContactoComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('formulario de contacto', () => {
    it('no envía nada si está vacío y muestra los errores', async () => {
      await componente.enviarContacto();
      fixture.detectChanges();

      expect(servicio.enviarMensaje).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelectorAll('.contacto__error').length).toBeGreaterThan(0);
    });

    it('rechaza un correo con formato inválido', async () => {
      componente.formularioContacto.setValue({ ...datosValidos, email: 'no-es-un-correo' });
      await componente.enviarContacto();
      expect(servicio.enviarMensaje).not.toHaveBeenCalled();
    });

    it('rechaza un mensaje demasiado corto', async () => {
      componente.formularioContacto.setValue({ ...datosValidos, mensaje: 'hola' });
      await componente.enviarContacto();
      expect(servicio.enviarMensaje).not.toHaveBeenCalled();
    });

    it('rechaza un nombre formado solo por espacios', async () => {
      componente.formularioContacto.setValue({ ...datosValidos, nombre: '     ' });
      await componente.enviarContacto();
      expect(servicio.enviarMensaje).not.toHaveBeenCalled();
    });

    it('envía los datos sin espacios sobrantes y vacía el formulario', async () => {
      componente.formularioContacto.setValue({
        nombre: '  Test User  ',
        email: 'test@example.com',
        mensaje: '  Un mensaje de prueba válido  ',
      });

      await componente.enviarContacto();

      expect(servicio.enviarMensaje).toHaveBeenCalledWith(datosValidos);
      expect(componente.estadoContacto()).toBe('enviado');
      expect(componente.formularioContacto.getRawValue()).toEqual({
        nombre: '',
        email: '',
        mensaje: '',
      });
    });

    it('muestra el error y conserva lo escrito si el envío falla', async () => {
      servicio.enviarMensaje.mockRejectedValue(new Error('fallo'));
      componente.formularioContacto.setValue(datosValidos);

      await componente.enviarContacto();
      fixture.detectChanges();

      expect(componente.estadoContacto()).toBe('error');
      expect(componente.formularioContacto.getRawValue()).toEqual(datosValidos);
      expect(fixture.nativeElement.querySelector('.contacto__estado--error')).not.toBeNull();
    });

    it('no envía dos veces mientras hay un envío en curso', async () => {
      let terminar: () => void = () => undefined;
      servicio.enviarMensaje.mockReturnValue(
        new Promise<void>((resolver) => (terminar = resolver)),
      );
      componente.formularioContacto.setValue(datosValidos);

      const primero = componente.enviarContacto();
      await componente.enviarContacto();
      terminar();
      await primero;

      expect(servicio.enviarMensaje).toHaveBeenCalledTimes(1);
    });

    it('limpia el mensaje de estado cuando la persona vuelve a escribir', () => {
      componente.estadoContacto.set('enviado');
      fixture.nativeElement
        .querySelector('.contacto__form')
        .dispatchEvent(new Event('input', { bubbles: true }));
      expect(componente.estadoContacto()).toBe('inactivo');
    });
  });

  describe('buzón de sugerencias', () => {
    it('no envía una sugerencia vacía', async () => {
      await componente.enviarSugerencia();
      expect(servicio.enviarSugerencia).not.toHaveBeenCalled();
    });

    it('no envía una sugerencia demasiado corta', async () => {
      componente.formularioSugerencia.setValue({ mensaje: 'corta' });
      await componente.enviarSugerencia();
      expect(servicio.enviarSugerencia).not.toHaveBeenCalled();
    });

    it('envía solo el mensaje y vacía el campo', async () => {
      componente.formularioSugerencia.setValue({
        mensaje: '  Una sugerencia para mejorar el club  ',
      });

      await componente.enviarSugerencia();

      expect(servicio.enviarSugerencia).toHaveBeenCalledWith('Una sugerencia para mejorar el club');
      expect(componente.estadoSugerencia()).toBe('enviado');
      expect(componente.formularioSugerencia.getRawValue().mensaje).toBe('');
    });

    it('muestra el error si el envío falla', async () => {
      servicio.enviarSugerencia.mockRejectedValue(new Error('fallo'));
      componente.formularioSugerencia.setValue({ mensaje: 'Una sugerencia para mejorar el club' });

      await componente.enviarSugerencia();

      expect(componente.estadoSugerencia()).toBe('error');
    });
  });

  it('muestra un icono por cada red social', () => {
    expect(fixture.nativeElement.querySelectorAll('.contacto__red').length).toBe(
      REDES_SOCIALES.length,
    );
  });
});
