import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ApiService } from "../services/api.service";
import { ApiAuthenticationService } from "../services/api.authentication.service";
import { catchError, throwError } from "rxjs";
import { TooManyRequestError } from "../classes/too-many-request-error";

export const ApiBucketInterceptor: HttpInterceptorFn = (req, next) => {
    const apiService = inject(ApiService);
    const isLoginRequest = req.url.includes(ApiAuthenticationService.endpoints.login);
    const isValidateRequest = req.url.includes(ApiAuthenticationService.endpoints.validate);

    if (apiService.bucketLock.locked()) {
        const message = (isLoginRequest || isValidateRequest)
            ? `✋ Limite de tentatives atteinte (réessayer dans $1 secondes)`
            : `✋ Vous avez dépassé la limite de requêtes autorisées (patientez $1 secondes)`;
        return throwError(() => new TooManyRequestError(message, apiService.bucketLock));
    }

    return next(req)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.headers) {
                    const retryAfter = error.headers.get("Retry-After");

                    if (retryAfter !== null) {
                        const duration = parseInt(retryAfter, 10);
                        if (isNaN(duration) === false) {
                            apiService.bucketLock.lockFor(duration + 1);
                            console.warn(
                                "(API) Bucket Interceptor Triggered (jailed during " +
                                    duration + " seconds)",
                            );

                            const message = (isLoginRequest || isValidateRequest)
                                ? `✋ Limite de tentatives atteinte (réessayer dans $1 secondes)`
                                : `✋ Vous avez dépassé la limite de requêtes autorisées (patientez $1 secondes)`;
                            return throwError(() => new TooManyRequestError(message, apiService.bucketLock));
                        }
                    }
                }

                return throwError(() => error);
            })
        );
};
