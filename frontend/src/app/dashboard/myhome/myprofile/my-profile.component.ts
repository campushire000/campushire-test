import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StudentService, Student } from '../../../student-list/student.service';
import { AuthService } from '../../../authentication/auth.service';
import { CollegeService, College } from '../../../college-list/college.service';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { Observable, startWith, map } from 'rxjs';

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatIconModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTooltipModule
    ],
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class MyProfileComponent implements OnInit {
    studentForm: FormGroup;
    loading = true;
    error: string | null = null;
    studentId: string | null = null;
    isEditing = false;
    isNewProfile = false;
    @Output() profileSaved = new EventEmitter<void>();

    colleges: College[] = [];
    filteredColleges: Observable<College[]> | undefined;
    isCollegeLocked = false;

    constructor(
        private fb: FormBuilder,
        private studentService: StudentService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        private dateAdapter: DateAdapter<Date>,
        private collegeService: CollegeService
    ) {
        this.dateAdapter.setLocale('en-GB');
        this.studentForm = this.fb.group({
            student_name: ['', Validators.required],
            title: ['', Validators.required],
            gender: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            mobile: ['', Validators.required],
            college_name: [{ value: '', disabled: true }],
            college_id: [''],
            university: [{ value: '', disabled: true }],
            dateofbirth: ['', Validators.required],
            state: ['', Validators.required],
            city: ['', Validators.required],
            pincode: ['', Validators.required],
            currentlocation: ['', Validators.required],
            about: [''],
            educations: [[]]
        });
    }

    ngOnInit(): void {
        this.loadColleges();

        // Setup autocomplete filter
        this.filteredColleges = this.studentForm.get('college_id')?.valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.college_name;
                return name ? this._filter(name as string) : this.colleges.slice();
            })
        );

        const user = this.authService.getUser();
        if (user && user._id) {
            if (user.email) {
                this.studentForm.patchValue({ email: user.email });
            }
            this.studentService.getStudentByUserId(user._id).subscribe({
                next: (student: Student) => {
                    if (student.dateofbirth) {
                        let dobDate: Date;
                        if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(student.dateofbirth.toString().trim())) {
                            const parts = student.dateofbirth.toString().trim().split(/[-\/]/);
                            const day = +parts[0];
                            const month = +parts[1] - 1;
                            const year = +parts[2];
                            dobDate = new Date(year, month, day);
                        } else {
                            dobDate = new Date(student.dateofbirth);
                        }
                        if (!isNaN(dobDate.getTime())) {
                            // @ts-ignore
                            student.dateofbirth = dobDate;
                        }
                    }
                    this.studentId = student._id!;

                    // Determine lock status
                    if (student.college || (student as any).college_id) {
                        this.isCollegeLocked = true;
                        const colId = (student.college && (student.college as any)._id) ? (student.college as any)._id : student.college;
                        this.studentForm.patchValue({ college_id: colId });
                    } else {
                        this.isCollegeLocked = false;
                    }

                    this.studentForm.patchValue(student);
                    this.studentForm.disable();
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    if (err.status === 404) {
                        this.isNewProfile = true;
                        this.loading = false;
                        this.error = null;
                        this.isCollegeLocked = false;

                        this.studentForm.patchValue({
                            student_name: user.name || '',
                            email: user.email || '',
                        });
                        if (user.college && (user.college as any).university) {
                            this.studentForm.patchValue({ university: (user.college as any).university });
                        }
                        this.enableEdit();
                        this.cdr.detectChanges();
                    } else {
                        this.error = 'Failed to load profile.';
                        this.loading = false;
                        this.cdr.detectChanges();
                    }
                }
            });
        } else {
            this.error = 'User not authenticated.';
            this.loading = false;
            this.cdr.detectChanges();
        }
    }

    private _filter(name: string): College[] {
        const filterValue = name.toLowerCase();
        return this.colleges.filter(option => option.college_name.toLowerCase().includes(filterValue));
    }

    displayCollegeFn(collegeId: string): string {
        if (!collegeId) return '';
        const selectedCollege = this.colleges.find(c => c._id === collegeId);
        return selectedCollege ? selectedCollege.college_name : '';
    }

    loadColleges() {
        this.collegeService.getColleges().subscribe(colleges => {
            this.colleges = colleges;
            this.studentForm.get('college_id')?.updateValueAndValidity({ emitEvent: true });
        });
    }

    enableEdit() {
        this.isEditing = true;
        this.studentForm.enable();
        if (this.isCollegeLocked) {
            this.studentForm.get('college_id')?.disable();
        } else {
            this.studentForm.get('college_id')?.enable();
        }
        this.studentForm.get('university')?.disable();
    }

    cancelEdit() {
        this.isEditing = false;
        this.studentForm.disable();
        this.ngOnInit();
    }

    onSubmit() {
        if (this.studentForm.valid) {
            this.loading = true;
            const formValues = this.studentForm.getRawValue();
            const user = this.authService.getUser();

            if (this.isNewProfile) {
                let collegeId = formValues.college_id;
                // If college_id is a name (user typed but didn't select), find the ID
                const matchedCollege = this.colleges.find(c => c.college_name === collegeId);
                if (matchedCollege) {
                    collegeId = matchedCollege._id;
                }

                const newStudent: Student = {
                    ...formValues,
                    user_id: user._id,
                    college_id: collegeId || (user.college?._id || user.college)
                };

                this.studentService.createStudent(newStudent)
                    .pipe(timeout(10000))
                    .subscribe({
                        next: (student) => {
                            this.loading = false;
                            this.isEditing = false;
                            this.isNewProfile = false;
                            this.studentId = student._id!;
                            this.snackBar.open('Profile created successfully!', 'Close', {
                                duration: 3000,
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                            });
                            this.studentForm.patchValue(student);
                            this.studentForm.disable();
                            this.cdr.detectChanges();
                            this.profileSaved.emit(); // Emit event
                        },
                        error: (err) => {
                            this.error = 'Failed to create profile: ' + (err.message || 'Unknown error');
                            this.loading = false;
                            this.cdr.detectChanges();
                        }
                    });

            } else if (this.studentId) {
                const updatedStudent: Student = {
                    ...formValues,
                    _id: this.studentId
                };

                this.studentService.updateStudent(this.studentId, updatedStudent)
                    .pipe(timeout(10000))
                    .subscribe({
                        next: (student) => {
                            this.loading = false;
                            this.isEditing = false;
                            this.snackBar.open('Profile updated successfully!', 'Close', {
                                duration: 3000,
                                horizontalPosition: 'right',
                                verticalPosition: 'top',
                            });
                            this.studentForm.disable();
                            this.cdr.detectChanges();
                        },
                        error: (err) => {
                            this.error = 'Failed to update profile: ' + (err.message || 'Unknown error');
                            this.loading = false;
                            this.cdr.detectChanges();
                        }
                    });
            }
        }
    }
}
