import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../service/translation.service';

@Pipe({
  name: 'traducir',
  standalone: true,
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(clave: string): string {
    return this.translationService.traducir(clave);
  }
}
