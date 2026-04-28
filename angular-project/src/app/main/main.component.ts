import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RouterOutlet } from '@angular/router';
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
        CommonModule,
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
  currentYear: number = new Date().getFullYear();
}