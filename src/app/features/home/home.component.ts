import { Component } from '@angular/core';
import { Logo3dComponent } from '../../shared/logo-3d/logo-3d.component';
import { SITE_CONFIG } from '../../core/data/site-config.data';
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Logo3dComponent, UpperCasePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  siteConfig = SITE_CONFIG;
}
