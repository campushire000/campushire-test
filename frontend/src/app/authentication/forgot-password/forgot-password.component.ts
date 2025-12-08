import { Component, ChangeDetectorRef } from '@angular/core';
import { CustomizerSettingsService } from '../../customizer-settings/customizer-settings.service';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [RouterLink, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, CommonModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

    forgotPasswordForm: FormGroup;
    message: string = '';
    error: string = '';

    constructor(
        public themeService: CustomizerSettingsService,
        private fb: FormBuilder,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {
        this.forgotPasswordForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit() {
        if (this.forgotPasswordForm.valid) {
            this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe({
                next: (res: any) => {
                    this.message = 'Password reset instructions have been sent to your email.';
                    this.error = '';
                },
                error: (err: any) => {
                    this.error = err.error?.message || 'Failed to send reset link.';
                    this.message = '';
                    this.cdr.detectChanges();
                }
            });
        }
    }

    toggleTheme() {
        this.themeService.toggleTheme();
    }

    toggleCardBorderTheme() {
        this.themeService.toggleCardBorderTheme();
    }

    toggleCardBorderRadiusTheme() {
        this.themeService.toggleCardBorderRadiusTheme();
    }

    toggleRTLEnabledTheme() {
        this.themeService.toggleRTLEnabledTheme();
    }

}