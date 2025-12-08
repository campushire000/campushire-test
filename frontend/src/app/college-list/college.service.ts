import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface College {
  _id?: string;
  status: number;
  college_name: string;
  email: string;
  college_type: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  contact_person_mobile: string;
  contact_person_email: string;
  website?: string;
  contact_person_name?: string;
  about?: string;
  address_line?: string;
  cro_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollegeService {
  private apiUrl = environment.apiUrl + '/colleges';

  constructor(private http: HttpClient) { }

  getColleges(): Observable<College[]> {
    return this.http.get<College[]>(this.apiUrl);
  }

  getCollege(id: string): Observable<College> {
    return this.http.get<College>(`${this.apiUrl}/${id}`);
  }

  createCollege(college: College): Observable<College> {
    return this.http.post<College>(this.apiUrl, college);
  }

  updateCollege(id: string, college: College): Observable<College> {
    return this.http.put<College>(`${this.apiUrl}/${id}`, college);
  }

  deleteCollege(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
