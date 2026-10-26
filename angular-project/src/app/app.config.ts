import { ApplicationConfig } from '@angular/core';
import { provideTranslateService } from '@ngx-translate/core';

// Angular 22 is zoneless by default. Firebase is provided on demand by the tokens in firebase.ts.
export const appConfig: ApplicationConfig = {
  providers: [
    provideTranslateService({
      fallbackLang: 'en'
    })
  ]
};
