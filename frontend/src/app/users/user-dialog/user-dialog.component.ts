import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../user.service';
import { CollegeService, College } from '../../college-list/college.service';
import { AuthService } from '../../authentication/auth.service';

@Component({
    selector: 'app-user-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule
    ],
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {
    form: FormGroup;
    colleges: College[] = [];
    roles: string[] = ['student', 'admin', 'staff', 'recruiter'];
    isEditMode = false;
    hidePassword = true;
    isSocialUser = false;

    constructor(
        private fb: FormBuilder,
        private collegeService: CollegeService,
        public dialogRef: MatDialogRef<UserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user?: User },
        private authService: AuthService
    ) {
        this.isEditMode = !!data.user;
        this.isSocialUser = !!(data.user?.googleId || data.user?.facebookId);

        this.form = this.fb.group({
            name: [data.user?.name || '', Validators.required],
            email: [data.user?.email || '', [Validators.required, Validators.email]],
            password: [{ value: '', disabled: this.isSocialUser }], // Disabled if social user
            role: [data.user?.role || 'student', Validators.required],
            college: [data.user?.college || ''], // Store ID
            group_ids: [data.user?.group_ids || []],
            status: [data.user?.status ?? true]
        });

        // Validations
    }

    ngOnInit(): void {
        this.loadColleges();

        // Initial check
        this.checkRole(this.form.get('role')?.value);

        // Listen for changes
        this.form.get('role')?.valueChanges.subscribe(role => {
            this.checkRole(role);
        });
    }

    checkRole(role: string) {
        const groupIdsControl = this.form.get('group_ids');
        if (role === 'staff') {
            groupIdsControl?.enable();
        } else {
            groupIdsControl?.disable();
        }

        // Auto-fill college for students if adding new user or editing with empty college
        if (role === 'student') {
            const currentUser = this.authService.getUser();
            const collegeControl = this.form.get('college');

            // Only auto-fill if currently empty and user has a college
            if (currentUser && currentUser.college && !collegeControl?.value) {
                // Handle both populated object and direct ID
                const collegeId = currentUser.college._id || currentUser.college;
                collegeControl?.setValue(collegeId);
            }
        }
    }

    loadColleges() {
        this.collegeService.getColleges().subscribe(colleges => {
            // Filter to show only active colleges (status === true)
            this.colleges = colleges.filter(c => c.status);
        });
    }

    onSubmit() {
        if (this.form.valid) {
            const formValue = this.form.value;
            // If editing and password is empty, remove it so it doesn't try to update to empty string
            if (this.isEditMode && !formValue.password) {
                delete formValue.password;
            }
            // Fix: cast empty string to null for ObjectId fields to avoid Mongoose CastError
            if (!formValue.college) {
                formValue.college = null;
            }
            this.dialogRef.close(formValue);
        } else {
            this.form.markAllAsTouched();
        }
    }

    onCancel() {
        this.dialogRef.close();
    }
}
