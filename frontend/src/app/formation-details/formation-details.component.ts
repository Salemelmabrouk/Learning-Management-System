import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BreadcrumbService } from 'src/services/breadcrumb.service';

@Component({
  selector: 'app-formation-details',
  templateUrl: './formation-details.component.html',
  styleUrls: ['./formation-details.component.css']
})
export class FormationDetailsComponent implements OnInit {
  formationId: string = '';
  participantId: string = '';
  formationDetails: any;
  trainerDetails: any;
  errorMessage: string = '';
  feedback!: FormGroup;
  role: string = '';
  token: string | null = '';
  mydate: any;
  isAssigned: boolean = false;
  breadcrumbs: { url: string, label: string }[] = [];
  loading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private service: ApiserviceService,
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.feedback = this.fb.group({
      comment: ['', Validators.required],
      rating: [0, Validators.required]
    });

    this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
      this.breadcrumbs = [
        { url: '/home', label: 'Home' },
        { url: '/formation/1', label: 'Formation Details' }
      ];

      this.route.paramMap.subscribe(params => {
        this.formationId = params.get('id') || '';
        this.fetchFormationDetails(this.formationId);
      });
    });
  }

  fetchFormationDetails(id: string): void {
    this.loading = true;
    this.service.get_formation_by_ID(id).subscribe(
      (data) => {
        this.formationDetails = data;
        console.log(this.formationDetails); // Check the fetched data
        this.loading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load formation details.';
        this.loading = false;
      }
    );
  }

  loadTrainerDetails(trainerId: string) {
    this.service.get_compte_ID(trainerId).subscribe(
      data => {
        this.trainerDetails = data;
        this.formationId = data.id;
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
    console.log('Assigning participant:', participantId);
    console.log('To formation:', this.formationId);
    if (participantId && this.formationId) {
      this.service.assignParticipantToFormation(this.formationId, participantId).subscribe(
        response => {
          this.toastr.success('Participant assigned successfully');
          console.log('Participant assigned successfully', response);
        },
        error => {
          console.error('Error assigning participant:', error);
          this.errorMessage = 'Failed to assign participant. Please check the server logs for more details.';
        }
      );
    } else {
      console.error('Participant ID or Formation ID is missing.');
      this.errorMessage = 'Participant ID or Formation ID is missing.';
    }
  }

  removeParticipant(): void {
    const participantId = this.authService.getUserId();
    if (participantId && this.formationId) {
      this.service.deassignParticipantFromFormation(this.formationId, participantId).subscribe(
        response => {
          console.log('Participant removed:', response);
          this.checkAssignment(); // Refresh assignment status
        },
        error => {
          console.error('Error removing participant:', error);
        }
      );
    }
  }

  deassignParticipant(): void {
    const participantId = this.authService.getUserId(); // Get the participant ID from AuthService

    if (!participantId) {
      console.error('No participant ID found.');
      return;
    }

    this.service.deassignParticipantFromFormation(this.formationId, participantId).subscribe(
      response => {
        this.toastr.info('Participant successfully deassigned');
        console.log('Participant successfully deassigned:', response);
      },
      error => {
        console.error('Error deassigning participant:', error);
      }
    );
  }

  feedbackSubmit(): void {
    if (this.feedback.valid) {
      const feedbackData = this.feedback.value;
      this.service.create_feedback(feedbackData).subscribe(
        response => {
          this.toastr.success('Feedback submitted successfully');
          this.feedback.reset(); // Reset the form on success
        },
        error => {
          console.error('Error submitting feedback:', error);
          this.toastr.error('Failed to submit feedback');
        }
      );
    } else {
      console.log('Feedback form is invalid');
    }
  }

  checkAssignment(): void {
    this.service.checkParticipantAssignment(this.formationId).subscribe(
      response => {
        this.isAssigned = response.assigned;
      },
      error => {
        console.error('Error checking participant assignment:', error);
      }
    );
  }

  isTodayEndDate(endDate: string): boolean {
    return new Date(this.mydate.toDateString()) === new Date(new Date(endDate).toDateString());
  }
}
