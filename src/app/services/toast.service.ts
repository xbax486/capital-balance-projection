import { Injectable } from '@angular/core';
import { ToastyService, ToastOptions } from 'ng2-toasty';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastyService:ToastyService) {}

  public onSuccessCall(message: string) {
    this.showNotification('Success', { status: 200, message: message });
  }

  public onErrorCall(message: string) {
    this.showNotification('Error', { status: 500, message: message });
  }

  public showNotification(title: string, httpResponse: { status: number, message: string }) {
    var toastOptions:ToastOptions = {
      title: title,
      msg:  httpResponse.message,
      showClose: true,
      timeout: 5000,
      theme: 'bootstrap',
    };
    if(httpResponse.status && httpResponse.status == 200) {
      this.toastyService.success(toastOptions);
    }
    else if(httpResponse.status && httpResponse.status == 500) {
      this.toastyService.error(toastOptions);
    }
  }
}
