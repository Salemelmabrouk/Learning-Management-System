import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from './auth.service';
import { Router,NavigationEnd  } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private  authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    console.log('Initializing  AppComponent...');
    // Call checkTokenAndLogout if it's defined in AuthService
    if (typeof this.authService.authenticationStatus === 'function') {
      this.authService.isLoggedIn();
    }
  }

  @HostListener('window:storage', ['$event'])
  onStorageChange(event: StorageEvent) {
    if (event.storageArea === localStorage && !localStorage.getItem(this.authService.getToken() ?? '')) {
      this.authService.logout();
    }
  }
}