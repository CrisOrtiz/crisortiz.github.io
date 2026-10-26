import { Component, computed, inject } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { options } from '../constant';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContentService } from '../../../services/contentService';
import { PROJECTS, PROJECTS_HEADING, pickLang } from '../profile-data';

/** Width the "+N" popover is laid out with (see .pf-popover in _portfolio.scss). */
const POPOVER_WIDTH = 240;
const POPOVER_GAP = 8;
const VIEWPORT_PADDING = 16;

@Component({
    selector: 'app-work',
    imports: [
        CarouselModule,
        RevealDirective
    ],
    templateUrl: './work.component.html',
    styleUrls: ['./work.component.scss']
})
export class WorkComponent {
  private lang = inject(ContentService).lang;
  public customOptions: OwlOptions = options;
  public readonly maxTags = 4;
  public readonly accents = ['#0788FF', '#7C5CFF', '#00B894', '#FF8A3D', '#E84393', '#00B4D8'];
  public items = computed(() => PROJECTS[pickLang(this.lang())]);
  public heading = computed(() => PROJECTS_HEADING[pickLang(this.lang())]);
  public codeLabel = computed(() => pickLang(this.lang()) === 'es' ? 'Ver código' : 'View code');
  public labels = computed(() => pickLang(this.lang()) === 'es'
    ? { more: 'Más tecnologías' }
    : { more: 'More technologies' });

  /** Opens the hidden-technologies popover just below its "+N" button, kept inside the viewport. */
  placePopover(event: Event, button: HTMLElement): void {
    if ((event as ToggleEvent).newState !== 'open') {
      return;
    }
    const popover = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    const maxLeft = window.innerWidth - POPOVER_WIDTH - VIEWPORT_PADDING;
    const left = Math.max(VIEWPORT_PADDING, Math.min(rect.left, maxLeft));
    popover.style.top = `${rect.bottom + window.scrollY + POPOVER_GAP}px`;
    popover.style.left = `${left + window.scrollX}px`;
  }
}
