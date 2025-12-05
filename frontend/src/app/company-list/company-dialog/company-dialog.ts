import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Company } from '../company.service';

@Component({
  selector: 'app-company-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.company ? 'Edit Company' : 'Add New Company' }}</h2>

    <mat-dialog-content>
      <form [formGroup]="form">
        
        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Company Name</mat-label>
            <input matInput formControlName="company_name" required>
          </mat-form-field>

          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Company Type</mat-label>
            <mat-select formControlName="company_type" required>
              <mat-option value="IT">IT</mat-option>
              <mat-option value="Software">Software</mat-option>
              <mat-option value="Service">Service</mat-option>
              <mat-option value="Manufacturing">Manufacturing</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" required email>
          </mat-form-field>

          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Website</mat-label>
            <input matInput formControlName="website">
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Mobile</mat-label>
            <input matInput formControlName="mobile" required>
          </mat-form-field>

          <mat-form-field appearance="fill" class="col-6">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" required>
          </mat-form-field>
        </div>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .col-6 { flex: 1 1 calc(50% - 0.5rem); min-width: 200px; }
    mat-form-field { width: 100%; }
  `]
})
export class CompanyDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { company?: Company }
  ) {
    this.form = this.fb.group({
      _id: [data.company?._id || null],
      // status: [data.company?.status ?? 1],  
      company_name: [data.company?.company_name || '', Validators.required],
      company_type: [data.company?.company_type || 'IT', Validators.required],
      email: [data.company?.email || '', [Validators.required, Validators.email]],
      website: [data.company?.website || ''],
      mobile: [data.company?.mobile || '', Validators.required],
      city: [data.company?.city || '', Validators.required],
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
