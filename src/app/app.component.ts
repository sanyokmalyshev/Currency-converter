import { Component, Injectable, OnInit } from '@angular/core';
import { GetDataService } from './shared/get-data.service';
import { Currency } from './types/currencies';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpApiService } from './shared/http-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public formInputs: FormGroup;
  public currencyData: any = {};

  public fromCurrency: Currency = this.getDataService.currencyFrom;
  public toCurrency: Currency = this.getDataService.currencyTo;
  public dropdownOptions: Currency[] = [];
  public isLoading: boolean;

  constructor(
    private getDataService: GetDataService,
    public restApi: HttpApiService,
  ) {}

  ngOnInit() {
    this.formInputs = new FormGroup({
      'valueFrom': new FormControl(1),
      'valueTo': new FormControl(null),
    });

    this.formInputs.get('valueFrom')?.valueChanges.subscribe(
      () => {
        this.getExchangeRate();
      }
    )

    this.formInputs.get('valueTo')?.valueChanges.subscribe(
      () => {
        this.getExchangeRate(false);
      }
    )

    this.dropdownOptions = this.getDataService.getOptions();

    this.getDataService.changeCurrencyFrom.subscribe(
      (currency: Currency)=> {
        this.fromCurrency = currency;
        this.getExchangeRate();
      }
    );
    this.getDataService.changeCurrencyTo.subscribe(
      (currency: Currency)=> {
        this.toCurrency = currency;
        this.getExchangeRate();
      }
    )
    this.getExchangeRate();
  }


  handleChangeCurrencies() {
    const temp = this.fromCurrency;
    this.getDataService.changeValue(this.toCurrency, 'from');
    this.getDataService.changeValue(temp, 'to');
  }

  getExchangeRate(fromInput: boolean = true) {
    this.isLoading = true;
    this.restApi.getData(this.fromCurrency.type).subscribe((data: any) => {
      this.isLoading = false;
      const rate = data.conversion_rates[this.toCurrency.type];

      if (fromInput) {
        const toInputValue = (rate * + this.formInputs.get('valueFrom')?.value).toFixed(2);
        this.formInputs.patchValue({
          'valueTo': toInputValue,
        }, { emitEvent: false })
        return;
      }

      const fromInputValue = (this.formInputs.get('valueTo')?.value / rate).toFixed(2);
      this.formInputs.patchValue({
        'valueFrom': fromInputValue,
      }, { emitEvent: false });
    })
  }

  onlyNumbers(event: Event, from = true) {
    const value = (event.target as HTMLInputElement).value
      .replace(/[^0-9.,]/g, '')
      .replace(/(\..*?)\..*/g, '$1')
      .replace(',', '.');

   if (from) {
    this.formInputs.patchValue({
      'valueFrom': value,
    }, { emitEvent: false });
   } else {
    this.formInputs.patchValue({
      'valueTo': value,
    }, { emitEvent: false });
   }
  }
}
