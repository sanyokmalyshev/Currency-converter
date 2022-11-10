import { Component, Input, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { GetDataService } from '../shared/get-data.service';
import { Currency } from '../types/currencies';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})
export class SelectComponent implements OnInit{
    @Input() title: string;
    @ViewChild('dropdown') dropdownElement: ElementRef

    options: Currency[];
    public currentValue: Currency;
    public dropdownOpen: boolean = false;

    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
      this.dropdownOpen
        = this.dropdownElement.nativeElement.contains(event.target)
          ? !this.dropdownOpen
          : false;
    }

    constructor(
      private getDataService: GetDataService,
    ) {}

    ngOnInit(): void {
      this.options = this.getDataService.getOptions();

      if (this.title === 'from') {
        this.getDataService.changeCurrencyFrom.subscribe(
          (currency: Currency)=> {
            this.currentValue = currency;
          }
        );
        this.currentValue = this.getDataService.currencyFrom;
        return;
      }

      this.getDataService.changeCurrencyTo.subscribe(
        (currency: Currency)=> {
          this.currentValue = currency;
        }
      );
      this.currentValue = this.getDataService.currencyTo;
    }

    select(value: Currency) {
      this.getDataService.changeValue(value, this.title);
    }
}
