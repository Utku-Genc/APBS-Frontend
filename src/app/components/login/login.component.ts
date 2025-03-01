import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef ekledik!
import { LoginModel } from '../../models/auth/login.model';
import { AuthService } from '../../services/auth.service';

declare var turnstile: any; // Cloudflare Turnstile için global değişken

@Component({
  selector: 'utk-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginObj: LoginModel = {
    nationalityId: '',
    password: ''
  };
  turnstileSiteKey = environment.turnstileSiteKey;
  isCaptchaValid = false; // Butonun başlangıçta devre dışı olması için
  private cdr = inject(ChangeDetectorRef); // Change Detection için
  private authService = inject(AuthService);
  http = inject(HttpClient);
  

  ngOnInit() {
    // CAPTCHA başarılı olunca tetiklenecek fonksiyonu window nesnesine ekliyoruz
    (window as any).onCaptchaSuccess = (token: string) => {
      console.log("CAPTCHA başarılı:", token);
      this.isCaptchaValid = true; // Butonu etkinleştir
      this.cdr.detectChanges(); // Angular'a "arayüzü güncelle" sinyali gönder
    };
  }
  onSubmit() {
    if (!this.isCaptchaValid) {
      alert("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }

    this.authService.login(this.loginObj).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          console.log("Giriş Başarılı, Token:", response.data.token);
          localStorage.setItem("token", response.data.token); // Token'ı sakla
          localStorage.setItem("expiration", response.data.expiration); // Kullanıcı bilgilerini sakla
          window.location.href = "/"
        } else {
          console.log("Giriş başarısız:", response.message);
        }
      },
      error: (err) => {
        console.error("Login hatası:", err);
      }
    });
  }
}