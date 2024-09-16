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
  public formations: any[] = [];
  public Role: string = '';
  public token: string | null = '';
  public errorMessage: string = '';
  public currentPage: number = 1;
  public totalPages: number = 1;
  public limit: number = 10;
  starSize: number = 24;

  constructor(
    private router: Router,
    private service: ApiserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
    this.loadFormations();
  }

  loadFormations(page: number = this.currentPage): void {
    this.service.get_all_formation(page, this.limit).subscribe({
      next: (data: any) => {
        console.log('Formations data:', data);
        if (data.trainings && data.trainings.length > 0) {
          this.formations = data.trainings.map((formation: any) => {
            console.log('data',data.trainings)
            formation.rating = formation.rating || 0;
            formation.imageUrl = formation.image?.url || ''; // Ensure `imageUrl` is a string
            console.log('Formation imageUrl:', formation.imageUrl);
            return formation;
          });
          this.currentPage = data.currentPage;
          this.totalPages = data.totalPages;

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

  // Handle page change
  changePage(page: number): void {
    this.currentPage = page;
    this.loadFormations(page);
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

  submitFeedback(formation: any): void {
    const feedbackData = {
      rating: formation.rating,
      feedback: formation.feedback,
    };

    this.service.create_feedback(formation._id).subscribe(
      response => {
        console.log('Feedback submitted successfully:', response);
      },
      error => {
        console.error('Error submitting feedback:', error);
      }
    );
  }

  isTodayEndDate(endDate: string): boolean {
    return new Date(this.mydate.toDateString()) === new Date(new Date(endDate).toDateString());
  }
}
