import { of, Subscription } from 'rxjs';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

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
  let component: HomeComponent;

  const watchContentMock = jest.fn((section: string) =>
    of({
      salute: 'Hello',
      iam: 'I am a',
      typedStrings: ['Developer'],
    })
  );

  const contentServiceMock = {
    watchContent: watchContentMock,
  } as unknown as ContentService;

  beforeEach(() => {
    jest.clearAllMocks();
    component = new HomeComponent(contentServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize homeContent$ on ngOnInit', (done) => {
    component.ngOnInit();

    expect(watchContentMock).toHaveBeenCalledWith('home_section');

    component.homeContent$.subscribe((value) => {
      expect(value.salute).toBe('Hello');
      done();
    });
  });

  it('should initialize Typed in ngAfterViewInit when target exists', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    const target = document.createElement('span');
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(target);

    component.ngAfterViewInit();
    jest.runAllTimers();

    expect(Typed).toHaveBeenCalled();
    expect(querySpy).toHaveBeenCalledWith('.typed-element');

    querySpy.mockRestore();
    jest.useRealTimers();
  });

  it('should not initialize Typed when target is missing', () => {
    jest.useFakeTimers();
    component.ngOnInit();
    const querySpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);

    component.ngAfterViewInit();
    jest.runAllTimers();

    expect(Typed).not.toHaveBeenCalled();

    querySpy.mockRestore();
    jest.useRealTimers();
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribe = jest.fn();
    (component as any).typedSub = {
      closed: false,
      unsubscribe,
    } as unknown as Subscription;

    component.ngOnDestroy();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
