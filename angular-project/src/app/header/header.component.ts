import { Component, computed, inject, input, signal } from '@angular/core';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { ContentService } from '../../services/contentService';

const SECTION_NAME = 'nav';

@Component({
  selector: 'app-header',
  imports: [NgClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  readonly activeSection = input('home');

  private contentService = inject(ContentService);
  readonly content = this.contentService.contentSignal(SECTION_NAME);

  readonly availableLangs = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ];
  readonly sidebarOpen = signal(false);
  // Updated right away so the flag flips on click, while the page texts swap after the fade
  readonly currentLang = signal(this.contentService.lang());

  readonly otherLang = computed(() => {
    const codes = this.availableLangs.map(l => l.code);
    const idx = codes.indexOf(this.currentLang());
    return codes[(idx + 1) % codes.length];
  });

  toggleLanguage(): void {
    const next = this.otherLang();
    this.currentLang.set(next);
    // ContentService fades the page and switches ngx-translate and Firestore texts together
    this.contentService.setLanguage(next);
  }

  closeMenu(): void {
    this.sidebarOpen.set(false);
  }

  toggleMenu(): void {
    this.sidebarOpen.update(open => !open);
  }
}
