import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { PomodoroService } from '../../core/service/pomodoro.service';
import { PISTAS_LOFI } from '../../core/data/lofi-tracks.data';
import { PINTURAS } from '../../core/data/pinturas.data';

@Component({
  selector: 'app-estudio',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './estudio.component.html',
  styleUrl: './estudio.component.scss',
})
export class EstudioComponent {
  pistas = PISTAS_LOFI;
  pinturas = PINTURAS;

  constructor(public pomodoro: PomodoroService) {}
}
