import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Company {
  _id?: string;
  status: number;
  company_name: string;
  email: string;
  company_type: string;
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
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = environment.apiUrl + '/companies';

  constructor(private http: HttpClient) { }

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(this.apiUrl);
  }

  getCompany(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/${id}`);
  }

  createCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(this.apiUrl, company);
  }

  updateCompany(id: string, company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${id}`, company);
  }

  deleteCompany(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
