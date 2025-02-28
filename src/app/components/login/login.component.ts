import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core'; // ChangeDetectorRef ekledik!

declare var turnstile: any; // Cloudflare Turnstile için global değişken

@Component({
  selector: 'utk-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginObj = {
    "tcKimlik": '',
    "password": '',  
  };
  turnstileSiteKey = environment.turnstileSiteKey;
  isCaptchaValid = false; // Butonun başlangıçta devre dışı olması için
  private cdr = inject(ChangeDetectorRef); // Change Detection için

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
    if (this.isCaptchaValid) {
      console.log(this.loginObj);
    } else {
      alert("Lütfen CAPTCHA doğrulamasını tamamlayın.");
    }
  }
}
