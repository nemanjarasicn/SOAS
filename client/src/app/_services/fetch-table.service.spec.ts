import { TestBed } from '@angular/core/testing';

import { FetchTableService } from './fetch-table.service';

describe('FetchTableService', () => {
  let service: FetchTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
