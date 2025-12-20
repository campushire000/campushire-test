import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface EducationItem {
  _id?: string;
  degree: string;
  description: string;
  end_year: string;
  field_of_study: string;
  grade: string;
  institute_name: string;
  start_year: string;
}


export interface LanguageItem {
  _id?: string;
  language: string;
  proficiency: string;
  can_read: boolean;
  can_write: boolean;
  can_speak: boolean;
}

export interface Student {
  _id?: string;
  student_name: string;
  title: string;
  gender: string;
  adhar_no?: string;
  email: string;
  mobile: string;
  college_name: string;
  college_id: string;
  college?: string | any; // Supports ID or populated object
  university: string;
  dateofbirth: string;
  state: string;
  city: string;
  currentlocation: string;
  pincode: string;
  about?: string;
  active?: boolean;
  skills?: string[];
  languages?: LanguageItem[];
  profile_image?: string;
  resume_url?: string;
  country?: string;
  user_id?: string;
  user_name?: string;
  user_email?: string;
  educations?: EducationItem[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = environment.apiUrl + '/students';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  getStudent(id: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/${id}`);
  }

  getStudentsByCollege(collegeId: string): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/college/${collegeId}`);
  }

  getStudentByUserId(userId: string): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/user/${userId}`);
  }

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateEducation(studentId: string, education: EducationItem): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${studentId}/education`, education);
  }

  deleteEducation(studentId: string, educationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${studentId}/education/${educationId}`);
  }

  reorderEducation(studentId: string, educationList: EducationItem[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${studentId}/education/reorder`, educationList);
  }

  // Language Methods

  updateLanguage(studentId: string, language: LanguageItem): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${studentId}/language`, language);
  }

  deleteLanguage(studentId: string, languageId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${studentId}/language/${languageId}`);
  }

  reorderLanguages(studentId: string, languageList: LanguageItem[]): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${studentId}/language/reorder`, languageList);
  }
}
