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
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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

  filtersOpen: boolean = false;

  pageSize: number = 12;
  pageNumber: number = 1;
  sortBy: string = 'id';
  isDescending: boolean = false;
  filters: any = {
    id: null,
    baslik: '',
    kullaniciId: null,
    status: null,
    minTarih: null,
    maxTarih: null,
  };
  private handlingUrlParams = false;

  filtersForUser = {
    firstName: '',
    lastName: '',
    email: '',
    nationalityId: '',
    searchTerm: '',
    status: undefined,
    minDateOfBirth: '',
    maxDateOfBirth: '',
  };
  pageNumberForUser = 1;
  pageSizeForUser = 10;
  sortByForUser = 'id';
  isDescendingForUser = false;

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
    // URL parametrelerini dinle
    this.route.queryParams.subscribe((params) => {
      this.handlingUrlParams = true;

      // Sayfa ve sıralama parametrelerini al
      this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
      this.sortBy = params['sortBy'] || 'id';
      this.isDescending = params['isDescending'] === 'true';

      // Filtre parametrelerini al
      this.filters = {
        id: params['id'] ? parseInt(params['id']) : null,
        baslik: params['baslik'] || '',
        status: params['status'] !== undefined ? params['status'] === 'true' : null,
        kullaniciId: params['kullaniciId'] ? parseInt(params['kullaniciId']) : null,
        minTarih: params['minTarih'] || null,
        maxTarih: params['maxTarih'] || null,
      };

      // URL'den alınan tarih değerlerini tarih input alanlarında göstermek için uygun formata çevir
      if (this.filters.minTarih) {
        this.filters.minTarih = this.formatDateForInput(this.filters.minTarih);
      }

      if (this.filters.maxTarih) {
        this.filters.maxTarih = this.formatDateForInput(this.filters.maxTarih);
      }

      this.getPaginatedNotifications();
      this.handlingUrlParams = false;
    });
    this.getUsers();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
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
          this.toastService.error(response.message);
        }
      });
  }

  sendNotificationToUser() {
    if (!this.selectedUser) {
      this.toastService.error('Lütfen bir kullanıcı seçin!');
      return;
    }

    this.sendNotificationUserObj = {
      kullaniciId: this.selectedUser,
      baslik: this.title,
      aciklama: this.description,
      icon: this.selectedIcon,
      renk: this.selectedColor,
    };

    this.bildirimService.sendNotification(this.sendNotificationUserObj).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        } else {
          this.toastService.error(response.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(err.error.message, 'Giriş başarısız:');
        }
      },
    });
  }

  getPaginatedNotifications() {
    const apiFilters = {
      ...this.filters,
      minTarih: this.formatDateForAPI(this.filters.minTarih, false), 
      maxTarih: this.formatDateForAPI(this.filters.maxTarih, true)   
    };

    this.bildirimService.getPaginatedNotifications(
      this.pageNumber,
      this.pageSize,
      this.sortBy,
      this.isDescending,
      apiFilters
    ).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.notifications = response.data;
        } else {
          this.notifications = [];
          this.toastService.error(response.message);
        }
      },
      error: (error) => {
        this.toastService.error('Bildirim verileri alınamadı: ' + error.message);
        this.notifications = [];
      }
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
        <p>Mevcut Icon: <i id="selectedIcon" class="fa ${
          notification.icon
        }"></i></p>
        <div class="align-content-center ">Mevcut Renk: <span class="color-box" style="background-color: ${
          notification.renk
        };"></span></div>
        <hr>
        <p>Yeni Bildirimin Özellikleri:</p>
        <input id="bildirimBaslik" class="swal2-input" value="${
          notification.baslik
        }" placeholder="Bildirimi Adı">
        <input id="bildirimAciklama" class="swal2-input" value="${
          notification.aciklama
        }" placeholder="Açıklama">
        <p>
          <div id="iconContainer" class="icon-list">
            ${this.icons
              .map(
                (icon) =>
                  `<i class="fa ${icon}" data-icon="${icon}" style="margin: 5px; cursor:pointer;"></i>`
              )
              .join('')}
          </div>
        </p>
        <input id="bildirimRenk" type="color" class="swal2-input" value="${
          notification.renk
        }" placeholder="Renk">
      `,
      didOpen: () => {
        document.querySelectorAll('#iconContainer i').forEach((icon) => {
          icon.addEventListener('click', function (this: HTMLElement) {
            selectedIcon = this.getAttribute('data-icon')!;
            const selectedIconElement = document.getElementById('selectedIcon');
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
        popup: 'custom-swal-popup-xl',
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
        return {
          baslik: bildirimBaslik,
          aciklama: bildirimAciklama,
          icon: selectedIcon,
          renk: bildirimRenk,
        };
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
              this.getPaginatedNotifications();
              this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error(
              'Güncellenirken bir hata oluştu: ' + error.message
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
          this.getPaginatedNotifications();
          this.toastService.success(response.message);
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        });
      }
    });
  }

  getUsers() {
    this.userService
      .getUsersByQuery(
        this.pageSizeForUser,
        this.pageNumberForUser,
        this.sortByForUser,
        this.isDescendingForUser,
        this.filtersForUser
      )
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

    this.filtersForUser.searchTerm = this.searchTerm.toLowerCase();
    this.userService
      .getUsersByQuery(
        this.pageSizeForUser,
        this.pageNumberForUser,
        this.sortByForUser,
        this.isDescendingForUser,
        this.filtersForUser
      )
      .subscribe((users) => {
        this.users = users.data;
        this.filteredUsers = users.data; // İlk başta tüm kullanıcıları göster
      });
  }
  formatDateForInput(dateString: string): string {
    try {
      // Tarih zaten YYYY-MM-DD formatındaysa doğrudan döndür
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
      }
      
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Tarih dönüştürme hatası:', e);
    }
    return '';
  }

  // API için string tarih değerini Date nesnesine çevirir
  private formatDateForAPI(dateString: string | null, isMaxDate: boolean = false): Date | null {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        if (isMaxDate) {
          // Sadece maxTarih için saat kısmını 23:59:59 olarak ayarla
          date.setHours(23, 59, 59, 999);
        }
        return date;  // Doğrudan Date nesnesi döndür
      }
    } catch (e) {
      console.error('API için tarih dönüştürme hatası:', e);
    }
    
    return null;
  }
  onFilterChange(newFilters: any) {
    // URL parametreleri işleniyorsa çift API çağrısını önlemek için geri dön
    if (this.handlingUrlParams) return;

    // Filtre değişikliğinde sayfa numarasını sıfırla
    this.pageNumber = 1;

    // Boş stringleri ve 0/null değerleri temizle, Boolean değerleri koru
    Object.keys(newFilters).forEach((key) => {
      if (
        key !== 'status' &&
        (newFilters[key] === '' ||
          newFilters[key] === 0 ||
          newFilters[key] === null)
      ) {
        newFilters[key] = null;
      }
    });

    this.filters = { ...newFilters };
    this.updateURL();
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || this.handlingUrlParams) return;

    this.pageNumber = newPage;
    this.updateURL();
  }

  onSortChange() {
    if (this.handlingUrlParams) return;

    this.pageNumber = 1; // Sayfa numarasını sıfırla
    this.updateURL();
  }

  toggleIsDescending() {
    if (this.handlingUrlParams) return;

    this.isDescending = !this.isDescending;
    this.updateURL();
  }

  private updateURL() {
    const queryParams: any = {
      page: this.pageNumber,
      sortBy: this.sortBy,
      isDescending: this.isDescending.toString(),
    };

    // Sadece değeri olan filtreleri URL'ye ekle (null olmayan değerler)
    if (this.filters.id !== null) {
      // ID null değilse ekle
      queryParams.id = this.filters.id;
    }
    if (this.filters.baslik) {
      queryParams.baslik = this.filters.baslik;
    }
    if (this.filters.kullaniciId !== null) {
      // Kullanıcı ID'si null değilse ekle
      queryParams.kullaniciId = this.filters.kullaniciId;
    }

    if (this.filters.status !== null && this.filters.status !== undefined) {
      queryParams.status = this.filters.status.toString();
    }

    // Tarihleri URL için uygun formatta ekle
    if (this.filters.minTarih) {
      // HTML date input formatındaki tarihi aynen URL'ye ekle (YYYY-MM-DD)
      queryParams.minTarih = this.filters.minTarih;
    }

    if (this.filters.maxTarih) {
      // HTML date input formatındaki tarihi aynen URL'ye ekle (YYYY-MM-DD)
      queryParams.maxTarih = this.filters.maxTarih;
    }

    // Navigasyon sırasında mevcut parametreleri değil, tamamen yeni parametreleri kullan
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }

  resetFilters() {
    this.filters = {
      id: null,
      baslik: '',
      kullaniciId: null,
      status: null,
      minTarih: null,
      maxTarih: null,
    };

    this.pageNumber = 1;
    this.sortBy = 'id';
    this.isDescending = false;

    // URL'yi temizle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, sortBy: 'id', isDescending: 'false' },
    });

    // Verileri yeniden getir
    this.getPaginatedNotifications();
  }

  toggleFilter() {
    this.filtersOpen = !this.filtersOpen;
  }
}