import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { RevealDirective } from '../../shared/reveal.directive';
import { ContentService } from '../../../services/contentService';
import { EXPERIENCE, EXPERIENCE_HEADING, pickLang } from '../profile-data';

const LABELS = {
  en: { more: 'Show all experience', less: 'Show less' },
  es: { more: 'Ver toda la experiencia', less: 'Ver menos' }
};

@Component({
    selector: 'app-experience',
    imports: [
        CommonModule,
        RevealDirective
    ],
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  public readonly initialCount = 4;
  private lang = toSignal(inject(ContentService).currentLang$, { initialValue: 'en' });
  public items = computed(() => EXPERIENCE[pickLang(this.lang())]);
  public heading = computed(() => EXPERIENCE_HEADING[pickLang(this.lang())]);
  public labels = computed(() => LABELS[pickLang(this.lang())]);

  public showAll = signal(false);
  public openIndex = signal<number | null>(0);
  public visibleItems = computed(() =>
    this.showAll() ? this.items() : this.items().slice(0, this.initialCount)
  );

  toggle(index: number): void {
    this.openIndex.set(this.openIndex() === index ? null : index);
  }
}
