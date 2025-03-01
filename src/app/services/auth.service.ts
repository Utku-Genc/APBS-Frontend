import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/auth/login.model';
import { RegisterModel } from '../models/auth/register.model';
import { TokenModel } from '../models/auth/token.model';
import { SingleResponseModel } from '../models/response/single.response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authEndpoint = 'Auth/';

  constructor(private apiService: ApiService) {}

  register(RegisterModel: RegisterModel): Observable<SingleResponseModel<TokenModel>> {
    return this.apiService.post<SingleResponseModel<TokenModel>>(`${this.authEndpoint}register`, RegisterModel);
  }

  login(loginModel: LoginModel): Observable<SingleResponseModel<TokenModel>> {
    return this.apiService.post<SingleResponseModel<TokenModel>>(`${this.authEndpoint}login`, loginModel);
  }
}
