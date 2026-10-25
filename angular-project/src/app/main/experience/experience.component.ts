import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ContentService } from '../../../services/contentService';
import { EXPERIENCE, EXPERIENCE_HEADING, pickLang } from '../profile-data';

@Component({
    selector: 'app-experience',
    imports: [
        CommonModule,
    ],
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  private lang = toSignal(inject(ContentService).currentLang$, { initialValue: 'en' });
  public items = computed(() => EXPERIENCE[pickLang(this.lang())]);
  public heading = computed(() => EXPERIENCE_HEADING[pickLang(this.lang())]);
}
