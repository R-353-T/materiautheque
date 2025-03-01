import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { HeaderService } from '../service/header/header.service';
import { EnumeratorService } from '../service/api/enumerator.service';
import { catchError, tap, throwError } from 'rxjs';
import { IEnumerator } from '../interface/enumerator.interface';

export const enumeratorResolver: ResolveFn<IEnumerator | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('enumeratorId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const enumeratorService = inject(EnumeratorService);

  if (!isNaN(id) && id > 0) {
    headerService.load("enumerator");

    return enumeratorService.get(id).pipe(
      tap(() => headerService.loaded("enumerator")),
      catchError((error) => {
        headerService.loaded("enumerator");
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
