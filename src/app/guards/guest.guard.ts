import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService,
    private toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    if (!this.authService.isAuthenticated()) {
      return true; // Kullanıcı giriş yapmamışsa giriş sayfasına erişebilir
    } else {
      this.toastService.warning("Giriş yapmışken tekrar giriş yapamazsınız!");
      return this.router.createUrlTree(["/"]); // Ana sayfaya yönlendirme yap
    }
  }
}
