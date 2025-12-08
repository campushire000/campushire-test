// src/app/college-list/college-dialog/college-dialog.component.ts
// purpose: college dialog component for adding and editing colleges
// author: 
// created on: 
// last modified on:  
// calling component: college-list.component.ts
// calling method: openDialog()
// calling parameters: college
// calling return value: none
// *******************************************************************************

import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { College } from '../college.service';

@Component({
  selector: 'app-college-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.college ? 'Edit College' : 'Add New College' }}</h2>
   <mat-divider style="margin: 6px 0; border-top-color: lightgray;"></mat-divider>
     <mat-dialog-content>
      <form [formGroup]="form">
        <div class="row" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem;">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>College Name</mat-label>
            <i matPrefix class="ri-building-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="college_name"  required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>College Type</mat-label>
            <i matPrefix class="ri-community-line" style="margin-left: 10px;"></i>
            <mat-select formControlName="college_type" required>
              <mat-option value="Engineering">Engineering</mat-option>
              <mat-option value="Arts and Science">Arts and Science</mat-option>
              <mat-option value="University">University</mat-option>
              <mat-option value="Post Graduate">Post Graduate</mat-option>
              <mat-option value="Pre University">Pre University</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Email</mat-label>
            <i matPrefix class="ri-mail-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="email" required email>
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Website</mat-label>
            <i matPrefix class="ri-global-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="website">
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Contact Person Name</mat-label>
            <i matPrefix class="ri-user-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="contact_person_name">
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Contact Person Mobile</mat-label>
            <i matPrefix class="ri-smartphone-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="contact_person_mobile" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Contact Person Email</mat-label>
            <i matPrefix class="ri-mail-send-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="contact_person_email" required email>
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>CRO ID</mat-label>
            <i matPrefix class="ri-id-card-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="cro_id">
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-12">
            <mat-label>Address Line</mat-label>
            <i matPrefix class="ri-map-pin-line" style="margin-left: 10px;"></i>
            <textarea matInput formControlName="address_line"></textarea>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>City</mat-label>
            <i matPrefix class="ri-building-2-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="city" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>State</mat-label>
            <i matPrefix class="ri-map-2-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="state" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Country</mat-label>
            <i matPrefix class="ri-flag-line" style="margin-left: 10px;"></i>
            <input matInput formControlName="country" required>
          </mat-form-field>
          <mat-form-field appearance="outline" class="col-6">
            <mat-label>Pincode</mat-label>
            <i matPrefix class="ri-hashtag" style="margin-left: 10px;"></i>
            <input matInput formControlName="pincode" required>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="col-12">
            <mat-label>About</mat-label>
            <i matPrefix class="ri-information-line" style="margin-left: 10px;"></i>
            <textarea matInput formControlName="about"></textarea>
          </mat-form-field>
        </div>
      </form>
    </mat-dialog-content>
    <mat-divider style="margin: 6px 0; border-top-color: lightgray;"></mat-divider>
    <mat-dialog-actions align="end">
      <button mat-raised-button mat-dialog-close class="cancel-button">Cancel</button>
      <button mat-raised-button class="save-button" [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>
   
  `,
  styles: [`
    .row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .col-6 { flex: 1 1 calc(50% - 0.5rem); min-width: 200px; }
    .col-12 { flex: 1 1 100%; }
    mat-form-field { width: 100%; }

    /* Custom style for the Save button */
    .save-button {
        background-color: darkgreen; /* Use any hex code or color name you want */
        color: white; /* Ensure text color is readable */
    }
    .cancel-button {
        background-color: darkred; /* Use any hex code or color name you want */
        color: white; /* Ensure text color is readable */
    }
    
       .dialog-title {
        background-color: var(--heraBlueColor, #3f51b5);
        color: white;
        padding: 16px 24px; /* Standard dialog padding */
        margin: -20px 0 -10px 0;
        font-size: 20px;
        font-weight: 600;
    }
    /* Style for prefix icons */
    .mat-mdc-form-field {
      i[matPrefix] {
          font-size: 20px;
          margin-right: 10px;
          color: #757575; 
          vertical-align: middle;
          display: inline-block; 
      }
    }

    /* Make input text bold */
    input[matInput], textarea[matInput], mat-select {
        font-weight: 600;
    }
  `]
})
export class CollegeDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CollegeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { college?: College }
  ) {
    this.form = this.fb.group({
      college_name: [data.college?.college_name || '', Validators.required],
      college_type: [data.college?.college_type || 'Engineering', Validators.required],
      email: [data.college?.email || '', [Validators.required, Validators.email]],
      website: [data.college?.website || ''],
      contact_person_name: [data.college?.contact_person_name || ''],
      contact_person_mobile: [data.college?.contact_person_mobile || '', Validators.required],
      contact_person_email: [data.college?.contact_person_email || '', [Validators.required, Validators.email]],
      cro_id: [data.college?.cro_id || ''],
      address_line: [data.college?.address_line || ''],
      city: [data.college?.city || '', Validators.required],
      state: [data.college?.state || '', Validators.required],
      country: [data.college?.country || 'India', Validators.required],
      pincode: [data.college?.pincode || '', Validators.required],
      about: [data.college?.about || ''],
      status: [data.college?.status ?? 1] // Default to active (1)
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
