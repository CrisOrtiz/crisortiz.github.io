import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { options } from '../constant';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContentService } from '../../../services/contentService';
import { EDUCATION, EDUCATION_HEADING, pickLang } from '../profile-data';

@Component({
    selector: 'app-services',
    imports: [
        CommonModule,
        CarouselModule,
        RevealDirective
    ],
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.scss']
})
export class ServicesComponent {
  private lang = toSignal(inject(ContentService).currentLang$, { initialValue: 'en' });
  public customOptions: OwlOptions = options;
  public items = computed(() => EDUCATION[pickLang(this.lang())]);
  public heading = computed(() => EDUCATION_HEADING[pickLang(this.lang())]);
}
