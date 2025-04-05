import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BasvuruDurumlarıModel } from '../models/basvuru-durumlari/basvuru-durumlari.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { Observable } from 'rxjs';
import { BasvuruDurumlarıAddModel } from '../models/basvuru-durumlari/dasvuru-durumlari-add.model';


@Injectable({
  providedIn: 'root',
})
export class BasvuruDurumlariService {
  private endpoint = 'BasvuruDurumu/';
  constructor(private apiService: ApiService) {}
    getAll(): Observable<ListResponseModel<BasvuruDurumlarıModel>> {
        return this.apiService.get(`${this.endpoint}GetAll`);
    }
    getById(id: number): Observable<SingleResponseModel<BasvuruDurumlarıModel>> {
        return this.apiService.get(`${this.endpoint}GetById/${id}`);

    }
    add(basvuruDurumlari: BasvuruDurumlarıAddModel): Observable<SingleResponseModel<BasvuruDurumlarıAddModel>> {
        return this.apiService.post(`${this.endpoint}Add`, basvuruDurumlari);
    }
    update(basvuruDurumlari: BasvuruDurumlarıModel): Observable<SingleResponseModel<BasvuruDurumlarıModel>> {
        return this.apiService.put(`${this.endpoint}Update`, basvuruDurumlari);
    }
    delete(id: number): Observable<SingleResponseModel<BasvuruDurumlarıModel>> {
        return this.apiService.delete(`${this.endpoint}Delete?id=${id}`);
    }
}

