import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { UserPrecondictions } from '../interfaces/user.precondictions';
import { ToastService } from "./toast.service";

const SECONDS_TO_FETCH_DATA = 3000;

@Injectable({
  providedIn: 'root',
})
export class DataFetchService {
  private userPrecondictions = new ReplaySubject<UserPrecondictions>(1);
  public userPrecondictions$ = this.userPrecondictions.asObservable();

  constructor(private toastService: ToastService) {
    this.fetchPreconditions();
  }

  public dataIsValid(data: UserPrecondictions) {
    return (
      data.startBalance >= 0 &&
      data.ageOfFirstYear >= 18 &&
      data.firstYear <= data.lastYear &&
      data.ageOfFirstYear <= data.ageOfCurrentYear
    );
  }

  private fetchPreconditions() {
    let newData = {
      startBalance: 300000,
      firstYear: 2020,
      lastYear: 2070,
      ageOfFirstYear: 45,
      ageOfCurrentYear: 45,
    };
    if(this.dataIsValid(newData)) {
      setTimeout(() => {
        this.showSuccessNotification(newData)
      }, SECONDS_TO_FETCH_DATA);
    }
    else {
      setTimeout(() => {
        this.showErrorNotification(newData);
      }, SECONDS_TO_FETCH_DATA);
    }
  }

  private showSuccessNotification(data: UserPrecondictions) {
    this.toastService.onSuccessCall('Precondictions are fetched successfully.');
    this.userPrecondictions.next(data);
  }

  private showErrorNotification(data: UserPrecondictions) {
    const errorMessagePrefix = 'Something wrong with the fetch of precondictions.';
    const errorMessagePostfix = 'Please contact administrator for help.';
    if(data.startBalance < 0) {
      this.toastService.onErrorCall(`${errorMessagePrefix} Start balance of the first year should not be a negative number. ${errorMessagePostfix}`);
    }
    if(data.ageOfFirstYear < 18) {
      this.toastService.onErrorCall(`${errorMessagePrefix} The age in the first year must be at least 18. ${errorMessagePostfix}`);
    }
    if(data.firstYear > data.lastYear) {
      this.toastService.onErrorCall(`${errorMessagePrefix} First year must not be later than last year. ${errorMessagePostfix}`);
    }
    if(data.ageOfFirstYear != data.ageOfCurrentYear) {
      this.toastService.onErrorCall(`${errorMessagePrefix} The age in the first year must be equal to the current year before the capital balance projection calculation! ${errorMessagePostfix}`);
    }
  }
}
