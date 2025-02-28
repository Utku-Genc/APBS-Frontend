import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef ekledik!

@Component({
  selector: 'utk-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerObj = {
    "tcKimlik": '',
    "email": '',
    "firstName": '',
    "lastName": '',
    "dob": '',
    "password": '',
    "confirmPassword": '',
  };
  turnstileSiteKey = environment.turnstileSiteKey;
  isCaptchaValid = false; // CAPTCHA doğrulanana kadar buton devre dışı
  private cdr = inject(ChangeDetectorRef); // Change Detection için

  http = inject(HttpClient);

  ngOnInit() {
    // CAPTCHA başarılı olunca tetiklenecek fonksiyonu window nesnesine ekliyoruz
    (window as any).onCaptchaSuccess = (token: string) => {
      console.log("CAPTCHA başarılı:", token);
      this.isCaptchaValid = true; // Butonu aktif yap
      this.cdr.detectChanges(); // Angular'a "arayüzü güncelle" sinyali gönder
    };
  }

  onSubmit() {
    if (this.isCaptchaValid) {
      console.log("Kayıt işlemi başladı:", this.registerObj);
    } else {
      alert("Lütfen CAPTCHA doğrulamasını tamamlayın.");
    }
  }
}
