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
export class OperationClaimService {
  private endpoint = 'OperationClaim/'; // API endpoint

  constructor(private apiService: ApiService) {}
  getAll(): Observable<ListResponseModel<UserOperationClaimModel>> {
    return this.apiService.get<ListResponseModel<UserOperationClaimModel>>(`${this.endpoint}getall`);
  }
}