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
import { SelectionModel } from '@angular/cdk/collections';
import { CollegeService, College } from './college.service';
import { CollegeDialogComponent } from './college-dialog/college-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';

@Component({
  selector: 'app-college-list',
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
    MatTooltipModule
  ],
  templateUrl: './college-list.component.html',
  styleUrls: ['./college-list.component.scss']
})
export class CollegeListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['status', 'college_name', 'college_type', 'email', 'contact_person_mobile', 'city', 'action'];
  dataSource = new MatTableDataSource<College>([]);
  selection = new SelectionModel<College>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private collegeService: CollegeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit() {
    this.loadColleges();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadColleges() {
    this.collegeService.getColleges().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading colleges', err);
        this.snackBar.open('Failed to load colleges', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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

  checkboxLabel(row?: College): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.college_name}`;
  }

  openCollegeDialog(college?: College) {
    const dialogRef = this.dialog.open(CollegeDialogComponent, {
      width: '95%',
      maxWidth: '95vw',
      data: { college }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (college && college._id) {
          this.updateCollege(college._id, result);
        } else {
          this.createCollege(result);
        }
      }
    });
  }

  createCollege(college: College) {
    this.collegeService.createCollege(college).subscribe({
      next: (newCollege) => {
        this.dataSource.data = [...this.dataSource.data, newCollege];
        this.snackBar.open('College created successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to create college', 'Close', { duration: 3000 })
    });
  }

  updateCollege(id: string, college: College) {
    this.collegeService.updateCollege(id, college).subscribe({
      next: (updatedCollege) => {
        const index = this.dataSource.data.findIndex(c => c._id === id);
        if (index !== -1) {
          const data = [...this.dataSource.data];
          data[index] = updatedCollege;
          this.dataSource.data = data;
        }
        this.snackBar.open('College updated successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to update college', 'Close', { duration: 3000 })
    });
  }

  deleteCollege(college: College) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { collegeName: college.college_name, city: college.city }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && college._id) {
        this.collegeService.deleteCollege(college._id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c._id !== college._id);
            this.selection.clear();
            this.snackBar.open('College deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete college', 'Close', { duration: 3000 })
        });
      }
    });
  }

  toggleStatus(college: College) {
    const newStatus = college.status === 1 ? 0 : 1;
    const updatedCollege = { ...college, status: newStatus };
    this.updateCollege(college._id!, updatedCollege);
  }
}