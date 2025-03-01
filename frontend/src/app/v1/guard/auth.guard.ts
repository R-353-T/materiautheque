import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavigationService } from '../service/navigation/navigation.service';
import { AuthService } from '../service/api/auth/auth.service';
import { Observable, of, tap } from 'rxjs';
import { UserService } from '../service/user/user.service';
import { NetworkService } from '../service/network/network.service';

export const authGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const networkService = inject(NetworkService);
  const navigationService = inject(NavigationService);
  
  if(networkService.isConnected === true && userService.isConnected === undefined) {
    return authService.validate().pipe(tap((result) => {
        if(result === false) {
          navigationService.goToLogin();
        }
    }));
  } else {
    if(userService.isConnected === false) {
      navigationService.goToLogin();
    }

    return of(userService.isConnected ?? true);
  }
};
