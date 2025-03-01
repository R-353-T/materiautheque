import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, take, throwError } from 'rxjs';
import { BadRequestError } from 'src/app/classes/errors/BadRequestError';
import { LockTimeout } from 'src/app/classes/LockTimeout';
import { HttpParameters } from 'src/app/v1/interface/api.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly retryAfterLock = new LockTimeout('RETRY_AFTER_LOCK');

  private readonly baseUrl = environment.api.baseUrl;
  private readonly http = inject(HttpClient);

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        take(1),
        catchError(this.consoleHandleError)
      );
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this.http
      .patch<T>(`${this.baseUrl}/${endpoint}`, body)
      .pipe(
        take(1),
        catchError(this.consoleHandleError)
      );
  }

  get<T>(endpoint: string, params?: HttpParameters): Observable<T> {
    return this.http
      .get<T>(`${this.baseUrl}/${endpoint}` , { params: this.buildParameters(params) })
      .pipe(
        take(1),
        catchError(this.consoleHandleError)
      );
  }

  delete<T>(endpoint: string, params?: HttpParameters): Observable<T> {
    return this.http
      .delete<T>(`${this.baseUrl}/${endpoint}`, { params: this.buildParameters(params) })
      .pipe(
        take(1),
        catchError(this.consoleHandleError)
      );
  }

  private buildParameters(params?: HttpParameters) {
    if (params) {
      return new HttpParams({
        fromObject: Object.entries(params)
                          .reduce((acc, [key, value]) => { 
                            if(value !== undefined && value !== null) {
                              acc[key] = String(value);
                            }
                            return acc;
                          },
                          {} as { [key: string]: string })
      });
    }

    return undefined;
  }

  private consoleHandleError(error: HttpErrorResponse) {
    if (ApiService.isClientSideError(error)) {
      console.warn(`[API] Client-side error: ${error.error.message}`);
    } else {
      if(ApiService.isBadRequest(error)) {
        console.error(`[API] Bad Request`, error.error.data.params);
        return throwError(() => new BadRequestError(error.error.message, error.error.data.params));
      } else {
        console.error(`[API] Server-side error: ${error.status} - ${error.message}`);
      }
    }
    return throwError(() => error);
  }

  public static isClientSideError(error: HttpErrorResponse) {
    return error.error instanceof ErrorEvent;
  }

  public static isBadRequest(error: HttpErrorResponse) {
    return ApiService.isClientSideError(error) === false 
      && error.status === 400
      && error.error?.code === "bad_request";
  }
}
