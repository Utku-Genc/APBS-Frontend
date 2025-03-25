import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SingleResponseModel } from '../models/response/single.response.model';
import { Observable } from 'rxjs';
import { SendNotificationModel } from '../models/bildirim/send-notification.model';
import { SendNotificationAllModel } from '../models/bildirim/send-notification-all.model';

@Injectable({
  providedIn: 'root'
})
export class BildirimService {
  private endpoint = 'Bildirim/';
    constructor(private apiService: ApiService) {}

    sendNotification(data: SendNotificationModel): Observable<SingleResponseModel<SendNotificationModel>> {
      return this.apiService.post<SingleResponseModel<SendNotificationModel>>(`${this.endpoint}SendNotification`, data); 
    }
    sendNotificationAll(data: SendNotificationAllModel): Observable<SingleResponseModel<SendNotificationAllModel>> {
      return this.apiService.post<SingleResponseModel<SendNotificationAllModel>>(`${this.endpoint}SendNotificationAll`, data); 
    }
}