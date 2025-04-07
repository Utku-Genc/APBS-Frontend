import Swal from 'sweetalert2';
import { IlanBasvuruListModel } from '../../models/ilan-basvuru/basvuru-list.model';
import { BasvuruDurumlarıModel } from '../../models/basvuru-durumlari/basvuru-durumlari.model';
import { BasvuruDurumlariService } from '../../services/basvuru-durumlari.service';
import { Component, inject, OnInit } from '@angular/core';
import { IlanBasvuruService } from '../../services/ilan-basvuru.service';
import { ToastService } from '../../services/toast.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'utk-yonetici-ilan-basvuru',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './yonetici-ilan-basvuru.component.html',
  styleUrl: './yonetici-ilan-basvuru.component.css',
})
export class YoneticiIlanBasvuruComponent implements OnInit {
  private ilanBasvuruService = inject(IlanBasvuruService);
  private basvuruDurumlariService = inject(BasvuruDurumlariService);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Başvurular ve başvuru durumları listeleri
  basvurular: IlanBasvuruListModel[] = [];
  basvuruDurumlari: BasvuruDurumlarıModel[] = [];

  // Filtre panelinin açık/kapalı durumu
  filtersOpen: boolean = false;
  
  // URL parametreleri işleniyor mu kontrolü
  private handlingUrlParams = false;

  // Sayfalama ve sıralama değişkenleri
  pageSize: number = 10;
  pageNumber: number = 1;
  sortBy: string = 'id';
  isDescending: boolean = false;
  
  // Filtre değişkenleri
  filters: any = {
    id: undefined,
    ilanId: undefined,
    basvuranId: undefined,
    basvuruDurumuId: undefined,
    minBasvuruTarih: null,
    maxBasvuruTarih: null,
  };

  /**
   * Bileşen başlatıldığında çalışır
   */
  ngOnInit(): void {
    // URL parametreleri değişimini takip et
    this.route.queryParams.subscribe((params) => {
      this.handlingUrlParams = true;

      // Sayfa ve sıralama parametrelerini al
      this.pageNumber = params['page'] ? parseInt(params['page']) : 1;
      this.sortBy = params['sortBy'] || 'id';
      
      // isDescending değerini doğru şekilde parse et
      this.isDescending = params['isDescending'] === 'true';

      // Filtreleri URL'den al
      this.filters = {
        id: params['id'] ? parseInt(params['id']) : undefined,
        ilanId: params['ilanId'] ? parseInt(params['ilanId']) : undefined,
        basvuranId: params['basvuranId'] ? parseInt(params['basvuranId']) : undefined,
        basvuruDurumuId: params['basvuruDurumuId'] ? parseInt(params['basvuruDurumuId']) : undefined,
        minBasvuruTarih: params['minBasvuruTarih'] || null,
        maxBasvuruTarih: params['maxBasvuruTarih'] || null,
      };

      // URL'den alınan tarih değerlerini input alanlarında göstermek için uygun formata çevir
      if (this.filters.minBasvuruTarih) {
        this.filters.minBasvuruTarih = this.formatDateForInput(this.filters.minBasvuruTarih);
      }

      if (this.filters.maxBasvuruTarih) {
        this.filters.maxBasvuruTarih = this.formatDateForInput(this.filters.maxBasvuruTarih);
      }
      
      // Veri çek
      this.getAll();
      this.handlingUrlParams = false;
    });
  }

