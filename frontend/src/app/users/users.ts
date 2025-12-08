// src/app/users/users.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';     // ← already there
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';          // ← make sure this line exists

interface User {
  id: number;
  name: string;
  email?: string;
  role?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,        // ← this gives you *ngIf, *ngFor, etc.
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role'];

  // Form fields
  newName = '';
  newEmail = '';
  newRole = '';

  private apiUrl = 'http://localhost:3000/users';

  // Inject both HttpClient and ChangeDetectorRef
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // ← Inject ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
  this.http.get<User[]>(this.apiUrl).subscribe({
    next: (data) => {
      // This runs in the next Angular change-detection cycle → no error
      this.users = data;
      this.cdr.detectChanges(); 
    },
    error: (err) => {
      console.error('Failed to load users', err);
    }
  });
}
  addUser() {
  if (!this.newName.trim()) return;

  const newUser = {
    name: this.newName,
    email: this.newEmail || undefined,
    role: this.newRole || undefined,
  };

  this.http.post<User>(this.apiUrl, newUser).subscribe({
    next: (created) => {
      this.users = [...this.users, created];  // immutable update = 100% safe
      this.resetForm();
      this.cdr.detectChanges();
    }
  });
}

  private resetForm() {
    this.newName = '';
    this.newEmail = '';
    this.newRole = '';
  }
}