import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { BudgetCategoryComponent } from '../../budget-category/budget-category.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';

import { AgGridModule } from 'ag-grid-angular';
import { BudgetComponent } from 'app/budget/budget.component';
import { AccountComponent } from 'app/account/account.component';
import { MatDatePickerComponent } from 'app/cell editors/datepicker.component';
import { CategoryEditorComponent } from 'app/cell editors/categoryEditor.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MycurrencyPipe } from 'app/pipe/currency.pipe';
import { DropdownEditorComponent } from 'app/cell editors/dropdown-cell-editor.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([CategoryEditorComponent,MatDatePickerComponent,DropdownEditorComponent]),
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatTooltipModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatListModule
  ],
  declarations: [
    BudgetCategoryComponent,
    BudgetComponent,
    AccountComponent,
    MatDatePickerComponent,
    CategoryEditorComponent,
    MycurrencyPipe,
    DropdownEditorComponent
  ],
  entryComponents:[]
})

export class AdminLayoutModule {}
