import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { KriterAddModel } from '../models/kriter/kriter-add.model';
import { KriterModel } from '../models/kriter/kriter.model';
import { ListResponseModel } from '../models/response/list.response.model';

@Injectable({
  providedIn: 'root',
})
export class KriterService {
  private endpoint = 'Kriter/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}
    getAll(): Observable<ListResponseModel<KriterModel>> {
        return this.apiService.get(`${this.endpoint}getall`);
    }
    add(kriter: KriterAddModel): Observable<SingleResponseModel<KriterAddModel>> {
        return this.apiService.post(`${this.endpoint}add`, kriter);
    }
    update(kriter: KriterModel): Observable<SingleResponseModel<KriterModel>> {
        return this.apiService.put(`${this.endpoint}update`, kriter);
    }
    delete(id: number): Observable<SingleResponseModel<KriterModel>> {
        return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
    }
    getById(id: number): Observable<SingleResponseModel<KriterModel>> {
        return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
    }
}