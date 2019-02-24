import { TestBed } from '@angular/core/testing';

import { KitsuService } from './kitsu.service';

describe('KitsuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KitsuService = TestBed.get(KitsuService);
    expect(service).toBeTruthy();
  });
});
