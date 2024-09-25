import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) { }

  success(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      closeButton: true,
      progressBar: true
    });
  }

  error(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      closeButton: true,
      progressBar: true
    });
  }

  warning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      closeButton: true,
      progressBar: true
    });
  }

  info(message: string, title: string = 'Information') {
    this.toastr.info(message, title, {
      closeButton: true,
      progressBar: true
    });
  }
}
