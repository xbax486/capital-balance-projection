import { Injectable } from '@angular/core';

const DIVISOR = 100;
const LOCALE = 'en-US';
const CURRENCY = 'USD';

@Injectable({
  providedIn: 'root'
})
export class DataProcessService {
  constructor() { }

  public toPercentage(rate: number) {
    return rate / DIVISOR;
  }

  public formatCurrency(data: number) {
    return new Intl.NumberFormat(LOCALE, {style: 'currency', currency: CURRENCY, maximumFractionDigits: 0}).format(data);
  }
}
