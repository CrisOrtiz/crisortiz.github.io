import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';

import Typed from 'typed.js';
import { HomeComponent } from './home.component';
import { ContentService } from '../../../services/contentService';

jest.mock('typed.js', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
  })),
}));

describe('HomeComponent', () => {
  const content = signal<any>(undefined);
  const contentServiceMock = {
    contentSignal: jest.fn((section: string) => content.asReadonly()),
  };

  const render = async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    await fixture.whenStable();
    return fixture;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    content.set({ greeting: 'Hello', headline: 'I am a', roles: ['Developer', 'Mentor'] });
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: contentServiceMock }]
    });
  });

  it('should render the home section content', async () => {
    const fixture = await render();

    expect(contentServiceMock.contentSignal).toHaveBeenCalledWith('home');
    expect(fixture.nativeElement.querySelector('.hero-greeting').textContent).toBe('Hello');
  });

  it('should type the roles into the typed element', async () => {
    const fixture = await render();

    const target = fixture.nativeElement.querySelector('.typed-element');
    expect(Typed).toHaveBeenCalledWith(target, expect.objectContaining({ strings: ['Developer', 'Mentor'] }));
    expect(fixture.componentInstance.longestRole()).toBe('Developer');
  });

  it('should restart typing only when the roles change', async () => {
    const fixture = await render();
    const typed = jest.mocked(Typed);
    expect(typed).toHaveBeenCalledTimes(1);

    content.set({ greeting: 'Hi', roles: ['Developer', 'Mentor'] });
    await fixture.whenStable();
    expect(typed).toHaveBeenCalledTimes(1);

    content.set({ greeting: 'Hi', roles: ['Architect'] });
    await fixture.whenStable();
    expect(typed).toHaveBeenCalledTimes(2);
    expect((typed.mock.results[0].value as any).destroy).toHaveBeenCalled();
  });

  it('should fall back to the default role while content is loading', async () => {
    content.set(undefined);
    const fixture = await render();

    expect(fixture.componentInstance.roles()).toEqual(['Software Developer']);
  });
});
