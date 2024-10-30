import { TestBed } from '@angular/core/testing';

import { EmployeeEventService } from './employee-event.service';

describe('EmployeeEventService', () => {
  let service: EmployeeEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
