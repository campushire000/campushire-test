// src/app/college/college.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CollegeService } from '../services/college';

@Component({
  selector: 'app-college-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  templateUrl: './college.html',
  styleUrls: ['./college.scss']
})
export class CollegeFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  collegeId?: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private collegeService: CollegeService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      cro_id: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zip: [''],
        country: ['India', Validators.required]
      }),
      establishedYear: [''],
      type: ['University', Validators.required],
      affiliation: [''],
      accreditation: ['']
    });

    this.collegeId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.collegeId;

    if (this.isEditMode) {
      this.loadCollege();
      this.form.get('cro_id')?.disable();
      this.form.get('email')?.disable();
    }
  }

  loadCollege() {
    this.collegeService.getCollegeById(this.collegeId!).subscribe({
      next: (college) => this.form.patchValue(college),
      error: () => this.snackBar.open('Failed to load college', 'Close', { duration: 4000 })
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const collegeData = this.form.getRawValue();
    if (this.isEditMode) {
      collegeData.cro_id = this.form.get('cro_id')?.value;
      collegeData.email = this.form.get('email')?.value;
    }

    const action$ = this.isEditMode
      ? this.collegeService.updateCollege(this.collegeId!, collegeData)
      : this.collegeService.createCollege(collegeData);

    action$.subscribe({
      next: () => {
        this.snackBar.open(`College ${this.isEditMode ? 'updated' : 'created'} successfully!`, 'Cool!', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/colleges']);
      },
      error: (err) => {
        this.snackBar.open(err.message || 'Operation failed', 'Close', { duration: 5000 });
      }
    });
  }

  onCancel() {
    this.router.navigate(['/colleges']);
  }
}