import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { RegisterModel } from '../../models/auth/register.model';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'utk-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
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
  private toastrService = inject(ToastrService);

  ngOnInit() {
    (window as any).onCaptchaSuccess = (token: string) => {
      this.isCaptchaValid = true;
      this.cdr.detectChanges();
    };
  }

  onSubmit() {
    if (!this.isCaptchaValid) {
      this.toastrService.warning("Lütfen CAPTCHA doğrulamasını tamamlayın.");
      return;
    }
  
    if (this.registerObj.password !== this.registerObj.confirmPassword) {
      this.toastrService.error("Şifreler uyuşmuyor!");
      return;
    }
  
    this.authService.register(this.registerObj).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("expiration", response.data.expiration);
          this.toastrService.success("Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz.");
          setTimeout(() => {
            window.location.href = "/";  // Sayfayı yönlendiriyoruz
          }, 1000);  // 1 saniye sonra yönlendirme yapılacak
        } else {
          this.toastrService.error("Kayıt başarısız: " + response.message);
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
