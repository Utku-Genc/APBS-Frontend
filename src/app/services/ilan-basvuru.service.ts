import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { SingleResponseModel } from '../models/response/single.response.model';
import { ApplyDto } from '../models/ilan-basvuru/apply-dto.model';
import { ResponseModel } from '../models/response/response.model';

@Injectable({
  providedIn: 'root',
})
export class IlanBasvuruService {
  private endpoint = 'IlanBasvuru/';

  constructor(private apiService: ApiService) {}

  apply(applyDto: ApplyDto): Observable<ResponseModel> {
    const formData = new FormData();
    formData.append('ilanId', applyDto.ilanId.toString());
    formData.append('basvuruTarihi', applyDto.basvuruTarihi.toISOString());
    
    if (applyDto.aciklama) {
      formData.append('aciklama', applyDto.aciklama);
    }

    // Her dosya ve kriterIds'yi formData'ya ekleyin
    applyDto.files.forEach((fileDto, index) => {
      formData.append(`files[${index}].file`, fileDto.file, fileDto.file.name);
      
      // KriterIds array'ini ekleyelim
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