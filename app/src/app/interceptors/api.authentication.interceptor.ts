import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ApiAuthenticationService } from "../services/api.authentication.service";

export const ApiAuthenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(ApiAuthenticationService);
    
    if(authService.authenticated()) {
        const request = req.clone({
            setHeaders: {
                Authorization: `Bearer ${authService.user()?.token}`
            }
        });

        return next(request);
    }

    return next(req);
};