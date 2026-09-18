import { Component, signal } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { PomodoroPanelComponent } from './pomodoro-panel/pomodoro-panel.component';
import { PALETA_UNIVERSIDAD } from '../../core/data/paleta-universidad.data';
import { LOGOS_UNIVERSIDAD } from '../../core/data/logos-universidad.data';
import { PINTURAS } from '../../core/data/pinturas.data';

type PestanaHerramientas = 'recursos' | 'pomodoro' | 'galeria' | 'bases-datos' | 'enlaces-recursos';

@Component({
  selector: 'app-estudio',
  standalone: true,
  imports: [TranslatePipe, PomodoroPanelComponent],
  templateUrl: './estudio.component.html',
  styleUrl: './estudio.component.scss',
})
export class EstudioComponent {
  paleta = PALETA_UNIVERSIDAD;
  logos = LOGOS_UNIVERSIDAD;
  galeria = PINTURAS;
  pestanaActiva = signal<PestanaHerramientas>('recursos');

  seleccionarPestana(pestana: PestanaHerramientas): void {
    this.pestanaActiva.set(pestana);
  }
}
