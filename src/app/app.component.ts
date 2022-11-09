import { Component, OnInit } from '@angular/core';
import { GetDataService } from './get-data.service';
import { Currency } from './types/currencies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public fromInputValue: string;
  public toInputValue: string;
  public fromCurrency: Currency = this.getDataService.currencyFrom;
  public toCurrency: Currency = this.getDataService.currencyTo;
  public dropdownOptions: Currency[] = [];
  public isLoading: boolean;

  constructor(private getDataService: GetDataService) {

  }

  ngOnInit() {
    this.dropdownOptions = this.getDataService.getOptions();
    console.log(this.dropdownOptions);


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
    this.fromInputValue = '1';
    this.toInputValue = '';
    this.getExchangeRate();
  }

  inputChange(event: Event, from = true) {
    let value = (event.target as HTMLInputElement).value;

    if (from) {
      this.fromInputValue = value;
      this.getExchangeRate();
      return;
    }

    this.toInputValue = value;
    this.getExchangeRate(false);
  }


  handleChangeCurrencies() {
    const temp = this.fromCurrency;
    this.getDataService.changeValue(this.toCurrency, 'from');
    this.getDataService.changeValue(temp, 'to');
  }

  getExchangeRate(fromInput: boolean = true) {
    this.isLoading = true;
    let rate = 1;
    const apiUrl
      = `https://v6.exchangerate-api.com/v6/2b62907ec3442b6decc48727/latest/${this.fromCurrency.type}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(result => {
        rate = result.conversion_rates[this.toCurrency.type];
        if (fromInput) {
          this.toInputValue = (rate * +this.fromInputValue).toFixed(2);
          return;
        }

        this.fromInputValue = (+this.toInputValue / rate).toFixed(2);

      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        this.isLoading = false;
      })
  }
}
