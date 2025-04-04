import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NewlinePipe } from '../../pipes/newline.pipe';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { IlanService } from '../../services/ilan.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'utk-cards-detail',
  imports: [CommonModule, NewlinePipe],
  templateUrl: './cards.detail.component.html',
  styleUrl: './cards.detail.component.css',
})
export class CardsDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ilanService = inject(IlanService);
  private toastService = inject(ToastService);

  ilanDetailObj!: IlanDetailModel;
  currentDate: Date = new Date();
  isLoggedIn = false;
  remainingTimeText = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoggedIn = !!localStorage.getItem('token');
    this.getIlanDetail(id);

    // Her saniye kalan zamanı güncelle
    setInterval(() => {
      this.currentDate = new Date();
      if (this.ilanDetailObj && this.isBeforeStartDate()) {
        this.calculateRemainingTime();
      }
    }, 1000);
  }

  getIlanDetail(id: number) {
    this.ilanService.getById(id).subscribe({
      next: (res) => {
        if (!res.data.status) {
          this.toastService.info(
            'Bu ilan şu anda pasif durumda. Yalnızca yetkiniz dahilinde görüntüleyebilirsiniz.'
          );
        }
        this.ilanDetailObj = res.data;
        if (this.isBeforeStartDate()) {
          this.calculateRemainingTime();
        }
      },
      error: (err) => {
        // 403 hata kodu gelirse unauthorized sayfasına yönlendir
        if (err.status === 403 || err.status === 400) {
          this.router.navigate(['/unauthorized']);
        }
      },
    });
  }

  // Başvuru süresi başlamadan önceki durum kontrolü
  isBeforeStartDate(): boolean {
    if (!this.ilanDetailObj) return false;
    const startDate = new Date(this.ilanDetailObj.baslangicTarihi);
    return this.currentDate < startDate;
  }

  // Başvuru süresi bitmiş durum kontrolü
  isAfterEndDate(): boolean {
    if (!this.ilanDetailObj) return false;
    const endDate = new Date(this.ilanDetailObj.bitisTarihi);
    return this.currentDate > endDate;
  }

  // Başvuru süresi aktif mi kontrolü
  isApplicationPeriodActive(): boolean {
    if (!this.ilanDetailObj) return false;
    const startDate = new Date(this.ilanDetailObj.baslangicTarihi);
    const endDate = new Date(this.ilanDetailObj.bitisTarihi);
    return this.currentDate >= startDate && this.currentDate <= endDate;
  }

  // Kalan süreyi hesaplama fonksiyonu
  calculateRemainingTime(): void {
    const startDate = new Date(this.ilanDetailObj.baslangicTarihi);
    const timeDiff = startDate.getTime() - this.currentDate.getTime();

    // Millisaniyeyi gün, saat, dakika ve saniyeye çevirme
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Kalan süre metni oluşturma
    let timeText = '';
    if (days > 0) {
      timeText += `${days} gün `;
    }
    if (hours > 0 || days > 0) {
      timeText += `${hours} saat `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      timeText += `${minutes} dakika `;
    }
    timeText += `${seconds} saniye`;

    this.remainingTimeText = timeText;
  }

  goBack() {
    window.history.back();
  }
}
