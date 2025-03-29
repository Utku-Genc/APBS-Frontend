import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationListModel } from '../../models/bildirim/notification-list.model';
import { BildirimService } from '../../services/bildirim.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'utk-bildirimler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bildirimler.component.html',
  styleUrl: './bildirimler.component.css',
})
export class BildirimlerComponent implements OnInit {
  private bildirimService = inject(BildirimService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  notifications: NotificationListModel[] = [];
  
  filtersOpen: boolean = false;

  pageSize: number = 12;
  pageNumber: number = 1;
  sortBy: string = 'tarih';
  isDescending: boolean = false;
  filters: any = {
    id: null,
    baslik: '',
    status: null,
    minTarih: null,
    maxTarih: null
  };

  private handlingUrlParams = false;

  ngOnInit(): void {
    // URL parametrelerini dinle
    this.route.queryParams.subscribe(params => {
      this.handlingUrlParams = true;
      
      // Sayfa ve sıralama parametrelerini al
      this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
      this.sortBy = params['sortBy'] || 'tarih';
      this.isDescending = params['isDescending'] === 'true';
      
      // Filtre parametrelerini al
      this.filters = {
        id: null,
        baslik: params['baslik'] || '',
        status: params['status'] !== undefined ? params['status'] === 'true' : null,
        ilanTipi: params['ilanTipi'] ? parseInt(params['ilanTipi']) : null,
        minTarih: params['minTarih'] || null,
        maxTarih: params['maxTarih'] || null
      };
      
      // URL'den alınan tarih değerlerini tarih input alanlarında göstermek için uygun formata çevir
      if (this.filters.minTarih) {
        this.filters.minTarih = this.formatDateForInput(this.filters.minTarih);
      }
      
      if (this.filters.maxTarih) {
        this.filters.maxTarih = this.formatDateForInput(this.filters.maxTarih);
      }
      
      this.getMyPaginatedNotifications();
      this.handlingUrlParams = false;
    });
  }

  // HTML date input için ISO formatından YYYY-MM-DD formatına çevirme
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

  getMyPaginatedNotifications() {
    // API'ye gönderilecek filtreler - string tarih değerlerini Date nesnelerine çevir
    const apiFilters = {
      ...this.filters,
      minTarih: this.formatDateForAPI(this.filters.minTarih, false), 
      maxTarih: this.formatDateForAPI(this.filters.maxTarih, true)   
    };

    // Debug için
    console.log('API Filters:', apiFilters);

    this.bildirimService.getMyPaginatedNotifications(
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
          this.toastService.error('Bildirim verileri alınamadı');
        }
      },
      error: (error) => {
        this.toastService.error('Bildirim verileri alınamadı: ' + error.message);
        this.notifications = [];
      }
    });
  }

  markAsRead(id: number) {
    this.bildirimService.markAsRead(id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyPaginatedNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        } else {
          this.toastService.error(response.message || 'İşlem başarısız');
        }
      },
      error: (err) => {
        this.toastService.error('Bildirim okundu olarak işaretlenemedi');
      }
    });
  }

  markAllAsRead() {
    this.bildirimService.markAllAsRead().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyPaginatedNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        } else {
          this.toastService.error(response.message || 'İşlem başarısız');
        }
      },
      error: (err) => {
        this.toastService.error('Bildirimler okundu olarak işaretlenemedi');
      }
    });
  }

  markAsUnRead(id: number) {
    this.bildirimService.markAsUnRead(id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyPaginatedNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        } else {
          this.toastService.error(response.message || 'İşlem başarısız');
        }
      },
      error: (err) => {
        this.toastService.error('Bildirim okunmadı olarak işaretlenemedi');
      }
    });
  }

  deleteNotification(id: number) {
    if (confirm('Bu bildirimi silmek istediğinize emin misiniz?')) {
      this.bildirimService.delete(id).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toastService.success(response.message);
            this.getMyPaginatedNotifications();
            this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
          } else {
            this.toastService.error(response.message || 'Silme işlemi başarısız');
          }
        },
        error: (err) => {
          this.toastService.error('Bildirim silinemedi');
        }
      });
    }
  }

  deleteAllNotifications() {
    if (confirm('Tüm bildirimleri silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      this.bildirimService.deleteAllMyNotifications().subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toastService.success(response.message);
            this.getMyPaginatedNotifications();
            this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
          } else {
            this.toastService.error(response.message || 'Silme işlemi başarısız');
          }
        },
        error: (err) => {
          this.toastService.error('Bildirimler silinemedi');
        }
      });
    }
  }

  onFilterChange(newFilters: any) {
    // URL parametreleri işleniyorsa çift API çağrısını önlemek için geri dön
    if (this.handlingUrlParams) return;
    
    // Filtre değişikliğinde sayfa numarasını sıfırla
    this.pageNumber = 1;
    
    // Boş stringleri ve 0/null değerleri temizle, Boolean değerleri koru
    Object.keys(newFilters).forEach(key => {
      if (key !== 'status' && (newFilters[key] === '' || newFilters[key] === 0 || newFilters[key] === null)) {
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
    
    this.pageNumber = 1;  // Sayfa numarasını sıfırla
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
      isDescending: this.isDescending.toString()
    };
  
    // Sadece değeri olan filtreleri URL'ye ekle (null olmayan değerler)
    if (this.filters.baslik) {
      queryParams.baslik = this.filters.baslik;
    }
    
    if (this.filters.status !== null && this.filters.status !== undefined) {
      queryParams.status = this.filters.status.toString();
    }
    
    if (this.filters.ilanTipi) {
      queryParams.ilanTipi = this.filters.ilanTipi.toString();
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
      queryParams: queryParams
    });
  }

  resetFilters() {
    this.filters = {
      id: null,
      baslik: '',
      status: null,
      minTarih: null,
      maxTarih: null
    };
    
    this.pageNumber = 1;
    this.sortBy = 'tarih';
    this.isDescending = false;

    // URL'yi temizle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, sortBy: 'tarih', isDescending: 'false' }
    });
    
    // Verileri yeniden getir
    this.getMyPaginatedNotifications();
  }

  toggleFilter() {
    this.filtersOpen = !this.filtersOpen;
  }
}