import { waitForAsync, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { BudgetService } from 'app/budget.service';

import { BudgetComponent } from './budget.component';

describe('Budget Component', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;

  let budgetServiceSpy: jasmine.SpyObj<BudgetService>;

  const spy = jasmine.createSpyObj('BudgetService', ['getBudgets']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BudgetComponent ],
      providers: [
        { provide: BudgetService, useValue: spy }
      ]
    })
    .compileComponents();

    budgetServiceSpy = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
