import { inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of, take, tap, timer } from 'rxjs';
import { UserService } from '../../user/user.service';
import { NetworkService } from '../../network/network.service';
import { AppService } from '../../app/app.service';
import { IAuthLoginResponse, IAuthUser } from 'src/app/v1/interface/auth.interface';
import { AuthLoginForm } from 'src/app/v1/form/auth.form';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private failCount = 0;
  private readonly endpoints = environment.api.authentication;
  private readonly apiService = inject(ApiService);
  private readonly userService = inject(UserService);
  private readonly appService = inject(AppService);
  private readonly networkService = inject(NetworkService);

  constructor() {
    this.autoValidate();
  }

  login(form: AuthLoginForm): Observable<IAuthUser> {
    const username = form.username.value;
    const password = form.password.value;

    return this.apiService
      .post<IAuthUser>(this.endpoints.login, { username, password })
      .pipe(tap(user => this.userService.login(user)));
  }

  validate() { 
    if(this.userService.user?.token) {
      return this.apiService
        .post<IAuthLoginResponse>(this.endpoints.validate, null)
        .pipe(
          take(1),
          map(() => {
            this.userService.isConnected = true;
            return true;
          }),
          catchError((error) => {
            this.userService.isConnected = false;
            return of(false);
          })
        );
    } else {
      this.userService.isConnected = false;
      return of(false);
    }
  }

  private autoValidate() {
    timer(10000, 10000).subscribe({
      next: async () => {
        if(this.networkService.isConnected === true) {
          this.validate().subscribe({
            next: async (result) => {
              this.failCount = result ? 0 : this.failCount + 1;
              if(this.userService.isConnected === false && this.failCount > 2) {
                await this.userService.logout();
              }
              this.debug();
            }
          });
        } else {
          this.userService.isConnected = undefined;
          this.debug();
        }

      }
    });
  }

  private debug() {
    if(this.appService.DEVELOPMENT) {
      console.log(
        `[AUTH] User Connected ${this.userService.isConnected}, Fail Count ${this.failCount}`
      );
    }
  }

}
