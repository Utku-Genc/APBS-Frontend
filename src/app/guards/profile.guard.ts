import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { ToastService } from "../services/toast.service";

export class ProfileGuard {
    private router = inject(Router);
    private authService = inject(AuthService);
    private toastService = inject(ToastService)

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const userId = route.paramMap.get('id');

        if (this.authService.isAdmin()) {
            return true;
        }
        this.router.navigate(["login"])
        this.toastService.warning("Bu sayfaya erişmek için yetkiniz yok! yapmanız lazım!")
        return false;

    }
  }