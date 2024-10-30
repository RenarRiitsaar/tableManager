import { TestBed } from '@angular/core/testing';

import { VacationAnimationService } from './vacation-animation.service';

describe('VacationAnimationService', () => {
  let service: VacationAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacationAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
