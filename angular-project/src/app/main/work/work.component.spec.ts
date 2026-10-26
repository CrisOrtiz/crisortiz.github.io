import { signal } from '@angular/core';
import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';

import { WorkComponent } from './work.component';
import { ContentService } from '../../../services/contentService';
import { PROJECTS } from '../profile-data';

describe('WorkComponent', () => {
  const setup = (lang = 'en') => {
    TestBed.resetTestingModule();
    const currentLang = signal(lang);
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: { lang: currentLang.asReadonly() } }]
    });
    const component = TestBed.runInInjectionContext(() => new WorkComponent());
    return { component, currentLang };
  };

  const button = (left: number, bottom: number) =>
    ({ getBoundingClientRect: () => ({ left, bottom }) }) as HTMLElement;

  const toggle = (newState: string) => {
    const popover = document.createElement('div');
    return { popover, event: { newState, target: popover } as unknown as Event };
  };

  it('should have projects with more technologies than the visible tags', () => {
    const { component } = setup();

    expect(PROJECTS.en.some(p => p.stack.length > component.maxTags)).toBe(true);
  });

  it('should place the popover below its button', () => {
    const { component } = setup();
    const { popover, event } = toggle('open');

    component.placePopover(event, button(40, 300));

    expect(popover.style.top).toBe(`${300 + window.scrollY + 8}px`);
    expect(popover.style.left).toBe(`${40 + window.scrollX}px`);
  });

  it('should keep the popover inside the viewport', () => {
    const { component } = setup();
    const { popover, event } = toggle('open');

    component.placePopover(event, button(window.innerWidth - 20, 100));

    expect(parseFloat(popover.style.left)).toBeLessThanOrEqual(window.innerWidth - 240 - 16 + window.scrollX);
  });

  it('should leave the popover alone when it closes', () => {
    const { component } = setup();
    const { popover, event } = toggle('closed');

    component.placePopover(event, button(40, 300));

    expect(popover.style.top).toBe('');
  });

  it('should switch labels with the language', () => {
    const { component, currentLang } = setup();

    currentLang.set('es');
    expect(component.labels().more).toBe('Más tecnologías');
  });
});
