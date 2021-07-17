import { TestBed } from '@angular/core/testing';

import { TimetChangeCostoService } from './timet-change-costo.service';

describe('TimetChangeCostoService', () => {
  let service: TimetChangeCostoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimetChangeCostoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
