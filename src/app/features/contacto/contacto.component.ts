import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { ContactoService} from '../../core/service/contacto.service';
import { REDES_SOCIALES } from '../../core/data/redes.data';
import { SITE_CONFIG } from '../../core/data/site-config.data';

export type EstadoEnvio = 'inactivo' | 'enviando' | 'enviado' | 'error';

const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATRON_CONTENIDO = /\S/;
const MENSAJE_MINIMO = 10;
const MENSAJE_MAXIMO = 1000;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  private fb = inject(FormBuilder);
  private contactoService = inject(ContactoService);

  readonly redes = REDES_SOCIALES;
  readonly siteConfig = SITE_CONFIG;

  readonly formularioContacto = this.fb.nonNullable.group({
    nombre: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(PATRON_CONTENIDO)],
    ],
    email: ['', [Validators.required, Validators.pattern(PATRON_EMAIL)]],
    mensaje: [
      '',
      [
        Validators.required,
        Validators.minLength(MENSAJE_MINIMO),
        Validators.maxLength(MENSAJE_MAXIMO),
        Validators.pattern(PATRON_CONTENIDO),
      ],
    ],
  });

  readonly formularioSugerencia = this.fb.nonNullable.group({
    mensaje: [
      '',
      [
        Validators.required,
        Validators.minLength(MENSAJE_MINIMO),
        Validators.maxLength(MENSAJE_MAXIMO),
        Validators.pattern(PATRON_CONTENIDO),
      ],
    ],
  });

  readonly estadoContacto = signal<EstadoEnvio>('inactivo');
  readonly estadoSugerencia = signal<EstadoEnvio>('inactivo');

  errorDe(grupo: FormGroup, campo: string): string | null {
    const control = grupo.get(campo);
    if (!control || !control.invalid || !(control.touched || control.dirty)) {
      return null;
    }
    if (control.hasError('required')) {
      return 'contacto.errores.obligatorio';
    }
    if (campo === 'email') {
      return 'contacto.errores.email';
    }
    if (control.hasError('minlength')) {
      return 'contacto.errores.corto';
    }
    if (control.hasError('maxlength')) {
      return 'contacto.errores.largo';
    }
    return 'contacto.errores.obligatorio';
  }

  reiniciarEstado(estado: WritableSignal<EstadoEnvio>): void {
    if (estado() !== 'enviando') {
      estado.set('inactivo');
    }
  }

  async enviarContacto(): Promise<void> {
    if (this.estadoContacto() === 'enviando') {
      return;
    }
    if (this.formularioContacto.invalid) {
      this.formularioContacto.markAllAsTouched();
      return;
    }

    const { nombre, email, mensaje } = this.formularioContacto.getRawValue();
    this.estadoContacto.set('enviando');
    try {
      await this.contactoService.enviarMensaje({
        nombre: nombre.trim(),
        email: email.trim(),
        mensaje: mensaje.trim(),
      });
      this.formularioContacto.reset();
      this.estadoContacto.set('enviado');
    } catch {
      this.estadoContacto.set('error');
    }
  }

  async enviarSugerencia(): Promise<void> {
    if (this.estadoSugerencia() === 'enviando') {
      return;
    }
    if (this.formularioSugerencia.invalid) {
      this.formularioSugerencia.markAllAsTouched();
      return;
    }

    const { mensaje } = this.formularioSugerencia.getRawValue();
    this.estadoSugerencia.set('enviando');
    try {
      await this.contactoService.enviarSugerencia(mensaje.trim());
      this.formularioSugerencia.reset();
      this.estadoSugerencia.set('enviado');
    } catch {
      this.estadoSugerencia.set('error');
    }
  }
}
