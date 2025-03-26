import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ToastService } from '../../services/toast.service';
import * as bootstrap from 'bootstrap';
import { TcMaskPipe } from '../../pipes/tcmask.pipe';
import { UserService } from '../../services/user.service';
import { UserListModel } from '../../models/user/user-list.model';
import { UserOperationClaimService } from '../../services/user-operation-claim.service';
import { UserOperationClaimModel } from '../../models/user-operation-claim/user-operation-claim.model';
import { OperationClaimService } from '../../services/operation-claim.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OperationClaimModel } from '../../models/operation-claim/operation-claim.model';

@Component({
  selector: 'utk-admin-user-management',
  imports: [CommonModule, TcMaskPipe, FormsModule, RouterModule],
  templateUrl: './admin-user-management.component.html',
  styleUrls: ['./admin-user-management.component.css'],
})
export class AdminUserManagementComponent implements OnInit {
  @ViewChild('editUserRoleModal') editUserRoleModal!: ElementRef;
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private userService = inject(UserService);
  private userOperationClaimService = inject(UserOperationClaimService);
  private operationClaimService = inject(OperationClaimService);


  users: UserListModel[] = [];

  showFilters = false;

  filters = {
    firstName: '',
    lastName: '',
    email: '',
    nationalityId: '',
    status: undefined,
    minDateOfBirth: '',
    maxDateOfBirth: ''
  };
  pageNumber = 1;
  pageSize = 10;
  sortBy = 'id';
  isDescending = false;
  
  userRole: UserOperationClaimModel[] = [];
  roles: OperationClaimModel[] = [];

  selectedUserRoles: any[] = [];
  selectedAvailableRoles: any[] = [];

  userRoleId: number | null = null;
  profileImage: boolean = false;

  ngOnInit(): void {
    this.loadFiltersFromUrl();
    this.getAllRoles();
  }
  
  loadFiltersFromUrl() {
    this.activatedRoute.queryParams.subscribe((params) => {
      // URL'den filtre parametrelerini al
      this.filters.firstName = params['firstName'] || '';
      this.filters.lastName = params['lastName'] || '';
      this.filters.email = params['email'] || '';
      this.filters.status = params['status'] || undefined;
      this.filters.minDateOfBirth = params['minDateOfBirth'] || '';
      this.filters.maxDateOfBirth = params['maxDateOfBirth'] || '';
  
      // Sayfa numarasını al
      this.pageNumber = +params['page'] || 1;
  
      // Filtrelerle kullanıcıları yükle
      this.loadUsers();
    });
  }
  
  loadUsers() {
    this.userService
      .getUsersByQuery(
        this.pageSize,
        this.pageNumber,
        this.sortBy,
        this.isDescending,
        this.filters
      )
      .subscribe(
        (response) => {
          if (response.isSuccess) {
            this.users = response.data;
            this.users.forEach((user) => {
              this.getUsersRoleById(user.id);
            });
          } else {
            this.toastService.error('Kullanıcılar yüklenirken hata oluştu.');
          }
        },
        (error) => {
          this.toastService.error('API isteği başarısız oldu.');
        }
      );
  
    // URL'yi güncelle
    this.updateUrlWithFilters();
  }
  

