import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ToastService } from '../../services/toast.service';
import { KriterModel } from '../../models/kriter/kriter.model';
import { KriterService } from '../../services/kriter.service';
import { ToastrService } from 'ngx-toastr';
import { KriterAlanModel } from '../../models/kriter-alan/kriter-alan.model';
import { KriterAlanService } from '../../services/kriter-alan.service';
import { AlanService } from '../../services/alan.service';
import { PositionService } from '../../services/position.service';
import { KriterPuanModel } from '../../models/kriter-puan/kriter-puan.model';
import { KriterAddModel } from '../../models/kriter/kriter-add.model';
import { KriterAlanAddModel } from '../../models/kriter-alan/kriter-alan-add.model';
import { KriterPuanAddModel } from '../../models/kriter-puan/kriter-puan-add.model';
import { KriterPuanService } from '../../services/kriter-puan.service';

@Component({
  selector: 'utk-admin-kriter-management',
  imports: [CommonModule],
  templateUrl: './admin-kriter-management.component.html',
  styleUrl: './admin-kriter-management.component.css',
})
export class AdminKriterManagementComponent implements OnInit {
  private kriterService = inject(KriterService);
  private kriterAlanService = inject(KriterAlanService);
  private kriterPuanService = inject(KriterPuanService);

  private alanService = inject(AlanService);
  private positionService = inject(PositionService);

  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);

  activeTab: string = 'kriter';
  kriterModelObj: KriterModel[] = [];
  kriterAddObj: KriterAddModel = { ad: '', aciklama: '' };
  kriterToUpdate: any = {};

  kriterAlanModelObj: KriterAlanModel[] = [];
  kriterAlanAddObj: KriterAlanAddModel = {
    kriterId: 0,
    alanId: 0,
    pozisyonId: 0,
    minAdet: 0,};
  kriterAlanToUpdate: any = {};

  kriterPuanModelObj: KriterPuanModel[] = [];
  kriterPuanAddObj: KriterPuanAddModel = {
    kriterId: 0,
    alanId: 0,
    pozisyonId: 0,
    minPuan: 0,
    maxPuan: 0
  };
  kriterPuanToUpdate: any = {};

  // For dropdown options
  kriterList: KriterModel[] = [];
  alanList: any[] = [];
  pozisyonList: any[] = [];

  ngOnInit(): void {
    this.getAllKriter();
    this.loadDropdownOptions();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'kriter') {
      this.getAllKriter();
    } else if (tab === 'kriterAlan') {
      this.getAllKriterAlan();
    } else if (tab === 'kriterPuan') {
      this.getAllPuan();
    }
  }

  loadDropdownOptions() {
    // Load Kriter options
    this.kriterService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.kriterList = response.data;
        }
      },
    });

    // Load Alan options
    this.alanService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.alanList = response.data;
        }
      },
    });

    // Load Pozisyon options
    this.positionService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.pozisyonList = response.data;
        }
      },
    });
  }

  getAllKriter() {
    this.kriterService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.kriterModelObj = response.data;
        } else {
          this.toastService.error(response.message);
        }
      },
    });
  }

  getAllKriterAlan() {
    this.kriterAlanService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.kriterAlanModelObj = response.data;
        } else {
          this.toastService.error(response.message);
        }
      },
    });
  }
  getAllPuan() {
    this.kriterPuanService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.kriterPuanModelObj = response.data;
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
          this.toastrService.error(err.error.Message, 'Getirme başarısız!');
        }
      },
    });
  }


  addKriter() {
    Swal.fire({
      title: 'Yeni Kriter Ekle',
      html: `
          <input id="kriterAd" class="swal2-input" placeholder="Kriter Adı">
          <input id="kriterAciklama" class="swal2-input" placeholder="Açıklama">
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
        const kriterAd = (
          document.getElementById('kriterAd') as HTMLInputElement
        ).value.trim();
        const kriterAciklama = (
          document.getElementById('kriterAciklama') as HTMLInputElement
        ).value.trim();
        if (!kriterAd || !kriterAciklama) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
        return { ad: kriterAd, aciklama: kriterAciklama };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value) {
          this.kriterAddObj = {
            ad: result.value.ad,
            aciklama: result.value.aciklama,
          };
          this.kriterService.add(this.kriterAddObj).subscribe({
            next: (response) => {
              if (response.isSuccess) {
                this.toastService.success(response.message);
                this.getAllKriter();
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

  editKriter(kriter: KriterModel) {
    this.kriterToUpdate = { ...kriter };
    Swal.fire({
      title: `${kriter.id} ID'li kriteri güncelliyorsunuz`,
      html: `
          <p>Mevcut Kriter Adı: ${kriter.ad}</p>
          <p>Mevcut Açıklama: ${kriter.aciklama}</p>
          <hr>
          <p>Yeni Kriter Adı ve Açıklama:</p>
          <input id="kriterAd" class="swal2-input" value="${kriter.ad}" placeholder="Kriter Adı">
          <input id="kriterAciklama" class="swal2-input" value="${kriter.aciklama}" placeholder="Açıklama">
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
        const kriterAd = (
          document.getElementById('kriterAd') as HTMLInputElement
        ).value.trim();
        const kriterAciklama = (
          document.getElementById('kriterAciklama') as HTMLInputElement
        ).value.trim();
        if (!kriterAd || !kriterAciklama) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
        return { ad: kriterAd, aciklama: kriterAciklama };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedKriter: KriterModel = {
          ...this.kriterToUpdate,
          ad: result.value.ad,
          aciklama: result.value.aciklama,
        };
        this.kriterService.update(updatedKriter).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllKriter();
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

  deleteKriter(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li kriteri silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.kriterService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllKriter();
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

  addKriterAlan() {
    // Create dropdown options HTML
    const kriterOptions = this.kriterList
      .map((k) => `<option value="${k.id}">${k.ad}</option>`)
      .join('');

    const alanOptions = this.alanList
      .map((a) => `<option value="${a.id}">${a.ad}</option>`)
      .join('');

    const pozisyonOptions = this.pozisyonList
      .map((p) => `<option value="${p.id}">${p.ad}</option>`)
      .join('');

    Swal.fire({
      title: 'Yeni Alan Kriteri Ekle',
      html: `
        <select id="kriterId" class="swal2-input">
          <option value="">Kriter Seçin</option>
          ${kriterOptions}
        </select>
        <select id="alanId" class="swal2-input">
          <option value="">Alan Seçin</option>
          ${alanOptions}
        </select>
        <select id="pozisyonId" class="swal2-input">
          <option value="">Pozisyon Seçin</option>
          ${pozisyonOptions}
        </select>
        <input id="minAdet" type="number" class="swal2-input" min=0 placeholder="Min Adet">
      `,
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup-xl',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
      preConfirm: () => {
        const kriterId = (
          document.getElementById('kriterId') as HTMLSelectElement
        ).value;
        const alanId = (document.getElementById('alanId') as HTMLSelectElement)
          .value;
        const pozisyonId = (
          document.getElementById('pozisyonId') as HTMLSelectElement
        ).value;
        let minAdet = (document.getElementById('minAdet') as HTMLInputElement)
          .value;

        if (!kriterId || !alanId || !pozisyonId) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }

        return {
          kriterId: parseInt(kriterId),
          alanId: parseInt(alanId),
          pozisyonId: parseInt(pozisyonId),
          minAdet: minAdet === '0' ? null : parseInt(minAdet),
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.kriterAlanAddObj = {
          kriterId: result.value.kriterId,
          alanId: result.value.alanId,
          pozisyonId: result.value.pozisyonId,
          minAdet: result.value.minAdet === null ? undefined : result.value.minAdet,
        };

        this.kriterAlanService.add(this.kriterAlanAddObj).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllKriterAlan();
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
              console.log(err);
              this.toastrService.error(err.error.Message, 'Ekleme başarısız!');
            }
          },
        });
      }
    });
  }

  editKriterAlan(kriterAlan: KriterAlanModel) {
    this.kriterAlanToUpdate = { ...kriterAlan };

    // Create dropdown options HTML
    const kriterOptions = this.kriterList
      .map(
        (k) =>
          `<option value="${k.id}" ${
            kriterAlan.kriterId === k.id ? 'selected' : ''
          }>${k.ad}</option>`
      )
      .join('');

    const alanOptions = this.alanList
      .map(
        (a) =>
          `<option value="${a.id}" ${
            kriterAlan.alanId === a.id ? 'selected' : ''
          }>${a.ad}</option>`
      )
      .join('');

    const pozisyonOptions = this.pozisyonList
      .map(
        (p) =>
          `<option value="${p.id}" ${
            kriterAlan.pozisyonId === p.id ? 'selected' : ''
          }>${p.ad}</option>`
      )
      .join('');

    Swal.fire({
      title: `${kriterAlan.id} ID'li Alan Kriterini güncelliyorsunuz`,
      html: `
        <div class="mb-3">
          <p>Mevcut Değerler:</p>
          <p>Kriter: ${this.getKriterName(kriterAlan.kriterId)}</p>
          <p>Alan: ${this.getAlanName(kriterAlan.alanId)}</p>
          <p>Pozisyon: ${this.getPozisyonName(kriterAlan.pozisyonId)}</p>
          <p>Min Adet: ${kriterAlan.minAdet !== null ? kriterAlan.minAdet : 'Gerekmiyor'}</p>
        </div>
        <hr>
        <p>Yeni Değerler:</p>
        <select id="kriterId" class="swal2-input">
          <option value="">Kriter Seçin</option>
          ${kriterOptions}
        </select>
        <select id="alanId" class="swal2-input">
          <option value="">Alan Seçin</option>
          ${alanOptions}
        </select>
        <select id="pozisyonId" class="swal2-input">
          <option value="">Pozisyon Seçin</option>
          ${pozisyonOptions}
        </select>
        <input id="minAdet" type="number" class="swal2-input" min=0 value="${
          kriterAlan.minAdet
        }" placeholder="Min Adet">
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
        const kriterId = (
          document.getElementById('kriterId') as HTMLSelectElement
        ).value;
        const alanId = (document.getElementById('alanId') as HTMLSelectElement)
          .value;
        const pozisyonId = (
          document.getElementById('pozisyonId') as HTMLSelectElement
        ).value;
        const minAdet = (document.getElementById('minAdet') as HTMLInputElement)
          .value;

        if (!kriterId || !alanId || !pozisyonId ) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }

        return {
          kriterId: parseInt(kriterId),
          alanId: parseInt(alanId),
          pozisyonId: parseInt(pozisyonId),
          minAdet: minAdet === '0' ? null : parseInt(minAdet),
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedKriterAlan: KriterAlanModel = {
          ...this.kriterAlanToUpdate,
          kriterId: result.value.kriterId,
          alanId: result.value.alanId,
          pozisyonId: result.value.pozisyonId,
          minAdet: result.value.minAdet,
        };

        this.kriterAlanService.update(updatedKriterAlan).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllKriterAlan();
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
                err.error.Message,
                'Güncelleme başarısız!'
              );
            }
          },
        });
      }
    });
  }

  deleteKriterAlan(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li Alan Kriterini silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.kriterAlanService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllKriterAlan();
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

  // Helper methods to get names for IDs
  getKriterName(id: number): string {
    const kriter = this.kriterList.find((k) => k.id === id);
    return kriter ? kriter.ad : 'Bulunamadı';
  }

  getAlanName(id: number): string {
    const alan = this.alanList.find((a) => a.id === id);
    return alan ? alan.ad : 'Bulunamadı';
  }

  getPozisyonName(id: number): string {
    const pozisyon = this.pozisyonList.find((p) => p.id === id);
    return pozisyon ? pozisyon.ad : 'Bulunamadı';
  }

  addKriterPuan() {
    // Create dropdown options HTML
    const kriterOptions = this.kriterList
      .map((k) => `<option value="${k.id}">${k.ad}</option>`)
      .join('');
  
    const alanOptions = this.alanList
      .map((a) => `<option value="${a.id}">${a.ad}</option>`)
      .join('');
  
    const pozisyonOptions = this.pozisyonList
      .map((p) => `<option value="${p.id}">${p.ad}</option>`)
      .join('');
  
    Swal.fire({
      title: 'Yeni Kriter Puanı Ekle',
      html: `
        <select id="kriterId" class="swal2-input">
          <option value="">Kriter Seçin</option>
          ${kriterOptions}
        </select>
        <select id="alanId" class="swal2-input">
          <option value="">Alan Seçin</option>
          ${alanOptions}
        </select>
        <select id="pozisyonId" class="swal2-input">
          <option value="">Pozisyon Seçin</option>
          ${pozisyonOptions}
        </select>
        <input id="minPuan" type="number" class="swal2-input" min="0" placeholder="Min Puan">
        <input id="maxPuan" type="number" class="swal2-input" min="0" placeholder="Max Puan">
      `,
      showCancelButton: true,
      confirmButtonText: 'Ekle',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup-xl',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel',
      },
      preConfirm: () => {
        const kriterId = (
          document.getElementById('kriterId') as HTMLSelectElement
        ).value;
        const alanId = (document.getElementById('alanId') as HTMLSelectElement)
          .value;
        const pozisyonId = (
          document.getElementById('pozisyonId') as HTMLSelectElement
        ).value;
        const minPuanValue = (document.getElementById('minPuan') as HTMLInputElement)
          .value;
        const maxPuanValue = (document.getElementById('maxPuan') as HTMLInputElement)
          .value;
  
        if (!kriterId || !alanId || !pozisyonId) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
  
        // Parse values to integers, convert 0 to null
        let minPuan = minPuanValue === '' || minPuanValue === '0' ? null : parseInt(minPuanValue);
        let maxPuan = maxPuanValue === '' || maxPuanValue === '0' ? null : parseInt(maxPuanValue);
  
        // Only swap if both values are not null and min > max
        if (minPuan !== null && maxPuan !== null && minPuan > maxPuan) {
          [minPuan, maxPuan] = [maxPuan, minPuan];
          Swal.showValidationMessage('Min Puan, Max Puandan büyük olduğu için değerler otomatik olarak değiştirildi.');
          setTimeout(() => {
            Swal.resetValidationMessage();
          }, 2000);
        }
  
        return {
          kriterId: parseInt(kriterId),
          alanId: parseInt(alanId),
          pozisyonId: parseInt(pozisyonId),
          minPuan,
          maxPuan
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.kriterPuanAddObj = {
          kriterId: result.value.kriterId,
          alanId: result.value.alanId,
          pozisyonId: result.value.pozisyonId,
          minPuan: result.value.minPuan === null ? undefined : result.value.minPuan,
          maxPuan: result.value.maxPuan === null ? undefined : result.value.maxPuan
        };
  
        this.kriterPuanService.add(this.kriterPuanAddObj).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllPuan();
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
    });
  }
  
  editKriterPuan(kriterPuan: KriterPuanModel) {
    this.kriterPuanToUpdate = { ...kriterPuan };
  
    // Create dropdown options HTML
    const kriterOptions = this.kriterList
      .map(
        (k) =>
          `<option value="${k.id}" ${
            kriterPuan.kriterId === k.id ? 'selected' : ''
          }>${k.ad}</option>`
      )
      .join('');
  
    const alanOptions = this.alanList
      .map(
        (a) =>
          `<option value="${a.id}" ${
            kriterPuan.alanId === a.id ? 'selected' : ''
          }>${a.ad}</option>`
      )
      .join('');
  
    const pozisyonOptions = this.pozisyonList
      .map(
        (p) =>
          `<option value="${p.id}" ${
            kriterPuan.pozisyonId === p.id ? 'selected' : ''
          }>${p.ad}</option>`
      )
      .join('');
  
    Swal.fire({
      title: `${kriterPuan.id} ID'li Puan Kriterini güncelliyorsunuz`,
      html: `
        <div class="mb-3">
          <p>Mevcut Değerler:</p>
          <p>Kriter: ${this.getKriterName(kriterPuan.kriterId)}</p>
          <p>Alan: ${this.getAlanName(kriterPuan.alanId)}</p>
          <p>Pozisyon: ${this.getPozisyonName(kriterPuan.pozisyonId)}</p>
          <p>Min Puan: ${kriterPuan.minPuan ?? 'Boş'}</p>
          <p>Max Puan: ${kriterPuan.maxPuan ?? 'Boş'}</p>
        </div>
        <hr>
        <p>Yeni Değerler:</p>
        <select id="kriterId" class="swal2-input">
          <option value="">Kriter Seçin</option>
          ${kriterOptions}
        </select>
        <select id="alanId" class="swal2-input">
          <option value="">Alan Seçin</option>
          ${alanOptions}
        </select>
        <select id="pozisyonId" class="swal2-input">
          <option value="">Pozisyon Seçin</option>
          ${pozisyonOptions}
        </select>
        <input id="minPuan" type="number" class="swal2-input" min="0" value="${
          kriterPuan.minPuan ?? 0
        }" placeholder="Min Puan">
        <input id="maxPuan" type="number" class="swal2-input" min="0" value="${
          kriterPuan.maxPuan ?? 0
        }" placeholder="Max Puan">
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
        const kriterId = (
          document.getElementById('kriterId') as HTMLSelectElement
        ).value;
        const alanId = (document.getElementById('alanId') as HTMLSelectElement)
          .value;
        const pozisyonId = (
          document.getElementById('pozisyonId') as HTMLSelectElement
        ).value;
        const minPuanValue = (document.getElementById('minPuan') as HTMLInputElement)
          .value;
        const maxPuanValue = (document.getElementById('maxPuan') as HTMLInputElement)
          .value;
  
        if (!kriterId || !alanId || !pozisyonId) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
  
        // Parse values to integers, convert 0 to null
        let minPuan = minPuanValue === '' || minPuanValue === '0' ? null : parseInt(minPuanValue);
        let maxPuan = maxPuanValue === '' || maxPuanValue === '0' ? null : parseInt(maxPuanValue);
  
        // Only swap if both values are not null and min > max
        if (minPuan !== null && maxPuan !== null && minPuan > maxPuan) {
          [minPuan, maxPuan] = [maxPuan, minPuan];
          // Optionally show an info message about the swap
          Swal.showValidationMessage('Min Puan, Max Puandan büyük olduğu için değerler otomatik olarak değiştirildi.');
          setTimeout(() => {
            Swal.resetValidationMessage();
          }, 2000);
        }
  
        return {
          kriterId: parseInt(kriterId),
          alanId: parseInt(alanId),
          pozisyonId: parseInt(pozisyonId),
          minPuan,
          maxPuan
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedKriterPuan: KriterPuanModel = {
          ...this.kriterPuanToUpdate,
          kriterId: result.value.kriterId,
          alanId: result.value.alanId,
          pozisyonId: result.value.pozisyonId,
          minPuan: result.value.minPuan,
          maxPuan: result.value.maxPuan
        };
  
        this.kriterPuanService.update(updatedKriterPuan).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllPuan();
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
                err.error.Message,
                'Güncelleme başarısız!'
              );
            }
          },
        });
      }
    });
  }
  // 4. Delete score function
  deleteKriterPuan(id: number) {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li Puan Kriterini silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.kriterPuanService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getAllPuan();
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
