import { Component, QueryList, ViewChild, ViewChildren, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
  selector: "input-category",
  template: `
        <input type='text' [value]='selectedValue' class="hidden_div" (click)='visible = !visible'/>
        <div class="category-wrapper" *ngIf="visible">
          <mat-accordion displayMode="fill" multi class="mat-table" is-open="true">
                <mat-expansion-panel expanded *ngFor="let item of params.categories">
                  <mat-expansion-panel-header class="mat-row">
                    <span class="mat-cell">{{item.name}}</span>
                  </mat-expansion-panel-header>
                  <mat-accordion>
                    <ng-container *ngFor="let sub of item.categories">
                    <div class="list-group">
                      <button type="button" (click)="onSelectCategory(sub)" class="list-group-item list-group-item-action">
                        {{sub.name}}
                      </button>
                    </div>
                    </ng-container>
                  </mat-accordion>
                </mat-expansion-panel>
          </mat-accordion>
        </div>
    `,
  styles: [
    `
      .mat-accordion .mat-header-row {
        padding-left: 1.5rem;
        padding-right: 2rem;
        border-bottom: none;
      }
      
      .mat-expansion-panel-header.mat-row {
        border-bottom: none;
      }
      
      //copied from https://github.com/angular/material2/blob/master/src/lib/table/table.scss
      $mat-header-row-height: 56px;
      $mat-row-height: 48px;
      $mat-row-horizontal-padding: 24px;
      
      .mat-table {
        display: block;
      }
      
      .mat-header-row {
        min-height: $mat-header-row-height;
      }
      
      .mat-row {
        min-height: $mat-row-height;
      }
      
      .mat-row, .mat-header-row {
        display: flex;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        align-items: center;
        padding: 0 $mat-row-horizontal-padding;
        box-sizing: border-box;
      
        // Workaround for https://goo.gl/pFmjJD in IE 11. Adds a pseudo
        // element that will stretch the row the correct height. See:
        // https://connect.microsoft.com/IE/feedback/details/802625
        &::after {
          display: inline-block;
          min-height: inherit;
          content: '';
        }
      }
      
      .mat-cell, .mat-header-cell {
        flex: 1;
        overflow: hidden;
        word-wrap: break-word;
      }
      
      
      `
  ]
})
export class CategoryEditorComponent implements ICellEditorAngularComp {
  private params: any;
  selectedValue;
  visible:boolean = false;

    @ViewChildren("input", { read: ViewContainerRef })
    public inputs: QueryList<any>;
    private focusedInput: number = 0;
  
    agInit(params: any): void {
      this.params = params;
      this.selectedValue = this.params.value;
    }
  
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
      this.focusOnInputNextTick(this.inputs.first);
    }
  
    private focusOnInputNextTick(input: ViewContainerRef) {
      window.setTimeout(() => {
        if(input)input.element.nativeElement.focus();
      }, 0);
    }
  
    getValue() {
      return this.selectedValue;
    }
  
    isPopup(): boolean {
      return true;
    }
  
    /*
     * A little over complicated for what it is, but the idea is to illustrate how you might tab between multiple inputs
     * say for example in full row editing
     */
    onKeyDown(event): void {
      let key = event.which || event.keyCode;
      if (key == 9) {
        // tab
        this.preventDefaultAndPropagation(event);
  
        // either move one input along, or cycle back to 0
        this.focusedInput =
          this.focusedInput === this.inputs.length - 1
            ? 0
            : this.focusedInput + 1;
  
        let focusedInput = this.focusedInput;
        let inputToFocusOn = this.inputs.find((item: any, index: number) => {
          return index === focusedInput;
        });
  
        this.focusOnInputNextTick(inputToFocusOn);
      } else if (key == 13) {
        // enter
        // perform some validation on enter - in this example we assume all inputs are mandatory
        // in a proper application you'd probably want to inform the user that an input is blank
        this.inputs.forEach(input => {
          if (!input.element.nativeElement.value) {
            this.preventDefaultAndPropagation(event);
            this.focusOnInputNextTick(input);
          }
        });
      }
    }
  
    private preventDefaultAndPropagation(event) {
      event.preventDefault();
      event.stopPropagation();
    }

  onSelectCategory(category){
     this.selectedValue = category.name;
     this.visible = false;
  }



}
