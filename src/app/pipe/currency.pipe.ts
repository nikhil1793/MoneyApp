import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';
import { BudgetService } from 'app/budget.service';
@Pipe({
    name: 'mycurrency',
  })
  export class MycurrencyPipe implements PipeTransform {

    constructor(private budgetService:BudgetService){}

    transform(
        value: number,
        currencyCode: string = this.budgetService.currencyFormatter.iso_code,
        digitsInfo: string = '1.0-0',
        locale: string = 'en-US',
    ): string | null {
        return formatCurrency(
          value,
          locale,
          getCurrencySymbol(this.budgetService.currencyFormatter.iso_code, 'wide'),
          currencyCode,
          digitsInfo,
        );
    }
}