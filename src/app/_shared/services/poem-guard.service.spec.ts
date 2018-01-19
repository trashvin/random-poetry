import { TestBed, inject } from '@angular/core/testing';

import { PoemGuardService } from './poem-guard.service';

describe('PoemGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoemGuardService]
    });
  });

  it('should be created', inject([PoemGuardService], (service: PoemGuardService) => {
    expect(service).toBeTruthy();
  }));
});
