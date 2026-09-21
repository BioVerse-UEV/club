import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { PUBLICACIONES } from '../../core/data/publicaciones.data';
import { REDES_SOCIALES } from '../../core/data/redes.data';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventosComponent {
  publicaciones = PUBLICACIONES;
  redesVideo = REDES_SOCIALES.filter((red) => red.nombre !== 'LinkedIn');
}
