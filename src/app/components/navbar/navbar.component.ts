import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';
import { UserModel } from '../../models/auth/user.model';


@Component({
  selector: 'utk-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private router = inject(Router);

  notifications: { title: string, description: string, date: string, isRead: boolean, iconClass: string, bgColor: string}[] = [];
  isLoggedIn: boolean = false;
  isAuthenticated: boolean = false;
  userRole: string | null = null;
  profileMenuActive: boolean = false;
  mobileMenuActive: boolean = false;
  isDarkTheme: boolean = false;  // Tema durumunu takip etmek için değişken
  unreadCount: number = 0;


  userObj!: UserModel;


  ngOnInit() {
    this.router.events.pipe(filter(event=>event instanceof NavigationEnd)).subscribe(()=>{
      console.log(this.isLoggedIn + " Navbar");
      const isAlreadyLoggedIn = this.isLoggedIn
      this.isLoggedIn = this.authService.isAuthenticated();
      console.log(isAlreadyLoggedIn+"  "+this.isLoggedIn)
      if(isAlreadyLoggedIn == true && isAlreadyLoggedIn != this.isLoggedIn){
        this.toastrService.info("Token süreniz doldu tekrardan giriş yapiniz","Lütfen Tekrardan Giriş Yapınız")
        this.router.navigate(["login"])
      }
      if (this.isLoggedIn) {
        this.getUser();
        this.fetchNotifications();

      }
    })

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

  getUser() {
    console.log("---------------------------------");
    this.authService.getUserByToken().subscribe(response => {
      console.log(response.data);
      this.userObj = response.data;
    })
    this.userRole = this.authService.getUserRole();
    console.log("Tepe Rol:", this.userRole);
    console.log("---------------------------------");
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
    this.authService.logout();  // AuthService'ten logout fonksiyonunu çağır
    this.toastrService.success("Çıkış Başarılı! Ana sayfaya yönlendiriliyorsunuz.");
    setTimeout(() => {
      window.location.href = "/";  // Sayfayı yönlendiriyoruz
    }, 1000);  // 1 saniye sonra yönlendirme yapılacak
  }
  fetchNotifications() {
    // Örnek API verisi (Gerçek bir API bağlarsan buraya HTTP isteği ekleyebilirsin)
    this.notifications = [ 
      { 
        title: "Yeni Başvuru Onayı", 
        description: "Başvurunuz onaylandı!", 
        date: new Date().toISOString(), 
        isRead: false, 
        iconClass: "fas fa-check-circle", 
        bgColor: "#18e723" // Yeşil
      },
      { 
        title: "Yeni Mesaj", 
        description: "Danışmanınızdan yeni bir mesaj var.", 
        date: new Date().toISOString(), 
        isRead: false, 
        iconClass: "fas fa-envelope", 
        bgColor: "#007bff" // Mavi
      },
      { 
        title: "Sistem Güncellemesi", 
        description: "Sistem güncellemesi tamamlandı.", 
        date: new Date().toISOString(), 
        isRead: true, 
        iconClass: "fas fa-cogs", 
        bgColor: "#ffc107" // Sarı
      }
    ];
    
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;

  }

  


}
