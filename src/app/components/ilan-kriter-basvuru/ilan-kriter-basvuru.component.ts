import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface KriterMadde {
  kod: string;
  baslik: string;
  minDosyaSayisi: number;
  maxPuan: number;
}

@Component({
  selector: 'utk-ilan-kriter-basvuru',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ilan-kriter-basvuru.component.html',
  styleUrls: ['./ilan-kriter-basvuru.component.css']
})
export class IlanKriterBasvuruComponent implements OnInit {
  basvuruForm!: FormGroup;
  kriterMaddeleri: KriterMadde[] = [
    { kod: 'A.1-A.2', baslik: 'A.1-A.2 Kriteri', minDosyaSayisi: 3, maxPuan: 3 },
    { kod: 'A.1-A.4', baslik: 'A.1-A.4 Kriteri', minDosyaSayisi: 4, maxPuan: 4 },
    { kod: 'A.1-A.5', baslik: 'A.1-A.5 Kriteri', minDosyaSayisi: 1, maxPuan: 1 },
    { kod: 'A.1-A.6', baslik: 'A.1-A.6 Kriteri', minDosyaSayisi: 4, maxPuan: 4 },
    { kod: 'A.1-A.8', baslik: 'A.1-A.8 Kriteri', minDosyaSayisi: 2, maxPuan: 2 },
    { kod: 'Başlıca Yazar', baslik: 'Başlıca Yazar Kriteri', minDosyaSayisi: 3, maxPuan: 3 },
    { kod: 'Toplam Makale', baslik: 'Toplam Makale Kriteri', minDosyaSayisi: 7, maxPuan: 7 },
    { kod: 'Kişisel ve Karma Etkinlik', baslik: 'Kişisel ve Karma Etkinlik Kriteri', minDosyaSayisi: 5, maxPuan: 20 },
    { kod: 'F.1 veya F.2', baslik: 'F.1 veya F.2 Kriteri', minDosyaSayisi: 1, maxPuan: 2 },
    { kod: 'H.1-12 veya H.13-17', baslik: 'H.1-12 veya H.13-17 Kriteri', minDosyaSayisi: 1, maxPuan: 2 },
    { kod: 'H.1-12 veya H.13-22', baslik: 'H.1-12 veya H.13-22 Kriteri', minDosyaSayisi: 1, maxPuan: 2 }
  ];
  
  // İlgili alanlar için filtrelenmiş kriterler
  aktifAlanKriterleri: KriterMadde[] = [];
  aktifKriterIndex = 0;
  
  // Hata mesajları için
  hataMesaji: string = '';
  
  constructor(private fb: FormBuilder,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.aktifAlanKriterleri = this.kriterMaddeleri.filter(kriter => 
      ['A.1-A.2', 'A.1-A.4', 'A.1-A.5', 'Başlıca Yazar', 'Toplam Makale', 'F.1 veya F.2', 'H.1-12 veya H.13-17'].includes(kriter.kod)
    );
    
    this.basvuruFormunuOlustur();
  }

  basvuruFormunuOlustur(): void {
    this.basvuruForm = this.fb.group({
      kriterler: this.fb.array([])
    });
    
    // Her kriter için bir form grubu oluştur
    this.aktifAlanKriterleri.forEach(kriter => {
      this.kriterlerFormArray.push(this.kriterFormGrubuOlustur(kriter));
    });
  }

  kriterFormGrubuOlustur(kriter: KriterMadde): FormGroup {
    const formGroup = this.fb.group({
      kriterKod: [kriter.kod],
      kriterBaslik: [kriter.baslik],
      dosyalar: this.fb.array([])
    });
    
    // Minimum dosya sayısı kadar boş dosya alanı ekle
    const dosyalarArray = formGroup.get('dosyalar') as FormArray;
    for (let i = 0; i < kriter.minDosyaSayisi; i++) {
      dosyalarArray.push(this.dosyaFormGrubuOlustur());
    }
    
    return formGroup;
  }

  dosyaFormGrubuOlustur(): FormGroup {
    return this.fb.group({
      dosyaAdi: ['', Validators.required],
      dosya: [null, Validators.required],
      dosyaYolu: ['']
    });
  }

  get kriterlerFormArray(): FormArray {
    return this.basvuruForm.get('kriterler') as FormArray;
  }

  getDosyalarFormArray(kriterIndex: number): FormArray {
    return this.kriterlerFormArray.at(kriterIndex).get('dosyalar') as FormArray;
  }

  dosyaEkle(kriterIndex: number): void {
    this.getDosyalarFormArray(kriterIndex).push(this.dosyaFormGrubuOlustur());
  }

