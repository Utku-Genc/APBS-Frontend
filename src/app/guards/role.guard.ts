import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles']; // Route kısmında data ile gönderilen roller
    const userRoles: string[] = this.authService.getUserRoles(); // Kullanıcının rolleri

    if (userRoles.some(role => expectedRoles.includes(role))) {
      return true; // Kullanıcı rolle sahipse erişime izin
    } else {
      this.router.navigate(['/unauthorized']); // Yetkisi yoksa yetkisiz sayfasına yönlendir
      return false;
    }
  }
}
