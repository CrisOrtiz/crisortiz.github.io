import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; 
import { customOptionsSingle } from '../constant';
import { TranslateModule } from '@ngx-translate/core'; 

@Component({
  selector: 'app-testimonials',
  standalone: true,         
  imports: [                 
    CommonModule,
    CarouselModule,
    TranslateModule
  ],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  public customOptionsSingle: OwlOptions = customOptionsSingle;
}