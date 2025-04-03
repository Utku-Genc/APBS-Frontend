import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { KriterPuanAddModel } from '../models/kriter-puan/kriter-puan-add.model';
import { KriterPuanModel } from '../models/kriter-puan/kriter-puan.model';


@Injectable({
  providedIn: 'root',
})
export class KriterPuanService {
  private endpoint = 'PuanKriteri/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}

    getAll(): Observable<ListResponseModel<KriterPuanModel>> {
        return this.apiService.get(`${this.endpoint}getall`);
    }
    add(kriter: KriterPuanAddModel): Observable<SingleResponseModel<KriterPuanAddModel>> {
        return this.apiService.post(`${this.endpoint}add`, kriter);
    }
    update(kriter: KriterPuanModel): Observable<SingleResponseModel<KriterPuanModel>> {
        return this.apiService.put(`${this.endpoint}update`, kriter);
    }
    delete(id: number): Observable<SingleResponseModel<KriterPuanModel>> {
        return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
    }
    getById(id: number): Observable<SingleResponseModel<KriterPuanModel>> {
        return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
    }
}