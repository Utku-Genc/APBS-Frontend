import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  inject,
} from '@angular/core';
import { IlanService } from '../../services/ilan.service';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { SummaryPipe } from '../../pipes/summary.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'utk-cards',
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
  imports: [CommonModule, SummaryPipe, DatePipe, RouterModule],
})
export class CardsComponent implements OnInit, OnChanges {
  @Input() status: string = 'active'; // Varsayılan değer

  ilanlar: IlanDetailModel[] = [];
  title = 'İlanlar';

  private ilanService = inject(IlanService);

  ngOnInit(): void {
    this.fetchApplications();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['status'] && !changes['status'].firstChange) {
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
      this.title = 'Aktif Başvuruları';
    } else if (currentUrl.includes('/profile')) {
      this.title = 'Aktif Başvurularınız';
    } else {
      this.title = 'Aktif İlanlar';
      this.ilanService.getAllActives().subscribe((response) => {
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
    } else {
      this.title = 'Geçmiş İlanlar';
      this.ilanService.getAllExpireds().subscribe((response) => {
        this.ilanlar = response.data;
      });
    }
  }
}
