import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';
import { Student, EducationItem, StudentService } from '../../../student-list/student.service';
import { EducationDialogComponent } from './education-dialog/education-dialog.component';

@Component({
    selector: 'app-student-qualification',
    standalone: true,
    imports: [MatCardModule, MatButtonModule, MatMenuModule, MatTableModule, MatIconModule, MatDialogModule, DragDropModule, CommonModule, NgIf],
    templateUrl: './student-qualification.component.html',
    styleUrls: ['./student-qualification.component.scss']
})
export class StudentQualificationComponent implements OnInit, OnChanges {
    @Input() student: Student | null = null;
    displayedColumns: string[] = ['degree', 'institute', 'field', 'year', 'grade', 'action'];
    dataSource = new MatTableDataSource<EducationItem>([]);

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
        if (this.student && this.student.educations) {
            // Use spread operator to force a new reference, ensuring MatTable updates
            this.dataSource.data = [...this.student.educations];
        } else {
            this.dataSource.data = [];
        }
    }

    openEditDialog(education: EducationItem): void {
        this.openDialog(education, false);
    }

    addEducation(): void {
        this.openDialog({
            degree: '',
            institute_name: '',
            field_of_study: '',
            start_year: '',
            end_year: '',
            grade: '',
            description: ''
        }, true);
    }

    private openDialog(education: EducationItem, isNew: boolean): void {
        const dialogRef = this.dialog.open(EducationDialogComponent, {
            width: '600px',
            data: education
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && this.student && this.student._id) {
                const educationToUpdate = { ...education, ...result };

                this.studentService.updateEducation(this.student._id, educationToUpdate).subscribe({
                    next: (updatedEduDoc: any) => {
                        console.log('Backend updated successfully', updatedEduDoc);
                        console.log('Is New?', isNew);
                        if (isNew) {
                            if (!this.student!.educations) {
                                this.student!.educations = [];
                            }
                            if (updatedEduDoc && updatedEduDoc.educations) {
                                this.student!.educations = updatedEduDoc.educations;
                            } else {
                                this.student!.educations!.push(result);
                            }
                        } else {
                            if (updatedEduDoc && updatedEduDoc.educations) {
                                this.student!.educations = updatedEduDoc.educations;
                            } else {
                                Object.assign(education, result);
                            }
                        }
                        this.updateDataSource(); // Refresh table
                        this.cdr.detectChanges(); // Force UI update
                    },
                    error: (err: any) => {
                        console.error('Error updating education:', err);
                        alert('Failed: ' + (err.error?.message || err.message || JSON.stringify(err)));
                    }
                });
            }
        });
    }

    deleteEducation(element: EducationItem): void {
        if (!confirm('Are you sure you want to delete this education entry?')) {
            return;
        }

        if (this.student && this.student._id && element._id) {
            this.studentService.deleteEducation(this.student._id, element._id).subscribe({
                next: (res) => {
                    console.log('Deleted successfully', res);
                    if (this.student && this.student.educations) {
                        this.student.educations = this.student.educations.filter(e => e._id !== element._id);
                        this.updateDataSource(); // Refresh table
                    }
                },
                error: (err) => {
                    console.error('Error deleting education:', err);
                    alert('Failed to delete: ' + (err.error?.message || err.message));
                }
            });
        }
    }

    drop(event: CdkDragDrop<EducationItem[]>) {
        // Use dataSource.data for drag and drop to match what's on screen
        const prevIndex = this.dataSource.data.findIndex((d) => d === event.item.data); // Or just event.previousIndex
        moveItemInArray(this.dataSource.data, event.previousIndex, event.currentIndex);

        // Sync back to student model
        if (this.student) {
            this.student.educations = [...this.dataSource.data];
        }

        // Trigger table update (assignments to data triggers update)
        this.dataSource.data = [...this.dataSource.data];

        if (this.student && this.student._id) {
            this.studentService.reorderEducation(this.student._id, this.student.educations || []).subscribe({
                next: (res) => console.log('Reorder saved', res),
                error: (err) => {
                    console.error('Reorder failed', err);
                    alert('Failed to save order');
                }
            });
        }
    }
}
