import { TestBed } from '@angular/core/testing';

import { EmployeeAnimationService } from './employee-animation.service';

describe('EmployeeAnimationService', () => {
  let service: EmployeeAnimationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAnimationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
