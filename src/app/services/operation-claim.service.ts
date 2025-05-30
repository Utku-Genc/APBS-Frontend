import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/response/list.response.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { OperationClaimModel } from '../models/operation-claim/operation-claim.model';
import { OperationClaimAddModel } from '../models/operation-claim/operation-claim-add.model';

@Injectable({
  providedIn: 'root',
})
export class OperationClaimService {
  private endpoint = 'OperationClaim/'; // API endpoint

  constructor(private apiService: ApiService) {}
  getAll(): Observable<ListResponseModel<OperationClaimModel>> {
    return this.apiService.get<ListResponseModel<OperationClaimModel>>(`${this.endpoint}getall`);
  }
  add(role: OperationClaimAddModel): Observable<any> {
    return this.apiService.post(`${this.endpoint}add`, role);
  }
  update(role: OperationClaimModel): Observable<any> {
    return this.apiService.put(`${this.endpoint}update`, role);
  }
  delete(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}delete?id=${id}`);
  }
}