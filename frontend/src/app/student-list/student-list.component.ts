import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { SelectionModel } from '@angular/cdk/collections';
import { StudentService, Student } from './student.service';
import { StudentDialogComponent } from './student-dialog/student-dialog.component';
import { DeleteStudentDialogComponent } from './delete-student-dialog/delete-student-dialog.component';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { CollegeService, College } from '../college-list/college.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['active', 'student_name', 'email', 'mobile', 'college_name', 'city', 'action'];
  dataSource = new MatTableDataSource<Student>([]);
  selection = new SelectionModel<Student>(true, []);
  colleges: College[] = [];
  selectedCollegeId: string = '';
  searchText: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private studentService: StudentService,
    private collegeService: CollegeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit() {
    this.loadStudents();
    this.loadColleges();
    
    // Custom filter predicate for client-side search only
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      const searchString = filter.toLowerCase();
      return (data.student_name?.toLowerCase() || '').includes(searchString) ||
             (data.email?.toLowerCase() || '').includes(searchString) ||
             (data.mobile?.toLowerCase() || '').includes(searchString) ||
             (data.college_name?.toLowerCase() || '').includes(searchString) ||
             (data.city?.toLowerCase() || '').includes(searchString);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadStudents(collegeId?: string) {
    if (collegeId) {
      this.studentService.getStudentsByCollege(collegeId).subscribe({
        next: (data) => {
          this.dataSource.data = data;
          // Reset paginator to first page when data changes
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
        error: (err) => {
          console.error('Error loading students', err);
          this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.studentService.getStudents().subscribe({
        next: (data) => {
          this.dataSource.data = data;
          if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
          }
        },
        error: (err) => {
          console.error('Error loading students', err);
          this.snackBar.open('Failed to load students', 'Close', { duration: 3000 });
        }
      });
    }
  }

  loadColleges() {
    this.collegeService.getColleges().subscribe({
      next: (data) => {
        // Wrap in setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.colleges = data;
        });
      },
      error: (err) => {
        console.error('Error loading colleges', err);
        this.snackBar.open('Failed to load colleges', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchText = filterValue.trim().toLowerCase();
    this.dataSource.filter = this.searchText;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.searchText = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onCollegeChange(collegeId: string) {
    this.selectedCollegeId = collegeId;
    this.loadStudents(collegeId);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: Student): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.student_name}`;
  }

  openStudentDialog(student?: Student) {
    const dialogRef = this.dialog.open(StudentDialogComponent, {
      width: '95%',
      maxWidth: '95vw',
      data: { student }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (student && student._id) {
          this.updateStudent(student._id, result);
        } else {
          this.createStudent(result);
        }
      }
    });
  }

  createStudent(student: Student) {
    this.studentService.createStudent(student).subscribe({
      next: () => {
        this.loadStudents(this.selectedCollegeId);
        this.snackBar.open('Student created successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to create student', 'Close', { duration: 3000 })
    });
  }

  updateStudent(id: string, student: Student) {
    this.studentService.updateStudent(id, student).subscribe({
      next: () => {
        this.loadStudents(this.selectedCollegeId);
        this.snackBar.open('Student updated successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to update student', 'Close', { duration: 3000 })
    });
  }

  deleteStudent(student: Student) {
    const dialogRef = this.dialog.open(DeleteStudentDialogComponent, {
      width: '400px',
      data: { student_name: student.student_name, college_name: student.college_name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && student._id) {
        this.studentService.deleteStudent(student._id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(s => s._id !== student._id);
            this.selection.clear();
            this.snackBar.open('Student deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete student', 'Close', { duration: 3000 })
        });
      }
    });
  }

  toggleStatus(student: Student) {
    const newStatus = !student.active;
    const updatedStudent = { ...student, active: newStatus };
    this.updateStudent(student._id!, updatedStudent);
  }
}
