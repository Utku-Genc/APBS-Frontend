import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserModel } from '../../models/auth/user.model';
import { UserListModel } from '../../models/user/user-list.model';
import { BildirimService } from '../../services/bildirim.service';
import { SendNotificationModel } from '../../models/bildirim/send-notification.model';
import { ToastService } from '../../services/toast.service';

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

  selectedTab: string = 'all';
  icons = [
    'fa-home',
    'fa-user',
    'fa-bell',
    'fa-envelope',
    'fa-check',
    'fa-times',
    'fa-info-circle',
    'fa-exclamation-triangle',
    'fa-cog',
    'fa-trash',
    'fa-edit',
    'fa-camera',
    'fa-heart',
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
  

  users: UserListModel[] = []; // Tüm kullanıcılar
  filteredUsers: UserListModel[] = []; // Arama sonuçlarına göre filtrelenmiş kullanıcılar

  selectedUser: number | null = null; // Seçilen kullanıcı
  searchTerm: string = ''; // Kullanıcı arama terimi

  ngOnInit(): void {
    this.getUsers();
  }

  updateIcon(icon: string) {
    this.selectedIcon = icon;
  }

  updateColor(event: any) {
    this.selectedColor = event.target.value;
  }

  sendNotification() {
    console.log('Herkese bildirim gönderildi:', {
      title: this.title,
      description: this.description,
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
