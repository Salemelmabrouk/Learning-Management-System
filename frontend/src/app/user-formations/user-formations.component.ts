import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { BreadcrumbService } from 'src/services/breadcrumb.service';

@Component({
  selector: 'app-user-formations',
  templateUrl: './user-formations.component.html',
  styleUrls: ['./user-formations.component.css'],
})
export class UserFormationsComponent implements OnInit {
 
  formations: any[] = [];
  errorMessage: string = '';
  userId: string | null = '';
  formationId: string | null = '';
  token: string | null = '';
  Role: string = '';          // The role of the user (participant, formateur)
  mydate: Date = new Date();    // Current date for comparison
  breadcrumbs: any[] = [];
  constructor(
    private service: ApiserviceService,
    private authService: AuthService,
    private toastr: ToastrService ,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;   });
    this.userId = this.authService.getUserId();
    this.token = this.authService.getToken();
    this.Role = this.authService.getUserRole() || '';

    if (this.userId && this.token) {
      this.fetchFormations();
    }
  }

  fetchFormations(): void {
    this.service.getUserFormations(this.userId as string).subscribe({
      next: (response) => {
        this.formations = response.data;
        if (this.formations.length > 0) {
          // Set the formationId to the first formation's ID
          this.formationId = this.formations[0].id;
          console.log('Formations fetched successfully:', this.formations);
          console.log('Formation ID set:', this.formationId);
        } else {
          console.warn('No formations found.');
        }
      },
      error: (error) => {
        this.errorMessage = 'Error fetching formations';
        console.error('Error fetching formations:', error);
      },
    });
  }
  
  // Handle feedback button click
  gotofeedback(): void {
    console.log('Navigating to feedback form...');
    // Implement your navigation logic here
  }
  deassignParticipant(formationId: string): void {
    const participantId = this.authService.getUserId();  // Get the participant ID from AuthService
  
    if (!participantId) {
      console.error('No participant ID found.');
      return;
    }
  
    if (!formationId) {
      console.error('No formation ID found.');
      return;
    }
  
    this.service.deassignParticipantFromFormation(formationId, participantId).subscribe(
      response => {
        this.toastr.info('Participant successfully deassigned');
        console.log('Participant successfully deassigned:', response);
        this.fetchFormations();  // Refresh the list of formations after deassignment
      },
      error => {
        console.error('Error deassigning participant:', error);
      }
    );
  }
 
  
  
}
