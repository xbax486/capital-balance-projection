import { TestBed } from '@angular/core/testing';

import { DataProcessService } from './data-process.service';

fdescribe('DataProcessService', () => {
  let service: DataProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return fractional part when toPercentage() is called with an integer', () => {
    let data = 6;
    expect(service.toPercentage(data)).toEqual(0.06);
  });

  it('should return number in currency format when currencyInputChanged() is called with an integer', () => {
    let data = 100000;
    let format = `${data}`;
    expect(service.currencyInputChanged(format)).toEqual(data);
  });
});
