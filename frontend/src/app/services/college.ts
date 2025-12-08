import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country: string;
}

export interface College {
  _id?: string;
  name: string;
  cro_id: string;
  email: string;
  phone?: string;
  website?: string;
  address: Address;
  establishedYear?: number;
  type: string;
  affiliation?: string;
  accreditation?: string;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollegeService {

  // Change this to your actual backend API URL
  private apiUrl = 'http://localhost:3000/api/colleges'; // Example: Express + MongoDB

  constructor(private http: HttpClient) { }

  /** CREATE */
  createCollege(college: College): Observable<College> {
    return this.http.post<College>(this.apiUrl, college)
      .pipe(catchError(this.handleError));
  }

  /** READ - All */
  getColleges(): Observable<College[]> {
    return this.http.get<College[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /** READ - Single */
  getCollegeById(id: string): Observable<College> {
    return this.http.get<College>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /** UPDATE */
  updateCollege(id: string, college: Partial<College>): Observable<College> {
    return this.http.put<College>(`${this.apiUrl}/${id}`, college)
      .pipe(catchError(this.handleError));
  }

  /** DELETE */
  deleteCollege(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Centralized error handler
  private handleError(error: HttpErrorResponse) {
    let message = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      message = error.error.message;
    } else {
      // Server-side error
      if (error.status === 400) {
        message = error.error.message || 'Bad request. Please check your input.';
      } else if (error.status === 409) {
        message = error.error.message || 'College with this CRO ID or Email already exists.';
      } else if (error.status === 404) {
        message = 'College not found.';
      } else if (error.status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }

    return throwError(() => ({ message }));
  }
}