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
import Swal from 'sweetalert2';

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
  presetColors: string[] = [
    '#FF5733',
    '#33FF57',
    '#3357FF',
    '#F1C40F',
    '#8E44AD',
    '#E74C3C',
    '#3498DB',
    '#2ECC71',
    '#F39C12',
    '#D35400',
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

  notificationtoUpdate: SendNotificationModel | null = null;
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
            this.toastService.error(response.message);
          }
        });
    }
  }

  getNotifications() {
    this.bildirimService.getAll().subscribe((notifications) => {
      this.notifications = notifications.data;
    });
  }

  editNotification(notification: NotificationListModel) {
    this.notificationtoUpdate = notification;
    let selectedIcon = notification.icon;

    Swal.fire({
      title: `${notification.id} ID'li bildirimi güncelliyorsunuz`,
      html: `
        <p>Mevcut Başlık: ${notification.baslik}</p>
        <p>Mevcut Açıklama: ${notification.aciklama}</p>
        <p>Mevcut Icon: <i id="selectedIcon" class="fa ${notification.icon}"></i></p>
        <p>Mevcut Renk: <span class="color-box" style="background-color: ${notification.renk};"></span></p>
        <hr>
        <p>Yeni Bildirimin Özellikleri:</p>
        <input id="bildirimBaslik" class="swal2-input" value="${notification.baslik}" placeholder="Bildirimi Adı">
        <input id="bildirimAciklama" class="swal2-input" value="${notification.aciklama}" placeholder="Açıklama">
        <p>
          <div id="iconContainer" class="icon-list">
            ${this.icons.map(icon => `<i class="fa ${icon}" data-icon="${icon}" style="margin: 5px; cursor:pointer;"></i>`).join('')}
          </div>
        </p>
        <input id="bildirimRenk" type="color" class="swal2-input" value="${notification.renk}" placeholder="Renk">
      `,
      didOpen: () => {
        document.querySelectorAll("#iconContainer i").forEach(icon => {
          icon.addEventListener("click", function(this: HTMLElement) {
            selectedIcon = this.getAttribute("data-icon")!;
            const selectedIconElement = document.getElementById("selectedIcon");
            if (selectedIconElement) {
              selectedIconElement.className = `fa ${selectedIcon}`;
            }
          });
        });
      },
      showCancelButton: true,
      confirmButtonText: 'Güncelle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
      preConfirm: () => {
        const bildirimBaslik = (
          document.getElementById('bildirimBaslik') as HTMLInputElement
        ).value.trim();
        const bildirimAciklama = (
          document.getElementById('bildirimAciklama') as HTMLInputElement
        ).value.trim();
        const bildirimRenk = (
          document.getElementById('bildirimRenk') as HTMLInputElement
        ).value.trim();
        if (!bildirimBaslik || !bildirimAciklama || !bildirimRenk) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
        return { baslik: bildirimBaslik, aciklama: bildirimAciklama, icon: selectedIcon, renk: bildirimRenk };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedNotification = {
          id: notification.id, // ID'yi ekledik
          kullaniciId: notification.kullaniciId,
          baslik: result.value.baslik,
          aciklama: result.value.aciklama,
          icon: result.value.icon,
          renk: result.value.renk,
        };
        this.bildirimService.update(updatedNotification).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getNotifications();
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error(
              'Alan güncellenirken bir hata oluştu: ' + error.message
            );
          },
        });
      }
    });
  }
  deleteNotification(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li bildirimi siliyorsunuz!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'Hayır, iptal et',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bildirimService.delete(id).subscribe((response) => {
          this.getNotifications();
          this.toastService.success(response.message);
        });
      }
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
