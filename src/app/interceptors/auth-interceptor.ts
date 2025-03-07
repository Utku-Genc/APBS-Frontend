import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // localStorage veya sessionStorage üzerinden tokeni al
  const token = localStorage.getItem('token');

  if (token) {
    // Token varsa Authorization başlığını ekleyerek isteği klonla
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req);
}