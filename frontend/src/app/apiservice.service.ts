import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse } from './login-response.model';
import { AuthService } from './auth.service';

interface User {
  role: string;
  // Define other properties of User if needed
}

@Injectable({
  providedIn: 'root'
}) 
export class ApiserviceService {

  private baseUrl = 'http://localhost:5000/api';
  private apiAuthentication = `${this.baseUrl}/users/login`;
  private apilogout = `${this.baseUrl}/users/logout`; // Updated URL
  private formationUrl = `${this.baseUrl}/formation`;
  private apifeedback = `${this.baseUrl}/feedback`;
  private apicompteId = `${this.baseUrl}/users`; // Updated URL

  constructor(private _http: HttpClient,private authService:  AuthService) { }

  signup(userData: any): Observable<any> {
    return this._http.post(`${this.baseUrl}/users/signup`, userData);
  }
   login(username: string, password: string): Observable<LoginResponse> {
    return this._http.post<LoginResponse>(this.apiAuthentication, { username, password });
  }

  logout(): Observable<any> {
    return this._http.post<any>(this.apilogout, {}, { withCredentials: true });
  } 
   create_feedback(data: any): Observable<any> {
    return this._http.post(this.apifeedback, data);
  } 
  get_all_user(): Observable<{ success: boolean, message: string, data: User[] }> {
    return this._http.get<{ success: boolean, message: string, data: User[] }>(`${this.baseUrl}/users/all`).pipe(
      map(response => {
        if (response.success) {
          return response;
        } else {
          console.error('API call failed:', response.message);
          throw new Error(response.message);
        }
      }),
      catchError(error => {
        console.error('Error fetching users:', error);
        return of({ success: false, message: 'Error', data: [] });
      })
    );
  }
     
  get_trainers_count(): Observable<number> {
    return this.get_all_user().pipe(
      map(response => {
        if (response.success && Array.isArray(response.data)) {
          return response.data.filter(user => user.role === 'formateur').length;
        } else {
          console.error('Unexpected response format:', response);
          return 0;
        }
      }),
      catchError(error => {
        console.error('Error fetching trainers count:', error);
        return of(0); // Return default value on error
      })
    );
  }

