import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * This interceptor automatically adds bearer token needed by our backend API 
 * and accessible for all the requests
 */
@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  defaultBudget;
  categories;

  budgetSubject$:BehaviorSubject<any> = new BehaviorSubject(null);
  categoriesSubject$:BehaviorSubject<any> = new BehaviorSubject(null);

  currencyFormatter = {
    iso_code:'USD',
    digitsInfo : '1.0-0',
    locale : 'en-US'
  };

  dateFormat:string = 'DD/MM/YYYY';

  constructor(private http:HttpClient) {
     this.fetchBudget(true);
  }

  fetchBudget(isNavigate: boolean = false) {
    this.getBudgets(true).pipe(map(r => r['data']['budgets'])).subscribe(data => {
      if (this.defaultBudget) {
        this.defaultBudget = data.filter(x => x.id === this.defaultBudget.id)[0];
      } else {
        this.defaultBudget = data[0];
      }

      this.dateFormat = this.defaultBudget.date_format.format;
      this.currencyFormatter = { ...this.defaultBudget.currency_format, ...this.currencyFormatter };
      this.budgetSubject$.next({ budget: this.defaultBudget, isNavigate: isNavigate });
    });
  }

  setCurrencyFormat(format){
    this.currencyFormatter = format;
  }

  setDefaultBudget(budget){
    this.defaultBudget = budget;
  }

  fetchCategory(budgetId){
    this.getBudgetCategories(budgetId).pipe(map(r=>r['data']['category_groups'])).subscribe(data=>{
        this.categories = data;
        this.categoriesSubject$.next(data);
      });  
  }

  subscribeToCurrentBudget(){
      return this.budgetSubject$.asObservable();
  }

  getBudgets(includeAccounts:boolean = false){
     const url:string = `https://api.youneedabudget.com/v1/budgets?include_accounts=${includeAccounts}`;
     return this.http.get(url);
  }

  getBudgetById(id){
      const url = `https://api.youneedabudget.com/v1/budgets/f73a7979-e04e-486a-82c0-cb83233e2be0`;
      return this.http.get(url);
  }

  getBudgetAccount(id){
      const url = `https://api.youneedabudget.com/v1/budgets/${id}/accounts`;
      return this.http.get(url);
  }

  createBudgetAccount(id,params){
      const url = `https://api.youneedabudget.com/v1/budgets/${id}/accounts/`;
      return this.http.post(url,params);
  }

  getAccountDetailById(budgetId,accountId){
      const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${accountId}`;
      return this.http.get(url);
  }

  getTrasactionDetails(budgetId,accountId){
      const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/accounts/${accountId}/transactions`;
      return this.http.get(url);
  }

  saveNewTransaction(budgetId,params){
    const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions/`;
    return this.http.post(url,params);
  }

  updateTransaction(budgetId,transactionId,params){
    const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/transactions/${transactionId}/`;
    return this.http.put(url,params);
  }

  getBudgetCategories(budgetId){
    const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/categories`;
    return this.http.get(url);
  }

  updateBudgetCategory(budgetId,month,catergoryId,params){
    const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/months/${month}/categories/${catergoryId}/`;
    return this.http.put(url,params);
  }

  getPayeeDetails(budgetId){
    const url = `https://api.youneedabudget.com/v1/budgets/${budgetId}/payees`;
    return this.http.get(url);
  }

}