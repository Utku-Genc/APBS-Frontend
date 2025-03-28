import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardsComponent } from "../cards/cards.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BolumService } from '../../services/bolum.service';
import { PositionService } from '../../services/position.service';
import { PositionModel } from '../../models/position/position.model';
import { BolumModel } from '../../models/bolum/bolum.model';
import { IlanService } from '../../services/ilan.service';

@Component({
  selector: 'utk-ilanlar-aktif',
  templateUrl: './ilanlar-aktif.component.html',
  styleUrls: ['./ilanlar-aktif.component.css'],
  imports: [CardsComponent, FormsModule, CommonModule],
})
export class IlanlarAktifComponent implements OnInit {
  private bolumService = inject(BolumService);
  private positionService = inject(PositionService);
  private ilanService = inject(IlanService);

  positions: PositionModel[] = [];
  bolums: BolumModel[] = [];
  ilanSayisi: number = 0;

  status = "active";
  filters: any = {
    baslik: '',
    pozisyonId: null,
    bolumId: null
  };
  pageSize = 12;
  pageNumber = 1;

  sortBy: string = 'id';
  isDescending: boolean = false;
  filtersOpen = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.filters.baslik = params['baslik'] || '';
      this.filters.pozisyonId = params['pozisyonId'] || null;
      this.filters.bolumId = params['bolumId'] || null;
      this.pageNumber = Number(params['page']) || 1;

      this.sortBy = params['sortBy'] || 'id';
      this.isDescending = params['isDescending'] === 'true';
    });

    this.loadPositions();
    this.loadBolums();
  }

  private loadPositions() {
    this.positionService.getAll().subscribe(response => {
      this.positions = response.data;
    });
  }

  private loadBolums() {
    this.bolumService.getAll().subscribe(response => {
      this.bolums = response.data;
    });
  }



  onFilterChange(newFilters: any) {
    this.filters = { ...newFilters };
    this.pageNumber = 1;
    this.updateURL();
  }

  onPageChange(newPage: number) {
    this.pageNumber = newPage;
    this.updateURL();
  }

  private updateURL() {
    const queryParams: any = {
      page: this.pageNumber,
      sortBy: this.sortBy,
      isDescending: this.isDescending.toString()
    };

    if (this.filters.baslik) {
      queryParams.baslik = this.filters.baslik;
    }

    if (this.filters.pozisyonId != null) {
      queryParams.pozisyonId = this.filters.pozisyonId;
    }

    if (this.filters.bolumId != null) {
      queryParams.bolumId = this.filters.bolumId;
    }

    this.router.navigate([], {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    });
  }

  resetFilters() {
    this.filters = {
      baslik: '',
      pozisyonId: null,
      bolumId: null
    };
    this.pageNumber = 1;
    this.sortBy = 'id';
    this.isDescending = false;

    this.router.navigate([], {
      queryParams: { page: 1, sortBy: 'id', isDescending: 'false' }
    });
  }

  onSortChange() {
    this.pageNumber = 1;  // Sayfa numarasını sıfırla
    this.updateURL();  // URL güncelle
  }

  toggleIsDescending() {
    this.isDescending = !this.isDescending;
    this.updateURL();
  }

  toggleFilter() {
    this.filtersOpen = !this.filtersOpen;
  }

  onIlanSayisiChange(count: number | Event) {
    this.ilanSayisi = typeof count === "number" ? count : 0;
  }
}
