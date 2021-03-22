import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { BudgetService } from 'app/budget.service';
import { CategoryEditorComponent } from 'app/cell editors/categoryEditor.component';
import { MatDatePickerComponent } from 'app/cell editors/datepicker.component';
import { DropdownEditorComponent } from 'app/cell editors/dropdown-cell-editor.component';
import { MycurrencyPipe } from 'app/pipe/currency.pipe';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
  providers:[MycurrencyPipe]
})
export class AccountComponent implements OnInit {

  gridApi;
  gridColumnApi;
  gridOptions: any;
  rowData: any = [];
  budgetId;
  accountId;
  isNewAdded: boolean = false;
  accountDetail;


  constructor(
    private budgetService: BudgetService,
    private route: ActivatedRoute,
    private currencyPipe: MycurrencyPipe) { }

  onBudgetClick(budget) {
    this.budgetService.budgetSubject$.next({ budget: budget, isNavigate: false });
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      if (params) {
        this.budgetId = params.budgetId;
        this.accountId = params.accountId;
        this.budgetService.getTrasactionDetails(params.budgetId, params.accoountId)
          .pipe(map(response => response['data']['transactions']))
          .subscribe(rows => {
            console.log(rows);
            this.rowData = rows;
          });

        this.budgetService.subscribeToCurrentBudget().pipe(map(x => x.budget.accounts)).subscribe(data => {
          if (data) {
            this.accountDetail = data.filter(x => x.id === params.accoountId)[0];
          }
        })
      }
    });



    this.configureGrid();
  }

  configureGrid() {
    this.gridOptions = {
      columnDefs: [
        { headerName: 'DATE', field: 'date', cellEditor: 'datePicker' },
        {
          headerName: 'PAYEE', field: 'payee_name', cellEditor: "dropdownEditorComponent",
          cellEditorParams: {
            budgetId: this.budgetId
          }
        },
        {
          headerName: 'CATEGORY', field: 'category_name', cellEditor: 'categoryEditor',
          cellEditorParams: {
            categories: this.budgetService.categories
          }
        },
        { headerName: 'MEMO', field: 'memo', width: 150 },
        {
          headerName: 'OUTFLOW',
          width: 120,
          valueSetter: function (params) {
            var newValInt = parseInt(params.newValue);
            var valueChanged = params.data.amount !== newValInt;
            if (valueChanged) {
              params.data.amount = -newValInt;
            }
            return valueChanged;
          },
          valueGetter: function (params) {
            if (params.data.amount < 0) {
              return params.data.amount;
            } else {
              return 0;
            }
          },
          cellEditor: 'numericCellEditor',
          valueFormatter: this.formatter.bind(this)
        },
        {
          headerName: 'INFLOW',
          width: 120,
          valueGetter: function (params) {
            if (params.data.amount > 0) {
              return params.data.amount;
            } else {
              return 0;
            }
          },
          valueFormatter: this.formatter.bind(this),
          cellEditor: 'numericCellEditor',
          editable: false
        }
      ],
      defaultColDef: {
        editable: true,
        sortable: true
      },
      components: {
        numericCellEditor: this.getNumericCellEditor()
      },
      frameworkComponents: {
        datePicker: MatDatePickerComponent,
        categoryEditor: CategoryEditorComponent,
        dropdownEditorComponent: DropdownEditorComponent
      },
      editType: 'fullRow',
      onRowValueChanged: this.onRowValueChanged.bind(this),
      singleClickEdit: true
    };
  }

  private formatter(params) {
    return this.currencyPipe.transform(params.value);
  }

  addNew() {
    this.isNewAdded = true;
    const copiedRow = this.rowData && this.rowData.length > 0 ? this.rowData[0] : {};
    const row = {
      ...copiedRow,
      date: null,
      amount: null,
      memo: null,
      payee_name: null,
      category_name: null,
      cleared: 'uncleared'
    }

    this.gridOptions.api.addItems([row]);
    this.gridOptions.api.refreshView();

    const lastIndex = this.gridOptions.api.getDisplayedRowCount() - 1;

    setTimeout(() => {
      this.gridOptions.api.setFocusedCell(lastIndex, 'date');
      this.gridOptions.api.startEditingCell({
        rowIndex: lastIndex,
        colKey: 'date',
      });
    }, 200);

  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
  }

  onRowValueChanged(event) {
    const params = {
      transaction: event.data
    }
    console.log(this);
    if (this.isNewAdded) {
      this.budgetService.saveNewTransaction(this.budgetId, params).subscribe(data => {
        if (data) {
          this.isNewAdded = false;
          this.budgetService.fetchBudget();
        }
      })
    } else {
      this.budgetService.updateTransaction(this.budgetId, event.data.id, params).subscribe(data => {
        if (data) {
          this.budgetService.fetchBudget();
        }
      });
    }

  }

  private getNumericCellEditor() {
    function isCharNumeric(charStr) {
      return !!/\d/.test(charStr);
    }
    function isKeyPressedNumeric(event) {
      var charCode = getCharCodeFromEvent(event);
      var charStr = String.fromCharCode(charCode);
      return isCharNumeric(charStr);
    }
    function getCharCodeFromEvent(event) {
      event = event || window.event;
      return typeof event.which === 'undefined' ? event.keyCode : event.which;
    }
    function NumericCellEditor() { }
    NumericCellEditor.prototype.init = function (params) {
      this.focusAfterAttached = params.cellStartedEdit;
      this.eInput = document.createElement('input');
      this.eInput.style.width = '100%';
      this.eInput.style.height = '100%';
      this.eInput.value = isCharNumeric(params.charPress)
        ? params.charPress
        : params.value;
      var that = this;
      this.eInput.addEventListener('keypress', function (event) {
        if (!isKeyPressedNumeric(event)) {
          that.eInput.focus();
          if (event.preventDefault) event.preventDefault();
        }
      });
    };
    NumericCellEditor.prototype.getGui = function () {
      return this.eInput;
    };
    NumericCellEditor.prototype.afterGuiAttached = function () {
      if (this.focusAfterAttached) {
        this.eInput.focus();
        this.eInput.select();
      }
    };
    NumericCellEditor.prototype.isCancelBeforeStart = function () {
      return this.cancelBeforeStart;
    };
    NumericCellEditor.prototype.isCancelAfterEnd = function () { };
    NumericCellEditor.prototype.getValue = function () {
      return this.eInput.value;
    };
    NumericCellEditor.prototype.focusIn = function () {
      var eInput = this.getGui();
      eInput.focus();
      eInput.select();
      console.log('NumericCellEditor.focusIn()');
    };
    NumericCellEditor.prototype.focusOut = function () {
      console.log('NumericCellEditor.focusOut()');
    };
    return NumericCellEditor;
  }
}
