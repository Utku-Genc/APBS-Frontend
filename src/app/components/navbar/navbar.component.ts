import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { filter, Subscription } from 'rxjs';
import { UserModel } from '../../models/auth/user.model';
import { NotificationListModel } from '../../models/bildirim/notification-list.model';
import { BildirimService } from '../../services/bildirim.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'utk-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  private bildirimService = inject(BildirimService);

  notifications: NotificationListModel[] = [];
  isLoggedIn: boolean = false;
  isAuthenticated: boolean = false;
  userRole: string | null = null;
  profileMenuActive: boolean = false;
  mobileMenuActive: boolean = false;
  isDarkTheme: boolean = false;  // Tema durumunu takip etmek için değişken
  unreadCount: number = 0;

  userObj!: UserModel;
  private notificationSubscription?: Subscription;
  private routerSubscription?: Subscription;

  ngOnInit() {
    // İlk olarak tema ayarlarını uygula
    this.applyThemeSettings();
    
    // Sonra kullanıcı kimlik doğrulama kontrolü
    this.isLoggedIn = this.authService.isAuthenticated();
  
    // Listen to router events to check authentication status
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const isAlreadyLoggedIn = this.isLoggedIn;
        this.isLoggedIn = this.authService.isAuthenticated();
        
        // If user was logged in but now isn't, show message and redirect
        if (isAlreadyLoggedIn === true && isAlreadyLoggedIn !== this.isLoggedIn) {
          // Token süresi dolmadan önce mevcut sayfanın URL'sini kaydet
          const currentUrl = this.router.url;
          localStorage.setItem('redirectUrl', currentUrl);
          
          this.toastrService.info("Token süreniz doldu tekrardan giriş yapiniz", "Lütfen Tekrardan Giriş Yapınız");
          window.location.href = "/login";
        }
  
        if (this.isLoggedIn && !isAlreadyLoggedIn) {
          this.getUser();
          this.setupNotifications();
          
          // Token yenilendikten sonra, kaydedilen URL'ye yönlendir (eğer varsa)
          const redirectUrl = localStorage.getItem('redirectUrl');
          if (redirectUrl) {
            localStorage.removeItem('redirectUrl'); // URL'yi kullandıktan sonra temizle
            this.router.navigateByUrl(redirectUrl);
          }
        }
      });
  
    if (this.isLoggedIn) {
      this.getUser();
      this.setupNotifications();
    }
  }

  // Tema ayarlarını uygulamak için ayrı bir metod
  applyThemeSettings() {
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

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  setupNotifications() {
    this.fetchNotifications();
    if (!this.notificationSubscription) {
      this.notificationSubscription = this.bildirimService.notificationUpdated$.subscribe(updated => {
        if (updated) {
          this.fetchNotifications();
        }
      });
    }
  }

  getUser() {
    this.userService.getUserByToken().subscribe(response => {
      this.userObj = response.data;
    });
    this.userRole = this.authService.getUserRole();
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
    this.bildirimService.getMyPaginatedNotifications(1,10,"tarih", true).subscribe(response => {
      this.notifications = response.data.filter(n => !n.status);
      this.unreadCount = this.notifications.length;
    });
  }
}