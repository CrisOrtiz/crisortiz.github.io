import { Component, computed, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { options } from '../constant';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContentService } from '../../../services/contentService';
import { EDUCATION, EDUCATION_HEADING, pickLang } from '../profile-data';

@Component({
    selector: 'app-services',
    imports: [
        CarouselModule,
        RevealDirective
    ],
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  private lang = inject(ContentService).lang;
  public customOptions: OwlOptions = options;
  public items = computed(() => EDUCATION[pickLang(this.lang())]);
  public heading = computed(() => EDUCATION_HEADING[pickLang(this.lang())]);
}
