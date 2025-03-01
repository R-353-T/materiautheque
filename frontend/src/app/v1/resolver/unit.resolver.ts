import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HeaderService } from '../service/header/header.service';
import { UnitService } from '../service/api/unit.service';
import { catchError, tap, throwError } from 'rxjs';
import { IUnit } from '../interface/unit.interface';

export const unitResolver: ResolveFn<IUnit | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('unitId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const unitService = inject(UnitService);

  if (!isNaN(id) && id > 0) {
    headerService.load("unit");

    return unitService.get(id).pipe(
      tap(() => headerService.loaded("unit")),
      catchError((error) => {
        headerService.loaded("unit");
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
