import { Component } from '@angular/core';
import { Auth } from '../auth';
import { Router } from '@angular/router';

export type AdminPage =
  | 'dashboard'
  | 'all-users'
  | 'add-user'
  | 'user-roles'
  | 'general'
  | 'security'
  | 'notifications'
  | 'analytics'
  | 'logout';

@Component({
  imports: [],
  selector: 'app-admin-dashboard',
  styleUrl: './admin-dashboard.css',
  templateUrl: './admin-dashboard.html',
})
export class AdminDashboard {
  protected sidebarOpen = false;
  protected usersOpen = false;
  protected settingsOpen = false;
  protected activePage: AdminPage = 'dashboard';
  constructor(private auth: Auth, private router: Router){}
  protected setPage(page: AdminPage): void {
    this.activePage = page;
    this.sidebarOpen = false;
  }
  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/signin']);
  }
}
