import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { PRESIDENTES } from '../../core/data/presidentes.data';
import { EQUIPO } from '../../core/data/equipo.data';

@Component({
  selector: 'app-conocenos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './conocenos.component.html',
  styleUrl: './conocenos.component.scss',
})
export class ConocenosComponent {
  presidentes = PRESIDENTES;
  equipo = EQUIPO;
}
