import { Directive, ElementRef, Input, OnChanges, OnDestroy, inject } from '@angular/core';

/**
 * Counts the element's text from 0 up to `appCountUp` the first time it scrolls into view.
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true
})
export class CountUpDirective implements OnChanges, OnDestroy {
  @Input('appCountUp') target = 0;
  @Input() countUpDuration = 1200;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;
  private frame?: number;
  private started = false;

  ngOnChanges(): void {
    const node = this.el.nativeElement;
    if (this.started || typeof IntersectionObserver === 'undefined'
        || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      node.textContent = String(this.target);
      return;
    }
    node.textContent = '0';
    this.observer?.disconnect();
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        this.observer?.disconnect();
        this.run();
      }
    }, { threshold: 0.5 });
    this.observer.observe(node);
  }

  private run(): void {
    this.started = true;
    const node = this.el.nativeElement;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / this.countUpDuration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = String(Math.round(this.target * eased));
      if (t < 1) {
        this.frame = requestAnimationFrame(step);
      }
    };
    this.frame = requestAnimationFrame(step);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.frame) {
      cancelAnimationFrame(this.frame);
    }
  }
}
