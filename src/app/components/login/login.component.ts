import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { LoginModel } from '../../models/auth/login.model';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

declare var turnstile: any; // Cloudflare Turnstile için global değişken

@Component({
  selector: 'utk-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);

  loginObj: LoginModel = {
    nationalityId: '',
    password: '',
  };
  turnstileSiteKey = environment.turnstileSiteKey;
  isCaptchaValid = false; // Butonun başlangıçta devre dışı olması için
  captchaTheme = 'dark'; // Default theme

  ngOnInit() {
    // Get theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    this.captchaTheme = savedTheme === 'dark' ? 'dark' : 'light';
    
    // CAPTCHA success callback
    (window as any).onCaptchaSuccess = (token: string) => {
      this.isCaptchaValid = true;
      this.cdr.detectChanges();
    };
    
    window.addEventListener('storage', (event) => {
      if (event.key === 'theme') {
        this.captchaTheme = event.newValue === 'dark' ? 'dark' : 'light';
        this.cdr.detectChanges();
        if (turnstile) {
          turnstile.reset();
        }
      }
    });
  }

  onSubmit() {
    if (!this.isCaptchaValid) {
      this.toastrService.warning('Lütfen CAPTCHA doğrulamasını tamamlayın.');
      return;
    }

    this.authService.login(this.loginObj).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('expiration', response.data.expiration);
          this.toastrService.success('Giriş başarılı! Yönlendiriliyorsunuz...');
          
          // Başarılı giriş sonrası onLoginSuccess metodunu çağır
          this.onLoginSuccess();
        } else {
          this.toastrService.error('Giriş başarısız:', response.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(err.error.message, 'Giriş başarısız:');
        }
      },
    });
  }

  // Giriş başarılı olduğunda çağrılacak metot
  onLoginSuccess() {
    // Kullanıcı girişi başarılı olduğunda
    const redirectUrl = localStorage.getItem('redirectUrl');
    
    if (redirectUrl) {
      localStorage.removeItem('redirectUrl'); // URL'yi kullandıktan sonra temizle
      
      // Küçük bir gecikme ekleyerek token'ın tamamen kaydedilmesini sağla
      setTimeout(() => {
        this.router.navigateByUrl(redirectUrl).then(() => {
          window.location.reload(); // Sayfayı yenile
        });
      }, 500);
    } else {
      // URL parametresi ile gelen returnUrl'i kontrol et
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      
      if (returnUrl) {
        // Küçük bir gecikme ekleyerek token'ın tamamen kaydedilmesini sağla
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl).then(() => {
            window.location.reload(); // Sayfayı yenile
          });
        }, 500);
      } else {
        // Hem redirectUrl hem de returnUrl yoksa varsayılan sayfaya yönlendir
        setTimeout(() => {
          this.router.navigate(['/homepage']).then(() => {
            window.location.reload(); // Sayfayı yenile
          });
        }, 500);
      }
    }
  }
}