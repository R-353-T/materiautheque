import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { FormService } from '../service/api/form.service';
import { HeaderService } from '../service/header/header.service';
import { catchError, tap, throwError } from 'rxjs';
import { IForm } from '../interface/form.interface';

export const formResolver: ResolveFn<IForm | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('formId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const apiFormService = inject(FormService);

  if (!isNaN(id) && id > 0) {
    headerService.load("form");

    return apiFormService.get(id).pipe(
      tap(() => headerService.loaded("form")),
      catchError((error) => {
        headerService.loaded("form")
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
