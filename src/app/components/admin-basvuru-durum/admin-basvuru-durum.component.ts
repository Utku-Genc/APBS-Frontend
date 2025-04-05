import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BasvuruDurumlarıModel } from '../../models/basvuru-durumlari/basvuru-durumlari.model';
import Swal from 'sweetalert2';
import { BasvuruDurumlariService } from '../../services/basvuru-durumlari.service';
import { BasvuruDurumlarıAddModel } from '../../models/basvuru-durumlari/dasvuru-durumlari-add.model';
import { ToastService } from '../../services/toast.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'utk-admin-basvuru-durum',
  imports: [CommonModule],
  templateUrl: './admin-basvuru-durum.component.html',
  styleUrl: './admin-basvuru-durum.component.css'
})
export class AdminBasvuruDurumComponent implements OnInit {
  private basvuruDurumlariService = inject(BasvuruDurumlariService);
  private toastrService = inject(ToastrService);
  private toastService = inject(ToastService);
  

  basvurDurumModelObj: BasvuruDurumlarıModel[] = [];
  basvuruDurumlariAddObj: BasvuruDurumlarıAddModel = {
    ad: '',
    aciklama: ''
  };
  basvuruDurumlariToUpdate: BasvuruDurumlarıModel = {
    id: 0,
    ad: '',
    aciklama: ''
  };

  ngOnInit(): void {
    this.getAllBasvuruDurum();
  }

  getAllBasvuruDurum(){
    this.basvuruDurumlariService.getAll().subscribe((response) => {
      if (response.isSuccess) {
        this.basvurDurumModelObj = response.data;
      } else {
        this.toastService.error(response.message);
      }
    });
  }
  addBasvurDurum() {
      Swal.fire({
        title: 'Yeni Başvuru Durumu Ekle',
        html: `
            <input id="basvuruAd" class="swal2-input" placeholder="Başvuru Durumu Adı">
            <input id="basvuruAciklama" class="swal2-input" placeholder="Açıklama">
          `,
        showCancelButton: true,
        confirmButtonText: 'Ekle',
        cancelButtonText: 'İptal',
        customClass: {
          popup: 'custom-swal-popup',
          confirmButton: 'custom-swal-confirm',
          cancelButton: 'custom-swal-cancel',
        },
        preConfirm: () => {
          const basvuruAd = (
            document.getElementById('basvuruAd') as HTMLInputElement
          ).value.trim();
          const basvuruAciklama = (
            document.getElementById('basvuruAciklama') as HTMLInputElement
          ).value.trim();
          if (!basvuruAd || !basvuruAciklama) {
            Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
            return false;
          }
          return { ad: basvuruAd, aciklama: basvuruAciklama };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.value) {
            this.basvuruDurumlariAddObj = {
              ad: result.value.ad,
              aciklama: result.value.aciklama,
            };
            this.basvuruDurumlariService.add(this.basvuruDurumlariAddObj).subscribe({
              next: (response) => {
                if (response.isSuccess) {
                  this.toastService.success(response.message);
                  this.getAllBasvuruDurum();
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
                  this.toastrService.error(err.error.Message, 'Ekleme başarısız!');
                }
              },
            });
          }
        }
      });
    }
  
    editBasvurDurum(basvuruDurum: BasvuruDurumlarıModel) {
      this.basvuruDurumlariToUpdate = { ...basvuruDurum };
      Swal.fire({
        title: `${basvuruDurum.id} ID'li başvuru durumunu güncelliyorsunuz`,
        html: `
            <p>Mevcut Durum Adı: ${basvuruDurum.ad}</p>
            <p>Mevcut Açıklama: ${basvuruDurum.aciklama}</p>
            <hr>
            <p>Yeni Durum Adı ve Açıklama:</p>
            <input id="durumAd" class="swal2-input" value="${basvuruDurum.ad}" placeholder="Durum Adı">
            <input id="durumAciklama" class="swal2-input" value="${basvuruDurum.aciklama}" placeholder="Açıklama">
          `,
        showCancelButton: true,
        confirmButtonText: 'Güncelle',
        cancelButtonText: 'İptal',
        customClass: {
          popup: 'custom-swal-popup-xl',
          confirmButton: 'custom-swal-confirm',
          cancelButton: 'custom-swal-cancel',
        },
        preConfirm: () => {
          const durumAd = (
            document.getElementById('durumAd') as HTMLInputElement
          ).value.trim();
          const durumAciklama = (
            document.getElementById('durumAciklama') as HTMLInputElement
          ).value.trim();
          if (!durumAd || !durumAciklama) {
            Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
            return false;
          }
          return { ad: durumAd, aciklama: durumAciklama };
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const updatedBasvuruDurum: BasvuruDurumlarıModel = {
            ...this.basvuruDurumlariToUpdate,
            ad: result.value.ad,
            aciklama: result.value.aciklama,
          };
          this.basvuruDurumlariService.update(updatedBasvuruDurum).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.toastService.success(response.message);
                this.getAllBasvuruDurum();
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
                this.toastrService.error(err.error.Message, 'Güncelleme başarısız!');
              }
            },
          });
        }
      });
    }
  
    deleteBasvurDurum(id: number) {
      Swal.fire({
        title: 'Emin misiniz?',
        text: `${id} ID'li başvuru durumunu silmek istediğinizden emin misiniz?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Evet, Sil!',
        cancelButtonText: 'Hayır, İptal',
      }).then((result) => {
        if (result.isConfirmed) {
          this.basvuruDurumlariService.delete(id).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.toastService.success(response.message);
                this.getAllBasvuruDurum();
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
                this.toastrService.error(err.error.Message, 'Silme başarısız!');
              }
            },
          });
        }
      });
    }
}
