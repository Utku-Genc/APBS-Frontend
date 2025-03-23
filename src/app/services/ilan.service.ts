import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';
import { IlanAddModel } from '../models/ilan/ilan-add.model';
import { SingleResponseModel } from '../models/response/single.response.model';


@Injectable({
  providedIn: 'root',
})
export class IlanService {
  private endpoint = 'Ilan/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}
    getAll(): Observable<any> {
        return this.apiService.get(`${this.endpoint}getall`);
    }

    getById(id: number): Observable<any> {
        return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
    }

    getAllActives(): Observable<any> {
      return this.apiService.get(`${this.endpoint}getallactives`);
    }
    getAllExpireds(): Observable<any> {
      return this.apiService.get(`${this.endpoint}getallexpireds`);
    }
    add(ilan: IlanAddModel): Observable<any> {
    return this.apiService.post<any>(`${this.endpoint}add`, ilan);
    }

    update(ilan: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}update`, ilan);
    }

    delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
    }

    deactivate(userId: number): Observable<any> {
      return this.apiService.put<any>(`${this.endpoint}deactivate/${userId}`, {});
    }
  
    // Kullanıcı engelini kaldır
    activate(userId: number): Observable<any> {
      return this.apiService.put<any>(`${this.endpoint}activate/${userId}`, {});
    }

    
  }