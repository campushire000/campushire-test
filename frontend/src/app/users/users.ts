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
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService, User } from './user.service';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { College } from '../college-list/college.service';
import { CollegeService } from '../college-list/college.service';

@Component({
  selector: 'app-users',
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
    MatTooltipModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['status', 'name', 'email', 'role', 'college', 'createdAt', 'action'];
  dataSource = new MatTableDataSource<User>([]);
  collegesMap: Map<string, string> = new Map();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UserService,
    private collegeService: CollegeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public themeService: CustomizerSettingsService
  ) { }

  ngOnInit() {
    this.loadColleges(); // Load colleges first for mapping
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadColleges() {
    this.collegeService.getColleges().subscribe({
      next: (data) => {
        data.forEach(c => {
          if (c._id) this.collegesMap.set(c._id, c.college_name);
        });
      }
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
      }
    });
  }

  getCollegeName(collegeId?: string | any): string {
    if (!collegeId) return '-';
    // If it's already an object (populated)
    if (typeof collegeId === 'object' && collegeId.college_name) {
      return collegeId.college_name;
    }
    // If it's an ID
    return this.collegesMap.get(collegeId) || '-';
  }

  getGroupNames(groupIds: any): string[] {
    if (!groupIds || !Array.isArray(groupIds) || groupIds.length === 0) return ['-'];

    return groupIds.map(id => {
      // Handle if id is populated object or string
      if (typeof id === 'object' && id.college_name) return id.college_name;
      return this.collegesMap.get(id) || '-';
    });
  }

  getAssignedColleges(user: User): string[] {
    if (user.role === 'admin') return ['All'];
    if (user.role === 'student') return [this.getCollegeName(user.college)];
    if (user.role === 'staff') return this.getGroupNames(user.group_ids);
    return ['-'];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user && user._id) {
          this.updateUser(user._id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  createUser(user: User) {
    this.userService.createUser(user).subscribe({
      next: (newUser) => {
        this.dataSource.data = [...this.dataSource.data, newUser];
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.loadUsers(); // Reload to get fresh data/populated fields if any
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to create user', 'Close', { duration: 3000 });
      }
    });
  }

  updateUser(id: string, user: Partial<User>) {
    this.userService.updateUser(id, user).subscribe({
      next: (updatedUser) => {
        // Update local data
        const index = this.dataSource.data.findIndex(u => u._id === id);
        if (index !== -1) {
          const data = [...this.dataSource.data];
          data[index] = { ...data[index], ...updatedUser }; // Merge to keep other fields
          this.dataSource.data = data;
        }
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.loadUsers(); // Reload safest for populated fields
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to update user', 'Close', { duration: 3000 });
      }
    });
  }

  toggleStatus(user: User) {
    const newStatus = !user.status;
    this.updateUser(user._id!, { status: newStatus });
  }

  // Optional: Delete user if needed, but not requested explicitly, though standard.
  // I won't implement delete unless asked to keep it consistent with request "edit, activate/deactivate, assign college, role change".
}