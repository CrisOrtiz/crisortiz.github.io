import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; 
import { options } from '../constant';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-work',
    imports: [
        CommonModule,
        CarouselModule,
        TranslateModule
    ],
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  public customOptions: OwlOptions = options;
}
