import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from 'src/app/v1/service/user/user.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);

  if (userService.user && userService.user.token) {
    const creq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userService.user.token}`
      }
    });

    return next(creq);
  }

  return next(req); 
}