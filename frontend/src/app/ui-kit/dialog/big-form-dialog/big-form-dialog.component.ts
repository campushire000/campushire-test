import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-big-form-dialog',
    imports: [MatButtonModule],
    templateUrl: './big-form-dialog.component.html',
    styleUrls: ['./big-form-dialog.component.scss']
})
export class BigFormDialogComponent {

    constructor(
        public dialog: MatDialog
    ) {}

    openCreateUserDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
        this.dialog.open(CreateUserDialogBox, {
            width: '600px',
            enterAnimationDuration,
            exitAnimationDuration
        });
    }

}

@Component({
    selector: 'create-user-dialog:not(p)',
    templateUrl: './create-user-dialog.html',
    standalone: false
})
export class CreateUserDialogBox {

    constructor(
        public dialogRef: MatDialogRef<CreateUserDialogBox>
    ) {}

    close(){
        this.dialogRef.close(true);
    }

}