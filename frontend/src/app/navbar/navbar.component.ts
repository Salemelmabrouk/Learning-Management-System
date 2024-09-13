import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
 
  authenticated = false;
  loadingRole = false;
  id: string | null = null;
  Role: string | null = null;
  userId: string | null = null;
  token: string | null = ''; 
  formations: any[] = [];
  errorMessage: string = '';
  currentUser: any = {}; // Define currentUser here

  constructor(
    private router: Router,
    private service: ApiserviceService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
 
      this.authService.authenticationStatus.subscribe((authenticated: boolean) => {
        console.log('Authenticated:', authenticated);
        this.authenticated = authenticated;
        if (authenticated) {
          this.userId = this.authService.getUserId(); // Get the userId from the authService
          if (this.userId !== null && this.userId !== undefined) {
            this.fetchUserRole(this.userId); // Pass the userId to the fetchUserRole method
          }
        } else {
          this.Role = null;
          this.userId = null;
        }
      });
    }
  
    fetchUserRole(userId: string | null): void {
      if (userId) {
        this.loadingRole = true;
        this.service.get_compte_ID(userId).subscribe(
          (data: any) => {
            this.Role = data?.role || '';
            this.currentUser = data;
            this.loadingRole = false;
          },
          (error) => {
            console.error('Error fetching user data:', error);
            this.Role = '';
            this.loadingRole = false;
            Swal.fire("Error", "Failed to fetch user role.", "error");
          }
        );
      }
    }
    
  
    gotoformation(): void {
      if (!this.authenticated) {
        Swal.fire("Error", "You need to be logged in to access training.", "error");
      } else {
        this.router.navigate(['/formation']);
      }
    }

    gotohome(): void {
    this.router.navigate(['/home']);
  }
  gotosignin(): void {
    this.router.navigate(['/sign-in']);
  }

  gotosignup(): void {
    this.router.navigate(['/sign-up']);
  }

  gotofeedback(): void {
    this.router.navigate(['/feedback']);
  }

  gotoCreat(): void {
    this.router.navigate(['/create-formation']);
  }

  gotoaccueill(): void {
    this.router.navigate(['/accueil']);
  }

 
  gotoUserFormations(): void {
    console.log('Authenticated:', this.authenticated);
    if (this.authenticated) {
      this.router.navigate(['/user-formations']);
    } else {
      Swal.fire("Error", "You need to be logged in to access your trainings.", "error");
    }
  }

  logout(): void {
    this.authService.logout();
    this.authenticated = false;
    this.Role = null;
  }
}
