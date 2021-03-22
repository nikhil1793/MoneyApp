import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import 'ag-grid-enterprise'
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';


import { BudgetService } from 'app/budget.service';
import { ActivatedRoute } from '@angular/router';
import { MycurrencyPipe } from 'app/pipe/currency.pipe';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-budget-category',
  templateUrl: './budget-category.component.html',
  styleUrls: ['./budget-category.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    MycurrencyPipe
  ],
})

export class BudgetCategoryComponent implements OnInit {

  date = new FormControl(moment());
  gridOptions: any;
  rowData: any = [];
  detailCellRendererParams: any;
  budgetId:string;
  selectedDate:string;

  constructor(
    private budgetService: BudgetService,
    private route: ActivatedRoute,
    private currencyPipe: MycurrencyPipe) {
    this.configureGrid();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params) {
        this.budgetId = params.budgetId;
        this.budgetService.fetchCategory(params.budgetId);
        this.selectedDate = params.date;
      }
    });
  }

  configureGrid() {
    this.gridOptions = {
      columnDefs: [
        { headerName: 'CATEGORY', field: 'name', cellRenderer: 'agGroupCellRenderer' }
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        sortable: true
      }
    };

    this.detailCellRendererParams = {
      detailGridOptions: {
        columnDefs: [
          { headerName: 'CATEGORY', field: 'name' },
          {
            headerName: 'BUDGETED', 
            field: 'budgeted',
            valueFormatter: this.formatter.bind(this), 
            editable: true, 
            singleClickEdit: true, 
            cellEditor: 'numericCellEditor'
          },
          { headerName: 'ACTIVITY', field: 'activity', valueFormatter: this.formatter.bind(this) },
          { headerName: 'AVAILABLE', field: 'balance', valueFormatter: this.formatter.bind(this) }
        ],
        defaultColDef: { flex: 1 },
        components: {
          numericCellEditor: this.getNumericCellEditor()
        },
        onCellEditingStopped:this.onCellEditingStopped.bind(this)
      },
      getDetailRowData: function (params) {
        params.successCallback(params.data.categories);
      }
    }
  }

  private formatter(params) {
    return this.currencyPipe.transform(params.value);
  }

  onFirstDataRendered(params) {
    // setTimeout(function () {
    //   params.api.forEachNode((x, i) => {
    //     params.api.getDisplayedRowAtIndex(i).setExpanded(true);
    //   })
    // }, 500);
  }

  onCellEditingStopped(params){
    const body = {
      category: {
        budgeted:params.data.budgeted
      }
    }
    this.budgetService.updateBudgetCategory(this.budgetId,this.selectedDate,params.data.id,body)
    .subscribe(data=>{
      if(data){
        this.budgetService.fetchCategory(this.budgetId);
      }
    })
  }


  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    console.log(this.date.value);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    console.log(this.date.value);
    datepicker.close();
  }

  onGridReady(params) {
    this.budgetService.categoriesSubject$.subscribe(data => {
      this.rowData = data;
      setTimeout(function () {
        params.api.forEachNode((x, i) => {
          params.api.getDisplayedRowAtIndex(i).setExpanded(true);
        })
      }, 500);
    })
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
