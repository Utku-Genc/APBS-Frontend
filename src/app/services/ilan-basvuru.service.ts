import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { ApplyDto } from '../models/ilan-basvuru/apply-dto.model';
import { ResponseModel } from '../models/response/response.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { IlanBasvuruListModel } from '../models/ilan-basvuru/basvuru-list.model';

@Injectable({
  providedIn: 'root',
})
export class IlanBasvuruService {
  private endpoint = 'IlanBasvuru/';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<ListResponseModel<IlanBasvuruListModel>> {
    return this.apiService.get(`${this.endpoint}getall`);
  }
  
  getByQuery(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    isDescending: boolean,
    filters?: {
      id?: number;
      ilanId?: number;
      basvuranId?: number;
      basvuruDurumuId?: number;
      minBasvuruTarihi?: Date; 
      maxBasvuruTarihi?: Date;  
    }
  ): Observable<ListResponseModel<IlanBasvuruListModel>> {
    let queryParameters = `?pageSize=${pageSize}&pageNumber=${pageNumber}&sortBy=${sortBy}&isDescending=${isDescending}`;
      
    if (filters) {
      if (filters.id) queryParameters += `&Id=${filters.id}`;
      if (filters.ilanId) queryParameters += `&IlanId=${filters.ilanId}`;
      if (filters.basvuranId) queryParameters += `&BasvuranId=${filters.basvuranId}`;
      if (filters.basvuruDurumuId) queryParameters += `&BasvuruDurumuId=${filters.basvuruDurumuId}`;
      
      // Tarih parametrelerini doğru formatta ekle
      if (filters.minBasvuruTarihi) {
        queryParameters += `&MinBasvuruTarihi=${encodeURIComponent(filters.minBasvuruTarihi.toISOString())}`;
      }
      if (filters.maxBasvuruTarihi) {
        queryParameters += `&MaxBasvuruTarihi=${encodeURIComponent(filters.maxBasvuruTarihi.toISOString())}`;
      }
    }
      
    return this.apiService.get(`${this.endpoint}getbyquery${queryParameters}`);
  }
  

  update(ilan: any): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}update`, ilan);
  }

  apply(applyDto: ApplyDto): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('ilanId', applyDto.ilanId.toString());
    formData.append('basvuruTarihi', applyDto.basvuruTarihi.toISOString());
    
    if (applyDto.aciklama) {
      formData.append('aciklama', applyDto.aciklama);
    }

    // Her dosya ve kriterIds'yi formData'ya ekle
    applyDto.files.forEach((fileDto, index) => {
      formData.append(`files[${index}].file`, fileDto.file, fileDto.file.name);
      
      // KriterIds dizisini ekle
      fileDto.kriterIds.forEach(kriterId => {
        formData.append(`files[${index}].kriterIds`, kriterId.toString());
      });
    });
    return this.apiService.post<ResponseModel>(`${this.endpoint}apply`, formData);
  }
   
  isAppliedBefore(ilanId: number): Observable<SingleResponseModel<boolean>> {
    return this.apiService.get<SingleResponseModel<boolean>>(`${this.endpoint}isAppliedBefore?ilanId=${ilanId}`);
  }
}