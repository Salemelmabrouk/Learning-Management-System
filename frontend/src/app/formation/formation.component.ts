import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {
  public mydate: Date = new Date();
  public formations: any[] = []; // Array to hold formations
  public Role: string = ''; // User's role
  public token: string | null = ''; // Authentication token
  public errorMessage: string = ''; // Error message for handling errors
  starSize: number = 24;
  constructor(
    private router: Router,
    private service: ApiserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();

    // Fetch all formations when the component is initialized
    this.service.get_all_formation().subscribe({
      next: (data: any) => {
        if (data.length > 0) {
          this.formations = data.map((formation: any) => {
            // Initialize rating to 0 if it's not present
            formation.rating = formation.rating || 0;
            return formation;
          });
        } else {
          this.errorMessage = 'No formations available.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error fetching formations.';
        console.error('Error fetching formations:', error);
      }
    });
  }

  getFormationById(id: string) {
    this.service.get_formation_by_ID(id).subscribe({
      next: (res: any) => {
        console.log('Formation details:', res);
        this.Role = `${res.Role}`;
      },
      error: (error) => {
        this.errorMessage = 'Error fetching formation details.';
        console.error('Error fetching formation by ID:', error);
      }
    });
  }

  assignParticipant(formationId: string) {
    const participantId = this.authService.getUserId();
    if (participantId) {
      this.service.assignParticipantToFormation(formationId, participantId)
        .subscribe({
          next: (response) => {
            console.log('Participant assigned successfully', response);
            // Optionally update the UI or show a success message
          },
          error: (error) => {
            this.errorMessage = 'Error assigning participant.';
            console.error('Error assigning participant:', error);
          }
        });
    } else {
      this.errorMessage = 'No participant ID found.';
    }
  }

  gotofeedback() {
    this.router.navigate(['/feedback']);
  }

  // Method to get user formations
  getUserFormations(id: string) {
    this.service.getUserFormations(id, this.token as string).subscribe({
      next: (response: any) => {
        this.formations = response.data; // Assuming formations come under `data`
      },
      error: (error) => {
        this.errorMessage = 'Error fetching user formations.';
        console.error('Error fetching user formations:', error);
      }
    });
  }
  submitFeedback(formation: any): void {
    const feedbackData = {
      rating: formation.rating,
      feedback: formation.feedback,
    };
  
    this.service.create_feedback(formation._id).subscribe(
      response => {
        console.log('Feedback submitted successfully:', response);
        // Optionally, show a success message or refresh the feedback section
      },
      error => {
        console.error('Error submitting feedback:', error);
        // Handle the error (show an error message, etc.)
      }
    );
  }

  // Method to check if the formation end date is today
  isTodayEndDate(endDate: string): boolean {
    return new Date(this.mydate.toDateString()) === new Date(new Date(endDate).toDateString());
  }
}