  getUserDetails(userId: string): Observable<any> {
    const url = `${this.baseUrl}/users/${userId}`;
    const token = localStorage.getItem('authToken');
  
    if (!token) {
      return throwError('No token found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this._http.get<any>(url, { headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching user details:', error);
        return throwError(error);
      })
    );
  }
  
  getParticipantsByTrainingId(trainingId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.baseUrl}/formation/participants/${trainingId}`);
  } 

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No token found');
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }
  

  get_all_formation(page: number): Observable<any> {
    const headers = this.getHeaders();
    const params = new HttpParams().set('page', page.toString());
    
    return this._http.get<any>(`${this.baseUrl}/formation/all`, { params, headers }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('Access forbidden: Token may have expired');
          this.authService.logout(); // Or prompt for re-login
        }
        return throwError(error);
      })
    );
  }
  
  
  
  deleteFormation(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
    return this._http.delete<any>(`${this.baseUrl}/formation/delete/${id}`, { headers });
  } 
    getAllParticipantsInAllTrainings(): Observable<any> {
    return this._http.get<any>(`${this.baseUrl}/formation/participants/all`);
  } 
    get_compte_ID(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
    return this._http.get<any>(`${this.baseUrl}/users/${id}`, { headers });
  }

  createFormationData(formationData: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // No token, redirect to login
      this.authService.logout(); // or manually navigate to the login page
      return throwError('Please log in to continue');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this._http.post<any>(`${this.baseUrl}/formation/create`, formationData, { headers }).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          // Token expired or forbidden, log out and redirect to login
          console.error('Token expired or access forbidden. Redirecting to login.');
          this.authService.logout(); // Log out and clear token
          return throwError('Please log in to continue.');
        }
        return throwError(error);
      })
    );
  }
  
  
    get_formation_by_ID(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/formation/${id}`, { withCredentials: true });
  }
  assignParticipantToFormation(formationId: string, participantId: string): Observable<any> {
    const url = `${this.baseUrl}/formation/${formationId}/assign/${participantId}`;
    // You can add a body even if empty or containing required details
    const body = {}; // Adjust if your backend requires additional data
    
    return this._http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error assigning participant:', error);
        return throwError(error);
      })
    );
  }
  
  /*deassignParticipantFromFormation(formationId: string, participantId: string): Observable<any> {
    const url = `${this.baseUrl}/formation/${formationId}/participants/${participantId}/remove`; // Update if needed
    return this._http.delete(url).pipe(
      catchError(error => {
        console.error('Error deassigning participant:', error);
        return throwError('Failed to deassign participant.'); // Customize error message as needed
      })
    );
  }
    

  checkParticipantAssignment(formationId: string, participantId: string): Observable<any> {
    return this._http.get<any>(`${this.baseUrl}/${formationId}/participants/check/${participantId}`);
  }
  
  */
  deassignParticipantFromFormation(formationId: string, userId: string): Observable<any> {
    const url = `http://localhost:5000/api/formation/${formationId}/desassign/${userId}`;
    return this._http.post<any>(url, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deassigning participant:', error);
        return throwError(error);
      })
    );
  }
  
  
  
  
  checkParticipantAssignment(formationId: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/${formationId}/participants/check`);
  }
  getUserFormations(userId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return throwError('No token found');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this._http.get<any>(`${this.baseUrl}/users/${userId}/formations`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user formations:', error);
        return throwError('Failed to fetch formations.'); // Customize error message as needed
      })
    );
  }
  checkWishlist(formationId: string) {
    const url = `${this.baseUrl}/users/wishlist/check/${formationId}`;
    return this._http.get(url, { headers: this.getHeaders() });
  }
  addToWishlist(formationId: string): Observable<any> {
    const userId = this.authService.getUserId(); 
    const url = `${this.baseUrl}/users/wishlist/add/${formationId}`;
   
    const token = localStorage.getItem('authToken');

    console.log('API URL:', url);

    if (!token) {
        return throwError('No token found');
    }

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
    });

    console.log('Request Headers:', headers);

    return this.getWishlistAndCheckFormation(formationId).pipe(
        switchMap(wishlistResponse => {
            if (wishlistResponse && wishlistResponse.inWishlist) {
                console.warn('Formation already in wishlist:', formationId);
                return throwError('Formation already in wishlist');
            }
            return this._http.post<any>(url, {}, { headers }).pipe(
                catchError((error: HttpErrorResponse) => {
                    console.error('Error adding to wishlist:', error);
                    return throwError(error);
                })
            );
        }),
        catchError(error => {
            console.error('Error checking wishlist:', error);
            return throwError(error);
        })
    );
}



removeFromWishlist(formationId: string): Observable<any> {
  const url = `${this.baseUrl}/users/wishlist/remove/${formationId}`;
  const token = localStorage.getItem('authToken');

  if (!token) {
      return throwError('No token found');
  }

  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
  });

  return this.getWishlistAndCheckFormation(formationId).pipe(
      switchMap(wishlistResponse => {
          if (!wishlistResponse.inWishlist) {
              console.warn('Formation not in wishlist:', formationId);
              return throwError('Formation not in wishlist');
          }
          return this._http.delete<any>(url, { headers }).pipe(
              catchError((error: HttpErrorResponse) => {
                  console.error('Error removing from wishlist:', error);
                  return throwError(error);
              })
          );
      }),
      catchError(error => {
          console.error('Error checking wishlist:', error);
          return throwError(error);
      })
  );
}



getWishlist(): Observable<any> {
  const url = `${this.baseUrl}/users/wishlist`
  const headers = this.getHeaders(); // Assuming this method retrieves the correct headers
  return this._http.get(url, { headers });
}


// In ApiserviceService
getWishlistAndCheckFormation(formationId: string): Observable<any> {
  const url = `${this.baseUrl}/users/wishlist/check/${formationId}`;
  const token = localStorage.getItem('authToken');

  if (!token) {
      return throwError('No token found');
  }

  const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
  });

  return this._http.get<any>(url, { headers }).pipe(
      map(response => {
          // Assuming your backend returns an object like { inWishlist: true/false }
          return response.inWishlist ? { inWishlist: true } : { inWishlist: false };
      }),
      catchError((error: HttpErrorResponse) => {
          console.error('Error checking formation in wishlist:', error);
          return throwError(error);
      })
  );
}
 

}  
