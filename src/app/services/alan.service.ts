import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SingleResponseModel } from '../models/response/single.response.model';
import { AlanModel } from '../models/alan/alan.model';
import { Observable } from 'rxjs';
import { AlanAddModel } from '../models/alan/alan.add.model';

@Injectable({
  providedIn: 'root'
})
export class AlanService {
  private endpoint = 'Alan/';
    constructor(private apiService: ApiService) {}
    getAll(): Observable<SingleResponseModel<AlanModel[]>> {
      return this.apiService.get<SingleResponseModel<AlanModel[]>>(`${this.endpoint}getall`);
    }

    add(data: AlanAddModel): Observable<SingleResponseModel<AlanAddModel>> {
      return this.apiService.post<SingleResponseModel<AlanAddModel>>(`${this.endpoint}add`, data); 
    }

    update(data: AlanModel): Observable<SingleResponseModel<AlanModel>> {
      return this.apiService.put<SingleResponseModel<AlanModel>>(`${this.endpoint}update`, data);
    }
    delete(id: number): Observable<SingleResponseModel<any>> {
      return this.apiService.delete<SingleResponseModel<any>>(`${this.endpoint}delete?id=${id}`);
    }
    
}
