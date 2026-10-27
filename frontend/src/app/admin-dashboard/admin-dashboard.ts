import { Component } from '@angular/core';

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

  protected setPage(page: AdminPage): void {
    this.activePage = page;
    this.sidebarOpen = false;
  }
}
