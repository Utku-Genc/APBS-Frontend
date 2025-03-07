import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../models/auth/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'utk-settings',
  imports: [FormsModule, CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private toastService = inject(ToastService);
    private authService = inject(AuthService);
  

  userObj!: UserModel;
  currentPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  profileImage: string | ArrayBuffer | null = null;
  selectedProfileImage: string | ArrayBuffer | null = null;
  profileImageChanged: boolean = false;

    ngOnInit(): void {
        this.getUser();
    }
    getUser() {
      this.authService.getUserByToken().subscribe(response => {
        this.userObj = response.data;
      })
    }


    onImageChange(event: any) {
      const file = event.target.files[0];
    
      if (file) {
        const validFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/bmp', 'image/tiff'];
        
        if (!validFormats.includes(file.type)) {
          this.toastService.error("Sadece statik resim formatları yükleyebilirsiniz! (PNG, JPG, BMP, TIFF)");
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
      this.toastService.success("Profil resmi başarıyla güncellendi!");
    } else {
      this.toastService.info("Hiçbir değişiklik yapılmadı.");
    }
  }
  // Şifre ve e-posta güncelleme işlemleri
  updateProfile() {
    let hasChanges = false;

    // Şifre güncellemeleri
    if (this.currentPassword || this.newPassword) {
      if (!this.currentPassword) {
        this.toastService.error("Mevcut şifrenizi giriniz!");
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.toastService.error("Yeni şifreler eşleşmiyor!");
        return;
      }
      this.toastService.success("Şifre başarıyla güncellendi!");
      hasChanges = true;

      this.currentPassword = "";
      this.newPassword = "";
      this.confirmPassword = "";
    }

    // E-posta güncellemeleri
    if (this.userObj.email) {
      this.toastService.success("E-posta başarıyla güncellendi!");
      hasChanges = true;
    }

    if (!hasChanges) {
      this.toastService.info("Hiçbir değişiklik yapılmadı.");
    }
  }
}
