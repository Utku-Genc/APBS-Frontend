import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; 
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { IlanJuriAddModel } from '../models/ilan-juri/ilan-juri-add.model';
import { ListResponseModel } from '../models/response/list.response.model';

@Injectable({
  providedIn: 'root',
})
export class IlanJuriService {
  private endpoint = 'IlanJuri/'; 
  constructor(private apiService: ApiService) {}
    getAll(): Observable<ListResponseModel<any>> {
        return this.apiService.get(`${this.endpoint}getall`);
    }
    getById(id: number): Observable<SingleResponseModel<any>> {
        return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
    }
    getByIlanId(id: number): Observable<ListResponseModel<any>> {
        return this.apiService.get(`${this.endpoint}getbyilanid?ilanId=${id}`);
    }
    add(model: IlanJuriAddModel): Observable<SingleResponseModel<any>> {
        return this.apiService.post(`${this.endpoint}add`, model);
    }
    delete(id: number): Observable<SingleResponseModel<any>> {
        return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
    }
}
