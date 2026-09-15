import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/service/translation.service';
import { NAVEGACION } from '../../core/data/navegacion.data';
import { SITE_CONFIG } from '../../core/data/site-config.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  navegacion = NAVEGACION;
  nombreClub = SITE_CONFIG.nombreClub;

  constructor(public translationService: TranslationService) {}
}
