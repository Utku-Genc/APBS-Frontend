import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { UserModel } from '../models/auth/user.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { SingleResponseModel } from '../models/response/single.response.model';
import { UserListModel } from '../models/user/user-list.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private endpoint = 'User/'; // API endpoint

  constructor(private apiService: ApiService) {}

  getUserById(id: number): Observable<SingleResponseModel<UserListModel>> {
    return this.apiService.get<SingleResponseModel<UserListModel>>(`${this.endpoint}getUserById?id=${id}`);
  }

  getUsersByQuery(
    pageSize: number,
    pageNumber: number,
    sortBy: string,
    isDescending: boolean,
    filters?: {
      id?: number;
      firstName?: string;
      lastName?: string;
      nationalityId?: string;
      email?: string;
      minDateOfBirth?: string;
      maxDateOfBirth?: string;
      status?: boolean;
    }
  ): Observable<ListResponseModel<UserListModel>> {
    let queryParams = `PageSize=${pageSize}&PageNumber=${pageNumber}&SortBy=${sortBy}&IsDescending=${isDescending}`;

    if (filters) {
      if (filters.id) queryParams += `&Id=${filters.id}`;
      if (filters.firstName) queryParams += `&FirstName=${encodeURIComponent(filters.firstName)}`;
      if (filters.lastName) queryParams += `&LastName=${encodeURIComponent(filters.lastName)}`;
      if (filters.nationalityId) queryParams += `&NationalityId=${filters.nationalityId}`;
      if (filters.email) queryParams += `&Email=${encodeURIComponent(filters.email)}`;
      if (filters.minDateOfBirth) queryParams += `&MinDateOfBirth=${filters.minDateOfBirth}`;
      if (filters.maxDateOfBirth) queryParams += `&MaxDateOfBirth=${filters.maxDateOfBirth}`;
      if (filters.status !== undefined) queryParams += `&Status=${filters.status}`;
    }

    return this.apiService.get<ListResponseModel<UserListModel>>(`${this.endpoint}getusersbyquery?${queryParams}`);
  }

  deactivateUser(userId: number): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}deactivate/${userId}`, {});
  }

  // Kullanıcı engelini kaldır
  activateUser(userId: number): Observable<any> {
    return this.apiService.put<any>(`${this.endpoint}activate/${userId}`, {});
  }
}
