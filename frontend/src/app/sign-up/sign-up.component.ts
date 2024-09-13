import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;
  errorMessage: any;

  constructor(private router: Router, private service: ApiserviceService) {
    this.signupForm = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'password': new FormControl('', Validators.required),
       role : new FormControl('participant , formateur, ADMIN', Validators.required),
      'username': new FormControl('', Validators.required),
      'participantsInstitution': new FormControl('')
    });
  }

  gotosignin() {
    this.router.navigate(["/sign-in"]);
  }

  validateEmail(email: string): boolean {
    const validRegex = /^[a-zA-Z0-9.!#*%&'*+/=?^_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return !email.match(validRegex);
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      this.service.signup(this.signupForm.value).subscribe(
        (response) => {
          console.log('User signed up successfully', response);
          this.router.navigate(['/sign-in']); // Redirect to login page after successful signup
        },
        (error) => {
          console.error('Error signing up', error);
          this.errorMessage = error.error.message || 'An error occurred during signup';
        }
      );
    }
  }
}
