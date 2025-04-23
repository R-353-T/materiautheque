import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CountdownLock } from '../classes/countdown-lock';
import { BadRequestError } from '../classes/bad-request-error';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private static _baseUrl = environment.backend.url;
  
  readonly bucketLock = new CountdownLock("BUCKET"); 

  private static _url(endpoint: string) {
    return `${ApiService._baseUrl}/${endpoint}`;
  }

  private readonly http = inject(HttpClient);

  post<T>(endpoint: string, body: any) {
    return this.http
      .post<T>(ApiService._url(endpoint), body)
      .pipe(catchError(this.handleError));
  }

  patch<T>(endpoint: string, body: any) {
    return this.http
      .patch<T>(ApiService._url(endpoint), body)
      .pipe(catchError(this.handleError));
  }

  get<T>(endpoint: string, params?: HttpParams) {
    return this.http
      .get<T>(ApiService._url(endpoint), { params })
      .pipe(catchError(this.handleError));
  }

  delete<T>(endpoint: string, params?: HttpParams) {
    return this.http
      .delete<T>(ApiService._url(endpoint), { params })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if(error.error instanceof ErrorEvent) {
      // Client side error
      console.error("(API)", error.error.message);
    } else {
      // Server side error
      console.error("(API)", error.status, error.message);

      if(error.status === 400) {
        if(error.error.code === "bad_request") {
          return throwError(() => new BadRequestError(error.error.message, error.error));
        }
      }
    }

    return throwError(() => error);
  }
}
