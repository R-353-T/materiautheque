import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../service/user/user.service';
import { NavigationService } from '../service/navigation/navigation.service';
import { AuthService } from '../service/api/auth/auth.service';
import { map, of } from 'rxjs';
import { NetworkService } from '../service/network/network.service';

export const unauthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const authService = inject(AuthService);
  const networkService = inject(NetworkService);
  const navigationService = inject(NavigationService);

  if(networkService.isConnected === true && userService.isConnected === undefined || networkService.isConnected === undefined) {
      return authService.validate().pipe(map((result) => {
          if(result === true) {
            navigationService.goToHome();
          }

          return !result;
      }));
  } else {
    if(userService.isConnected === true) {
      navigationService.goToHome();
    }

    return of(userService.isConnected !== undefined ? !userService.isConnected : true);
  }
};
