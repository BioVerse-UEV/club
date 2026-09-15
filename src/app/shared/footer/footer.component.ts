import { Component } from '@angular/core';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { REDES_SOCIALES } from '../../core/data/redes.data';
import { SITE_CONFIG } from '../../core/data/site-config.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  redes = REDES_SOCIALES;
  nombreClub = SITE_CONFIG.nombreClub;
  anio = new Date().getFullYear();
}
