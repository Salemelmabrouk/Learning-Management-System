import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { Emitters } from './emitter/emitter';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private tokenKey = 'authToken';
  private apiUrl = 'http://localhost:5000/api/users';
 
  // BehaviorSubject to keep track of authentication status
  authenticationStatus = new BehaviorSubject(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) { }

  // Method to handle user login
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response: any) => {
          if (response.token) {
            this.saveToken(response.token);
        
 
            // Extract and save userId
            const decodedToken: any = jwtDecode(response.token);
             
            
           
  
            this.authenticationStatus.next(true);
            Emitters.authEmitter.emit(true);
            this.router.navigate(['/formation']);
          }
          return response;
        }),
        catchError((error) => {
          return of({ error: 'Invalid username or password.' });
        })
      );
  }
  
  
  
  // Save token
 
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    
    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken?.id || null;
      
      if (userId) {
      // Storing user ID
        localStorage.setItem('userId', userId);
        console.log('User ID saved:', userId);
      } else {
        console.log('User ID is undefined in the token.');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    
    console.log('Token saved:', token);
  }
  // Retrieve Token
  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Retrieved Token:', token);
    return token;
  }

  // Method to extract user ID from token
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // Decode the token payload (which is base64-encoded)
    const payload = JSON.parse(atob(token.split('.')[1])); // Splits the token into header, payload, and signature

    // Assuming the user ID is stored as `id` in the payload
    const userId = payload.id || null;
    console.log('User ID:', userId);
    localStorage.setItem('userId', userId);
    return userId;
  }
    
 
  
  // Method to get user ID from local storage
  getStoredUserId(): string | null {
    return localStorage.getItem('userId');
  }
  
 
  // Method to check if user is logged in
  isLoggedIn(): boolean {
    const token = this.getToken();
    const isTokenValid: boolean = !!(token && !this.isTokenExpired(token));
    console.log('Is Logged In:', isTokenValid);
    return isTokenValid;
  }
 
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // Ensure the token is not expired
  }
  
  // Method to check if the token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const isExpired = Date.now() > expirationTime;
      console.log('Token Expiry Check:', { expirationTime, isExpired });
      return isExpired;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Consider token expired if decoding fails
    }
  }
  
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // Decode the token payload (which is base64-encoded)
    const payload = JSON.parse(atob(token.split('.')[1])); // Splits the token into header, payload, and signature

    // Assuming the role is stored as `role` in the payload
    return payload.role || null;
  }
  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem(this.tokenKey); // Remove the token
    localStorage.removeItem('userId'); // Remove the userId
    Emitters.authEmitter.emit(false);
    this.router.navigate(['/sign-in']);
  }
  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }
}
