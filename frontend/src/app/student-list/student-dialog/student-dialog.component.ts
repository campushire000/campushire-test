import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable, startWith, map } from 'rxjs';
import { Student } from '../student.service';
import { CollegeService, College } from '../../college-list/college.service';
import { UserService, User } from '../../users/user.service';
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
    MatAutocompleteModule,
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
                    <mat-label>Title</mat-label>
                    <i matPrefix class="ri-user-star-line" style="margin-left: 10px;"></i>
                    <mat-select formControlName="title">
                        <mat-option value="Mr.">Mr.</mat-option>
                        <mat-option value="Ms.">Ms.</mat-option>
                        <mat-option value="Mrs.">Mrs.</mat-option>
                        <mat-option value="Dr.">Dr.</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
             <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Gender</mat-label>
                    <i matPrefix class="ri-women-line" style="margin-left: 10px;"></i>
                     <mat-select formControlName="gender">
                        <mat-option value="Male">Male</mat-option>
                        <mat-option value="Female">Female</mat-option>
                        <mat-option value="Other">Other</mat-option>
                    </mat-select>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Name</mat-label>
                    <i matPrefix class="ri-user-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="student_name" required>
                </mat-form-field>
            </div>
             <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Date of Birth</mat-label>
                    <i matPrefix class="ri-calendar-line" style="margin-left: 10px;"></i>
                    <input matInput [matDatepicker]="picker" formControlName="dateofbirth">
                    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                    <mat-datepicker #picker></mat-datepicker>
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
                    <input matInput formControlName="college_name" [matAutocomplete]="autoCollege" required>
                    <mat-autocomplete #autoCollege="matAutocomplete" (optionSelected)="onCollegeSelect($event.option.value)">
                        <mat-option *ngFor="let college of filteredColleges | async" [value]="college.college_name">
                            {{college.college_name}}
                        </mat-option>
                    </mat-autocomplete>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>User (Login Account)</mat-label>
                    <i matPrefix class="ri-user-settings-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="user_search" [matAutocomplete]="autoUser" placeholder="Search by name or email">
                    <mat-autocomplete #autoUser="matAutocomplete" (optionSelected)="onUserSelect($event.option.value)">
                        <mat-option *ngFor="let user of filteredUsers | async" [value]="user">
                            {{user.name}} ({{user.email}})
                        </mat-option>
                    </mat-autocomplete>
                </mat-form-field>
                <!-- Hidden control to store the actual ID -->
                <input type="hidden" formControlName="user_id">
            </div>
             <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>University</mat-label>
                    <i matPrefix class="ri-bank-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="university">
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
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Country</mat-label>
                    <i matPrefix class="ri-flag-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="country" required>
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Pincode</mat-label>
                    <i matPrefix class="ri-hashtag" style="margin-left: 10px;"></i>
                    <input matInput formControlName="pincode" required>
                </mat-form-field>
            </div>
             <div class="col-lg-12">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Skills (comma separated)</mat-label>
                    <i matPrefix class="ri-code-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="skills">
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Profile Image URL</mat-label>
                    <i matPrefix class="ri-image-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="profile_image">
                </mat-form-field>
            </div>
            <div class="col-lg-6">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>Resume URL</mat-label>
                    <i matPrefix class="ri-file-text-line" style="margin-left: 10px;"></i>
                    <input matInput formControlName="resume_url">
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
  users: User[] = [];
  filteredColleges: Observable<College[]>;
  filteredUsers: Observable<User[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<StudentDialogComponent>,
    private collegeService: CollegeService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: { student?: Student }
  ) {
    this.loadColleges();
    this.loadUsers();
    this.form = this.fb.group({
      student_name: [data.student?.student_name || '', Validators.required],
      email: [data.student?.email || '', [Validators.required, Validators.email]],
      mobile: [data.student?.mobile || '', Validators.required],

      college_name: [data.student?.college_name || '', Validators.required],
      college_id: [data.student?.college_id || '', Validators.required],
      user_id: [data.student?.user_id || '', Validators.required],
      user_search: [''], // For autocomplete display
      city: [data.student?.city || '', Validators.required],

      state: [data.student?.state || '', Validators.required],
      country: [data.student?.country || 'India', Validators.required],
      pincode: [data.student?.pincode || '', Validators.required],

      title: [data.student?.title || 'Mr.'],
      gender: [data.student?.gender || 'Male'],
      university: [data.student?.university || ''],
      dateofbirth: [data.student?.dateofbirth || ''],

      skills: [data.student?.skills ? data.student.skills.join(', ') : ''],
      profile_image: [data.student?.profile_image || ''],
      resume_url: [data.student?.resume_url || '']
    });

    this.filteredColleges = this.form.get('college_name')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterColleges(value || ''))
    );

    this.filteredUsers = this.form.get('user_search')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterUsers(value || ''))
    );
  }

  private _filterColleges(value: string | null): College[] {
    const filterValue = (value || '').toLowerCase();
    return this.colleges.filter(college => college.college_name.toLowerCase().includes(filterValue));
  }

  private _filterUsers(value: any): User[] {
    if (!value) return this.users;
    const filterValue = (typeof value === 'string' ? value : value?.name || '').toLowerCase();
    return this.users.filter(user =>
      (user.name?.toLowerCase().includes(filterValue)) ||
      (user.email?.toLowerCase().includes(filterValue))
    );
  }

  loadColleges() {
    this.collegeService.getColleges().subscribe({
      next: (data) => {
        this.colleges = data;
        // Trigger filter update in case data comes late
        this.form.get('college_name')?.updateValueAndValidity({ emitEvent: true });
        console.log('Loaded colleges:', data);
      },
      error: (err) => {
        console.error('Failed to load colleges:', err);
      }
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        // If we are editing, we need to populate the user_search field
        if (this.data.student?.user_id) {
          const selectedUser = this.users.find(u => u._id === this.data.student?.user_id);
          if (selectedUser) {
            this.form.patchValue({ user_search: selectedUser.name });
            // Or better, set the object if using displayWith, but we are using optionSelected details.
            // Just setting name is fine for search box.
          }
        }
        console.log('Loaded users:', data);
      },
      error: (err) => {
        console.error('Failed to load users:', err);
      }
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

  onUserSelect(user: User) {
    if (user && user._id) {
      this.form.patchValue({
        user_id: user._id,
        user_search: user.name
      });
    }
  }

  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      // Convert skills string back to array
      if (typeof formValue.skills === 'string') {
        formValue.skills = formValue.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      }
      this.dialogRef.close(formValue);
    }
  }
}
