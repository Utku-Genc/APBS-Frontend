import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/response/list.response.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { PositionModel } from '../models/position/position.model';
import { PositionAddModel } from '../models/position/position-add.model';


@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private endpoint = 'Pozisyon/'; // API endpoint

  constructor(private apiService: ApiService) {}
  getAll(): Observable<ListResponseModel<PositionModel>> {
    return this.apiService.get<ListResponseModel<PositionModel>>(`${this.endpoint}getall`);
  }
  add(role: PositionAddModel): Observable<any> {
    return this.apiService.post(`${this.endpoint}add`, role);
  }
  update(role: PositionModel): Observable<any> {
    return this.apiService.put(`${this.endpoint}update`, role);
  }
  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
  }
}