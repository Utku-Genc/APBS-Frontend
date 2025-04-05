import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/auth/user.model';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TcMaskPipe } from "../../pipes/tcmask.pipe";
import Swal from 'sweetalert2';

@Component({
  selector: 'utk-settings',
  imports: [FormsModule, CommonModule, TcMaskPipe],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  userObj!: UserModel;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  profileImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  profileImageChanged: boolean = false;
  isPasswordUpdateCollapseOpen: boolean = false;

  ngOnInit(): void {
    this.getUser();
  }
  
  getUser() {
    this.userService.getUserByToken().subscribe((response) => {
      this.userObj = response.data;
      if (this.userObj.imageUrl !== null) {
        this.profileImage = this.userObj.imageUrl;
      }
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      const validFormats = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/bmp',
        'image/tiff',
      ];

      if (!validFormats.includes(file.type)) {
        this.toastService.error(
          'Sadece statik resim formatları yükleyebilirsiniz! (PNG, JPG, BMP, TIFF)'
        );
        return;
      }

      this.selectedFile = file;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.profileImageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfileImage() {
    if (this.selectedFile && this.profileImageChanged) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      
      this.userService.changeProfileImage(formData).subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.toastService.success('Profil resmi başarıyla güncellendi!');
            this.getUser(); // Güncel kullanıcı bilgilerini yeniden yükle
            this.profileImageChanged = false;
          } else {
            this.toastService.error(response.message || 'Profil resmi güncellenemedi.');
          }
        },
        error: (err) => {
          if (err.error?.ValidationErrors) {
            const errorMessages = err.error.ValidationErrors.map((error: { ErrorMessage: string }) => error.ErrorMessage);
            errorMessages.forEach((message: string | undefined) => {
              this.toastrService.error(message);
            });
          } else {
            this.toastrService.error(err.error?.message || 'Profil resmi güncellenirken bir hata oluştu.');
          }
        }
      });
    } else {
      this.toastService.info('Hiçbir değişiklik yapılmadı.');
    }
  }

  // Şifre ve e-posta güncelleme işlemleri
  updateProfile() {
    Swal.fire({
      title: ``,
      html: `
        <p>Bu işlem için şifreye ihtiyaç vardır!</p>
        <hr>
        <p>Şifrenizi Giriniz: </p>
        <input id="password" type="password" class="swal2-input" placeholder="Şifrenizi giriniz" required>
      `,
      showCancelButton: true,
      icon: 'warning',
      confirmButtonText: 'Onayla',
      cancelButtonText: 'İptal',
      customClass: {
        popup: 'custom-swal-popup',
        confirmButton: 'custom-swal-confirm',
        cancelButton: 'custom-swal-cancel'
      },
      preConfirm: () => {
        const password = (document.getElementById('password') as HTMLInputElement).value.trim();
        if (!password) {
          Swal.showValidationMessage('Şifre alanı boş bırakılamaz!');
        }
        return password;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.userService.updateProfile({
          email: this.userObj.email,
          currentPassword: result.value,
        }).subscribe({
          next: (response) => {
            if (response.isSuccess) {
              this.toastService.success(response.message);
              this.getUser();
              this.userObj.email;
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
              this.toastrService.error(err.error.message, 'Giriş başarısız:');
            }
          },
        });
      }
    });
  }

  togglePasswordUpdateCollapse(){
    this.isPasswordUpdateCollapseOpen =!this.isPasswordUpdateCollapseOpen;
  }
  
  updatePassword() {
    this.userService.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword,
    }).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
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
          this.toastrService.error(err.error.message, 'Giriş başarısız:');
        }
      },
    });
  }
}