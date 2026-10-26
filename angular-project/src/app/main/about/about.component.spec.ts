import { signal } from '@angular/core';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { TestBed } from '@angular/core/testing';

import { AboutComponent } from './about.component';
import { ContentService } from '../../../services/contentService';

describe('AboutComponent', () => {
  let component: AboutComponent;

  const contentServiceMock = {
    contentSignal: jest.fn((section: string) => signal({ title: 'About' })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: ContentService, useValue: contentServiceMock }]
    });
    component = TestBed.runInInjectionContext(() => new AboutComponent());
  });

  it('should read the about section content', () => {
    expect(contentServiceMock.contentSignal).toHaveBeenCalledWith('about');
    expect(component.content().title).toBe('About');
  });

  it('should compute xpYears based on current year', () => {
    const expected = new Date().getFullYear() - 2020;
    expect(component.xpYears).toBe(expected);
  });
});
