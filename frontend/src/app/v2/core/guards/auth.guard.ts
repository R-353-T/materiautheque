import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "../../services/auth/auth.service";
import { NetworkService } from "../../services/network/network.service";
import { NavigatorService } from "../../services/navigator/navigator.service";

export const unAuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const networkService = inject(NetworkService);
    const navigatorService = inject(NavigatorService);
    const status = networkService.statusSignal();
    const user = authService.userSignal();

    if (status.connected && user) {
        navigatorService.home();
        return false;
    } else {
        return true;
    }
};

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const networkService = inject(NetworkService);
    const navigatorService = inject(NavigatorService);
    const status = networkService.statusSignal();
    const user = authService.userSignal();

    if (status.connected && user) {
        return true;
    } else {
        navigatorService.auth();
        return false;
    }
};