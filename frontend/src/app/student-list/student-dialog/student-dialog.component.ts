import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Student } from '../student.service';
import { CollegeService, College } from '../../college-list/college.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-student-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">{{ data.student ? 'Edit' : 'Add' }} Student</h2>
      <mat-divider style="margin: 0; border-top-color: lightgray;"></mat-divider>

    <mat-dialog-content>
      <form [formGroup]="form">
        <div class="row">
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Name</mat-label>
                    <i matPrefix class="ri-user-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="student_name" required>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Email</mat-label>
                    <i matPrefix class="ri-mail-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="email" required>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Mobile</mat-label>
                    <i matPrefix class="ri-smartphone-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="mobile" required>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>College Name</mat-label>
                    <i matPrefix class="ri-building-line" style="margin-left: 10px;"></i>
                    <mat-select formControlName="college_name" (selectionChange)="onCollegeSelect($event.value)" required>
                        <mat-option *ngFor="let college of colleges" [value]="college.college_name">
                            {{college.college_name}}
                        </mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>City</mat-label>
                    <i matPrefix class="ri-building-2-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="city" required>
                </mat-form-field>
            </div>
             <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>State</mat-label>
                    <i matPrefix class="ri-map-2-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="state" required>
                </mat-form-field>
            </div>
        </div>
      </form>
    </mat-dialog-content>
       <mat-divider style="margin: 6px 0; border-top-color: lightgray;"></mat-divider>

    <mat-dialog-actions align="end" class="dialog-action">
      <button mat-raised-button mat-dialog-close class="cancel-button">Cancel</button>
      <button mat-raised-button class="save-button"  [disabled]="form.invalid" (click)="save()">Save</button>
    </mat-dialog-actions>

   
  `,
  styles: [`
    .w-100 { width: 100%; }
    .row { display: flex; flex-wrap: wrap; margin: 0 -10px; }
    .col-lg-6 { width: 50%; padding: 0 10px; box-sizing: border-box; }
    
    .dialog-title {
        background-color: var(--heraBlueColor, #3f51b5);
        color: white;
        padding: 16px 24px; /* Standard dialog padding */
        margin: -20px 0 -10px 0;
        font-size: 20px;
        font-weight: 600;
    }
    
      .dialog-action {
       
        padding: 16px 24px; /* Standard dialog padding */
        margin: -10px 0 0 0;
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
/* Custom style for the Save button */
    .save-button {
        background-color: darkgreen; /* Use any hex code or color name you want */
        color: white; /* Ensure text color is readable */
    }
    .cancel-button {
        background-color: darkred; /* Use any hex code or color name you want */
        color: white; /* Ensure text color is readable */
    }
    
    /* Style for prefix icons */
    

    /* Make input text bold */
    input[matInput], textarea[matInput], mat-select {
        font-weight: 600;
    }
  `]
})
export class StudentDialogComponent {
  form: FormGroup;
  colleges: College[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private collegeService: CollegeService,
    @Inject(MAT_DIALOG_DATA) public data: { student?: Student }
  ) {
    this.loadColleges();
    this.form = this.fb.group({
      student_name: [data.student?.student_name || '', Validators.required],
      email: [data.student?.email || '', [Validators.required, Validators.email]],
      mobile: [data.student?.mobile || '', Validators.required],
      college_name: [data.student?.college_name || '', Validators.required],
      college_id: [data.student?.college_id || '', Validators.required],
      city: [data.student?.city || '', Validators.required],
      state: [data.student?.state || '', Validators.required],
      // Add other fields as needed, keeping it simple for now
      title: [data.student?.title || 'Mr.'],
      gender: [data.student?.gender || 'Male'],
      university: [data.student?.university || 'JNTUH'],
      dateofbirth: [data.student?.dateofbirth || ''],
      currentlocation: [data.student?.currentlocation || ''],
      pincode: [data.student?.pincode || '']
    });
  }

  loadColleges() {
    this.collegeService.getColleges().subscribe(data => {
      this.colleges = data;
    });
  }

  onCollegeSelect(collegeName: string) {
    const selectedCollege = this.colleges.find(c => c.college_name === collegeName);
    if (selectedCollege && selectedCollege._id) {
      this.form.patchValue({
        college_id: selectedCollege._id
      });
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
