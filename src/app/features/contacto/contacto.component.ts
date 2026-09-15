import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { REDES_SOCIALES } from '../../core/data/redes.data';
import { SITE_CONFIG } from '../../core/data/site-config.data';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.scss',
})
export class ContactoComponent {
  private fb = inject(FormBuilder);

  redes = REDES_SOCIALES;
  siteConfig = SITE_CONFIG;
  enviado = signal(false);

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
  });

  enviarSugerencia(): void {
    if (this.formulario.invalid) {
      return;
    }

    // PENDIENTE: conectar con backend cuando exista; de momento solo simula el envío
    this.enviado.set(true);
    this.formulario.reset();
  }
}
