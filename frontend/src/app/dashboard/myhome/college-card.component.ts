import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WelcomeDashboardComponent } from './welcome-dashboard/welcome-dashboard.component';
import { MyProfileComponent } from './myprofile/my-profile.component';
import { StudentLanguageComponent } from './student-language/student-language.component';
import { StudentQualificationComponent } from './student-qualification/student-qualification.component';
import { MatCardModule } from '@angular/material/card';
import { StudentService, Student } from '../../student-list/student.service';
import { AuthService } from '../../authentication/auth.service';
import { CollegeService, College } from '../../college-list/college.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
    selector: 'app-college-card',
    imports: [WelcomeDashboardComponent, NgIf, NgFor, MatCardModule, MyProfileComponent, StudentQualificationComponent, StudentLanguageComponent],
    templateUrl: './college-card.component.html',
    styleUrls: ['./college-card.component.scss']
})
export class CollegeCardComponent implements OnInit {
    student: Student | null = null;
    collegeName: string = '';
    university: string = '';
    city: string = '';
    state: string = '';
    country: string = '';

    role: string = '';
    assignedColleges: College[] = [];

    constructor(
        private studentService: StudentService,
        private authService: AuthService,
        private collegeService: CollegeService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        const user = this.authService.getUser();
        this.role = user?.role || '';
        console.log('CollegeCard Init. Role:', this.role, 'User:', user);

        if (this.role === 'student' && user?._id) {
            this.loadStudentDetails(user._id);
        } else if (this.role === 'staff') {
            this.loadStaffDetails(user);
        }
    }

    loadStudentDetails(userId: string) {
        this.studentService.getStudentByUserId(userId).subscribe({
            next: (student) => {
                this.student = student;
                this.collegeName = student.college_name || '';
                this.university = student.university || '';
                this.city = student.city || '';
                this.state = student.state || '';
                this.country = student.country || '';
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to load student for dashboard:', err);
            }
        });
    }

    loadStaffDetails(user: any) {
        const groupIds = user.group_ids || [];
        console.log('Loading Staff Details. GroupIds:', groupIds);
        if (groupIds.length > 0) {
            this.collegeService.getColleges().subscribe(colleges => {
                // Filter colleges that match the user's group_ids
                this.assignedColleges = colleges.filter(c => groupIds.includes(c._id));
                console.log('Assigned Colleges Loaded:', this.assignedColleges);
                this.cdr.detectChanges();
            });
        }
    }

    onProfileSaved() {
        console.log('Profile Saved event received. Reloading student details...');
        const user = this.authService.getUser();
        if (user && user._id && this.role === 'student') {
            this.loadStudentDetails(user._id);
        }
    }
}
