import { inject, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NGX_SPINNER_CONFIG } from 'ngx-spinner/lib/config';

@Injectable({
  providedIn: 'root'
})
export class BusyService {

  busyRequestCall = 0
  spinnerService = inject(NgxSpinnerService)

  busy(){
    this.busyRequestCall++
    this.spinnerService.show(undefined, {
      type: "line-scale-party",
      bdColor: "rgba(255,255,255,0)",
      color: "#333333"
    })
  }

  idle(){
    this.busyRequestCall--
    if(this.busyRequestCall <= 0){
      this.busyRequestCall = 0
      this.spinnerService.hide()
    }
  }
}
