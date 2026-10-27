import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
    user: {id: number, username: string, role: string};
}
@Injectable({ providedIn: 'root'})

export class Auth {
    private loggedIn = false;
    private url = 'http://localhost:3000';
    constructor(private http: HttpClient){}
    login(username: string, password: string): Observable<LoginResponse>{
        return this.http
            .post<LoginResponse>(`${this.url}/api/login`, {username, password})
            .pipe(tap(() => (this.loggedIn = true)))
    }

    logout(): void {
        this.loggedIn = false;
    }

    isLoggedIn(): boolean {
        return this.loggedIn;
    }
}
