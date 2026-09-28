import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-logo-3d',
  standalone: true,
  templateUrl: './logo-3d.component.html',
  styleUrl: './logo-3d.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Logo3dComponent {
  rutaModelo = 'models/logo.glb';
}
