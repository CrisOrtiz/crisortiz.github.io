import { Component, computed, inject } from '@angular/core';
import { ContentService } from '../../services/contentService';
import { FOOTER, pickLang } from './profile-data';
import { ContactComponent } from './contact/contact.component';
import { ExperienceComponent } from './experience/experience.component';
import { ServicesComponent } from './services/services.component';
import { WorkComponent } from './work/work.component';
import { AboutComponent } from './about/about.component';
import { BrandsComponent } from './brands/brands.component';
import { HomeComponent } from './home/home.component';

@Component({
    selector: 'app-main',
    imports: [
        HomeComponent,
        ContactComponent,
        ExperienceComponent,
        ServicesComponent,
        WorkComponent,
        AboutComponent,
        BrandsComponent
    ],
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent {
  private lang = inject(ContentService).lang;
  currentYear: number = new Date().getFullYear();
  footerText = computed(() => FOOTER[pickLang(this.lang())]);
}