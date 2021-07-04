import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { UserPrecondictions } from '../interfaces/user.precondictions';
import { UserInputs } from './../interfaces/user.inputs';
import { ToastService } from './toast.service';

const SECONDS_TO_FETCH_DATA = 3000;
const RETIREMENT_AGE = 66;

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private userPrecondictions = new ReplaySubject<UserPrecondictions>(1);
  private userInputs = new ReplaySubject<UserInputs>(1);
  public userPrecondictions$ = this.userPrecondictions.asObservable();
  public userInputs$ = this.userInputs.asObservable();

  private defaultPrecondictions: UserPrecondictions = {
    startBalance: 300000,
    firstYear: 2020,
    lastYear: 2070,
    ageOfFirstYear: 45,
    ageOfCurrentYear: 45,
  };

  private defaultUserInputs: UserInputs = {
    salary: 100000,
    contributionRate: 9.5,
    inflationRate: 3,
    earningsRate: 7.5,
    feesRate: 1.5,
    taxRate: 15,
    withdrawalRate: 5,
    retirementAge: 66,
  };

  constructor(private toastService: ToastService) {
    this.fetchPreconditions();
    this.fetchUserInputs();
  }

  private fetchPreconditions() {
    if (this.isDataValid(this.defaultPrecondictions)) {
      setTimeout(() => {
        this.showSuccessNotification(this.defaultPrecondictions);
      }, SECONDS_TO_FETCH_DATA);
    } else {
      setTimeout(() => {
        this.showErrorNotification(this.defaultPrecondictions);
      }, SECONDS_TO_FETCH_DATA);
    }
  }

  private fetchUserInputs() {
    if (this.isDataValid(this.defaultUserInputs)) {
      setTimeout(() => {
        this.showSuccessNotification(this.defaultUserInputs);
      }, SECONDS_TO_FETCH_DATA);
    }
    else {
      setTimeout(() => {
        this.showErrorNotification(this.defaultUserInputs);
      }, SECONDS_TO_FETCH_DATA);
    }
  }

  private isDataValid(data: UserPrecondictions | UserInputs) {
    if (this.isInstanceOfUserPrecondictions(data)) {
      return (
        data.startBalance >= 0 &&
        data.ageOfFirstYear >= 18 &&
        data.firstYear <= data.lastYear &&
        data.ageOfFirstYear <= data.ageOfCurrentYear
      );
    }
    return (
      data.salary >= 0 &&
      data.contributionRate >= 0 &&
      data.inflationRate >= 0 &&
      data.earningsRate >= 0 &&
      data.feesRate >= 0 &&
      data.taxRate >= 0 &&
      data.withdrawalRate >= 0 &&
      data.retirementAge >= 0
    );
  }

  private precondictionsAreInvalid(data: UserPrecondictions, errorMessagePostfix: string) {
    const errorMessagePrefix = 'Something wrong with the fetch of precondictions.';
    if (data.startBalance < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Start balance of the first year should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.ageOfFirstYear < 18) {
      this.toastService.onErrorCall(`${errorMessagePrefix} The age in the first year must be at least 18. ${errorMessagePostfix}`);
    }
    if (data.firstYear > data.lastYear) {
      this.toastService.onErrorCall(`${errorMessagePrefix} First year must not be later than last year. ${errorMessagePostfix}`);
    }
    if (data.ageOfFirstYear != data.ageOfCurrentYear) {
      this.toastService.onErrorCall(`${errorMessagePrefix} The age in the first year must be equal to the current year before the capital balance projection calculation! ${errorMessagePostfix}`);
    }
  }

  private userDataIsInvalid(data: UserInputs, errorMessagePostfix: string) {
    const errorMessagePrefix = 'Something wrong with the fetch of user inputs.';
    if (data.salary < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Salary should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.contributionRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Contribution rate should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.inflationRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Inflation rate should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.earningsRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Earnings should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.feesRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Fees rate should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.taxRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Tax rate should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.withdrawalRate < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Withdrawal rate should not be a negative number. ${errorMessagePostfix}`);
    }
    if (data.retirementAge < RETIREMENT_AGE) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Retirement age should not be smaller than ${RETIREMENT_AGE}. ${errorMessagePostfix}`);
    }
  }

  private showSuccessNotification(data: UserPrecondictions | UserInputs) {
    if (this.isInstanceOfUserPrecondictions(data)) {
      this.toastService.onSuccessCall('Precondictions are fetched successfully.');
      this.userPrecondictions.next(data);
    } else if (this.isInstanceOfUser(data)) {
      this.toastService.onSuccessCall('User inputs are fetched successfully.');
      this.userInputs.next(data);
    }
  }

  private showErrorNotification(data: UserPrecondictions | UserInputs) {
    const errorMessagePostfix = 'Please contact administrator for help.';
    if (this.isInstanceOfUserPrecondictions(data)) {
      this.precondictionsAreInvalid(data, errorMessagePostfix);
    } else if (this.isInstanceOfUser(data)) {
      this.userDataIsInvalid(data, errorMessagePostfix);
    }
  }

  private isInstanceOfUserPrecondictions(data: UserPrecondictions | UserInputs): data is UserPrecondictions {
    return data.hasOwnProperty('startBalance');
  }

  private isInstanceOfUser(data: UserPrecondictions | UserInputs): data is UserInputs {
    return data.hasOwnProperty('salary');
  }
}
