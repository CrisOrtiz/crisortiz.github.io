import { beforeEach, describe, expect, it } from '@jest/globals';

import { BrandsComponent } from './brands.component';
import { options2 } from '../constant';

describe('BrandsComponent', () => {
  let component: BrandsComponent;

  beforeEach(() => {
    component = new BrandsComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use carousel options from constants', () => {
    expect(component.customOptions2).toBe(options2);
  });

  it('should list the brand slides', () => {
    expect(component.slidesStore).toBeDefined();
    expect(component.slidesStore.length).toBe(5);
    expect(component.slidesStore[0].src).toBe('assets/img/brands/logoumsa.webp');
    expect(component.slidesStore[4].src).toBe('assets/img/brands/logosoe.webp');
  });

  it('should give wide and tall logos the same visible area', () => {
    const fit = (naturalWidth: number, naturalHeight: number) => {
      const slide = component.slidesStore[0];
      component.fitLogo(slide, { target: { naturalWidth, naturalHeight } } as any);
      return component.sizes()[slide.src]!;
    };

    const square = fit(180, 180);
    const tall = fit(87, 180);
    expect(square.width).toBe(square.height);
    expect(Math.abs(square.width * square.height - tall.width * tall.height)).toBeLessThan(250);

    const wide = fit(320, 68);
    expect(wide.width).toBeLessThanOrEqual(170);
    expect(wide.height).toBe(Math.round(wide.width * 68 / 320));
  });
});
