import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'utk-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated: boolean = false;
  profileMenuActive: boolean = false;
  mobileMenuActive: boolean = false;
  profileMenuUserName: string = 'Misafir';  // Varsayılan kullanıcı ismi
  isDarkTheme: boolean = false;  // Tema durumunu takip etmek için değişken
  
  private toastrService = inject(ToastrService);


  ngOnInit() {
    // localStorage'dan token'i kontrol et
    const token = localStorage.getItem('token');
    if (token) {
      // Token varsa kullanıcı giriş yapmış demektir
      this.isAuthenticated = true;
      this.profileMenuUserName = 'Utku Genç';  // Dinamik olarak kullanıcı adı
    }

    // localStorage'dan tema bilgisini al
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      // Eğer localStorage'da tema varsa, onu uygula
      this.setTheme(storedTheme);
    } else {
      // Eğer localStorage'da tema yoksa, tarayıcı temasına göre tema seç
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light');
    }
  }

  toggleProfileMenu() {
    this.profileMenuActive = !this.profileMenuActive;
  }

  toggleMobileMenu() {
    this.mobileMenuActive = !this.mobileMenuActive;
  }

  setTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);  // Tema tercihini localStorage'da sakla
    this.isDarkTheme = theme === 'dark';  // Tema durumunu güncelle
  }

  switchTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  logout() {
    // Kullanıcı çıkış yaptığında token'ı sil
    localStorage.removeItem('token');
    this.isAuthenticated = false;
    this.profileMenuUserName = 'Misafir';  // Varsayılan kullanıcı ismi
    this.toastrService.success("Çıkış Başarılı! Ana sayfaya yönlendiriliyorsunuz.");
    setTimeout(() => {
      window.location.href = "/";  // Sayfayı yönlendiriyoruz
    }, 1000);  // 1 saniye sonra yönlendirme yapılacak
  }
  
}
