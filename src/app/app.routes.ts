import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'conocenos',
    loadComponent: () =>
      import('./features/conocenos/conocenos.component').then((m) => m.ConocenosComponent),
  },
  {
    path: 'eventos',
    loadComponent: () =>
      import('./features/eventos/eventos.component').then((m) => m.EventosComponent),
  },
  {
    path: 'estudio',
    loadComponent: () =>
      import('./features/estudio/estudio.component').then((m) => m.EstudioComponent),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  { path: '**', redirectTo: '' },
];
