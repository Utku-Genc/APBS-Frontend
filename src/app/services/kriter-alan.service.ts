import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { KriterAlanModel } from '../models/kriter-alan/kriter-alan.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { KriterAlanAddModel } from '../models/kriter-alan/kriter-alan-add.model';


@Injectable({
  providedIn: 'root',
})
export class KriterAlanService {
  private endpoint = 'AlanKriteri/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}
    getAll(): Observable<ListResponseModel<KriterAlanModel>> {
        return this.apiService.get(`${this.endpoint}getall`);
    }
    add(kriter: KriterAlanAddModel): Observable<SingleResponseModel<KriterAlanAddModel>> {
        return this.apiService.post(`${this.endpoint}add`, kriter);
    }
    update(kriter: KriterAlanModel): Observable<SingleResponseModel<KriterAlanModel>> {
        return this.apiService.put(`${this.endpoint}update`, kriter);
    }
    delete(id: number): Observable<SingleResponseModel<KriterAlanModel>> {
        return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
    }
    getById(id: number): Observable<SingleResponseModel<KriterAlanModel>> {
        return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
    }
}
