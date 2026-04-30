import { of } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { AboutComponent } from './about.component';
import { ContentService } from '../../../services/contentService';

describe('AboutComponent', () => {
  let component: AboutComponent;

  const contentServiceMock = {
    watchContent: jest.fn(() => of({ title: 'About' })),
  } as unknown as ContentService;

  beforeEach(() => {
    jest.clearAllMocks();
    component = new AboutComponent(contentServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize content on ngOnInit after timer', () => {
    jest.useFakeTimers();
    const initContentSpy = jest.spyOn(component as any, 'initContent').mockImplementation(() => {});

    component.ngOnInit();
    jest.runOnlyPendingTimers();

    expect(initContentSpy).toHaveBeenCalledWith('aboutme_section');

    jest.useRealTimers();
  });

  it('should compute xpYears based on current year', () => {
    const expected = new Date().getFullYear() - 2020;
    expect(component.xpYears).toBe(expected);
  });
});
