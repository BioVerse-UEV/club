import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { EVENTOS } from '../../core/data/eventos.data';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.scss',
})
export class EventosComponent {
  eventos = EVENTOS;
}
