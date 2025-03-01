import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { TooManyRequestError } from "src/app/classes/errors/TooManyRequestError";
import { ApiService } from "src/app/v1/service/api/api.service";
import { environment } from "src/environments/environment";

export const BucketInterceptor: HttpInterceptorFn = (req, next) => {
    const apiService = inject(ApiService);

    if(apiService.retryAfterLock.isLocked) {
        if(req.url.includes(environment.api.authentication.login) || req.url.includes(environment.api.authentication.validate)) {
            return throwError(() => new TooManyRequestError(`Trop de tentatives, veuillez réessayer dans ${apiService.retryAfterLock.remainingTime} secondes.`));
        } else {
            return throwError(() => new TooManyRequestError(`Trop de requêtes, veuillez réessayer dans ${apiService.retryAfterLock.remainingTime} secondes.`));
        }
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if(error.headers) {
                const retryAfter = error.headers.get("Retry-After");
                
                if(retryAfter !== null) {
                    const duration = parseInt(retryAfter, 10);
                    if(!isNaN(duration)) {
                        apiService.retryAfterLock.lock(duration + 1);
                        console.warn("Bucket Interceptor: Locked for " + duration + " seconds.");
                    }
                }
            }

            return throwError(() => error);
        }),
      );

}