import { ApplicationConfig, importProvidersFrom, inject, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Recomendado en v20 para mejor LCP
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// Firebase (v20)
import { FirebaseApp, provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { environment } from '../assets/environments/environment';

// Traducciones
import { TranslateModule } from '@ngx-translate/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), 

    provideRouter([]),     
    provideAnimationsAsync(),

    provideHttpClient(withInterceptorsFromDi()),
    
    // 3. Configuración Firebase
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore(inject(FirebaseApp))),
    provideAuth(() => getAuth(inject(FirebaseApp))),
    provideStorage(() => getStorage(inject(FirebaseApp))),

    // 4. Módulos heredados
    importProvidersFrom(
      TranslateModule.forRoot({
        fallbackLang: 'en'
      })
    )
  ]
};