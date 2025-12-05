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
              <mat-option value="Manufacturing">Manufacturing</mat-option>
              <mat-option value="Education">Education</mat-option>
              <mat-option value="Healthcare">Healthcare</mat-option>
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
            <mat-label>Contact Person Name</mat-label>
            <input matInput formControlName="contact_person_name">
          </mat-form-field>
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Contact Person Mobile</mat-label>
            <input matInput formControlName="contact_person_mobile" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Contact Person Email</mat-label>
            <input matInput formControlName="contact_person_email" required email>
          </mat-form-field>
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Address Line</mat-label>
            <input matInput formControlName="address_line">
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" required>
          </mat-form-field>
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>State</mat-label>
            <input matInput formControlName="state" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Country</mat-label>
            <input matInput formControlName="country" required>
          </mat-form-field>
          <mat-form-field appearance="fill" class="col-6">
            <mat-label>Pincode</mat-label>
            <input matInput formControlName="pincode" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="fill" class="col-12">
            <mat-label>About</mat-label>
            <textarea matInput formControlName="about"></textarea>
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
    .col-12 { flex: 1 1 100%; }
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
      company_name: [data.company?.company_name || '', Validators.required],
      company_type: [data.company?.company_type || 'IT', Validators.required],
      email: [data.company?.email || '', [Validators.required, Validators.email]],
      website: [data.company?.website || ''],
      contact_person_name: [data.company?.contact_person_name || ''],
      contact_person_mobile: [data.company?.contact_person_mobile || '', Validators.required],
      contact_person_email: [data.company?.contact_person_email || '', [Validators.required, Validators.email]],
      address_line: [data.company?.address_line || ''],
      city: [data.company?.city || '', Validators.required],
      state: [data.company?.state || '', Validators.required],
      country: [data.company?.country || 'India', Validators.required],
      pincode: [data.company?.pincode || '', Validators.required],
      about: [data.company?.about || ''],
      status: [data.company?.status ?? 1] // Default active
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
