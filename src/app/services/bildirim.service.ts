import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SingleResponseModel } from '../models/response/single.response.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { SendNotificationModel } from '../models/bildirim/send-notification.model';
import { SendNotificationAllModel } from '../models/bildirim/send-notification-all.model';
import { ListResponseModel } from '../models/response/list.response.model';
import { NotificationListModel } from '../models/bildirim/notification-list.model';

@Injectable({
  providedIn: 'root',
})
export class BildirimService {
  private endpoint = 'Bildirim/';
  constructor(private apiService: ApiService) {}
  private notificationUpdated = new BehaviorSubject<boolean>(false);
  notificationUpdated$ = this.notificationUpdated.asObservable();

  getAll(): Observable<ListResponseModel<NotificationListModel>> {
    return this.apiService.get<ListResponseModel<NotificationListModel>>(
      `${this.endpoint}GetAll`
    );
  }

  getMyNotifications(): Observable<ListResponseModel<NotificationListModel>> {
    return this.apiService.get<ListResponseModel<NotificationListModel>>(
      `${this.endpoint}GetMyNotifications`
    );
  }

  sendNotification(
    data: SendNotificationModel
  ): Observable<SingleResponseModel<SendNotificationModel>> {
    return this.apiService.post<SingleResponseModel<SendNotificationModel>>(
      `${this.endpoint}SendNotification`,
      data
    );
  }
  sendNotificationAll(
    data: SendNotificationAllModel
  ): Observable<SingleResponseModel<SendNotificationAllModel>> {
    return this.apiService.post<SingleResponseModel<SendNotificationAllModel>>(
      `${this.endpoint}SendNotificationAll`,
      data
    );
  }
  markAsRead(id: number): Observable<SingleResponseModel<any>> {
    return this.apiService.put<SingleResponseModel<any>>(
      `${this.endpoint}MarkAsRead?id=${id}`,
      {}
    );
  }
  markAllAsRead(): Observable<SingleResponseModel<any>> {
    return this.apiService.put<SingleResponseModel<any>>(
      `${this.endpoint}MarkAllAsRead`,
      {}
    );
  }
  markAsUnRead(id: number): Observable<SingleResponseModel<any>> {
    return this.apiService.put<SingleResponseModel<any>>(
      `${this.endpoint}MarkAsUnRead?id=${id}`,
      {}
    );
  }
  update(data: SendNotificationModel) : Observable<SingleResponseModel<SendNotificationModel>> {
    return this.apiService.put<SingleResponseModel<SendNotificationModel>>(
      `${this.endpoint}UpdateNotification`,
      data
    );
  }
  delete(id: number): Observable<SingleResponseModel<any>> {
    return this.apiService.delete(
      `${this.endpoint}DeleteNotification?id=${id}`
    );
  }

  deleteMyNotification(id: number): Observable<SingleResponseModel<any>> {
    return this.apiService.delete(
      `${this.endpoint}DeleteMyNotification?id=${id}`
    );
  }
  deleteAllMyNotifications(): Observable<SingleResponseModel<any>> {
    return this.apiService.delete(`${this.endpoint}DeleteAllMyNotifications`);
  }

  triggerNotificationUpdate() {
    this.notificationUpdated.next(true);
  }
}
