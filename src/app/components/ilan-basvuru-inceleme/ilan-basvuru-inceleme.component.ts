import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IlanBasvuruDosyaModel } from '../../models/ilan-basvuru-dosya/ilan-basvuru-dosya.model';
import { KriterModel } from '../../models/kriter/kriter.model';
import { KriterService } from '../../services/kriter.service';
import { IlanBasvuruDosyaService } from '../../services/ilan-basvuru-dosya.service';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

interface GruplanmisDosya {
  dosyaUrl: string;
  dosyaYolu: string;
  kriterler: { kriterId: number; kriterAd: string }[];
}

@Component({
  selector: 'utk-ilan-basvuru-inceleme',
  standalone: true,
  imports: [CommonModule, NgxDocViewerModule],
  templateUrl: './ilan-basvuru-inceleme.component.html',
  styleUrl: './ilan-basvuru-inceleme.component.css'
})
export class IlanBasvuruIncelemeComponent implements OnInit {
  private ilanBasvuruDosyaService = inject(IlanBasvuruDosyaService);
  private kriterService = inject(KriterService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  basvuruDosyalari: IlanBasvuruDosyaModel[] = [];
  kriterler: KriterModel[] = [];
  gruplanmisDosyalar: GruplanmisDosya[] = [];
  acikDosyalar: string[] = [];
  yukleniyor = true;
  hata = false;

  ngOnInit(): void {
    // URL'den id parametresini alma
    this.route.params.subscribe(params => {
      const basvuruId = +params['id']; // string'i number'a çevirme
      if (basvuruId) {
        this.getBasvuruDosyalari(basvuruId);
        this.getAllKriterler();
      }
    });
  }

  getBasvuruDosyalari(basvuruId: number): void {
    this.yukleniyor = true;
    this.ilanBasvuruDosyaService.getByBasvuruId(basvuruId).subscribe({
      next: (response) => {
        this.basvuruDosyalari = response.data;
        this.grupDosyalariniOlustur();
        this.yukleniyor = false;
      },
      error: (error) => {
        console.error('Başvuru dosyalarını getirirken hata oluştu:', error);
        this.yukleniyor = false;
        this.hata = true;
      }
    });
  }

  getAllKriterler(): void {
    this.kriterService.getAll().subscribe({
      next: (response) => {
        this.kriterler = response.data;
        // Kriterler yüklendikten sonra dosyaları güncelle
        if (this.basvuruDosyalari.length > 0) {
          this.grupDosyalariniOlustur();
        }
      },
      error: (error) => {
        console.error('Kriterleri getirirken hata oluştu:', error);
      }
    });
  }

  grupDosyalariniOlustur(): void {
    const grupMap = new Map<string, GruplanmisDosya>();
    
    this.basvuruDosyalari.forEach(dosya => {
      // Eğer bu dosya URL'si daha önce eklenmediyse
      if (!grupMap.has(dosya.dosyaUrl)) {
        grupMap.set(dosya.dosyaUrl, {
          dosyaUrl: dosya.dosyaUrl,
          dosyaYolu: dosya.dosyaYolu,
          kriterler: []
        });
      }
      
      // Kriterin adını bul
      const kriter = this.kriterler.find(k => k.id === dosya.kriterId);
      if (kriter) {
        // Bu URL'nin kriterler listesinde bu kriter var mı kontrol et
        const mevcutGrup = grupMap.get(dosya.dosyaUrl);
        const kriterVarMi = mevcutGrup?.kriterler.some(k => k.kriterId === dosya.kriterId);
        
        // Eğer bu kriter daha önce eklenmemişse ekle
        if (mevcutGrup && !kriterVarMi) {
          mevcutGrup.kriterler.push({
            kriterId: dosya.kriterId,
            kriterAd: kriter.ad
          });
        }
      }
    });
    
    // Map'ten array'e dönüştür
    this.gruplanmisDosyalar = Array.from(grupMap.values());
  }

  toggleDosya(dosyaUrl: string): void {
    if (this.acikDosyalar.includes(dosyaUrl)) {
      // Dosya zaten açıksa kapat
      this.acikDosyalar = this.acikDosyalar.filter(url => url !== dosyaUrl);
    } else {
      // Dosya kapalıysa aç
      this.acikDosyalar.push(dosyaUrl);
    }
  }

  dosyaIndir(url: string, event: Event): void {
    event.stopPropagation(); // Tıklamanın üst öğelere yayılmasını engelle
    window.open(url, '_blank');
  }

  getDosyaAdi(dosyaYolu: string): string {
    if (!dosyaYolu) return 'Dosya';
    
    // Klasör yolundan sonraki kısmı al
    const klasorAyir = dosyaYolu.split('/');
    if (klasorAyir.length > 1) {
      return klasorAyir[klasorAyir.length - 1];
    }
    return dosyaYolu;
  }

  getDosyaUzantisi(dosyaAdi: string): string {
    if (!dosyaAdi) return '';
    
    const parts = dosyaAdi.split('.');
    if (parts.length > 1) {
      return parts[parts.length - 1].toLowerCase();
    }
    return '';
  }

  getDosyaTipi(url: string): string {
    if (!url) return 'default';
    
    const uzanti = this.getDosyaUzantisi(url);
    
    // Dosya tiplerini belirle
    if (uzanti === 'pdf') {
      return 'pdf';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(uzanti)) {
      return 'image';
    } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(uzanti)) {
      return 'office';
    } else if (['txt', 'csv', 'json', 'xml'].includes(uzanti)) {
      return 'text';
    }
    
    return 'default';
  }

  getSafeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getDosyaIcon(dosyaTipi: string, uzanti: string): string {
    switch (dosyaTipi) {
      case 'pdf':
        return 'fa-file-pdf';
      case 'image':
        return 'fa-file-image';
      case 'office':
        if (['doc', 'docx'].includes(uzanti)) return 'fa-file-word';
        if (['xls', 'xlsx'].includes(uzanti)) return 'fa-file-excel';
        if (['ppt', 'pptx'].includes(uzanti)) return 'fa-file-powerpoint';
        return 'fa-file-alt';
      case 'text':
        return 'fa-file-alt';
      default:
        return 'fa-file';
    }
  }
}