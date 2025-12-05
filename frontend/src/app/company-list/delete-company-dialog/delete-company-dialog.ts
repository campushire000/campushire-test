import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Company</h2>

    <mat-dialog-content>
      <p>Are you sure you want to delete this company?</p>

      <p><strong>{{data.companyName}}</strong></p>
      <p>City: {{data.city}}</p>
      <p>Mobile: {{data.mobile}}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-raised-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="warn" (click)="onConfirmClick()">Delete</button>
    </mat-dialog-actions>
  `,
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { companyName: string, city: string, mobile: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
