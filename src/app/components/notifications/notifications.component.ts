import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'utk-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private hubConnectionBuilder!: HubConnection;
  private authService = inject(AuthService);

  notification: {
    title: string;
    message: string;
    icon: string;
    bgColor: string;
  } | null = null;
  private notificationSound!: HTMLAudioElement;
  private isSoundEnabled = false;
  isLoggedIn= false;
  ngOnInit() {
    this.notificationSound = new Audio(
      '../../../assets/audio/notification.mp3'
    );
    this.notificationSound.load(); // Önceden sesi yükle

    // Kullanıcı bir kez tıklarsa sesi aç
    document.addEventListener('click', () => {
      if (!this.isSoundEnabled) {
        this.isSoundEnabled = true;
      }
    });

    // Token alma
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      console.log('Kullanıcı Giriş Yaptı Signal bağlantı');
      // SignalR ile haberleş
      this.hubConnectionBuilder = new HubConnectionBuilder()
        .withUrl('https://localhost:44316/notificationHub')
        .build();
      this.hubConnectionBuilder
        .start()
        .then(() => console.log('SignalR Bağlantı Sağlandı.......!'))
        .catch((err) => console.error('SignalR Bağlantı Hatası:', err));

      this.hubConnectionBuilder.on('ReceiveNotification', (obj: any) => {
        console.log('SignalR Mesajı:', obj);
        this.showNotification(obj.title, obj.message, obj.icon, obj.bgColor);
      });
    }
  }

  showNotification(
    title: string,
    message: string,
    icon: string,
    bgColor: string
  ) {
    this.isSoundEnabled = true; // Ses çal
    this.notification = { title, message, icon, bgColor };

    if (this.isSoundEnabled) {
      this.playNotificationSound();
    }

    setTimeout(() => {
      this.notification = null;
      this.isSoundEnabled = false; // Sonuçları sıfırla
    }, 3000);
  }

  playNotificationSound() {
    this.notificationSound.pause(); // Eğer önceki ses çalıyorsa durdur
    this.notificationSound.currentTime = 0; // Baştan başlat
    this.notificationSound.play().catch((error) => {
      console.warn('Ses çalınamadı:', error);
    });
  }

  getRandomNotification() {
    const notifications = [
      {
        title: 'Yeni Mesaj',
        message: 'Danışmanınızdan yeni bir mesaj var.',
        icon: 'fas fa-envelope',
        bgColor: '#007bff',
      },
      {
        title: 'Başvuru Onayı',
        message: 'Başvurunuz onaylandı!',
        icon: 'fas fa-check-circle',
        bgColor: '#28a745',
      },
      {
        title: 'Sistem Güncellemesi',
        message: 'Sistem güncellemesi tamamlandı.',
        icon: 'fas fa-sync-alt',
        bgColor: '#ffc107',
      },
      {
        title: 'Uyarı',
        message: 'Önemli bir uyarınız var!',
        icon: 'fas fa-exclamation-triangle',
        bgColor: '#dc3545',
      },
      {
        title: 'Bilgilendirme',
        message: 'Yeni özellikler eklendi.',
        icon: 'fas fa-info-circle',
        bgColor: '#17a2b8',
      },
    ];
    return notifications[Math.floor(Math.random() * notifications.length)];
  }
}
