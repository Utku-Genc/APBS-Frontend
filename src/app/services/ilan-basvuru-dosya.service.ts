import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/response/list.response.model';
import { IlanBasvuruDosyaModel } from '../models/ilan-basvuru-dosya/ilan-basvuru-dosya.model';

@Injectable({
  providedIn: 'root',
})
export class IlanBasvuruDosyaService {
  private endpoint = 'IlanBasvuruDosya/';

  constructor(private apiService: ApiService) {}
  getAll(): Observable<ListResponseModel<IlanBasvuruDosyaModel>> {
    return this.apiService.get(`${this.endpoint}getall`);
  }
  getById(id: number): Observable<ListResponseModel<IlanBasvuruDosyaModel>> {
    return this.apiService.get(`${this.endpoint}getbyid?id=${id}`);
  }
  getByBasvuruId(
    basvuruId: number
  ): Observable<ListResponseModel<IlanBasvuruDosyaModel>> {
    return this.apiService.get(
      `${this.endpoint}getbybasvuruid?basvuruId=${basvuruId}`
    );
  }
}
