import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CountUpDirective } from './count-up.directive';

@Component({
  imports: [CountUpDirective],
  template: '<span [appCountUp]="value"></span>'
})
class HostComponent {
  value = 6;
}

describe('CountUpDirective', () => {
  beforeEach(() => TestBed.resetTestingModule());

  it('shows the target right away when IntersectionObserver is missing', () => {
    const original = (window as any).IntersectionObserver;
    delete (window as any).IntersectionObserver;
    try {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('span').textContent).toBe('6');
    } finally {
      (window as any).IntersectionObserver = original;
    }
  });

  it('starts at 0 and waits until the number scrolls into view', () => {
    let callback: IntersectionObserverCallback | undefined;
    const original = (window as any).IntersectionObserver;
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) { callback = cb; }
      observe() {}
      disconnect() {}
    };
    try {
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('span').textContent).toBe('0');
      expect(callback).toBeDefined();
    } finally {
      (window as any).IntersectionObserver = original;
    }
  });
});
