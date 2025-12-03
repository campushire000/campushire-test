import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-lms-current-courses',
    imports: [MatCardModule, MatButtonModule, MatMenuModule],
    templateUrl: './lms-current-courses.component.html',
    styleUrls: ['./lms-current-courses.component.scss']
})
export class LmsCurrentCoursesComponent {}