import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'utk-unauthorized',
  imports: [],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent implements OnInit, OnDestroy {

  private router = inject(Router);
  private toastService = inject(ToastService);

  countdown: number = 5;
  interval: any;
  ngOnInit(): void {
    this.startCountdown();
  }
  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  startCountdown(): void {
    this.interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.redirectToHomepage();
      }
    }, 1000);
  }

  redirectToHomepage(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.toastService.info("Anasayfaya yönlendirildiniz!")
    this.router.navigate(['/']);
  }
}