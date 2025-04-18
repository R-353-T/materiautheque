import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { ApiAuthenticationService } from "../services/api.authentication.service";
import { NetworkService } from "../services/network.service";
import { NavigationService } from "../services/navigation.service";

export const apiAuthenticatedGuard: CanActivateFn = (route, state) => {
    const authService = inject(ApiAuthenticationService);
    const networkService = inject(NetworkService);
    const navigationService = inject(NavigationService);

    const logIn = networkService.status().connected && authService.authenticated();
    
    if(logIn === false) {
        navigationService.goToLogin();    
    }

    return logIn;
};

export const apiUnauthenticatedGuard: CanActivateFn = (route, state) => {
    const authService = inject(ApiAuthenticationService);
    const navigationService = inject(NavigationService);

    if(authService.authenticated()) {
        navigationService.goToHome();
    }

    return authService.authenticated() === false;
};