import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { Ilan } from '../../models/ilan/ilan.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'utk-cards-forms',
  imports: [QuillModule, CommonModule, FormsModule],
  templateUrl: './cards.forms.component.html',
  styleUrls: ['./cards.forms.component.css'],
})
export class CardsFormsComponent {
  formData: Ilan = {
    olusturanId: 1, // Dinamiğe çevirecem
    pozisyonId: null,
    bolumId: null,
    baslik: '',
    aciklama: '',
    status: true,
  };

  positions = [
    { id: 1, name: 'Dr. Öğr. Üyesi' },
    { id: 2, name: 'Doçent' },
    { id: 3, name: 'Profesör' },
  ];

  departments = [
    { id: 1, name: 'Bilgisayar Mühendisliği' },
    { id: 2, name: 'Tarih' },
    { id: 3, name: 'Matematik' },
  ];

  editorConfig = {
    toolbar: [
      [{ 'size': ['small', false, 'large', 'huge'] }],  // Yazı Boyutu
      ['bold', 'italic', 'underline', 'strike'],  // Yazı Stilini Değiştirme (Inline Styles)
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],  // Liste Seçenekleri
      ['clean']  // Temizleme Butonu
    ]
  };
  
  submitForm() {
    console.log('Form Gönderildi:', this.formData);

    // Api eklenecek

    setTimeout(() => {
      console.log('İlan başarıyla kaydedildi:', this.formData);
      alert('İlan başarıyla kaydedildi!');

      // Formu sıfırlamak için
      this.formData = {
        olusturanId: 1,
        pozisyonId: 0,
        bolumId: 0,
        baslik: '',
        aciklama: '',
        status: true,
      };
    }, 1000); 
  }
}
