import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-formation-details',
  templateUrl: './formation-details.component.html',
  styleUrls: ['./formation-details.component.css']
})
export class FormationDetailsComponent implements OnInit {
  formationId: string = '';
  formationDetails: any = {
    rating: 4 // Example rating value
  };
  trainerDetails: any;
  errorMessage: string = '';
  feedback!: FormGroup;
  role: string = '';
  token: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private service: ApiserviceService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();

    this.feedback = this.fb.group({
      comment: ['', Validators.required],
      rating: [0, Validators.required] // Example form control
    });

    this.route.paramMap.subscribe(params => {
      this.formationId = params.get('id') || '';
      this.loadFormationDetails();
    });
  }

  loadFormationDetails() {
    if (this.formationId) {
      this.service.get_formation_by_ID(this.formationId).subscribe(
        data => {
          this.formationDetails = data;
          this.role = data.Role;
          this.loadTrainerDetails(data.trainer.id);
          console.log('Formation details loaded:', this.formationDetails);
        },
        error => {
          console.error('Error fetching formation details:', error);
          this.errorMessage = 'Failed to load formation details.';
        }
      );
    }
  }

  loadTrainerDetails(trainerId: string) {
    this.service.get_compte_ID(trainerId).subscribe(
      data => {
        this.trainerDetails = data;
        console.log('Trainer details loaded:', this.trainerDetails);
      },
      error => {
        console.error('Error fetching trainer details:', error);
        this.errorMessage = 'Failed to load trainer details.';
      }
    );
  }

  assignParticipant() {
    const participantId = this.authService.getUserId();
    if (participantId && this.formationId) {
      this.service.assignParticipantToFormation(this.formationId, participantId).subscribe(
        response => {
          console.log('Participant assigned successfully', response);
        },
        error => {
          console.error('Error assigning participant:', error);
          this.errorMessage = 'Failed to assign participant.';
        }
      );
    } else {
      console.error('Participant ID or Formation ID is missing.');
      this.errorMessage = 'Participant ID or Formation ID is missing.';
    }
  }

  rating(rep1: number, rep2: number, rep3: number, rep4: number): number {
    const totalResponses = 4;
    const totalScore = rep1 + rep2 + rep3 + rep4;
    return (totalScore / (totalResponses * 5)) * 100;
  }

  feedbacksubmit(): void {
    if (this.feedback.valid) {
      const feedbackData = this.feedback.value;
      console.log('Feedback submitted:', feedbackData);
      // Handle form submission
    } else {
      console.log('Feedback form is invalid');
    }
  }
}