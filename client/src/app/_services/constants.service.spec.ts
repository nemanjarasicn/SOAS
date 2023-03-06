import { TestBed } from '@angular/core/testing';

import { ConstantsService } from './constants.service';
import {RouterTestingModule} from "@angular/router/testing";

describe('ConstantsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    // declarations: []
    providers: [ConstantsService]
  }));

  it('should be created', () => {
    const service: ConstantsService = TestBed.get(ConstantsService);
    expect(service).toBeTruthy();
  });
});
