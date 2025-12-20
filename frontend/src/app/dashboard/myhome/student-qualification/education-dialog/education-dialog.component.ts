import { Component, Inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EducationItem } from '../../../../student-list/student.service';

@Component({
    selector: 'app-education-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgIf
    ],
    templateUrl: './education-dialog.component.html',
})
export class EducationDialogComponent {
    educationForm: FormGroup;
    isEditMode: boolean = false;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<EducationDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EducationItem | null
    ) {
        this.isEditMode = !!data;
        this.educationForm = this.fb.group({
            degree: [data?.degree || '', Validators.required],
            institute_name: [data?.institute_name || '', Validators.required],
            field_of_study: [data?.field_of_study || '', Validators.required],
            start_year: [data?.start_year || '', [Validators.required, Validators.pattern(/^\d{4}$/)]],
            end_year: [data?.end_year || '', [Validators.required, Validators.pattern(/^\d{4}$/)]],
            grade: [data?.grade || '', Validators.required],
            description: [data?.description || '']
        });
    }

    onSubmit(): void {
        if (this.educationForm.valid) {
            this.dialogRef.close(this.educationForm.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
