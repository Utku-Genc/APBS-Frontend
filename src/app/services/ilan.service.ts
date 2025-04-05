import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { IlanAddModel } from '../models/ilan/ilan-add.model';
import { SingleResponseModel } from '../models/response/single.response.model';

@Injectable({
  providedIn: 'root',
})
export class IlanService {
  private endpoint = 'Ilan/';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<any> {
    return this.apiService.get(`${this.endpoint}getall`);
  }

  getilansbyqueryforadmin(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    isDescending: boolean,
    filters?: {
      id?: number;
      baslik?: string;
      pozisyonId?: number;
      bolumId?: number;
      status?: boolean | null;
      ilanTipi?: number | null;
    }
  ): Observable<any> {
    let queryParameters = `?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&isDescending=${isDescending}`;
    
    if (filters) {
      if (filters.id) queryParameters += `&Id=${filters.id}`;
      
      if (filters.baslik && filters.baslik.trim() !== '') 
        queryParameters += `&Baslik=${encodeURIComponent(filters.baslik)}`;
      
      if (filters.pozisyonId !== undefined && filters.pozisyonId !== null) 
        queryParameters += `&PozisyonId=${filters.pozisyonId}`;
      
      if (filters.bolumId !== undefined && filters.bolumId !== null) 
        queryParameters += `&BolumId=${filters.bolumId}`;
      
      if (filters.status !== null && filters.status !== undefined) 
        queryParameters += `&Status=${filters.status}`;
      
      if (filters.ilanTipi !== undefined && filters.ilanTipi !== null) 
        queryParameters += `&IlanTipi=${filters.ilanTipi}`;
    }
    
    return this.apiService.get(`${this.endpoint}getilansbyqueryforadmin${queryParameters}`);
  }

  getById(id: number): Observable<any> {
    return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
  }

  getilansbyquery(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    isDescending: boolean,
    filters?: {
      id?: number;
      baslik?: string;
      pozisyonId?: number;
      bolumId?: number;
      ilanTipi?: string | null;
    }
  ): Observable<any> {
    let queryParameters = `?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&isDescending=${isDescending}`;
    
    if (filters) {
      if (filters.id) 
        queryParameters += `&Id=${filters.id}`;
      
      if (filters.baslik && filters.baslik.trim() !== '') 
        queryParameters += `&Baslik=${encodeURIComponent(filters.baslik)}`;
      
      if (filters.pozisyonId !== undefined && filters.pozisyonId !== null) 
        queryParameters += `&PozisyonId=${filters.pozisyonId}`;
      
      if (filters.bolumId !== undefined && filters.bolumId !== null) 
        queryParameters += `&BolumId=${filters.bolumId}`;
      
      if (filters.ilanTipi) 
        queryParameters += `&IlanTipi=${filters.ilanTipi}`;
    }
    
    return this.apiService.get(`${this.endpoint}getilansbyquery${queryParameters}`);
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

  activate(userId: number): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}activate/${userId}`, {});
  }
}