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

  it('should initialize slides on ngOnInit', () => {
    component.ngOnInit();

    expect(component.slidesStore).toBeDefined();
    expect(component.slidesStore.length).toBe(5);
    expect(component.slidesStore[0].src).toBe('assets/img/brands/logoumsa.png');
    expect(component.slidesStore[4].src).toBe('assets/img/brands/logosoe.png');
  });
});
