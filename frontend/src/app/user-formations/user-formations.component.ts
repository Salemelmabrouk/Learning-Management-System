import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-formations',
  templateUrl: './user-formations.component.html',
  styleUrls: ['./user-formations.component.css'],
})
export class UserFormationsComponent implements OnInit {
 
  formations: any[] = [];
  errorMessage: string = '';
  userId: string | null = '';
  token: string | null = '';
  Role: string = '';          // The role of the user (participant, formateur)
  mydate: Date = new Date();    // Current date for comparison

  constructor(
    private service: ApiserviceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.token = this.authService.getToken();
    this.Role = this.authService.getUserRole() || '';

    if (this.userId && this.token) {
      this.fetchFormations();
    }
  }

  fetchFormations(): void {
    this.service.getUserFormations(this.userId as string, this.token as string).subscribe({
      next: (response) => {
        this.formations = response.data;
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
  deleteFormation(id: string): void {
    this.service.deleteFormation(id).subscribe({
      next: (response) => {
        console.log('Formation deleted successfully');
        this.fetchFormations();
      },
      error: (error) => {
        this.errorMessage = 'Error deleting formation';
        console.error('Error deleting formation:', error);
      },
    }); 
  }
}
