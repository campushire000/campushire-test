import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Confirmation</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete the following company?</p>
      <p><strong>{{data.companyName}} - {{data.city}}</strong></p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button class="cancel-btn" (click)="onNoClick()">Cancel</button>
      <button mat-raised-button class="confirm-btn" (click)="onConfirmClick()">Delete</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-btn {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { companyName: string, city: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
