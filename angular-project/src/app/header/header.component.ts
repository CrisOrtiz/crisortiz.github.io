import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core'; 
import { Subscription } from 'rxjs';
import { ContentService } from '../../services/contentService';
import { BaseContentComponent } from '../base-content.component';
import { NgClickOutsideModule } from 'ng-click-outside2'; 

const SECTION_NAME = 'header_section';

@Component({
    selector: 'app-header',
    imports: [
        CommonModule,
        TranslateModule,
        NgClickOutsideModule
    ],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseContentComponent implements OnInit, OnDestroy {
  @Input() activeSection: string = 'home';
  public sidebarOpen: boolean = false;
  public currentSection = 'home';
  private langSub: Subscription = Subscription.EMPTY;

  public availableLangs = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' }
  ];
  public currentLang = 'en';
  
  constructor(
    private translate: TranslateService,
    contentService: ContentService
  ) {
    super(contentService);
    // register langs and default
    this.translate.addLangs(this.availableLangs.map(l => l.code));
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('lang');
    const initial = saved || this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    this.currentLang = initial;
    this.translate.use(initial);

    // subscribe once, init Typed on every new content
    this.initContent(SECTION_NAME);
  }

  get otherLang(): string {
    const codes = this.availableLangs.map(l => l.code);
    const idx = codes.indexOf(this.currentLang);
    return codes[(idx + 1) % codes.length];
  }

  toggleLanguage(): void {
    const next = this.otherLang;
    this.currentLang = next;
    // update TranslateService and persist
    this.translate.use(next);
    localStorage.setItem('lang', next);
    // centralize language change
    this.contentService.setLanguage(next);
  }


  fullPageScroll(i:any) {
    if(this.sidebarOpen)
      this.sidebarOpen = false;
  }

  toggleMenu(){
    this.sidebarOpen = !this.sidebarOpen;
  }

  onClickedOutside(e: Event) {
    if(this.sidebarOpen)
      this.sidebarOpen = false;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.langSub && !this.langSub.closed) {
      this.langSub.unsubscribe();
    }
  }
}
