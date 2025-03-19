import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AlanService } from '../../services/alan.service';
import { HttpClient } from '@angular/common/http';
import { AlanAddModel } from '../../models/alan/alan.add.model';
import { ToastService } from '../../services/toast.service';
import Swal from 'sweetalert2';
import { AlanModel } from '../../models/alan/alan.model';
import { BolumService } from '../../services/bolum.service';
import { BolumAddModel } from '../../models/bolum/bolum-add.model';
import { BolumModel } from '../../models/bolum/bolum.model';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'utk-admin-department-management',
  imports: [CommonModule],
  templateUrl: './admin-department-management.component.html',
  styleUrl: './admin-department-management.component.css'
})
export class AdminDepartmentManagementComponent implements OnInit {

  private alanService = inject(AlanService);
  private bolumService = inject(BolumService);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private http = inject(HttpClient);
  
  alanModelObj !: AlanModel[];
  alanAddObj !: AlanAddModel;
  alanToUpdate !: AlanModel;
  bolumModelObj !: BolumModel[];
  bolumAddObj !: BolumAddModel;
  activeTab: string = 'bolum';


  ngOnInit() {
    this.getAllBolumler();
    this.getAllAlanlar();
  }


  switchTab(tab: string) {
    this.activeTab = tab;
    console.log('Aktif sekme: ', tab);
  }

