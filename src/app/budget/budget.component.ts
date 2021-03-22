import { Component, OnInit } from '@angular/core';
import { BudgetService } from 'app/budget.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  budget$:Observable<any>;

  constructor(private budgetService: BudgetService){}
   
   ngOnInit(){
    this.budget$ =  this.budgetService.getBudgets(true).pipe(map(r=>r['data']['budgets']));
   }

   onBudgetClick(budget){
     this.budgetService.budgetSubject$.next({ budget: budget, isNavigate: true });
     this.budgetService.setDefaultBudget(budget);
   }
}
