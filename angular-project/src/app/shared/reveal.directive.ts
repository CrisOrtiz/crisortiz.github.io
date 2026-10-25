import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

export type RevealVariant = '' | 'up' | 'left' | 'right' | 'zoom';

/**
 * Fades and slides an element in the first time it scrolls into view.
 * `appReveal="left"` picks the direction (up by default).
 * Styles live in assets/scss/_portfolio.scss (.reveal / .is-visible).
 */
@Directive({
  selector: '[appReveal]',
  standalone: true
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') variant: RevealVariant = '';
  @Input() revealDelay = 0;

  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal', `reveal-${this.variant || 'up'}`);
    if (this.revealDelay) {
      node.style.transitionDelay = `${this.revealDelay}ms`;
    }

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-visible');
      return;
    }

    this.observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        node.classList.add('is-visible');
        this.observer?.disconnect();
      }
    }, { threshold: 0.15 });
    this.observer.observe(node);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
