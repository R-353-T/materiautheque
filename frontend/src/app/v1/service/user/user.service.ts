import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationService } from '../navigation/navigation.service';
import { IAuthUser } from 'src/app/v1/interface/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public readonly user$: Observable<IAuthUser|null>;
  public isConnected$: Observable<boolean|undefined>; 

  private readonly userSubject = new BehaviorSubject<IAuthUser|null>(null);
  private readonly isConnectedSubject = new BehaviorSubject<boolean|undefined>(undefined);
  private readonly navigationService = inject(NavigationService);

  get user(): IAuthUser|null {
    return this.userSubject.value;
  }

  get isConnected(): boolean|undefined {
    return this.isConnectedSubject.value;
  }

  set isConnected(isConnected: boolean|undefined) {
    this.isConnectedSubject.next(isConnected);
  }

  constructor() {
    this.user$ = this.userSubject.asObservable();
    this.isConnected$ = this.isConnectedSubject.asObservable();
    this.loadFromStorage();
  }

  login(user: IAuthUser): void {
    this.userSubject.next(user);
    this.isConnected = true;
    localStorage.setItem('user', JSON.stringify(user));
  }

  async logout() {
    this.userSubject.next(null);
    this.isConnected = false;
    localStorage.removeItem('user');
    await this.navigationService.goToLogin();
  }

  private loadFromStorage(): void {
    const user = localStorage.getItem('user');

    if (user) {
      this.userSubject.next(JSON.parse(user));
    }
  }

}
