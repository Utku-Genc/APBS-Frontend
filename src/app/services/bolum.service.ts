import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';
import { BolumAddModel } from '../models/bolum/bolum-add.model'; // BolumModel'inizi import edin
import { BolumModel } from '../models/bolum/bolum.model';

@Injectable({
  providedIn: 'root',
})
export class BolumService {
  private endpoint = 'Bolum/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}

  getAll(): Observable<any> {
    return this.apiService.get(`${this.endpoint}getall`);
  }
  add(bolum: BolumAddModel): Observable<any> {
    return this.apiService.post(`${this.endpoint}add`, bolum);
  }
    update(bolum: BolumModel): Observable<any> {
        return this.apiService.put(`${this.endpoint}update`, bolum);
    }
    delete(id: number): Observable<any> {
        return this.apiService.delete(`${this.endpoint}delete/${id}`);
    }
}
