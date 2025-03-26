import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserModel } from '../../models/auth/user.model';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { TcMaskPipe } from "../../pipes/tcmask.pipe";

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
  selectedProfileImage: string | ArrayBuffer | null = null;
  profileImageChanged: boolean = false;

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.authService.getUserByToken().subscribe((response) => {
      this.userObj = response.data;
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

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
        this.profileImageChanged = true;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfileImage() {
    if (this.profileImage) {
      this.toastService.success('Profil resmi başarıyla güncellendi!');
    } else {
      this.toastService.info('Hiçbir değişiklik yapılmadı.');
    }
  }
  // Şifre ve e-posta güncelleme işlemleri
  updateProfile() {
    let hasChanges = false;
    this.userService.updateProfile({
      email: this.userObj.email,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword
    }).subscribe({next: (response) => {
      if(response.isSuccess) {
      this.toastService.success(response.message);
      hasChanges = true;
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.getUser();
      }
      else {
        this.toastService.error(response.message);
      }
    }, error: (err) => {
      if (err.error?.ValidationErrors) {
        const errorMessages = err.error.ValidationErrors.map((error: { ErrorMessage: string }) => error.ErrorMessage);
        errorMessages.forEach((message: string | undefined) => {
          this.toastrService.error(message);
        });
      } else {
        this.toastrService.error(err.error.message, "Giriş başarısız:");
      }
    }});
  }
}

