import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common'; 
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o'; 
import { options2 } from '../constant';

@Component({
    selector: 'app-brands',
    imports: [
        CommonModule,
        NgOptimizedImage,
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
        src: "assets/img/logoumsa.png",
        alt: "logo-umsa",
        title: "logo-umsa",
      },
      {
        id : 2,
        src: "assets/img/logocba.png",
        alt: "logo-cba",
        title: "logo-cba",
      },
      {
        id : 3,
        src: "assets/img/logofunda.jpg",
        alt: "logo-funda",
        title: "logo-funda",
      },
      {
        id : 4,
        src: "assets/img/logojalasoft.png",
        alt: "logo-jalasoft",
        title: "logo-jalasoft",
      },
      {
        id : 5,
        src: "assets/img/logosoe.png",
        alt: "logo-soe",
        title: "logo-soe",
      }
    ];
  }
}