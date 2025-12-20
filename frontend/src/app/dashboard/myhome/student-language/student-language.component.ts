import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Student, LanguageItem, StudentService } from '../../../student-list/student.service';
import { LanguageDialogComponent } from './language-dialog/language-dialog.component';

@Component({
    selector: 'app-student-language',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatTableModule, MatIconModule, MatDialogModule, DragDropModule, CommonModule, NgIf],
    templateUrl: './student-language.component.html',
    styleUrls: ['./student-language.component.scss']
})
export class StudentLanguageComponent implements OnInit, OnChanges {
    @Input() student: Student | null = null;
    displayedColumns: string[] = ['language', 'proficiency', 'read', 'write', 'speak', 'action'];
    dataSource = new MatTableDataSource<LanguageItem>([]);

    constructor(private dialog: MatDialog, private studentService: StudentService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.updateDataSource();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['student']) {
            this.updateDataSource();
        }
    }

    private updateDataSource(): void {
        if (this.student && this.student.languages) {
            this.dataSource.data = [...this.student.languages];
        } else {
            this.dataSource.data = [];
        }
    }

    openEditDialog(language: LanguageItem): void {
        this.openDialog(language, false);
    }

    addLanguage(): void {
        this.openDialog({
            language: '',
            proficiency: '',
            can_read: false,
            can_write: false,
            can_speak: false
        }, true);
    }

    private openDialog(language: LanguageItem, isNew: boolean): void {
        const dialogRef = this.dialog.open(LanguageDialogComponent, {
            width: '400px',
            data: language // Note: In a real app, copy this object to prevent row referencing before save
        });

        // If we want to avoid mutating the table directly until save, we should pass a copy to dialog.
        // For simple CRUD, referencing is often done but passing a copy { ...language } is safer.
        // Since I blindly copied behavior from Qualification component, I'll stick to consistency.
        // Wait, Qualification passed 'education' reference but dialog might work on it.
        // Let's pass a copy to confirm save first.
        dialogRef.componentInstance.data = { ...language };


        dialogRef.afterClosed().subscribe(result => {
            if (result && this.student && this.student._id) {
                // 'result' contains the updated data
                // result._id *might* be present if we edited.

                // If existing, preserve _id
                const languageToUpdate = { ...language, ...result };
                if (language._id) languageToUpdate._id = language._id;

                this.studentService.updateLanguage(this.student._id, languageToUpdate).subscribe({
                    next: (updatedDoc: any) => { // Backend returns full student document or subdoc parent usually, need to check service return
                        console.log('Backend updated successfully', updatedDoc);

                        // Refetch or update local.
                        // Since backend returns updated Language subdoc (StudentLanguage) which has 'languages' array
                        if (updatedDoc && updatedDoc.languages) {
                            if (this.student) {
                                this.student.languages = updatedDoc.languages;
                            }
                        }

                        this.updateDataSource();
                        this.cdr.detectChanges();
                    },
                    error: (err: any) => {
                        console.error('Error updating language:', err);
                        alert('Failed: ' + (err.error?.message || err.message || JSON.stringify(err)));
                    }
                });
            }
        });
    }

    deleteLanguage(element: LanguageItem): void {
        if (!confirm('Are you sure you want to delete this language?')) {
            return;
        }

        if (this.student && this.student._id && element._id) {
            this.studentService.deleteLanguage(this.student._id, element._id).subscribe({
                next: (res) => {
                    console.log('Deleted successfully', res);
                    if (this.student && this.student.languages) {
                        this.student.languages = this.student.languages.filter(l => l._id !== element._id);
                        this.updateDataSource();
                    }
                },
                error: (err) => {
                    console.error('Error deleting language:', err);
                    alert('Failed to delete: ' + (err.error?.message || err.message));
                }
            });
        }
    }

    drop(event: CdkDragDrop<LanguageItem[]>) {
        const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data);
        moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);

        if (this.student) {
            this.student.languages = [...this.dataSource.data];
        }

        this.dataSource.data = [...this.dataSource.data];

        if (this.student && this.student._id) {
            this.studentService.reorderLanguages(this.student._id, this.student.languages || []).subscribe({
                next: (res) => console.log('Reorder saved', res),
                error: (err) => {
                    console.error('Reorder failed', err);
                    alert('Failed to save order');
                }
            });
        }
    }
}
