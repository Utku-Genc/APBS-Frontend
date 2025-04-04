import { Injectable } from '@angular/core';
import { ApiService } from './api.service'; // ApiService'inizi import edin
import { Observable } from 'rxjs';

import { EmailSendModel, EmailSendToUserModel } from '../models/email/email-send.model';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private endpoint = 'Email/'; // API endpoint'inizi belirleyin

  constructor(private apiService: ApiService) {}

    sendEmail(data: EmailSendModel): Observable<any> {
        return this.apiService.post(`${this.endpoint}Send`, data);
    }
    sendEmailToUser(data: EmailSendToUserModel): Observable<any> {
        return this.apiService.post(`${this.endpoint}SendToUser`, data);
    }
}