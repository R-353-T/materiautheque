import { inject, Injectable, Signal, signal } from "@angular/core";
import { MateApiService } from "../mate-api/mate-api.service";
import { IAuthentication, IAuthenticationParsed, IAuthenticationValidated } from "../../core/models/api/IAuth";
import { catchError, map, of, timer } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AuthService {
  readonly isAuthenticatedSignal: Signal<boolean>;
  readonly userSignal: Signal<IAuthenticationParsed | null>;

  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _user = signal<IAuthenticationParsed | null>(null);
  private readonly _mateApiService = inject(MateApiService);

  private set user(user: IAuthenticationParsed) {
    localStorage.setItem("user", JSON.stringify(user));
    this._user.set(user);
    this._isAuthenticated.set(true);
  }

  constructor() {
    this.isAuthenticatedSignal = this._isAuthenticated;
    this.userSignal = this._user;

    const user = localStorage.getItem("user");
    if (user) {
      this.user = JSON.parse(user);
    }

    this.autoValidate();
  }

  async logout() {
    this._isAuthenticated.set(false);
    this._user.set(null);
    localStorage.removeItem("user");
  }

  authenticate(username: string, password: string) {
    return this._mateApiService
      .POST<IAuthentication>(environment.api.authentication.login, { username, password })
      .pipe(map((response) => {
        const user = {
          displayName: response.user_display_name,
          email: response.user_email,
          name: response.user_nicename,
          role: response.user_role,
          token: response.token
        } as IAuthenticationParsed;

        this.user = user;
        return user;
      }));
  }

  validate() {
    return this._mateApiService
      .GET<IAuthenticationValidated>(environment.api.authentication.validate)
      .pipe(
        map((response) => {
          this._isAuthenticated.set(true);
          return true;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  private autoValidate() {
    timer(15000, 15000).subscribe({
      next: async () => {
        const user = this._user();

        if (user) {
          this.validate().subscribe();
        }
      }
    });
  }
}
