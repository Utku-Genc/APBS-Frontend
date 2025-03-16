import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/response/list.response.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { UserOperationClaimModel } from '../models/user-operation-claim/user-operation-claim.model';
import { UserOperationClaimAddModel } from '../models/user-operation-claim/user-operation-claim-add.model';

@Injectable({
  providedIn: 'root',
})
export class UserOperationClaimService {
  private endpoint = 'UserOperationClaim/'; // API endpoint

  constructor(private apiService: ApiService) {}
  getAll(): Observable<ListResponseModel<UserOperationClaimModel>> {
    return this.apiService.get<ListResponseModel<UserOperationClaimModel>>(`${this.endpoint}getall`);
  }

  getById(id: number): Observable<SingleResponseModel<UserOperationClaimModel>> {
    return this.apiService.get<SingleResponseModel<UserOperationClaimModel>>(`${this.endpoint}getbyid?id=${id}`);
  }

  getByUserId(userId: number): Observable<ListResponseModel<UserOperationClaimModel>> {
    return this.apiService.get<ListResponseModel<UserOperationClaimModel>>(`${this.endpoint}getbyuser?userId=${userId}`);
  }

  add(data: UserOperationClaimAddModel): Observable<SingleResponseModel<UserOperationClaimAddModel>> {
    return this.apiService.post<SingleResponseModel<UserOperationClaimAddModel>>(`${this.endpoint}add`, data);
  }

  delete(id: number): Observable<SingleResponseModel<UserOperationClaimModel>> {
    return this.apiService.delete<SingleResponseModel<UserOperationClaimModel>>(`${this.endpoint}delete?id=${id}`);
  }
}
