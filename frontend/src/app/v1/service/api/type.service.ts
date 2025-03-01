import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { BehaviorSubject, map, Observable, take, tap } from 'rxjs';
import { IResponsePage } from 'src/app/v1/interface/api.interface';
import { IType } from 'src/app/v1/interface/type.interface';
import { TypeEnum } from 'src/app/v1/enum/Type';

@Injectable({
  providedIn: 'root'
})
export class TypeService {

  readonly typeList$: Observable<IType[]|undefined>;
  readonly loaded = signal<boolean>(false);

  private readonly ep = environment.api.type;
  private readonly api = inject(ApiService);
  private readonly typeListSubject = new BehaviorSubject<IType[]|undefined>(undefined);

  get typeList() {
    return this.typeListSubject.value;
  }

  constructor() {
    this.typeList$ = this.typeListSubject.asObservable();
    this.list().subscribe();
  }

  list() {
    return this.api
      .get<IResponsePage<IType>>(this.ep.list)
      .pipe(
        map(response => response.data),
        tap(types => this.typeListSubject.next(types)),
        tap(() => this.loaded.set(true))
      );
  }

  get(id: number) {
    if(this.typeList) {
      const type = this.typeList.find(t => t.id === id);
      if(type) {
        return new Observable<IType>(observer => {
          observer.next(type);
          observer.complete();
        });
      } else {
        return this.list().pipe(map(types => types.find(t => t.id === id)));
      }
    } else {
      return this.list().pipe(map(types => types.find(t => t.id === id)));
    }
  }

  getTypeOf(id?: number) {
    if(id) {
      return this.typeList?.find(t => t.id === id);
    } else {
      return undefined;
    }
  }

  isTypeIsTextInput(typeId: number) {
    return [
      TypeEnum.LABEL,
      TypeEnum.URL,
      TypeEnum.MONEY
    ].includes(typeId);
  }

  isTypeIsNumberInput(typeId: number) {
    return typeId === TypeEnum.NUMBER;
  }

  isTypeIsTextArea(typeId: number) {
    return typeId === TypeEnum.TEXT;
  }

  isTypeIsDateInput(typeId: number) {
    return typeId === TypeEnum.DATE;
  }
}
