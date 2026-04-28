import { Inject, NgModule, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './main/home/home.component';
import { AboutComponent } from './main/about/about.component';
import { ExperienceComponent } from './main/experience/experience.component';
import { ServicesComponent } from './main/services/services.component';
import { WorkComponent } from './main/work/work.component';
import { TestimonialsComponent } from './main/testimonials/testimonials.component';
import { ContactComponent } from './main/contact/contact.component';
import {NgClickOutsideDirective} from 'ng-click-outside2';

import { BrandsComponent } from './main/brands/brands.component';
// === NEW FIREBASE IMPORTS START ===
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth'; // For Authentication
import { provideStorage, getStorage } from '@angular/fire/storage'; // For Cloud Storage
import { environment } from '../assets/environments/environment';
// === NEW FIREBASE IMPORTS END ===
// ... other imports ...
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // <-- Import HttpClientModule and HttpClient

// <-- ngx-translate imports
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
// -->

@NgModule({ declarations: [
    ],
    bootstrap: [], imports: [BrowserModule,
        RouterModule,
        BrowserAnimationsModule,
        CarouselModule,
        NgClickOutsideDirective,
        TranslateModule.forRoot({
            defaultLanguage: 'en'
        })
    ], providers: [
        // === NEW FIREBASE IMPORTS START ===
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAuth(() => getAuth()), // Add this line for Authentication
        provideStorage(() => getStorage()),
        // === NEW FIREBASE IMPORTS END ===
        // configure the http loader here (prefix/suffix optional)
        ...provideTranslateHttpLoader({
            prefix: '/assets/i18n/',
            enforceLoading: false,
            useHttpBackend: false
        }),
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
