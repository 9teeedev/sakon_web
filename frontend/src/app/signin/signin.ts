import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms'
import { Auth } from '../auth';

@Component({
  standalone: true,
  selector: 'app-signin',
  styleUrl: './signin.css',
  templateUrl: './signin.html',
  imports: [RouterLink, FormsModule]
})

export class Signin {
  constructor(private router: Router, private auth: Auth){}
  errorMessage = '';

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    const { username, password} = form.value;
    
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (error) => {
        this.errorMessage = error.status === 401 ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' : 'เชื่อมจาอระบบไม่ได้ กรุณาลองอีกครั้ง';
      }
    })
  }
}
