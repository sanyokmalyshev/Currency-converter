import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Currency } from '../types/currencies';

@Injectable({
  providedIn: 'root'
})
export class GetDataService{
  private dropdownOptions: Currency[] = [
    {
      type: 'USD',
      img: './assets/imgs/usa.png'
    },
    {
      type: 'UAH',
      img: './assets/imgs/uah.png'
    },
    {
      type: 'EUR',
      img: './assets/imgs/eur.jpg'
    }
  ];
  changeCurrencyFrom = new EventEmitter<Currency>();
  changeCurrencyTo = new EventEmitter<Currency>();
  currencyFrom = this.dropdownOptions[0];
  currencyTo = this.dropdownOptions[1];

  constructor() { }

  getOptions() {
    return this.dropdownOptions.slice();
  }

  changeValue(value: Currency, title: string) {
    if (title === 'from') {
      this.changeCurrencyFrom.emit(value);
      return;
    }
    this.changeCurrencyTo.emit(value);
  }
}
