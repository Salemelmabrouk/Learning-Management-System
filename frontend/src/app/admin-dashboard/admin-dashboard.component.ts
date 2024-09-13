import { Component, OnInit } from '@angular/core';
import { ApiserviceService } from '../apiservice.service';
import { AuthService } from '../auth.service';
import { User } from '../types'; // Ensure this path is correct

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  userCount: number = 0;
  formationCount: number = 0;
  trainerCount: number = 0;
  errorMessage: string = '';
  participantsCount: number = 0; 
  formations: any[] = []; // Define the type according to your response structure
  totalParticipants: number = 0;
  constructor(private apiService: ApiserviceService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    if (this.authService.isAdmin()) {
      this.apiService.get_all_user().subscribe({
        next: (response) => {
          console.log('API Response for users:', response);
  
          if (response && Array.isArray(response.data)) {
            const participants = response.data.filter((user: User) => user.role === 'participant');
            this.userCount = participants.length;
            console.log('Number of participants:', this.userCount);
          } else {
            console.error('Expected response.data to be an array but got:', response.data);
            this.userCount = 0;
          }
        },
        error: (error: any) => {
          this.errorMessage = 'Error fetching user statistics';
          console.error('Error fetching user statistics:', error);
        }
      });

      this.apiService.getAllParticipantsInAllTrainings().subscribe({
        next: (response) => {
          this.formations = response.trainings;
          this.totalParticipants = response.totalParticipants;
        },
        error: (error: any) => {
          this.errorMessage = 'Error fetching trainings with participant counts';
        }
      });}
  
      this.apiService.get_trainers_count().subscribe({
        next: (count: number) => {
          this.trainerCount = count;
        },
        error: (error: any) => {
          this.errorMessage = 'Error fetching trainer statistics';
          console.error('Error fetching trainer statistics:', error);
        }
      });
  
       
      this.apiService.get_all_formation().subscribe({
        next: (formations) => {
          console.log('Formations data:', formations);
          this.formationCount = formations.length;
        },
        error: (error: any) => {
          this.errorMessage = 'Error fetching formations';
          console.error('Error fetching formations:', error);
        }
      });
    }
  }



 
