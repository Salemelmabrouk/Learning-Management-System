import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiserviceService } from '../apiservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-creat-formation',
  templateUrl: './creat-formation.component.html',
  styleUrls: ['./creat-formation.component.css']
})
export class CreatFormationComponent {
  createfr: FormGroup;
  selectedFile: File | null = null; // Variable to hold selected file
  imagePreview: string | ArrayBuffer | null = null; 
  constructor(private fb: FormBuilder, private router: Router, private service: ApiserviceService, private toastr: ToastrService) {
    this.createfr = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      description: ['', Validators.required],
      place: ['', Validators.required],
  
      trainingLevel: ['', Validators.required],
      trainingCategory: ['', Validators.required],
      curriculum: this.fb.array([], Validators.required),
      requirements: this.fb.array([], Validators.required)
    });

    this.addCurriculum();
    this.addRequirement();
  }

  get curriculum() {
    return this.createfr.get('curriculum') as FormArray;
  }

  get requirements() {
    return this.createfr.get('requirements') as FormArray;
  }

  addCurriculum() {
    this.curriculum.push(this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    }));
  }

  removeCurriculum(index: number) {
    this.curriculum.removeAt(index);
  }

  addRequirement() {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number) {
    this.requirements.removeAt(index);
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file; // Assign selected file here
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result; // Use this as the image src for preview
    };
    reader.readAsDataURL(file); // Convert file to data URL
  }
  
  userSubmit(): void {
    if (this.createfr.valid) {
      const formData = new FormData();
      Object.keys(this.createfr.controls).forEach(key => {
        const control = this.createfr.get(key);
        if (control instanceof FormArray) {
          // Serialize FormArray values as JSON strings
          formData.append(key, JSON.stringify(control.value));
        } else {
          formData.append(key, control?.value);
        }
      });
  
      if (this.selectedFile) {
        formData.append('image', this.selectedFile, this.selectedFile.name);
      }
  
      this.service.createFormationData(formData).subscribe({
        next: (res) => {
          console.log('Creation Response:', res);
          this.createfr.reset();
          this.router.navigate(['/all-trainings']); // Navigate to refresh the list
          this.toastr.success('training added successfully !');
        },
        error: (error) => {
          console.error('Error creating formation:', error);
        }
      });
    } else {
      console.log('All fields are required');
    }
  }
  

  gotoTraining() {
    this.router.navigate(['/formation']);
  }
}