  getAllAlanlar() {
    this.alanService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          console.log('Tüm alanlar: ', response.data);
          this.alanModelObj = response.data;

        } else {
          this.toastService.error(response.message);
        }
      },
      error: (error) => {
        this.toastService.error('Alanlar getirilirken bir hata oluştu: ' + error.message);
      }
    });
  }
  addAlan() {
    Swal.fire({
      title: 'Yeni Alan Ekle',
      html: `
        <input id="alanAd" class="swal2-input" placeholder="Alan Adı">
        <input id="alanAciklama" class="swal2-input" placeholder="Açıklama">
      `,
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      preConfirm: () => {
        const alanAd = (document.getElementById('alanAd') as HTMLInputElement).value.trim();
        const alanAciklama = (document.getElementById('alanAciklama') as HTMLInputElement).value.trim();
        if (!alanAd || !alanAciklama) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false; 
        }
        return { ad: alanAd, aciklama: alanAciklama };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          this.alanAddObj = { ad: result.value.ad, aciklama: result.value.aciklama };
          console.log('Eklenecek alan: ', this.alanAddObj);
          this.alanService.add(this.alanAddObj).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.toastService.success(response.message);
                this.getAllAlanlar();
              } else {
                this.toastService.error(response.message);
              }
            },
            error: (error) => {
              this.toastService.error('Alan eklenirken bir hata oluştu: ' + error.message);
            }
          });
        }
      }
    });
  }
  

  editAlan(alan: AlanModel) {
    this.alanToUpdate = { ...alan }; 
    Swal.fire({
      title: `${alan.id} ID'li alanı güncelliyorsunuz`,
      html: `
        <p>Mevcut Alan Adı: ${alan.ad}</p>
        <p>Mevcut Açıklama: ${alan.aciklama}</p>
        <hr>
        <p>Yeni Alan Adı ve Açıklama:</p>
        <input id="alanAd" class="swal2-input" value="${alan.ad}" placeholder="Alan Adı">
        <input id="alanAciklama" class="swal2-input" value="${alan.aciklama}" placeholder="Açıklama">
      `,
      showCancelButton: true,
      confirmButtonText: 'Güncelle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      preConfirm: () => {
        const alanAd = (document.getElementById('alanAd') as HTMLInputElement).value.trim();
        const alanAciklama = (document.getElementById('alanAciklama') as HTMLInputElement).value.trim();
        if (!alanAd || !alanAciklama) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
        return { ad: alanAd, aciklama: alanAciklama };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedAlan: AlanModel = { ...this.alanToUpdate, ad: result.value.ad, aciklama: result.value.aciklama };
        this.alanService.update(updatedAlan).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllAlanlar(); 
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error('Alan güncellenirken bir hata oluştu: ' + error.message);
          }
        });
      }
    });
  }

  deleteAlan(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li alanı silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.alanService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllAlanlar(); 
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error('Alan silinirken bir hata oluştu: ' + error.message);
          }
        });
      }
    });
  }



  /*-------------------------------------------------------------------------------------------------*/

  getAllBolumler() {
    this.bolumService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.bolumModelObj = response.data;
        } else {
          this.toastService.error(response.message);
        }
      },
      error: (error) => {
        this.toastService.error('Bölümler getirilirken bir hata oluştu: ' + error.message);
      }
    });
  }
  addBolum() {
  
    Swal.fire({
      title: 'Yeni Bölüm Ekle',
      html: `
        <input id="bolumAd" class="swal2-input" placeholder="Bölüm Adı">
        <input id="bolumAciklama" class="swal2-input" placeholder="Açıklama">
        <select id="alanId" class="swal2-input">
          <option value="" disabled selected>Bir Alan Seçin</option>
          ${this.alanModelObj.map(alan => `<option value="${alan.id}">${alan.ad}</option>`).join('')}
        </select>
        <input id="bolumTelefon" class="swal2-input" placeholder="Telefon">
        <input id="bolumEmail" class="swal2-input" placeholder="Email">
        <input id="bolumAdres" class="swal2-input" placeholder="Adres">
      `,
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      preConfirm: () => {
        const bolumAd = (document.getElementById('bolumAd') as HTMLInputElement).value.trim();
        const bolumAciklama = (document.getElementById('bolumAciklama') as HTMLInputElement).value.trim();
        const alanId = (document.getElementById('alanId') as HTMLSelectElement).value;
        const bolumTelefon = (document.getElementById('bolumTelefon') as HTMLInputElement).value.trim();
        const bolumEmail = (document.getElementById('bolumEmail') as HTMLInputElement).value.trim();
        const bolumAdres = (document.getElementById('bolumAdres') as HTMLInputElement).value.trim();
  
        if (!bolumAd || !bolumAciklama || !alanId) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
  
        return { ad: bolumAd, aciklama: bolumAciklama, alanId: alanId, bolumTelefon: bolumTelefon, bolumEmail: bolumEmail, bolumAdres: bolumAdres };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const bolumAddObj = {
          ad: result.value.ad,
          aciklama: result.value.aciklama,
          alanId: Number(result.value.alanId),
          telefon: result.value.bolumTelefon,
          email: result.value.bolumEmail,
          adres: result.value.bolumAdres
        };
        console.log('Eklenecek bölüm: ', bolumAddObj);
        this.bolumService.add(bolumAddObj).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllBolumler(); 
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (error) => {
            this.toastService.error('Bölüm eklenirken bir hata oluştu: ' + error.message);
          }
        });
      }
    });
  }
  
  editBolum(bolum: BolumModel) {
   this.getAllAlanlar();
    console.log(bolum);
    Swal.fire({
      title: `${bolum.id} ID'li bölümü güncelliyorsunuz`,
      html: `
        <p>Mevcut Bölüm Adı: ${bolum.ad}</p>
        <p>Mevcut Açıklama: ${bolum.aciklama}</p>
        <p>Mevcut Alan: ${bolum.alan.ad}</p>
        <p>Mevcut Telefon: ${bolum.telefon}</p>
        <p>Mevcut Email: ${bolum.email}</p>
        <p>Mevcut Adres: ${bolum.adres}</p>
        <hr>
        <p>Yeni Bölüm Adı ve Açıklama:</p>
        <input id="bolumAd" class="swal2-input" value="${bolum.ad}" placeholder="Bölüm Adı">
        <input id="bolumAciklama" class="swal2-input" value="${bolum.aciklama}" placeholder="Açıklama">
        <select id="alanId" class="swal2-input">
          <option value="${bolum.alanId}" selected>${bolum.alan.ad}</option>
          ${this.alanModelObj.map(alan => `<option value="${alan.id}">${alan.ad}</option>`).join('')}
        </select>
        <input id="bolumTelefon" class="swal2-input" value="${bolum.telefon}" placeholder="Telefon">
        <input id="bolumEmail" class="swal2-input" value="${bolum.email}" placeholder="Email">
        <input id="bolumAdres" class="swal2-input" value="${bolum.adres}" placeholder="Adres">
      `,
      showCancelButton: true,
      confirmButtonText: 'Güncelle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      preConfirm: () => {
        const bolumAd = (document.getElementById('bolumAd') as HTMLInputElement).value.trim();
        const bolumAciklama = (document.getElementById('bolumAciklama') as HTMLInputElement).value.trim();
        const alanId = (document.getElementById('alanId') as HTMLSelectElement).value;
        const bolumTelefon = (document.getElementById('bolumTelefon') as HTMLInputElement).value.trim();
        const bolumEmail = (document.getElementById('bolumEmail') as HTMLInputElement).value.trim();
        const bolumAdres = (document.getElementById('bolumAdres') as HTMLInputElement).value.trim();
  
        if (!bolumAd || !bolumAciklama || !alanId) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
  
        return { ad: bolumAd, aciklama: bolumAciklama, alanId: alanId, telefon: bolumTelefon, email: bolumEmail, adres: bolumAdres };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedBolum: BolumModel = { 
          ...bolum, 
          ad: result.value.ad, 
          aciklama: result.value.aciklama, 
          alanId: Number(result.value.alanId), 
          telefon: result.value.telefon, 
          email: result.value.email, 
          adres: result.value.adres 
        };
  
        this.bolumService.update(updatedBolum).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllBolumler(); 
            } else {
              this.toastService.error(response.message);
            }
          },
          error: (err) => {
            if (err.error?.ValidationErrors) {
              const errorMessages = err.error.ValidationErrors.map((error: { ErrorMessage: string }) => error.ErrorMessage);
              errorMessages.forEach((message: string | undefined) => {
                this.toastrService.error(message);
              });
            } else {
              this.toastrService.error("Bir hata oluştu, lütfen tekrar deneyin.", "Hata");
            }
          }
        });
      }
    });
  }

  deleteBolum(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li bölümü silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bolumService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllBolumler(); 
            } else {
              this.toastService.error('Bölüm silinirken bir hata oluştu: ' + response.message);
            }
          },
          error: (error) => {
            this.toastService.error('Bölüm silinirken bir hata oluştu: ' + error.message);
          }
        });
      }
    });
  }
  
  
}


