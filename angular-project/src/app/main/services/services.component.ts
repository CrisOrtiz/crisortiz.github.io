import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; 
import { options } from '../constant';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
    selector: 'app-services',
    imports: [
        CommonModule,
        CarouselModule,
        TranslateModule
    ],
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  public customOptions: OwlOptions = options;
}