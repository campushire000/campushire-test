import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  university: string;
  dateofbirth: string;
  state: string;
  city: string;
  currentlocation: string;
  pincode: string;
  about?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = 'http://localhost:3000/students';

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

  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  updateStudent(id: string, student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
