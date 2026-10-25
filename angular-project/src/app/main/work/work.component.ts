import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { options } from '../constant';
import { ContentService } from '../../../services/contentService';
import { PROJECTS, PROJECTS_HEADING, pickLang } from '../profile-data';

@Component({
    selector: 'app-work',
    imports: [
        CommonModule,
        CarouselModule,
    ],
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  private lang = toSignal(inject(ContentService).currentLang$, { initialValue: 'en' });
  public customOptions: OwlOptions = options;
  public items = computed(() => PROJECTS[pickLang(this.lang())]);
  public heading = computed(() => PROJECTS_HEADING[pickLang(this.lang())]);
  public codeLabel = computed(() => pickLang(this.lang()) === 'es' ? 'Ver código' : 'View code');
}
