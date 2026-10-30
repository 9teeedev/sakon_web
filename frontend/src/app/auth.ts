import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface User {
    id: number;
    username: string;
    role: 'admin' | 'member';
}

interface LoginResponse {
    user: User;
}
@Injectable({ providedIn: 'root'})

export class Auth {
    private currentUser: User | null = null;
    private readonly storageKey = 'sakon_current_user';
    private readonly platformId = inject(PLATFORM_ID);
    private url = 'http://localhost:3000';
    constructor(private http: HttpClient){
        if(isPlatformBrowser(this.platformId)) {
            const savedUser = sessionStorage.getItem(this.storageKey);
            if(savedUser) {
                this.currentUser = JSON.parse(savedUser) as User;
            }
        }
    }
    login(username: string, password: string): Observable<LoginResponse>{
        return this.http
            .post<LoginResponse>(`${this.url}/api/login`, {username, password}, {withCredentials: true})
            .pipe(tap((response) => {
                this.currentUser = response.user;
                if (isPlatformBrowser(this.platformId)){
                    sessionStorage.setItem(
                        this.storageKey,
                        JSON.stringify(response.user)
                    )
                }
            }))
    }

    logout(): void {
        this.currentUser = null;
        if (isPlatformBrowser(this.platformId)){
            sessionStorage.removeItem(this.storageKey)
        }
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }
    getCurrentUser(): User | null {
        return this.currentUser;
    }
    isAdmin(): boolean {
        return this.currentUser?.role === 'admin';
    }
}
