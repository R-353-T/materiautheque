import { inject, Injectable, signal } from "@angular/core";
import { IAuthentication, IUser, IUserResponse, Roles } from "../models/api.user";
import { environment } from "src/environments/environment";
import { LoginForm } from "../models/form.login";
import { ApiService } from "./api.service";
import { map, take } from "rxjs";

@Injectable({ providedIn: "root" })
export class ApiAuthenticationService {
  public static readonly endpoints = {
    login: "jwt-auth/v1/token",
    validate: "jwt-auth/v1/token/validate",
  };

  private readonly _authenticated = signal<boolean>(false);
  private readonly _user = signal<IUser | null>(null);
  private readonly _api = inject(ApiService);

  private set storeUser(user: IUser | null) {
    if (user) {
      this._authenticated.set(true);
      this._user.set(user);
      localStorage.setItem(environment.localStorage.USER, JSON.stringify(user));
    } else {
      this._authenticated.set(false);
      this._user.set(null);
      localStorage.removeItem(environment.localStorage.USER);
    }
  }

  readonly user = this._user.asReadonly();
  readonly authenticated = this._authenticated.asReadonly();

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    const user = localStorage.getItem(environment.localStorage.USER);

    if (user) {
      this._user.set(JSON.parse(user));
    }
  }

  logout() {
    this.storeUser = null;
  }

  login(form: LoginForm) {
    const body: IAuthentication = {
      username: form.inputs[0].control.value,
      password: form.inputs[1].control.value,
    };

    return this._api
      .post<IUserResponse>(ApiAuthenticationService.endpoints.login, body)
      .pipe(
        take(1),
        map((res) => {
          const user = {
            displayName: res.user_display_name,
            email: res.user_email,
            name: res.user_nicename,
            role: Roles[res.user_role],
            token: res.token,
          } as IUser;

          this.storeUser = user;
        }),
      );
  }
}
