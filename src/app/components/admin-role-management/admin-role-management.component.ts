import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { OperationClaimService } from '../../services/operation-claim.service';
import { ToastService } from '../../services/toast.service';
import { PositionService } from '../../services/position.service';

import { OperationClaimModel } from '../../models/operation-claim/operation-claim.model';
import { PositionModel } from '../../models/position/position.model';
import Swal from 'sweetalert2';
import { OperationClaimAddModel } from '../../models/operation-claim/operation-claim-add.model';
import { PositionAddModel } from '../../models/position/position-add.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'utk-admin-role-management',
  imports: [CommonModule],
  templateUrl: './admin-role-management.component.html',
  styleUrl: './admin-role-management.component.css'
})
export class AdminRoleManagementComponent implements OnInit {
  private operationClaimService=  inject(OperationClaimService);
  private positionService= inject(PositionService);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);

  roleModelObj !: OperationClaimModel[]; 
  roleAddObj !: OperationClaimAddModel; 
  roleToUpdate !: OperationClaimModel;

  positionModelObj!: PositionModel[];
  positionAddObj!: PositionAddModel; 
  positionToUpdate!: PositionModel;

  activeTab: string = 'role';


  ngOnInit() {
    this.loadRoles();
    this.loadPosition();
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  loadRoles() {
    this.operationClaimService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.roleModelObj = response.data;
        } else {
          this.toastService.error('Alanlar getirilirken bir hata oluştu: ' + (response.message ?? ''));
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
  addRole(){
        Swal.fire({
          title: 'Yeni Rol Ekle',
          html: `
            <input id="rolAd" class="swal2-input" placeholder="Rol Adı">
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
            const rolAd = (document.getElementById('rolAd') as HTMLInputElement).value.trim();
            if (!rolAd) {
              Swal.showValidationMessage('Tüm roleları doldurmalısınız!');
              return false; 
            }
            return { ad: rolAd};
          }
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value) {
              this.roleAddObj = { name: result.value.ad };
              this.operationClaimService.add(this.roleAddObj).subscribe({
                next: (response) => {
                  if (response.isSuccess) {
                    this.toastService.success(response.message);
                    this.loadRoles();
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
          }
        });
  }
  editRole(role: OperationClaimModel){
        this.roleToUpdate = { ...role }; 
        Swal.fire({
          title: `${role.id} ID'li rolü güncelliyorsunuz`,
          html: `
            <p>Mevcut Rol Adı: ${role.name}</p>
            <hr>
            <p>Yeni Rol Adı</p>
            <input id="roleAd" class="swal2-input" value="${role.name}" placeholder="Role Adı">
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
            const roleAd = (document.getElementById('roleAd') as HTMLInputElement).value.trim();
            if (!roleAd) {
              Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
              return false;
            }
            return { ad: roleAd };
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const updatedRole: OperationClaimModel = { ...this.roleToUpdate, name: result.value.ad};
            this.operationClaimService.update(updatedRole).subscribe({
              next: (response) => {
                if (response.isSuccess) {
                  this.toastService.success(response.message);
                  this.loadRoles(); 
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
  deleteRole(id: number){
       Swal.fire({
          title: 'Emin misiniz?',
          text: `${id} ID'li rolü silmek istediğinizden emin misiniz?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Evet, Sil!',
          cancelButtonText: 'Hayır, İptal',
        }).then((result) => {
          if (result.isConfirmed) {
            this.operationClaimService.delete(id).subscribe({
              next: (response) => {
                if (response.isSuccess) {
                  this.toastService.success(response.message);
                  this.loadRoles(); 
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

  loadPosition(){
    this.positionService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.positionModelObj = response.data;

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

  addPosition(){
    Swal.fire({
          title: 'Yeni Pozisyon Ekle',
          html: `
            <input id="positionAd" class="swal2-input" placeholder="Pozisyon Adı">
            <input id="positionAciklama" class="swal2-input" placeholder="Açıklama">
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
            const positionAd = (document.getElementById('positionAd') as HTMLInputElement).value.trim();
            const positionAciklama = (document.getElementById('positionAciklama') as HTMLInputElement).value.trim();

      
            if (!positionAd || !positionAciklama) {
              Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
              return false;
            }
      
            return { ad: positionAd, aciklama: positionAciklama};
          }
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const positionAddObj = {
              ad: result.value.ad,
              aciklama: result.value.aciklama,
            };
            this.positionService.add(positionAddObj).subscribe({
              next: (response) => {
                if (response.isSuccess) {
                  this.toastService.success(response.message);
                  this.loadPosition(); 
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
  editPosition(position: PositionModel){
    this.positionToUpdate = { ...position }; 
    Swal.fire({
      title: `${position.id} ID'li pozisyonu güncelliyorsunuz`,
      html: `
        <p>Mevcut Pozisyon Adı: ${position.ad}</p>
        <p>Mevcut Açıklama: ${position.aciklama}</p>
        <hr>
        <p>Yeni Pozisyon Adı ve Açıklama</p>
        <input id="positionAd" class="swal2-input" value="${position.ad}" placeholder="Pozisyon Adı">
        <input id="positionAciklama" class="swal2-input" value="${position.aciklama}" placeholder="Açıklama">
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
        const positionAd = (document.getElementById('positionAd') as HTMLInputElement).value.trim();
        const positionAciklama = (document.getElementById('positionAciklama') as HTMLInputElement).value.trim();
        if (!positionAd || !positionAciklama) {
          Swal.showValidationMessage('Tüm alanları doldurmalısınız!');
          return false;
        }
        return { ad: positionAd, aciklama: positionAciklama };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatePosition: PositionModel = { ...this.positionToUpdate, ad: result.value.ad, aciklama: result.value.aciklama};
        this.positionService.update(updatePosition).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.loadPosition(); 
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
  deletePosition(id: number){
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${id} ID'li pozisyonu silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'Hayır, İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.positionService.delete(id).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.loadPosition(); 
            } else {
              this.toastService.error('Bölüm silinirken bir hata oluştu: ' + response.message);
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
}