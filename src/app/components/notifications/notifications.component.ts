import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'utk-notifications',
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})

export class NotificationsComponent implements OnInit {
  notification: { title: string; message: string; icon: string; bgColor: string; } | null = null;
  private notificationSound!: HTMLAudioElement;
  private isSoundEnabled = false;

  ngOnInit() {
    this.notificationSound = new Audio('../../../assets/audio/notification.mp3');
    this.notificationSound.load(); // Önceden sesi yükle

    // Kullanıcı bir kez tıklarsa sesi aç
    document.addEventListener("click", () => {
      if (!this.isSoundEnabled) {
        this.isSoundEnabled = true;
      }
    });

    setInterval(() => {
      const newNotification = this.getRandomNotification();
      this.showNotification(newNotification.title, newNotification.message, newNotification.icon, newNotification.bgColor);
    }, 5000);
  }

  showNotification(title: string, message: string, icon: string, bgColor: string) {
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
    this.notificationSound.play().catch(error => {
      console.warn("Ses çalınamadı:", error);
    });
  }

  getRandomNotification() {
    const notifications = [
      { title: "Yeni Mesaj", message: "Danışmanınızdan yeni bir mesaj var.", icon: "fas fa-envelope", bgColor: "#007bff" },
      { title: "Başvuru Onayı", message: "Başvurunuz onaylandı!", icon: "fas fa-check-circle", bgColor: "#28a745" },
      { title: "Sistem Güncellemesi", message: "Sistem güncellemesi tamamlandı.", icon: "fas fa-sync-alt", bgColor: "#ffc107" },
      { title: "Uyarı", message: "Önemli bir uyarınız var!", icon: "fas fa-exclamation-triangle", bgColor: "#dc3545" },
      { title: "Bilgilendirme", message: "Yeni özellikler eklendi.", icon: "fas fa-info-circle", bgColor: "#17a2b8" }
    ];
    return notifications[Math.floor(Math.random() * notifications.length)];
  }
}
