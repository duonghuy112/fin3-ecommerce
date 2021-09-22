import { TestBed } from '@angular/core/testing';

import { ReviewProductService } from './review-product.service';

describe('ReviewProductService', () => {
  let service: ReviewProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
