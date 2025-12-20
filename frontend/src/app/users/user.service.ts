import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    _id?: string;
    name: string;
    email: string;
    role?: string;

    group_ids?: string[]; // IDs of assigned colleges
    status?: boolean;
    password?: string;
    googleId?: string;
    facebookId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // Use environment variable
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl).pipe(
            catchError(error => {
                console.error('Error fetching users:', error);
                return throwError(() => error);
            })
        );
    }

    createUser(user: User): Observable<User> {
        return this.http.post<User>(this.apiUrl, user);
    }

    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
    }

    // Not explicitly asked but good to have if we mimic college
    deleteUser(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
