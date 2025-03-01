import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  public isLoading$: Observable<boolean>;
  public title$: Observable<string>;

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(false);
  private readonly titleSubject = new BehaviorSubject<string>('');

  private loadingMap: { [key: string]: boolean } = {};

  public set title(title: string) {
    this.titleSubject.next(title);
  }

  public get title() {
    return this.titleSubject.value;
  }

  public load(key: string) {
    console.log(`[HeaderService] Loading '${key}'`);
    this.loadingMap[key] = true;
    this.isLoadingSubject.next(true);
  }

  public loaded(key: string) {
    console.log(`[HeaderService] Loaded '${key}'`);
    this.loadingMap[key] = false;
    this.isLoadingSubject.next(Object.values(this.loadingMap).some((value) => value === true));
  }
  
  constructor() {
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.title$ = this.titleSubject.asObservable();
  }
}
