import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { IlanService } from '../../services/ilan.service';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { SummaryPipe } from '../../pipes/summary.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'utk-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
  imports: [CommonModule, SummaryPipe, DatePipe, RouterModule],
})
export class CardsComponent implements OnInit, OnChanges {
  @Input() status: string = 'active'; // Varsayılan değer
  @Input() filters: any = {
    id: undefined,
    baslik: '',
    pozisyonId: null,
    bolumId: null,
    ilanTipi: '',
  };
  @Input() pageSize: number = 6;
  @Input() pageNumber: number = 1;
  @Input() sortBy: string = 'id';
  @Input() isDescending: boolean = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() ilanSayisiChange = new EventEmitter<number>();

  ilanlar: IlanDetailModel[] = [];
  title = 'İlanlar';
  profileId: number = 0; 
  private ilanService = inject(IlanService);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['status'] ||
      changes['filters'] ||
      changes['pageNumber'] ||
      changes['sortBy'] ||
      changes['isDescending']
    ) {
      this.fetchApplications();
    }
  }

  fetchApplications() {
    if (this.status === 'active') {
      this.getAllActives();
    } else if (this.status === 'past') {
      this.getAllExpireds();
    }
  }

  getAllActives() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/profiles/')) {
      this.profileId = Number(this.route.snapshot.paramMap.get('id'));

      this.title = 'Başvuruları';
      this.ilanService.getAppliedIlanByUser(this.profileId).subscribe((response) => {
        this.ilanlar = response.data;
        this.ilanSayisiChange.emit(this.ilanlar.length); // **İlan sayısını ilet**
      });
    } else if (currentUrl.includes('/profile')) {
      this.title = 'Başvurularınız';
      this.ilanService.getAppliedIlanByToken().subscribe((response) => {
        this.ilanlar = response.data;
        this.ilanSayisiChange.emit(this.ilanlar.length);
      });
    } else if (currentUrl.includes('/ilanlar/aktif')) {
      this.title = 'Aktif İlanlar';
      this.filters.ilanTipi = '1';
      this.ilanService
        .getilansbyquery(
          this.pageSize,
          this.pageNumber,
          this.sortBy,
          this.isDescending,
          this.filters
        )
        .subscribe({
          next: (response) => {
            this.ilanlar = response.data;
            this.ilanSayisiChange.emit(this.ilanlar.length);
          },
          error: (err) => {
            console.error('Sıralama sırasında hata oluştu:', err);
            // Kullanıcıya bilgilendirme yapılabilir
          },
        });
    } else {
      this.title = 'Aktif İlanlar';
      this.filters.ilanTipi = '1';
      this.ilanService
        .getilansbyquery(
          this.pageSize,
          this.pageNumber,
          this.sortBy, // Sort parametrelerini burada kullanıyoruz
          this.isDescending,
          this.filters
        )
        .subscribe((response) => {
          this.ilanlar = response.data;
        });
    }
  }

  getAllExpireds() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/profiles/')) {
      this.title = 'Geçmiş Başvuruları';
    } else if (currentUrl.includes('/profile')) {
      this.title = 'Geçmiş Başvurularınız';
    } else if (currentUrl.includes('/ilanlar/gecmis')) {
      this.title = 'Geçmiş İlanlar';
      this.filters.ilanTipi = '2';
      this.ilanService
        .getilansbyquery(
          this.pageSize,
          this.pageNumber,
          this.sortBy,
          this.isDescending,
          this.filters
        )
        .subscribe((response) => {
          this.ilanlar = response.data;
          this.ilanSayisiChange.emit(this.ilanlar.length); // **İlan sayısını ilet**
        });
    } else {
      this.title = 'Geçmiş İlanlar';
      this.filters.ilanTipi = '2';
      this.ilanService
        .getilansbyquery(
          this.pageSize,
          this.pageNumber,
          this.sortBy,
          this.isDescending,
          this.filters
        )
        .subscribe((response) => {
          this.ilanlar = response.data;
        });
    }
  }

  changePage(newPage: number) {
    this.pageChange.emit(newPage);
  }
}
