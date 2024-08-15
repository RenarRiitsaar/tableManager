import { TestBed } from '@angular/core/testing';

import { PdfsettingsService } from './pdfsettings.service';

describe('PdfsettingsService', () => {
  let service: PdfsettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfsettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
