import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; 
import { options2 } from '../constant';

// Logos have very different shapes (UMSA is tall, Jalasoft is a wide wordmark),
// so a plain contain box makes some look tiny. Each one gets the same visible
// area instead, capped to the slide box.
const LOGO_AREA = 7000;
const MAX_WIDTH = 170;
const MAX_HEIGHT = 120;

@Component({
    selector: 'app-brands',
    imports: [
        CommonModule,
        CarouselModule
    ],
    templateUrl: './brands.component.html',
    styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  public slidesStore!: any[];
  public customOptions2: OwlOptions = options2;

  ngOnInit(): void {
    this.slidesStore = [
      {
        id : 1,
        src: "assets/img/brands/logoumsa.webp",
        alt: "Universidad Mayor de San Andrés",
        title: "logo-umsa",
      },
      {
        id : 2,
        src: "assets/img/brands/logocba.webp",
        alt: "Centro Boliviano Americano",
        title: "logo-cba",
      },
      {
        id : 3,
        src: "assets/img/brands/logofunda.jpg",
        alt: "Fundación Jala",
        title: "logo-funda",
      },
      {
        id : 4,
        src: "assets/img/brands/logojalasoft.webp",
        alt: "Jalasoft",
        title: "logo-jalasoft",
      },
      {
        id : 5,
        src: "assets/img/brands/logosoe.webp",
        alt: "SOE",
        title: "logo-soe",
      }
    ];
  }

  fitLogo(slide: any, event: Event): void {
    const img = event.target as HTMLImageElement;
    const ratio = img.naturalWidth / img.naturalHeight;
    if (!ratio) return;
    const width = Math.sqrt(LOGO_AREA * ratio);
    const height = width / ratio;
    const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);
    slide.width = Math.round(width * scale);
    slide.height = Math.round(height * scale);
  }
}
