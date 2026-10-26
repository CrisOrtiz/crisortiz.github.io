import { Component, AfterViewInit, DestroyRef, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './admin/admin.component';

@Component({
  selector: 'app-root',
  imports: [
    MainComponent,
    HeaderComponent,
    AdminComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  public readonly fixedHeader = signal(false);
  public readonly activeSection = signal('home');
  // The content editor lives at /?admin so it works on GitHub Pages without routing
  public readonly isAdmin = new URLSearchParams(window.location.search).has('admin');

  private translate = inject(TranslateService);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);

  constructor() {
    const saved = localStorage.getItem('lang');
    const initial = saved || this.translate.getFallbackLang() || 'en';
    this.translate.use(initial);
    this.document.documentElement.lang = initial;

    this.translate.onLangChange.pipe(takeUntilDestroyed()).subscribe(e => {
      localStorage.setItem('lang', e.lang);
      this.document.documentElement.lang = e.lang;
    });

    fromEvent(window, 'scroll')
      .pipe(throttleTime(30), takeUntilDestroyed())
      .subscribe(() => this.onScroll());
  }

  ngAfterViewInit() {
    this.hideLoader();
    const sectionIds = ['home', 'about', 'project', 'services', 'experience', 'contact'];
    const options = {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: [0.25, 0.5, 0.75, 1.0]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a,b) => (b.intersectionRatio - a.intersectionRatio));

      if (visible.length > 0) {
        this.activeSection.set(visible[0].target.id);
      }
    }, options);

    sectionIds.forEach(id => {
      const section = this.document.getElementById(id);
      if (section) {
        sectionObserver.observe(section);
      }
    });
    this.destroyRef.onDestroy(() => sectionObserver.disconnect());
  }

  // Keeps the bouncing logo up for a short minimum so it does not just flash
  private hideLoader(minVisibleMs = 900) {
    const loader = this.document.getElementById('app-loader');
    if (!loader) {
      this.document.documentElement.classList.add('app-ready');
      return;
    }
    const wait = Math.max(0, minVisibleMs - performance.now());
    setTimeout(() => {
      loader.classList.add('loader-hide');
      this.document.documentElement.classList.add('app-ready');
      setTimeout(() => loader.remove(), 600);
    }, wait);
  }

  onScroll() {
    const scrollPos = window.scrollY || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
    this.fixedHeader.set(scrollPos >= 100);
  }
}
