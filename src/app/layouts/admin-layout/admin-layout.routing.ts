import { Routes } from '@angular/router';

import { BudgetCategoryComponent } from '../../budget-category/budget-category.component';
import { BudgetComponent } from 'app/budget/budget.component';
import { AccountComponent } from 'app/account/account.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'budget-category/:budgetId/:date', component: BudgetCategoryComponent },
    { path: 'open-budget', component: BudgetComponent },
    { path: 'add-budget', component: BudgetComponent },
    { path: 'account/:budgetId/:accoountId', component: AccountComponent },
];
