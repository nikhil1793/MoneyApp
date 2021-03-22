import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BudgetService } from 'app/budget.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    active:boolean;
    dropdown:boolean;
}
export const ROUTES: RouteInfo[] = [
    { path: '/budget-category', title: 'Budget Categories',  icon: 'dashboard', class: '',active:true,dropdown:false },
    { path: '/budget-account', title: 'Budget Accounts',  icon:'notifications', class: '',active:true,dropdown:true },
    { path: '/open-budget', title: 'Budgets',  icon:'more_vert', class: 'active-pro',active:false,dropdown:false},
    { path: '/add-budget', title: 'Add Budget',  icon:'add_task', class: 'active-pro',active:false,dropdown:false},
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  currentBudget;

  constructor(private router:Router,private budgetService: BudgetService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    //subscribe to budget subject
    this.budgetService.subscribeToCurrentBudget().subscribe(data=>{
      if(data){
        this.currentBudget = data.budget;
        if(data.isNavigate){
          this.router.navigate(['/budget-category',this.currentBudget.id,this.currentBudget.first_month]);
        }
      }
    })
  }

  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  onMenuClosed(event){
    this.router.navigate(['/open-budget']);
  }

  onNavClick(menuItem:RouteInfo){
    console.log(menuItem);
  }

  onSubmit(form:NgForm){
    const {accountType,accountName,currentBalance} = form.value;
    const accountParams = {
      account : {
        name: accountName,
        type: accountType,
        balance: currentBalance
      }
    }

    this.budgetService.createBudgetAccount(this.currentBudget.id,accountParams)
    .subscribe(data=>{
       if(data){
         form.reset();
         this.budgetService.fetchBudget();
         $('#exampleModal').modal('hide');
       }
    })
  }
}
