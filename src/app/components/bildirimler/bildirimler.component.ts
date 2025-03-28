import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NotificationListModel } from '../../models/bildirim/notification-list.model';
import { BildirimService } from '../../services/bildirim.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'utk-bildirimler',
  imports: [CommonModule],
  templateUrl: './bildirimler.component.html',
  styleUrl: './bildirimler.component.css',
})
export class BildirimlerComponent implements OnInit {
  private bildirimService = inject(BildirimService);
  private toastService = inject(ToastService);

  notifications: NotificationListModel[] = [];

  ngOnInit(): void {
    this.getMyNotifications();
  }

  getMyNotifications() {
    this.bildirimService.getMyNotifications().subscribe((response) => {
      this.notifications = response.data;
    });
  }
  markAsRead(id: number) {
    this.bildirimService.markAsRead(id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        }
      },
    });
  }
  markAllAsRead() {
    this.bildirimService.markAllAsRead().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        }
      },
    });
  }
  markAsUnRead(id: number) {
    this.bildirimService.markAsUnRead(id).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.toastService.success(response.message);
          this.getMyNotifications();
          this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
        }
      },
    });
  }

  deleteNotification(id: number) {
    this.bildirimService.delete(id).subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.getMyNotifications();
        this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
      },
    });
  }
  deleteAllNotifications() {
    this.bildirimService.deleteAllMyNotifications().subscribe({
      next: (response) => {
        this.toastService.success(response.message);
        this.getMyNotifications();
        this.bildirimService.triggerNotificationUpdate(); // Navbar'ı güncellemek için tetikleme
      },
    });
  }
  
}
