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
    pozisyonId: undefined,
    bolumId: undefined
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
      this.filters.pozisyonId = params['pozisyonId'] ? Number(params['pozisyonId']) : undefined;
      this.filters.bolumId = params['bolumId'] ? Number(params['bolumId']) : undefined;
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
    // Create a clean filters object without null/undefined values
    const cleanFilters: any = {
      baslik: newFilters.baslik || ''
    };
    
    if (newFilters.pozisyonId && newFilters.pozisyonId !== 'null') {
      cleanFilters.pozisyonId = Number(newFilters.pozisyonId);
    }
    
    if (newFilters.bolumId && newFilters.bolumId !== 'null') {
      cleanFilters.bolumId = Number(newFilters.bolumId);
    }
    
    this.filters = cleanFilters;
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
 
    // Sadece değeri olan filtreleri URL'ye ekle
    if (this.filters.baslik && this.filters.baslik.trim() !== '') {
      queryParams.baslik = this.filters.baslik;
    }
 
    if (this.filters.pozisyonId !== undefined) {
      queryParams.pozisyonId = this.filters.pozisyonId;
    }
 
    if (this.filters.bolumId !== undefined) {
      queryParams.bolumId = this.filters.bolumId;
    }
   
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  resetFilters() {
    this.filters = {
      baslik: '',
      pozisyonId: undefined,
      bolumId: undefined
    };
    this.pageNumber = 1;
    this.sortBy = 'id';
    this.isDescending = false;
    this.updateURL();
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