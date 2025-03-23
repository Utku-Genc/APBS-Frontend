import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { Ilan } from '../../models/ilan/ilan.model';
import { FormsModule } from '@angular/forms';
import { IlanAddModel } from '../../models/ilan/ilan-add.model';
import { PositionModel } from '../../models/position/position.model';
import { BolumModel } from '../../models/bolum/bolum.model';
import { PositionService } from '../../services/position.service';
import { BolumService } from '../../services/bolum.service';
import { IlanService } from '../../services/ilan.service';
import { ToastService } from '../../services/toast.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'utk-cards-forms',
  imports: [QuillModule, CommonModule, FormsModule],
  templateUrl: './cards.forms.component.html',
  styleUrls: ['./cards.forms.component.css'],
})
export class CardsFormsComponent implements OnInit {
  private positionService = inject(PositionService);
  private BolumService = inject(BolumService);
  private ilanService = inject(IlanService);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);

  formData: IlanAddModel = {
    pozisyonId: 0,
    bolumId: 0,
    baslik: '',
    aciklama: '',
    baslangicTarihi: new Date(),
    bitisTarihi: new Date(),
  };
  positions: PositionModel[] = [];
  bolums: BolumModel[] = [];
  editorConfig = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }], // Yazı Boyutu
      ['bold', 'italic', 'underline', 'strike'], // Yazı Stilini Değiştirme (Inline Styles)
      [{ list: 'ordered' }, { list: 'bullet' }], // Liste Seçenekleri
      ['clean'], // Temizleme Butonu
    ],
  };

  ngOnInit(): void {
    this.positionService.getAll().subscribe((positions) => {
      this.positions = positions.data;
    });

    this.BolumService.getAll().subscribe((bolums) => {
      this.bolums = bolums.data;
    });

  }

  submitForm() {
    console.log('Form Gönderildi:', this.formData);

    // İlan modelini oluşturma ve API'ye gönderme
    this.ilanService.add(this.formData).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          setTimeout(() => {
            // Formu sıfırlamak için
            this.formData = {
              pozisyonId: 0,
              bolumId: 0,
              baslik: '',
              aciklama: '',
              baslangicTarihi: new Date(),
              bitisTarihi: new Date(),
            };
          }, 1000);
        } else {
          this.toastService.error('Alan eklenirken bir hata oluştu: ' + response.message);
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
