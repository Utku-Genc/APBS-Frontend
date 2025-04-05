import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; 
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { DashboardModel } from '../models/dashboard/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private endpoint = 'Dashboard/'; 
  constructor(private apiService: ApiService) {}
    getDashboardData(): Observable<DashboardModel> {
        return this.apiService.get(`${this.endpoint}stats`);
    }
}
