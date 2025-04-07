import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { take } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class MateApiService {
  private readonly httpClient = inject(HttpClient);

  POST<T>(endpoint: string, body: any) {
    return this.httpClient
      .post<T>(this.URL(endpoint), body)
      .pipe(take(1));
  }

  PATCH<T>(endpoint: string, body: any) {
    return this.httpClient
      .patch<T>(this.URL(endpoint), body)
      .pipe(take(1));
  }

  GET<T>(endpoint: string, params?: HttpParams) {
    return this.httpClient
      .get<T>(this.URL(endpoint), { params })
      .pipe(take(1));
  }

  DELETE<T>(endpoint: string, params?: HttpParams) {
    return this.httpClient
      .delete<T>(this.URL(endpoint), { params })
      .pipe(take(1));
  }

  private URL(endpoint: string) {
    return `${environment.api.baseUrl}/${endpoint}`;
  }
}
