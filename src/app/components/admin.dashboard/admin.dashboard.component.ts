import { Component, inject, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardModel } from '../../models/dashboard/dashboard.model';
import { IlanService } from '../../services/ilan.service';
import { IlanDetailModel } from '../../models/ilan/ilan-detail.model';
import { SummaryPipe } from '../../pipes/summary.pipe';
import { NewlinePipe } from '../../pipes/newline.pipe';

@Component({
  selector: 'utk-admin.dashboard',
  imports: [CommonModule, RouterModule, NewlinePipe],
  templateUrl: './admin.dashboard.component.html',
  styleUrls: ['./admin.dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private ilanService = inject(IlanService);

  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);

  dashboardData: DashboardModel = {
    onlineUser: 0,
    visitorCount: 0,
    totalUsers: 0,
    activeUsers: 0,
    passiveUsers: 0,
    totalIlan: 0,
    activeIlan: 0,
    passiveIlan: 0,
    totalAlan: 0,
    totalBolum: 0,
    totalKriter: 0,
    totalAlanKriteri: 0,  
    totalPuanKriteri: 0,
    totalBildirim: 0,
    totalReadBildirim: 0,
    totalUnreadBildirim: 0
  };

  ilansModelObj: IlanDetailModel[] = [];
  pageSize: number = 2;
  pageNumber: number = 1;
  sortBy: string = 'id';
  isDescending: boolean = true;
  filters: any = {
    id: null,
    baslik: '',
    pozisyonId: null,
    bolumId: null,
    status: null,
    ilanTipi: null,
  };

  ngOnInit(): void {
    this.getDashboardData();
    this.getLastIlan();
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (response) => {
        if (response) {
          this.dashboardData = response;
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(
            err.error.message,
            'Dashboard Veri Getirme Hatası'
          );
        }
      },
    });
  }
  getLastIlan() {
    this.ilanService
      .getilansbyqueryforadmin(
        this.pageSize,
        this.pageNumber,
        this.sortBy,
        this.isDescending,
        this.filters
      )
      .subscribe({
        next: (response) => {
          this.ilansModelObj = response.data;
        },
        error: (error) => {
          this.toastService.error('İlanlar yüklenirken bir hata oluştu.');
          console.error('İlan yükleme hatası:', error);
        },
      });
  }

  calculateRatio() {
    // Eğer denominator 0 ise hata oluşmasını önlemek için kontrol
    if (!this.dashboardData.totalBolum) return 0;

    // Normal durumlarda yüzde hesaplama (0-100 arasında bir değer döndürür)
    const ratio =
      (this.dashboardData.totalAlan / this.dashboardData.totalBolum) * 100;

    // Progress bar için maksimum 100 değerini sınırlayalım
    return Math.min(ratio, 100);
  }
  calculateAlanPercentage() {
    const total = this.dashboardData.totalAlan + this.dashboardData.totalBolum;
    if (!total) return 0;
    return (this.dashboardData.totalAlan / total) * 100;
  }
  
  calculateBolumPercentage() {
    const total = this.dashboardData.totalAlan + this.dashboardData.totalBolum;
    if (!total) return 0;
    return (this.dashboardData.totalBolum / total) * 100;
  }
  calculateReadPercentage() {
    const total = this.dashboardData.totalReadBildirim + this.dashboardData.totalUnreadBildirim;
    if (!total) return 0;
    return (this.dashboardData.totalReadBildirim / total) * 100;
  }
  calculateUnreadPercentage() {
    const total = this.dashboardData.totalReadBildirim + this.dashboardData.totalUnreadBildirim;
    if (!total) return 0;
    return (this.dashboardData.totalUnreadBildirim / total) * 100;
  }
  
  calculateOnlineUserPercentage() {
    const total = this.dashboardData.onlineUser + this.dashboardData.visitorCount;
    if (!total) return 0;
    return (this.dashboardData.onlineUser / total) * 100;
  }
  calculateVisitorCountPercentage() {
    const total = this.dashboardData.onlineUser + this.dashboardData.visitorCount;
    if (!total) return 0;
    return (this.dashboardData.visitorCount / total) * 100;
  }
}


