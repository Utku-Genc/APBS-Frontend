import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RegisterModel } from '../../models/auth/register.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'utk-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerObj: RegisterModel = {
    nationalityId: '',
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: ''
  };

  turnstileSiteKey = environment.turnstileSiteKey;
  isCaptchaValid = false; 
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    (window as any).onCaptchaSuccess = (token: string) => {
      console.log("CAPTCHA başarılı:", token);
      this.isCaptchaValid = true;
      this.cdr.detectChanges();
    };
  }

  onSubmit() {
    if (!this.isCaptchaValid) {
      alert("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      alert("Şifreler uyuşmuyor!");
      return;
    }

    this.authService.register(this.registerObj).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          console.log("Kayıt Başarılı, Token:", response.data.token);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("expiration", response.data.expiration);
          alert("Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz.");
          this.router.navigate(['/login']);
        } else {
          console.log("Kayıt başarısız:", response.message);
          alert("Kayıt başarısız: " + response.message);
        }
      },
      error: (err) => {
        console.error("Kayıt hatası:", err);
        alert("Bir hata oluştu, lütfen tekrar deneyin.");
      }
    });
  }
}
