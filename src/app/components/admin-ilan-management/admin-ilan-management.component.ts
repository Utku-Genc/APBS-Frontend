import { ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { SummaryPipe } from "../../pipes/summary.pipe";
import { IlanService } from '../../services/ilan.service';
import { PositionService } from '../../services/position.service';
import { BolumService } from '../../services/bolum.service';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import * as bootstrap from 'bootstrap';
import { QuillModule } from 'ngx-quill';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'utk-admin-ilan-management',
  imports: [CommonModule, FormsModule, QuillModule, RouterModule, SummaryPipe],
  templateUrl: './admin-ilan-management.component.html',
  styleUrl: './admin-ilan-management.component.css'
})
export class AdminIlanManagementComponent implements OnInit {
  private ilanService = inject(IlanService);
  private positionService = inject(PositionService);
  private bolumService = inject(BolumService);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('editModal') editModal!: ElementRef;
  ilansModelObj: IlanDetailModel[] = [];
  formData: any = {}; 
  positions: any[] = [];
  bolums: any[] = [];
  
  filtersOpen: boolean = false;
  ilanSayisi: number = 0;
  pageSize: number = 10;
  pageNumber: number = 1;
  sortBy: string = 'id';
  isDescending: boolean = false;
  filters: any = {
    id: null,
    baslik: '',
    pozisyonId: null,
    bolumId: null,
    status: null,
    ilanTipi: null,
  };
  private handlingUrlParams = false;

