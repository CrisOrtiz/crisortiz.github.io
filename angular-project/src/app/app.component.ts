import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { fromEvent, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { TranslateService, LangChangeEvent, TranslateModule } from '@ngx-translate/core'; 
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        TranslateModule,
        MainComponent,
        HeaderComponent
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  public fixedHeader: boolean = false;
  public activeSection: string = 'home';

  private windowScroll$: Subscription = Subscription.EMPTY;
  private translateSub: Subscription = Subscription.EMPTY;
  private sectionObserver?: IntersectionObserver;

  constructor(
    private translate: TranslateService,
    private cd: ChangeDetectorRef)
  {
    this.translate.setDefaultLang('en');
    const saved = localStorage.getItem('lang');
    const initial = saved || this.translate.getDefaultLang() || 'en';
    this.translate.use(initial);

    this.translateSub = this.translate.onLangChange.subscribe((e: LangChangeEvent) => {
      localStorage.setItem('lang', e.lang);
      this.cd.markForCheck();
    });
  }
  
  ngOnInit() {
    this.windowScroll$ = fromEvent(window, 'scroll')
      .pipe(throttleTime(30))
      .subscribe(() => this.onScroll());
  }

  ngAfterViewInit() {
    const sectionIds = ['home', 'about', 'project', 'services', 'experience', 'contact'];
    const options = {
      root: null,
      rootMargin: '0px 0px -40% 0px',
      threshold: [0.25, 0.5, 0.75, 1.0]
    };

    this.sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a,b) => (b.intersectionRatio - a.intersectionRatio));

      if (visible.length > 0) {
        this.activeSection = visible[0].target.id;
        this.cd.markForCheck();
      }
    }, options);

    sectionIds.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        this.sectionObserver?.observe(section);
      }
    });
  }

  // CAMBIO: Se añadió 'override' o simplemente se asegura su ejecución correcta
  ngOnDestroy() {
    this.windowScroll$.unsubscribe();
    this.translateSub.unsubscribe();
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
    }
  }
  
  onScroll() {
    // CAMBIO: Lógica de scroll más moderna compatible con todos los navegadores
    const scrollPos = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.fixedHeader = scrollPos >= 100;
  }
}