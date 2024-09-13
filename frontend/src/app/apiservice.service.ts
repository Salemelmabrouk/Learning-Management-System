import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { LoginResponse } from './login-response.model';

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

  constructor(private _http: HttpClient) { }

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
    return this._http.get<{ success: boolean, message: string, data: User[] }>(`${this.baseUrl}/users`).pipe(
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
  getParticipantsByTrainingId(trainingId: string): Observable<any[]> {
    return this._http.get<any[]>(`${this.baseUrl}/formation/participants/${trainingId}`);
  }
  get_all_formation(): Observable<any> {
    return this._http.get<any>('http://localhost:5000/api/formation/all');
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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this._http.post(`${this.baseUrl}/formation/create`, formationData, { headers });
  }
 


  get_formation_by_ID(id: string): Observable<any> {
    return this._http.get(`${this.baseUrl}/formation/${id}`, { withCredentials: true });
  }
  assignParticipantToFormation(formationId: string, participantId: string): Observable<any> {
    const url = `${this.baseUrl}/formation/${formationId}/assign/${participantId}`;
    return this._http.post(url, {});
  }

  getUserFormations(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this._http.get(`${this.baseUrl}/users/${userId}/formations`, { headers });
  }
}
