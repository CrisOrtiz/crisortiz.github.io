import { Subject, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { HeaderComponent } from './header.component';
import { ContentService } from '../../services/contentService';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  const onLangChange$ = new Subject<{ lang: string }>();

  const translateServiceMock = {
    currentLang: 'en',
    addLangs: jest.fn(),
    setDefaultLang: jest.fn(),
    getDefaultLang: jest.fn(() => 'en'),
    use: jest.fn(),
    onLangChange: onLangChange$.asObservable(),
  } as unknown as TranslateService;

  const contentServiceMock = {
    setLanguage: jest.fn(),
    watchContent: jest.fn(() => of({ home: 'Home' })),
  } as unknown as ContentService;

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    component = new HeaderComponent(translateServiceMock, contentServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize language on ngOnInit and request content on ngAfterViewInit', () => {
    jest.useFakeTimers();
    const initContentSpy = jest.spyOn(component as any, 'initContent').mockImplementation(() => {});

    localStorage.setItem('lang', 'es');
    component.ngOnInit();
    component.ngAfterViewInit();
    jest.runOnlyPendingTimers();

    expect(component.currentLang).toBe('es');
    expect((translateServiceMock.use as jest.Mock)).toHaveBeenCalledWith('es');
    expect(initContentSpy).toHaveBeenCalledWith('header_section');

    jest.useRealTimers();
  });

  it('should toggle language and persist it', () => {
    component.currentLang = 'en';

    component.toggleLanguage();

    expect(component.currentLang).toBe('es');
    expect(localStorage.getItem('lang')).toBe('es');
    expect((translateServiceMock.use as jest.Mock)).toHaveBeenCalledWith('es');
    expect((contentServiceMock.setLanguage as jest.Mock)).toHaveBeenCalledWith('es');
  });

  it('should toggle sidebar when toggleMenu is called', () => {
    expect(component.sidebarOpen).toBe(false);

    component.toggleMenu();
    expect(component.sidebarOpen).toBe(true);

    component.toggleMenu();
    expect(component.sidebarOpen).toBe(false);
  });

  it('should close sidebar on outside click', () => {
    component.sidebarOpen = true;

    component.onClickedOutside(new Event('click'));

    expect(component.sidebarOpen).toBe(false);
  });
});