  editorConfig = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean'],
    ],
  };

  ngOnInit(): void {
    // Önce route parametrelerini kontrol et
    this.route.queryParams.subscribe(params => {
      // URL'den parametreleri al
      if (params['page']) {
        this.pageNumber = parseInt(params['page']);
      }
      
      if (params['sortBy']) {
        this.sortBy = params['sortBy'];
      }
      
      if (params['isDescending']) {
        this.isDescending = params['isDescending'] === 'true';
      }
      
      // Filtreleri URL'den al
      if (params['baslik']) {
        this.filters.baslik = params['baslik'];
      }
      
      if (params['pozisyonId']) {
        this.filters.pozisyonId = parseInt(params['pozisyonId']);
      }
      
      if (params['bolumId']) {
        this.filters.bolumId = parseInt(params['bolumId']);
      }
      
      if (params['status'] !== undefined) {
        this.filters.status = params['status'] === 'true';
      }
      
      if (params['ilanTipi']) {
        this.filters.ilanTipi = parseInt(params['ilanTipi']);
      }
      
      // Parametreler alındıktan sonra verileri getir
      this.getAllIlans();
    });

    this.getPositions();
    this.getDepartments();
  }

  ngAfterViewInit(): void {
    this.cdRef.detectChanges();
  }

  getAllIlans() {
    this.ilanService.getilansbyqueryforadmin(this.pageSize, this.pageNumber, this.sortBy, this.isDescending, this.filters)
      .subscribe({
        next: (response) => {
          this.ilansModelObj = response.data;
          this.ilanSayisi = response.totalCount || this.ilansModelObj.length; // API toplam sayıyı dönüyorsa onu al, yoksa mevcut veri sayısını kullan
          this.cdRef.detectChanges(); // Değişiklikleri bildir
        },
        error: (error) => {
          this.toastService.error('İlanlar yüklenirken bir hata oluştu.');
          console.error('İlan yükleme hatası:', error);
        }
      });
  }

  getPositions() {
    this.positionService.getAll().subscribe({
      next: (response) => {
        this.positions = response.data;
      },
      error: (error) => {
        this.toastService.error('Pozisyonlar yüklenirken bir hata oluştu.');
      }
    });
  }

  getDepartments() {
    this.bolumService.getAll().subscribe({
      next: (response) => {
        this.bolums = response.data;
      },
      error: (error) => {
        this.toastService.error('Bölümler yüklenirken bir hata oluştu.');
      }
    });
  }

  stripHtml(html: string): string {
    if (!html) return '';
    let plainText = html.replace(/<[^>]*>/g, '');
    plainText = plainText.replace(/&nbsp;/g, ' ').replace(/\uFEFF/g, '').trim();
    return plainText;
  }

  deactivate(ilanId: number) {
    Swal.fire({
      title: 'Gizliye Al',
      text: `${ilanId} ID'li ilan gizliye alınacaktır. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, gizliye al',
      cancelButtonText: 'İptal',
      customClass: {
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.deactivate(ilanId).subscribe({
          next: () => {
            this.getAllIlans();
            this.toastService.success('İlan başarıyla gizlendi.');
          },
          error: (error) => {
            this.toastService.error('İlan gizlenirken bir hata oluştu.');
          }
        });
      }
    });
  }

  activate(ilanId: number) {
    Swal.fire({
      title: 'Aktif Et',
      text: `${ilanId} ID'li ilan aktif hale getirilecektir. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, aktif et',
      cancelButtonText: 'İptal',
      customClass: {
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.activate(ilanId).subscribe({
          next: () => {
            this.getAllIlans();
            this.toastService.success('İlan başarıyla aktifleştirildi.');
          },
          error: (error) => {
            this.toastService.error('İlan aktifleştirilirken bir hata oluştu.');
          }
        });
      }
    });
  }

  // İlan tipine göre etiket sınıfını belirler
  getIlanTipiBadgeClass(item: IlanDetailModel): string {
    const now = new Date();
    const startDate = item.baslangicTarihi ? new Date(item.baslangicTarihi) : null;
    const endDate = item.bitisTarihi ? new Date(item.bitisTarihi) : null;
    
    if (!item.status) {
      return 'badge bg-secondary';
    } else if (startDate && endDate) {
      if (now < startDate) {
        return 'badge bg-warning';  // Henüz başlamamış
      } else if (now > endDate) {
        return 'badge bg-danger';   // Süresi dolmuş
      } else {
        return 'badge bg-success';  // Aktif
      }
    }
    
    return 'badge bg-info';  // Varsayılan
  }

  // İlan tipine göre etiket metnini belirler
  getIlanTipiLabel(item: IlanDetailModel): string {
    const now = new Date();
    const startDate = item.baslangicTarihi ? new Date(item.baslangicTarihi) : null;
    const endDate = item.bitisTarihi ? new Date(item.bitisTarihi) : null;
    
    if (!item.status) {
      return 'Pasif';
    } else if (startDate && endDate) {
      if (now < startDate) {
        return 'Beklemede';
      } else if (now > endDate) {
        return 'Geçmiş İlan';
      } else {
        return 'Aktif İlan';
      }
    }
    
    return 'Belirtilmemiş';
  }

  openModal(itemId: number) {
    const selectedItem = this.ilansModelObj.find((item) => item.id === itemId);
    
    if (selectedItem) {
      // Veriyi doğru formatta ayarla
      this.formData = {
        id: selectedItem.id,
        baslik: selectedItem.baslik,
        aciklama: selectedItem.aciklama,
        pozisyonId: selectedItem.pozisyon.id,
        bolumId: selectedItem.bolum.id,
        baslangicTarihi: selectedItem.baslangicTarihi,
        bitisTarihi: selectedItem.bitisTarihi,
        status: selectedItem.status
      };

      // Modal'ı aç
      const modal = new bootstrap.Modal(this.editModal.nativeElement);
      modal.show();
    } else {
      this.toastService.error('İlan bulunamadı.');
    }
  }

  // Tarihi datetime-local inputu için formatlama
  formatDateForDatetimeLocal(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // "yyyy-MM-ddThh:mm" formatında
  }

  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.editModal.nativeElement);
    if (modal) {
      modal.hide();
    }
  }

  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    this.ilanService.update(this.formData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getAllIlans();
          this.closeModal();
        } else {
          this.toastService.error(response.message || 'Güncelleme sırasında bir hata oluştu.');
        }
      },
      error: (error) => {
        this.toastService.error('İlan güncellenirken bir hata oluştu.');
        console.error('Güncelleme hatası:', error);
      }
    });
  }

  validateForm(): boolean {
    if (!this.formData.baslik || this.formData.baslik.trim() === '') {
      this.toastService.error('Başlık alanı zorunludur.');
      return false;
    }
    
    if (!this.formData.aciklama || this.formData.aciklama.trim() === '') {
      this.toastService.error('Açıklama alanı zorunludur.');
      return false;
    }
    
    if (!this.formData.pozisyonId || this.formData.pozisyonId === 0) {
      this.toastService.error('Pozisyon seçimi zorunludur.');
      return false;
    }
    
    if (!this.formData.bolumId || this.formData.bolumId === 0) {
      this.toastService.error('Bölüm seçimi zorunludur.');
      return false;
    }
    
    return true;
  }

  edit(itemId: number) {
    this.openModal(itemId);
  }

  onDelete(itemId: number) {
    Swal.fire({
      title: 'Sil',
      text: `${itemId} ID'li ilan silinecek. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ilanService.delete(itemId).subscribe({
          next: () => {
            this.getAllIlans();
            this.toastService.success('İlan başarıyla silindi.');
          },
          error: (error) => {
            this.toastService.error('İlan silinirken bir hata oluştu.');
            console.error('Silme hatası:', error);
          }
        });
      }
    });
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
    
    this.pageNumber = 1; 
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
  
    if (this.filters.pozisyonId !== null && this.filters.pozisyonId !== undefined) {
      queryParams.pozisyonId = this.filters.pozisyonId;
    }
  
    if (this.filters.bolumId !== null && this.filters.bolumId !== undefined) {
      queryParams.bolumId = this.filters.bolumId;
    }
    
    if (this.filters.status !== null && this.filters.status !== undefined) {
      queryParams.status = this.filters.status.toString();
    }
    
    if (this.filters.ilanTipi !== null && this.filters.ilanTipi !== undefined) {
      queryParams.ilanTipi = this.filters.ilanTipi;
    }
  
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  resetFilters() {
    this.filters = {
      id: null,
      baslik: '',
      pozisyonId: null,
      bolumId: null,
      status: null,
      ilanTipi: null,
    };
    
    this.pageNumber = 1;
    this.sortBy = 'id';
    this.isDescending = false;

    // URL'yi temizle
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, sortBy: 'id', isDescending: 'false' }
    });
    
    // Verileri yeniden getir
    this.getAllIlans();
  }

  toggleFilter() {
    this.filtersOpen = !this.filtersOpen;
  }
}