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
  nextPage: number = 1; // Default page number
  public menuItems: any[];
  public config: any = {};
  level: number = 0;
  transparentBGClass = "";
  menuPosition = 'Side';
  constructor(
    private router: Router,
    private service: ApiserviceService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Subscribe to authentication status changes
    this.authService.authenticationStatus.subscribe((authenticated: boolean) => {
      console.log('Authenticated:', authenticated);
      this.authenticated = authenticated;
      if (authenticated) {
        this.userId = this.authService.getUserId(); // Get the userId from the authService
        this.Role = this.authService.getUserRole(); // Get the user role from the authService
        console.log('Role is:', this.Role);
      } else {
        this.Role = null;
        this.userId = null;
      }
    });
  }
  
 

  gotoformation(): void {
    console.log('Navigating to all-trainings with page:', this.nextPage);
    console.log('Authenticated:', this.authenticated);
    
    if (!this.authenticated) {
      Swal.fire("Error", "You need to be logged in to access training.", "error");
      this.router.navigate(['/sign-in'], { queryParams: { redirectTo: 'all-trainings' } });
    } else {
      this.router.navigate(['/all-trainings'], { queryParams: { page: this.nextPage } });
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
      this.router.navigate(['/user-trainings']);
    } else {
      Swal.fire("Error", "You need to be logged in to access your trainings.", "error");
    }
  }

  logout(): void {
    this.authService.logout();
    this.authenticated = false;
    this.Role = null;
    this.router.navigate(['/sign-in']); // Optionally navigate to sign-in page after logout
  }
}
