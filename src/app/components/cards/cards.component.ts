import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { IlanService } from '../../services/ilan.service';
import { PositionService } from '../../services/position.service';
import { BolumService } from '../../services/bolum.service';
import { SummaryPipe } from '../../pipes/summary.pipe';

@Component({
  selector: 'utk-cards',
  imports: [RouterLink, CommonModule, SummaryPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css',
})
export class CardsComponent implements OnInit {
  @Input() status: string = 'active'; // Varsayılan olarak 'active' ilanlar gelir

  private ilanService = inject(IlanService);
  private positionService = inject(PositionService);
  private bolumService = inject(BolumService);

  ilanlar: IlanDetailModel[] = [];

  ngOnInit(): void {
    this.fetchApplications();
  }

  fetchApplications() {
    if (this.status === 'active') {
      // Aktif ilanları getiren API çağrısı
      console.log('Aktif ilanlar getiriliyor...');
      this.getAllActives();
    } else if (this.status === 'past') {
      // Geçmiş ilanları getiren API çağrısı
      console.log('Geçmiş ilanlar getiriliyor...');
      this.getAllExpireds();
    }
  }

  getAllActives() {
    this.ilanService.getAllActives().subscribe((response) => {
      this.ilanlar = response.data;
    });
  }
  getAllExpireds() {
    this.ilanService.getAllExpireds().subscribe((response) => {
      this.ilanlar = response.data;
    });
  }
}
