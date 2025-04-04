import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { EmailService } from '../../services/email.service';
import { ToastService } from '../../services/toast.service';
import { EmailSendModel, EmailSendToUserModel } from '../../models/email/email-send.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'utk-admin-email',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './admin-email.component.html',
  styleUrl: './admin-email.component.css'
})
export class AdminEmailComponent implements OnInit {

  private emailService = inject(EmailService);
  private userService = inject(UserService);
  
  private tostService = inject(ToastService);
  private toastrService = inject(ToastrService);

  activeTab: 'email' | 'user' = 'user'; // Default olarak kullanıcıya gönderme sekmesi aktif
  users: any[] = [];

  sendMailObj: EmailSendModel = {
    email: '',
    subject: '',
    body: ''
  };
  
  sendMailToUserObj: EmailSendToUserModel = {
    userId: '',
    subject: '',
    body: ''
  };
  
  filtersForUser = {
    firstName: '',
    lastName: '',
    email: '',
    nationalityId: '',
    searchTerm: '',
    status: undefined,
    minDateOfBirth: '',
    maxDateOfBirth: '',
  };

  // Quill editör konfigürasyonu
  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      ['clean'],
      ['link']
    ]
  };
  
  pageNumberForUser = 1;
  pageSizeForUser = 10;
  sortByForUser = 'id';
  isDescendingForUser = false;
  
  ngOnInit(): void {
    // Başlangıçta ilk 10 kullanıcıyı otomatik olarak yükle
    this.loadInitialUsers();
  }

  // İlk 10 kullanıcıyı otomatik yükleyen metod
  loadInitialUsers() {
    this.userService.getUsersByQuery(this.pageSizeForUser, this.pageNumberForUser, this.sortByForUser, this.isDescendingForUser, {}).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.users = res.data;
        } else {
          this.tostService.error(res.message);
        }
      },
      error: (err) => {
        this.handleError(err, 'Kullanıcılar getirilemedi!');
      },
    });
  }

  sendMail() {
    if (!this.sendMailObj.email || !this.sendMailObj.subject || !this.sendMailObj.body) {
      this.tostService.error('Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    this.emailService.sendEmail(this.sendMailObj).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.tostService.success(res.message);
          this.resetMailForm();
        } else {
          this.tostService.error(res.message);
        }
      },
      error: (err) => {
        this.handleError(err, 'Mail gönderme başarısız!');
      },
    });
  }
  
  sendMailToUser() {
    if (!this.sendMailToUserObj.userId || !this.sendMailToUserObj.subject || !this.sendMailToUserObj.body) {
      this.tostService.error('Lütfen tüm alanları doldurunuz.');
      return;
    }
    
    this.emailService.sendEmailToUser(this.sendMailToUserObj).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.tostService.success(res.message);
          this.resetUserMailForm();
        } else {
          this.tostService.error(res.message);
        }
      },
      error: (err) => {
        this.handleError(err, 'Mail gönderme başarısız!');
      },
    });
  }

  getUsers() {
    this.userService.getUsersByQuery(this.pageSizeForUser, this.pageNumberForUser, this.sortByForUser, this.isDescendingForUser, this.filtersForUser).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.users = res.data;
          // Kullanıcı bulunamadıysa bildirim göster
          if (this.users.length === 0) {
            this.tostService.info('Arama kriterine uygun kullanıcı bulunamadı.');
          }
        } else {
          this.tostService.error(res.message);
        }
      },
      error: (err) => {
        this.handleError(err, 'Kullanıcılar getirilemedi!');
      },
    });
  }
  
  // Hata yönetimi için ortak metod
  handleError(err: any, defaultMessage: string) {
    if (err.error?.ValidationErrors) {
      const errorMessages = err.error.ValidationErrors.map(
        (error: { ErrorMessage: string }) => error.ErrorMessage
      );
      errorMessages.forEach((message: string | undefined) => {
        this.toastrService.error(message);
      });
    } else {
      this.toastrService.error(err.error?.message || defaultMessage, defaultMessage);
    }
  }
  
  resetMailForm() {
    this.sendMailObj = {
      email: '',
      subject: '',
      body: ''
    };
  }
  
  resetUserMailForm() {
    this.sendMailToUserObj = {
      userId: '',
      subject: '',
      body: ''
    };
    // Kullanıcı listesini temizlemiyoruz, otomatik yüklenen kullanıcılar görünmeye devam ediyor
  }
  
  // Form alanları dolu mu kontrol et (gönder butonu için)
  isEmailFormValid(): boolean {
    return !!(this.sendMailObj.email && this.sendMailObj.subject && this.sendMailObj.body);
  }
  
  // Kullanıcıya gönderme formu dolu mu kontrol et (gönder butonu için)
  isUserEmailFormValid(): boolean {
    return !!(this.sendMailToUserObj.userId && this.sendMailToUserObj.subject && this.sendMailToUserObj.body);
  }
}