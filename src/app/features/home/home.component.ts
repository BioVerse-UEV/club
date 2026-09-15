import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { Logo3dComponent } from '../../shared/logo-3d/logo-3d.component';
import { HOME_DATA } from '../../core/data/home.data';
import { EVENTOS } from '../../core/data/eventos.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslatePipe, Logo3dComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  homeData = HOME_DATA;
  ultimosEventos = EVENTOS.filter((evento) => HOME_DATA.ultimosEventosIds.includes(evento.id));
}
