import { Routes } from '@angular/router';
import { Signin } from './signin/signin';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { Signup } from './signup/signup';
import { Places } from './places/places';
import { Products } from './products/products';

export const routes: Routes = [
  { path: '', redirectTo: 'signin', pathMatch: 'full'},
  { path: 'admin', component: AdminDashboard},
  { path: 'signin', component: Signin},
  { path: 'signup', component: Signup},
  { path: 'places', component: Places},
  { path: 'products', component: Products},
  { path: '**', redirectTo: 'signin'}

];