  /**
   * Kriterlere göre başvuruları getirir
   */
  getAll() {
    // API'ye gönderilecek filtreleri hazırla - API'nin beklediği parametre adlarını kullan
    const queryFilters: any = {};
    
    // ID filtrelerini ekle
    if (this.filters.id !== undefined && this.filters.id !== null && this.filters.id !== '') {
      queryFilters.Id = this.filters.id;
    }
    if (this.filters.ilanId !== undefined && this.filters.ilanId !== null && this.filters.ilanId !== '') {
      queryFilters.IlanId = this.filters.ilanId;
    }
    if (this.filters.basvuranId !== undefined && this.filters.basvuranId !== null && this.filters.basvuranId !== '') {
      queryFilters.BasvuranId = this.filters.basvuranId;
    }
    if (this.filters.basvuruDurumuId !== undefined && this.filters.basvuruDurumuId !== null && this.filters.basvuruDurumuId !== '') {
      queryFilters.BasvuruDurumuId = this.filters.basvuruDurumuId;
    }
    
    // String tarihleri Date nesnelerine çevir (API'nin beklediği parametre adlarıyla)
    if (this.filters.minBasvuruTarih) {
      // Başlangıç tarihi için saat 00:00:00
      queryFilters.minBasvuruTarihi = new Date(this.filters.minBasvuruTarih + 'T00:00:00');
    }
    if (this.filters.maxBasvuruTarih) {
      // Bitiş tarihi için saat 23:59:59
      queryFilters.maxBasvuruTarihi = new Date(this.filters.maxBasvuruTarih + 'T23:59:59');
    }

    console.log('API çağrısı yapılıyor:', {
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      sortBy: this.sortBy,
      isDescending: this.isDescending,
      filters: queryFilters
    });

    // API çağrısını yap
    this.ilanBasvuruService
      .getByQuery(
        this.pageSize,
        this.pageNumber,
        this.sortBy,
        this.isDescending,
        queryFilters
      )
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.basvurular = response.data;
          } else {
            this.toastrService.error('Başvurular getirilemedi!', response.message);
          }
        },
        error: (err) => {
          this.toastrService.error('Başvurular yüklenirken bir hata oluştu!');
          console.error('Başvuru yükleme hatası:', err);
        },
      });
  }


  editDurum(basvuru: IlanBasvuruListModel) {
    this.basvuruDurumlariService.getAll().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.basvuruDurumlari = response.data;
          
          const otherDurumlar = this.basvuruDurumlari.filter(
            durum => durum.id !== basvuru.basvuruDurumuId
          );
          
          let selectOptionsHtml = '';
          if (otherDurumlar.length > 0) {
            selectOptionsHtml = otherDurumlar.map((durum, index) => 
              `<option value="${durum.id}" ${index === 0 ? 'selected' : ''}>${durum.ad}</option>`
            ).join('');
          } else {
            selectOptionsHtml = '<option value="">Hiç durum bulunamadı</option>';
          }
          
          Swal.fire({
            title: `${basvuru.id} ID'li başvuruyu güncelliyorsunuz`,
            html: `
              <div style="margin-bottom: 15px; text-align: left;">
                <p><strong>Mevcut Durum ID:</strong> ${basvuru.basvuruDurumuId}</p>
                <p><strong>Mevcut Durum Adı:</strong> ${basvuru.basvuruDurumu.ad}</p>
                <p><strong>Mevcut Açıklama:</strong> ${basvuru.basvuruDurumu.aciklama || '-'}</p>
              </div>
              <div style="margin-bottom: 15px; text-align: left;">
                <label for="durum-select" style="display: block; margin-bottom: 5px;"><strong>Yeni Başvuru Durumu:</strong></label>
                <select id="durum-select" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #ccc;">
                  ${selectOptionsHtml}
                </select>
              </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Güncelle',
            cancelButtonText: 'İptal',
            customClass: {
              popup: 'custom-swal-popup-xl',
              confirmButton: 'custom-swal-confirm',
              cancelButton: 'custom-swal-cancel',
            },
            didOpen: () => {
              const selectElement = document.getElementById('durum-select') as HTMLSelectElement;

            },
            preConfirm: () => {
              const selectElement = document.getElementById('durum-select') as HTMLSelectElement;
              
              if (!selectElement.value) {
                Swal.showValidationMessage('Lütfen bir durum seçin');
                return false;
              }
              
              const durumId = parseInt(selectElement.value, 10);
              
              if (isNaN(durumId)) {
                Swal.showValidationMessage('Geçersiz durum ID');
                return false;
              }
              
              return { basvuruDurumuId: durumId };
            },
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              
              const updatedBasvuru: IlanBasvuruListModel = {
                ...basvuru,
                basvuruDurumuId: result.value.basvuruDurumuId,
              };
              
              this.ilanBasvuruService.update(updatedBasvuru).subscribe({
                next: (response) => {
                  if (response.isSuccess) {
                    this.toastService.success(response.message);
                    this.getAll();
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
                    this.toastrService.error(
                      'Bir hata oluştu, lütfen tekrar deneyin.',
                      'Hata'
                    );
                  }
                },
              });
            }
          });
        } else {
          this.toastrService.error('Başvuru durumları getirilemedi!');
        }
      },
      error: (err) => {
        this.toastrService.error('Başvuru durumları yüklenirken bir hata oluştu!');
        console.error('Durum yükleme hatası:', err);
      }
    });
}

  formatDateForInput(dateString: string): string {
    try {
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

 
  private formatDateForAPI(
    dateString: string | null,
    isMaxDate: boolean = false
  ): string | null {
    if (!dateString) return null;
  
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        if (isMaxDate) {
          return `${formattedDate}T23:59:59`;
        } else {
          return `${formattedDate}T00:00:00`;
        }
      }
    } catch (e) {
      console.error('API için tarih dönüştürme hatası:', e);
    }
  
    return null;
  }


  onFilterChange() {
    if (this.handlingUrlParams) return;

    this.pageNumber = 1;
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
      isDescending: this.isDescending.toString(),
    };

    if (this.filters.id !== undefined && this.filters.id !== null && this.filters.id !== '') {
      queryParams.id = this.filters.id;
    }
    if (this.filters.ilanId !== undefined && this.filters.ilanId !== null && this.filters.ilanId !== '') {
      queryParams.ilanId = this.filters.ilanId;
    }
    if (this.filters.basvuranId !== undefined && this.filters.basvuranId !== null && this.filters.basvuranId !== '') {
      queryParams.basvuranId = this.filters.basvuranId;
    }
    if (this.filters.basvuruDurumuId !== undefined && this.filters.basvuruDurumuId !== null && this.filters.basvuruDurumuId !== '') {
      queryParams.basvuruDurumuId = this.filters.basvuruDurumuId;
    }

    if (this.filters.minBasvuruTarih) {
      queryParams.minBasvuruTarih = this.filters.minBasvuruTarih;
    }
    if (this.filters.maxBasvuruTarih) {
      queryParams.maxBasvuruTarih = this.filters.maxBasvuruTarih;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
    });
  }


  resetFilters() {
    this.filters = {
      id: undefined,
      ilanId: undefined,
      basvuranId: undefined,
      basvuruDurumuId: undefined,
      minBasvuruTarih: null,
      maxBasvuruTarih: null,
    };

    this.pageNumber = 1;
    this.sortBy = 'id';
    this.isDescending = false;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, sortBy: 'id', isDescending: 'false' },
    });
  }


  toggleFilter() {
    this.filtersOpen = !this.filtersOpen;
  }
}