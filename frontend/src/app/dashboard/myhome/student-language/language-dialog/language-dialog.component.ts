import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { LanguageItem } from '../../../../student-list/student.service';

@Component({
    selector: 'app-language-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCheckboxModule, FormsModule],
    templateUrl: './language-dialog.component.html',
    styleUrls: ['./language-dialog.component.scss']
})
export class LanguageDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<LanguageDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: LanguageItem
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
