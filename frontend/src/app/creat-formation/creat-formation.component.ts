import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-creat-formation',
  templateUrl: './creat-formation.component.html',
  styleUrls: ['./creat-formation.component.css']
})
export class CreatFormationComponent {
  createfr = new FormGroup({
    'name': new FormControl('', Validators.required),
    'startDate': new FormControl('', Validators.required),
    'endDate': new FormControl('', Validators.required),
    'description': new FormControl('', Validators.required),
    'place': new FormControl('', Validators.required)
  });

  constructor(private router: Router, private service: ApiserviceService) { }

  gotoTraining() {
    this.router.navigate(["/formation"])
  }

  userSubmit() {
    if (this.createfr.valid) {
      console.log('Form Values:', this.createfr.value);
      this.service.createFormationData(this.createfr.value).subscribe({
        next: (res) => {
          console.log('Creation Response:', res);
          this.createfr.reset();
          this.gotoTraining(); // Navigate after successful creation
        },
        error: (error) => {
          console.error('Error creating formation:', error);
        }
      });
    } else {
      console.log('All fields are required');
    }
  }
}