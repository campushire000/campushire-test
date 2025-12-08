import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-student-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-student-dialog.component.html',
  styles: [`
    .confirm-btn {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class DeleteStudentDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteStudentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { student_name: string, college_name: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
