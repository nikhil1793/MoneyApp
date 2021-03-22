import { Component, ViewChild, ViewContainerRef } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { BudgetService } from "app/budget.service";
import { Observable } from "rxjs";
import { shareReplay,map } from "rxjs/operators";

@Component({
    selector: "dropdown-editor",
    template: `
        <div class="container dropdown_wrapper" #group tabindex="0" (keydown)="onKeyDown($event)">
        <mat-form-field>
            <mat-select panelClass="ag-custom-component-popup" [(ngModel)]="selctedValue">
                <mat-option *ngFor="let item of list" [value]="item.name">
                    {{ item.name }}
                </mat-option>
            </mat-select>
            </mat-form-field>
        </div>
`,
    styles: [
        `
            .container {
                width: 190px;
                height: 48px;
            }

            .container:focus {
                outline: none;
            }
        `
    ]
})
export class DropdownEditorComponent implements ICellEditorAngularComp {
    private params: any;

    private list: string[];
    private selctedValue: string;

    constructor(private budgetService:BudgetService){}

    @ViewChild("group", { read: ViewContainerRef })
    public group;

    agInit(params: any): void {
        this.params = params;

        this.selctedValue = this.params.value;
        if(this.params.budgetId){
            this.budgetService.getPayeeDetails(this.params.budgetId)
            .pipe(
              shareReplay(),
              map(response => response['data']['payees'])
            )
            .subscribe(data=>{
                this.list = data;
            });
        }
    }

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.group.element.nativeElement.focus();
        });
    }

    getValue() {
        return this.selctedValue;
    }

    isPopup(): boolean {
        return true;
    }

    onKeyDown(event): void {
        let key = event.which || event.keyCode;
        if (key === 38 || key === 40) {
            this.preventDefaultAndPropagation(event);
        }
    }

    private preventDefaultAndPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }
}
