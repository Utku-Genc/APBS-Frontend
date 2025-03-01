import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef ekledik!
import { LoginModel } from '../../models/auth/login.model';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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
  private toastrService = inject(ToastrService);
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
      this.toastrService.warning("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }
    this.authService.login(this.loginObj).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          console.log("Giriş Başarılı, Token:", response.data.token);
          localStorage.setItem("token", response.data.token); // Token'ı sakla
          localStorage.setItem("expiration", response.data.expiration); // Kullanıcı bilgilerini sakla
          this.toastrService.success("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz.");
          setTimeout(() => {
            window.location.href = "/";  // Sayfayı yönlendiriyoruz
          }, 1000);  // 1 saniye sonra yönlendirme yapılacak
        } else {
          console.log("Giriş başarısız:", response.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          // Hata mesajlarını bir dizi olarak alıyoruz
          const errorMessages = err.error.ValidationErrors.map((error: { ErrorMessage: string }) => error.ErrorMessage);
          
          // Her hata mesajını ayrı ayrı göstermek için forEach ile döngü oluşturuyoruz
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message); // Her hata mesajını ayrı ayrı gösteriyoruz
          });
        } else {
          this.toastrService.error("Bir hata oluştu, lütfen tekrar deneyin.", "Hata");
        }
      }
    });
  }
}