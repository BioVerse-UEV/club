import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslationService } from './core/service/translation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(() => {
      const translationService = inject(TranslationService);
      return translationService.cargarIdioma('es');
    }),
  ],
};
