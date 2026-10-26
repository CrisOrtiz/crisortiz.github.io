import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';

/**
 * Fades and slides an element in the first time it scrolls into view.
 * Styles live in assets/scss/_portfolio.scss (.reveal / .is-visible).
 */
@Directive({
  selector: '[appReveal]'
})
export class RevealDirective implements OnInit, OnDestroy {
  readonly revealDelay = input(0);

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    node.classList.add('reveal');
    if (this.revealDelay()) {
      node.style.transitionDelay = `${this.revealDelay()}ms`;
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
