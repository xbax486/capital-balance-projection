import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserPreconditions } from '../../interfaces/user.preconditions';
import { UserInputs } from '../../interfaces/user.inputs';
import { CalculatorComponent } from './calculator.component';
import { DataProcessService } from './../../services/data-process.service';
import { DataFetchService } from './../../services/data-fetch.service';
import { ToastService } from './../../services/toast.service';

fdescribe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;
  let dataProcessService: any;
  let dataFetchService: any;
  let toastService: any;
  let dataProcessServiceSpy: any;
  let dataFetchServiceSpy: any;
  let toastServiceSpy: any;
  let user: User = {
    preconditions: {
      startBalance: 300000,
      firstYear: 2020,
      lastYear: 2070,
      ageOfFirstYear: 45,
      ageOfCurrentYear: 45,
    },
    inputs: {
      salary: 100000,
      contributionRate: 9.5,
      inflationRate: 3,
      earningsRate: 7.5,
      feesRate: 1.5,
      taxRate: 15,
      withdrawalRate: 5,
      retirementAge: 66,
    },
    outputs: {
      startBalance: 0,
      contributions: 0,
      earnings: 0,
      fees: 0,
      tax: 0,
      withdrawals: 0,
      endBalance: 0,
    },
    calculationDetails: {
      ages: [],
      startBalance: [],
      contributions: [],
      earnings: [],
      fees: [],
      tax: [],
      withdrawals: [],
      endBalance: [],
    },
  };
  const divisor = 100;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
    }).compileComponents();
  });

  beforeEach(
    waitForAsync(() => {
      dataProcessServiceSpy = jasmine.createSpyObj('DataProcessService', [
        'toPercentage',
        'currencyInputChanged',
      ]);

      dataFetchServiceSpy = jasmine.createSpyObj('DataFetchService', [
        'fetchPreconditions',
        'fetchUserInputs',
        'isDataValid',
        'preconditionsAreInvalid',
        'userDataIsInvalid',
        'showSuccessNotification',
        'showErrorNotification',
        'isInstanceOfUserPreconditions',
        'isInstanceOfUser',
      ]);
      dataFetchServiceSpy.userPreconditions =
        new ReplaySubject<UserPreconditions>(1);
      dataFetchServiceSpy.userInputs = new ReplaySubject<UserInputs>(1);
      dataFetchServiceSpy.userPreconditions$ =
        dataFetchServiceSpy.userPreconditions.asObservable();
      dataFetchServiceSpy.userInputs$ =
        dataFetchServiceSpy.userInputs.asObservable();

      toastServiceSpy = jasmine.createSpyObj('ToastService', [
        'onSuccessCall',
        'onErrorCall',
      ]);

      TestBed.configureTestingModule({
        imports: [CommonModule, FormsModule],
        declarations: [CalculatorComponent],
        providers: [
          {
            provide: DataProcessService,
            useValue: dataProcessServiceSpy,
          },
          {
            provide: DataFetchService,
            useValue: dataFetchServiceSpy,
          },
          {
            provide: ToastService,
            useValue: toastServiceSpy,
          },
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(CalculatorComponent);
          component = fixture.componentInstance;
          dataProcessService = TestBed.inject(DataProcessService);
          dataFetchService = TestBed.inject(DataFetchService);
          toastService = TestBed.inject(ToastService);
          fixture.detectChanges();
        });
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct contributions when getContributions() is called in the first year', () => {
    dataProcessService.toPercentage.and.returnValue(
      user.inputs.contributionRate / divisor
    );
    const contributions = component.getContributions(1, user);
    const correctValue = 9500;
    expect(contributions).toBe(correctValue);
  });

  it('should return correct earnings when getEarnings() is called in the first year', () => {
    dataProcessService.toPercentage.and.returnValue(
      user.inputs.earningsRate / divisor
    );
    user.outputs.contributions = 9500;
    const earnings = component.getEarnings(1, user);
    const correctValue = 23213;
    expect(Math.round(earnings)).toBe(correctValue);
  });

  it('should return correct earnings when getFees() is called in the first year', () => {
    dataProcessService.toPercentage.and.returnValue(
      user.inputs.feesRate / divisor
    );
    user.outputs.contributions = 9500;
    user.outputs.earnings = 23213;
    const fees = component.getFees(1, user);
    const correctValue = 4991;
    expect(Math.round(fees)).toBe(correctValue);
  });

  it('should return correct earnings when getTax() is called in the first year', () => {
    dataProcessService.toPercentage.and.returnValue(
      user.inputs.taxRate / divisor
    );
    user.outputs.contributions = 9500;
    user.outputs.earnings = 23213;
    const fees = component.getTax(user);
    const correctValue = 4907;
    expect(Math.round(fees)).toBe(correctValue);
  });

  it('should return correct earnings when getWithdrawals() is called in the first year of retirement', () => {
    dataProcessService.toPercentage.and.returnValue(
      user.inputs.withdrawalRate / divisor
    );
    user.outputs.startBalance = 1182238;
    const withdrawals = component.getWithdrawals(66, user);
    const correctValue = 59112;
    expect(Math.round(withdrawals)).toBe(correctValue);
  });

  it('should return correct earnings when getEndBalance() is called in the first year', () => {
    user.preconditions.startBalance = 300000;
    user.outputs.contributions = 9500;
    user.outputs.earnings = 23213;
    user.outputs.fees = 4991;
    user.outputs.tax = 4907;
    user.outputs.withdrawals = 0;
    const endBalance = component.getEndBalance(1, user);
    const correctValue = 322815;
    expect(Math.round(endBalance)).toBe(correctValue);
  });
});
