import { ResolveFn } from '@angular/router';
import { HeaderService } from '../service/header/header.service';
import { inject } from '@angular/core';
import { TemplateFieldService } from '../service/api/template-field.service';
import { catchError, tap, throwError } from 'rxjs';
import { IField } from '../interface/field.interface';

export const templateFieldResolver: ResolveFn<IField | undefined> = (route, state) => {
  const id = parseInt(route.paramMap.get('fieldId') ?? '0', 10);
  const headerService = inject(HeaderService);
  const templateFieldService = inject(TemplateFieldService);

  if (!isNaN(id) && id > 0) {
    headerService.load("template-field");

    return templateFieldService.get(id).pipe(
      tap(() => headerService.loaded("template-field")),
      catchError((error) => {
        headerService.loaded("template-field");
        return throwError(() => error);
      })
    );
  }

  return undefined;
};
