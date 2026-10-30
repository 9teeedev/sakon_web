import { Component, signal } from '@angular/core';
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
  errorMessage = signal('');
  isLoading = signal(false);
  showPassword = false;

  onSubmit(form: NgForm): void {
    this.errorMessage.set('');
    if (form.invalid){
      this.errorMessage.set('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }
    const { username, password} = form.value;
    
    this.isLoading.set(true);
    this.auth.login(username, password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if(response.user.role === 'admin'){
          this.router.navigate(['/admin']);
        }else{
          this.router.navigate(['/places']);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error.status === 401
            ? 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            : 'เชื่อมต่อระบบไม่ได้ กรุณาลองอีกครั้ง'
        );
      }
    })
  }
}
