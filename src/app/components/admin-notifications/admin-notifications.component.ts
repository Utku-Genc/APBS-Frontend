import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/auth/user.model';
import { UserListModel } from '../../models/user/user-list.model';
import { BildirimService } from '../../services/bildirim.service';
import { SendNotificationModel } from '../../models/bildirim/send-notification.model';
import { ToastService } from '../../services/toast.service';
import { SendNotificationAllModel } from '../../models/bildirim/send-notification-all.model';
import { NotificationListModel } from '../../models/bildirim/notification-list.model';

@Component({
  selector: 'utk-admin-notifications',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-notifications.component.html',
  styleUrl: './admin-notifications.component.css',
})
export class AdminNotificationsComponent implements OnInit {
  private userService = inject(UserService);
  private bildirimService = inject(BildirimService);
  private toastService = inject(ToastService);

  activeTab: string = 'list';
  selectedTab: string = 'all';
  icons = [
    'fa-home', 'fa-user', 'fa-bell', 'fa-envelope', 'fa-check', 'fa-times',
    'fa-info-circle', 'fa-exclamation-triangle', 'fa-cog', 'fa-trash',
    'fa-edit', 'fa-camera', 'fa-heart',
  ];
  presetColors: string[] = [
    '#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#D35400'
  ];


  selectedIcon: string = 'fa-bell';
  title: string = '';
  description: string = '';
  selectedColor: string = '#08A250';

  sendNotificationUserObj: SendNotificationModel = {
    kullaniciId: 0,
    baslik: this.title,
    aciklama: this.description,
    icon: this.selectedIcon,
    renk: this.selectedColor,
  };
  sendNotificationAllObj: SendNotificationAllModel = {
    baslik: this.title,
    aciklama: this.description,
    icon: this.selectedIcon,
    renk: this.selectedColor,
  };

  notifications: NotificationListModel[] = []; // Bildirim listesi
  users: UserListModel[] = []; // Tüm kullanıcılar
  filteredUsers: UserListModel[] = []; // Arama sonuçlarına göre filtrelenmiş kullanıcılar

  selectedUser: number | null = null; // Seçilen kullanıcı
  searchTerm: string = ''; // Kullanıcı arama terimi

  ngOnInit(): void {
    this.getNotifications();
    this.getUsers();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    console.log('Aktif sekme: ', tab);
  }


  updateIcon(icon: string) {
    this.selectedIcon = icon;
  }

  updateColor(event: any) {
    this.selectedColor = event.target.value;
  }

  sendNotification() {
    this.sendNotificationAllObj = {
      baslik: this.title,
      aciklama: this.description,
      icon: this.selectedIcon,
      renk: this.selectedColor,
    };
    this.bildirimService
      .sendNotificationAll(this.sendNotificationAllObj)
      .subscribe((response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
        } else {
          alert('Bildirim gönderme başarısız.');
        }
      });
  }

  sendNotificationToUser() {
    if (!this.selectedUser) {
      alert('Lütfen bir kullanıcı seçin.');
      return;
    } else {
      this.sendNotificationUserObj = {
        kullaniciId: this.selectedUser,
        baslik: this.title,
        aciklama: this.description,
        icon: this.selectedIcon,
        renk: this.selectedColor,
      };
      this.bildirimService
        .sendNotification(this.sendNotificationUserObj)
        .subscribe((response) => {
          if (response.isSuccess) {
            this.toastService.success(response.message);
          } else {
            alert('Bildirim gönderme başarısız.');
          }
        });
    }
  }

  getNotifications() {
    this.bildirimService
      .getAll()
      .subscribe((notifications) => {
        this.notifications = notifications.data;
      });
  }
  deleteNotification(id: number) {
    this.bildirimService.delete(id).subscribe(() => {
      this.getNotifications();
    });
  }



  getUsers() {
    this.userService
      .getUsersByQuery(9999999, 1, 'id', false)
      .subscribe((users) => {
        this.users = users.data;
        this.filteredUsers = users.data; // İlk başta tüm kullanıcıları göster
      });
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = this.users; // Arama terimi boşsa tüm kullanıcıları göster
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredUsers = this.users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTermLower) ||
        user.lastName.toLowerCase().includes(searchTermLower) ||
        user.id.toString().includes(searchTermLower) // Kullanıcı ID'yi de arama kriterine dahil et
    );
  }
}
