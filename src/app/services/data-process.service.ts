import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataProcessService {
  readonly DIVISOR = 100;
  readonly LOCALE = 'en-US';
  readonly CURRENCY = 'USD';
  readonly SYMBOL = '1.0-0';

  constructor() { }

  public toPercentage(rate: number) {
    return rate / this.DIVISOR;
  }

  public currencyInputChanged(data: any) {
    var number = data.replace(/[$,]/g, '');
    return Number(number);
  }
}