  dosyaSil(kriterIndex: number, dosyaIndex: number): void {
    const dosyalarArray = this.getDosyalarFormArray(kriterIndex);
    if (dosyalarArray.length > this.aktifAlanKriterleri[kriterIndex].minDosyaSayisi) {
      dosyalarArray.removeAt(dosyaIndex);
    } else {
      this.hataMesaji = `Bu kriter için en az ${this.aktifAlanKriterleri[kriterIndex].minDosyaSayisi} dosya gereklidir!`;
      setTimeout(() => this.hataMesaji = '', 3000); // 3 saniye sonra hata mesajını temizle
    }
  }

  dosyaSec(event: any, kriterIndex: number, dosyaIndex: number): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const dosyaFormGroup = this.getDosyalarFormArray(kriterIndex).at(dosyaIndex) as FormGroup;
      dosyaFormGroup.patchValue({
        dosyaAdi: file.name,
        dosya: file
      });
      
      // Hata mesajlarını temizle
      this.hataMesaji = '';
    }
  }

  // Aktif kriterin geçerli olup olmadığını kontrol et
  aktifKriterGecerli(): boolean {
    const aktifDosyalar = this.getDosyalarFormArray(this.aktifKriterIndex);
    const minDosyaSayisi = this.aktifAlanKriterleri[this.aktifKriterIndex].minDosyaSayisi;
    
    // Minimum dosya sayısını karşılıyor mu?
    if (aktifDosyalar.length < minDosyaSayisi) {
      return false;
    }
    
    // Tüm dosyaların seçilip seçilmediğini kontrol et
    let gecerliDosyaSayisi = 0;
    for (let i = 0; i < aktifDosyalar.length; i++) {
      const dosya = aktifDosyalar.at(i);
      if (dosya.get('dosya')?.value && dosya.get('dosyaAdi')?.value) {
        gecerliDosyaSayisi++;
      }
    }
    
    return gecerliDosyaSayisi >= minDosyaSayisi;
  }

  sonrakiAdim(): void {
    // Şu anki kriter için minimum şartı kontrol et
    if (!this.aktifKriterGecerli()) {
      this.hataMesaji = `Lütfen "${this.aktifAlanKriterleri[this.aktifKriterIndex].baslik}" için en az ${this.aktifAlanKriterleri[this.aktifKriterIndex].minDosyaSayisi} dosya yükleyin!`;
      setTimeout(() => this.hataMesaji = '', 4000);
      return;
    }
    
    if (this.aktifKriterIndex < this.aktifAlanKriterleri.length - 1) {
      this.aktifKriterIndex++;
      this.hataMesaji = '';
    } else {
      this.hataMesaji = 'Son adımdasınız!';
      setTimeout(() => this.hataMesaji = '', 3000);
    }
  }

  oncekiAdim(): void {
    if (this.aktifKriterIndex > 0) {
      this.aktifKriterIndex--;
      this.hataMesaji = '';
    } else {
      this.hataMesaji = 'İlk adımdasınız!';
      setTimeout(() => this.hataMesaji = '', 3000);
    }
  }

  formGonder(): void {
    // Tüm formun geçerli olup olmadığını kontrol et
    let tumKriterlerGecerli = true;
    let ilkGecersizKriterIndex = -1;
    
    for (let i = 0; i < this.aktifAlanKriterleri.length; i++) {
      this.aktifKriterIndex = i; // Geçici olarak indeksi değiştir
      if (!this.aktifKriterGecerli()) {
        tumKriterlerGecerli = false;
        ilkGecersizKriterIndex = i;
        break;
      }
    }
    
    if (tumKriterlerGecerli) {
      console.log('Form verileri:', this.basvuruForm.value);
      // API isteği eklenecek
      this.hataMesaji = 'Başvurunuz başarıyla kaydedildi!';
      setTimeout(() => this.hataMesaji = '', 3000);
    } else {
      this.aktifKriterIndex = ilkGecersizKriterIndex; // İlk geçersiz kritere git
      this.hataMesaji = `"${this.aktifAlanKriterleri[ilkGecersizKriterIndex].baslik}" kriteri için minimum dosya şartı karşılanmamış!`;
      setTimeout(() => this.hataMesaji = '', 4000);
    }
  }

  // Dosyaların yüklü olup olmadığını kontrol et (UI için)
  dosyaYukluMu(kriterIndex: number, dosyaIndex: number): boolean {
    const dosya = this.getDosyalarFormArray(kriterIndex).at(dosyaIndex);
    return dosya.get('dosya')?.value !== null && dosya.get('dosyaAdi')?.value !== '';
  }

  triggerFileInputClick(inputId: string): void {
    const fileInput = this.renderer.selectRootElement(`#${inputId}`, true);
    fileInput.click();
  }

  // Geçerli dosya sayısını hesapla
  getirilmisDosyaSayisi(kriterIndex: number): number {
    const dosyalar = this.getDosyalarFormArray(kriterIndex);
    let gecerliDosya = 0;
    
    for (let i = 0; i < dosyalar.length; i++) {
      if (dosyalar.at(i).get('dosya')?.value) {
        gecerliDosya++;
      }
    }
    
    return gecerliDosya;
  }
}