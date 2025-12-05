import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { CompanyService, Company } from './company.service';
import { CompanyDialogComponent } from './company-dialog/company-dialog';
import { CustomizerSettingsService } from '../customizer-settings/customizer-settings.service';
import { DeleteConfirmationDialogComponent } from './delete-company-dialog/delete-company-dialog';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule
  ],
  templateUrl: './company-list.html',
  styleUrls: ['./company-list.scss']
})
export class CompanyListComponent implements OnInit, AfterViewInit {
displayedColumns: string[] = [
  'company_code',
  'company_name',
  'company_shortname',
  'company_type',
  'email',
  'mobile',
  'city',
  'action'
];
  dataSource = new MatTableDataSource<Company>([]);
  selection = new SelectionModel<Company>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private companyService: CompanyService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    public themeService: CustomizerSettingsService
  ) {}

  ngOnInit() {
    this.loadCompanies();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (data) => this.dataSource.data = data,
      error: () => this.snackBar.open('Failed to load companies', 'Close', { duration: 3000 })
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  openCompanyDialog(company?: Company) {
    const dialogRef = this.dialog.open(CompanyDialogComponent, {
      width: '95%',
      maxWidth: '95vw',
      data: { company }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (company && company._id) this.updateCompany(company._id, result);
        else this.createCompany(result);
      }
    });
  }

  createCompany(company: Company) {
    this.companyService.createCompany(company).subscribe({
      next: (newCompany) => {
        this.dataSource.data = [...this.dataSource.data, newCompany];
        this.snackBar.open('Company created successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to create company', 'Close', { duration: 3000 })
    });
  }

  updateCompany(id: string, company: Company) {
    this.companyService.updateCompany(id, company).subscribe({
      next: (updatedCompany) => {
        const index = this.dataSource.data.findIndex(c => c._id === id);
        if (index !== -1) {
          const data = [...this.dataSource.data];
          data[index] = updatedCompany;
          this.dataSource.data = data;
        }
        this.snackBar.open('Company updated successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to update company', 'Close', { duration: 3000 })
    });
  }

  deleteCompany(company: Company) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { name: company.company_name, city: company.city }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && company._id) {
        this.companyService.deleteCompany(company._id).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(c => c._id !== company._id);
            this.selection.clear();
            this.snackBar.open('Company deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete company', 'Close', { duration: 3000 })
        });
      }
    });
  }

//   toggleStatus(company: Company) {
//     const newStatus = company.status === 1 ? 0 : 1;
//     const updatedCompany = { ...company, status: newStatus };
//     this.updateCompany(company._id!, updatedCompany);
//   }
 }
