import { Component, DestroyRef, ElementRef, afterRenderEffect, computed, inject, viewChild } from '@angular/core';
import Typed from 'typed.js';
import { typeoptions } from '../constant';
import { fillTemplate } from '../../content-schema';
import { ContentService } from '../../../services/contentService';

const SECTION_NAME = 'home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  readonly xpYears: number = new Date().getFullYear() - 2020;
  readonly content = inject(ContentService).contentSignal(SECTION_NAME);
  readonly roles = computed<string[]>(
    () => this.content()?.roles?.length ? this.content().roles : typeoptions.strings,
    { equal: (a, b) => a.join('\n') === b.join('\n') }
  );
  // The typed text sits over an invisible copy of the longest role, so the
  // hero keeps its height while the words are typed and deleted.
  readonly longestRole = computed(() => this.roles().reduce((a, b) => (b.length > a.length ? b : a), ''));

  private typedTarget = viewChild.required<ElementRef<HTMLElement>>('typed');
  private typedInstance?: Typed;

  constructor() {
    // Restarts the typing animation once the roles are rendered, and again if they change
    afterRenderEffect(() => {
      const strings = this.roles();
      this.destroyTyped();
      this.typedInstance = new Typed(this.typedTarget().nativeElement, { ...typeoptions, strings });
    });
    inject(DestroyRef).onDestroy(() => this.destroyTyped());
  }

  fill(text: string | undefined): string {
    return fillTemplate(text, { years: this.xpYears });
  }

  private destroyTyped(): void {
    try { this.typedInstance?.destroy(); } catch {}
    this.typedInstance = undefined;
  }
}
