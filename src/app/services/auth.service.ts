import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/auth/login.model';
import { RegisterModel } from '../models/auth/register.model';
import { TokenModel } from '../models/auth/token.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { UserModel } from '../models/auth/user.model';
import { jwtDecode } from 'jwt-decode';

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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  getUserByToken(): Observable<SingleResponseModel<UserModel>> {
    return this.apiService.get<SingleResponseModel<UserModel>>(`${this.authEndpoint}getUserByToken`);
  }
  
  getUserById(id: number): Observable<SingleResponseModel<UserModel>> {
    return this.apiService.get<SingleResponseModel<UserModel>>(`${this.authEndpoint}getUserById?id=${id}`);
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error('Invalid token', error);
        return null;
      }
    }
    return null;
  }
  getUserRoles(): string[] {
    const decodedToken = this.getDecodedToken();
    if (decodedToken) {
      const roles = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return Array.isArray(roles) ? roles : [roles];
    }
    return [];
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('admin');
  }

  isAuthenticated(){
    const expirationString = localStorage.getItem("expiration");
    const expirationDate = expirationString ? new Date(expirationString) : new Date();
    if(localStorage.getItem("token") &&  Date.now() < expirationDate.getTime()){
      console.log(Date.now()+"  "+expirationDate.getTime());
      return true;
    }
    else{
      this.logout()
      return false;
    }
  }

}
