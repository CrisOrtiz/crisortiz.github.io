import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ContentService } from '../../services/contentService';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  const contentServiceMock = {
    lang: signal('en'),
    setLanguage: jest.fn(),
    contentSignal: jest.fn((section: string) => signal({ home: 'Home' })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    contentServiceMock.lang.set('en');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: contentServiceMock }]
    });
    component = TestBed.runInInjectionContext(() => new HeaderComponent());
  });

  it('should read the nav texts and start in the active language', () => {
    expect(contentServiceMock.contentSignal).toHaveBeenCalledWith('nav');
    expect(component.content().home).toBe('Home');
    expect(component.currentLang()).toBe('en');
    expect(component.otherLang()).toBe('es');
  });

  it('should flip the flag at once and let ContentService switch the texts', () => {
    component.toggleLanguage();

    expect(component.currentLang()).toBe('es');
    expect(component.otherLang()).toBe('en');
    expect(contentServiceMock.setLanguage).toHaveBeenCalledWith('es');
  });

  it('should toggle sidebar when toggleMenu is called', () => {
    expect(component.sidebarOpen()).toBe(false);

    component.toggleMenu();
    expect(component.sidebarOpen()).toBe(true);

    component.toggleMenu();
    expect(component.sidebarOpen()).toBe(false);
  });

  it('should close sidebar on outside click or menu link', () => {
    component.sidebarOpen.set(true);

    component.closeMenu();

    expect(component.sidebarOpen()).toBe(false);
  });
});
