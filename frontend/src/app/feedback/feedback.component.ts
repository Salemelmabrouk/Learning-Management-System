import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { Emitters } from '../emitter/emitter';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  authenticated: boolean = false;
  message: string = '';
  institution: string = '';
  Role: string = '';
  rep1: string = '';
  rep2: string = '';
  rep3: string = '';
  rep4: string = '';

  feedback: FormGroup;

  constructor(
    private router: Router,
    private service: ApiserviceService,
    private authService: AuthService // Inject AuthService
  ) {
    // Initialize the form group
    this.feedback = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'besoins': new FormControl('', Validators.required),
      'Nom_responsable': new FormControl('', Validators.required),
      'Tel': new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      'Suggestion': new FormControl('', Validators.required),
      'Fax': new FormControl('')
    });
  }

  ngOnInit(): void {
    const userId = this.authService.getUserId(); // Use AuthService to get user ID
    if (userId) {
      this.service.get_compte_ID(userId).subscribe(
        (res: any) => {
          console.log('API Response:', res);  // Log the response to check the structure
          this.message = res.username;  // If `username` exists directly on `res`
          this.institution = `${res.institution || res.Participants_institution || 'Unknown Institution'}`;
          console.log('Institution:', this.institution);
          this.Role = res.Role;
        },
        (err) => {
          console.error('Error fetching user data:', err);
          Swal.fire('Error', 'Failed to fetch user data', 'error');
        }
      );
      
      
    } else {
      Swal.fire('Error', 'User not authenticated', 'error');
    }

    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.authenticated = auth;
    });
  }

  rating(rep1: string, rep2: string, rep3: string, rep4: string): number {
    const ratings = [rep1, rep2, rep3, rep4].map(r => parseInt(r, 10) / 5);
    const validRatings = ratings.filter(r => !isNaN(r));
    return validRatings.length > 0 ? (validRatings.reduce((a, b) => a + b, 0) * 100) / validRatings.length : 0;
  }

  feedbacksubmit(): void {
    if (this.feedback.valid) {
      console.log(this.feedback.value);
      this.service.create_feedback(this.feedback.value).subscribe(
        () => this.router.navigate(['/formation']),
        (err) => Swal.fire('Error', err.error.message, 'error')
      );
    } else {
      Swal.fire('Error', 'Please fill out all required fields correctly', 'error');
    }
  }
}
