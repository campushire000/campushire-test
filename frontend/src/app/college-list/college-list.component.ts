// src/app/college-list/college-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CollegeService, College } from '../services/college';

@Component({
  selector: 'app-college-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  template: `
    <div class="container">
      <div class="header">
        <h1>All Colleges</h1>
        <button mat-raised-button color="primary" routerLink="/colleges/new">
          Add New College
        </button>
      </div>

      <div *ngIf="colleges.length === 0" class="empty">
        <h3>No colleges yet</h3>
        <p>Click the button above to create your first one!</p>
      </div>

      <div class="grid">
        <mat-card *ngFor="let c of colleges" class="card">
          <mat-card-header>
            <mat-card-title>{{ c.name }}</mat-card-title>
            <mat-card-subtitle>
              {{ c.type }} • {{ c.address.city || '—' }}
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p><strong>CRO ID:</strong> {{ c.cro_id }}</p>
            <p><strong>Email:</strong> {{ c.email }}</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-stroked-button color="accent" [routerLink]="['/colleges/edit', c._id]">
              EDIT
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    .header h1 { margin: 0; color: #1976d2; }
    .empty { text-align: center; padding: 5rem 0; color: #666; }
    .grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
    .card { height: 100%; display: flex; flex-direction: column; justify-content: space-between; }
  `]
})
export class CollegeListComponent implements OnInit {
  colleges: College[] = [];

  constructor(
    private collegeService: CollegeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.collegeService.getColleges().subscribe({
      next: (data) => this.colleges = data,
      error: () => this.snackBar.open('Failed to load colleges', 'Close', { duration: 3000 })
    });
  }
}