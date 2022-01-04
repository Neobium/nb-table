import { TestBed } from '@angular/core/testing';

import { NbTableService } from './nb-table.service';

describe('NbTableService', () => {
  let service: NbTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NbTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
