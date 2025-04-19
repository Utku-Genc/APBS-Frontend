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
import { UserService } from '../../services/user.service';
import { UserListModel } from '../../models/user/user-list.model';
import { IlanJuriService } from '../../services/ilan-juri.service';
import { IlanJuriGetByIlanIdModel } from '../../models/ilan-juri/ilan-juri-get-by-ilan-id.model';

@Component({
  selector: 'utk-admin-ilan-management',
  imports: [CommonModule, FormsModule, QuillModule, RouterModule, SummaryPipe],
  templateUrl: './admin-ilan-management.component.html',
  styleUrl: './admin-ilan-management.component.css'
})
export class AdminIlanManagementComponent implements OnInit {
  private ilanService = inject(IlanService);
  private userService = inject(UserService);
  private positionService = inject(PositionService);
  private bolumService = inject(BolumService);
  private ilanJuriService = inject(IlanJuriService);
  private sanitizer = inject(DomSanitizer);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private cdRef = inject(ChangeDetectorRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('editModal') editModal!: ElementRef;
  @ViewChild('juriModal') juriModal!: ElementRef;
  
  ilansModelObj: IlanDetailModel[] = [];
  formData: any = {}; 
  positions: any[] = [];
  bolums: any[] = [];

  userObj: UserListModel[] = [];
  selectedIlanJuris: IlanJuriGetByIlanIdModel[] = [];  
  selectedIlanId: number = 0;
  
  isLoadingUsers: boolean = false;
  userPageSize: number = 8;
  userPageNumber: number = 1;
  
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

  userFilters = {
    firstName: '',
    lastName: '',
    email: '',
    nationalityId: '',
    searchTerm: '',
    status: undefined as boolean | undefined,
    operationClaimId: '',
    OperationClaimName: 'juri',
    minDateOfBirth: '',
    maxDateOfBirth: ''
  }
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
      this.handlingUrlParams = true;
      
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
      
      this.handlingUrlParams = false;
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
          this.ilanSayisi = response.totalCount || this.ilansModelObj.length;
          this.cdRef.detectChanges();
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

  searchUsers() {
    this.isLoadingUsers = true;
    this.userPageNumber = 1;
    this.getUsers();
  }

  getUsers() {
    this.isLoadingUsers = true;
    this.userService
      .getUsersByQuery(
        this.userPageSize,
        this.userPageNumber,
        "id",
        false,
        this.userFilters
      )
      .subscribe({
        next: (response) => {
          this.isLoadingUsers = false;
          if (response.isSuccess) {
            let filteredUsers = response.data;
            
            // Filter out users who are already assigned as jurors
            if (this.selectedIlanJuris && this.selectedIlanJuris.length > 0) {
              // Extract user IDs from the nested structure
              const assignedUserIds = this.selectedIlanJuris.map(jury => jury.kullaniciId);
              // Filter the user list to exclude assigned jurors
              filteredUsers = filteredUsers.filter(user => !assignedUserIds.includes(user.id));
            }
            
            // Set the filtered list to userObj
            this.userObj = filteredUsers;
            this.cdRef.detectChanges();
          } else {
            this.toastService.error('Kullanıcılar yüklenirken hata oluştu.');
          }
        },
        error: (error) => {
          this.isLoadingUsers = false;
          this.toastService.error('API isteği başarısız oldu.');
        }
      });
  }
  
  deleteJuri(juryId: number) {
    // Find the jury entry to be removed
    const removedJury = this.selectedIlanJuris.find(jury => jury.id === juryId);
    
    Swal.fire({
      title: 'Jüri Silme',
      text: 'Bu jüriyi silmek istediğinizden emin misiniz?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Remove from UI first (optimistic update)
        this.selectedIlanJuris = this.selectedIlanJuris.filter(jury => jury.id !== juryId);
        this.cdRef.detectChanges();
        
        this.ilanJuriService.delete(juryId).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success('Jüri başarıyla silindi.');
              
              // After successful deletion, refresh the user list to include the removed juror
              this.getUsers();
            } else {
              // If operation failed, add the jury back to the list
              if (removedJury) {
                this.selectedIlanJuris.push(removedJury);
                this.cdRef.detectChanges();
              }
              this.toastService.error(response.message || 'Jüri silme işlemi başarısız oldu.');
            }
          },
          error: (error) => {
            // If error, add the jury back to the list
            if (removedJury) {
              this.selectedIlanJuris.push(removedJury);
              this.cdRef.detectChanges();
            }
            this.toastService.error('Jüri silme sırasında bir hata oluştu.');
          }
        });
      }
    });
  }
  onUserPageChange(newPage: number) {
    if (newPage < 1) return;
    
    this.userPageNumber = newPage;
    this.getUsers();
  }

  juriAtama(ilanId: number) {
    this.selectedIlanId = ilanId;
    this.userFilters.searchTerm = '';
    this.userObj = [];
    
    // Önce jürileri yükle, sonra kullanıcıları getir
    this.getJurisByIlanId(ilanId, () => {
      // getUsers içinde jüri filtresi uygulanacağı için burada çağrıyoruz
      this.getUsers();
      
      // Jüri atama modalını aç
      const modal = new bootstrap.Modal(this.juriModal.nativeElement);
      modal.show();
    });
  }

  getJurisByIlanId(ilanId: number, callback?: () => void) {
    this.ilanJuriService.getByIlanId(ilanId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          // Store the jury objects with their structure
          this.selectedIlanJuris = response.data;
        } else {
          this.selectedIlanJuris = [];
          this.toastService.error('Jüri bilgileri yüklenirken hata oluştu.');
        }
        
        this.cdRef.detectChanges();
        if (callback) callback();
      },
      error: (error) => {
        this.selectedIlanJuris = [];
        this.toastService.error('Jüri bilgileri yüklenirken bir hata oluştu.');
        
        this.cdRef.detectChanges();
        if (callback) callback();
      }
    });
  }

  addJuri(userId: number) {
    const juriData = {
      ilanId: this.selectedIlanId,
      kullaniciId: userId
    };
  
    // Eklenen kullanıcıyı geçici olarak listeden kaldır
    const addedUser = this.userObj.find(user => user.id === userId);
    if (addedUser) {
      this.userObj = this.userObj.filter(user => user.id !== userId);
    }
    
    this.ilanJuriService.add(juriData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success('Jüri başarıyla atandı.');
          
          // Jüri listesini güncellemek için tekrar yükle
          this.getJurisByIlanId(this.selectedIlanId);
        } else {
          // Başarısız olursa listede göster
          if (addedUser) {
            this.userObj.push(addedUser);
            this.cdRef.detectChanges();
          }
          this.toastService.error(response.message || 'Jüri atama işlemi başarısız oldu.');
        }
      },
      error: (error) => {
        // Hata olursa listede göster
        if (addedUser) {
          this.userObj.push(addedUser);
          this.cdRef.detectChanges();
        }
        this.toastService.error('Jüri atama sırasında bir hata oluştu.');
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