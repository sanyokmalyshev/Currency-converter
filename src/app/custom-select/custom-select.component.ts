import { Component, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { GetDataService } from '../get-data.service';
import { Currency } from '../types/currencies';

@Component({
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class SelectComponent {
    @Input() title: string;
    options: Currency[];

    public currentValue: Currency;
    public dropdownOpen: boolean = false;
    public get dropdownElement(): Element {
      return this.elem.nativeElement.querySelector('.dropdown-list')
    }

    private currentIndex = -1;

    constructor(
      private elem: ElementRef,
      private renderer: Renderer2,
      private getDataService: GetDataService,
    ) {
      this.renderer.listen('window', 'click', (e:Event) =>{
       if(!this.elem.nativeElement.contains(e.target)) {
          this.dropdownOpen=false;
       }
   });
    }

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

    handleKeyboardEvents($event: KeyboardEvent) {
        if (this.dropdownOpen) {
            $event.preventDefault();
        } else {
            return;
        }
        if ($event.code === 'ArrowUp') {
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            } else if (this.currentIndex > 0) {
                this.currentIndex--;
            }
            this.elem.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
        } else if ($event.code === 'ArrowDown') {
            if (this.currentIndex < 0) {
                this.currentIndex = 0;
            } else if (this.currentIndex < this.options.length-1) {
                this.currentIndex++;
            }
            this.elem.nativeElement.querySelectorAll('li').item(this.currentIndex).focus();
        } else if (($event.code === 'Enter' || $event.code === 'NumpadEnter') && this.currentIndex >= 0) {
            this.selectByIndex(this.currentIndex);
        } else if ($event.code === 'Escape') {
            this.closeDropdown();
        }
    }

    closeDropdown() {
        this.dropdownElement.setAttribute('aria-expanded', "false");
        this.currentIndex = -1;
        this.dropdownOpen = false;
    }

    selectByIndex(i: number) {
        let value = this.options[i];
        this.select(value);
    }

    select(value: Currency) {
        this.currentValue = value;
        this.closeDropdown();
        this.getDataService.changeValue(value, this.title);
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
        this.dropdownElement.setAttribute('aria-expanded', this.dropdownOpen ? "true" : "false");
    }
}