  getUsersRoleById(userId: number) {
    this.userOperationClaimService.getByUserId(userId).subscribe(
      (response) => {
        if (response.isSuccess) {
          const userIndex = this.users.findIndex((user) => user.id === userId);
          if (userIndex !== -1) {
            this.users[userIndex].roles = response.data;
          }
        } else {
          this.toastService.error('Roller yüklenirken hata oluştu.');
        }
      },
      (error) => {
        this.toastService.error('API isteği başarısız oldu.');
      }
    );
  }

updateUrlWithFilters() {
  const queryParams: any = {};

  if (this.filters.firstName) queryParams.firstName = this.filters.firstName;
  if (this.filters.lastName) queryParams.lastName = this.filters.lastName;
  if (this.filters.email) queryParams.email = this.filters.email;
  if (this.filters.status) queryParams.status = this.filters.status;
  if (this.filters.minDateOfBirth) queryParams.minDateOfBirth = this.filters.minDateOfBirth;
  if (this.filters.maxDateOfBirth) queryParams.maxDateOfBirth = this.filters.maxDateOfBirth;
  if (this.pageNumber) queryParams.page = this.pageNumber;

  this.router.navigate([], {
    relativeTo: this.activatedRoute,
    queryParams: queryParams,
    queryParamsHandling: 'merge', // Diğer parametreleri kaybetmeden birleştir
  });
}

resetFilters() {
  this.filters = {
    firstName: '',
    lastName: '',
    email: '',
    nationalityId: '',
    status: undefined,
    minDateOfBirth: '',
    maxDateOfBirth: ''
  };
  this.pageNumber = 1;
  this.loadUsers();
}

toggleFilters() {
  this.showFilters = !this.showFilters;
}
  previousPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadUsers();
    }
  }

  nextPage() {
    this.pageNumber++;
    this.loadUsers();
  }
  // API'den kullanıcıları çekme
  getAllRoles() {
    this.operationClaimService.getAll().subscribe(
      (response) => {
        if (response.isSuccess) {
          this.roles = response.data;
          console.log(response.data);
        } else {
          this.toastService.error('Roller yüklenirken hata oluştu.');
        }
      },
      (error) => {
        this.toastService.error('API isteği başarısız oldu.');
      }
    );
  }

  // Kullanıcıyı engelleme
  blockUser(userId: number) {
    Swal.fire({
      title: 'Kullanıcıyı Engelle',
      text: `${userId} ID'li kullanıcı engellenecek. Onaylıyor musunuz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, engelle',
      cancelButtonText: 'İptal',
      customClass: {
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deactivateUser(userId).subscribe((response) => {
          if (response.isSuccess) {
            this.toastService.success(response.message);
            this.loadUsers(); // Kullanıcıları yeniden yükle
          } else {
            this.toastService.error('Kullanıcı engellenirken hata oluştu.');
          }
        });
      }
    });
  }

  // Kullanıcı engelini kaldırma
  unblockUser(userId: number) {
    Swal.fire({
      title: 'Engeli Kaldır',
      text: `${userId} ID'li kullanıcının engeli kaldırılacak. Onaylıyor musunuz?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Evet, kaldır',
      cancelButtonText: 'İptal',
      customClass: {
        cancelButton: 'custom-swal-cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.activateUser(userId).subscribe((response) => {
          if (response.isSuccess) {
            this.toastService.success(response.message);

            this.loadUsers(); // Kullanıcıları yeniden yükle
          } else {
            this.toastService.error('Engel kaldırılırken hata oluştu.');
          }
        });
      }
    });
  }

  // Kullanıcı rolünü düzenlemek için modalı aç
  editUserRole(userId: number) {
    this.userRoleId = userId;

    // Kullanıcının rollerini çek
    this.userOperationClaimService.getByUserId(userId).subscribe(
      (response) => {
        if (response.isSuccess) {
          this.selectedUserRoles = response.data; // Kullanıcının mevcut rollerini ekle

          // Kullanıcının sahip olmadığı rolleri hesapla
          this.selectedAvailableRoles = this.roles.filter(
            (role) =>
              !this.selectedUserRoles.some(
                (roles) => roles.operationClaimId === role.id
              )
          );

          // Modalı aç
          setTimeout(() => {
            const modalElement = this.editUserRoleModal.nativeElement;
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }, 100);
        } else {
          this.toastService.error('Kullanıcı rolleri yüklenirken hata oluştu.');
        }
      },
      (error) => {
        this.toastService.error('API isteği başarısız oldu.');
      }
    );
  }

  // Modal içeriğini kapatma
  closeModal() {
    const modalElement = this.editUserRoleModal.nativeElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }

  // Rol silme işlemi
  deleteRole(role: any) {
    if (!role.id) return;

    Swal.fire({
      title: 'Rolü Sil',
      text: `${role.operationClaimName} rolü kaldırılacak. Emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Evet, sil',
      cancelButtonText: 'İptal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userOperationClaimService.delete(role.id).subscribe(
          (response) => {
            if (response.isSuccess) {
              this.selectedUserRoles = this.selectedUserRoles.filter(
                (r) => r.id !== role.id
              );
              this.selectedAvailableRoles.push({
                id: role.operationClaimId,
                name: role.operationClaimName,
              });
              this.toastService.success(response.message);
            } else {
              this.toastService.error('Rol silinirken hata oluştu.');
            }
          },
          (error) => {
            this.toastService.error('API isteği başarısız oldu.');
          }
        );
      }
    });
  }

  // Rol ekleme işlemi
  addRole(role: any) {
    if (!this.userRoleId) return;

    const requestBody = {
      userId: this.userRoleId, // Kullanıcının ID'si
      operationClaimId: role.id, // Eklenmek istenen rolün ID'si
    };

    this.userOperationClaimService.add(requestBody).subscribe(
      (response) => {
        if (response.isSuccess) {
          // API'den gelen başarı yanıtı ile, kullanıcıya yeni rolü ekleyin
          this.selectedUserRoles.push({
            operationClaimName: role.name,
            operationClaimId: role.id, // Eklenen rolün ID'si
          });

          // Eklenen rolü 'available roles' listesinden çıkarın
          this.selectedAvailableRoles = this.selectedAvailableRoles.filter(
            (r) => r.id !== role.id
          );

          this.toastService.success(response.message);
        } else {
          this.toastService.error(response.message);
        }
      },
      (error) => {
        this.toastService.error('API isteği başarısız oldu.');
      }
    );
  }

  saveRoles() {
    this.closeModal();
    this.loadUsers(); // Rol değişikliğinde kullanıcıların yeniden yüklenmesi gerekiyor
    this.toastService.success('Değişiklikler başarıyla işlendi.');
  }
}
