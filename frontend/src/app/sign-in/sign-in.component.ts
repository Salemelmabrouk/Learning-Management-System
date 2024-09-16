import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { Emitters } from '../emitter';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!'
      });
      return;
    }

    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe({
      next: (response: any) => {
        console.log('Login Response:', response); // Log the full response
        if (response && response.token) {
          this.authService.saveToken(response.token);
          localStorage.setItem('userId', response.userId);

          // Debug logs
          console.log('Saved Token:', this.authService.getToken());
          console.log('Stored User ID:', localStorage.getItem('userId'));

          Emitters.authEmitter.emit(true); // Update authentication status in navbar

          // Role-based redirection
          if (response.role === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/accueil']);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login failed',
            text: 'Invalid username or password. Please try again.'
          });
        }
      },
      error: (err: any) => {
        console.error('Login Error:', err); // Log the error for debugging
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Invalid username or password. Please try again.'
        });
      }
    });
  }
  gotoSignup() {
    this.authService.logout();
    this.router.navigate(["/sign-up"]);
  }
}
