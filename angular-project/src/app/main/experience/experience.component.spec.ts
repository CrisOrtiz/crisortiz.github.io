import { BehaviorSubject } from 'rxjs';
import { describe, expect, it } from '@jest/globals';
import { TestBed } from '@angular/core/testing';

import { ExperienceComponent } from './experience.component';
import { ContentService } from '../../../services/contentService';
import { EXPERIENCE } from '../profile-data';

describe('ExperienceComponent', () => {
  const setup = (lang = 'en') => {
    TestBed.resetTestingModule();
    const lang$ = new BehaviorSubject<string>(lang);
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: { currentLang$: lang$.asObservable() } }]
    });
    const component = TestBed.runInInjectionContext(() => new ExperienceComponent());
    return { component, lang$ };
  };

  it('should show the first jobs and expand to all of them', () => {
    const { component } = setup();

    expect(component.visibleItems().length).toBe(component.initialCount);
    component.showAll.set(true);
    expect(component.visibleItems().length).toBe(EXPERIENCE.en.length);
  });

  it('should open the first job and toggle details', () => {
    const { component } = setup();

    expect(component.openIndex()).toBe(0);
    component.toggle(2);
    expect(component.openIndex()).toBe(2);
    component.toggle(2);
    expect(component.openIndex()).toBeNull();
  });

  it('should switch content with the language', () => {
    const { component, lang$ } = setup();

    lang$.next('es');
    expect(component.items()).toBe(EXPERIENCE.es);
    expect(component.labels().more).toBe('Ver toda la experiencia');
  });
});
