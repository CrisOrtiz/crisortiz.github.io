import { ApplicationConfig, importProvidersFrom, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Recomendado en v20 para mejor LCP

// Firebase (v20)
import { FirebaseApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../assets/environments/environment';

// Traducciones
import { TranslateModule } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), 

    provideAnimationsAsync(),

    // 3. Configuración Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore(inject(FirebaseApp))),
    // Kept for the planned admin login to edit content.
    provideAuth(() => getAuth(inject(FirebaseApp))),

    // 4. Módulos heredados
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en'
      })
    )
  ]
};