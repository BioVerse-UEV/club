import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { EQUIPO } from '../../core/data/equipo.data';
import { agruparEnFilas } from './agrupar-en-filas';

const MIEMBROS_POR_FILA = 3;

@Component({
  selector: 'app-conocenos',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './conocenos.component.html',
  styleUrl: './conocenos.component.scss',
})
export class ConocenosComponent {
  filas = agruparEnFilas(EQUIPO, MIEMBROS_POR_FILA);
}
